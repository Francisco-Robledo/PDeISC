import React from 'react';
import useTheme from '../hooks/useTheme';
import { Sun, Moon } from 'lucide-react';

export function FloatingThemeButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="fixed bottom-6 left-6 z-50 p-3.5 rounded-full bg-white dark:bg-slate-900 text-slate-800 dark:text-amber-400 shadow-2xl border border-slate-300 dark:border-slate-700 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group"
      title={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
      aria-label="Alternar tema claro y oscuro"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-indigo-600 group-hover:rotate-12 transition-transform" />
      ) : (
        <Sun className="w-5 h-5 text-amber-400 group-hover:rotate-45 transition-transform" />
      )}
    </button>
  );
}

export default FloatingThemeButton;
