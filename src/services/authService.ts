// src/services/authService.ts

import api from '../lib/api/axiosInstance';
import {ILoginCredentials, IAuthRegisterCredentials} from '../types/types';
import {UserData, LoginResponse, MeResponse} from '../types/UserTypes';
import {AxiosResponse} from 'axios';
import {handleAxiosError} from './handleAxiosError';
import {encrypt, decrypt} from '@/helpers/encryption_helper';
import Cookies from 'js-cookie';

// Kita pisahkan fungsi logout agar bisa diimpor secara langsung oleh interceptor
export const logout = (): void => {
  const response = api.post('/auth/logout').catch((err) => {
    console.error('[AuthService] Logout API call failed:', err);
  });

  console.log('[AuthService] Logout initiated - clearing all auth data');

  // Hapus semua dari localStorage (hanya user data)
  localStorage.removeItem('X-LANYA-USER');

  // Hapus semua cookies (tokens)
  Cookies.remove('X-LANYA-AT', {path: '/'});
  Cookies.remove('X-LANYA-RT', {path: '/'});

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
    // Get refresh token dari cookie (bukan localStorage)
    const refreshTokenValue = Cookies.get('X-LANYA-RT');
    if (!refreshTokenValue) {
      throw new Error('No refresh token available');
    }

    console.log('[AuthService] Refreshing token...');

    const response: AxiosResponse<{
      success: boolean;
      data: {accessToken: string; refreshToken: string};
    }> = await api.post('/auth/refresh', {
      refreshToken: refreshTokenValue
    });

    const {accessToken, refreshToken: newRefreshToken} = response.data.data;

    // Simpan tokens ke cookie (bukan localStorage)
    Cookies.set('X-LANYA-AT', accessToken, {expires: 1 / 24, path: '/'});
    Cookies.set('X-LANYA-RT', newRefreshToken, {expires: 7, path: '/'});

    console.log('[AuthService] Token refreshed successfully');

    // Fetch user data terbaru dari /me dan update localStorage (bukan cookie)
    try {
      const meResponse: AxiosResponse<{
        success: boolean;
        data: UserData;
      }> = await api.get('/auth/me');

      const userData = meResponse.data.data;

      // Encrypt dan simpan user data ke localStorage (bukan cookie - terlalu besar)
      const encryptedUser = encrypt(userData);
      localStorage.setItem('X-LANYA-USER', encryptedUser);

      console.log(
        '[AuthService] User data synced to localStorage after refresh'
      );
    } catch (meError) {
      console.warn(
        '[AuthService] Failed to sync user data after refresh:',
        meError
      );
      // Don't throw - refresh token already succeeded
    }

    return accessToken;
  } catch (error) {
    console.error('[AuthService] Token refresh failed:', error);
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

    // Simpan tokens ke cookie (untuk middleware)
    Cookies.set('X-LANYA-AT', accessToken, {expires: 1 / 24, path: '/'});
    Cookies.set('X-LANYA-RT', refreshToken, {expires: 7, path: '/'});

    console.log('[AuthService] Login - Cookies set:', {
      AT: Cookies.get('X-LANYA-AT') ? 'SET' : 'FAILED',
      RT: Cookies.get('X-LANYA-RT') ? 'SET' : 'FAILED',
      allCookies: document.cookie
    });

    // Encrypt user data dan simpan ke localStorage dengan key X-LANYA-USER
    const encryptedUser = encrypt(user);
    localStorage.setItem('X-LANYA-USER', encryptedUser);

    console.log(
      '[AuthService] Login successful - tokens saved to cookies, user data to localStorage'
    );

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

    // Simpan tokens ke cookie (untuk middleware)
    Cookies.set('X-LANYA-AT', accessToken, {expires: 1 / 24, path: '/'});
    Cookies.set('X-LANYA-RT', refreshToken, {expires: 7, path: '/'});

    // Encrypt user data dan simpan ke localStorage dengan key X-LANYA-USER
    const encryptedUser = encrypt(user);
    localStorage.setItem('X-LANYA-USER', encryptedUser);

    console.log('[AuthService] Registration successful - tokens saved');

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
