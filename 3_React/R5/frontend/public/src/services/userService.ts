import api, { apiFetch } from './api';
import { User, DatabaseStats } from '../types';

export const userService = {
  // Obtener usuarios con Axios
  async getUsers(): Promise<{ success: boolean; count: number; users: User[] }> {
    const response = await api.get<{ success: boolean; count: number; users: User[] }>('/users');
    return response.data;
  },

  // Obtener estadísticas de BBDD SQL usando fetch nativo
  async getStats(): Promise<{ success: boolean; stats: DatabaseStats }> {
    return await apiFetch<{ success: boolean; stats: DatabaseStats }>('/users/stats');
  },

  // Crear usuario
  async createUser(userData: Partial<User> & { password: string }): Promise<{ success: boolean; message: string; user: User }> {
    const response = await api.post<{ success: boolean; message: string; user: User }>('/users', userData);
    return response.data;
  },

  // Actualizar usuario
  async updateUser(id: number, userData: Partial<User> & { password?: string }): Promise<{ success: boolean; message: string; user: User }> {
    const response = await api.put<{ success: boolean; message: string; user: User }>(`/users/${id}`, userData);
    return response.data;
  },

  // Eliminar usuario
  async deleteUser(id: number): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(`/users/${id}`);
    return response.data;
  },
};

export default userService;
