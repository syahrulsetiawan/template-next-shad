import axios from 'axios';

// Buat instance Axios
const api = axios.create({
  baseURL: 'https://api.namadomainmu.com/v1', // Ganti dengan URL API-mu
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor untuk menambahkan token ke header jika endpoint memerlukan auth
api.interceptors.request.use(
  (config) => {
    // Cek apakah config.headers.auth diatur ke true
    if (config.headers && config.headers.auth) {
      const token = localStorage.getItem('accessToken'); // Ganti dengan cara penyimpanan token-mu
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
