import { ShieldCheck, Edit3, Save, RotateCcw, XCircle, LogOut, SlidersHorizontal } from 'lucide-react';

interface AdminEditBarProps {
  isEditMode: boolean;
  hasUnsavedChanges: boolean;
  onOpenEditProfile: () => void;
  onOpenMasterManager: () => void;
  onSaveChanges: () => void;
  onDiscardChanges: () => void;
  onResetDefaults: () => void;
  onExitEditMode: () => void;
}

export function AdminEditBar({
  isEditMode,
  hasUnsavedChanges,
  onOpenEditProfile,
  onOpenMasterManager,
  onSaveChanges,
  onDiscardChanges,
  onResetDefaults,
  onExitEditMode,
}: AdminEditBarProps) {
  if (!isEditMode) return null;

  return (
    <aside
      aria-label="Barra de herramientas de administración"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-3xl bg-white/95 dark:bg-[#1E2023]/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 shadow-2xl border border-blue-500/30 dark:border-blue-500/40 animate-slide-up transition-all"
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Indicador de estado */}
        <div className="flex items-center space-x-2 pl-1">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Modo Edición
            </span>
          </div>
          {hasUnsavedChanges && (
            <span className="text-[10px] bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded-full font-semibold border border-amber-300 dark:border-amber-700">
              Cambios pendientes
            </span>
          )}
        </div>

        {/* Acciones de administración */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* Gestor Total (Todo) */}
          <button
            onClick={onOpenMasterManager}
            type="button"
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 rounded-xl shadow-xs transition active:scale-95"
            title="Abrir gestor completo para editar proyectos, habilidades, experiencia, logros y perfil"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Gestor Total (Todo)</span>
            <span className="sm:hidden">Gestor</span>
          </button>

          {/* Editar Perfil */}
          <button
            onClick={onOpenEditProfile}
            type="button"
            className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition border border-slate-200 dark:border-slate-700"
            title="Editar nombre, biografía, contacto y métricas"
          >
            <Edit3 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">Perfil</span>
            <span className="sm:hidden">Perfil</span>
          </button>

          {/* Guardar cambios */}
          <button
            onClick={onSaveChanges}
            type="button"
            className="flex items-center space-x-1 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#4285F4] hover:bg-[#3367D6] rounded-xl shadow-xs transition active:scale-95"
            title="Guardar y persistir cambios en localStorage"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Guardar</span>
          </button>

          {/* Descartar */}
          {hasUnsavedChanges && (
            <button
              onClick={onDiscardChanges}
              type="button"
              className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition"
              title="Descartar cambios no guardados"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Descartar</span>
            </button>
          )}

          {/* Restablecer */}
          <button
            onClick={onResetDefaults}
            type="button"
            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-xl transition"
            title="Restablecer datos originales"
            aria-label="Restablecer datos originales"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Salir */}
          <button
            onClick={onExitEditMode}
            type="button"
            className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            title="Salir del modo de administración"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>

      </div>
    </aside>
  );
}

export default AdminEditBar;
