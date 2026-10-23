import React, { useState } from 'react';
import useUsers from '../../../hooks/useUsers';
import UserTable from '../../../components/UserTable';
import UserFormModal from '../../../components/UserFormModal';
import ConfirmModal from '../../../components/ConfirmModal';
import { SlidersHorizontal, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { User } from '../../../types';

interface UsersViewProps {
  onNavigate: (view: 'login' | 'register' | 'dashboard' | 'users') => void;
}

export function UsersView({ onNavigate }: UsersViewProps) {
  const {
    users,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    reload,
    addUser,
    editUser,
    removeUser,
  } = useUsers();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleOpenCreate = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData: any) => {
    if (editingUser) {
      const res = await editUser(editingUser.id, formData);
      if (res.success) {
        showNotification('success', res.message);
        return { success: true };
      } else {
        showNotification('error', res.message);
        return { success: false };
      }
    } else {
      const res = await addUser(formData);
      if (res.success) {
        showNotification('success', res.message);
        return { success: true };
      } else {
        showNotification('error', res.message);
        return { success: false };
      }
    }
  };

  // Reemplazo estricto de window.confirm() por ConfirmModal
  const handleRequestDelete = (user: User) => {
    setUserToDelete(user);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    const res = await removeUser(userToDelete.id);
    setIsDeleting(false);
    setUserToDelete(null);

    if (res.success) {
      showNotification('success', res.message);
    } else {
      showNotification('error', res.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition flex items-center space-x-1 text-xs"
              type="button"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a Dashboard (useState)</span>
            </button>
            <span className="text-slate-300 dark:text-slate-700">&middot;</span>
            <span className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              <SlidersHorizontal className="w-3 h-3" />
              <span>currentView: "users"</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-2">
            Gestión de Usuarios (BBDD SQL 3FN)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Renderizado condicional controlado por useState con operaciones CRUD sobre la tabla SQL normalizada.
          </p>
        </div>
      </div>

      {/* Alerta de notificación en UI */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm flex items-center space-x-2 shadow-sm border ${
            feedback.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-2xl text-xs flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabla de Usuarios */}
      <UserTable
        users={users}
        loading={loading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onOpenCreate={handleOpenCreate}
        onOpenEdit={handleOpenEdit}
        onRequestDelete={handleRequestDelete}
        onReload={reload}
      />

      {/* Modal para Crear/Editar con useForm */}
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingUser}
      />

      {/* Modal de confirmación UI (Cero alert() / confirm()) */}
      <ConfirmModal
        isOpen={Boolean(userToDelete)}
        title="Eliminar usuario de BBDD SQL"
        message={`¿Estás seguro de que deseas eliminar permanentemente a "${userToDelete?.name}" (${userToDelete?.email}) de la tabla SQL?`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setUserToDelete(null)}
        isLoading={isDeleting}
      />

    </div>
  );
}

export default UsersView;
