// Interfaces para tipado estricto en TypeScript

export interface User {
  id: number;
  name: string;
  email: string;
  role_id?: number;
  role: string;
  status: 'activo' | 'inactivo';
  google_id?: string;
  avatar?: string;
  auth_provider?: 'local' | 'google' | 'facebook' | 'x' | 'discord' | 'github';
  provider_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface DatabaseStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  adminUsers: number;
  rolesCount: number;
  dbEngine: string;
  normalization: string;
  security: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
  token?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string; user?: User; token?: string }>;
  loginWithGoogle: (credential: string) => Promise<{ success: boolean; message?: string; user?: User; token?: string }>;
  loginWithDiscord: (code: string, redirectUri?: string) => Promise<{ success: boolean; message?: string; user?: User; token?: string }>;
  loginWithX: (code: string, codeVerifier: string, redirectUri?: string) => Promise<{ success: boolean; message?: string; user?: User; token?: string }>;
  loginWithGitHub: (code: string, redirectUri?: string) => Promise<{ success: boolean; message?: string; user?: User; token?: string }>;
  loginWithSocial: (params: { provider: 'facebook' | 'x' | 'discord' | 'github'; email: string; name?: string; avatar?: string; providerId?: string; accessToken?: string }) => Promise<{ success: boolean; message?: string; user?: User; token?: string }>;
  register: (userData: any) => Promise<{ success: boolean; message?: string; user?: User; token?: string }>;
  setSession: (token: string, user: User) => void;
  logout: () => void;
  setError: (err: string | null) => void;
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
