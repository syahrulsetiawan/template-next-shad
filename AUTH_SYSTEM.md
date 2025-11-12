# Authentication System

## Komponen yang Dibuat

### 1. `middleware.ts` (Server-Side Protection)

Middleware Next.js yang berjalan di server untuk validasi token sebelum request sampai ke halaman.

**Cara Kerja:**

1. Skip public paths (login, register, dll) dan static files
2. Cek cookie `X-LANYA-RT` (refresh token)
3. Jika tidak ada → redirect ke `/login`
4. Jika ada → Hit `/auth/refresh` untuk dapat access token baru
5. Test access token baru dengan hit `/auth/me`
6. Jika valid → Update cookies dan lanjutkan request
7. Jika tidak valid → Hapus cookies dan redirect ke `/login`
8. Jika user akses root `/` → Auto redirect ke `lastServiceKey` atau `admin-portal`

**Public Paths (Tidak Kena Middleware):**

- `/login`
- `/register`
- `/forgot-password`
- `/reset-password`
- `/verify-email`
- Static files (images, css, js)

### 2. `AuthGuard.tsx` (Client-Side Protection)

Component wrapper untuk proteksi halaman di client-side.

**Cara Kerja:**

1. Cek localStorage untuk `X-LANYA-RT`
2. Jika tidak ada → Redirect ke `/login`
3. Jika ada → Hit `refreshToken()` untuk validasi
4. Test dengan hit `/auth/me`
5. Jika valid → Simpan user data dan render children
6. Jika tidak valid → Hapus semua data dan redirect ke `/login`
7. Tampilkan loading spinner saat checking

**Kapan Digunakan:**

- Wrap di layout protected pages
- Digunakan bersama middleware untuk double protection

### 3. `authService.ts` - Update

Ditambahkan fungsi untuk sync token ke cookies:

**Fungsi yang Diupdate:**

- `login()` - Simpan token ke localStorage & cookies
- `register()` - Simpan token ke localStorage & cookies
- `refreshToken()` - Update token di localStorage & cookies
- `logout()` - Hapus token dari localStorage & cookies

**Helper Functions:**

- `setCookie()` - Set cookie dengan expiry
- `deleteCookie()` - Hapus cookie

## Cara Penggunaan

### A. Setup Middleware (Sudah Otomatis)

File `middleware.ts` sudah di root project, akan otomatis jalan untuk semua routes.

### B. Gunakan AuthGuard di Protected Layout

```tsx
// app/(protected)/layout.tsx
import AuthGuard from '@/components/AuthGuard';

export default function ProtectedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
```

### C. Atau Wrap di Page Tertentu

```tsx
// app/dashboard/page.tsx
import AuthGuard from '@/components/AuthGuard';

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div>Dashboard Content</div>
    </AuthGuard>
  );
}
```

## Flow Diagram

```
User Akses /app
    ↓
Middleware Check Cookie X-LANYA-RT
    ↓
Ada? → Hit /auth/refresh → Test /auth/me → Valid? → Update Cookies → Lanjut
    ↓                                           ↓
Tidak Ada                                   Tidak Valid
    ↓                                           ↓
Redirect /login ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ←
```

## Token Storage Strategy

**Dual Storage (localStorage + Cookies):**

- **localStorage**: Untuk akses dari client-side JavaScript (axios interceptor)
- **Cookies**: Untuk akses dari middleware (server-side)

**Keys:**

- Access Token: `X-LANYA-AT` (expire: 1 jam)
- Refresh Token: `X-LANYA-RT` (expire: 7 hari)
- User Data: `user` (localStorage only)

## Security Notes

1. **Cookies** di-set dengan `httpOnly: false` agar bisa sync dengan localStorage
2. **SameSite: Lax** untuk proteksi CSRF
3. **Secure** flag aktif di production
4. Token auto refresh setiap kali middleware jalan
5. Jika refresh gagal, user otomatis logout

## Troubleshooting

**Q: User selalu redirect ke login meskipun sudah login?**
A: Cek apakah cookie `X-LANYA-RT` ter-set. Buka DevTools → Application → Cookies

**Q: Middleware tidak jalan?**
A: Cek `matcher` di `middleware.ts` config, pastikan path masuk dalam pattern

**Q: Token tidak sync antara localStorage dan cookies?**
A: Pastikan semua fungsi authService sudah update (login, register, refreshToken)

**Q: Infinite redirect loop?**
A: Cek apakah `/login` masuk dalam `PUBLIC_PATHS` di middleware
