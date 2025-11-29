import { useState, useCallback } from 'react';
import type { SearchResult } from '@/types/map';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

export function useGeocoding() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        q: query,
        format: 'json',
        limit: '5',
        addressdetails: '1',
      });

      const response = await fetch(`${NOMINATIM_URL}?${params}`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Geocoding request failed');
      }

      const data: SearchResult[] = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    search,
    results,
    isLoading,
    error,
    clearResults,
  };
}
