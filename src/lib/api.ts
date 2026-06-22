import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const message =
        error.response.data?.message || 'Ocurrio un error en el servidor';
      return Promise.reject(new Error(message));
    }
    if (error.request) {
      return Promise.reject(
        new Error('No se pudo conectar con el servidor. Verifica tu conexion.')
      );
    }
    return Promise.reject(error);
  }
);

export default api;
