import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { 
  Database, 
  LogOut, 
  User as UserIcon, 
  Route as RouteIcon, 
  SlidersHorizontal 
} from 'lucide-react';
import { RareBadge, RareTabs } from './rare-ui';
import ConfirmModal from './ConfirmModal';

interface NavbarProps {
  activeSystem: 'router' | 'usestate';
  onSwitchSystem: (sys: 'router' | 'usestate') => void;
  onOpenComparison?: () => void;
}

export function Navbar({ activeSystem, onSwitchSystem }: NavbarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);

  return (
    <>
      <header className="bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white shadow-xs dark:shadow-md sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md transition-colors">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo y título: Únicamente 'Sistema de Usuarios' */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white p-2.5 rounded-2xl shadow-sm">
                <Database className="w-5 h-5 text-white" />
              </div>
              <h1 className="font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white m-0">
                Sistema de Usuarios
              </h1>
            </div>

            {/* Selector de Sistemas Estilo Rare UI (RareTabs) */}
            <RareTabs<'router' | 'usestate'>
              options={[
                { id: 'router', label: '1. React Router', icon: RouteIcon },
                { id: 'usestate', label: '2. useState', icon: SlidersHorizontal },
              ]}
              activeId={activeSystem}
              onChange={(sys) => onSwitchSystem(sys)}
              size="sm"
            />

            {/* Acciones de usuario con Logout protegido por confirmación */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-2.5 pl-2.5 border-l border-slate-200 dark:border-slate-800">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">{user.name}</div>
                    <div className="mt-0.5 flex justify-end items-center space-x-1">
                      {user.auth_provider && user.auth_provider !== 'local' && (
                        <RareBadge
                          variant={user.auth_provider as any}
                          label={user.auth_provider.toUpperCase()}
                          size="xs"
                          pulse={false}
                        />
                      )}
                      <RareBadge
                        variant={user.role === 'admin' ? 'admin' : user.role === 'invitado' ? 'invitado' : 'usuario'}
                        label={user.role}
                        size="xs"
                        pulse={user.role === 'admin'}
                      />
                    </div>
                  </div>

                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover border border-indigo-300 dark:border-indigo-700 shadow-xs"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {/* Botón de Logout con solicitud de confirmación */}
                  <button
                    onClick={() => setIsLogoutModalOpen(true)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-rose-500/10 rounded-xl transition"
                    title="Cerrar Sesión (Requiere confirmación)"
                    type="button"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                  <UserIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sin sesión activa</span>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Modal de confirmación para Logout */}
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        title="¿Cerrar Sesión?"
        message={`¿Estás seguro de que deseas cerrar tu sesión activa${user ? ` (${user.name})` : ''}? Tendrás que volver a autenticarte con tu correo y contraseña para acceder al sistema.`}
        confirmText="Sí, cerrar sesión"
        cancelText="Permanecer conectado"
        variant="warning"
        onConfirm={() => {
          setIsLogoutModalOpen(false);
          logout();
        }}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </>
  );
}

export default Navbar;
