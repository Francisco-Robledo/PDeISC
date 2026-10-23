import React from 'react';
import { Shield, User as UserIcon, Eye, Database, CheckCircle2, Clock } from 'lucide-react';

export type RareBadgeVariant = 
  | 'admin' 
  | 'usuario' 
  | 'invitado' 
  | 'activo' 
  | 'inactivo' 
  | 'sql' 
  | 'jwt'
  | 'google'
  | 'facebook'
  | 'x'
  | 'discord'
  | 'github';

export interface RareBadgeProps {
  variant: RareBadgeVariant;
  label?: string;
  size?: 'xs' | 'sm' | 'md';
  pulse?: boolean;
  className?: string;
}

/**
 * RareBadge - Badge y Pastilla de Estado con contraste AAA y micro-indicadores
 * Diseñado con legibilidad perfecta tanto en fondo claro (#f8fafc) como oscuro (#020617).
 */
export function RareBadge({
  variant,
  label,
  size = 'sm',
  pulse = true,
  className = '',
}: RareBadgeProps) {
  // Configuración de estilo con alto contraste en claro y oscuro
  const variantConfig = {
    admin: {
      defaultLabel: 'Admin',
      icon: Shield,
      wrapperClasses:
        'bg-amber-50 text-amber-900 border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-700/80 shadow-xs',
      dotClasses: 'bg-amber-500',
    },
    usuario: {
      defaultLabel: 'Usuario',
      icon: UserIcon,
      wrapperClasses:
        'bg-indigo-50 text-indigo-900 border-indigo-200 dark:bg-indigo-950/70 dark:text-indigo-300 dark:border-indigo-700/80 shadow-xs',
      dotClasses: 'bg-indigo-500',
    },
    invitado: {
      defaultLabel: 'Invitado',
      icon: Eye,
      wrapperClasses:
        'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 shadow-xs',
      dotClasses: 'bg-slate-400',
    },
    activo: {
      defaultLabel: 'Activo',
      icon: CheckCircle2,
      wrapperClasses:
        'bg-emerald-50 text-emerald-900 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-700/80 shadow-xs',
      dotClasses: 'bg-emerald-500',
    },
    inactivo: {
      defaultLabel: 'Inactivo',
      icon: Clock,
      wrapperClasses:
        'bg-rose-50 text-rose-900 border-rose-300 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-700/80 shadow-xs',
      dotClasses: 'bg-rose-500',
    },
    sql: {
      defaultLabel: 'SQL 3FN',
      icon: Database,
      wrapperClasses:
        'bg-cyan-50 text-cyan-900 border-cyan-300 dark:bg-cyan-950/70 dark:text-cyan-300 dark:border-cyan-700/80 shadow-xs',
      dotClasses: 'bg-cyan-500',
    },
    jwt: {
      defaultLabel: 'JWT Bearer',
      icon: Shield,
      wrapperClasses:
        'bg-purple-50 text-purple-900 border-purple-300 dark:bg-purple-950/70 dark:text-purple-300 dark:border-purple-700/80 shadow-xs',
      dotClasses: 'bg-purple-500',
    },
    google: {
      defaultLabel: 'Google',
      icon: Shield,
      wrapperClasses:
        'bg-red-50 text-red-900 border-red-200 dark:bg-red-950/70 dark:text-red-300 dark:border-red-800 shadow-xs',
      dotClasses: 'bg-red-500',
    },
    facebook: {
      defaultLabel: 'Facebook',
      icon: Shield,
      wrapperClasses:
        'bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-800 shadow-xs',
      dotClasses: 'bg-blue-600',
    },
    x: {
      defaultLabel: 'X',
      icon: Shield,
      wrapperClasses:
        'bg-slate-100 text-slate-900 border-slate-300 dark:bg-slate-800 dark:text-white dark:border-slate-700 shadow-xs',
      dotClasses: 'bg-slate-800 dark:bg-slate-200',
    },
    discord: {
      defaultLabel: 'Discord',
      icon: Shield,
      wrapperClasses:
        'bg-indigo-50 text-indigo-900 border-indigo-200 dark:bg-indigo-950/70 dark:text-indigo-300 dark:border-indigo-800 shadow-xs',
      dotClasses: 'bg-[#5865F2]',
    },
    github: {
      defaultLabel: 'GitHub',
      icon: Shield,
      wrapperClasses:
        'bg-slate-100 text-slate-900 border-slate-300 dark:bg-slate-800/90 dark:text-white dark:border-slate-700 shadow-xs',
      dotClasses: 'bg-[#24292e] dark:bg-white',
    },
  };

  const sizeStyles = {
    xs: {
      container: 'px-2 py-0.5 text-[10px] space-x-1 font-semibold',
      icon: 'w-2.5 h-2.5',
      dot: 'w-1.5 h-1.5',
    },
    sm: {
      container: 'px-2.5 py-0.5 text-[11px] space-x-1.5 font-semibold',
      icon: 'w-3 h-3',
      dot: 'w-1.5 h-1.5',
    },
    md: {
      container: 'px-3 py-1 text-xs space-x-2 font-semibold',
      icon: 'w-3.5 h-3.5',
      dot: 'w-2 h-2',
    },
  };

  const config = variantConfig[variant];
  const sizeConfig = sizeStyles[size];
  const IconComponent = config.icon;
  const displayLabel = label || config.defaultLabel;

  return (
    <span
      className={`inline-flex items-center rounded-full border transition-colors select-none ${sizeConfig.container} ${config.wrapperClasses} ${className}`}
    >
      {/* Indicador pulsante estilo Rare UI */}
      {pulse && (
        <span className="relative flex shrink-0 items-center justify-center">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dotClasses}`}
          />
          <span className={`relative inline-flex rounded-full ${sizeConfig.dot} ${config.dotClasses}`} />
        </span>
      )}

      {/* Icono de variante */}
      <IconComponent className={`${sizeConfig.icon} shrink-0`} />

      {/* Etiqueta */}
      <span className="capitalize tracking-tight leading-none">{displayLabel}</span>
    </span>
  );
}

export default RareBadge;
