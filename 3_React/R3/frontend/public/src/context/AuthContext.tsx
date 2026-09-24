import React, { createContext, useState, useEffect, ReactNode } from 'react';
import authService from '../services/authService';
import { User, AuthContextType } from '../types';

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Inicialización y verificación de sesión con localStorage y JWT
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');

      if (storedToken) {
        try {
          const data = await authService.getMe();
          setUser(data.user);
          setToken(storedToken);
          localStorage.setItem('user', JSON.stringify(data.user));
        } catch {
          // Si el token es inválido o expiró, limpiamos la persistencia en localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    setError(null);
    try {
      const data = await authService.login(email, pass);
      if (data.token && data.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, message: 'Respuesta inválida del servidor' };
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error al iniciar sesión';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (userData: any) => {
    setError(null);
    try {
      const data = await authService.register(userData);
      if (data.token && data.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, message: 'Respuesta inválida del servidor' };
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error al registrar usuario';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    setError(null);
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    setError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
