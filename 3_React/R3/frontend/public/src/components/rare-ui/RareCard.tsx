import React from 'react';
import FluidOrb from './FluidOrb';

export interface RareCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: 'indigo' | 'emerald' | 'amber' | 'none';
  withOrb?: boolean;
  orbVariant?: 'indigo-purple' | 'emerald-cyan' | 'amber-rose' | 'slate';
  interactive?: boolean;
}

/**
 * RareCard - Tarjeta estética estilo Rare UI (rareui.com)
 * Incorpora borde con gradiente perimetral, desenfoque de fondo glassmorphism,
 * orbe fluido ambiental opcional y elevación responsiva.
 */
export function RareCard({
  children,
  className = '',
  glow = 'indigo',
  withOrb = false,
  orbVariant = 'indigo-purple',
  interactive = false,
}: RareCardProps) {
  const glowBorders = {
    indigo:
      'bg-gradient-to-b from-indigo-500/30 via-slate-200/50 to-slate-200/20 dark:from-indigo-500/30 dark:via-slate-800/60 dark:to-slate-800/30 hover:from-indigo-500/50',
    emerald:
      'bg-gradient-to-b from-emerald-500/30 via-slate-200/50 to-slate-200/20 dark:from-emerald-500/30 dark:via-slate-800/60 dark:to-slate-800/30 hover:from-emerald-500/50',
    amber:
      'bg-gradient-to-b from-amber-500/30 via-slate-200/50 to-slate-200/20 dark:from-amber-500/30 dark:via-slate-800/60 dark:to-slate-800/30 hover:from-amber-500/50',
    none: 'bg-slate-200/80 dark:bg-slate-800',
  };

  return (
    <div
      className={`group relative rounded-3xl p-[1px] transition-all duration-300 ${
        glowBorders[glow]
      } ${
        interactive ? 'hover:-translate-y-0.5 hover:shadow-xl cursor-pointer' : 'shadow-sm'
      } ${className}`}
    >
      {/* Contenedor Interior */}
      <div className="relative h-full w-full rounded-[23px] bg-white/95 dark:bg-slate-900/90 backdrop-blur-md overflow-hidden transition-colors">
        {/* Orbe fluido ambiental si está habilitado */}
        {withOrb && (
          <FluidOrb
            variant={orbVariant}
            size="md"
            blur="3xl"
            className="-top-12 -right-12 opacity-40 dark:opacity-60 pointer-events-none"
          />
        )}

        {/* Contenido */}
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
}

export default RareCard;
