import React, { useEffect, useRef, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { CheckSquare, Plus, Home, Download, Menu, X, FileJson, FileSpreadsheet } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { exportTasks } = useTasks();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!exportOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside, true);
    return () => document.removeEventListener('mousedown', handleClickOutside, true);
  }, [exportOpen]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors duration-200">
      <div className="app-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <CheckSquare className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
                R2ANTI
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-slate-400 -mt-1">
                Gestión de Tareas
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/70 dark:text-blue-400 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              }
            >
              <Home className="w-4 h-4" />
              Inicio
            </NavLink>

            <NavLink
              to="/create"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              }
            >
              <Plus className="w-4 h-4" />
              Nueva Tarea
            </NavLink>
          </nav>

          {/* Action Tools (Desktop) */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Export Dropdown */}
            <div className="relative" ref={exportRef}>
              <button
                onClick={() => setExportOpen(prev => !prev)}
                aria-haspopup="true"
                aria-expanded={exportOpen}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="Descargar archivo de tareas"
              >
                <Download className="w-4 h-4 text-blue-500" />
                Descargar
              </button>

              {exportOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-52 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  <button
                    role="menuitem"
                    onClick={() => { exportTasks('json'); setExportOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors font-medium"
                  >
                    <FileJson className="w-4 h-4 text-amber-500" />
                    Exportar como JSON
                  </button>
                  <button
                    role="menuitem"
                    onClick={() => { exportTasks('csv'); setExportOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors font-medium"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                    Exportar como CSV
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Actions Header */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60"
              aria-label="Menú principal"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-4 space-y-2 animate-in slide-in-from-top duration-200 shadow-xl">
          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/70 dark:text-blue-400 font-bold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`
            }
          >
            <Home className="w-5 h-5" />
            Inicio
          </NavLink>

          <NavLink
            to="/create"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`
            }
          >
            <Plus className="w-5 h-5" />
            Nueva Tarea
          </NavLink>

          <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-1.5">
            <span className="px-4 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Exportar Datos
            </span>
            <button
              onClick={() => { exportTasks('json'); setMobileMenuOpen(false); }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
            >
              <FileJson className="w-5 h-5 text-amber-500 shrink-0" />
              Descargar Tareas (JSON)
            </button>
            <button
              onClick={() => { exportTasks('csv'); setMobileMenuOpen(false); }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
            >
              <FileSpreadsheet className="w-5 h-5 text-emerald-500 shrink-0" />
              Descargar Tareas (CSV)
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
