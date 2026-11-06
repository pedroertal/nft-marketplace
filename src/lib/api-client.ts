import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor de requisição: injeta o JWT persistido no localStorage
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('nft_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de resposta: trata 401 Unauthorized e erros padronizados
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<{ code?: string; message?: string }>) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // Se a sessão expirou, remove o token e notifica
        localStorage.removeItem('nft_token');
        localStorage.removeItem('nft_user');
      }
    }
    return Promise.reject(error);
  }
);
