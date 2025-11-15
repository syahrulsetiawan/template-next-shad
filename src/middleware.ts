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
  const accessToken = request.cookies.get('X-LANYA-AT')?.value;

  console.log('[Middleware] Cookies check:', {
    refreshToken: refreshToken ? 'EXISTS' : 'MISSING',
    accessToken: accessToken ? 'EXISTS' : 'MISSING',
    allCookies: Array.from(request.cookies.getAll()).map((c) => c.name)
  });

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

    console.log('[Middleware] Token validation:', {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      isExpired: accessToken ? isTokenExpired(accessToken) : 'no-token'
    });

    // 1. Jika token fresh & valid, langsung pass
    // User data ada di localStorage (client-side), middleware cuma validasi token
    if (accessToken && !isTokenExpired(accessToken)) {
      console.log('[Middleware] Valid token, allowing access');
      return NextResponse.next();
    }

    // 2. Token expired atau tidak ada → redirect ke login
    // Biar axios interceptor yang handle refresh token saat user hit API
    console.log('[Middleware] Token expired or missing, redirecting to login');

    throw new Error('Access token expired or missing');
  } catch (error) {
    console.error('[Middleware] Auth error:', error);
    console.error('[Middleware] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      pathname,
      hasRefreshToken: !!refreshToken
    });

    // Jika gagal, redirect ke login TANPA delete cookies
    // Biarkan client-side (axios interceptor) yang handle cleanup
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('callbackUrl', pathname);

    const response = NextResponse.redirect(url);
    // JANGAN delete cookies di sini - bisa race condition dengan client-side yang baru set
    // response.cookies.delete('X-LANYA-AT');
    // response.cookies.delete('X-LANYA-RT');
    // response.cookies.delete('X-LANYA-USER');
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
