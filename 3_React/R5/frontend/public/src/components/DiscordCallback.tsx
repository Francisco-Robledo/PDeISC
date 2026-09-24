import { useEffect, useState, useRef } from 'react';
import useAuth from '../hooks/useAuth';
import { Loader2, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

export function DiscordCallback() {
  const { loginWithDiscord, loginWithSocial } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('Verificando autorización con Discord...');
  const [details, setDetails] = useState<string | null>(null);
  const processedRef = useRef<boolean>(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const processAuth = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get('code');
        const errorDesc = searchParams.get('error_description') || searchParams.get('error');

        // Si Discord devolvió un error (ej. usuario canceló o error de redirect)
        if (errorDesc) {
          setStatus('error');
          setMessage('Discord rechazó la solicitud de autenticación.');
          setDetails(errorDesc);
          if (window.opener) {
            window.opener.postMessage(
              { type: 'DISCORD_AUTH_ERROR', message: errorDesc },
              '*'
            );
          }
          return;
        }

        // Flujo 1: Authorization Code Grant (Recomendado y solicitado)
        if (code) {
          setMessage('Intercambiando código con Discord y generando sesión SQL...');
          const redirectUri = `${window.location.origin}${window.location.pathname}`;
          
          const result = await loginWithDiscord(code, redirectUri);

          if (result.success && result.user) {
            setStatus('success');
            setMessage(`¡Bienvenido, ${result.user.name}!`);

            // Si es ventana emergente (popup)
            if (window.opener) {
              const token = result.token || localStorage.getItem('token');
              window.opener.postMessage(
                {
                  type: 'DISCORD_AUTH_SUCCESS',
                  token,
                  user: result.user
                },
                '*'
              );
              setTimeout(() => {
                window.close();
              }, 400);
              return;
            }

            // Redirección si se abrió en la ventana principal
            setTimeout(() => {
              window.location.href = '/';
            }, 800);
            return;
          } else {
            setStatus('error');
            setMessage(result.message || 'Error al validar el código con Discord.');
            setDetails('El backend no pudo completar el intercambio del token.');
            return;
          }
        }

        // Flujo 2: Implicit Grant de respaldo (#access_token=...)
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
        const accessToken = hashParams.get('access_token');
        if (accessToken) {
          setMessage('Autenticando con token de Discord...');
          const result = await loginWithSocial({
            provider: 'discord',
            email: '',
            accessToken,
          });

          if (result.success && result.user) {
            setStatus('success');
            setMessage(`¡Bienvenido, ${result.user.name}!`);

            if (window.opener) {
              window.opener.postMessage(
                {
                  type: 'DISCORD_AUTH_SUCCESS',
                  token: localStorage.getItem('token'),
                  user: result.user
                },
                '*'
              );
              setTimeout(() => {
                window.close();
              }, 600);
              return;
            }

            setTimeout(() => {
              window.location.href = '/';
            }, 800);
            return;
          } else {
            setStatus('error');
            setMessage(result.message || 'Error al verificar token con Discord.');
            return;
          }
        }

        // Si no hay ni code ni accessToken en la URL
        setStatus('error');
        setMessage('No se recibió el código ni el token de Discord en la URL de retorno.');
        setDetails(`URL actual: ${window.location.href}`);
      } catch (err: any) {
        console.error('Error en DiscordCallback:', err);
        setStatus('error');
        setMessage(err.response?.data?.message || err.message || 'Error inesperado durante la autenticación de Discord.');
      }
    };

    processAuth();
  }, [loginWithDiscord, loginWithSocial]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-md p-8 rounded-3xl border border-slate-800 text-center shadow-2xl space-y-4">
        
        {/* Ícono de Estado Branded */}
        <div className="w-16 h-16 rounded-2xl bg-[#5865F2] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#5865F2]/30">
          {status === 'loading' && <Loader2 className="w-8 h-8 animate-spin" />}
          {status === 'success' && <CheckCircle2 className="w-8 h-8 text-white" />}
          {status === 'error' && <AlertCircle className="w-8 h-8 text-rose-200" />}
        </div>

        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Discord OAuth2</h2>
          <p className="text-xs text-slate-300 mt-1">{message}</p>
        </div>

        {details && (
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-[11px] text-slate-400 break-all text-left font-mono">
            {details}
          </div>
        )}

        {status === 'error' && (
          <div className="pt-2 flex justify-center space-x-3">
            <button
              onClick={() => {
                if (window.opener) {
                  window.close();
                } else {
                  window.location.href = '/';
                }
              }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{window.opener ? 'Cerrar ventana' : 'Regresar al inicio'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DiscordCallback;
