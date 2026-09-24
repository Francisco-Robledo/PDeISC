import React from 'react';

export interface FluidOrbProps {
  variant?: 'indigo-purple' | 'emerald-cyan' | 'amber-rose' | 'slate';
  size?: 'sm' | 'md' | 'lg' | 'full';
  blur?: 'lg' | 'xl' | '2xl' | '3xl';
  className?: string;
  pulse?: boolean;
  float?: boolean;
}

/**
 * FluidOrb - Componente sutil de iluminación ambiental inspirado en Rare UI
 * Diseñado con opacidades balanceadas para no distorsionar ni oscurecer
 * la legibilidad del texto en modo claro ni en modo oscuro.
 */
export function FluidOrb({
  variant = 'indigo-purple',
  size = 'md',
  blur = '3xl',
  className = '',
  pulse = true,
  float = true,
}: FluidOrbProps) {
  // Gradientes sutiles y elegantes
  const variantGradients = {
    'indigo-purple': {
      orb1: 'from-indigo-500/15 via-purple-500/10 to-transparent dark:from-indigo-500/25 dark:via-purple-600/20 dark:to-transparent',
      orb2: 'from-blue-500/10 via-indigo-600/10 to-transparent dark:from-blue-600/20 dark:via-indigo-500/15 dark:to-transparent',
    },
    'emerald-cyan': {
      orb1: 'from-emerald-500/15 via-teal-500/10 to-transparent dark:from-emerald-500/25 dark:via-teal-600/20 dark:to-transparent',
      orb2: 'from-cyan-500/10 via-emerald-600/10 to-transparent dark:from-cyan-600/20 dark:via-emerald-500/15 dark:to-transparent',
    },
    'amber-rose': {
      orb1: 'from-amber-500/15 via-rose-500/10 to-transparent dark:from-amber-500/25 dark:via-rose-600/20 dark:to-transparent',
      orb2: 'from-orange-500/10 via-amber-600/10 to-transparent dark:from-orange-600/20 dark:via-amber-500/15 dark:to-transparent',
    },
    'slate': {
      orb1: 'from-slate-400/10 via-slate-500/10 to-transparent dark:from-slate-600/20 dark:via-slate-700/15 dark:to-transparent',
      orb2: 'from-slate-500/10 via-slate-600/5 to-transparent dark:from-slate-700/15 dark:via-slate-800/10 dark:to-transparent',
    },
  };

  const sizeClasses = {
    sm: 'w-48 h-48',
    md: 'w-72 h-72 sm:w-96 sm:h-96',
    lg: 'w-96 h-96 sm:w-[480px] sm:h-[480px]',
    full: 'w-full h-full inset-0',
  };

  const blurClasses = {
    lg: 'blur-lg',
    xl: 'blur-xl',
    '2xl': 'blur-2xl',
    '3xl': 'blur-3xl',
  };

  const gradient = variantGradients[variant];

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute overflow-hidden select-none z-0 ${className}`}
    >
      <div
        className={`absolute rounded-full bg-gradient-to-tr ${gradient.orb1} ${sizeClasses[size]} ${blurClasses[blur]} ${
          float ? 'animate-orb-float' : ''
        } ${pulse ? 'animate-orb-pulse' : ''}`}
        style={{
          transformOrigin: 'center center',
        }}
      />
      <div
        className={`absolute rounded-full bg-gradient-to-bl ${gradient.orb2} ${sizeClasses[size]} ${blurClasses[blur]} opacity-50 ${
          float ? 'animate-orb-float' : ''
        }`}
        style={{
          transformOrigin: 'bottom right',
          animationDirection: 'reverse',
          animationDuration: '16s',
        }}
      />
    </div>
  );
}

export default FluidOrb;
