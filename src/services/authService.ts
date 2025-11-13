// src/services/authService.ts

import api from '../lib/api/axiosInstance';
import {ILoginCredentials, IAuthRegisterCredentials} from '../types/types';
import {UserData, LoginResponse, MeResponse} from '../types/UserTypes';
import {AxiosResponse} from 'axios';
import {handleAxiosError} from './handleAxiosError';
import {encrypt, decrypt} from '@/helpers/encryption_helper';

// Helper function untuk set cookie (selaras dengan middleware)
const setCookie = (name: string, value: string, days: number) => {
  if (typeof document === 'undefined') return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  // Match middleware settings: httpOnly=false, secure in production, SameSite=Lax
  const isProduction = process.env.NODE_ENV === 'production';
  const secureFlag = isProduction ? 'Secure;' : '';

  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax;${secureFlag}`;
};

// Helper function untuk delete cookie
const deleteCookie = (name: string) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

// Kita pisahkan fungsi logout agar bisa diimpor secara langsung oleh interceptor
export const logout = (): void => {
  console.log('[AuthService] Logout initiated - clearing all auth data');

  // Hapus semua dari localStorage
  localStorage.removeItem('X-LANYA-AT');
  localStorage.removeItem('X-LANYA-RT');
  localStorage.removeItem('user');

  // Hapus semua cookies
  deleteCookie('X-LANYA-AT');
  deleteCookie('X-LANYA-RT');
  deleteCookie('X-LANYA-USER');

  // Clear session storage
  sessionStorage.clear();

  console.log('[AuthService] All tokens and cookies cleared');

  // Redirect ke login
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

// Kita pisahkan fungsi refreshToken agar bisa diimpor secara langsung oleh interceptor
export const refreshToken = async (): Promise<string> => {
  try {
    const refreshTokenValue = localStorage.getItem('X-LANYA-RT');
    if (!refreshTokenValue) {
      throw new Error('No refresh token available');
    }

    const response: AxiosResponse<{
      success: boolean;
      data: {accessToken: string; refreshToken: string};
    }> = await api.post('/auth/refresh', {
      refreshToken: refreshTokenValue
    });

    const {accessToken, refreshToken: newRefreshToken} = response.data.data;

    // Simpan ke localStorage
    localStorage.setItem('X-LANYA-AT', accessToken);
    localStorage.setItem('X-LANYA-RT', newRefreshToken);

    // Simpan ke cookie juga untuk middleware
    setCookie('X-LANYA-AT', accessToken, 1 / 24); // 1 jam
    setCookie('X-LANYA-RT', newRefreshToken, 7); // 7 hari

    return accessToken;
  } catch (error) {
    logout();
    throw error;
  }
};

// Fungsi lain tetap diekspor sebagai objek default
const login = async (credentials: ILoginCredentials): Promise<UserData> => {
  try {
    const response: AxiosResponse<LoginResponse> = await api.post(
      '/auth/login',
      credentials,
      {withAuth: false} as any
    );

    const {accessToken, refreshToken, user} = response.data.data;

    // Simpan token ke localStorage (tidak perlu encrypt AT & RT)
    localStorage.setItem('X-LANYA-AT', accessToken);
    localStorage.setItem('X-LANYA-RT', refreshToken);

    // Encrypt user data sebelum simpan ke localStorage
    const encryptedUser = encrypt(user);
    localStorage.setItem('user', encryptedUser);

    // Simpan ke cookie juga untuk middleware
    setCookie('X-LANYA-AT', accessToken, 1 / 24); // 1 jam
    setCookie('X-LANYA-RT', refreshToken, 7); // 7 hari

    // Encrypt user data sebelum simpan ke cookie
    setCookie('X-LANYA-USER', encryptedUser, 7); // 7 hari - PENTING untuk middleware

    return user;
  } catch (error) {
    let errorInfo = handleAxiosError(error, 'Login');
    throw errorInfo;
  }
};

const myProfile = async (): Promise<UserData> => {
  try {
    const response: AxiosResponse<MeResponse> = await api.get('/auth/me');
    return response.data.data;
  } catch (error) {
    let errorInfo = handleAxiosError(error, 'MyProfile');
    throw errorInfo;
  }
};

const register = async (
  userData: IAuthRegisterCredentials
): Promise<UserData> => {
  try {
    const response: AxiosResponse<LoginResponse> = await api.post(
      '/auth/register',
      userData,
      {withAuth: false} as any
    );

    const {accessToken, refreshToken, user} = response.data.data;

    // Simpan token ke localStorage (tidak perlu encrypt AT & RT)
    localStorage.setItem('X-LANYA-AT', accessToken);
    localStorage.setItem('X-LANYA-RT', refreshToken);

    // Encrypt user data sebelum simpan ke localStorage
    const encryptedUser = encrypt(user);
    localStorage.setItem('user', encryptedUser);

    // Simpan ke cookie juga untuk middleware
    setCookie('X-LANYA-AT', accessToken, 1 / 24); // 1 jam
    setCookie('X-LANYA-RT', refreshToken, 7); // 7 hari

    // Encrypt user data sebelum simpan ke cookie
    setCookie('X-LANYA-USER', encryptedUser, 7); // 7 hari - PENTING untuk middleware

    return user;
  } catch (error) {
    handleAxiosError(error, 'Registration');
    throw error;
  }
};

const authService = {
  login,
  register,
  myProfile,
  logout,
  refreshToken
};

export default authService;
