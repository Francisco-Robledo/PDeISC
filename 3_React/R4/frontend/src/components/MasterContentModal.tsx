import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Plus, 
  Trash2, 
  Edit3, 
  User, 
  Layers, 
  Sparkles, 
  Briefcase, 
  Award, 
  Check 
} from 'lucide-react';
import type { PortfolioData, Profile, Project, Skill, Experience, Achievement } from '../types/portfolio';
import { useConfirm } from '../context/ConfirmContext';

interface MasterContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PortfolioData;
  onSaveProfile: (profile: Profile) => void;
  onSaveProject: (project: Project) => void;
  onAddProject: (project: Project) => void;
  onDeleteProject: (id: number) => void;
  onSaveSkill: (skill: Skill) => void;
  onAddSkill: (skill: Skill) => void;
  onDeleteSkill: (id: number) => void;
  onSaveExperience: (exp: Experience) => void;
  onAddExperience: (exp: Experience) => void;
  onDeleteExperience: (id: number) => void;
  onSaveAchievement: (ach: Achievement) => void;
  onAddAchievement: (ach: Achievement) => void;
  onDeleteAchievement: (id: number) => void;
  onPersistToStorage: () => void;
  initialTab?: 'profile' | 'projects' | 'skills' | 'experience' | 'achievements';
}

