import React, { useState } from 'react';
import { 
  Edit2, 
  Shield, 
  Search, 
  RefreshCw, 
  PlusCircle, 
  AlertTriangle, 
  LayoutGrid, 
  List, 
  Mail, 
  Calendar 
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { User } from '../types';
import { RareTabs, RareBadge, RareDeleteButton } from './rare-ui';

interface UserTableProps {
  users: User[];
  loading: boolean;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onOpenCreate: () => void;
  onOpenEdit: (u: User) => void;
  onRequestDelete: (u: User) => void;
  onReload: () => void;
}

export function UserTable({
  users,
  loading,
  searchTerm,
  onSearchChange,
  onOpenCreate,
  onOpenEdit,
  onRequestDelete,
  onReload,
}: UserTableProps) {
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';
  const isGuest = currentUser?.role === 'invitado';

  // Modo de visualización: 'cards' (tarjetas responsivas sin scroll) o 'table' (tabla fluida)
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors w-full">
      
      {/* Barra superior de controles responsiva con RareTabs */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/60 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5">
        
        {/* Buscador reactivo */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre, correo o rol..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-800 transition"
          />
        </div>

        {/* Acciones y Conmutador de Vista Estilo Rare UI */}
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-2.5">
          
          {/* Selector Segmentado Rare UI: Tarjetas vs Tabla */}
          <RareTabs<'cards' | 'table'>
            options={[
              { id: 'cards', label: 'Tarjetas', icon: LayoutGrid },
              { id: 'table', label: 'Tabla', icon: List },
            ]}
            activeId={viewMode}
            onChange={(mode) => setViewMode(mode)}
            size="sm"
          />

          {/* Botón de refresco */}
          <button
            onClick={onReload}
            disabled={loading}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl transition disabled:opacity-50"
            title="Refrescar datos desde la BBDD SQL"
            type="button"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>

          {/* Botón Nuevo Usuario condicional por Rango */}
          {isAdmin ? (
            <button
              onClick={onOpenCreate}
              type="button"
              className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl shadow-xs transition active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Nuevo Usuario (Admin)</span>
            </button>
          ) : (
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs border border-slate-200 dark:border-slate-700 font-medium">
              <Shield className="w-3.5 h-3.5 text-amber-500" />
              <span>Rango {currentUser?.role || 'usuario'}: Solo Lectura</span>
            </div>
          )}

        </div>
      </div>

      {/* Estados de Carga y Vacío */}
      {loading && users.length === 0 ? (
        <div className="text-center py-16 text-slate-400 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
          <span className="text-xs sm:text-sm">Consultando tabla SQL normalizada (3FN)...</span>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 text-slate-500 dark:text-slate-400 flex flex-col items-center justify-center space-y-2">
          <AlertTriangle className="w-8 h-8 text-amber-500" />
          <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">No se encontraron usuarios en la base de datos SQL.</span>
          <p className="text-xs text-slate-500 dark:text-slate-400">Intenta cambiar el término de búsqueda o refrescar la lista.</p>
        </div>
      ) : viewMode === 'cards' ? (
        
        /* ========================================================================= */
        /* 1. MODO TARJETAS: NÍTIDAS EN CLARO Y OSCURO, CERO SCROLL HORIZONTAL     */
        /* ========================================================================= */
        <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((item) => {
            const isCurrent = currentUser?.id === item.id;
            return (
              <div
                key={item.id}
                className="group relative bg-white dark:bg-slate-800/70 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500/60 dark:hover:bg-slate-800 transition-all duration-200"
              >
                <div>
                  {/* Encabezado de la Tarjeta */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center space-x-2.5">
                      {item.avatar ? (
                        <img
                          src={item.avatar}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-2xl object-cover border border-indigo-200/80 dark:border-indigo-800/80 shadow-xs shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                          {item.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white text-sm flex items-center space-x-1.5 flex-wrap">
                          <span>{item.name}</span>
                          {isCurrent && (
                            <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.2 rounded font-bold">
                              Tú
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">ID SQL: #{item.id}</span>
                      </div>
                    </div>

                    {/* Badges de Rol y Proveedor OAuth */}
                    <div className="flex flex-col items-end space-y-1">
                      <RareBadge
                        variant={item.role === 'admin' ? 'admin' : item.role === 'invitado' ? 'invitado' : 'usuario'}
                        label={item.role}
                        size="xs"
                        pulse={false}
                      />
                      {item.auth_provider && item.auth_provider !== 'local' && (
                        <RareBadge
                          variant={item.auth_provider as any}
                          label={item.auth_provider.toUpperCase()}
                          size="xs"
                          pulse={false}
                        />
                      )}
                    </div>
                  </div>

                  {/* Datos del Usuario */}
                  <div className="space-y-2 py-2.5 border-y border-slate-100 dark:border-slate-700/60 text-xs">
                    <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono text-xs break-all">{item.email}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-0.5">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-slate-500 dark:text-slate-400">Estado:</span>
                        <RareBadge
                          variant={item.status === 'activo' ? 'activo' : 'inactivo'}
                          label={item.status}
                          size="xs"
                          pulse={item.status === 'activo'}
                        />
                      </div>

                      <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400 text-[11px]">
                        <Calendar className="w-3 h-3 shrink-0" />
                        <span>{item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Barra de Acciones de la Tarjeta con RareDeleteButton */}
                <div className="pt-3 flex items-center justify-end space-x-2">
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => onOpenEdit(item)}
                        className="px-3 py-1.5 text-xs text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-slate-700 border border-indigo-200 dark:border-indigo-800 rounded-xl transition flex items-center space-x-1 font-semibold"
                        type="button"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>

                      {/* Botón interactivo Rare UI con confirmación */}
                      <RareDeleteButton
                        disabled={isCurrent}
                        title={isCurrent ? 'No puedes auto-eliminarte' : 'Eliminar usuario'}
                        itemName={item.name}
                        onConfirm={() => onRequestDelete(item)}
                      />
                    </>
                  )}

                  {!isAdmin && isCurrent && !isGuest && (
                    <button
                      onClick={() => onOpenEdit(item)}
                      className="px-3 py-1.5 text-xs text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-slate-700 border border-indigo-200 dark:border-indigo-800 rounded-xl transition flex items-center space-x-1 font-semibold"
                      type="button"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Editar Mi Perfil</span>
                    </button>
                  )}

                  {!isAdmin && !isCurrent && (
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 italic py-1">
                      {isGuest ? 'Modo Consulta' : 'Solo Lectura'}
                    </span>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      ) : (

        /* ========================================================================= */
        /* 2. MODO TABLA COMPACTA: TOTALMENTE FLUIDA, SIN OVERFLOW-X-AUTO           */
        /* ========================================================================= */
        <div className="w-full">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-700/80">
                <th className="py-3 px-3 w-[10%]">ID</th>
                <th className="py-3 px-3 w-[28%]">Usuario</th>
                <th className="py-3 px-3 w-[24%]">Correo</th>
                <th className="py-3 px-3 w-[14%]">Rol (3FN)</th>
                <th className="py-3 px-3 w-[12%]">Estado</th>
                <th className="py-3 px-3 w-[12%] text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-800 dark:text-slate-200">
              {users.map((item) => {
                const isCurrent = currentUser?.id === item.id;
                return (
                  <tr key={item.id} className="hover:bg-slate-50/90 dark:hover:bg-slate-800/50 transition">
                    
                    <td className="py-3 px-3 font-mono font-bold text-slate-500 dark:text-slate-400 truncate">
                      #{item.id}
                    </td>

                    <td className="py-3 px-3 truncate">
                      <div className="flex items-center space-x-2 truncate">
                        {item.avatar ? (
                          <img
                            src={item.avatar}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-6 h-6 rounded-full object-cover border border-indigo-200/60 dark:border-indigo-800/60 shadow-2xs shrink-0"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-center font-bold text-xs shrink-0">
                            {item.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="font-semibold text-slate-900 dark:text-white truncate" title={item.name}>
                          {item.name}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-1 rounded font-bold shrink-0">
                            Tú
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono text-xs text-slate-600 dark:text-slate-300 truncate" title={item.email}>
                      {item.email}
                    </td>

                    <td className="py-3 px-3 truncate">
                      <div className="flex items-center space-x-1.5 flex-wrap">
                        <RareBadge
                          variant={item.role === 'admin' ? 'admin' : item.role === 'invitado' ? 'invitado' : 'usuario'}
                          label={item.role}
                          size="xs"
                          pulse={false}
                        />
                        {item.auth_provider && item.auth_provider !== 'local' && (
                          <RareBadge
                            variant={item.auth_provider as any}
                            label={item.auth_provider.toUpperCase()}
                            size="xs"
                            pulse={false}
                          />
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-3 truncate">
                      <RareBadge
                        variant={item.status === 'activo' ? 'activo' : 'inactivo'}
                        label={item.status}
                        size="xs"
                        pulse={item.status === 'activo'}
                      />
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        {isAdmin && (
                          <>
                            <button
                              onClick={() => onOpenEdit(item)}
                              className="p-1 text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                              title="Editar"
                              type="button"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <RareDeleteButton
                              compact={true}
                              disabled={isCurrent}
                              title={isCurrent ? 'No puedes auto-eliminarte' : 'Eliminar usuario'}
                              itemName={item.name}
                              onConfirm={() => onRequestDelete(item)}
                            />
                          </>
                        )}
                        {!isAdmin && isCurrent && !isGuest && (
                          <button
                            onClick={() => onOpenEdit(item)}
                            className="p-1 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg transition"
                            title="Editar Perfil"
                            type="button"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {!isAdmin && !isCurrent && (
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 italic">Lectura</span>
                        )}
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}

export default UserTable;
