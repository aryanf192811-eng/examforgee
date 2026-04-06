import { useEffect, useCallback, useRef } from 'react';
import { useNotesStore } from '../lib/store/notesStore';
import { debounce } from '../lib/utils';

export function useUserNotes() {
  const { userNotes, setUserNotes } = useNotesStore();
  const MAX_CHARS = 10000;
  const WARN_CHARS = 9000;

  // 1s debounce autosave
  const saveToStorage = useRef(
    debounce((notes: string) => {
      const chapterId = useNotesStore.getState().activeChapterId;
      if (chapterId) {
        localStorage.setItem(`ef_notes_${chapterId}`, notes);
      }
    }, 1000)
  ).current;

  // Load on chapter change
  useEffect(() => {
    const chapterId = useNotesStore.getState().activeChapterId;
    if (chapterId) {
      const saved = localStorage.getItem(`ef_notes_${chapterId}`) ?? '';
      setUserNotes(saved);
    }
  }, [setUserNotes]);

  const handleChange = useCallback(
    (text: string) => {
      if (text.length > MAX_CHARS) return;
      setUserNotes(text);
      saveToStorage(text);
    },
    [setUserNotes, saveToStorage]
  );

  return {
    userNotes,
    setUserNotes: handleChange,
    charCount: userNotes.length,
    isWarning: userNotes.length >= WARN_CHARS,
    isAtLimit: userNotes.length >= MAX_CHARS,
    maxChars: MAX_CHARS,
  };
}
