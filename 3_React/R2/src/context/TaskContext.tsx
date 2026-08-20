import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { INITIAL_TASKS } from '../data/initialTasks';
import type { Task, TaskPriority, TaskCategory } from '../types/task';
import { downloadTasksAsJSON, downloadTasksAsCSV } from '../utils/exportUtils';
import { arrayMove } from '@dnd-kit/sortable';

export interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface NewTaskInput {
  title: string;
  shortDescription?: string;
  description: string;
  priority: TaskPriority;
  category: TaskCategory;
  completed: boolean;
  dueDate?: string;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (newTask: NewTaskInput) => Task;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => boolean;
  toggleTaskStatus: (id: string) => void;
  deleteTask: (id: string) => boolean;
  getTaskById: (id: string) => Task | undefined;
  exportTasks: (format?: 'json' | 'csv') => void;
  toasts: ToastState[];
  removeToast: (id: string) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  reorderTasks: (oldIndex: number, newIndex: number) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'r2anti_tasks_data';
const LOCAL_STORAGE_INITIALIZED_KEY = 'r2anti_initialized';
const MAX_TOASTS = 3;

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const isInitialized = localStorage.getItem(LOCAL_STORAGE_INITIALIZED_KEY);
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);

      if (isInitialized) {
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) return parsed;
        }
        return [];
      }
    } catch (e) {
      console.error('Error loading tasks from localStorage:', e);
    }
    return INITIAL_TASKS;
  });

  const [toasts, setToasts] = useState<ToastState[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
      localStorage.setItem(LOCAL_STORAGE_INITIALIZED_KEY, 'true');
    } catch (e) {
      console.error('Error saving tasks to localStorage:', e);
    }
  }, [tasks]);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + '-' + Math.random().toString(36).substring(2, 9);
    setToasts(prev => {
      if (prev.length > 0 && prev[prev.length - 1].message === message) {
        return prev;
      }
      const next = [...prev, { id, message, type }];
      return next.slice(-MAX_TOASTS);
    });
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addTask = useCallback((input: NewTaskInput): Task => {
    const descTrimmed = input.description.trim();
    const autoShort =
      input.shortDescription && input.shortDescription.trim().length > 0
        ? input.shortDescription.trim()
        : descTrimmed.length > 90
        ? descTrimmed.substring(0, 90) + '...'
        : descTrimmed;

    const newTask: Task = {
      id: 'task-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      title: input.title.trim(),
      shortDescription: autoShort,
      description: descTrimmed,
      createdAt: new Date().toISOString(),
      completed: input.completed,
      priority: input.priority,
      category: input.category,
      dueDate: input.dueDate || undefined
    };

    setTasks(prev => [newTask, ...prev]);
    showToast(`Tarea "${newTask.title}" creada correctamente`, 'success');
    return newTask;
  }, [showToast]);

  const updateTask = useCallback((
    id: string,
    updates: Partial<Omit<Task, 'id' | 'createdAt'>>
  ): boolean => {
    const exists = tasks.some(t => t.id === id);
    if (!exists) return false;

    setTasks(prev =>
      prev.map(task => (task.id === id ? { ...task, ...updates } : task))
    );
    showToast('Tarea actualizada correctamente', 'success');
    return true;
  }, [tasks, showToast]);

  // Clean, instant toggle without filler toast notifications
  const toggleTaskStatus = useCallback((id: string) => {
    setTasks(prev =>
      prev.map(task => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  }, []);

  const deleteTask = useCallback((id: string): boolean => {
    const target = tasks.find(t => t.id === id);
    if (!target) return false;

    setTasks(prev => prev.filter(t => t.id !== id));
    showToast(`Tarea "${target.title}" eliminada`, 'info');
    return true;
  }, [tasks, showToast]);

  const getTaskById = useCallback((id: string): Task | undefined => {
    return tasks.find(t => t.id === id);
  }, [tasks]);

  const exportTasks = useCallback((format: 'json' | 'csv' = 'json') => {
    if (format === 'json') {
      downloadTasksAsJSON(tasks);
    } else {
      downloadTasksAsCSV(tasks);
    }
    showToast(`Archivo de tareas (${format.toUpperCase()}) descargado`, 'success');
  }, [tasks, showToast]);

  const reorderTasks = useCallback((oldIndex: number, newIndex: number) => {
    setTasks(prev => arrayMove(prev, oldIndex, newIndex));
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        toggleTaskStatus,
        deleteTask,
        getTaskById,
        exportTasks,
        toasts,
        removeToast,
        showToast,
        reorderTasks
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
