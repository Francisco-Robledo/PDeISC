import React, { useCallback, useMemo, useState, useEffect } from 'react';
import type { TaskPriority, TaskCategory, TaskFilterStatus, TaskSortOption } from '../types/task';
import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  FileText,
  Flag,
  Loader2,
  Tag
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface TaskFormValues {
  title: string;
  shortDescription: string;
  description: string;
  priority: TaskPriority;
  category: TaskCategory;
  completed: boolean;
  dueDate: string;
}

interface FormErrors {
  title?: string;
  description?: string;
}

interface TaskFormProps {
  /** Current field values (controlled externally) */
  values: TaskFormValues;
  /** Partial field update callback */
  onChange: (patch: Partial<TaskFormValues>) => void;
  /** Validation errors to display */
  errors: FormErrors;
  /** Whether the form is submitting */
  isSubmitting: boolean;
  /** Submit handler */
  onSubmit: (e: React.FormEvent) => void;
  /** Label for the submit button */
  submitLabel: string;
  /** Cancel button destination or handler */
  onCancel: () => void;
  cancelLabel?: string;
  /** Accent color class for submit button bg (e.g. "bg-blue-600 hover:bg-blue-700") */
  submitColorClass?: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const isDueDateInPast = (dueDate: string): boolean => {
  if (!dueDate) return false;
  const selected = new Date(dueDate + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selected < today;
};

// ─── Component ──────────────────────────────────────────────────────────────

export const TaskForm: React.FC<TaskFormProps> = ({
  values,
  onChange,
  errors,
  isSubmitting,
  onSubmit,
  submitLabel,
  onCancel,
  cancelLabel = 'Cancelar',
  submitColorClass = 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-blue-600/25'
}) => {
  const [originalValues, setOriginalValues] = useState<string>('');

  useEffect(() => {
    if (!originalValues) {
      setOriginalValues(JSON.stringify(values));
    }
  }, [values, originalValues]);

  const isDirty = useMemo(() => {
    if (!originalValues) return false;
    return JSON.stringify(values) !== originalValues;
  }, [values, originalValues]);

  // Warn user on window unload / refresh if form is dirty
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && !isSubmitting) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, isSubmitting]);

  const dueDateIsPast = useMemo(
    () => isDueDateInPast(values.dueDate),
    [values.dueDate]
  );

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange({ title: e.target.value }),
    [onChange]
  );

  const handleShortDescChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange({ shortDescription: e.target.value }),
    [onChange]
  );

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => onChange({ description: e.target.value }),
    [onChange]
  );

  const handlePriorityChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => onChange({ priority: e.target.value as TaskPriority }),
    [onChange]
  );

  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => onChange({ category: e.target.value as TaskCategory }),
    [onChange]
  );

  const handleDueDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange({ dueDate: e.target.value }),
    [onChange]
  );

  const handleCompletedChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange({ completed: e.target.checked }),
    [onChange]
  );

  const handleCancelClick = useCallback(() => {
    if (isDirty) {
      if (window.confirm('Tienes cambios sin guardar en esta tarea. ¿Estás seguro que deseas salir?')) {
        onCancel();
      }
    } else {
      onCancel();
    }
  }, [isDirty, onCancel]);

  return (
    <form onSubmit={onSubmit} className="space-y-5 sm:space-y-6" noValidate>
      {/* Title */}
      <div className="space-y-1.5 sm:space-y-2">
        <label htmlFor="tf-title" className="block text-sm font-bold text-slate-900 dark:text-slate-100">
          Título de la tarea <span className="text-rose-500">*</span>
        </label>
        <input
          id="tf-title"
          type="text"
          value={values.title}
          onChange={handleTitleChange}
          placeholder="Ej: Redactar documentación final del proyecto"
          className={`w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
            errors.title
              ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500'
              : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-500'
          }`}
        />
        {errors.title && (
          <p className="flex items-center gap-1 text-xs font-semibold text-rose-500 animate-in fade-in">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.title}
          </p>
        )}
      </div>

      {/* Short Description */}
      <div className="space-y-1.5 sm:space-y-2">
        <label htmlFor="tf-short-desc" className="block text-sm font-bold text-slate-900 dark:text-slate-100">
          Descripción Corta{' '}
          <span className="text-xs font-normal text-slate-400 dark:text-slate-500">(Opcional, para la tarjeta resumen)</span>
        </label>
        <input
          id="tf-short-desc"
          type="text"
          value={values.shortDescription}
          onChange={handleShortDescChange}
          placeholder="Ej: Resumen en una línea para la vista principal"
          className="w-full px-3.5 sm:px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
      </div>

      {/* Full Description */}
      <div className="space-y-1.5 sm:space-y-2">
        <label htmlFor="tf-description" className="block text-sm font-bold text-slate-900 dark:text-slate-100">
          Descripción Completa <span className="text-rose-500">*</span>
        </label>
        <textarea
          id="tf-description"
          rows={4}
          value={values.description}
          onChange={handleDescriptionChange}
          placeholder="Escribe de manera detallada las instrucciones o pasos para cumplir esta tarea..."
          className={`w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
            errors.description
              ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500'
              : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-500'
          }`}
        />
        {errors.description && (
          <p className="flex items-center gap-1 text-xs font-semibold text-rose-500 animate-in fade-in">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.description}
          </p>
        )}
      </div>

      {/* Priority & Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5 sm:space-y-2">
          <label htmlFor="tf-priority" className="flex items-center gap-1.5 text-sm font-bold text-slate-900 dark:text-slate-100">
            <Flag className="w-4 h-4 text-slate-400" />
            Prioridad
          </label>
          <select
            id="tf-priority"
            value={values.priority}
            onChange={handlePriorityChange}
            className="w-full px-3.5 sm:px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <label htmlFor="tf-category" className="flex items-center gap-1.5 text-sm font-bold text-slate-900 dark:text-slate-100">
            <Tag className="w-4 h-4 text-slate-400" />
            Categoría
          </label>
          <select
            id="tf-category"
            value={values.category}
            onChange={handleCategoryChange}
            className="w-full px-3.5 sm:px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="general">General</option>
            <option value="work">Trabajo</option>
            <option value="personal">Personal</option>
            <option value="study">Estudio</option>
            <option value="finance">Finanzas</option>
          </select>
        </div>
      </div>

      {/* Due Date & Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 sm:pt-2">
        <div className="space-y-1.5 sm:space-y-2">
          <label htmlFor="tf-due-date" className="flex items-center gap-1.5 text-sm font-bold text-slate-900 dark:text-slate-100">
            <Calendar className="w-4 h-4 text-slate-400" />
            Fecha Límite <span className="text-xs font-normal text-slate-400 dark:text-slate-500">(Opcional)</span>
          </label>
          <input
            id="tf-due-date"
            type="date"
            value={values.dueDate}
            onChange={handleDueDateChange}
            className="w-full px-3.5 sm:px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          {values.dueDate && dueDateIsPast && (
            <p className="flex items-center gap-1 text-xs font-semibold text-amber-500 animate-in fade-in">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              La fecha elegida ya pasó. ¿Estás seguro?
            </p>
          )}
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <label className="block text-sm font-bold text-slate-900 dark:text-slate-100">
            Estado de la tarea
          </label>
          <label className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={values.completed}
              onChange={handleCompletedChange}
              className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
            />
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <CheckCircle2 className={`w-4 h-4 ${values.completed ? 'text-emerald-500' : 'text-slate-400'}`} />
              Marcar como completada
            </span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3">
        <button
          type="button"
          onClick={handleCancelClick}
          className="px-5 py-3 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-center"
        >
          {cancelLabel}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed ${submitColorClass}`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              {submitLabel}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export type { TaskFilterStatus, TaskSortOption };
