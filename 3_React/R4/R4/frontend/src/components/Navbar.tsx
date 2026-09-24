import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Search, Menu, X } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  scrollProgress: number;
  scrollToSection: (id: string) => void;
  isDark: boolean;
  toggleTheme: () => void;
  openSpotlight: () => void;
}

const navItems = [
  { id: 'hero', label: 'Inicio' },
  { id: 'about', label: 'Sobre Mí' },
  { id: 'skills', label: 'Habilidades' },
  { id: 'projects', label: 'Proyectos' },
  { id: 'experience', label: 'Experiencia' },
  { id: 'achievements', label: 'Logros' },
  { id: 'guestbook', label: 'Visitas' },
  { id: 'contact', label: 'Contacto' },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  scrollProgress,
  scrollToSection,
  isDark,
  toggleTheme,
  openSpotlight,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top Google Colored Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-50 bg-slate-200 dark:bg-slate-800">
        <motion.div
          className="h-full bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Pill Header */}
      <header className="fixed top-4 left-0 right-0 z-40 px-4 sm:px-6 max-w-7xl mx-auto flex items-center justify-between pointer-events-none">
        {/* Brand / Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-auto flex items-center gap-2.5 px-4 py-2 bg-white/85 dark:bg-[#1E2023]/85 backdrop-blur-md rounded-full border border-slate-200/80 dark:border-slate-800/80 shadow-md shadow-black/5 cursor-pointer select-none group"
          onClick={() => scrollToSection('hero')}
        >
          {/* Google 4 Dots Logo */}
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4285F4] group-hover:scale-125 transition-transform" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#EA4335] group-hover:scale-125 transition-transform delay-75" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FBBC05] group-hover:scale-125 transition-transform delay-100" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#34A853] group-hover:scale-125 transition-transform delay-150" />
          </div>
          <span className="font-bold text-sm tracking-tight text-slate-800 dark:text-slate-100">
            Francisco<span className="text-[#4285F4]">.dev</span>
          </span>
          <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-md">
            R4
          </span>
        </motion.div>

        {/* Desktop Navigation Pill */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="hidden md:flex pointer-events-auto items-center p-1.5 bg-white/85 dark:bg-[#1E2023]/85 backdrop-blur-md rounded-full border border-slate-200/80 dark:border-slate-800/80 shadow-md shadow-black/5"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative px-3.5 py-1.5 text-xs font-semibold rounded-full transition-colors duration-200 ${
                  isActive
                    ? 'text-[#4285F4] dark:text-[#8AB4F8]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute inset-0 bg-blue-50 dark:bg-blue-900/30 rounded-full border border-blue-200/60 dark:border-blue-700/40"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </motion.nav>

        {/* Right Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="pointer-events-auto flex items-center gap-2"
        >
          {/* Spotlight Search Trigger */}
          <button
            onClick={openSpotlight}
            className="flex items-center gap-2 px-3 py-2 bg-white/85 dark:bg-[#1E2023]/85 backdrop-blur-md rounded-full border border-slate-200/80 dark:border-slate-800/80 shadow-md shadow-black/5 text-slate-600 dark:text-slate-300 hover:border-blue-400 hover:text-blue-500 transition-all text-xs"
            title="Buscar en el portfolio (Ctrl + K)"
          >
            <Search className="w-3.5 h-3.5 text-[#4285F4]" />
            <span className="hidden sm:inline font-medium">Buscar</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-500">
              Ctrl K
            </kbd>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 bg-white/85 dark:bg-[#1E2023]/85 backdrop-blur-md rounded-full border border-slate-200/80 dark:border-slate-800/80 shadow-md shadow-black/5 text-slate-700 dark:text-slate-200 hover:scale-105 active:scale-95 transition-transform"
            aria-label="Cambiar tema"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-[#FBBC05] animate-spin-slow" />
            ) : (
              <Moon className="w-4 h-4 text-[#4285F4]" />
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 bg-white/85 dark:bg-[#1E2023]/85 backdrop-blur-md rounded-full border border-slate-200/80 dark:border-slate-800/80 shadow-md text-slate-700 dark:text-slate-200"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </motion.div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-20 left-4 right-4 z-50 p-4 bg-white/95 dark:bg-[#1E2023]/95 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl md:hidden"
          >
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    scrollToSection(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2.5 text-left text-sm font-semibold rounded-2xl transition-colors ${
                    activeSection === item.id
                      ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
