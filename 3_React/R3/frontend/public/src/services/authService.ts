import api from './api';
import { User, AuthResponse } from '../types';

export const authService = {
  // Login mediante Axios
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
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
