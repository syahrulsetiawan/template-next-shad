'use client';

import React, {createContext, useContext, useState, ReactNode} from 'react';
import {UserData, UserTenant, UserConfig} from '../types/UserTypes';

interface UserContextType {
  dataUser: UserData | null;
  tenants: UserTenant[];
  userConfigs: UserConfig[];
  setAllData: (data: UserData) => void;
  clearAllData: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({children}: {children: ReactNode}) {
  const [dataUser, setDataUser] = useState<UserData | null>(null);
  const [tenants, setTenants] = useState<UserTenant[]>([]);
  const [userConfigs, setUserConfigs] = useState<UserConfig[]>([]);

  const setAllData = (data: UserData) => {
    console.log('[UserContext] Setting user data:', data);
    setDataUser(data);
    setUserConfigs(data.userConfigs || []);
    setTenants(data.tenants || []);
  };

  const clearAllData = () => {
    console.log('[UserContext] Clearing user data');
    setDataUser(null);
    setUserConfigs([]);
    setTenants([]);
  };

  return (
    <UserContext.Provider
      value={{
        dataUser,
        tenants,
        userConfigs,
        setAllData,
        clearAllData
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
