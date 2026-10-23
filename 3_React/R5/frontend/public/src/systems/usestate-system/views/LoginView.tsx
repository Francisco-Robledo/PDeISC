import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';
import { Lock, Mail, LogIn, AlertCircle, Sparkles, SlidersHorizontal, Eye, EyeOff } from 'lucide-react';
import SocialAuthButtons from '../../../components/SocialAuthButtons';

interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginViewProps {
  onNavigate: (view: 'login' | 'register' | 'dashboard' | 'users') => void;
}

export function LoginView({ onNavigate }: LoginViewProps) {
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanPassword = data.password.trim();

    const result = await login(cleanEmail, cleanPassword);
    if (result.success) {
      onNavigate('dashboard');
    } else {
      setServerError(result.message || 'Error al iniciar sesión');
    }
  };

  const fillCredentials = (email: string, pass: string) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', pass, { shouldValidate: true });
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 transition-colors">
      
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Sistema 2: useState Navigation</span>
        </span>
        <span className="text-[11px] text-slate-400 font-mono">currentView: "login"</span>
      </div>

      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
          <LogIn className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Iniciar Sesión</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Conexión con BBDD SQL (3FN) y JWT</p>
      </div>

      {serverError && (
        <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Formulario con useForm */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center space-x-1">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <span>Correo Electrónico *</span>
          </label>
          <input
            type="email"
            placeholder="admin@sistema.com"
            {...register('email', {
              required: 'El correo electrónico es requerido.',
              maxLength: { value: 80, message: 'No puede exceder 80 caracteres.' },
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Ingresa un correo electrónico válido.',
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

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center space-x-1">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Contraseña *</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('password', {
                required: 'La contraseña es requerida.',
                minLength: {
                  value: 6,
                  message: 'La contraseña debe tener al menos 6 caracteres.',
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-semibold rounded-xl text-sm shadow-md transition disabled:opacity-50"
        >
          {isSubmitting ? 'Verificando con la BBDD SQL...' : 'Ingresar al Sistema'}
        </button>
      </form>

      {/* Botones de autenticación social (Google GIS, Facebook, X, Discord) */}
      <SocialAuthButtons
        onSuccessRedirect={() => onNavigate('dashboard')}
        onErrorNotification={(msg) => setServerError(msg)}
        text="signin_with"
        promptText="o ingresa con"
      />

      {/* Credenciales de prueba */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-2 flex items-center space-x-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>Credenciales precargadas (BBDD SQL 3FN):</span>
        </p>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <button
            type="button"
            onClick={() => fillCredentials('admin@sistema.com', 'Admin123!')}
            className="p-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/70 rounded-xl text-left transition shadow-xs"
          >
            <div className="font-bold text-slate-900 dark:text-white">Admin</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">admin@sistema.com</div>
          </button>
          <button
            type="button"
            onClick={() => fillCredentials('alumno@sistema.com', 'User123!')}
            className="p-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/70 rounded-xl text-left transition shadow-xs"
          >
            <div className="font-bold text-slate-900 dark:text-white">Usuario</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">alumno@sistema.com</div>
          </button>
        </div>
      </div>

      <div className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
        ¿No tienes una cuenta aún?{' '}
        <button
          onClick={() => onNavigate('register')}
          className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
          type="button"
        >
          Regístrate aquí
        </button>
      </div>

    </div>
  );
}

export default LoginView;
