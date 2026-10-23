import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  X, 
  UserPlus, 
  Save, 
  AlertCircle, 
  Shield, 
  Mail, 
  User as UserIcon, 
  Lock, 
  CheckCircle2, 
  Eye, 
  EyeOff 
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { User } from '../types';
import ConfirmModal from './ConfirmModal';

interface FormData {
  name: string;
  email: string;
  password?: string;
  role: string;
  status: 'activo' | 'inactivo';
}

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<{ success: boolean; message?: string }>;
  initialData?: User | null;
}

export function UserFormModal({ isOpen, onClose, onSubmit, initialData = null }: UserFormModalProps) {
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';
  const isEditing = Boolean(initialData);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Estados para modal de confirmación antes de guardar/subir
  const [pendingPayload, setPendingPayload] = useState<any | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Hook useForm configurado en mode: 'onChange' para resetear errores al corregir
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'usuario',
      status: 'activo',
    },
  });

  const watchName = watch('name');

  useEffect(() => {
    if (initialData) {
      setValue('name', initialData.name || '');
      setValue('email', initialData.email || '');
      setValue('password', '');
      setValue('role', initialData.role || 'usuario');
      setValue('status', initialData.status || 'activo');
    } else {
      reset({
        name: '',
        email: '',
        password: '',
        role: 'usuario',
        status: 'activo',
      });
    }
    setShowPassword(false);
    setIsConfirmOpen(false);
    setPendingPayload(null);
  }, [initialData, setValue, reset, isOpen]);

  if (!isOpen) return null;

  // Normalización a Title Case (capitalización de nombres propios)
  const toTitleCase = (str: string) => {
    return str
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Paso 1: Pre-validación. Al pasar las validaciones del formulario, solicita confirmación explícita
  const handlePreSubmit = (data: FormData) => {
    const payload: any = {
      name: toTitleCase(data.name),
      email: data.email.trim().toLowerCase(),
      role: data.role,
      status: data.status,
    };

    if (isEditing) {
      if (data.password && data.password.trim().length > 0) {
        payload.password = data.password.trim();
      }
    } else {
      payload.password = data.password?.trim();
    }

    setPendingPayload(payload);
    setIsConfirmOpen(true);
  };

  // Paso 2: Ejecución confirmada en la BBDD SQL
  const handleExecuteConfirmedSubmit = async () => {
    if (!pendingPayload) return;
    setIsProcessing(true);
    const result = await onSubmit(pendingPayload);
    setIsProcessing(false);
    setIsConfirmOpen(false);
    if (result && result.success) {
      reset();
      setPendingPayload(null);
      onClose();
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
          
          {/* Cabecera del Modal */}
          <div className="bg-slate-900 dark:bg-slate-950 px-6 py-4 flex items-center justify-between text-white border-b border-slate-800">
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <Save className="w-5 h-5 text-indigo-400" />
              ) : (
                <UserPlus className="w-5 h-5 text-emerald-400" />
              )}
              <h3 className="font-bold text-sm sm:text-base">
                {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Formulario implementado con useForm y validaciones universales */}
          <form onSubmit={handleSubmit(handlePreSubmit)} className="p-6 space-y-4">
            
            {/* Campo Nombre Completo */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center space-x-1">
                  <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>Nombre Completo *</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">Solo letras (3-50 car.)</span>
              </div>
              <input
                type="text"
                placeholder="Ej: Juan Manuel Pérez"
                {...register('name', {
                  required: 'El nombre es obligatorio.',
                  minLength: { value: 3, message: 'El nombre debe tener al menos 3 caracteres.' },
                  maxLength: { value: 50, message: 'El nombre no puede exceder 50 caracteres.' },
                  pattern: {
                    value: /^[A-Za-zÁÉÍÓÚáéíóúñÑüÜ\s]+$/,
                    message: 'Filtro estricto: Solo letras y espacios. Sin números ni símbolos especiales.',
                  },
                })}
                className={`w-full px-3.5 py-2 rounded-xl border text-sm transition focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-white ${
                  errors.name
                    ? 'border-rose-400 focus:ring-rose-200 dark:border-rose-500'
                    : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-200 focus:border-indigo-600'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.name.message}</span>
                </p>
              )}
            </div>

            {/* Campo Correo Electrónico */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Correo Electrónico *</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">Formato RFC (máx 80)</span>
              </div>
              <input
                type="email"
                placeholder="usuario@dominio.com"
                {...register('email', {
                  required: 'El correo electrónico es obligatorio.',
                  maxLength: { value: 80, message: 'El correo no puede exceder 80 caracteres.' },
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Formato de correo no válido. Debe incluir @ y dominio completo.',
                  },
                })}
                className={`w-full px-3.5 py-2 rounded-xl border text-sm transition focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-white ${
                  errors.email
                    ? 'border-rose-400 focus:ring-rose-200 dark:border-rose-500'
                    : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-200 focus:border-indigo-600'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.email.message}</span>
                </p>
              )}
            </div>

            {/* Campo Contraseña */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center space-x-1">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Contraseña {isEditing ? '(Opcional si no se modifica)' : '*'}</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">Min 8 car., Mayús, Núm, Símbolo</span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={isEditing ? 'Dejar en blanco para conservar actual' : '••••••••'}
                  {...register('password', {
                    required: isEditing ? false : 'La contraseña es obligatoria.',
                    minLength: {
                      value: 8,
                      message: 'La contraseña debe tener un mínimo de 8 caracteres.',
                    },
                    maxLength: {
                      value: 64,
                      message: 'La contraseña no puede exceder los 64 caracteres.',
                    },
                    validate: (val) => {
                      if (isEditing && (!val || val.trim().length === 0)) return true;
                      if (!val) return 'La contraseña es obligatoria.';

                      const blackList = ['12345678', 'password', 'admin123', 'qwerty123', 'admin', 'password123'];
                      if (blackList.includes(val.toLowerCase())) {
                        return 'Contraseña insegura o predecible en lista negra. Elige una más robusta.';
                      }

                      if (watchName && watchName.trim().length >= 3) {
                        const nameParts = watchName.toLowerCase().split(/\s+/);
                        for (const part of nameParts) {
                          if (part.length >= 3 && val.toLowerCase().includes(part)) {
                            return 'La contraseña no debe contener partes de tu nombre o apellido.';
                          }
                        }
                      }

                      const hasUpper = /[A-Z]/.test(val);
                      const hasLower = /[a-z]/.test(val);
                      const hasNum = /[0-9]/.test(val);
                      const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(val);

                      if (!hasUpper || !hasLower || !hasNum || !hasSymbol) {
                        return 'Debe incluir mayúsculas, minúsculas, números y al menos un símbolo especial.';
                      }

                      return true;
                    },
                  })}
                  className={`w-full pl-3.5 pr-10 py-2 rounded-xl border text-sm transition focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-white ${
                    errors.password
                      ? 'border-rose-400 focus:ring-rose-200 dark:border-rose-500'
                      : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-200 focus:border-indigo-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                  title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.password.message}</span>
                </p>
              )}
            </div>

            {/* Selector de Rol y Estado */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center space-x-1">
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  <span>Rol *</span>
                </label>
                <select
                  disabled={!isAdmin}
                  {...register('role', {
                    required: 'Debes seleccionar un rol.',
                    validate: (val) => ['admin', 'usuario', 'invitado'].includes(val) || 'Rol no válido.',
                  })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:opacity-60 disabled:bg-slate-100 dark:disabled:bg-slate-800/50 disabled:cursor-not-allowed"
                >
                  <option value="usuario">Usuario</option>
                  <option value="admin">Admin</option>
                  <option value="invitado">Invitado</option>
                </select>
                {!isAdmin && (
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Solo modificable por Admin</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Estado *</span>
                </label>
                <select
                  disabled={!isAdmin}
                  {...register('status', {
                    required: 'Debes seleccionar un estado.',
                    validate: (val) => ['activo', 'inactivo'].includes(val) || 'Estado no válido.',
                  })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:opacity-60 disabled:bg-slate-100 dark:disabled:bg-slate-800/50 disabled:cursor-not-allowed"
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
                {!isAdmin && (
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Solo modificable por Admin</span>
                )}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 rounded-xl shadow-md transition"
              >
                {isSubmitting ? 'Validando...' : isEditing ? 'Guardar Cambios' : 'Registrar en SQL'}
              </button>
            </div>

          </form>

        </div>
      </div>

      {/* Modal de confirmación explícita para Crear/Modificar */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title={isEditing ? '¿Confirmar Modificación de Usuario?' : '¿Confirmar Registro de Usuario?'}
        message={
          isEditing
            ? `¿Estás seguro de que deseas guardar y aplicar los cambios para el usuario "${pendingPayload?.name}" (${pendingPayload?.email}) en la base de datos SQL?`
            : `¿Estás seguro de que deseas dar de alta y registrar a "${pendingPayload?.name}" (${pendingPayload?.email}) en la base de datos SQL?`
        }
        confirmText={isEditing ? 'Sí, guardar cambios' : 'Sí, registrar usuario'}
        cancelText="Volver y revisar"
        variant="primary"
        isLoading={isProcessing}
        onConfirm={handleExecuteConfirmedSubmit}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </>
  );
}

export default UserFormModal;
