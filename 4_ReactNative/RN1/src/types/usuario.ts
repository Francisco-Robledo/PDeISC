// src/types/usuario.ts
// Definiciones de tipos e interfaces para TypeScript

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  telefono?: string;
  fechaRegistro?: string;
}

export interface LoginResponse {
  success: boolean;
  mensaje: string;
  usuario?: Usuario;
  advertencia?: string;
  error?: string;
}

export type TipoPagina = 'login' | 'bienvenida';
