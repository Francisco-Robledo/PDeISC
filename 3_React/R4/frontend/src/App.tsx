import { useState, useCallback } from 'react';
import { useTheme } from './hooks/useTheme';
import { useScrollSpy } from './hooks/useScrollSpy';
import { usePortfolioData } from './hooks/usePortfolioData';
import { useSpotlight } from './hooks/useSpotlight';
import type { Project, Profile } from './types/portfolio';

// Components
import { Navbar } from './components/Navbar';
import { SpotlightSearch } from './components/SpotlightSearch';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { AchievementsSection } from './components/AchievementsSection';
import { ContactSection } from './components/ContactSection';
import { ProjectModal } from './components/ProjectModal';
import { Footer } from './components/Footer';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { AdminPasswordModal } from './components/AdminPasswordModal';
import { AdminEditBar } from './components/AdminEditBar';
import { EditProfileModal } from './components/EditProfileModal';
import { MasterContentModal } from './components/MasterContentModal';
import { useConfirm } from './context/ConfirmContext';

const sectionIds = [
  'hero',
  'about',
  'skills',
  'projects',
  'experience',
  'achievements',
  'contact'
];

export function App() {
  const { isDark, toggleTheme } = useTheme();
  const { activeSection, scrollProgress, scrollToSection } = useScrollSpy(sectionIds);
  const {
    data,
    updateProfile,
    updateProject,
    addProject,
    deleteProject,
    updateSkill,
    addSkill,
    deleteSkill,
    updateExperienceItem,
    addExperienceItem,
    deleteExperienceItem,
    updateAchievement,
    addAchievement,
    deleteAchievement,
    saveChanges,
    discardChanges,
    resetDefaults,
    hasUnsavedChanges,
    likeProject,
    submitContact
  } = usePortfolioData();
  const { isOpen: isSpotlightOpen, openSpotlight, closeSpotlight } = useSpotlight();
  const confirm = useConfirm();

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Admin and Edit Mode States
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isMasterModalOpen, setIsMasterModalOpen] = useState(false);
  const [masterModalTab, setMasterModalTab] = useState<'profile' | 'projects' | 'skills' | 'experience' | 'achievements'>('profile');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Toast Helper
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  }, []);

  const handleUpdateProfileField = useCallback((field: keyof Profile, value: any) => {
    updateProfile({
      ...data.profile,
      [field]: value
    });
    showToast(`"${field}" modificado. Recuerda presionar Guardar.`);
  }, [data.profile, updateProfile, showToast]);

  const handleAdminSuccess = useCallback(() => {
    setIsEditMode(true);
    showToast('¡Modo de edición activado! Puedes modificar los datos directamente en la página.');
  }, [showToast]);

  const handleSaveChanges = useCallback(async () => {
    const ok = await confirm({
      title: '¿Confirmar guardado?',
      message: '¿Estás seguro de que deseas guardar permanentemente todos los cambios en el portafolio?',
      variant: 'info',
      confirmText: 'Guardar Cambios'
    });
    if (!ok) return;

    const success = saveChanges();
    if (success) {
      showToast('¡Cambios guardados con éxito en el navegador!');
    } else {
      showToast('Error al guardar cambios en localStorage');
    }
  }, [confirm, saveChanges, showToast]);

  const handleDiscardChanges = useCallback(async () => {
    const ok = await confirm({
      title: '¿Descartar cambios?',
      message: '¿Estás seguro de que deseas descartar todas las modificaciones no guardadas?',
      variant: 'warning',
      confirmText: 'Descartar Cambios'
    });
    if (!ok) return;

    discardChanges();
    showToast('Cambios no guardados revertidos al último guardado');
  }, [confirm, discardChanges, showToast]);

  const handleResetDefaults = useCallback(async () => {
    const ok = await confirm({
      title: '¿Restablecer datos originales?',
      message: 'Se borrarán todos los textos y proyectos personalizados guardados en este navegador y se restaurarán los valores de fábrica.',
      variant: 'warning',
      confirmText: 'Restablecer Todo'
    });
    if (ok) {
      resetDefaults();
      showToast('Datos restablecidos a los valores iniciales');
    }
  }, [confirm, resetDefaults, showToast]);

  const handleExitEditMode = useCallback(async () => {
    if (hasUnsavedChanges) {
      const ok = await confirm({
        title: '¿Salir del modo edición?',
        message: 'Tienes cambios sin guardar. Si sales ahora, se descartarán las modificaciones pendientes.',
        variant: 'warning',
        confirmText: 'Descartar y Salir'
      });
      if (ok) {
        discardChanges();
        setIsEditMode(false);
        showToast('Modo edición finalizado');
      }
    } else {
      setIsEditMode(false);
      showToast('Modo edición finalizado');
    }
  }, [confirm, hasUnsavedChanges, discardChanges, showToast]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#111315] text-slate-900 dark:text-slate-100 transition-colors duration-300 selection:bg-blue-500/20 selection:text-[#4285F4]">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <aside
          aria-label="Notificaciones del sistema"
          className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm px-4 py-3 bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 rounded-2xl shadow-xl backdrop-blur-md text-xs sm:text-sm font-medium border border-slate-700/50 dark:border-slate-200/50 flex items-center justify-between gap-3 animate-slide-up"
        >
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 dark:text-slate-600 hover:text-white dark:hover:text-black text-xs font-bold p-1"
          >
            ✕
          </button>
        </aside>
      )}

      {/* Google-Styled Navbar */}
      <Navbar
        activeSection={activeSection}
        scrollProgress={scrollProgress}
        scrollToSection={scrollToSection}
        isDark={isDark}
        toggleTheme={toggleTheme}
        openSpotlight={openSpotlight}
        isEditMode={isEditMode}
        openAdminModal={() => setIsAdminModalOpen(true)}
      />

      {/* Main Single Page Content */}
      <main className="relative">
        <HeroSection
          profile={data.profile}
          scrollToSection={scrollToSection}
          isEditMode={isEditMode}
          onUpdateField={handleUpdateProfileField}
        />

        <AboutSection
          profile={data.profile}
          scrollToSection={scrollToSection}
          isEditMode={isEditMode}
          onUpdateField={handleUpdateProfileField}
        />

        <SkillsSection
          skills={data.skills}
          isEditMode={isEditMode}
          onUpdateSkill={(skill) => {
            updateSkill(skill);
            showToast(`Habilidad "${skill.name}" modificada`);
          }}
          onDeleteSkill={(id) => {
            deleteSkill(id);
            showToast('Habilidad eliminada');
          }}
          onOpenCreateSkill={() => {
            setMasterModalTab('skills');
            setIsMasterModalOpen(true);
          }}
        />

        <ProjectsSection
          projects={data.projects}
          isEditMode={isEditMode}
          onSelectProject={(project) => setSelectedProject(project)}
          onLikeProject={likeProject}
          onUpdateProject={(proj) => {
            updateProject(proj);
            showToast(`Proyecto "${proj.title}" modificado`);
          }}
          onDeleteProject={(id) => {
            deleteProject(id);
            showToast('Proyecto eliminado');
          }}
          onOpenCreateProject={() => {
            setMasterModalTab('projects');
            setIsMasterModalOpen(true);
          }}
        />

        <ExperienceTimeline
          experience={data.experience}
          isEditMode={isEditMode}
          onUpdateExperienceItem={(item) => {
            updateExperienceItem(item);
            showToast(`Experiencia "${item.role}" modificada`);
          }}
          onDeleteExperienceItem={(id) => {
            deleteExperienceItem(id);
            showToast('Experiencia eliminada');
          }}
          onOpenCreateExperience={() => {
            setMasterModalTab('experience');
            setIsMasterModalOpen(true);
          }}
        />

        <AchievementsSection
          achievements={data.achievements}
          isEditMode={isEditMode}
          onUpdateAchievement={(ach) => {
            updateAchievement(ach);
            showToast(`Logro "${ach.title}" modificado`);
          }}
          onDeleteAchievement={(id) => {
            deleteAchievement(id);
            showToast('Logro eliminado');
          }}
          onOpenCreateAchievement={() => {
            setMasterModalTab('achievements');
            setIsMasterModalOpen(true);
          }}
        />

        <ContactSection
          profile={data.profile}
          onSubmitContact={submitContact}
        />
      </main>

      {/* Footer */}
      <Footer
        scrollToSection={scrollToSection}
        openSpotlight={openSpotlight}
      />

      {/* Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onLike={likeProject}
      />

      {/* Google Spotlight Command Palette (Ctrl + K) */}
      <SpotlightSearch
        isOpen={isSpotlightOpen}
        onClose={closeSpotlight}
        data={data}
        scrollToSection={scrollToSection}
        onSelectProject={(project) => setSelectedProject(project)}
      />

      {/* Admin Password Modal */}
      <AdminPasswordModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccess={handleAdminSuccess}
      />

      {/* Edit Profile Detailed Modal */}
      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        profile={data.profile}
        onSave={(updatedProfile) => {
          updateProfile(updatedProfile);
          showToast('Perfil actualizado. Presiona "Guardar" para persistir los cambios.');
        }}
      />

      {/* Master Content Modal (Total Editor for everything) */}
      <MasterContentModal
        isOpen={isMasterModalOpen}
        onClose={() => setIsMasterModalOpen(false)}
        initialTab={masterModalTab}
        data={data}
        onSaveProfile={(prof) => {
          updateProfile(prof);
          showToast('Perfil actualizado');
        }}
        onSaveProject={(proj) => {
          updateProject(proj);
          showToast(`Proyecto "${proj.title}" actualizado`);
        }}
        onAddProject={(proj) => {
          addProject(proj);
          showToast(`Proyecto "${proj.title}" agregado`);
        }}
        onDeleteProject={(id) => {
          deleteProject(id);
          showToast('Proyecto eliminado');
        }}
        onSaveSkill={(sk) => {
          updateSkill(sk);
          showToast(`Habilidad "${sk.name}" actualizada`);
        }}
        onAddSkill={(sk) => {
          addSkill(sk);
          showToast(`Habilidad "${sk.name}" agregada`);
        }}
        onDeleteSkill={(id) => {
          deleteSkill(id);
          showToast('Habilidad eliminada');
        }}
        onSaveExperience={(exp) => {
          updateExperienceItem(exp);
          showToast(`Experiencia "${exp.role}" actualizada`);
        }}
        onAddExperience={(exp) => {
          addExperienceItem(exp);
          showToast(`Experiencia "${exp.role}" agregada`);
        }}
        onDeleteExperience={(id) => {
          deleteExperienceItem(id);
          showToast('Experiencia eliminada');
        }}
        onSaveAchievement={(ach) => {
          updateAchievement(ach);
          showToast(`Logro "${ach.title}" actualizado`);
        }}
        onAddAchievement={(ach) => {
          addAchievement(ach);
          showToast(`Logro "${ach.title}" agregado`);
        }}
        onDeleteAchievement={(id) => {
          deleteAchievement(id);
          showToast('Logro eliminado');
        }}
        onPersistToStorage={handleSaveChanges}
      />

      {/* Floating Bottom Admin Edit Bar */}
      <AdminEditBar
        isEditMode={isEditMode}
        hasUnsavedChanges={hasUnsavedChanges}
        onOpenEditProfile={() => setIsEditProfileModalOpen(true)}
        onOpenMasterManager={() => {
          setMasterModalTab('profile');
          setIsMasterModalOpen(true);
        }}
        onSaveChanges={handleSaveChanges}
        onDiscardChanges={handleDiscardChanges}
        onResetDefaults={handleResetDefaults}
        onExitEditMode={handleExitEditMode}
      />

      {/* Floating Scroll to Top Button */}
      <ScrollToTopButton />
    </div>
  );
}

export default App;
