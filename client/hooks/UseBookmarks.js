import { useState, useEffect, useCallback } from 'react';
import { getBookmarks, addBookmark, removeBookmark } from '../api/bookmarks';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadBookmarks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBookmarks();
      setBookmarks(data);
      setBookmarkedIds(new Set(data.map((b) => b.nct_id)));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load all bookmarks on mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadBookmarks();
  }, [loadBookmarks]);

  const bookmark = useCallback(async (nct_id, title) => {
    if (bookmarkedIds.has(nct_id)) return;
    try {
      const newBookmark = await addBookmark(nct_id, title);
      if (newBookmark) {
        setBookmarks((prev) => [newBookmark, ...prev]);
        setBookmarkedIds((prev) => new Set([...prev, nct_id]));
      }
    } catch (err) {
      setError(err.message);
    }
  }, [bookmarkedIds]);

  const unbookmark = useCallback(async (nct_id) => {
    try {
      await removeBookmark(nct_id);
      setBookmarks((prev) => prev.filter((b) => b.nct_id !== nct_id));
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        next.delete(nct_id);
        return next;
      });
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const isBookmarked = useCallback(
    (nct_id) => bookmarkedIds.has(nct_id),
    [bookmarkedIds]
  );

  return {
    bookmarks,
    loading,
    error,
    bookmark,
    unbookmark,
    isBookmarked,
  };
}