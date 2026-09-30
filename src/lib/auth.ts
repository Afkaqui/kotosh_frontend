export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'ENCARGADO' | 'OPERARIO';
  isActive: boolean;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

const TOKEN_KEY = 'kotosh_token';
const USER_KEY = 'kotosh_user';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function storeAuth(data: AuthResponse) {
  localStorage.setItem(TOKEN_KEY, data.access_token);
  storeUser(data.user);
}

export function storeUser(user: User) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export const ROLE_LABELS: Record<User['role'], string> = {
  ADMIN: 'Administrador',
  ENCARGADO: 'Encargado',
  OPERARIO: 'Operario',
};

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
