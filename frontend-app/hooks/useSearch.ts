'use client';

import { SearchResponse } from '@/lib/types';
import { searchArticles } from '@/lib/api';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface SearchContextProps {
  results: SearchResponse['results'];
  loading: boolean;
  error: string | null;
  search: (query: string) => Promise<void>;
}

export default function useSearch(): SearchContextProps {
  const [results, setResults] = useState<SearchResponse['results']>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await searchArticles(query);
      setResults(response.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search articles');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    results,
    loading,
    error,
    search,
  };
}