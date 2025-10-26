// src/services/authService.ts

import api from '../lib/api/axiosInstance';
import {
  ILoginCredentials,
  IAuthResponse,
  IAuthRegisterCredentials
} from '../types/types';
import {AxiosResponse, AxiosError} from 'axios';
import {handleAxiosError} from './handleAxiosError';

// Kita pisahkan fungsi logout agar bisa diimpor secara langsung oleh interceptor
export const logout = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  console.log('Logged out successfully.');

  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

// Kita pisahkan fungsi refreshToken agar bisa diimpor secara langsung oleh interceptor
export const refreshToken = async (): Promise<string> => {
  try {
    const refreshTokenValue = localStorage.getItem('refreshToken');
    if (!refreshTokenValue) {
      throw new Error('No refresh token available');
    }

    const response: AxiosResponse<{accessToken: string}> = await api.post(
      '/auth/refresh-token',
      {
        refreshToken: refreshTokenValue
      }
    );

    const newAccessToken = response.data.accessToken;
    localStorage.setItem('accessToken', newAccessToken);
    return newAccessToken;
  } catch (error) {
    logout();
    throw error;
  }
};

// Fungsi lain tetap diekspor sebagai objek default
const login = async (
  credentials: ILoginCredentials
): Promise<IAuthResponse> => {
  try {
    const response: AxiosResponse<IAuthResponse> = await api.post(
      '/login',
      credentials
    );
    localStorage.setItem('accessToken', response.data.accessToken);
    if (response.data.refreshToken) {
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Login');
    throw error;
  }
};

const register = async (
  userData: IAuthRegisterCredentials
): Promise<IAuthResponse> => {
  try {
    const response: AxiosResponse<IAuthResponse> = await api.post(
      '/auth/register',
      userData
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Registration');
    throw error;
  }
};

const authService = {
  login,
  register
};

export default authService;
