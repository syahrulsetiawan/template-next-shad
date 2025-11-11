// useUserLogin.ts

'use client';

import React from 'react';
import {UserData, UserTenant, UserConfig} from '../types/UserTypes';

// Mendefinisikan tipe untuk return value dari hook ini
interface UseUserLoginReturn {
  dataUser: UserData | null;
  tenants: UserTenant[];
  userConfigs: UserConfig[];
  setAllData: (data: UserData) => void;
  clearAllData: () => void;
}

export const useUserLogin = (): UseUserLoginReturn => {
  const [dataUser, setDataUser] = React.useState<UserData | null>(null);
  const [tenants, setTenants] = React.useState<UserTenant[]>([]);
  const [userConfigs, setUserConfigs] = React.useState<UserConfig[]>([]);

  /**
   * Mengatur semua data pengguna (data utama, konfigurasi, dan tenant)
   * dari respons API.
   * @param data Objek UserData yang diterima dari /api/me
   */
  const setAllData = (data: UserData) => {
    setDataUser(data);
    setUserConfigs(data.userConfigs || []);
    setTenants(data.tenants || []);
  };

  /**
   * Membersihkan semua data login (untuk logout).
   */
  const clearAllData = () => {
    setDataUser(null);
    setUserConfigs([]);
    setTenants([]);
  };

  return {
    dataUser,
    tenants,
    userConfigs,
    setAllData,
    clearAllData
  };
};
