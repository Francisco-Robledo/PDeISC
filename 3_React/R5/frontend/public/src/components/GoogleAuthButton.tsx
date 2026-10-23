import React, { useState } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import useAuth from '../hooks/useAuth';
import useTheme from '../hooks/useTheme';
import { AlertCircle, Loader2 } from 'lucide-react';
import { User } from '../types';

interface GoogleAuthButtonProps {
  onSuccessRedirect: (user: User) => void;
  onErrorNotification?: (msg: string) => void;
  text?: 'signin_with' | 'signup_with' | 'continue_with';
  promptText?: string;
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  onSuccessRedirect,
  onErrorNotification,
  text = 'signin_with',
  promptText = 'O continuar con'
}) => {
  const { loginWithGoogle } = useAuth();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) {
      const msg = 'No se recibió la credencial de Google.';
      setErrorMsg(msg);
      onErrorNotification?.(msg);
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const result = await loginWithGoogle(response.credential);
      if (result.success && result.user) {
        onSuccessRedirect(result.user);
      } else {
        const msg = result.message || 'Error al autenticar con Google';
        setErrorMsg(msg);
        onErrorNotification?.(msg);
      }
    } catch (err: any) {
      const msg = err.message || 'Error inesperado al conectar con Google';
      setErrorMsg(msg);
      onErrorNotification?.(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = () => {
    const msg = 'No se pudo completar la autenticación con Google.';
    setErrorMsg(msg);
    onErrorNotification?.(msg);
  };

  return (
    <div className="w-full">
      {/* Separador estilizado */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 dark:text-slate-500 font-medium">
            {promptText}
          </span>
        </div>
      </div>

      {/* Alerta de error si ocurre */}
      {errorMsg && (
        <div className="mb-3 p-2.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Contenedor del Botón de Google GIS */}
      <div className="flex justify-center w-full min-h-[44px] items-center relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 bg-white/80 dark:bg-slate-900/80 rounded-full flex items-center justify-center space-x-2 text-xs font-medium text-indigo-600 dark:text-indigo-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Verificando con Google...</span>
          </div>
        )}
        <div className="w-full flex justify-center overflow-hidden rounded-full">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            theme={theme === 'dark' ? 'filled_black' : 'outline'}
            size="large"
            shape="pill"
            text={text}
            width="350"
          />
        </div>
      </div>
    </div>
  );
};

export default GoogleAuthButton;
