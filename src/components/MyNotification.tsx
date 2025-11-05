// components/NotificationDropdown.tsx

'use client';

import { Bell, CheckCircle, Clock, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

// --- Tipe Data Notifikasi ---
export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  timestamp: string; // Bisa juga menggunakan objek Date atau number
  isRead: boolean;
}

// --- Data Dummy (Ganti dengan data asli Anda) ---
const DUMMY_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    message: 'Pembelian Anda telah berhasil diproses.',
    type: 'success',
    timestamp: '2 jam lalu',
    isRead: false,
  },
  {
    id: 'n2',
    message: 'Stok produk "Baut M8" tersisa 5 unit.',
    type: 'warning',
    timestamp: '5 jam lalu',
    isRead: false,
  },
  {
    id: 'n3',
    message: 'Pengajuan cuti disetujui oleh HRD.',
    type: 'info',
    timestamp: '1 hari lalu',
    isRead: true,
  },
  {
    id: 'n4',
    message: 'Terjadi kegagalan pada sinkronisasi data.',
    type: 'error',
    timestamp: '3 hari lalu',
    isRead: false,
  },
  {
    id: 'n5',
    message: 'Ada pembaruan sistem yang tersedia.',
    type: 'info',
    timestamp: '1 minggu lalu',
    isRead: true,
  },
];

/**
 * Helper untuk mendapatkan ikon berdasarkan tipe notifikasi
 */
const getTypeIcon = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return { icon: CheckCircle, color: 'text-green-500' };
    case 'warning':
      return { icon: Clock, color: 'text-yellow-500' };
    case 'error':
      return { icon: XCircle, color: 'text-red-500' };
    case 'info':
    default:
      return { icon: Bell, color: 'text-blue-500' };
  }
};

export function NotificationDropdown() {
  // Hitung notifikasi yang belum dibaca
  const unreadCount = DUMMY_NOTIFICATIONS.filter((n) => !n.isRead).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* Tombol Notifikasi (Ikon Lonceng) */}
        <Button
          variant="ghost"
          size="icon"
          className="relative"
        >
          <Bell className="h-5 w-5" />
          {/* Badge Notifikasi Belum Dibaca */}
          {unreadCount > 0 && (
            <span className="absolute right-0 top-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        {/* Header Dropdown */}
        <DropdownMenuLabel className="font-semibold flex justify-between items-center">
          <span>Notifikasi</span>
          {unreadCount > 0 && (
            <span className="text-sm font-normal text-muted-foreground">
              {unreadCount} Belum dibaca
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Daftar Notifikasi menggunakan ScrollArea agar tidak terlalu panjang */}
        <ScrollArea className="h-72">
          <DropdownMenuGroup>
            {DUMMY_NOTIFICATIONS.length === 0 ? (
              <DropdownMenuItem className="opacity-70 text-center" disabled>
                Tidak ada notifikasi baru.
              </DropdownMenuItem>
            ) : (
              DUMMY_NOTIFICATIONS.map((notification) => {
                const { icon: Icon, color } = getTypeIcon(notification.type);
                return (
                  <DropdownMenuItem
                    key={notification.id}
                    // Menggunakan hover state yang berbeda untuk notifikasi yang belum dibaca
                    className={cn(
                      'flex flex-col items-start gap-1 py-3 h-auto cursor-pointer',
                      !notification.isRead && 'bg-accent/40 hover:bg-accent',
                    )}
                    onClick={() => console.log('Klik Notifikasi:', notification.id)}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <Icon className={cn('h-4 w-4 shrink-0', color)} />
                      {/* Pesan Notifikasi */}
                      <p
                        className={cn(
                          'text-sm font-medium leading-none',
                          notification.isRead && 'text-muted-foreground',
                        )}
                      >
                        {notification.message}
                      </p>
                    </div>
                    {/* Timestamp */}
                    <span className="ml-6 text-xs text-muted-foreground">
                      {notification.timestamp}
                    </span>
                  </DropdownMenuItem>
                );
              })
            )}
          </DropdownMenuGroup>
        </ScrollArea>
        <DropdownMenuSeparator />

        {/* Footer Dropdown */}
        <DropdownMenuItem className="py-2 text-center text-primary justify-center cursor-pointer">
          Lihat Semua Notifikasi
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}