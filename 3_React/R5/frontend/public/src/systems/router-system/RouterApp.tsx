import React from 'react';
import { Routes, Route, Navigate, NavLink } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import ProtectedRoute from '../../components/ProtectedRoute';
import useAuth from '../../hooks/useAuth';
import { LayoutDashboard, Users, LogIn, UserPlus } from 'lucide-react';

export function RouterApp() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="w-full">
      {/* Sub-barra de navegación específica de React Router */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div>
          <div className="text-xs uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400">Sistema 1</div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white">Navegación mediante React Router DOM</h2>
        </div>

        <nav className="flex items-center space-x-2 bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs font-semibold">
          {isAuthenticated ? (
            <>
              <NavLink
                to="/router/dashboard"
                className={({ isActive }) =>
                  `flex items-center space-x-1.5 px-3 py-1.5 rounded-xl transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`
                }
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/router/users"
                className={({ isActive }) =>
                  `flex items-center space-x-1.5 px-3 py-1.5 rounded-xl transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`
                }
              >
                <Users className="w-3.5 h-3.5" />
                <span>Usuarios SQL</span>
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/router/login"
                className={({ isActive }) =>
                  `flex items-center space-x-1.5 px-3 py-1.5 rounded-xl transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`
                }
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Iniciar Sesión</span>
              </NavLink>

              <NavLink
                to="/router/register"
                className={({ isActive }) =>
                  `flex items-center space-x-1.5 px-3 py-1.5 rounded-xl transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`
                }
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Registrarse</span>
              </NavLink>
            </>
          )}
        </nav>
      </div>

      {/* Definición de Rutas */}
      <Routes>
        <Route path="/router/login" element={<LoginPage />} />
        <Route path="/router/register" element={<RegisterPage />} />
        <Route path="/login" element={<Navigate to="/router/login" replace />} />
        <Route path="/register" element={<Navigate to="/router/register" replace />} />

        <Route element={<ProtectedRoute redirectPath="/router/login" />}>
          <Route path="/router/dashboard" element={<DashboardPage />} />
          <Route path="/router/users" element={<UsersPage />} />
          <Route path="/dashboard" element={<Navigate to="/router/dashboard" replace />} />
          <Route path="/users" element={<Navigate to="/router/users" replace />} />
        </Route>

        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? '/router/dashboard' : '/router/login'} replace />}
        />
      </Routes>
    </div>
  );
}

export default RouterApp;
