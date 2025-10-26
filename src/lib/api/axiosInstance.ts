// src/lib/api/axiosInstance.ts
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  AxiosResponse,
  AxiosHeaders
} from 'axios';
import authService from '../../services/authService'; // Ganti dengan path yang benar

// Perbarui interface untuk menambahkan properti kustom _retry
export interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  withAuth?: boolean;
  _retry?: boolean; // Properti kustom untuk logika retry
}

// Global flag untuk mencegah refresh token secara bersamaan
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

// Interceptor Permintaan: Menambahkan token akses
api.interceptors.request.use(
  (config: ExtendedAxiosRequestConfig) => {
    if (config.withAuth) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        (config.headers as AxiosHeaders).Authorization = `Bearer ${token}`;
      }
    }
    return config as any;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor Respons: Menangani error 401 (Unauthorized)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({resolve, reject});
        })
          .then((token) => {
            originalRequest.headers = (originalRequest.headers ||
              {}) as AxiosHeaders;
            originalRequest.headers.Authorization = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await authService.refreshToken();

        localStorage.setItem('accessToken', newAccessToken);

        (originalRequest.headers as AxiosHeaders).Authorization =
          `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        authService.logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
