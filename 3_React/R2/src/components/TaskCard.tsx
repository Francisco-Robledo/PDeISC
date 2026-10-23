import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Task } from '../types/task';
import { useTasks } from '../context/TaskContext';
import { ConfirmModal } from './ConfirmModal';
import { Check, Calendar, ArrowRight, Trash2, Tag, Flag, AlertTriangle, GripVertical } from 'lucide-react';
import { PRIORITY_LABELS, PRIORITY_STYLES, CATEGORY_LABELS } from '../utils/taskLabels';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';

interface TaskCardProps {
  task: Task;
  isDragDisabled?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, isDragDisabled = false }) => {
  const { toggleTaskStatus, deleteTask } = useTasks();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id: task.id,
    disabled: isDragDisabled
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  };

  const formattedDate = new Date(task.createdAt).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const isOverdue = useMemo(() => {
    if (!task.dueDate || task.completed) return false;
    const due = new Date(task.dueDate + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today;
  }, [task.dueDate, task.completed]);

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
        ref={setNodeRef}
        style={style}
        className={`group relative bg-white/95 dark:bg-slate-900/95 border rounded-2xl p-4 sm:p-5 light-card-shadow hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between ${
          task.completed
            ? 'border-slate-200/70 dark:border-slate-800/70 opacity-80 bg-slate-50/50 dark:bg-slate-900/50'
            : isOverdue
            ? 'border-rose-300 dark:border-rose-800/80 hover:border-rose-400 dark:hover:border-rose-700'
            : 'border-slate-200/90 dark:border-slate-800 hover:border-blue-400/70 dark:hover:border-blue-700'
        } ${isDragging ? 'opacity-50 ring-2 ring-blue-500 shadow-2xl scale-[1.02]' : ''}`}
      >
        {isOverdue && (
          <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-rose-500 to-orange-500" />
        )}

        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2.5">
            <div className="flex items-start gap-2 sm:gap-2.5 flex-1 min-w-0">
              {!isDragDisabled && (
                <button
                  {...attributes}
                  {...listeners}
                  className="mt-0.5 p-1 -ml-1 text-slate-300 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400 cursor-grab active:cursor-grabbing transition-colors shrink-0 touch-none"
                  aria-label="Arrastrar para reordenar"
                >
                  <GripVertical className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={() => toggleTaskStatus(task.id)}
                className={`mt-0.5 w-5 h-5 sm:w-6 sm:h-6 shrink-0 rounded-lg border-2 flex items-center justify-center transition-all ${
                  task.completed
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                    : 'border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 bg-white dark:bg-slate-800'
                }`}
                title={task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
              >
                {task.completed && <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />}
              </button>

              <div className="flex-1 min-w-0">
                <Link
                  to={`/task/${task.id}`}
                  className={`font-bold text-sm sm:text-base md:text-lg block transition-colors leading-snug break-words ${
                    task.completed
                      ? 'line-through text-slate-400 dark:text-slate-500'
                      : 'text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  {task.title}
                </Link>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed break-words font-medium">
                  {task.shortDescription}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="p-1.5 shrink-0 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
              title="Eliminar tarea"
              aria-label="Eliminar tarea"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {isOverdue && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[10px] sm:text-[11px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                <AlertTriangle className="w-3 h-3 text-rose-500" />
                Vencida
              </span>
            )}

            <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[10px] sm:text-[11px] font-semibold bg-slate-100/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">
              <Tag className="w-3 h-3 text-slate-400" />
              {CATEGORY_LABELS[task.category] ?? task.category}
            </span>

            <span className={`inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[10px] sm:text-[11px] font-semibold border ${PRIORITY_STYLES[task.priority]}`}>
              <Flag className="w-3 h-3" />
              {PRIORITY_LABELS[task.priority]}
            </span>

            <span className="hidden sm:inline-flex items-center gap-1 text-slate-400 dark:text-slate-500 font-medium">
              <Calendar className="w-3 h-3" />
              {formattedDate}
            </span>
          </div>

          <Link
            to={`/task/${task.id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors shrink-0 py-1"
          >
            Ver detalle
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </motion.div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="¿Eliminar tarea?"
        message={`¿Estás seguro de que deseas eliminar la tarea "${task.title}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={() => { deleteTask(task.id); setShowDeleteModal(false); }}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
};
