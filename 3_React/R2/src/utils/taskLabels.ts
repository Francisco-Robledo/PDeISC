import type { TaskPriority, TaskCategory } from '../types/task';

// Priority display labels
export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  high: 'Alta',
  medium: 'Media',
  low: 'Baja'
};

// Priority full labels (for detail view)
export const PRIORITY_LABELS_FULL: Record<TaskPriority, string> = {
  high: 'Prioridad Alta',
  medium: 'Prioridad Media',
  low: 'Prioridad Baja'
};

// Priority badge CSS classes
export const PRIORITY_STYLES: Record<TaskPriority, string> = {
  high: 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  medium: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  low: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
};

// Category display labels
export const CATEGORY_LABELS: Record<TaskCategory, string> = {
  work: 'Trabajo',
  personal: 'Personal',
  study: 'Estudio',
  finance: 'Finanzas',
  general: 'General'
};
