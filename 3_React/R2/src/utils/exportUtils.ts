import type { Task } from '../types/task';

/**
 * Downloads the current list of tasks as a formatted JSON file.
 * @param tasks List of tasks to export
 * @param filename Optional custom filename
 */
export const downloadTasksAsJSON = (tasks: Task[], filename = 'tareas_r2anti.json'): void => {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

/**
 * Downloads the current list of tasks as a CSV file.
 * @param tasks List of tasks to export
 */
export const downloadTasksAsCSV = (tasks: Task[], filename = 'tareas_r2anti.csv'): void => {
  if (!tasks.length) return;

  const headers = ['ID', 'Título', 'Descripción Corta', 'Descripción Completa', 'Estado', 'Prioridad', 'Categoría', 'Fecha Creación', 'Fecha Vencimiento'];
  const rows = tasks.map(t => [
    `"${t.id}"`,
    `"${t.title.replace(/"/g, '""')}"`,
    `"${t.shortDescription.replace(/"/g, '""')}"`,
    `"${t.description.replace(/"/g, '""')}"`,
    `"${t.completed ? 'Completa' : 'Incompleta'}"`,
    `"${t.priority}"`,
    `"${t.category}"`,
    `"${t.createdAt}"`,
    `"${t.dueDate || ''}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', encodedUri);
  downloadAnchor.setAttribute('download', filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};
