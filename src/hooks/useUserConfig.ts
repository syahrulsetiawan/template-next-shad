'use client';

import {useUser} from '@/contexts/UserContext';
import {UserConfig} from '@/types/UserTypes';
import api from '@/lib/api/axiosInstance';
import {useState} from 'react';

/**
 * Hook untuk manage user configuration
 *
 * Features:
 * - Get current user config
 * - Update user config (local + backend)
 * - Type-safe config access
 */
export function useUserConfig() {
  const {userConfig, updateUserConfig} = useUser();
  const [isUpdating, setIsUpdating] = useState(false);

  /**
   * Update user config
   * Updates local state immediately (optimistic) and syncs to backend
   */
  const updateConfig = async (updates: Partial<UserConfig>) => {
    if (isUpdating) return;

    setIsUpdating(true);

    try {
      // Optimistic update
      updateUserConfig(updates);

      console.log('[useUserConfig] Updating config:', updates);

      // Sync to backend (adjust endpoint sesuai backend API)
      await api.patch('/auth/users/config', updates);

      console.log('[useUserConfig] Config updated successfully');
    } catch (error) {
      console.error('[useUserConfig] Failed to update config:', error);

      // TODO: Revert optimistic update on error
      // For now, just log the error
      // You might want to fetch fresh data from /me
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Toggle dark mode
   */
  const toggleDarkMode = () => {
    if (!userConfig) return;

    const currentMode = userConfig.dark_mode;
    let newMode: UserConfig['dark_mode'];

    // Cycle: by_system → light → dark → by_system
    switch (currentMode) {
      case 'by_system':
        newMode = 'light';
        break;
      case 'light':
        newMode = 'dark';
        break;
      case 'dark':
        newMode = 'by_system';
        break;
      default:
        newMode = 'by_system';
    }

    updateConfig({dark_mode: newMode});
  };

  /**
   * Set language
   */
  const setLanguage = (language: string) => {
    updateConfig({language});
  };

  /**
   * Toggle RTL
   */
  const toggleRTL = () => {
    if (!userConfig) return;
    updateConfig({rtl: !userConfig.rtl});
  };

  /**
   * Set menu layout
   */
  const setMenuLayout = (layout: UserConfig['menu_layout']) => {
    updateConfig({menu_layout: layout});
  };

  /**
   * Set content width
   */
  const setContentWidth = (width: UserConfig['content_width']) => {
    updateConfig({content_width: width});
  };

  /**
   * Toggle email notifications
   */
  const toggleEmailNotifications = () => {
    if (!userConfig) return;
    updateConfig({email_notifications: !userConfig.email_notifications});
  };

  return {
    // Current config
    config: userConfig,

    // Update methods
    updateConfig,
    toggleDarkMode,
    setLanguage,
    toggleRTL,
    setMenuLayout,
    setContentWidth,
    toggleEmailNotifications,

    // Loading state
    isUpdating
  };
}
