'use client';

import {useEffect, useState} from 'react';
import {useRouter, usePathname} from 'next/navigation';
import authService from '@/services/authService';
import {useUserLogin} from '@/hooks/useUserLogin';

interface AuthGuardProps {
  children: React.ReactNode;
}

// URL yang tidak perlu autentikasi
const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email'
];

export default function AuthGuard({children}: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const {setAllData, dataUser} = useUserLogin();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Skip auth check untuk public paths
      if (PUBLIC_PATHS.some((path) => pathname?.startsWith(path))) {
        setIsChecking(false);
        setIsAuthenticated(true);
        return;
      }

      try {
        // 1. Ambil refresh token dari localStorage
        const refreshToken = localStorage.getItem('X-LANYA-RT');

        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        // 2. Hit refresh endpoint untuk mendapatkan access token baru
        const newAccessToken = await authService.refreshToken();

        // 3. Test access token dengan hit /me
        const userData = await authService.myProfile();

        // 4. Token valid, simpan data user
        setAllData(userData);
        setIsAuthenticated(true);

        // 5. Jika user di root path atau path tidak sesuai, redirect ke lastServiceKey
        if (pathname === '/' || pathname === '') {
          const lastService = userData.lastServiceKey || 'admin-portal';
          router.replace(`/${lastService}`);
        }
      } catch (error) {
        console.error('Auth check failed:', error);

        // Token tidak valid, hapus semua data dan redirect ke login
        localStorage.removeItem('X-LANYA-AT');
        localStorage.removeItem('X-LANYA-RT');
        localStorage.removeItem('user');

        // Redirect ke login dengan callback URL
        const callbackUrl = encodeURIComponent(pathname || '/');
        router.replace(`/login?callbackUrl=${callbackUrl}`);
        setIsAuthenticated(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [pathname, router, setAllData]);

  // Tampilkan loading saat checking auth
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Tampilkan children jika authenticated
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Jangan render apa-apa jika tidak authenticated (akan redirect)
  return null;
}
