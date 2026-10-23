import { useState, useEffect, useCallback } from 'react';
import userService from '../services/userService';
import useAuth from './useAuth';
import { User, DatabaseStats } from '../types';

export function useUsers() {
  const { isAuthenticated } = useAuth();
  
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const loadUsersAndStats = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    try {
      const [usersData, statsData] = await Promise.all([
        userService.getUsers(),
        userService.getStats(),
      ]);

      setUsers(usersData.users || []);
      setStats(statsData.stats || null);
    } catch (err: any) {
      console.error('Error al cargar datos de usuarios:', err);
      setError(err.response?.data?.message || err.message || 'Error al conectar con la base de datos SQL.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadUsersAndStats();
  }, [loadUsersAndStats]);

  const addUser = async (userData: any) => {
    try {
      const response = await userService.createUser(userData);
      await loadUsersAndStats();
      return { success: true, message: response.message };
    } catch (err: any) {
      return { 
        success: false, 
        message: err.response?.data?.message || err.message || 'Error al crear usuario' 
      };
    }
  };

  const editUser = async (id: number, userData: any) => {
    try {
      const response = await userService.updateUser(id, userData);
      await loadUsersAndStats();
      return { success: true, message: response.message };
    } catch (err: any) {
      return { 
        success: false, 
        message: err.response?.data?.message || err.message || 'Error al actualizar usuario' 
      };
    }
  };

  const removeUser = async (id: number) => {
    try {
      const response = await userService.deleteUser(id);
      await loadUsersAndStats();
      return { success: true, message: response.message };
    } catch (err: any) {
      return { 
        success: false, 
        message: err.response?.data?.message || err.message || 'Error al eliminar usuario' 
      };
    }
  };

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.role.toLowerCase().includes(term)
    );
  });

  return {
    users: filteredUsers,
    allUsers: users,
    stats,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    reload: loadUsersAndStats,
    addUser,
    editUser,
    removeUser,
  };
}

export default useUsers;
