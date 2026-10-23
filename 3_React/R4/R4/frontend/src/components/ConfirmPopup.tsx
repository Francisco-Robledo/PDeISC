import { useEffect, useRef } from 'react';
import { Trash2, AlertTriangle, HelpCircle, X } from 'lucide-react';

export interface ConfirmPopupOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

interface ConfirmPopupProps {
  options: ConfirmPopupOptions;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmPopup({ options, onConfirm, onCancel }: ConfirmPopupProps) {
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  const {
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant = 'danger'
  } = options;

  useEffect(() => {
    // Focus confirmation button when opened
    confirmBtnRef.current?.focus();
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onCancel]);

  const renderIcon = () => {
    switch (variant) {
      case 'warning':
        return (
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-6 h-6" />
          </div>
        );
      case 'info':
        return (
          <div className="p-3 rounded-2xl bg-blue-500/10 text-[#4285F4] dark:text-blue-400 border border-blue-500/20">
            <HelpCircle className="w-6 h-6" />
          </div>
        );
      case 'danger':
      default:
        return (
          <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <Trash2 className="w-6 h-6" />
          </div>
        );
    }
  };

  const getConfirmButtonStyle = () => {
    switch (variant) {
      case 'warning':
        return 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-amber-500/20';
      case 'info':
        return 'bg-[#4285F4] hover:bg-[#3367D6] text-white shadow-blue-500/25';
      case 'danger':
      default:
        return 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/25';
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div
        className="bg-white dark:bg-[#1E2023] rounded-3xl shadow-2xl max-w-sm sm:max-w-md w-full border border-slate-200 dark:border-slate-800 overflow-hidden p-6 sm:p-7 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3.5">
            {renderIcon()}
            <div>
              <h3
                id="confirm-dialog-title"
                className="font-bold text-base sm:text-lg text-slate-900 dark:text-white"
              >
                {title}
              </h3>
            </div>
          </div>
          <button
            onClick={onCancel}
            type="button"
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Cerrar confirmación"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
          {message}
        </p>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
          >
            {cancelText}
          </button>
          <button
            ref={confirmBtnRef}
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2.5 text-xs font-semibold rounded-xl shadow-md transition active:scale-95 ${getConfirmButtonStyle()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmPopup;
