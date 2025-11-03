import {AxiosError} from 'axios';
import {toast} from 'sonner'; // OK, sonner biasanya bisa dipanggil di luar komponen
import {logout} from './authService';

export const handleAxiosError = (
  error: any,
  actionName: string
): {status: number | undefined; reason: string | undefined} | undefined => {
  console.error(error); // Lebih baik menggunakan console.error untuk error

  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const reason = error.response?.data?.reason;

    // --- LOGIKA DIPERBAIKI (Menggunakan &&) ---
    const isPublicAction =
      actionName === 'Login' ||
      actionName === 'Register' ||
      actionName === 'ForgotPassword' ||
      actionName === 'ResetPassword' ||
      actionName === 'Logout';

    if (!isPublicAction) {
      logout();
    }

    // Mengembalikan objek error
    return {status: status, reason: reason};
  }

  // Jika bukan AxiosError, kita tetap bisa menampilkan error generik
  toast.error('Terjadi kesalahan yang tidak terduga.');

  // Mengembalikan undefined jika bukan AxiosError
  return undefined;
};
