import React, { useEffect, useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TOAST_DURATION_MS = 3500;

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useTasks();

  return (
    <div className="fixed bottom-20 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4">
      <AnimatePresence initial={false}>
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} duration={TOAST_DURATION_MS} />
        ))}
      </AnimatePresence>
    </div>
  );
};

interface ToastItemProps {
  toast: { id: string; message: string; type: 'success' | 'info' | 'error' };
  onRemove: (id: string) => void;
  duration: number;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove, duration }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = 50; // ms between progress updates
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - step;
      });
    }, interval);

    const dismissTimer = setTimeout(() => onRemove(toast.id), duration);

    return () => {
      clearInterval(timer);
      clearTimeout(dismissTimer);
    };
  }, [toast.id, onRemove, duration]);

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={`pointer-events-auto flex flex-col rounded-2xl shadow-xl border overflow-hidden backdrop-blur-md ${
        isSuccess
          ? 'bg-emerald-50/95 text-emerald-900 border-emerald-200 dark:bg-emerald-950/90 dark:text-emerald-100 dark:border-emerald-800'
          : isError
          ? 'bg-rose-50/95 text-rose-900 border-rose-200 dark:bg-rose-950/90 dark:text-rose-100 dark:border-rose-800'
          : 'bg-blue-50/95 text-blue-900 border-blue-200 dark:bg-blue-950/90 dark:text-blue-100 dark:border-blue-800'
      }`}
    >
      <div className="flex items-center justify-between p-4 gap-3">
        <div className="flex items-center gap-3">
          {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />}
          {isError && <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />}
          {!isSuccess && !isError && <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />}
          <span className="text-sm font-medium leading-snug">{toast.message}</span>
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 transition-colors shrink-0"
          aria-label="Cerrar notificación"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Auto-dismiss progress bar */}
      <div className="h-1 w-full bg-black/5 dark:bg-white/10">
        <div
          className={`h-full transition-none ${
            isSuccess ? 'bg-emerald-500' : isError ? 'bg-rose-500' : 'bg-blue-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  );
};
