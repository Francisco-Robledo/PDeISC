import React from 'react';
import { ArrowUp, Heart, Sparkles } from 'lucide-react';
import { useConfetti } from '../hooks/useConfetti';

interface FooterProps {
  scrollToSection: (id: string) => void;
  openSpotlight: () => void;
}

export const Footer: React.FC<FooterProps> = ({ scrollToSection, openSpotlight }) => {
  const { triggerGoogleConfetti } = useConfetti();

  return (
    <footer className="mt-20 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-[#121315]/50 backdrop-blur-md py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Dots */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4285F4]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#EA4335]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FBBC05]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#34A853]" />
            </div>
            <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
              Francisco Robledo • Portfolio R4
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center md:text-left">
            Diseñado e implementado con arquitectura Single Page, animaciones fluidas y persistencia en SQLite.
          </p>
        </div>

        {/* Quick Search Shortcut Tip */}
        <button
          onClick={openSpotlight}
          className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 hover:border-blue-400 hover:text-blue-500 transition-colors flex items-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#FBBC05]" />
          <span>Tip: Presiona</span>
          <kbd className="px-1.5 py-0.5 text-[10px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded font-mono">
            Ctrl + K
          </kbd>
          <span>para abrir la búsqueda rápida</span>
        </button>

        {/* Back to Top & Confetti */}
        <div className="flex items-center gap-3">
          <button
            onClick={triggerGoogleConfetti}
            className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#EA4335] hover:scale-110 transition-all"
            title="Celebrar visita"
          >
            <Heart className="w-4 h-4 fill-current text-rose-500" />
          </button>

          <button
            onClick={() => scrollToSection('hero')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all"
            title="Volver arriba"
          >
            <span>Subir</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-800/40 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Francisco Robledo. Todos los derechos reservados. Desarrollado con React 19, TypeScript, Tailwind CSS y Node.js.
      </div>
    </footer>
  );
};
