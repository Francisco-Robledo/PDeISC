import api from './api';
import { User, AuthResponse } from '../types';

export const authService = {
  // Login mediante Axios
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    return response.data;
  },

  // Autenticación federada con Google OAuth (GIS)
  async loginWithGoogle(credential: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/google', { credential });
    return response.data;
  },

  // Autenticación federada para Facebook, X y Discord
  async loginWithSocial(payload: { provider: string; email: string; name?: string; avatar?: string; providerId?: string; accessToken?: string }): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/social', payload);
    return response.data;
  },

  // Autenticación federada oficial con Discord OAuth2 (Code exchange)
  async loginWithDiscord(code: string, redirectUri?: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/discord', { code, redirectUri });
    return response.data;
  },

  // Autenticación federada oficial con X (Twitter) OAuth 2.0 PKCE Flow
  async loginWithX(code: string, codeVerifier: string, redirectUri?: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/x', { code, codeVerifier, redirectUri });
    return response.data;
  },

  // Autenticación federada oficial con GitHub OAuth
  async loginWithGitHub(code: string, redirectUri?: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/github', { code, redirectUri });
    return response.data;
  },

  // Registro con inserción relacional en BBDD SQL (3FN)
  async register(userData: { name: string; email: string; password: string; role?: string }): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    return response.data;
  },

  // Obtener perfil actual validado con JWT
  async getMe(): Promise<{ success: boolean; user: User }> {
    const response = await api.get<{ success: boolean; user: User }>('/auth/me');
    return response.data;
  },
};

export default authService;
