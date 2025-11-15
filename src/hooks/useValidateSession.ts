'use client';

import {useEffect, useRef} from 'react';
import {useUser} from '@/contexts/UserContext';
import api from '@/lib/api/axiosInstance';
import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';

/**
 * Hook untuk validasi session dan sync user data dari /me endpoint
 *
 * Dipanggil saat:
 * - Component mount (page load / refresh)
 * - Tab/window focus kembali
 *
 * Logic:
 * - Hit /me untuk ambil user data terbaru
 * - Update UserContext dengan data terbaru
 * - Kalau 401 → axios interceptor akan auto logout
 */
export function useValidateSession() {
  const {setAllData, dataUser} = useUser();
  const router = useRouter();
  const hasValidated = useRef(false);

  useEffect(() => {
    // Hanya validasi sekali saat mount (hard refresh / initial load)
    if (hasValidated.current) return;

    const validateSession = async () => {
      try {
        // Cek apakah ada refresh token di cookie (bukan localStorage)
        const refreshToken = Cookies.get('X-LANYA-RT');
        if (!refreshToken) {
          console.log(
            '[useValidateSession] No refresh token, skipping validation'
          );
          return;
        }

        console.log('[useValidateSession] Validating session with /me...');

        // Hit /me endpoint (withAuth: true by default)
        const response = await api.get('/auth/me');
        const userData = response.data.data;

        console.log('[useValidateSession] Session valid, updating user data');

        // Update UserContext dengan data terbaru
        setAllData(userData);

        hasValidated.current = true;
      } catch (error: any) {
        console.error('[useValidateSession] Validation failed:', error);

        // Jika 401, axios interceptor sudah handle logout
        // Jika error lain (network, etc), tidak perlu logout
        if (error.response?.status !== 401) {
          console.log('[useValidateSession] Non-401 error, keeping session');
        }
      }
    };

    validateSession();
  }, []); // Run only once on mount

  // Optional: Revalidate saat window/tab focus kembali
  useEffect(() => {
    const handleFocus = async () => {
      if (!hasValidated.current) return;

      try {
        // Cek refresh token dari cookie
        const refreshToken = Cookies.get('X-LANYA-RT');
        if (!refreshToken) return;

        console.log('[useValidateSession] Window focused, revalidating...');
        const response = await api.get('/auth/me');
        const userData = response.data.data;
        setAllData(userData);
      } catch (error: any) {
        console.error('[useValidateSession] Revalidation failed:', error);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [setAllData]);
}
