import type { Task } from '../types/task';

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Diseñar interfaz responsive R2ANTI',
    shortDescription: 'Crear el maquetado inicial con soporte para modo claro/oscuro y max-width 1200px.',
    description: 'Implementar el sistema de diseño visual con TailwindCSS, garantizando la perfecta visibilidad de la aplicación en pantallas móviles, tablets y computadoras de escritorio. Aplicar jerarquía visual y contraste adecuado.',
    createdAt: '2026-08-08T10:30:00.000Z',
    completed: true,
    priority: 'high',
    category: 'work',
    dueDate: '2026-08-09'
  },
  {
    id: 'task-2',
    title: 'Configurar React Router DOM v7',
    shortDescription: 'Establecer las rutas principales: Inicio, Detalle de Tarea y Creación.',
    description: 'Desarrollar el enrutamiento cliente con React Router. Configurar la página de inicio en /, el detalle dinámico en /task/:id y el formulario de nueva tarea en /create. Incluir manejo de ruta 404.',
    createdAt: '2026-08-08T11:15:00.000Z',
    completed: true,
    priority: 'high',
    category: 'study',
    dueDate: '2026-08-08'
  },
  {
    id: 'task-3',
    title: 'Implementar descarga de tareas en JSON',
    shortDescription: 'Permitir al usuario guardar y descargar un reporte/backup de sus tareas.',
    description: 'Crear un módulo utilitario que convierta la lista de tareas activa almacenada en el estado y localStorage a un archivo ejecutable/descargable de extensión .json para respaldo local.',
    createdAt: '2026-08-08T14:00:00.000Z',
    completed: false,
    priority: 'medium',
    category: 'finance',
    dueDate: '2026-08-10'
  },
  {
    id: 'task-4',
    title: 'Validación en vivo de formulario',
    shortDescription: 'Agregar feedback inmediato en la creación de tareas sin usar alert().',
    description: 'Implementar controles de validación de campos obligatorios, longitud mínima de título (3 caracteres) y descripción. Mostrar errores directamente debajo de cada control de entrada.',
    createdAt: '2026-08-08T15:45:00.000Z',
    completed: false,
    priority: 'high',
    category: 'personal',
    dueDate: '2026-08-11'
  },
  {
    id: 'task-5',
    title: 'Revisión final de usabilidad y accesibilidad',
    shortDescription: 'Verificar la experiencia del usuario y auditoría del PROMPT MAESTRO.',
    description: 'Realizar pruebas finales de navegación, comprobación de estados visuales, contraste en modo oscuro, respuesta a comandos de teclado y adaptabilidad responsive en diferentes resoluciones.',
    createdAt: '2026-08-08T16:20:00.000Z',
    completed: false,
    priority: 'low',
    category: 'general',
    dueDate: '2026-08-12'
  },
  {
    id: 'task-6',
    title: 'Auditar flujo completo de creación de tareas',
    shortDescription: 'Demostración paso a paso del ciclo de vida de una tarea en R2ANTI.',
    description: 'Esta tarea fue agregada para verificar el flujo de extremo a extremo: validación del formulario en CreateTaskPage, inserción en TaskContext, sincronización con localStorage, actualización de TaskStats y exportación a JSON.',
    createdAt: '2026-08-08T22:35:00.000Z',
    completed: false,
    priority: 'high',
    category: 'work',
    dueDate: '2026-08-15'
  }
];