export function MasterContentModal({
  isOpen,
  onClose,
  data,
  onSaveProfile,
  onSaveProject,
  onAddProject,
  onDeleteProject,
  onSaveSkill,
  onAddSkill,
  onDeleteSkill,
  onSaveExperience,
  onAddExperience,
  onDeleteExperience,
  onSaveAchievement,
  onAddAchievement,
  onDeleteAchievement,
  onPersistToStorage,
  initialTab = 'profile'
}: MasterContentModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'skills' | 'experience' | 'achievements'>(initialTab);
  const confirm = useConfirm();
  const [profileForm, setProfileForm] = useState<Profile>(data.profile);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [editingProjectForm, setEditingProjectForm] = useState<Partial<Project>>({});
  const [isAddingProject, setIsAddingProject] = useState(false);

  // New Skill Form State
  const [newSkillForm, setNewSkillForm] = useState<Partial<Skill>>({
    name: '',
    category: 'frontend',
    level: 80,
    color: '#4285F4',
    icon: 'Sparkles',
    description: ''
  });

  // New Experience Form State
  const [newExpForm, setNewExpForm] = useState<Partial<Experience>>({
    role: '',
    company: '',
    period: '2024 — Presente',
    type: 'work',
    description: '',
    badge_color: '#4285F4',
    highlights: ['']
  });

  // New Achievement Form State
  const [newAchForm, setNewAchForm] = useState<Partial<Achievement>>({
    title: '',
    issuer: '',
    date: '2024',
    description: '',
    icon: 'Award',
    credential_url: ''
  });

  useEffect(() => {
    setProfileForm(data.profile);
  }, [data.profile]);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Handle Profile Save
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await confirm({
      title: '¿Guardar datos del perfil?',
      message: '¿Estás seguro de que deseas actualizar la información de tu perfil?',
      variant: 'info',
      confirmText: 'Guardar Perfil'
    });
    if (ok) {
      onSaveProfile(profileForm);
      onPersistToStorage();
    }
  };

  // Handle Project Save
  const handleSaveProjectForm = async (project: Project) => {
    const ok = await confirm({
      title: '¿Guardar cambios del proyecto?',
      message: `¿Estás seguro de que deseas guardar los cambios en "${project.title}"?`,
      variant: 'info',
      confirmText: 'Guardar Proyecto'
    });
    if (ok) {
      onSaveProject(project);
      setEditingProjectId(null);
      onPersistToStorage();
    }
  };

  const handleCreateNewProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await confirm({
      title: '¿Crear nuevo proyecto?',
      message: `¿Estás seguro de agregar "${editingProjectForm.title || 'Nuevo Proyecto'}" al portafolio?`,
      variant: 'info',
      confirmText: 'Crear Proyecto'
    });
    if (!ok) return;

    const newProj: Project = {
      id: Date.now(),
      title: editingProjectForm.title || 'Nuevo Proyecto',
      subtitle: editingProjectForm.subtitle || 'Subtítulo del proyecto',
      description: editingProjectForm.description || 'Descripción breve del proyecto',
      long_description: editingProjectForm.long_description || '',
      category: editingProjectForm.category || 'Full Stack',
      tags: typeof editingProjectForm.tags === 'string' 
        ? (editingProjectForm.tags as string).split(',').map((t: string) => t.trim()).filter(Boolean)
        : (editingProjectForm.tags || ['React', 'Node.js']),
      demo_url: editingProjectForm.demo_url || '#',
      repo_url: editingProjectForm.repo_url || '',
      image_gradient: editingProjectForm.image_gradient || 'from-blue-600 to-indigo-600',
      likes: 0,
      featured: 1,
      metrics: editingProjectForm.metrics || 'Proyecto Reciente'
    };
    onAddProject(newProj);
    setIsAddingProject(false);
    setEditingProjectForm({});
    onPersistToStorage();
  };

  // Handle Skill Add
  const handleAddSkillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillForm.name) return;
    const ok = await confirm({
      title: '¿Agregar nueva habilidad?',
      message: `¿Estás seguro de registrar la habilidad "${newSkillForm.name}"?`,
      variant: 'info',
      confirmText: 'Agregar Habilidad'
    });
    if (!ok) return;

    const skill: Skill = {
      id: Date.now(),
      name: newSkillForm.name,
      category: (newSkillForm.category as any) || 'frontend',
      level: Number(newSkillForm.level) || 75,
      color: newSkillForm.color || '#4285F4',
      icon: newSkillForm.icon || 'Sparkles',
      description: newSkillForm.description || ''
    };
    onAddSkill(skill);
    setNewSkillForm({
      name: '',
      category: 'frontend',
      level: 80,
      color: '#4285F4',
      icon: 'Sparkles',
      description: ''
    });
    onPersistToStorage();
  };

  // Handle Experience Add
  const handleAddExperienceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpForm.role || !newExpForm.company) return;
    const ok = await confirm({
      title: '¿Agregar experiencia?',
      message: `¿Estás seguro de registrar "${newExpForm.role}" en "${newExpForm.company}"?`,
      variant: 'info',
      confirmText: 'Agregar Experiencia'
    });
    if (!ok) return;

    const exp: Experience = {
      id: Date.now(),
      role: newExpForm.role,
      company: newExpForm.company,
      period: newExpForm.period || '2024',
      type: (newExpForm.type as any) || 'work',
      description: newExpForm.description || '',
      badge_color: newExpForm.badge_color || '#4285F4',
      highlights: (newExpForm.highlights || []).filter(h => h.trim().length > 0)
    };
    onAddExperience(exp);
    setNewExpForm({
      role: '',
      company: '',
      period: '2024 — Presente',
      type: 'work',
      description: '',
      badge_color: '#4285F4',
      highlights: ['']
    });
    onPersistToStorage();
  };

  // Handle Achievement Add
  const handleAddAchievementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAchForm.title) return;
    const ok = await confirm({
      title: '¿Agregar logro o certificación?',
      message: `¿Estás seguro de registrar "${newAchForm.title}"?`,
      variant: 'info',
      confirmText: 'Agregar Logro'
    });
    if (!ok) return;

    const ach: Achievement = {
      id: Date.now(),
      title: newAchForm.title,
      issuer: newAchForm.issuer || 'Institución',
      date: newAchForm.date || '2024',
      description: newAchForm.description || '',
      icon: newAchForm.icon || 'Award',
      credential_url: newAchForm.credential_url || ''
    };
    onAddAchievement(ach);
    setNewAchForm({
      title: '',
      issuer: '',
      date: '2024',
      description: '',
      icon: 'Award',
      credential_url: ''
    });
    onPersistToStorage();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md animate-fade-in">
      <div 
        className="bg-white dark:bg-[#1C1E22] rounded-3xl shadow-2xl max-w-4xl w-full h-[90vh] flex flex-col border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-500/20">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2">
                Gestor Completo de Contenido
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 rounded-full border border-emerald-300 dark:border-emerald-700">
                  Edición Total
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Modifica cualquier sección del portafolio. Todo se guarda y persiste automáticamente.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800 transition"
            aria-label="Cerrar gestor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-4 sm:px-6 pt-3 pb-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1C1E22] overflow-x-auto select-none">
          {[
            { id: 'profile', label: 'Perfil', icon: User, count: null },
            { id: 'projects', label: 'Proyectos', icon: Layers, count: data.projects.length },
            { id: 'skills', label: 'Habilidades', icon: Sparkles, count: data.skills.length },
            { id: 'experience', label: 'Experiencia', icon: Briefcase, count: data.experience.length },
            { id: 'achievements', label: 'Logros', icon: Award, count: data.achievements.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition whitespace-nowrap ${
                  isActive
                    ? 'bg-[#4285F4] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white/25 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50 dark:bg-[#16181A]">
          
          {/* TAB 1: PERFIL */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-3xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Título Profesional</label>
                  <input
                    type="text"
                    required
                    value={profileForm.title}
                    onChange={(e) => setProfileForm(p => ({ ...p, title: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email de Contacto</label>
                  <input
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={(e) => setProfileForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Ubicación</label>
                  <input
                    type="text"
                    value={profileForm.location}
                    onChange={(e) => setProfileForm(p => ({ ...p, location: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">URL de GitHub</label>
                  <input
                    type="url"
                    value={profileForm.github}
                    onChange={(e) => setProfileForm(p => ({ ...p, github: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">URL de LinkedIn</label>
                  <input
                    type="url"
                    value={profileForm.linkedin}
                    onChange={(e) => setProfileForm(p => ({ ...p, linkedin: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Lema / Tagline Destacado</label>
                <input
                  type="text"
                  value={profileForm.tagline}
                  onChange={(e) => setProfileForm(p => ({ ...p, tagline: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Biografía Completa</label>
                <textarea
                  rows={4}
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm(p => ({ ...p, bio: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 outline-none resize-y"
                />
              </div>

              {/* Métricas Rápidas */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">Métricas en Barra</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">Años Exp.</label>
                    <input
                      type="text"
                      value={profileForm.years_experience}
                      onChange={(e) => setProfileForm(p => ({ ...p, years_experience: e.target.value }))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">Proyectos</label>
                    <input
                      type="number"
                      value={profileForm.projects_completed}
                      onChange={(e) => setProfileForm(p => ({ ...p, projects_completed: Number(e.target.value) }))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">Satisfacción</label>
                    <input
                      type="text"
                      value={profileForm.satisfaction_rate}
                      onChange={(e) => setProfileForm(p => ({ ...p, satisfaction_rate: e.target.value }))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">Commits Git</label>
                    <input
                      type="text"
                      value={profileForm.code_commits}
                      onChange={(e) => setProfileForm(p => ({ ...p, code_commits: e.target.value }))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#4285F4] hover:bg-[#3367D6] rounded-xl shadow-sm transition flex items-center space-x-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar y Aplicar Cambios de Perfil</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: PROYECTOS */}
          {activeTab === 'projects' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {data.projects.length} proyectos registrados. Puedes editarlos en detalle o agregar nuevos.
                </p>
                <button
                  onClick={() => {
                    setIsAddingProject(true);
                    setEditingProjectForm({
                      title: '',
                      subtitle: '',
                      description: '',
                      category: 'Full Stack',
                      tags: ['React', 'TypeScript', 'Node.js'],
                      image_gradient: 'from-blue-600 to-indigo-600',
                      demo_url: '#',
                      repo_url: '',
                      metrics: 'Nuevo Proyecto'
                    });
                  }}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#34A853] hover:bg-emerald-600 rounded-xl transition flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Agregar Proyecto</span>
                </button>
              </div>

              {/* Form to Add New Project */}
              {isAddingProject && (
                <form onSubmit={handleCreateNewProject} className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-500/40 shadow-lg space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Crear Nuevo Proyecto
                    </h4>
                    <button
                      type="button"
                      onClick={() => setIsAddingProject(false)}
                      className="text-slate-400 hover:text-slate-600 text-xs"
                    >
                      Cancelar
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Título</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Sistema IoT"
                        value={editingProjectForm.title || ''}
                        onChange={(e) => setEditingProjectForm(f => ({ ...f, title: e.target.value }))}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Subtítulo</label>
                      <input
                        type="text"
                        placeholder="Ej. Plataforma de telemetría"
                        value={editingProjectForm.subtitle || ''}
                        onChange={(e) => setEditingProjectForm(f => ({ ...f, subtitle: e.target.value }))}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Categoría</label>
                      <select
                        value={editingProjectForm.category || 'Full Stack'}
                        onChange={(e) => setEditingProjectForm(f => ({ ...f, category: e.target.value }))}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                      >
                        <option value="Full Stack">Full Stack</option>
                        <option value="Web App">Web App</option>
                        <option value="Hardware / IoT">Hardware / IoT</option>
                        <option value="Mobile">Mobile</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Etiquetas (separadas por coma)</label>
                      <input
                        type="text"
                        placeholder="React, Node.js, SQLite, C++"
                        value={Array.isArray(editingProjectForm.tags) ? editingProjectForm.tags.join(', ') : editingProjectForm.tags || ''}
                        onChange={(e) => setEditingProjectForm(f => ({ ...f, tags: e.target.value as any }))}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Repositorio GitHub (URL)</label>
                      <input
                        type="url"
                        placeholder="https://github.com/..."
                        value={editingProjectForm.repo_url || ''}
                        onChange={(e) => setEditingProjectForm(f => ({ ...f, repo_url: e.target.value }))}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Demo en Vivo (URL)</label>
                      <input
                        type="text"
                        placeholder="https://... o #"
                        value={editingProjectForm.demo_url || ''}
                        onChange={(e) => setEditingProjectForm(f => ({ ...f, demo_url: e.target.value }))}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Descripción</label>
                    <textarea
                      rows={2}
                      placeholder="Resumen del proyecto..."
                      value={editingProjectForm.description || ''}
                      onChange={(e) => setEditingProjectForm(f => ({ ...f, description: e.target.value }))}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingProject(false)}
                      className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-bold text-white bg-[#34A853] hover:bg-emerald-600 rounded-xl"
                    >
                      Crear Proyecto
                    </button>
                  </div>
                </form>
              )}

              {/* Projects List */}
              <div className="space-y-4">
                {data.projects.map((project) => {
                  const isEditingThis = editingProjectId === project.id;
                  return (
                    <div
                      key={project.id}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs"
                    >
                      {isEditingThis ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                            <span className="font-bold text-xs text-[#4285F4]">Editando: {project.title}</span>
                            <button
                              type="button"
                              onClick={() => setEditingProjectId(null)}
                              className="text-xs text-slate-400 hover:text-slate-600"
                            >
                              Cancelar
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] text-slate-500 mb-1">Título</label>
                              <input
                                type="text"
                                value={project.title}
                                onChange={(e) => onSaveProject({ ...project, title: e.target.value })}
                                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] text-slate-500 mb-1">Subtítulo</label>
                              <input
                                type="text"
                                value={project.subtitle}
                                onChange={(e) => onSaveProject({ ...project, subtitle: e.target.value })}
                                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] text-slate-500 mb-1">Categoría</label>
                              <input
                                type="text"
                                value={project.category}
                                onChange={(e) => onSaveProject({ ...project, category: e.target.value })}
                                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] text-slate-500 mb-1">Tags (separados por coma)</label>
                              <input
                                type="text"
                                value={project.tags.join(', ')}
                                onChange={(e) => onSaveProject({ ...project, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] text-slate-500 mb-1">GitHub Repo URL</label>
                              <input
                                type="url"
                                value={project.repo_url || ''}
                                onChange={(e) => onSaveProject({ ...project, repo_url: e.target.value })}
                                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] text-slate-500 mb-1">Demo en Vivo URL</label>
                              <input
                                type="text"
                                value={project.demo_url || ''}
                                onChange={(e) => onSaveProject({ ...project, demo_url: e.target.value })}
                                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[11px] text-slate-500 mb-1">Descripción</label>
                            <textarea
                              rows={2}
                              value={project.description}
                              onChange={(e) => onSaveProject({ ...project, description: e.target.value })}
                              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                            />
                          </div>
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                handleSaveProjectForm(project);
                              }}
                              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-xl"
                            >
                              Listo
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-sm text-slate-900 dark:text-white">{project.title}</h4>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-semibold text-slate-600 dark:text-slate-400">
                                {project.category}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">{project.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {project.tags.map(t => (
                                <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => setEditingProjectId(project.id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition"
                              title="Editar proyecto"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={async () => {
                                const ok = await confirm({
                                  title: '¿Eliminar proyecto?',
                                  message: `¿Deseas eliminar el proyecto "${project.title}"?`,
                                  variant: 'danger',
                                  confirmText: 'Eliminar Proyecto'
                                });
                                if (ok) {
                                  onDeleteProject(project.id);
                                  onPersistToStorage();
                                }
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                              title="Eliminar proyecto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: HABILIDADES */}
          {activeTab === 'skills' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              {/* Form to Add New Skill */}
              <form onSubmit={handleAddSkillSubmit} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Plus className="w-4 h-4" />
                  <span>Agregar Nueva Habilidad</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Nombre</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Docker"
                      value={newSkillForm.name}
                      onChange={(e) => setNewSkillForm(s => ({ ...s, name: e.target.value }))}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Categoría</label>
                    <select
                      value={newSkillForm.category}
                      onChange={(e) => setNewSkillForm(s => ({ ...s, category: e.target.value as any }))}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    >
                      <option value="frontend">Frontend & Web</option>
                      <option value="backend">Backend & APIs</option>
                      <option value="devops">DevOps & Cloud</option>
                      <option value="database">Bases de Datos</option>
                      <option value="tools">Herramientas & Hardware</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Nivel ({newSkillForm.level}%)</label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={newSkillForm.level}
                      onChange={(e) => setNewSkillForm(s => ({ ...s, level: Number(e.target.value) }))}
                      className="w-full mt-2"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Color HEX</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={newSkillForm.color}
                        onChange={(e) => setNewSkillForm(s => ({ ...s, color: e.target.value }))}
                        className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={newSkillForm.color}
                        onChange={(e) => setNewSkillForm(s => ({ ...s, color: e.target.value }))}
                        className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Descripción</label>
                  <input
                    type="text"
                    placeholder="Descripción de la tecnología..."
                    value={newSkillForm.description}
                    onChange={(e) => setNewSkillForm(s => ({ ...s, description: e.target.value }))}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-bold text-white bg-[#34A853] hover:bg-emerald-600 rounded-xl transition"
                  >
                    Guardar Habilidad
                  </button>
                </div>
              </form>

              {/* Skills List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: skill.color }} />
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <h5
                            contentEditable={true}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => {
                              const text = e.currentTarget.innerText.trim();
                              if (text && text !== skill.name) {
                                onSaveSkill({ ...skill, name: text });
                                onPersistToStorage();
                              }
                            }}
                            title="Haz clic para editar el nombre"
                            className="font-bold text-xs text-slate-900 dark:text-white truncate cursor-text hover:underline"
                          >
                            {skill.name}
                          </h5>
                          <span className="text-[10px] text-slate-400 font-semibold">{skill.level}%</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{skill.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={async () => {
                        const ok = await confirm({
                          title: '¿Eliminar habilidad?',
                          message: `¿Deseas eliminar la tecnología "${skill.name}"?`,
                          variant: 'danger',
                          confirmText: 'Eliminar Habilidad'
                        });
                        if (ok) {
                          onDeleteSkill(skill.id);
                          onPersistToStorage();
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition shrink-0"
                      title="Eliminar habilidad"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: EXPERIENCIA */}
          {activeTab === 'experience' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              {/* Form to Add New Experience */}
              <form onSubmit={handleAddExperienceSubmit} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <Plus className="w-4 h-4" />
                  <span>Agregar Puesto o Formación</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Cargo o Título</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Técnico en Redes"
                      value={newExpForm.role}
                      onChange={(e) => setNewExpForm(ex => ({ ...ex, role: e.target.value }))}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Empresa / Escuela</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. E.E.S.T. N°5"
                      value={newExpForm.company}
                      onChange={(e) => setNewExpForm(ex => ({ ...ex, company: e.target.value }))}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Período</label>
                    <input
                      type="text"
                      placeholder="Ej. 2022 — Presente"
                      value={newExpForm.period}
                      onChange={(e) => setNewExpForm(ex => ({ ...ex, period: e.target.value }))}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Descripción</label>
                  <textarea
                    rows={2}
                    placeholder="Detalla las responsabilidades o conocimientos adquiridos..."
                    value={newExpForm.description}
                    onChange={(e) => setNewExpForm(ex => ({ ...ex, description: e.target.value }))}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-bold text-white bg-[#FBBC05] text-slate-900 hover:bg-amber-400 rounded-xl transition"
                  >
                    Guardar Experiencia
                  </button>
                </div>
              </form>

              {/* Experience Items List */}
              <div className="space-y-3">
                {data.experience.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5
                          contentEditable={true}
                          suppressContentEditableWarning={true}
                          onBlur={(e) => {
                            const text = e.currentTarget.innerText.trim();
                            if (text && text !== item.role) {
                              onSaveExperience({ ...item, role: text });
                              onPersistToStorage();
                            }
                          }}
                          title="Haz clic para editar el puesto"
                          className="font-bold text-sm text-slate-900 dark:text-white cursor-text hover:underline"
                        >
                          {item.role}
                        </h5>
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">• {item.company}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">
                          {item.period}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{item.description}</p>
                    </div>
                    <button
                      onClick={async () => {
                        const ok = await confirm({
                          title: '¿Eliminar experiencia?',
                          message: `¿Deseas eliminar "${item.role}" (${item.company})?`,
                          variant: 'danger',
                          confirmText: 'Eliminar Experiencia'
                        });
                        if (ok) {
                          onDeleteExperience(item.id);
                          onPersistToStorage();
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition"
                      title="Eliminar experiencia"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: LOGROS */}
          {activeTab === 'achievements' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              {/* Form to Add New Achievement */}
              <form onSubmit={handleAddAchievementSubmit} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <Plus className="w-4 h-4" />
                  <span>Agregar Logro o Certificación</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Título de la Certificación</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Certificado Cisco"
                      value={newAchForm.title}
                      onChange={(e) => setNewAchForm(a => ({ ...a, title: e.target.value }))}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Emisor</label>
                    <input
                      type="text"
                      placeholder="Ej. Cisco Networking Academy"
                      value={newAchForm.issuer}
                      onChange={(e) => setNewAchForm(a => ({ ...a, issuer: e.target.value }))}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Fecha</label>
                    <input
                      type="text"
                      placeholder="Ej. Diciembre 2024"
                      value={newAchForm.date}
                      onChange={(e) => setNewAchForm(a => ({ ...a, date: e.target.value }))}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Descripción</label>
                  <textarea
                    rows={2}
                    placeholder="Habilidades o reconocimientos incluidos..."
                    value={newAchForm.description}
                    onChange={(e) => setNewAchForm(a => ({ ...a, description: e.target.value }))}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-bold text-white bg-[#EA4335] hover:bg-rose-600 rounded-xl transition"
                  >
                    Guardar Certificado
                  </button>
                </div>
              </form>

              {/* Achievements List */}
              <div className="space-y-3">
                {data.achievements.map((ach) => (
                  <div
                    key={ach.id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5
                          contentEditable={true}
                          suppressContentEditableWarning={true}
                          onBlur={(e) => {
                            const text = e.currentTarget.innerText.trim();
                            if (text && text !== ach.title) {
                              onSaveAchievement({ ...ach, title: text });
                              onPersistToStorage();
                            }
                          }}
                          title="Haz clic para editar el título del certificado"
                          className="font-bold text-sm text-slate-900 dark:text-white cursor-text hover:underline"
                        >
                          {ach.title}
                        </h5>
                        <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold">• {ach.issuer}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">
                          {ach.date}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{ach.description}</p>
                    </div>
                    <button
                      onClick={async () => {
                        const ok = await confirm({
                          title: '¿Eliminar certificación / logro?',
                          message: `¿Deseas eliminar el logro "${ach.title}"?`,
                          variant: 'danger',
                          confirmText: 'Eliminar Logro'
                        });
                        if (ok) {
                          onDeleteAchievement(ach.id);
                          onPersistToStorage();
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition"
                      title="Eliminar logro"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}



        </div>

        {/* Modal Bottom Bar */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Consejo: Presiona <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded text-[10px]">Esc</kbd> para cerrar el gestor.
          </span>
          <button
            onClick={() => {
              onPersistToStorage();
              onClose();
            }}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#4285F4] hover:bg-[#3367D6] rounded-xl shadow-sm transition active:scale-95 flex items-center space-x-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Guardar Todo y Cerrar</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MasterContentModal;
