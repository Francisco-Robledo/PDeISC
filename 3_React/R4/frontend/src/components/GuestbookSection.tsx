import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import type { GuestbookEntry } from '../types/portfolio';
import { useConfetti } from '../hooks/useConfetti';

interface GuestbookSectionProps {
  entries: GuestbookEntry[];
  onAddEntry: (entry: { name: string; message: string; role_or_company?: string }) => Promise<any>;
}

export const GuestbookSection: React.FC<GuestbookSectionProps> = ({ entries, onAddEntry }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { triggerGoogleConfetti } = useConfetti();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setFeedback({ type: 'error', text: 'Por favor ingresa al menos tu nombre y un mensaje.' });
      return;
    }

    try {
      setSubmitting(true);
      setFeedback(null);
      await onAddEntry({
        name: name.trim(),
        role_or_company: role.trim() || 'Visitante Web',
        message: message.trim()
      });

      triggerGoogleConfetti();
      setName('');
      setRole('');
      setMessage('');
      setFeedback({
        type: 'success',
        text: '¡Gracias! Tu mensaje ha sido guardado exitosamente en la base de datos SQLite.'
      });

      setTimeout(() => setFeedback(null), 5000);
    } catch (err: any) {
      setFeedback({
        type: 'error',
        text: err.message || 'Error al guardar en la base de datos.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="guestbook" className="py-24 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 text-xs font-semibold mb-3">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Comunidad & Feedback en Vivo</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Libro de <span className="text-[#A142F4] dark:text-[#C58AF9]">Visitas & Testimonios</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          ¿Has probado algún proyecto o te gustaría dejar una recomendación? Los comentarios se guardan en tiempo real en la base de datos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Form Card (2 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="google-card p-6 md:col-span-2 h-fit"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A142F4]" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Dejar una firma o reseña
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tu Nombre *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Sofía Valenzuela"
                required
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Rol o Empresa (Opcional)
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Ej. Software Engineer @ TechCorp"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Mensaje *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="¡Gran portfolio! Me encantó el diseño Google Material y el sistema de autenticación..."
                required
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-purple-500 transition-colors resize-none"
              />
            </div>

            {feedback && (
              <div
                className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                }`}
              >
                {feedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <span>{feedback.text}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 bg-[#A142F4] hover:bg-[#8e2ce2] text-white text-xs font-bold rounded-xl shadow-md shadow-purple-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Guardando en BBDD...' : 'Firmar Libro de Visitas'}</span>
            </button>
          </form>
        </motion.div>

        {/* Live Entries List (3 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="md:col-span-3 space-y-3"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Firmas Recientes ({entries.length})
            </span>
            <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Base de Datos SQLite Sincronizada
            </span>
          </div>

          <div className="max-h-[460px] overflow-y-auto space-y-3 pr-1">
            {entries.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                Sé el primero en firmar el libro de visitas.
              </div>
            ) : (
              entries.map((entry) => (
                <div
                  key={entry.id}
                  className="google-card p-4 flex items-start gap-3.5"
                >
                  {/* Google Colored Avatar Initials */}
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm"
                    style={{ backgroundColor: entry.avatar_color || '#4285F4' }}
                  >
                    {entry.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {entry.name}
                      </h4>
                      {entry.created_at && (
                        <span className="text-[10px] text-slate-400">
                          {entry.created_at}
                        </span>
                      )}
                    </div>

                    {entry.role_or_company && (
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                        {entry.role_or_company}
                      </p>
                    )}

                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/60">
                      "{entry.message}"
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
