import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import CryptoJS from 'crypto-js';

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
    // Cek apakah ada access token yang masih valid
    const accessToken = request.cookies.get('X-LANYA-AT')?.value;
    const encryptedUserCookie = request.cookies.get('X-LANYA-USER')?.value;

    // Jika sudah ada access token dan user data, skip refresh (baru login)
    if (accessToken && encryptedUserCookie) {
      const response = NextResponse.next();

      // Jika user mengakses root path, redirect ke lastServiceKey
      if (pathname === '/') {
        try {
          // Decrypt user data untuk ambil lastServiceKey
          const userData = decryptData(encryptedUserCookie);
          if (userData) {
            const lastService = userData.lastServiceKey || 'admin-portal';
            const url = request.nextUrl.clone();
            url.pathname = `/${lastService}`;
            return NextResponse.redirect(url);
          }
        } catch (e) {
          // Jika gagal decrypt, lanjutkan refresh
        }
      } else {
        // Halaman lain, langsung lanjutkan
        return response;
      }
    }

    // 1. Hit endpoint refresh untuk mendapatkan access token baru
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
      throw new Error('Refresh token failed');
    }

    const refreshData = await refreshResponse.json();
    const {accessToken: newAccessToken, refreshToken: newRefreshToken} =
      refreshData.data;

    // 2. Test access token baru dengan hit /me
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
      throw new Error('Token validation failed');
    }

    const meData = await meResponse.json();
    const userData = meData.data;

    // 3. Token valid, lanjutkan request
    const response = NextResponse.next();

    // Update cookies dengan token baru
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

    // Encrypt dan simpan user data ke cookie untuk sync di client-side
    const encryptedUserData = encryptData(userData);
    response.cookies.set('X-LANYA-USER', encryptedUserData, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 hari
    });

    // Jika user mengakses root path, redirect ke lastServiceKey
    if (pathname === '/') {
      const lastService = userData.lastServiceKey || 'admin-portal';
      const url = request.nextUrl.clone();
      url.pathname = `/${lastService}`;
      return NextResponse.redirect(url);
    }

    return response;
  } catch (error) {
    console.error('Middleware auth error:', error);

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
