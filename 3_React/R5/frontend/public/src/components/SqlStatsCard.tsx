import React from 'react';
import { Database, ShieldCheck, Users, KeyRound, Server } from 'lucide-react';
import { DatabaseStats } from '../types';
import { RareBadge } from './rare-ui';

interface SqlStatsCardProps {
  stats: DatabaseStats | null;
}

export function SqlStatsCard({ stats }: SqlStatsCardProps) {
  if (!stats) return null;

  return (
    <div className="relative bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 mb-6 transition-all duration-300 overflow-hidden">
      
      {/* Contenido en primer plano */}
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800/80 rounded-2xl text-indigo-600 dark:text-indigo-400 shadow-xs">
              <Database className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  Base de Datos SQL Relacional (3FN)
                </h2>
                <RareBadge variant="activo" label="Conectada" size="xs" pulse />
                <RareBadge variant="sql" label="3FN SQLite" size="xs" pulse={false} />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Normalización BBDD: <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{stats.normalization}</span> &middot; Roles y Usuarios vinculados por FK
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs bg-slate-100 dark:bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-slate-600 dark:text-slate-300">Seguridad:</span>
            <span className="text-indigo-700 dark:text-indigo-300 font-mono text-[11px] font-semibold">{stats.security}</span>
          </div>
        </div>

        {/* Métricas Bento con alto contraste y adaptación en claro y oscuro */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-4">
          
          {/* Métrica 1: Usuarios Totales */}
          <div className="group bg-slate-50 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/70 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all duration-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 text-xs font-medium">
              <span>Usuarios Totales</span>
              <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1.5">{stats.totalUsers}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">En tabla <code className="text-indigo-600 dark:text-indigo-300 font-mono">users</code></div>
          </div>

          {/* Métrica 2: Usuarios Activos */}
          <div className="group bg-emerald-50/50 dark:bg-slate-800/70 hover:bg-emerald-50 dark:hover:bg-slate-800 p-4 rounded-2xl border border-emerald-200 dark:border-slate-700/70 hover:border-emerald-300 dark:hover:border-emerald-500/50 transition-all duration-200 shadow-xs">
            <div className="flex items-center justify-between text-emerald-900 dark:text-slate-300 text-xs font-medium">
              <span>Usuarios Activos</span>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1.5">{stats.activeUsers}</div>
            <div className="text-[11px] text-emerald-800/70 dark:text-slate-400 mt-0.5">{stats.inactiveUsers} inactivos</div>
          </div>

          {/* Métrica 3: Administradores */}
          <div className="group bg-amber-50/50 dark:bg-slate-800/70 hover:bg-amber-50 dark:hover:bg-slate-800 p-4 rounded-2xl border border-amber-200 dark:border-slate-700/70 hover:border-amber-300 dark:hover:border-amber-500/50 transition-all duration-200 shadow-xs">
            <div className="flex items-center justify-between text-amber-900 dark:text-slate-300 text-xs font-medium">
              <span>Administradores</span>
              <KeyRound className="w-4 h-4 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-400 mt-1.5">{stats.adminUsers}</div>
            <div className="text-[11px] text-amber-800/70 dark:text-slate-400 mt-0.5">FK rol id=1</div>
          </div>

          {/* Métrica 4: Roles Relacionales */}
          <div className="group bg-purple-50/50 dark:bg-slate-800/70 hover:bg-purple-50 dark:hover:bg-slate-800 p-4 rounded-2xl border border-purple-200 dark:border-slate-700/70 hover:border-purple-300 dark:hover:border-purple-500/50 transition-all duration-200 shadow-xs">
            <div className="flex items-center justify-between text-purple-900 dark:text-slate-300 text-xs font-medium">
              <span>Roles Relacionales</span>
              <Server className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-400 mt-1.5">{stats.rolesCount}</div>
            <div className="text-[11px] text-purple-800/70 dark:text-slate-400 mt-0.5">Tabla <code className="text-purple-600 dark:text-purple-300 font-mono">roles</code> (3FN)</div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default SqlStatsCard;
