import axios from 'axios';
import { clearAuth, getStoredToken } from './auth';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
  }
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const isLogin = error.config?.url?.includes('/auth/login');
      if (status === 401 && !isLogin && typeof window !== 'undefined') {
        clearAuth();
        window.location.href = '/login?expired=1';
      }
      const raw = data?.message;
      const message = Array.isArray(raw)
        ? raw.join('. ')
        : raw ||
          (status === 403
            ? 'No tienes permisos para esta acción'
            : status === 429
              ? 'Demasiados intentos. Espera un minuto.'
              : 'Ocurrió un error en el servidor');
      return Promise.reject(new ApiError(message, status));
    }
    if (error.request) {
      return Promise.reject(
        new ApiError('No se pudo conectar con el servidor. Verifica tu conexión.'),
      );
    }
    return Promise.reject(error);
  },
);

export default api;
