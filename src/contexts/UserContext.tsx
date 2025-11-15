'use client';

import React, {createContext, useContext, useState, ReactNode} from 'react';
import {UserData, UserTenant, UserConfig} from '../types/UserTypes';

interface UserContextType {
  dataUser: UserData | null;
  tenants: UserTenant[];
  userConfig: UserConfig | null;
  setAllData: (data: UserData) => void;
  clearAllData: () => void;
  updateUserConfig: (config: Partial<UserConfig>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({children}: {children: ReactNode}) {
  const [dataUser, setDataUser] = useState<UserData | null>(null);
  const [tenants, setTenants] = useState<UserTenant[]>([]);
  const [userConfig, setUserConfig] = useState<UserConfig | null>(null);

  const setAllData = (data: UserData) => {
    console.log('[UserContext] Setting user data:', data);
    setDataUser(data);
    setTenants(data.tenants || []);
    // Support both user_config (from /me) and userConfigs (legacy)
    setUserConfig(data.user_config || null);
  };

  const updateUserConfig = (config: Partial<UserConfig>) => {
    console.log('[UserContext] Updating user config:', config);
    setUserConfig((prev) => (prev ? {...prev, ...config} : null));
  };

  const clearAllData = () => {
    console.log('[UserContext] Clearing user data');
    setDataUser(null);
    setUserConfig(null);
    setTenants([]);
  };

  return (
    <UserContext.Provider
      value={{
        dataUser,
        tenants,
        userConfig,
        setAllData,
        clearAllData,
        updateUserConfig
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
