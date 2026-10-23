import React, { useState, useEffect } from 'react';
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';
import DashboardView from './views/DashboardView';
import UsersView from './views/UsersView';
import useAuth from '../../hooks/useAuth';
import { LayoutDashboard, Users, LogIn, UserPlus } from 'lucide-react';

type ViewType = 'login' | 'register' | 'dashboard' | 'users';

export function StateApp() {
  const { isAuthenticated } = useAuth();

  const [currentView, setCurrentView] = useState<ViewType>(() => {
    const saved = localStorage.getItem('usestate_view') as ViewType;
    if (saved && ['login', 'register', 'dashboard', 'users'].includes(saved)) {
      return saved;
    }
    return isAuthenticated ? 'dashboard' : 'login';
  });

  useEffect(() => {
    if (!isAuthenticated && (currentView === 'dashboard' || currentView === 'users')) {
      setCurrentView('login');
      localStorage.setItem('usestate_view', 'login');
    }
  }, [isAuthenticated, currentView]);

  useEffect(() => {
    if (isAuthenticated && (currentView === 'login' || currentView === 'register')) {
      setCurrentView('dashboard');
      localStorage.setItem('usestate_view', 'dashboard');
    }
  }, [isAuthenticated]);

  const handleNavigate = (view: ViewType) => {
    setCurrentView(view);
    localStorage.setItem('usestate_view', view);
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div>
          <div className="text-xs uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400">Sistema 2</div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white flex items-center space-x-2">
            <span>Navegación mediante useState y Renderizado Condicional</span>
          </h2>
        </div>

        <nav className="flex items-center space-x-2 bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs font-semibold">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => handleNavigate('dashboard')}
                type="button"
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl transition ${
                  currentView === 'dashboard'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => handleNavigate('users')}
                type="button"
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl transition ${
                  currentView === 'users'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Usuarios SQL</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNavigate('login')}
                type="button"
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl transition ${
                  currentView === 'login'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Iniciar Sesión</span>
              </button>

              <button
                onClick={() => handleNavigate('register')}
                type="button"
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl transition ${
                  currentView === 'register'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Registrarse</span>
              </button>
            </>
          )}
        </nav>
      </div>

      <div className="transition-all duration-300">
        {currentView === 'login' && <LoginView onNavigate={handleNavigate} />}
        {currentView === 'register' && <RegisterView onNavigate={handleNavigate} />}
        {currentView === 'dashboard' && isAuthenticated && <DashboardView onNavigate={handleNavigate} />}
        {currentView === 'users' && isAuthenticated && <UsersView onNavigate={handleNavigate} />}
      </div>
    </div>
  );
}

export default StateApp;
