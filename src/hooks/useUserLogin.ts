// useUserLogin.ts

'use client';

import React from 'react';
import {UserData, Tenant, UserConfig} from '../types/UserTypes'; // Asumsikan file types.ts ada di direktori yang sama

// Mendefinisikan tipe untuk return value dari hook ini
interface UseUserLoginReturn {
  dataUser: UserData | null;
  tenants: Tenant[];
  userSettings: UserConfig[] | null;
  setAllData: (data: UserData) => void;
  clearAllData: () => void;
}

export const useUserLogin = (): UseUserLoginReturn => {
  // Gunakan tipe yang sudah didefinisikan
  const [dataUser, setDataUser] = React.useState<UserData | null>(null);
  const [tenants, setTenants] = React.useState<Tenant[]>([]);
  const [userSettings, setUserSettings] = React.useState<UserConfig[] | null>(
    null
  );

  /**
   * Mengatur semua data pengguna (data utama, konfigurasi, dan tenant)
   * dari respons API.
   * @param data Objek UserData yang diterima dari /api/me
   */
  const setAllData = (data: UserData) => {
    setDataUser(data);
    setUserSettings(data.configs);
    setTenants(data.tenants);
  };

  /**
   * Membersihkan semua data login (untuk logout).
   */
  const clearAllData = () => {
    setDataUser(null);
    setUserSettings(null);
    setTenants([]);
  };

  // Kita hanya perlu mengembalikan nilai state, karena sudah di-type dengan baik
  return {
    dataUser,
    tenants,
    userSettings,
    setAllData,
    clearAllData
  };
};

// Catatan: Saya menghapus fungsi getTenants, getUserSettings, dan getDataUser
// karena nilai state (tenants, userSettings, dataUser) sudah diekspos
// dan dapat diakses langsung oleh komponen yang menggunakan hook ini.
