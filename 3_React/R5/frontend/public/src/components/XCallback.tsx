import { useEffect, useState, useRef } from 'react';
import useAuth from '../hooks/useAuth';
import { Loader2, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

export function XCallback() {
  const { loginWithX } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('Verificando autorización con X (Twitter)...');
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

        // Si X devolvió error
        if (errorDesc) {
          setStatus('error');
          setMessage('X rechazó la solicitud de autenticación.');
          setDetails(errorDesc);
          if (window.opener) {
            window.opener.postMessage(
              { type: 'X_AUTH_ERROR', message: errorDesc },
              '*'
            );
          }
          return;
        }

        if (code) {
          setMessage('Intercambiando código PKCE con la API de X y generando sesión SQL...');
          const redirectUri = `${window.location.origin}${window.location.pathname}`;
          const codeVerifier = sessionStorage.getItem('x_code_verifier') || localStorage.getItem('x_code_verifier') || '';

          const result = await loginWithX(code, codeVerifier, redirectUri);

          // Limpiar el verifier de la memoria
          sessionStorage.removeItem('x_code_verifier');
          localStorage.removeItem('x_code_verifier');

          if (result.success && result.user) {
            setStatus('success');
            setMessage(`¡Bienvenido, ${result.user.name}!`);

            // Si es ventana emergente (popup)
            if (window.opener) {
              const token = result.token || localStorage.getItem('token');
              window.opener.postMessage(
                {
                  type: 'X_AUTH_SUCCESS',
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
            setMessage(result.message || 'Error al validar el código con X.');
            setDetails('El backend no pudo completar el intercambio del token PKCE.');
            return;
          }
        }

        setStatus('error');
        setMessage('No se recibió el código de autorización de X en la URL de retorno.');
        setDetails(`URL actual: ${window.location.href}`);
      } catch (err: any) {
        console.error('Error en XCallback:', err);
        setStatus('error');
        setMessage(err.response?.data?.message || err.message || 'Error inesperado durante la autenticación con X.');
      }
    };

    processAuth();
  }, [loginWithX]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-md p-8 rounded-3xl border border-slate-800 text-center shadow-2xl space-y-4">
        
        {/* Ícono de Estado Branded de X */}
        <div className="w-16 h-16 rounded-2xl bg-black text-white border border-slate-800 flex items-center justify-center mx-auto shadow-lg shadow-black/50">
          {status === 'loading' && <Loader2 className="w-8 h-8 animate-spin" />}
          {status === 'success' && <CheckCircle2 className="w-8 h-8 text-emerald-400" />}
          {status === 'error' && <AlertCircle className="w-8 h-8 text-rose-200" />}
        </div>

        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">X OAuth 2.0 PKCE</h2>
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

export default XCallback;
