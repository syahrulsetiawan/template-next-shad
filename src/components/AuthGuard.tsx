'use client';

import {useSyncUserFromCookie} from '@/hooks/useSyncUserFromCookie';
import {useValidateSession} from '@/hooks/useValidateSession';
import {useSyncThemeFromUserConfig} from '@/hooks/useSyncThemeFromUserConfig';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard - Simplified version
 *
 * Middleware (server-side) sudah handle semua authentication logic:
 * - Token validation
 * - Token refresh
 * - Redirect ke login jika unauthorized
 *
 * AuthGuard (client-side) sekarang:
 * 1. Sync user data dari cookies yang di-set middleware ke React state
 * 2. Validate session dengan /me endpoint (cek session revocation + sync data)
 * 3. Sync theme dari user_config ke next-themes
 * 4. Kalau 401 dari /me → axios interceptor auto logout
 */
export default function AuthGuard({children}: AuthGuardProps) {
  // Sync user data dari cookie yang di-set oleh middleware
  // Hook ini akan decrypt X-LANYA-USER cookie dan update UserContext
  useSyncUserFromCookie();

  // Validate session dan sync user data dari /me endpoint
  // Hook ini hit /me saat mount (hard refresh) dan saat window focus
  useValidateSession();

  // Sync theme dari user_config (dark_mode) ke next-themes
  useSyncThemeFromUserConfig();

  // Kalau komponen ini ke-render, berarti middleware sudah pass
  // (user pasti authenticated, token valid)
  return <>{children}</>;
}
