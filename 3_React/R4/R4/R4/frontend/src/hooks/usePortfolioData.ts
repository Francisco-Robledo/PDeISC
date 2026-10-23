import { useState, useEffect, useCallback } from 'react';
import type { PortfolioData } from '../types/portfolio';
import { getPortfolioData, likeProjectApi, postGuestbookEntry, sendContactMessage } from '../utils/api';
import { fallbackPortfolioData } from '../utils/seedData';

export function usePortfolioData() {
  const [data, setData] = useState<PortfolioData>(fallbackPortfolioData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data on mount
  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setLoading(true);
        const result = await getPortfolioData();
        if (isMounted) {
          setData(result);
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
    likeProject,
    addGuestbookEntry,
    submitContact
  };
}
