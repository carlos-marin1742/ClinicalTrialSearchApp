import { useState, useEffect, useCallback } from 'react';
import { fetchTrials } from '../api/trials';

const DEBOUNCE_MS = 400;
const PAGE_SIZE = 10;

export function useTrialSearch() {
  const [query, setQueryState] = useState('');
  const [allResults, setAllResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const setQuery = useCallback((value) => {
    setQueryState(value);
    if (!value.trim()) {
      setAllResults([]);
      setPage(1);
    }
  }, []);

  const search = useCallback(async (searchQuery) => {
    setLoading(true);
    setError(null);
    setPage(1);
    try {
      const data = await fetchTrials(searchQuery);
      setAllResults(data);
    } catch (err) {
      setError(err.message);
      setAllResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search — fires 400ms after the user stops typing
  useEffect(() => {
    if (!query.trim()) return;
    const timer = setTimeout(() => search(query), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query, search]);

  // Slice the full result set for the current page
  const totalPages = Math.ceil(allResults.length / PAGE_SIZE);
  const results = allResults.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const nextPage = useCallback(() => {
    setPage((p) => Math.min(p + 1, totalPages));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setPage((p) => Math.max(p - 1, 1));
  }, []);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    page,
    totalPages,
    nextPage,
    prevPage,
  };
}