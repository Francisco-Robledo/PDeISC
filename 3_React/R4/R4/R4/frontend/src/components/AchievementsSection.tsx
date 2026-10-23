import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  PartyPopper, 
  Eye, 
  Download, 
  X, 
  Maximize2, 
  Check
} from 'lucide-react';
import type { Achievement } from '../types/portfolio';
import { useConfetti } from '../hooks/useConfetti';
import { getCongratulationsApi, addCongratulationsApi } from '../utils/api';

interface AchievementsSectionProps {
  achievements: Achievement[];
}

const iconMap: Record<string, React.ElementType> = {
  Award,
  CheckCircle2,
  ShieldCheck,
  Sparkles
};

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({ achievements }) => {
  const { triggerAchievementBurst } = useConfetti();
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [congratulations, setCongratulations] = useState<number>(38);
  const [hasCongratulated, setHasCongratulated] = useState<boolean>(false);

  // Initialize congratulations from localStorage and database API
  useEffect(() => {
    const stored = localStorage.getItem('r4_congratulated_device');
    if (stored === 'true') {
      setHasCongratulated(true);
    }
    getCongratulationsApi().then(count => {
      if (typeof count === 'number' && count > 0) {
        setCongratulations(count);
      }
    });
  }, []);

  // Handle congratulating (strictly 1 increment per machine/browser)
  const handleCongratulate = async () => {
    triggerAchievementBurst();
    if (hasCongratulated) {
      return;
    }
    setHasCongratulated(true);
    localStorage.setItem('r4_congratulated_device', 'true');
    setCongratulations(prev => prev + 1);
    try {
      const updated = await addCongratulationsApi();
      if (typeof updated === 'number') {
        setCongratulations(updated);
      }
    } catch (err) {
      console.warn('Could not increment congratulations on server:', err);
    }
  };

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedAchievement(null);
        setIsZoomed(false);
      }
    };
    if (selectedAchievement) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedAchievement]);

  return (
    <section id="achievements" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-semibold mb-3">
          <Award className="w-3.5 h-3.5" />
          <span>Hitos & Reconocimientos</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Logros & <span className="text-[#EA4335]">Certificaciones</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Certificaciones oficiales con validez técnica y distinciones académicas que avalan conocimientos prácticos en hardware, redes y programación.
        </p>
      </div>

      {/* Congratulations Interactive Counter Card (1 per machine/browser) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12 p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-blue-500/10 via-amber-500/10 to-rose-500/10 border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm"
      >
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center text-2xl shrink-0 shadow-inner">
            🎉
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2.5">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {congratulations}
              </span>
              <span className="text-base font-bold text-slate-800 dark:text-slate-200">
                Felicitaciones recibidas
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              {hasCongratulated
                ? '¡Ya felicitaste a Francisco desde este navegador! (1 felicitación registrada por dispositivo)'
                : '¿Reconoces el esfuerzo y trayectoria de Francisco? ¡Déjale tu felicitación con 1 click!'}
            </p>
          </div>
        </div>

        <button
          onClick={handleCongratulate}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95 shrink-0 ${
            hasCongratulated
              ? 'bg-emerald-500 text-white shadow-emerald-500/20'
              : 'bg-gradient-to-r from-[#4285F4] to-[#EA4335] hover:opacity-95 text-white shadow-blue-500/25 hover:scale-105'
          }`}
          title={hasCongratulated ? 'Ya felicitaste desde este navegador' : 'Enviar felicitación a Francisco'}
        >
          <PartyPopper className="w-4 h-4" />
          <span>{hasCongratulated ? '¡Felicitación enviada! 🎉' : '¡Felicitar a Francisco! 👏'}</span>
        </button>
      </motion.div>

      {/* Grid of Achievement Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {achievements.map((item, idx) => {
          const IconComponent = iconMap[item.icon] || Award;
          const hasImage = Boolean(item.certificate_image);

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
              className="google-card p-6 sm:p-7 flex flex-col justify-between group hover:border-[#EA4335]/40 relative"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-[#EA4335] group-hover:scale-110 transition-transform">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                        {item.issuer} • {item.date}
                      </p>
                    </div>
                  </div>
                  {hasImage && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40">
                      <Check className="w-3 h-3 text-blue-500" />
                      <span>Certificado</span>
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {item.description}
                </p>

                {/* Certificate Thumbnail Preview if available */}
                {hasImage && item.certificate_image && (
                  <div
                    onClick={() => setSelectedAchievement(item)}
                    className="relative cursor-pointer mb-5 rounded-xl overflow-hidden border border-slate-200/80 dark:border-slate-800 group/thumb bg-slate-100 dark:bg-slate-900/60 shadow-inner"
                  >
                    <img
                      src={item.certificate_image}
                      alt={item.title}
                      className="w-full h-36 object-cover object-top filter brightness-[0.97] group-hover/thumb:scale-105 group-hover/thumb:brightness-100 transition-all duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end justify-between p-3">
                      <span className="text-white text-xs font-medium flex items-center gap-1.5 drop-shadow">
                        <Eye className="w-3.5 h-3.5 text-blue-400" />
                        <span>Ver foto del certificado</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-sm text-white text-[10px] font-mono">
                        HD 1600px
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer actions (No validation links) */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCongratulate}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 text-xs font-semibold transition-all active:scale-95"
                  >
                    <PartyPopper className="w-3.5 h-3.5" />
                    <span>{hasCongratulated ? 'Celebrar 🎉' : 'Felicitar 👏'}</span>
                  </button>

                  {hasImage && (
                    <button
                      onClick={() => setSelectedAchievement(item)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-semibold transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ver Foto</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {item.pdf_url && (
                    <a
                      href={item.pdf_url}
                      download
                      className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors"
                      title="Descargar PDF Oficial"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Descargar PDF</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Interactive Certificate Preview Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setSelectedAchievement(null);
                setIsZoomed(false);
              }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl bg-white dark:bg-[#18191B] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 flex flex-col max-h-[92vh]"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-tight">
                      {selectedAchievement.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {selectedAchievement.issuer} • {selectedAchievement.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {selectedAchievement.certificate_image && (
                    <button
                      onClick={() => setIsZoomed(!isZoomed)}
                      className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
                      title={isZoomed ? "Ajustar al marco" : "Ampliar certificado"}
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedAchievement(null);
                      setIsZoomed(false);
                    }}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
                    title="Cerrar (Esc)"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body / Image Viewer */}
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-slate-100/50 dark:bg-[#121214]">
                {selectedAchievement.certificate_image ? (
                  <div className={`relative transition-all duration-300 w-full flex items-center justify-center ${isZoomed ? 'scale-110 overflow-auto py-6' : ''}`}>
                    <img
                      src={selectedAchievement.certificate_image}
                      alt={selectedAchievement.title}
                      className="max-h-[60vh] sm:max-h-[64vh] w-auto max-w-full rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-800/80 object-contain cursor-zoom-in"
                      onClick={() => setIsZoomed(!isZoomed)}
                    />
                  </div>
                ) : (
                  <div className="py-16 text-center max-w-md">
                    <Award className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      Distinción Académica Oficial
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {selectedAchievement.description}
                    </p>
                  </div>
                )}

                {/* Description Banner below image */}
                <div className="mt-4 w-full p-3 sm:p-4 rounded-2xl bg-white dark:bg-[#1E2023] border border-slate-200/80 dark:border-slate-800/80 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  <p>{selectedAchievement.description}</p>
                </div>
              </div>

              {/* Modal Footer (No validation button) */}
              <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCongratulate}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
                  >
                    <PartyPopper className="w-3.5 h-3.5" />
                    <span>{hasCongratulated ? 'Celebrar Hito 🎉' : 'Felicitar por este Hito 👏'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {selectedAchievement.pdf_url && (
                    <a
                      href={selectedAchievement.pdf_url}
                      download
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#34A853] hover:bg-emerald-600 text-white text-xs font-semibold shadow-sm transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar PDF</span>
                    </a>
                  )}

                  <button
                    onClick={() => {
                      setSelectedAchievement(null);
                      setIsZoomed(false);
                    }}
                    className="px-4 py-2 rounded-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
