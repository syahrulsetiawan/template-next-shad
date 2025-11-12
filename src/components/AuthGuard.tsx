'use client';

import {useEffect, useState} from 'react';
import {useRouter, usePathname} from 'next/navigation';
import {useUser} from '@/contexts/UserContext';
import {useSyncUserFromCookie} from '@/hooks/useSyncUserFromCookie';

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
  const {dataUser} = useUser();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Sync user data dari cookie yang di-set middleware
  useSyncUserFromCookie();

  useEffect(() => {
    const checkAuth = async () => {
      // Skip auth check untuk public paths
      if (PUBLIC_PATHS.some((path) => pathname?.startsWith(path))) {
        setIsChecking(false);
        setIsAuthenticated(true);
        return;
      }

      try {
        // 1. Cek apakah ada refresh token di localStorage atau cookie
        const refreshTokenLS = localStorage.getItem('X-LANYA-RT');
        const getCookie = (name: string): string | null => {
          if (typeof document === 'undefined') return null;
          const match = document.cookie.match(
            new RegExp(`(^| )${name}=([^;]+)`)
          );
          return match ? decodeURIComponent(match[2]) : null;
        };
        const refreshTokenCookie = getCookie('X-LANYA-RT');

        if (!refreshTokenLS && !refreshTokenCookie) {
          throw new Error('No refresh token');
        }

        // 2. Jika middleware sudah validasi (ada cookie user), langsung set authenticated
        const userCookie = getCookie('X-LANYA-USER');
        if (userCookie) {
          setIsAuthenticated(true);
          setIsChecking(false);
          return;
        }

        // 3. Jika tidak ada user cookie, redirect ke login (middleware akan handle)
        throw new Error('No user data');
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
  }, [pathname, router]);

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
