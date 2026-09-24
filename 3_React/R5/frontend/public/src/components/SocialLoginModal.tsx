import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { User } from '../types';
import { ShieldCheck, Loader2, X as CloseIcon, AlertCircle, ExternalLink, Sparkles } from 'lucide-react';

export type SocialProvider = 'facebook' | 'x' | 'discord';

export const DISCORD_CLIENT_ID = 
  import.meta.env.VITE_DISCORD_CLIENT_ID || '1552547482054172753';

interface SocialLoginModalProps {
  isOpen: boolean;
  provider: SocialProvider | null;
  onClose: () => void;
  onSuccessRedirect: (user: User) => void;
}

export function SocialLoginModal({
  isOpen,
  provider,
  onClose,
  onSuccessRedirect,
}: SocialLoginModalProps) {
  const { loginWithSocial, setSession } = useAuth();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Perfiles predeterminados para pruebas
  const defaultProfiles: Record<SocialProvider, { name: string; email: string; avatar: string }> = {
    facebook: {
      name: 'Usuario Facebook',
      email: 'usuario.facebook@meta.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    },
    x: {
      name: 'Usuario X (@dev)',
      email: 'usuario.x@twitter.com',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    },
    discord: {
      name: 'Discord Member#2026',
      email: 'gamer@discord.gg',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
    },
  };

  const providerMeta = {
    facebook: {
      name: 'Facebook',
      bgClass: 'bg-[#1877F2]',
      borderClass: 'border-[#1877F2]/40',
      badgeColor: 'bg-blue-600 text-white',
      desc: 'Meta OAuth 2.0 Client Authentication',
    },
    x: {
      name: 'X',
      bgClass: 'bg-black dark:bg-slate-800',
      borderClass: 'border-slate-800 dark:border-slate-700',
      badgeColor: 'bg-black dark:bg-white text-white dark:text-black',
      desc: 'X OAuth 2.0 PKCE Federated Sign-In',
    },
    discord: {
      name: 'Discord',
      bgClass: 'bg-[#5865F2]',
      borderClass: 'border-[#5865F2]/40',
      badgeColor: 'bg-[#5865F2] text-white',
      desc: `OAuth2 App ID: ${DISCORD_CLIENT_ID}`,
    },
  };

  // Escuchar mensaje del popup de Discord OAuth2
  useEffect(() => {
    const handlePopupMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'DISCORD_AUTH_SUCCESS' || event.data?.type === 'X_AUTH_SUCCESS') {
        if (event.data.user) {
          const token = event.data.token || localStorage.getItem('token');
          if (token) {
            setSession(token, event.data.user);
          }
          setTimeout(() => {
            onSuccessRedirect(event.data.user);
            onClose();
          }, 100);
          return;
        }
        if (event.data.accessToken) {
          setIsProcessing(true);
          setErrorMsg(null);
          try {
            const result = await loginWithSocial({
              provider: 'discord',
              email: '',
              accessToken: event.data.accessToken,
            });

            if (result.success && result.user) {
              onSuccessRedirect(result.user);
              onClose();
            } else {
              setErrorMsg(result.message || 'Error al autenticar con Discord.');
            }
          } catch (err: any) {
            setErrorMsg(err.message || 'Error durante la verificación con Discord.');
          } finally {
            setIsProcessing(false);
          }
        }
      }
    };

    window.addEventListener('message', handlePopupMessage);
    return () => window.removeEventListener('message', handlePopupMessage);
  }, [loginWithSocial, onSuccessRedirect, onClose]);

  if (!isOpen || !provider) return null;

  const currentMeta = providerMeta[provider];
  const defaults = defaultProfiles[provider];

  const handleLaunchDiscordOAuth = () => {
    setErrorMsg(null);
    const redirectUri = encodeURIComponent(`${window.location.origin}/discord-callback`);
    const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&response_type=code&scope=identify%20email&redirect_uri=${redirectUri}`;
    
    const popup = window.open(
      authUrl,
      'discord_oauth',
      'width=500,height=750,menubar=no,toolbar=no,status=no'
    );

    if (!popup) {
      setErrorMsg('El navegador bloqueó la ventana emergente de Discord. Por favor permite popups para este sitio.');
    }
  };

  const handleAuthorizeManual = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsProcessing(true);

    const formData = new FormData(e.currentTarget);
    const email = (formData.get('email') as string)?.trim() || defaults.email;
    const name = (formData.get('name') as string)?.trim() || defaults.name;
    const avatar = (formData.get('avatar') as string)?.trim() || defaults.avatar;

    try {
      const result = await loginWithSocial({
        provider,
        email,
        name,
        avatar,
        providerId: `${provider}_${Date.now()}`,
      });

      if (result.success && result.user) {
        onSuccessRedirect(result.user);
        onClose();
      } else {
        setErrorMsg(result.message || `No fue posible conectar con ${currentMeta.name}`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error inesperado durante la autorización');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all"
        role="dialog"
        aria-modal="true"
      >
        {/* Cabecera con identidad de la red social */}
        <div className={`p-5 ${currentMeta.bgClass} text-white flex items-center justify-between`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                Continuar con {currentMeta.name}
              </h3>
              <p className="text-[11px] text-white/80 mt-0.5">{currentMeta.desc}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-xl hover:bg-white/10 transition"
            type="button"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Botón principal de Discord OAuth2 si el proveedor es Discord */}
        {provider === 'discord' && (
          <div className="p-6 pb-2 space-y-3">
            <button
              type="button"
              onClick={handleLaunchDiscordOAuth}
              disabled={isProcessing}
              className="w-full py-3 px-4 rounded-2xl bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verificando sesión de Discord...</span>
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4" />
                  <span>Conectar con Discord OAuth2 Oficial</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
              Abre el popup oficial de Discord con tu Application ID: <strong className="text-[#5865F2] font-mono">{DISCORD_CLIENT_ID}</strong>
            </p>

            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-medium text-[10px]">
                  o ingresar en modo demo
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Formulario de autorización / prueba demo */}
        <form onSubmit={handleAuthorizeManual} className="p-6 pt-2 space-y-4">
          {provider !== 'discord' && (
            <div className="text-xs text-slate-600 dark:text-slate-300">
              <strong>Sistema de Usuarios R5</strong> solicita autorización para acceder a tu correo electrónico, nombre y avatar para registrar o iniciar tu sesión en la base de datos SQL.
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Nombre de cuenta ({currentMeta.name}):
              </label>
              <input
                type="text"
                name="name"
                defaultValue={defaults.name}
                required
                className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700 transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Correo Electrónico:
              </label>
              <input
                type="email"
                name="email"
                defaultValue={defaults.email}
                required
                className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700 transition"
              />
            </div>

            <input type="hidden" name="avatar" value={defaults.avatar} />
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center justify-center space-x-2 transition ${currentMeta.bgClass} hover:opacity-90 active:scale-95`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Conectando...</span>
                </>
              ) : (
                <span>Autorizar {currentMeta.name}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SocialLoginModal;
