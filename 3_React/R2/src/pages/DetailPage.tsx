import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';
import { useTasks } from '../context/TaskContext';
import { ConfirmModal } from '../components/ConfirmModal';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Trash2,
  Tag,
  Flag,
  AlertCircle,
  Share2,
  FileText,
  Pencil
} from 'lucide-react';
import { PRIORITY_LABELS_FULL, PRIORITY_STYLES, CATEGORY_LABELS } from '../utils/taskLabels';

export const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTaskById, toggleTaskStatus, deleteTask, showToast } = useTasks();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const task = id ? getTaskById(id) : undefined;

  usePageTitle(task ? task.title : 'Tarea no encontrada');

  if (!task) {
    return (
      <div className="py-16 text-center space-y-6 animate-in fade-in duration-300">
        <div className="w-20 h-20 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-10 h-10" />
        </div>
        <div className="space-y-2 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Tarea no encontrada</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            La tarea especificada no existe o fue eliminada previamente.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a la Lista de Tareas
        </Link>
      </div>
    );
  }

  const formattedCreated = new Date(task.createdAt).toLocaleString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => showToast('Enlace de la tarea copiado al portapapeles', 'info'))
        .catch(() => showToast('No se pudo copiar el enlace automáticamente', 'error'));
    } else {
      showToast('Copia manualmente: ' + window.location.href, 'info');
    }
  };

  return (
    <div className="py-6 sm:py-8 space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Navigation Top Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          to="/"
          className="inline-flex items-center justify-center sm:justify-start gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors w-full sm:w-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Inicio
        </Link>

        <div className="flex items-center justify-end gap-2 w-full sm:w-auto">
          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            title="Copiar enlace"
            aria-label="Copiar enlace de esta tarea"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <Link
            to={`/task/${task.id}/edit`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 hover:bg-blue-100 dark:hover:bg-blue-950/80 transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Editar
          </Link>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 dark:hover:bg-rose-950/80 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Eliminar
          </button>
        </div>
      </div>

      {/* Main Task Detail Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 shadow-sm space-y-6 sm:space-y-8 transition-colors">
        {/* Status banner and header metadata */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Indicator */}
            <span
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${
                task.completed
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
              }`}
            >
              {task.completed ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Completada
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4" />
                  Incompleta (Pendiente)
                </>
              )}
            </span>

            {/* Priority Badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${PRIORITY_STYLES[task.priority]}`}
            >
              <Flag className="w-3.5 h-3.5" />
              {PRIORITY_LABELS_FULL[task.priority]}
            </span>

            {/* Category Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              {CATEGORY_LABELS[task.category] ?? task.category}
            </span>
          </div>

          {/* Toggle status action button */}
          <button
            onClick={() => toggleTaskStatus(task.id)}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm w-full sm:w-auto text-center shrink-0 ${
              task.completed
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {task.completed ? 'Marcar Incompleta' : 'Marcar Completa'}
          </button>
        </div>

        {/* Task Title */}
        <div className="space-y-2">
          <h1
            className={`text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight leading-snug break-words ${
              task.completed ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-900 dark:text-slate-100'
            }`}
          >
            {task.title}
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 italic break-words">
            "{task.shortDescription}"
          </p>
        </div>

        {/* Task Full Description */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Descripción Completa
          </h3>
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
            {task.description}
          </div>
        </div>

        {/* Timestamps & Info Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100/60 dark:border-slate-800/60">
            <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
            <div>
              <span className="text-slate-400 block font-medium">Fecha de Creación</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{formattedCreated}</span>
            </div>
          </div>

          {task.dueDate && (
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100/60 dark:border-slate-800/60">
              <Clock className="w-4 h-4 text-amber-500 shrink-0" />
              <div>
                <span className="text-slate-400 block font-medium">Fecha Límite (Vencimiento)</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {new Date(task.dueDate + 'T00:00:00').toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="¿Eliminar esta tarea?"
        message={`¿Confirma que desea borrar permanentemente la tarea "${task.title}"?`}
        confirmText="Eliminar permanentemente"
        cancelText="Cancelar"
        onConfirm={() => {
          deleteTask(task.id);
          setShowDeleteModal(false);
          navigate('/');
        }}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};
