// src/hooks/useLoading.ts
'use client';
import {useState, useCallback, useMemo} from 'react';

/**
 * Custom hook untuk mengelola status loading secara terpusat.
 * Berguna untuk melacak status async operation (misalnya fetch API).
 *
 * @returns [isLoading, startLoading, stopLoading, toggleLoading]
 */
export const useLoading = () => {
  // 1. State utama untuk melacak status loading
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 2. Fungsi untuk memulai loading (membuat isLoading = true)
  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  // 3. Fungsi untuk menghentikan loading (membuat isLoading = false)
  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  // 4. Fungsi untuk membalikkan status loading
  const toggleLoading = useCallback(() => {
    setIsLoading((prev) => !prev);
  }, []);

  // 5. Menggunakan useMemo agar nilai yang dikembalikan stabil
  const hookValue = useMemo(
    () => ({
      isLoading,
      startLoading,
      stopLoading,
      toggleLoading
    }),
    [isLoading, startLoading, stopLoading, toggleLoading]
  );

  return hookValue;
};

// Opsional: Eksport tipe data yang dikembalikan untuk penggunaan yang lebih ketat
export type UseLoadingHook = ReturnType<typeof useLoading>;
