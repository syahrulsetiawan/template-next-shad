import {useState, useEffect} from 'react';
import api, {ExtendedAxiosRequestConfig} from '../lib/api/axiosInstance';
import {AxiosError, AxiosResponse} from 'axios';
import {useAxiosError, FormattedError} from './use-axiosError';

// Interfaces untuk mendefinisikan struktur data
export interface PaginationState {
  page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface SortState {
  field: string;
  order: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export interface UseDataTableResult<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
  search: string;
  sort: SortState;
  handlePageChange: (newPage: number) => void;
  handleSearchChange: (newSearch: string) => void;
  handleSortChange: (field: string) => void;
}

/**
 * Custom hook untuk mengelola fetching data untuk datatable.
 * @param url URL API endpoint.
 * @returns Object yang berisi data, status loading, error, dan fungsi untuk mengelola state.
 */
export function useDataTable<T>(url: string): UseDataTableResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [rawError, setRawError] = useState<AxiosError | null>(null); // State untuk error mentah
  const formattedError: FormattedError | null = useAxiosError(rawError); // Gunakan hook error di sini
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    per_page: 10,
    total: 0,
    last_page: 1
  });
  const [search, setSearch] = useState<string>('');
  const [sort, setSort] = useState<SortState>({
    field: 'created_at',
    order: 'desc'
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setRawError(null);

      // Axios secara otomatis mengubah objek params menjadi string query
      const params = {
        page: pagination.page,
        per_page: pagination.per_page,
        search: search,
        sort_by: sort.field,
        sort_order: sort.order
      };

      try {
        const config: ExtendedAxiosRequestConfig = {
          params,
          withAuth: true
        };
        const response: AxiosResponse<ApiResponse<T>> = await api.get(
          url,
          config
        );

        // Axios otomatis parse JSON, jadi langsung akses .data
        const result = response.data;

        setData(result.data);
        setPagination({
          page: result.meta.current_page,
          per_page: result.meta.per_page,
          total: result.meta.total,
          last_page: result.meta.last_page
        });
      } catch (e) {
        // Axios melemparkan error jika status bukan 2xx
        // setError(e instanceof Error ? e.message : String(e));
        setRawError(e as AxiosError);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    url,
    pagination.page,
    pagination.per_page,
    search,
    sort.field,
    sort.order
  ]);

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({...prev, page: newPage}));
  };

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setPagination((prev) => ({...prev, page: 1}));
  };

  const handleSortChange = (field: string) => {
    setSort((prev) => ({
      field,
      order: prev.order === 'asc' ? 'desc' : 'asc'
    }));
    setPagination((prev) => ({...prev, page: 1}));
  };

  return {
    data,
    loading,
    error: formattedError ? formattedError.message : null,
    pagination,
    search,
    sort,
    handlePageChange,
    handleSearchChange,
    handleSortChange
  };
}
