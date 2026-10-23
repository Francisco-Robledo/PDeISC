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

  const loginWithGoogle = async (credential: string) => {
    setError(null);
    try {
      const data = await authService.loginWithGoogle(credential);
      if (data.token && data.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        return { success: true, user: data.user, token: data.token };
      }
      return { success: false, message: 'Respuesta inválida del servidor' };
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error al autenticar con Google';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const loginWithDiscord = async (code: string, redirectUri?: string) => {
    setError(null);
    try {
      const data = await authService.loginWithDiscord(code, redirectUri);
      if (data.token && data.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        return { success: true, user: data.user, token: data.token };
      }
      return { success: false, message: 'Respuesta inválida del servidor' };
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error al autenticar con Discord';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const loginWithX = async (code: string, codeVerifier: string, redirectUri?: string) => {
    setError(null);
    try {
      const data = await authService.loginWithX(code, codeVerifier, redirectUri);
      if (data.token && data.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        return { success: true, user: data.user, token: data.token };
      }
      return { success: false, message: 'Respuesta inválida del servidor' };
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error al autenticar con X';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const loginWithGitHub = async (code: string, redirectUri?: string) => {
    setError(null);
    try {
      const data = await authService.loginWithGitHub(code, redirectUri);
      if (data.token && data.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        return { success: true, user: data.user, token: data.token };
      }
      return { success: false, message: 'Respuesta inválida del servidor' };
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error al autenticar con GitHub';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const loginWithSocial = async (params: { provider: 'facebook' | 'x' | 'discord' | 'github'; email: string; name?: string; avatar?: string; providerId?: string; accessToken?: string }) => {
    setError(null);
    try {
      const data = await authService.loginWithSocial(params);
      if (data.token && data.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        return { success: true, user: data.user, token: data.token };
      }
      return { success: false, message: 'Respuesta inválida del servidor' };
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || `Error al autenticar con ${params.provider}`;
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
        return { success: true, user: data.user, token: data.token };
      }
      return { success: false, message: 'Respuesta inválida del servidor' };
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error al registrar usuario';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const setSession = (newToken: string, newUser: User) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    setError(null);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    setError(null);
  };

  // Sincronizar estado si localStorage cambia desde otra ventana (ej. popups de OAuth)
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'token') {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedToken && storedUser) {
          try {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          } catch {}
        } else if (!storedToken) {
          setToken(null);
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const value: AuthContextType = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token && !!user,
    login,
    loginWithGoogle,
    loginWithDiscord,
    loginWithX,
    loginWithGitHub,
    loginWithSocial,
    register,
    setSession,
    logout,
    setError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
