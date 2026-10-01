export type ComponentCategory =
  | 'Todos'
  | 'Estructura & Layout'
  | 'Interacción & Controles'
  | 'Listas'
  | 'Feedback & Superposiciones'
  | 'Dispositivo & Utilidades';

export type ComponentLevel = 'Básico' | 'Intermedio' | 'Avanzado';

export interface ComponentInfo {
  id: string;
  name: string;
  category: Exclude<ComponentCategory, 'Todos'>;
  purpose: string; // Explicación de para qué se usa
  description: string;
  keyProps: string[];
  codeExample: string;
  badgeColor: string;
  level: ComponentLevel;
  icon: string;
}
