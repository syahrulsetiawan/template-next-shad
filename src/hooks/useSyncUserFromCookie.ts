'use client';

import {useEffect, useState} from 'react';
import {useUser} from '@/contexts/UserContext';
import {decrypt, encrypt} from '@/helpers/encryption_helper';
import {UserData} from '@/types/UserTypes';

/**
 * Hook untuk sync user data dari cookie ke state
 * Cookie di-set oleh middleware setelah validasi token
 */
export function useSyncUserFromCookie() {
  const {setAllData, dataUser} = useUser();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Helper function untuk ambil cookie
    const getCookie = (name: string): string | null => {
      if (typeof document === 'undefined') return null;
      const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
      return match ? decodeURIComponent(match[2]) : null;
    };

    const syncUserData = () => {
      const encryptedUserCookie = getCookie('X-LANYA-USER');

      console.log('[useSyncUserFromCookie] Checking cookie...', {
        hasCookie: !!encryptedUserCookie,
        hasDataUser: !!dataUser,
        hasChecked
      });

      if (encryptedUserCookie) {
        try {
          // Decrypt user data dari cookie
          const userData = decrypt<UserData>(encryptedUserCookie);

          if (!userData) {
            console.error(
              '[useSyncUserFromCookie] Failed to decrypt user data'
            );
            return;
          }

          // Hanya set jika data berbeda atau belum ada
          if (
            !dataUser ||
            JSON.stringify(dataUser) !== JSON.stringify(userData)
          ) {
            console.log(
              '[useSyncUserFromCookie] Setting user data from cookie:',
              userData
            );
            setAllData(userData);

            // Sync ke localStorage juga (encrypted)
            localStorage.setItem('user', encrypt(userData));
          }

          setHasChecked(true);
        } catch (error) {
          console.error(
            '[useSyncUserFromCookie] Failed to decrypt user data from cookie:',
            error
          );
        }
      } else if (!hasChecked) {
        // Retry setelah delay kecil (cookie mungkin belum ter-set oleh middleware)
        console.log(
          '[useSyncUserFromCookie] Cookie not found, retrying in 100ms...'
        );
        setTimeout(syncUserData, 100);
      }
    };

    syncUserData();
  }, []); // Intentionally empty deps - hanya run sekali saat mount dengan retry mechanism
}
