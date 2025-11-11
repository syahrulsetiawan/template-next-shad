import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

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

  // Skip middleware untuk public paths
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Ambil refresh token dari localStorage tidak bisa di middleware
  // Karena middleware berjalan di server, tidak bisa akses localStorage
  // Solusi: cek cookie X-LANYA-RT yang di-set dari client

  const refreshToken = request.cookies.get('X-LANYA-RT')?.value;

  // Jika tidak ada refresh token, redirect ke login
  if (!refreshToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  try {
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
    const {accessToken, refreshToken: newRefreshToken} = refreshData.data;

    // 2. Test access token baru dengan hit /me
    const meResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
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
    response.cookies.set('X-LANYA-AT', accessToken, {
      httpOnly: false, // Set false agar bisa diakses dari client-side untuk sync dengan localStorage
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
