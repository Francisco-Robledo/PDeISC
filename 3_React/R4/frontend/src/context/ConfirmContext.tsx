import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { ConfirmPopup, type ConfirmPopupOptions } from '../components/ConfirmPopup';

type ConfirmFn = (options: ConfirmPopupOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    options: ConfirmPopupOptions;
  }>({
    isOpen: false,
    options: {
      title: 'Confirmar Acción',
      message: '¿Estás seguro de continuar?',
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      variant: 'danger',
    },
  });

  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback((options: ConfirmPopupOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setDialogState({
        isOpen: true,
        options: {
          confirmText: options.confirmText || (options.variant === 'danger' ? 'Eliminar' : 'Confirmar'),
          cancelText: options.cancelText || 'Cancelar',
          variant: options.variant || 'danger',
          ...options,
        },
      });
    });
  }, []);

  const handleClose = useCallback((result: boolean) => {
    setDialogState((prev) => ({ ...prev, isOpen: false }));
    if (resolverRef.current) {
      resolverRef.current(result);
      resolverRef.current = null;
    }
  }, []);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {dialogState.isOpen && (
        <ConfirmPopup
          options={dialogState.options}
          onConfirm={() => handleClose(true)}
          onCancel={() => handleClose(false)}
        />
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
}
