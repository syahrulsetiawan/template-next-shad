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

  console.log('🔥 [MIDDLEWARE RUNNING]', pathname);

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
    console.log('[Middleware] No refresh token found, redirecting to login');
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('callbackUrl', pathname);
    const response = NextResponse.redirect(url);
    response.headers.set('X-Debug-Reason', 'no-refresh-token');
    return response;
  }

  // Jika sudah authenticated & akses halaman protected, validate token
  try {
    const accessToken = request.cookies.get('X-LANYA-AT')?.value;
    const encryptedUserCookie = request.cookies.get('X-LANYA-USER')?.value;

    console.log('[Middleware] Cookies check:', {
      hasAccessToken: !!accessToken,
      hasUserCookie: !!encryptedUserCookie,
      hasRefreshToken: !!refreshToken
    });

    let currentAccessToken = accessToken;

    // Detect page refresh (bukan navigation biasa)
    // Page refresh akan punya Sec-Fetch-Mode: navigate dan Sec-Fetch-Site: none/same-origin
    const isPageRefresh =
      request.headers.get('sec-fetch-mode') === 'navigate' &&
      (request.headers.get('sec-fetch-site') === 'none' ||
        request.headers.get('sec-fetch-site') === 'same-origin');

    // 1. Jika token fresh & valid, langsung pass
    // Session revocation akan di-handle oleh axios interceptor (401 global logout)
    if (accessToken && encryptedUserCookie && !isTokenExpired(accessToken)) {
      console.log('[Middleware] Fresh token detected, allowing access');

      // Handle root path redirect
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
        }
      }

      return NextResponse.next();
    }

    // 2. Token expired atau tidak ada → refresh token
    console.log(
      '[Middleware] Token expired or missing, attempting refresh...',
      {
        hasAccessToken: !!accessToken,
        hasUserCookie: !!encryptedUserCookie,
        isExpired: accessToken ? isTokenExpired(accessToken) : 'no-token'
      }
    );

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

    // 3. Setelah refresh, WAJIB validasi dengan /me
    console.log('[Middleware] Token refreshed, validating with /me');
    const meResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${newAccessToken}`
        }
      }
    );

    if (!meResponse.ok) {
      console.error('[Middleware] /me validation failed after refresh');
      throw new Error('Session invalid - login required');
    }

    const meData = await meResponse.json();
    const userData = meData.data;

    // 4. Update semua cookies
    const response = NextResponse.next();

    response.cookies.set('X-LANYA-AT', newAccessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 // 1 jam
    });

    response.cookies.set('X-LANYA-RT', newRefreshToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 hari
    });

    const encryptedUserData = encryptData(userData);
    response.cookies.set('X-LANYA-USER', encryptedUserData, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 hari
    });

    // Handle root path redirect
    if (pathname === '/') {
      const lastService = userData.lastServiceKey || 'admin-portal';
      const url = request.nextUrl.clone();
      url.pathname = `/${lastService}`;
      const redirectResponse = NextResponse.redirect(url);
      redirectResponse.headers.set(
        'X-Debug-Flow',
        'token-refreshed-root-redirect'
      );
      return redirectResponse;
    }

    response.headers.set('X-Debug-Flow', 'token-refreshed-success');
    return response;
  } catch (error) {
    console.error('[Middleware] Auth error:', error);
    console.error('[Middleware] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      pathname,
      hasRefreshToken: !!refreshToken
    });

    // Jika gagal, hapus cookies dan redirect ke login
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('callbackUrl', pathname);

    const response = NextResponse.redirect(url);
    response.cookies.delete('X-LANYA-AT');
    response.cookies.delete('X-LANYA-RT');
    response.cookies.delete('X-LANYA-USER');
    response.headers.set('X-Debug-Reason', 'auth-error');
    response.headers.set(
      'X-Debug-Error',
      error instanceof Error ? error.message : 'unknown'
    );

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
