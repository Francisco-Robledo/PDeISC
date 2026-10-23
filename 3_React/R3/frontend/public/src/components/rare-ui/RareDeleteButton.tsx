import React, { useState, useEffect } from 'react';
import { Trash2, Check, X } from 'lucide-react';

export interface RareDeleteButtonProps {
  onConfirm: () => void;
  disabled?: boolean;
  title?: string;
  size?: 'sm' | 'md';
  compact?: boolean; // Solo icono en reposo
  itemName?: string;
  directModal?: boolean; // Abre directamente el modal de confirmación principal
}

/**
 * RareDeleteButton - Botón interactivo de eliminación inspirado en Rare UI (rareui.com)
 * Presenta micro-interacción con animación de tapa de papelera y confirmación
 * modal o inline táctil.
 */
export function RareDeleteButton({
  onConfirm,
  disabled = false,
  title = 'Eliminar elemento',
  size = 'sm',
  compact = false,
  itemName,
  directModal = true,
}: RareDeleteButtonProps) {
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);

  // Auto-cancelar confirmación si el usuario no interactúa en 4 segundos
  useEffect(() => {
    if (!isConfirming) return;
    const timer = setTimeout(() => {
      setIsConfirming(false);
    }, 4500);
    return () => clearTimeout(timer);
  }, [isConfirming]);

  const handleStartConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    if (directModal) {
      onConfirm();
      return;
    }
    setIsConfirming(true);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsConfirming(false);
  };

  const handleExecuteDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleted(true);
    setTimeout(() => {
      onConfirm();
      setIsConfirming(false);
      setIsDeleted(false);
    }, 200);
  };

  const sizeClasses = size === 'sm' ? 'text-xs py-1.5 px-2.5' : 'text-sm py-2 px-3.5';

  if (disabled) {
    return (
      <button
        type="button"
        disabled
        title={title}
        className={`inline-flex items-center space-x-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 bg-slate-100 dark:bg-slate-800/40 opacity-40 cursor-not-allowed ${sizeClasses}`}
      >
        <Trash2 className="w-3.5 h-3.5" />
        {!compact && <span>Eliminar</span>}
      </button>
    );
  }

  // Estado interactivo de confirmación inline (Firma Rare UI)
  if (isConfirming) {
    return (
      <div
        className="inline-flex items-center space-x-1.5 bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-700/80 rounded-xl p-1 shadow-sm animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-[11px] font-bold text-rose-700 dark:text-rose-300 pl-1.5 select-none">
          ¿Seguro?
        </span>

        {/* Botón Confirmar */}
        <button
          type="button"
          onClick={handleExecuteDelete}
          title={itemName ? `Confirmar eliminar a ${itemName}` : 'Confirmar eliminación'}
          className="p-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-transform active:scale-90"
        >
          <Check className="w-3.5 h-3.5" />
        </button>

        {/* Botón Cancelar */}
        <button
          type="button"
          onClick={handleCancel}
          title="Cancelar"
          className="p-1 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-transform active:scale-90"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  // Estado normal (reposo) con animación de hover en el icono
  return (
    <button
      type="button"
      onClick={handleStartConfirm}
      title={title}
      className={`group relative inline-flex items-center space-x-1.5 rounded-xl border border-rose-200/90 dark:border-rose-900/60 bg-white/80 dark:bg-slate-900/80 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-600 dark:hover:text-white hover:border-transparent shadow-xs transition-all duration-200 active:scale-95 ${sizeClasses} ${
        isDeleted ? 'opacity-50 scale-95' : ''
      }`}
    >
      <Trash2 className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-rotate-12 group-hover:scale-110" />
      {!compact && <span className="font-medium">Eliminar</span>}
    </button>
  );
}

export default RareDeleteButton;
