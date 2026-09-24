import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Code, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react';
import type { PortfolioData, Project } from '../types/portfolio';

interface SpotlightSearchProps {
  isOpen: boolean;
  onClose: () => void;
  data: PortfolioData;
  scrollToSection: (id: string) => void;
  onSelectProject: (project: Project) => void;
}

interface SearchItem {
  id: string;
  title: string;
  category: string;
  type: 'section' | 'project' | 'skill' | 'action';
  action: () => void;
  badge?: string;
}

export const SpotlightSearch: React.FC<SpotlightSearchProps> = ({
  isOpen,
  onClose,
  data,
  scrollToSection,
  onSelectProject,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Aggregate searchable items
  const allItems: SearchItem[] = useMemo(() => {
    const items: SearchItem[] = [];

    // Quick navigation sections
    items.push(
      { id: 'sec-hero', title: 'Ir al Inicio', category: 'Navegación', type: 'section', action: () => scrollToSection('hero') },
      { id: 'sec-about', title: 'Sobre Francisco Robledo (Bio & Filosofía)', category: 'Navegación', type: 'section', action: () => scrollToSection('about') },
      { id: 'sec-skills', title: 'Habilidades & Tecnologías', category: 'Navegación', type: 'section', action: () => scrollToSection('skills') },
      { id: 'sec-projects', title: 'Galería de Proyectos Desarrollados', category: 'Navegación', type: 'section', action: () => scrollToSection('projects') },
      { id: 'sec-experience', title: 'Trayectoria & Experiencia Profesional', category: 'Navegación', type: 'section', action: () => scrollToSection('experience') },
      { id: 'sec-achievements', title: 'Certificaciones & Logros Obtenidos', category: 'Navegación', type: 'section', action: () => scrollToSection('achievements') },
      { id: 'sec-guestbook', title: 'Libro de Visitas & Testimonios', category: 'Navegación', type: 'section', action: () => scrollToSection('guestbook') },
      { id: 'sec-contact', title: 'Contactar a Francisco (Enviar Mensaje)', category: 'Navegación', type: 'section', action: () => scrollToSection('contact') }
    );

    // Projects
    data.projects.forEach((p) => {
      items.push({
        id: `proj-${p.id}`,
        title: p.title,
        category: `Proyecto (${p.category})`,
        type: 'project',
        badge: `${p.likes} likes`,
        action: () => {
          scrollToSection('projects');
          onSelectProject(p);
        }
      });
    });

    // Skills
    data.skills.forEach((s) => {
      items.push({
        id: `skill-${s.id}`,
        title: `${s.name} — ${s.description}`,
        category: `Habilidad (${s.category.toUpperCase()})`,
        type: 'skill',
        badge: `${s.level}%`,
        action: () => scrollToSection('skills')
      });
    });

    return items;
  }, [data, scrollToSection, onSelectProject]);

  // Filter items based on query
  const filteredItems = useMemo(() => {
    if (!query.trim()) {
      return allItems.slice(0, 8);
    }
    const q = query.toLowerCase();
    return allItems
      .filter((item) => item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q))
      .slice(0, 10);
  }, [query, allItems]);

  // Keyboard navigation inside spotlight
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-md">
        {/* Backdrop dismiss */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.15 }}
          className="relative w-full max-w-2xl bg-white dark:bg-[#1E2023] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10"
        >
          {/* Google Search Bar Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4285F4]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#EA4335]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FBBC05]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#34A853]" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Buscar proyectos, habilidades, secciones o escribir un comando..."
              className="flex-1 bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm sm:text-base font-medium"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 rounded border border-slate-200 dark:border-slate-700">
              ESC
            </kbd>
          </div>

          {/* Quick Filter Suggestion Chips */}
          <div className="flex items-center gap-2 px-5 py-2.5 overflow-x-auto bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/60 text-xs">
            <span className="text-slate-400 font-medium">Sugerencias:</span>
            {['React', 'OAuth', 'Proyectos', 'Experiencia', 'Contacto'].map((chip) => (
              <button
                key={chip}
                onClick={() => {
                  setQuery(chip);
                  setSelectedIndex(0);
                }}
                className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-400 hover:text-blue-500 transition-colors whitespace-nowrap"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Results List */}
          <div className="max-h-[380px] overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/40">
            {filteredItems.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-sm">
                No se encontraron resultados para "<span className="font-semibold">{query}</span>"
              </div>
            ) : (
              filteredItems.map((item, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <div
                    key={item.id}
                    onMouseEnter={() => setSelectedIndex(index)}
                    onClick={() => {
                      item.action();
                      onClose();
                    }}
                    className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {item.type === 'project' && <Code className="w-4 h-4 text-[#4285F4]" />}
                        {item.type === 'skill' && <Sparkles className="w-4 h-4 text-[#FBBC05]" />}
                        {item.type === 'section' && <ArrowRight className="w-4 h-4 text-[#34A853]" />}
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{item.title}</div>
                        <div className="text-xs text-slate-400">{item.category}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {item.badge}
                        </span>
                      )}
                      {isSelected && (
                        <CornerDownLeft className="w-3.5 h-3.5 text-blue-500" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Hints */}
          <div className="flex items-center justify-between px-5 py-2.5 bg-slate-50 dark:bg-[#161719] border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400">
            <div className="flex items-center gap-3">
              <span>↑↓ para navegar</span>
              <span>↵ para seleccionar</span>
              <span>ESC para cerrar</span>
            </div>
            <span className="font-medium text-slate-500">Google Spotlight v4.0</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
