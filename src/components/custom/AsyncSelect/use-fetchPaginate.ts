import api from '@/lib/api/axiosInstance';
import {useState, useEffect, useCallback} from 'react';

export const usePaginatedFetchSelect = <T>(
  url: string,
  initialParams: Record<string, any> = {},
  options: {enabled?: boolean; debounceDuration?: number} = {}
) => {
  const {enabled = true, debounceDuration} = options;

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');

  const fetchData = useCallback(
    async (reset = false) => {
      if (!enabled || !url) return;
      try {
        setLoading(true);
        const query = new URLSearchParams({
          ...initialParams,
          search
        }).toString();

        const res = await api(`/api/${url}?${query}`).then((res) => res.data);

        setData((prev) => (reset ? res.data : [...prev, ...(res.data || [])]));
        setHasMore(res.hasMore ?? res.data?.length > 0);
      } finally {
        setLoading(false);
      }
    },
    [url, page, search, enabled, initialParams]
  );

  // Debounce search
  useEffect(() => {
    if (!enabled) return;
    const timer = setTimeout(() => {
      setPage(1);
      fetchData(true);
    }, debounceDuration);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch initial data
  useEffect(() => {
    if (!enabled) return;
    fetchData(true);
  }, [url]);

  const fetchNextPage = () => {
    if (!hasMore || loading || !enabled) return;
    setPage((p) => p + 1);
  };

  useEffect(() => {
    if (page > 1 && enabled) fetchData();
  }, [page]);

  return {
    data,
    loading,
    hasMore,
    fetchNextPage,
    search,
    setSearch
  };
};
