import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';
import { 
  Lock, 
  Mail, 
  User as UserIcon, 
  UserPlus, 
  AlertCircle, 
  ShieldCheck, 
  SlidersHorizontal,
  Eye, 
  EyeOff, 
  Calendar 
} from 'lucide-react';
import ConfirmModal from '../../../components/ConfirmModal';
import SocialAuthButtons from '../../../components/SocialAuthButtons';

interface RegisterFormValues {
  name: string;
  email: string;
  birthDate: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
  role: string;
}

interface RegisterViewProps {
  onNavigate: (view: 'login' | 'register' | 'dashboard' | 'users') => void;
}

export function RegisterView({ onNavigate }: RegisterViewProps) {
  const { register: registerAuth } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const [pendingPayload, setPendingPayload] = useState<any | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Hook useForm en mode: 'onChange' para resetear errores al instante
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      birthDate: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
      role: 'usuario',
    },
  });

  const passwordWatch = watch('password');
  const nameWatch = watch('name');

  const today = new Date();
  const maxDateStr = today.toISOString().split('T')[0];
  const minDate = new Date();
  minDate.setFullYear(today.getFullYear() - 110);
  const minDateStr = minDate.toISOString().split('T')[0];

  const toTitleCase = (str: string) => {
    return str
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handlePreSubmit = (data: RegisterFormValues) => {
    setServerError(null);
    const { confirmPassword, termsAccepted, ...rest } = data;
    
    const payload = {
      ...rest,
      name: toTitleCase(rest.name),
      email: rest.email.trim().toLowerCase(),
      password: rest.password.trim(),
    };

    setPendingPayload(payload);
    setIsConfirmOpen(true);
  };

  const handleExecuteConfirmedSubmit = async () => {
    if (!pendingPayload) return;
    setIsProcessing(true);
    const result = await registerAuth(pendingPayload);
    setIsProcessing(false);
    setIsConfirmOpen(false);
    if (result.success) {
      onNavigate('dashboard');
    } else {
      setServerError(result.message || 'Error al registrar usuario en la base de datos');
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 transition-colors">
      
      {/* Badge identificador del sistema */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Sistema 2: useState Navigation</span>
        </span>
        <span className="text-[11px] text-slate-400 font-mono">currentView: "register"</span>
      </div>

      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
          <UserPlus className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Crear Cuenta</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Formulario validado conforme a especificaciones universales
        </p>
      </div>

      {serverError && (
        <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(handlePreSubmit)} className="space-y-3.5">
        
        {/* Nombre Completo con filtro de tipo de caracteres */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center space-x-1">
            <UserIcon className="w-3.5 h-3.5 text-slate-400" />
            <span>Nombre Completo *</span>
          </label>
          <input
            type="text"
            placeholder="María Florencia López"
            {...register('name', {
              required: 'El nombre es obligatorio.',
              minLength: { value: 3, message: 'Debe contener al menos 3 caracteres.' },
              maxLength: { value: 50, message: 'No puede exceder 50 caracteres.' },
              pattern: {
                value: /^[A-Za-zÁÉÍÓÚáéíóúñÑüÜ\s]+$/,
                message: 'Solo se permiten letras y espacios (sin números ni símbolos).',
              },
            })}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-white ${
              errors.name
                ? 'border-rose-400 dark:border-rose-500'
                : 'border-slate-300 dark:border-slate-700 focus:ring-emerald-200'
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center space-x-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{errors.name.message}</span>
            </p>
          )}
        </div>

        {/* Correo Electrónico */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center space-x-1">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <span>Correo Electrónico *</span>
          </label>
          <input
            type="email"
            placeholder="maria@ejemplo.com"
            {...register('email', {
              required: 'El correo electrónico es obligatorio.',
              maxLength: { value: 80, message: 'No puede exceder 80 caracteres.' },
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Formato de correo no válido. Debe incluir dominio y extensión.',
              },
            })}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-white ${
              errors.email
                ? 'border-rose-400 dark:border-rose-500'
                : 'border-slate-300 dark:border-slate-700 focus:ring-emerald-200'
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center space-x-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{errors.email.message}</span>
            </p>
          )}
        </div>

        {/* Fecha de Nacimiento */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Fecha de Nacimiento * (Mayor de 18 años)</span>
          </label>
          <input
            type="date"
            max={maxDateStr}
            min={minDateStr}
            {...register('birthDate', {
              required: 'La fecha de nacimiento es requerida.',
              validate: (val) => {
                if (!val) return 'La fecha es obligatoria.';
                const birth = new Date(val);
                if (isNaN(birth.getTime())) return 'Fecha inválida.';
                
                if (birth > today) return 'La fecha no puede ser en el futuro.';
                if (birth < minDate) return 'La fecha excede el límite máximo de 110 años.';

                let age = today.getFullYear() - birth.getFullYear();
                const monthDiff = today.getMonth() - birth.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                  age--;
                }

                if (age < 18) {
                  return `Debes ser mayor de 18 años para registrarte (Edad calculada: ${age} años).`;
                }

                return true;
              },
            })}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-white ${
              errors.birthDate
                ? 'border-rose-400 dark:border-rose-500'
                : 'border-slate-300 dark:border-slate-700 focus:ring-emerald-200'
            }`}
          />
          {errors.birthDate && (
            <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center space-x-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{errors.birthDate.message}</span>
            </p>
          )}
        </div>

        {/* Contraseña con complejidad y botón de visibilidad */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center space-x-1">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Contraseña * (Complejidad requerida)</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Mínimo 8 car. (Mayús, minús, núm, símb)"
              {...register('password', {
                required: 'La contraseña es obligatoria.',
                minLength: { value: 8, message: 'Debe contener al menos 8 caracteres.' },
                maxLength: { value: 64, message: 'No puede exceder 64 caracteres.' },
                validate: (val) => {
                  const hasUpper = /[A-Z]/.test(val);
                  const hasLower = /[a-z]/.test(val);
                  const hasNumber = /\d/.test(val);
                  const hasSpecial = /[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]/.test(val);
                  
                  if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
                    return 'Debe incluir al menos 1 mayúscula, 1 minúscula, 1 número y 1 símbolo (@$!%*?#).';
                  }

                  const forbidden = ['password', '123456', 'admin123', 'qwerty'];
                  if (forbidden.some((w) => val.toLowerCase().includes(w))) {
                    return 'No uses secuencias obvias o palabras comunes como "password" o "123456".';
                  }

                  if (nameWatch && nameWatch.length >= 3 && val.toLowerCase().includes(nameWatch.toLowerCase().trim())) {
                    return 'La contraseña no puede contener el nombre del usuario.';
                  }

                  return true;
                },
              })}
              className={`w-full pl-3.5 pr-10 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-white ${
                errors.password
                  ? 'border-rose-400 dark:border-rose-500'
                  : 'border-slate-300 dark:border-slate-700 focus:ring-emerald-200'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
              title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center space-x-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{errors.password.message}</span>
            </p>
          )}
        </div>

        {/* Confirmar Contraseña */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Confirmar Contraseña *</span>
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Repite tu contraseña exactamente"
              {...register('confirmPassword', {
                required: 'Debes confirmar tu contraseña.',
                validate: (value) =>
                  value === passwordWatch || 'Las contraseñas no coinciden.',
              })}
              className={`w-full pl-3.5 pr-10 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-white ${
                errors.confirmPassword
                  ? 'border-rose-400 dark:border-rose-500'
                  : 'border-slate-300 dark:border-slate-700 focus:ring-emerald-200'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
              title={showConfirmPassword ? 'Ocultar confirmación' : 'Ver confirmación'}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center space-x-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{errors.confirmPassword.message}</span>
            </p>
          )}
        </div>

        {/* Checkbox Términos */}
        <div className="pt-1">
          <label className="flex items-start space-x-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              {...register('termsAccepted', {
                validate: (val) => val === true || 'Debes aceptar los términos y condiciones de servicio.',
              })}
              className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:bg-slate-800"
            />
            <span>
              He leído y acepto los <strong>Términos de Servicio</strong> y la política de privacidad de la base de datos SQL. *
            </span>
          </label>
          {errors.termsAccepted && (
            <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center space-x-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{errors.termsAccepted.message}</span>
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-semibold rounded-xl text-sm shadow-md transition disabled:opacity-50 mt-3"
        >
          {isSubmitting ? 'Validando y registrando en SQL...' : 'Crear Cuenta y Conectar'}
        </button>
      </form>

      {/* Botones de autenticación social (Google GIS, Facebook, X, Discord) */}
      <SocialAuthButtons
        onSuccessRedirect={() => onNavigate('dashboard')}
        onErrorNotification={(msg) => setServerError(msg)}
        text="signup_with"
        promptText="o regístrate con"
      />

      <div className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
        ¿Ya tienes una cuenta registrada?{' '}
        <button
          onClick={() => onNavigate('login')}
          className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
          type="button"
        >
          Inicia sesión aquí
        </button>
      </div>

      {/* Modal de confirmación para crear cuenta */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="¿Confirmar Registro de Cuenta?"
        message={`¿Estás seguro de registrar tu cuenta con el correo "${pendingPayload?.email}" en la base de datos SQL?`}
        confirmText="Sí, registrarme"
        cancelText="Volver y revisar"
        isLoading={isProcessing}
        onConfirm={handleExecuteConfirmedSubmit}
        onCancel={() => setIsConfirmOpen(false)}
      />

    </div>
  );
}

export default RegisterView;
