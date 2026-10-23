import React, { useState, useEffect } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import useAuth from '../hooks/useAuth';
import useTheme from '../hooks/useTheme';
import { AlertCircle, Loader2 } from 'lucide-react';
import { User } from '../types';

const DISCORD_CLIENT_ID = 
  import.meta.env.VITE_DISCORD_CLIENT_ID || '1552547482054172753';

const X_CLIENT_ID = 
  import.meta.env.VITE_X_CLIENT_ID || 'UFRpeXlKNXNkRTc4N2ZSX2MyMDk6MTpjaQ';

const GITHUB_CLIENT_ID = 
  import.meta.env.VITE_GITHUB_CLIENT_ID || 'Iv23ct9x44LU5ierud5h';

interface SocialAuthButtonsProps {
  onSuccessRedirect: (user: User) => void;
  onErrorNotification?: (msg: string) => void;
  text?: 'signin_with' | 'signup_with' | 'continue_with';
  promptText?: string;
}

export const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({
  onSuccessRedirect,
  onErrorNotification,
  text = 'signin_with',
  promptText = 'O continúa con tu cuenta de',
}) => {
  const { loginWithGoogle, setSession } = useAuth();
  const { theme } = useTheme();
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [isDiscordLoading, setIsDiscordLoading] = useState<boolean>(false);
  const [isXLoading, setIsXLoading] = useState<boolean>(false);
  const [isGitHubLoading, setIsGitHubLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Escuchar mensajes de retorno de ventanas emergentes (Discord, X, GitHub)
  useEffect(() => {
    const handlePopupMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === 'DISCORD_AUTH_SUCCESS') {
        setIsDiscordLoading(false);
        setErrorMsg(null);
        const token = event.data?.token || localStorage.getItem('token');
        const user = event.data?.user;
        if (token && user) {
          setSession(token, user);
          setTimeout(() => {
            onSuccessRedirect(user);
          }, 100);
        } else if (user) {
          onSuccessRedirect(user);
        }
      } else if (event.data?.type === 'DISCORD_AUTH_ERROR') {
        setIsDiscordLoading(false);
        const errMsg = event.data.message || 'Error al autenticar con Discord.';
        setErrorMsg(errMsg);
        onErrorNotification?.(errMsg);
      } else if (event.data?.type === 'X_AUTH_SUCCESS') {
        setIsXLoading(false);
        setErrorMsg(null);
        const token = event.data?.token || localStorage.getItem('token');
        const user = event.data?.user;
        if (token && user) {
          setSession(token, user);
          setTimeout(() => {
            onSuccessRedirect(user);
          }, 100);
        } else if (user) {
          onSuccessRedirect(user);
        }
      } else if (event.data?.type === 'X_AUTH_ERROR') {
        setIsXLoading(false);
        const errMsg = event.data.message || 'Error al autenticar con X.';
        setErrorMsg(errMsg);
        onErrorNotification?.(errMsg);
      } else if (event.data?.type === 'GITHUB_AUTH_SUCCESS') {
        setIsGitHubLoading(false);
        setErrorMsg(null);
        const token = event.data?.token || localStorage.getItem('token');
        const user = event.data?.user;
        if (token && user) {
          setSession(token, user);
          setTimeout(() => {
            onSuccessRedirect(user);
          }, 100);
        } else if (user) {
          onSuccessRedirect(user);
        }
      } else if (event.data?.type === 'GITHUB_AUTH_ERROR') {
        setIsGitHubLoading(false);
        const errMsg = event.data.message || 'Error al autenticar con GitHub.';
        setErrorMsg(errMsg);
        onErrorNotification?.(errMsg);
      }
    };

    window.addEventListener('message', handlePopupMessage);
    return () => window.removeEventListener('message', handlePopupMessage);
  }, [onSuccessRedirect, onErrorNotification, setSession]);

  // Manejo de éxito de Google GIS
  const handleGoogleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) {
      const msg = 'No se recibió la credencial de Google.';
      setErrorMsg(msg);
      onErrorNotification?.(msg);
      return;
    }

    setIsGoogleLoading(true);
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
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    const msg = 'No se pudo completar la autenticación con Google.';
    setErrorMsg(msg);
    onErrorNotification?.(msg);
  };

  // Manejo de inicio de sesión directo con Discord (OAuth2 Code Grant)
  const handleDiscordClick = () => {
    setErrorMsg(null);
    setIsDiscordLoading(true);

    const redirectUri = `${window.location.origin}/discord-callback`;
    const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&response_type=code&scope=identify%20email&redirect_uri=${encodeURIComponent(redirectUri)}`;

    const width = 500;
    const height = 750;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      authUrl,
      'discord_oauth',
      `width=${width},height=${height},left=${left},top=${top},status=no,toolbar=no,menubar=no`
    );

    if (!popup) {
      window.location.href = authUrl;
      return;
    }

    const checkClosedInterval = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosedInterval);
        setIsDiscordLoading(false);
      }
    }, 1000);
  };

  // Manejo de inicio de sesión directo con X (Twitter OAuth 2.0 PKCE)
  const handleXClick = async () => {
    setErrorMsg(null);
    setIsXLoading(true);

    try {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
      const array = new Uint8Array(64);
      window.crypto.getRandomValues(array);
      const codeVerifier = Array.from(array).map(n => chars[n % chars.length]).join('');

      const encoder = new TextEncoder();
      const data = encoder.encode(codeVerifier);
      const digest = await window.crypto.subtle.digest('SHA-256', data);
      const codeChallenge = btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      sessionStorage.setItem('x_code_verifier', codeVerifier);
      localStorage.setItem('x_code_verifier', codeVerifier);

      const redirectUri = `${window.location.origin}/x-callback`;
      const state = Array.from(window.crypto.getRandomValues(new Uint8Array(16)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      const authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${X_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=tweet.read%20users.read%20offline.access&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

      const width = 500;
      const height = 750;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(
        authUrl,
        'x_oauth',
        `width=${width},height=${height},left=${left},top=${top},status=no,toolbar=no,menubar=no`
      );

      if (!popup) {
        window.location.href = authUrl;
        return;
      }

      const checkClosedInterval = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosedInterval);
          setIsXLoading(false);
        }
      }, 1000);
    } catch (e: any) {
      console.error('Error al inicializar X PKCE:', e);
      setIsXLoading(false);
      setErrorMsg('No se pudo inicializar la autenticación con X.');
    }
  };

  // Manejo de inicio de sesión directo con GitHub OAuth
  const handleGitHubClick = () => {
    setErrorMsg(null);
    setIsGitHubLoading(true);

    const redirectUri = `${window.location.origin}/github-callback`;
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read:user%20user:email`;

    const width = 500;
    const height = 750;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      authUrl,
      'github_oauth',
      `width=${width},height=${height},left=${left},top=${top},status=no,toolbar=no,menubar=no`
    );

    if (!popup) {
      window.location.href = authUrl;
      return;
    }

    const checkClosedInterval = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosedInterval);
        setIsGitHubLoading(false);
      }
    }, 1000);
  };

  // Textos adaptados al tipo de acción
  const getActionText = (platformName: string) => {
    if (text === 'signup_with') return `Registrarse con ${platformName}`;
    if (text === 'continue_with') return `Continuar con ${platformName}`;
    return `Iniciar sesión con ${platformName}`;
  };

  return (
    <div className="w-full space-y-2.5">
      {/* Separador estilizado */}
      <div className="relative my-3">
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

      {/* 1. Botón de Google GIS Oficial (Pill Shape 44px) */}
      <div className="flex justify-center w-full min-h-[44px] items-center relative">
        {isGoogleLoading && (
          <div className="absolute inset-0 z-10 bg-white/80 dark:bg-slate-900/80 rounded-full flex items-center justify-center space-x-2 text-xs font-medium text-indigo-600 dark:text-indigo-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Verificando con Google...</span>
          </div>
        )}
        <div className="w-full flex justify-center overflow-hidden rounded-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme={theme === 'dark' ? 'filled_black' : 'outline'}
            size="large"
            shape="pill"
            text={text}
            width="350"
          />
        </div>
      </div>

      {/* 2. Botón de Discord Oficial (Pill Shape 44px) */}
      <div className="flex justify-center w-full">
        <button
          type="button"
          onClick={handleDiscordClick}
          disabled={isDiscordLoading}
          className="w-full max-w-[350px] h-[44px] rounded-full bg-[#5865F2] hover:bg-[#4752c4] active:bg-[#3c45a5] text-white font-medium text-sm flex items-center justify-center space-x-3 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed border border-[#5865F2]/40"
          title="Iniciar sesión con Discord"
        >
          {isDiscordLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Conectando con Discord...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5 fill-white shrink-0" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              <span>{getActionText('Discord')}</span>
            </>
          )}
        </button>
      </div>

      {/* 3. Botón de X (Twitter) Oficial (Pill Shape 44px) */}
      <div className="flex justify-center w-full">
        <button
          type="button"
          onClick={handleXClick}
          disabled={isXLoading}
          className="w-full max-w-[350px] h-[44px] rounded-full bg-black hover:bg-slate-900 active:bg-slate-950 text-white font-medium text-sm flex items-center justify-center space-x-3 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed border border-slate-700/60"
          title="Iniciar sesión con X"
        >
          {isXLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Conectando con X...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>{getActionText('X')}</span>
            </>
          )}
        </button>
      </div>

      {/* 4. Botón de GitHub Oficial (Reemplazo de Facebook, Pill Shape 44px) */}
      <div className="flex justify-center w-full">
        <button
          type="button"
          onClick={handleGitHubClick}
          disabled={isGitHubLoading}
          className="w-full max-w-[350px] h-[44px] rounded-full bg-[#24292e] hover:bg-[#1b1f23] active:bg-[#161a1d] text-white font-medium text-sm flex items-center justify-center space-x-3 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed border border-slate-700/60"
          title="Iniciar sesión con GitHub"
        >
          {isGitHubLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Conectando con GitHub...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5 fill-white shrink-0" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>{getActionText('GitHub')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SocialAuthButtons;
