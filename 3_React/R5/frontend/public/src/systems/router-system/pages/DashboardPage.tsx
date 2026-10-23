import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import useUsers from '../../../hooks/useUsers';
import SqlStatsCard from '../../../components/SqlStatsCard';
import { 
  Users, 
  Shield, 
  Key, 
  Route, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { RareBadge } from '../../../components/rare-ui';

export function DashboardPage() {
  const { user, token } = useAuth();
  const { stats } = useUsers();
  const location = useLocation();
  const [showToken, setShowToken] = useState<boolean>(false);
  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      
      {/* Banner de Bienvenida con alto contraste en claro y oscuro */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
        <div className="relative z-10">
          <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80">
              <Route className="w-3.5 h-3.5" />
              <span>Navegación: React Router DOM</span>
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">useLocation().pathname: {location.pathname}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-2">
            ¡Hola de nuevo, {user?.name}! 👋
          </h1>
          <div className="flex items-center space-x-2 mt-1.5 flex-wrap gap-y-1">
            <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Rango de cuenta:</span>
            <RareBadge
              variant={isAdmin ? 'admin' : user?.role === 'invitado' ? 'invitado' : 'usuario'}
              label={user?.role}
              size="xs"
              pulse={isAdmin}
            />
            <span className="text-xs text-slate-500 dark:text-slate-400">&middot; Privilegios adaptados según política RBAC.</span>
          </div>
        </div>

        <Link
          to="/router/users"
          className="relative z-10 flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow-xs transition active:scale-95 shrink-0"
        >
          <Users className="w-4 h-4" />
          <span>{isAdmin ? 'Administrar Usuarios (Control Total)' : 'Consultar Directorio (Modo Lectura)'}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Métricas de la BBDD SQL */}
      <SqlStatsCard stats={stats} />

      {/* Grid de Estado de Seguridad, Permisos y Persistencia */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Tarjeta de Control de Acceso por Rango (RBAC) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors md:col-span-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-2 mb-4">
            <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-bold">
              <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-base">Permisos y Control de Acceso por Rango (RBAC)</h3>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">Rango Sesión:</span>
              <RareBadge
                variant={isAdmin ? 'admin' : user?.role === 'invitado' ? 'invitado' : 'usuario'}
                label={user?.role}
                size="xs"
                pulse={isAdmin}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            
            {/* Tarjeta Administrador */}
            <div className={`p-4 rounded-2xl border transition ${
              user?.role === 'admin'
                ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-600 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 opacity-70'
            }`}>
              <div className="font-bold text-slate-900 dark:text-white mb-2 flex items-center justify-between">
                <span>Rango: Administrador</span>
                {user?.role === 'admin' && (
                  <RareBadge variant="admin" label="TU RANGO" size="xs" pulse />
                )}
              </div>
              <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 text-[11px]">
                <li>✅ Crear nuevos usuarios en SQL</li>
                <li>✅ Modificar cualquier cuenta</li>
                <li>✅ Eliminar usuarios (excepto el propio)</li>
                <li>✅ Cambiar roles y estados 3FN</li>
                <li>✅ Acceso a métricas globales de BBDD</li>
              </ul>
            </div>

            {/* Tarjeta Usuario */}
            <div className={`p-4 rounded-2xl border transition ${
              user?.role === 'usuario'
                ? 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-300 dark:border-indigo-600 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 opacity-70'
            }`}>
              <div className="font-bold text-slate-900 dark:text-white mb-2 flex items-center justify-between">
                <span>Rango: Usuario Estándar</span>
                {user?.role === 'usuario' && (
                  <RareBadge variant="usuario" label="TU RANGO" size="xs" pulse />
                )}
              </div>
              <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 text-[11px]">
                <li>✅ Visualizar listado de usuarios</li>
                <li>✅ Editar datos de su propio perfil</li>
                <li>❌ Creación de cuentas bloqueada</li>
                <li>❌ Eliminación de usuarios bloqueada</li>
                <li>❌ Modificación de roles bloqueada</li>
              </ul>
            </div>

            {/* Tarjeta Invitado */}
            <div className={`p-4 rounded-2xl border transition ${
              user?.role === 'invitado'
                ? 'bg-slate-100 dark:bg-slate-800 border-slate-400 dark:border-slate-600 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 opacity-70'
            }`}>
              <div className="font-bold text-slate-900 dark:text-white mb-2 flex items-center justify-between">
                <span>Rango: Invitado</span>
                {user?.role === 'invitado' && (
                  <RareBadge variant="invitado" label="TU RANGO" size="xs" pulse />
                )}
              </div>
              <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 text-[11px]">
                <li>✅ Visualización de métricas generales</li>
                <li>✅ Lectura de listado en modo visita</li>
                <li>❌ Creación de cuentas bloqueada</li>
                <li>❌ Edición de cuentas bloqueada</li>
                <li>❌ Eliminación de cuentas bloqueada</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tarjeta de Sesión y Token JWT */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-bold mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Key className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base">Protección de Datos: Token JWT en Cliente</h3>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
            Cada petición protegida transmite este token en <code className="text-indigo-700 dark:text-indigo-300 font-semibold font-mono">Authorization: Bearer</code>, verificado contra la BBDD SQL física.
          </p>

          <div className="bg-slate-950 text-slate-200 p-3.5 rounded-2xl text-xs font-mono break-all relative border border-slate-800 dark:border-slate-700">
            <div className="flex items-center justify-between mb-1 pb-1 border-b border-slate-800 text-[10px] text-slate-400">
              <span>Token de sesión actual:</span>
              <button
                onClick={() => setShowToken(!showToken)}
                className="text-indigo-400 hover:underline"
                type="button"
              >
                {showToken ? 'Ocultar' : 'Mostrar completo'}
              </button>
            </div>
            {showToken ? token : `${token?.substring(0, 48)}...[TOKEN FIRMADO]`}
          </div>

          <div className="mt-4 flex items-center space-x-2 text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>Persistencia activa: Al recargar (F5), la sesión se restaura desde localStorage.</span>
          </div>
        </div>

        {/* Tarjeta de Rutas Protegidas en React Router */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-bold mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base">Arquitectura React Router Implementada</h3>
          </div>

          <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
            <li className="flex items-start space-x-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shrink-0"></span>
              <div>
                <strong className="text-slate-900 dark:text-white">Rutas Protegidas:</strong> Enrutamiento bajo componente <code>&lt;ProtectedRoute&gt;</code> que intercepta usuarios sin sesión y los redirige con <code>&lt;Navigate to="/router/login" replace /&gt;</code>.
              </div>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shrink-0"></span>
              <div>
                <strong className="text-slate-900 dark:text-white">Historial y URLs:</strong> Soporte completo para navegación por URLs, marcadores y flechas del navegador.
              </div>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shrink-0"></span>
              <div>
                <strong className="text-slate-900 dark:text-white">Esquema 3FN:</strong> Integración estricta con la tabla de roles y usuarios mediante llaves foráneas.
              </div>
            </li>
          </ul>
        </div>

      </div>

    </div>
  );
}

export default DashboardPage;
