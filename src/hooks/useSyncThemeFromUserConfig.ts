'use client';

import {useEffect} from 'react';
import {useTheme} from 'next-themes';
import {useUser} from '@/contexts/UserContext';

/**
 * Hook untuk sync theme dari user_config ke next-themes
 *
 * User config dark_mode values:
 * - 'light' → force light theme
 * - 'dark' → force dark theme
 * - 'by_system' → follow system preference
 *
 * Next-themes values:
 * - 'light'
 * - 'dark'
 * - 'system'
 */
export function useSyncThemeFromUserConfig() {
  const {userConfig} = useUser();
  const {setTheme} = useTheme();

  useEffect(() => {
    if (!userConfig) return;

    const darkMode = userConfig.dark_mode;

    // Map user_config dark_mode to next-themes theme
    const themeMap: Record<string, string> = {
      light: 'light',
      dark: 'dark',
      by_system: 'system'
    };

    const nextTheme = themeMap[darkMode] || 'system';

    console.log('[useSyncTheme] Applying theme from user_config:', {
      userConfigDarkMode: darkMode,
      nextTheme
    });

    setTheme(nextTheme);
  }, [userConfig, setTheme]);
}
