import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import CryptoJS from 'crypto-js';

// Helper untuk cek apakah JWT token expired
function isTokenExpired(token: string): boolean {
  try {
    // Decode JWT tanpa verify (kita cuma cek exp claim)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const payload = JSON.parse(jsonPayload);

    if (!payload.exp) {
      return true; // Jika tidak ada exp claim, anggap expired
    }

    // exp dalam seconds, Date.now() dalam milliseconds
    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();

    // Tambah buffer 5 menit (300000 ms) untuk safety margin
    return currentTime >= expirationTime - 300000;
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return true; // Jika error parsing, anggap expired
  }
}

// Helper untuk encrypt/decrypt di middleware
function encryptData(data: any): string {
  const key =
    process.env.NEXT_PUBLIC_ENCRYPTION_KEY ||
    'default-encryption-key-please-change-this';
  const jsonString = JSON.stringify(data);
  return CryptoJS.AES.encrypt(jsonString, key).toString();
}

function decryptData<T = any>(encryptedData: string): T | null {
  try {
    const key =
      process.env.NEXT_PUBLIC_ENCRYPTION_KEY ||
      'default-encryption-key-please-change-this';
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key);
    const jsonString = decrypted.toString(CryptoJS.enc.Utf8);

    if (!jsonString) {
      return null;
    }

    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('Middleware decryption error:', error);
    return null;
  }
}

// URL yang tidak perlu autentikasi
const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email'
];

// Fungsi helper untuk cek apakah path adalah public
function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname.startsWith(path));
}

// Fungsi helper untuk cek apakah path adalah static file
function isStaticFile(pathname: string): boolean {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|css|js)$/) !== null
  );
}

export async function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;

  // Skip middleware untuk static files
  if (isStaticFile(pathname)) {
    return NextResponse.next();
  }

  // Ambil refresh token untuk cek apakah authenticated
  const refreshToken = request.cookies.get('X-LANYA-RT')?.value;
  const isAuthenticated = !!refreshToken;

  // Jika sudah authenticated & mencoba akses PUBLIC_PATHS, redirect ke dashboard
  if (isAuthenticated && isPublicPath(pathname)) {
    // Coba ambil callbackUrl dari query param
    const callbackUrl = request.nextUrl.searchParams.get('callbackUrl');

    // Jika ada callbackUrl, redirect kesana, kalau tidak ke dashboard default
    if (callbackUrl && !isPublicPath(callbackUrl)) {
      return NextResponse.redirect(new URL(callbackUrl, request.url));
    }

    // Default redirect ke dashboard
    const url = request.nextUrl.clone();
    url.pathname = '/app';
    return NextResponse.redirect(url);
  }

  // Jika belum authenticated & mencoba akses PUBLIC_PATHS, biarkan akses
  if (!isAuthenticated && isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Jika belum authenticated & mencoba akses halaman protected, redirect ke login
  if (!isAuthenticated && !isPublicPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // Jika sudah authenticated & akses halaman protected, validate token
  try {
    const accessToken = request.cookies.get('X-LANYA-AT')?.value;
    const encryptedUserCookie = request.cookies.get('X-LANYA-USER')?.value;

    let currentAccessToken = accessToken;
    let shouldRefresh = false;
    let shouldValidate = true;

    // 1. Jika baru login (ada AT fresh & USER cookie), skip validation
    if (accessToken && encryptedUserCookie && !isTokenExpired(accessToken)) {
      console.log('[Middleware] Fresh token detected, skipping /me validation');
      shouldValidate = false;

      // Jika user mengakses root path, redirect ke lastServiceKey
      if (pathname === '/') {
        try {
          const userData = decryptData(encryptedUserCookie);
          if (userData) {
            const lastService = userData.lastServiceKey || 'admin-portal';
            const url = request.nextUrl.clone();
            url.pathname = `/${lastService}`;
            return NextResponse.redirect(url);
          }
        } catch (e) {
          console.error('[Middleware] Failed to decrypt user data:', e);
          shouldValidate = true; // Jika gagal decrypt, validasi ulang
        }
      }

      if (!shouldValidate) {
        return NextResponse.next();
      }
    }

    // 2. Cek apakah AT expired atau tidak ada
    if (!accessToken || isTokenExpired(accessToken)) {
      console.log(
        '[Middleware] Access token expired or not found, refreshing...'
      );
      shouldRefresh = true;
    }

    // 3. Jika perlu refresh, hit /auth/refresh
    if (shouldRefresh) {
      const refreshResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({refreshToken})
        }
      );

      if (!refreshResponse.ok) {
        throw new Error('Refresh token failed or expired');
      }

      const refreshData = await refreshResponse.json();
      const {accessToken: newAccessToken, refreshToken: newRefreshToken} =
        refreshData.data;

      currentAccessToken = newAccessToken;

      // Update RT cookie juga
      const response = NextResponse.next();
      response.cookies.set('X-LANYA-RT', newRefreshToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 hari
      });

      // Setelah refresh, perlu validasi dengan /me
      shouldValidate = true;
    }

    // 4. Validasi AT dengan hit /auth/me (hanya jika perlu)
    let userData = null;

    if (shouldValidate) {
      const meResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentAccessToken}`
          }
        }
      );

      // Jika /me gagal, berarti token invalid -> harus login ulang
      if (!meResponse.ok) {
        console.error('[Middleware] /me validation failed, token invalid');
        throw new Error('Token validation failed - login required');
      }

      const meData = await meResponse.json();
      userData = meData.data;
    }

    // 5. Token valid, update cookies jika ada userData dari validasi
    const response = NextResponse.next();

    // Set AT (baru atau lama yang masih valid)
    if (currentAccessToken) {
      response.cookies.set('X-LANYA-AT', currentAccessToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 // 1 jam
      });
    }

    // Jika ada userData baru dari /me, update cookie USER
    if (userData) {
      const encryptedUserData = encryptData(userData);
      response.cookies.set('X-LANYA-USER', encryptedUserData, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 hari
      });

      // 6. Handle root path redirect
      if (pathname === '/') {
        const lastService = userData.lastServiceKey || 'admin-portal';
        const url = request.nextUrl.clone();
        url.pathname = `/${lastService}`;
        return NextResponse.redirect(url);
      }
    }

    return response;
  } catch (error) {
    console.error('[Middleware] Auth error:', error);

    // Jika gagal, hapus cookies dan redirect ke login
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('callbackUrl', pathname);

    const response = NextResponse.redirect(url);
    response.cookies.delete('X-LANYA-AT');
    response.cookies.delete('X-LANYA-RT');
    response.cookies.delete('X-LANYA-USER');

    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, other static assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
};
