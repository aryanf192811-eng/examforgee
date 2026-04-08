import { create } from 'zustand';

interface NotesState {
  currentChapterId: string | null;
  setCurrentChapter: (chapterId: string | null) => void;
}

/**
 * Notes store — tracks currently selected chapter.
 * NEVER store signed URLs here. signedUrl lives in NotesViewer local state only.
 */
export const useNotesStore = create<NotesState>((set) => ({
  currentChapterId: null,
  setCurrentChapter: (currentChapterId) => set({ currentChapterId }),
}));
