import React from 'react';
import type { FilterOptions, TaskFilterStatus, TaskSortOption } from '../types/task';
import { Search, Filter, ArrowUpDown, X } from 'lucide-react';

interface TaskFilterProps {
  options: FilterOptions;
  onChange: (updated: Partial<FilterOptions>) => void;
  onReset: () => void;
}

export const TaskFilter: React.FC<TaskFilterProps> = ({ options, onChange, onReset }) => {
  const isFiltered =
    options.searchQuery.trim() !== '' ||
    options.status !== 'all' ||
    options.category !== 'all' ||
    options.sortBy !== 'newest';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm mb-6 space-y-4 transition-colors">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={options.searchQuery}
            onChange={e => onChange({ searchQuery: e.target.value })}
            placeholder="Buscar por título o descripción..."
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          {options.searchQuery && (
            <button
              onClick={() => onChange({ searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category & Sort controls */}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2 w-full sm:w-auto">
          {/* Category Dropdown */}
          <div className="relative w-full sm:w-44">
            <select
              value={options.category}
              onChange={e => onChange({ category: e.target.value })}
              className="w-full appearance-none pl-3 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all truncate cursor-pointer"
            >
              <option value="all">Todas categorías</option>
              <option value="work">Trabajo</option>
              <option value="personal">Personal</option>
              <option value="study">Estudio</option>
              <option value="finance">Finanzas</option>
              <option value="general">General</option>
            </select>
            <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Sort Dropdown */}
          <div className="relative w-full sm:w-44">
            <select
              value={options.sortBy}
              onChange={e => onChange({ sortBy: e.target.value as TaskSortOption })}
              className="w-full appearance-none pl-3 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all truncate cursor-pointer"
            >
              <option value="newest">Más recientes</option>
              <option value="oldest">Más antiguas</option>
              <option value="priority">Por prioridad</option>
              <option value="title">Por título (A-Z)</option>
            </select>
            <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Status Filter Tabs & Reset */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 gap-3">
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/70 p-1 rounded-xl overflow-x-auto max-w-full">
          {(['all', 'pending', 'completed'] as TaskFilterStatus[]).map(status => {
            const labels: Record<TaskFilterStatus, string> = {
              all: 'Todas',
              pending: 'Pendientes',
              completed: 'Completadas'
            };
            const isActive = options.status === status;
            return (
              <button
                key={status}
                onClick={() => onChange({ status })}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex-1 text-center ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {labels[status]}
              </button>
            );
          })}
        </div>

        {isFiltered && (
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors self-end sm:self-auto"
          >
            <X className="w-3.5 h-3.5" />
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
};
