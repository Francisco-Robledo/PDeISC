export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskCategory = 'general' | 'work' | 'personal' | 'study' | 'finance';

export interface Task {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  createdAt: string; // ISO date string or formatted date
  completed: boolean;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate?: string;
}

export type TaskFilterStatus = 'all' | 'pending' | 'completed';
export type TaskSortOption = 'newest' | 'oldest' | 'title' | 'priority';

export interface FilterOptions {
  searchQuery: string;
  status: TaskFilterStatus;
  category: string;
  sortBy: TaskSortOption;
}
