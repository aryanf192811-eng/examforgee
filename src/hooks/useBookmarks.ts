import { useEffect, useCallback } from 'react';
import { useNotesStore } from '../lib/store/notesStore';
import { fetchBookmarks, createBookmark, deleteBookmark } from '../lib/api';
import { useToastStore } from '../lib/utils';

export function useBookmarks() {
  const { bookmarks, setBookmarks, addBookmark, removeBookmark } = useNotesStore();
  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => {
    fetchBookmarks()
      .then(setBookmarks)
      .catch(() => addToast('error', 'Failed to load bookmarks'));
  }, [setBookmarks, addToast]);

  const handleCreate = useCallback(
    async (chapterId: string, sectionId: string, sectionTitle: string) => {
      try {
        const bm = await createBookmark({ chapter_id: chapterId, section_id: sectionId, section_title: sectionTitle });
        addBookmark(bm);
        addToast('success', 'Bookmark added');
      } catch {
        addToast('error', 'Failed to create bookmark');
      }
    },
    [addBookmark, addToast]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteBookmark(id);
        removeBookmark(id);
        addToast('success', 'Bookmark removed');
      } catch {
        addToast('error', 'Failed to delete bookmark');
      }
    },
    [removeBookmark, addToast]
  );

  return { bookmarks, createBookmark: handleCreate, deleteBookmark: handleDelete };
}
