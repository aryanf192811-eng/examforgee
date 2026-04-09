import { useState, useEffect, useCallback } from 'react';

interface Bookmark {
  chapterId: string;
  chapterTitle: string;
  subjectName: string;
  createdAt: string;
}

const STORAGE_KEY = 'ef_bookmarks';

function loadBookmarks(): Bookmark[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Bookmark[];
  } catch {
    return [];
  }
}

function saveBookmarks(bookmarks: Bookmark[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
}

/**
 * Hook for managing chapter-level bookmarks (stored in localStorage).
 * This provides immediate responsiveness while the user navigates notes.
 */
export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(loadBookmarks);

  useEffect(() => {
    saveBookmarks(bookmarks);
  }, [bookmarks]);

  const addBookmark = useCallback(
    (chapterId: string, chapterTitle: string, subjectName: string) => {
      setBookmarks((prev) => {
        if (prev.some((b) => b.chapterId === chapterId)) return prev;
        return [
          ...prev,
          { chapterId, chapterTitle, subjectName, createdAt: new Date().toISOString() },
        ];
      });
    },
    []
  );

  const removeBookmark = useCallback((chapterId: string) => {
    setBookmarks((prev) => prev.filter((b) => b.chapterId !== chapterId));
  }, []);

  const isBookmarked = useCallback(
    (chapterId: string) => bookmarks.some((b) => b.chapterId === chapterId),
    [bookmarks]
  );

  return { bookmarks, addBookmark, removeBookmark, isBookmarked };
}
