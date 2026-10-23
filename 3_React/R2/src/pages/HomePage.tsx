import React, { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { TaskCard } from '../components/TaskCard';
import { TaskStats } from '../components/TaskStats';
import { TaskFilter } from '../components/TaskFilter';
import type { FilterOptions } from '../types/task';
import { usePageTitle } from '../hooks/usePageTitle';
import { Plus, ListTodo, Sparkles } from 'lucide-react';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { AnimatePresence } from 'framer-motion';

const PRIORITY_WEIGHT: Record<string, number> = { high: 3, medium: 2, low: 1 };

const DEFAULT_FILTERS: FilterOptions = {
  searchQuery: '',
  status: 'all',
  category: 'all',
  sortBy: 'newest'
};

export const HomePage: React.FC = () => {
  usePageTitle('Lista de Tareas');

  const { tasks, reorderTasks } = useTasks();

  const [filterOptions, setFilterOptions] = useState<FilterOptions>(DEFAULT_FILTERS);

  const handleFilterChange = useCallback((updated: Partial<FilterOptions>) => {
    setFilterOptions(prev => ({ ...prev, ...updated }));
  }, []);

  const handleFilterReset = useCallback(() => {
    setFilterOptions(DEFAULT_FILTERS);
  }, []);

  const isFiltered =
    filterOptions.searchQuery.trim() !== '' ||
    filterOptions.status !== 'all' ||
    filterOptions.category !== 'all' ||
    filterOptions.sortBy !== 'newest';

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => {
        if (filterOptions.searchQuery.trim()) {
          const q = filterOptions.searchQuery.toLowerCase();
          if (
            !task.title.toLowerCase().includes(q) &&
            !task.description.toLowerCase().includes(q) &&
            !task.shortDescription.toLowerCase().includes(q)
          ) {
            return false;
          }
        }

        if (filterOptions.status === 'pending' && task.completed) return false;
        if (filterOptions.status === 'completed' && !task.completed) return false;

        if (filterOptions.category !== 'all' && task.category !== filterOptions.category) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filterOptions.sortBy === 'newest') {
          return 0;
        }
        
        switch (filterOptions.sortBy) {
          case 'oldest':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case 'title':
            return a.title.localeCompare(b.title);
          case 'priority':
            return (PRIORITY_WEIGHT[b.priority] ?? 0) - (PRIORITY_WEIGHT[a.priority] ?? 0);
          default:
            return 0;
        }
      });
  }, [tasks, filterOptions]);

  // Setup DND Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex(t => t.id === active.id);
      const newIndex = tasks.findIndex(t => t.id === over.id);
      reorderTasks(oldIndex, newIndex);
    }
  }, [tasks, reorderTasks]);

  return (
    <div className="py-6 sm:py-8 space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/70 dark:to-indigo-950/70 border border-blue-200/80 dark:border-blue-800/80 text-blue-600 dark:text-blue-400 text-xs font-bold mb-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            Panel de Control
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Lista de Tareas
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm md:text-base mt-1 font-medium">
            Organiza, filtra y gestiona tus pendientes de forma eficiente.
          </p>
        </div>

        <Link
          to="/create"
          className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 text-white font-bold text-sm shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 transition-all w-full sm:w-auto text-center shrink-0 transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          Crear Nueva Tarea
        </Link>
      </div>

      {/* Stats */}
      <TaskStats tasks={tasks} />

      {/* Filters */}
      <TaskFilter
        options={filterOptions}
        onChange={handleFilterChange}
        onReset={handleFilterReset}
      />

      {/* Task Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ListTodo className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
            Tareas ({filteredTasks.length})
          </h2>
          {filteredTasks.length !== tasks.length && (
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Mostrando {filteredTasks.length} de {tasks.length} tareas
            </span>
          )}
        </div>

        {isFiltered && filteredTasks.length > 0 && (
          <p className="text-xs text-slate-400 dark:text-slate-500 italic font-medium">
            * El reordenamiento manual (drag & drop) se desactiva mientras los filtros están activos.
          </p>
        )}

        {filteredTasks.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              <SortableContext 
                items={filteredTasks.map(t => t.id)}
                strategy={rectSortingStrategy}
              >
                <AnimatePresence mode="popLayout">
                  {filteredTasks.map(task => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      isDragDisabled={isFiltered} 
                    />
                  ))}
                </AnimatePresence>
              </SortableContext>
            </div>
          </DndContext>
        ) : (
          <div className="bg-white/95 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-8 sm:p-12 text-center space-y-4 light-card-shadow">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto">
              <ListTodo className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">No se encontraron tareas</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto font-medium">
                {tasks.length === 0
                  ? 'Aún no has registrado ninguna tarea. Haz clic en el botón para agregar la primera.'
                  : 'No hay ninguna tarea que coincida con los filtros aplicados actualmente.'}
              </p>
            </div>
            {tasks.length === 0 ? (
              <Link
                to="/create"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-md shadow-blue-600/20"
              >
                <Plus className="w-4 h-4" />
                Crear mi primera tarea
              </Link>
            ) : (
              <button
                onClick={handleFilterReset}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Restablecer filtros
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
