import { useState, useEffect, useCallback } from 'react';
import type { PortfolioData, Profile, Project, Skill, Experience, Achievement } from '../types/portfolio';
import { getPortfolioData, likeProjectApi, postGuestbookEntry, sendContactMessage } from '../utils/api';
import { fallbackPortfolioData } from '../utils/seedData';

const STORAGE_KEY = 'r4_portfolio_data';

export function usePortfolioData() {
  const [data, setData] = useState<PortfolioData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read saved portfolio data from localStorage:', e);
    }
    return fallbackPortfolioData;
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load data on mount (merge with backend if no local override)
  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setLoading(true);
        const result = await getPortfolioData();
        if (isMounted) {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            // Keep user's custom profile/projects edits, but update guestbook and likes
            try {
              const parsedSaved = JSON.parse(saved);
              setData({
                ...result,
                profile: parsedSaved.profile || result.profile,
                projects: parsedSaved.projects || result.projects,
                skills: parsedSaved.skills || result.skills,
                guestbook: result.guestbook || parsedSaved.guestbook
              });
            } catch (e) {
              setData(result);
            }
          } else {
            setData(result);
          }
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Error al conectar con la base de datos');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => { isMounted = false; };
  }, []);

  // Update profile in state
  const updateProfile = useCallback((updatedProfile: Profile) => {
    setData(prev => ({
      ...prev,
      profile: updatedProfile
    }));
    setHasUnsavedChanges(true);
  }, []);

  // Project CRUD
  const updateProject = useCallback((updatedProject: Project) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === updatedProject.id ? updatedProject : p)
    }));
    setHasUnsavedChanges(true);
  }, []);

  const addProject = useCallback((newProject: Project) => {
    setData(prev => ({
      ...prev,
      projects: [newProject, ...prev.projects]
    }));
    setHasUnsavedChanges(true);
  }, []);

  const deleteProject = useCallback((projectId: number) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== projectId)
    }));
    setHasUnsavedChanges(true);
  }, []);

  // Skill CRUD
  const updateSkill = useCallback((updatedSkill: Skill) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.map(s => s.id === updatedSkill.id ? updatedSkill : s)
    }));
    setHasUnsavedChanges(true);
  }, []);

  const addSkill = useCallback((newSkill: Skill) => {
    setData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
    setHasUnsavedChanges(true);
  }, []);

  const deleteSkill = useCallback((skillId: number) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== skillId)
    }));
    setHasUnsavedChanges(true);
  }, []);

  // Experience CRUD
  const updateExperienceItem = useCallback((updatedItem: Experience) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.map(e => e.id === updatedItem.id ? updatedItem : e)
    }));
    setHasUnsavedChanges(true);
  }, []);

  const addExperienceItem = useCallback((newItem: Experience) => {
    setData(prev => ({
      ...prev,
      experience: [newItem, ...prev.experience]
    }));
    setHasUnsavedChanges(true);
  }, []);

  const deleteExperienceItem = useCallback((itemId: number) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.filter(e => e.id !== itemId)
    }));
    setHasUnsavedChanges(true);
  }, []);

  // Achievement CRUD
  const updateAchievement = useCallback((updatedItem: Achievement) => {
    setData(prev => ({
      ...prev,
      achievements: prev.achievements.map(a => a.id === updatedItem.id ? updatedItem : a)
    }));
    setHasUnsavedChanges(true);
  }, []);

  const addAchievement = useCallback((newItem: Achievement) => {
    setData(prev => ({
      ...prev,
      achievements: [newItem, ...prev.achievements]
    }));
    setHasUnsavedChanges(true);
  }, []);

  const deleteAchievement = useCallback((achievementId: number) => {
    setData(prev => ({
      ...prev,
      achievements: prev.achievements.filter(a => a.id !== achievementId)
    }));
    setHasUnsavedChanges(true);
  }, []);

  // Guestbook Moderation (Delete)
  const deleteGuestbookEntry = useCallback((entryId: number) => {
    setData(prev => ({
      ...prev,
      guestbook: prev.guestbook.filter(g => g.id !== entryId)
    }));
    setHasUnsavedChanges(true);
  }, []);

  // Bulk update
  const updateWholePortfolio = useCallback((fullData: PortfolioData) => {
    setData(fullData);
    setHasUnsavedChanges(true);
  }, []);

  // Save changes explicitly to localStorage
  const saveChanges = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setHasUnsavedChanges(false);
      return true;
    } catch (e) {
      console.error('Failed to save portfolio data to localStorage:', e);
      return false;
    }
  }, [data]);

  // Discard unsaved changes and reload from localStorage or fallback
  const discardChanges = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setData(JSON.parse(saved));
      } else {
        setData(fallbackPortfolioData);
      }
      setHasUnsavedChanges(false);
    } catch (e) {
      setData(fallbackPortfolioData);
      setHasUnsavedChanges(false);
    }
  }, []);

  // Reset to original seed/backend defaults
  const resetDefaults = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setData(fallbackPortfolioData);
      setHasUnsavedChanges(false);
    } catch (e) {
      console.warn('Could not reset localStorage data:', e);
    }
  }, []);

  // Like project with optimistic update + backend persistence (1 per device)
  const likeProject = useCallback(async (projectId: number) => {
    try {
      const likedProjects: number[] = JSON.parse(localStorage.getItem('r4_liked_projects') || '[]');
      if (likedProjects.includes(projectId)) {
        return; // Already liked from this device
      }
      likedProjects.push(projectId);
      localStorage.setItem('r4_liked_projects', JSON.stringify(likedProjects));
    } catch (e) {}

    // 1. Optimistic update
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === projectId ? { ...p, likes: p.likes + 1 } : p
      )
    }));

    // 2. Call backend
    const updatedLikes = await likeProjectApi(projectId);
    if (updatedLikes !== null) {
      setData(prev => ({
        ...prev,
        projects: prev.projects.map(p =>
          p.id === projectId ? { ...p, likes: updatedLikes } : p
        )
      }));
    }
  }, []);

  // Submit guestbook entry
  const addGuestbookEntry = useCallback(async (entry: { name: string; message: string; role_or_company?: string }) => {
    const newEntry = await postGuestbookEntry(entry);
    setData(prev => ({
      ...prev,
      guestbook: [newEntry, ...prev.guestbook]
    }));
    return newEntry;
  }, []);

  // Submit contact message
  const submitContact = useCallback(async (contact: { name: string; email: string; subject?: string; message: string }) => {
    return await sendContactMessage(contact);
  }, []);

  return {
    data,
    loading,
    error,
    hasUnsavedChanges,
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
    deleteGuestbookEntry,
    updateWholePortfolio,
    saveChanges,
    discardChanges,
    resetDefaults,
    likeProject,
    addGuestbookEntry,
    submitContact
  };
}
