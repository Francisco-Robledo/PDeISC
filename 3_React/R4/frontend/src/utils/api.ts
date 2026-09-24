import type { PortfolioData, GuestbookEntry } from '../types/portfolio';
import { fallbackPortfolioData } from './seedData';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export async function getPortfolioData(): Promise<PortfolioData> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${API_BASE}/portfolio`, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
    return fallbackPortfolioData;
  } catch (error) {
    console.warn('Backend API unavailable or timed out, using fallback portfolio data:', error);
    return fallbackPortfolioData;
  }
}

export async function likeProjectApi(projectId: number): Promise<number | null> {
  try {
    const res = await fetch(`${API_BASE}/projects/${projectId}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Failed to like project');
    const json = await res.json();
    return json.project?.likes ?? null;
  } catch (err) {
    console.warn('Error liking project on server, applying local update:', err);
    return null;
  }
}

export async function sendContactMessage(data: { name: string; email: string; subject?: string; message: string }) {
  const res = await fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Error al enviar el mensaje');
  }
  return json;
}

export async function postGuestbookEntry(data: { name: string; message: string; role_or_company?: string }): Promise<GuestbookEntry> {
  const res = await fetch(`${API_BASE}/guestbook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Error al publicar en el libro de visitas');
  }
  return json.entry;
}

export async function getGuestbookEntries(): Promise<GuestbookEntry[]> {
  try {
    const res = await fetch(`${API_BASE}/guestbook`);
    if (!res.ok) throw new Error('Failed to fetch guestbook');
    const json = await res.json();
    return json.entries || [];
  } catch (err) {
    console.warn('Could not fetch guestbook, using fallback:', err);
    return fallbackPortfolioData.guestbook;
  }
}

export async function getCongratulationsApi(): Promise<number> {
  try {
    const res = await fetch(`${API_BASE}/congratulations`);
    if (!res.ok) return 38;
    const json = await res.json();
    return json.count ?? 38;
  } catch {
    return 38;
  }
}

export async function addCongratulationsApi(): Promise<number> {
  try {
    const res = await fetch(`${API_BASE}/congratulations`, { method: 'POST' });
    if (!res.ok) return 39;
    const json = await res.json();
    return json.count ?? 39;
  } catch {
    return 39;
  }
}
