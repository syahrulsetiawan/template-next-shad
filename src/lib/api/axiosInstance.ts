import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  AxiosHeaders
} from 'axios';
import authService from '@/services/authService'; // sesuaikan path kamu

// Konfigurasi global
axios.defaults.withCredentials = true;

// Tambahkan tipe tambahan
interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  withAuth?: boolean;
  _retry?: boolean;
}

// Global flag & queue untuk refresh token
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else if (token) prom.resolve(token);
  });
  failedQueue = [];
};

// Buat instance axios utama
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

// Fungsi ambil cookie browser
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
};

// =========================
// REQUEST INTERCEPTOR
// =========================
api.interceptors.request.use(
  async (config: ExtendedAxiosRequestConfig) => {
    // 1️⃣ Pastikan CSRF cookie ada
    // if (!getCookie('XSRF-TOKEN')) {
    // }
    try {
      await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_XSRF}/sanctum/csrf-cookie`,
        {
          withCredentials: true
        }
      );
    } catch (err) {
      console.error('Gagal set CSRF cookie:', err);
    }

    // 2️⃣ Set header CSRF token
    const xsrfToken = getCookie('XSRF-TOKEN');
    if (xsrfToken) {
      config.headers = config.headers || {};
      (config.headers as AxiosHeaders)['X-XSRF-TOKEN'] = xsrfToken;
    }

    // 3️⃣ Tambahkan Bearer Token kalau withAuth = true
    if (config.withAuth) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers = config.headers || {};
        (config.headers as AxiosHeaders).Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =========================
// RESPONSE INTERCEPTOR
// =========================
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;

    // Kalau Unauthorized & belum di-retry → refresh token
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.withAuth
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({resolve, reject});
        })
          .then((newToken) => {
            originalRequest.headers = originalRequest.headers || {};
            (originalRequest.headers as AxiosHeaders).Authorization =
              `Bearer ${newToken}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await authService.refreshToken();
        localStorage.setItem('accessToken', newToken);

        processQueue(null, newToken);

        originalRequest.headers = originalRequest.headers || {};
        (originalRequest.headers as AxiosHeaders).Authorization =
          `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err);
        authService.logout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
