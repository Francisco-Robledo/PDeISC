import React from 'react';

export interface RareTabOption<T extends string> {
  id: T;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

export interface RareTabsProps<T extends string> {
  options: RareTabOption<T>[];
  activeId: T;
  onChange: (id: T) => void;
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * RareTabs - Control Segmentado interactivo estilo Rare UI (rareui.com)
 * Proporciona una transición táctil y fluida entre modos (ej: Tarjetas vs Tabla,
 * o Router vs useState) con indicador flotante y soporte multi-tema.
 */
export function RareTabs<T extends string>({
  options,
  activeId,
  onChange,
  size = 'sm',
  className = '',
}: RareTabsProps<T>) {
  const sizeStyles = {
    sm: 'p-1 text-xs',
    md: 'p-1.5 text-sm',
  };

  const buttonPadding = {
    sm: 'px-3 py-1.5',
    md: 'px-4 py-2',
  };

  return (
    <div
      role="tablist"
      className={`inline-flex items-center rounded-2xl bg-slate-100 dark:bg-slate-800/90 p-1 border border-slate-200 dark:border-slate-700/70 shadow-xs ${sizeStyles[size]} ${className}`}
    >
      {options.map((option) => {
        const isActive = activeId === option.id;
        const Icon = option.icon;

        return (
          <button
            key={option.id}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => onChange(option.id)}
            className={`relative flex items-center space-x-1.5 rounded-xl font-medium transition-all duration-200 select-none ${
              buttonPadding[size]
            } ${
              isActive
                ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-750'
            }`}
          >
            {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
            <span>{option.label}</span>

            {option.badge !== undefined && (
              <span
                className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  isActive
                    ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {option.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default RareTabs;
