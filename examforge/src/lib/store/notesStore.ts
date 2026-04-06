import { create } from 'zustand';
import type { BookmarkResponse } from '../../types';

interface NotesStore {
  activeChapterId: string | null;
  activeSubjectSlug: string | null;
  bookmarks: BookmarkResponse[];
  userNotes: string;
  isFocusMode: boolean;
  isLoading: boolean;
  setActiveChapter: (chapterId: string | null, subjectSlug?: string | null) => void;
  setBookmarks: (bookmarks: BookmarkResponse[]) => void;
  addBookmark: (bookmark: BookmarkResponse) => void;
  removeBookmark: (id: string) => void;
  setUserNotes: (notes: string) => void;
  toggleFocusMode: () => void;
  setLoading: (loading: boolean) => void;
}

export const useNotesStore = create<NotesStore>((set) => ({
  activeChapterId: null,
  activeSubjectSlug: null,
  bookmarks: [],
  userNotes: '',
  isFocusMode: false,
  isLoading: false,
  setActiveChapter: (chapterId, subjectSlug = null) =>
    set({ activeChapterId: chapterId, activeSubjectSlug: subjectSlug }),
  setBookmarks: (bookmarks) => set({ bookmarks }),
  addBookmark: (bookmark) => set((s) => ({ bookmarks: [...s.bookmarks, bookmark] })),
  removeBookmark: (id) => set((s) => ({ bookmarks: s.bookmarks.filter((b) => b.id !== id) })),
  setUserNotes: (userNotes) => set({ userNotes }),
  toggleFocusMode: () => set((s) => ({ isFocusMode: !s.isFocusMode })),
  setLoading: (isLoading) => set({ isLoading }),
}));
