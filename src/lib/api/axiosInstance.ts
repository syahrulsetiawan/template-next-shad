import axios, {
  AxiosInstance,
  AxiosError,
  AxiosHeaders,
  InternalAxiosRequestConfig
} from 'axios';

// Tambahkan tipe tambahan
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
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
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

// =========================
// REQUEST INTERCEPTOR
// =========================
api.interceptors.request.use(
  (config: ExtendedAxiosRequestConfig) => {
    // Tambahkan Bearer Token dari localStorage kalau withAuth = true
    if (config.withAuth !== false) {
      // Default true kecuali explicitly false
      const token = localStorage.getItem('X-LANYA-AT');
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
      originalRequest.withAuth !== false
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
        const refreshToken = localStorage.getItem('X-LANYA-RT');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Hit endpoint /refresh dengan refreshToken
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {refreshToken}
        );

        const {accessToken, refreshToken: newRefreshToken} = response.data.data;

        // Simpan token baru
        localStorage.setItem('X-LANYA-AT', accessToken);
        localStorage.setItem('X-LANYA-RT', newRefreshToken);

        processQueue(null, accessToken);

        originalRequest.headers = originalRequest.headers || {};
        (originalRequest.headers as AxiosHeaders).Authorization =
          `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err);
        // Import authService untuk logout yang proper (clear cookies + localStorage)
        import('@/services/authService').then((module) => {
          module.logout();
        });
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Jika 401 dan bukan dalam refresh flow, langsung logout
    if (error.response?.status === 401) {
      console.log('[AxiosInterceptor] 401 detected, logging out...');
      import('@/services/authService').then((module) => {
        module.logout();
      });
    }

    return Promise.reject(error);
  }
);

export default api;
