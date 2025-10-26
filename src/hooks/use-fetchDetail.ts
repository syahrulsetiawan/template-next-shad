import {useState, useEffect} from 'react';
import api, {ExtendedAxiosRequestConfig} from '../lib/api/axiosInstance';
import {AxiosError, AxiosResponse} from 'axios';
import {useAxiosError, FormattedError} from './use-axiosError';

// Tipe data yang dikembalikan oleh hook
export interface UseFetchDetailResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook untuk mengambil data detail dari sebuah URL API.
 * @template T Tipe data yang diharapkan dari respons API.
 * @param url URL API endpoint.
 * @returns Objek yang berisi data, status loading, dan error.
 */
export function useFetchDetail<T>(url: string): UseFetchDetailResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [rawError, setRawError] = useState<AxiosError | null>(null);
  const formattedError: FormattedError | null = useAxiosError(rawError);

  useEffect(() => {
    // Jika URL tidak valid atau null, hentikan proses
    if (!url) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setRawError(null);
      try {
        const config: ExtendedAxiosRequestConfig = {
          withAuth: true
        };
        const response: AxiosResponse<T> = await api.get(url, config);

        const result: T = response.data;
        setData(result);
      } catch (e) {
        setRawError(e as AxiosError);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return {
    data,
    loading,
    error: formattedError ? formattedError.message : null
  };
}
