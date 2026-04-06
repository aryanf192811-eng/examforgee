import { create } from 'zustand';
import type { QuestionResponse } from '../../types';

interface QuizStore {
  sessionId: string | null;
  questions: QuestionResponse[];
  answers: Record<string, string | string[] | number>;
  flags: string[];
  currentIndex: number;
  timeLeft: number;
  isActive: boolean;
  setSession: (sessionId: string, questions: QuestionResponse[], timeLeft: number) => void;
  setAnswer: (questionId: string, answer: string | string[] | number) => void;
  toggleFlag: (questionId: string) => void;
  setIndex: (index: number) => void;
  setTimeLeft: (time: number) => void;
  clearSession: () => void;
}

export const useQuizStore = create<QuizStore>((set) => ({
  sessionId: null,
  questions: [],
  answers: {},
  flags: [],
  currentIndex: 0,
  timeLeft: 0,
  isActive: false,
  setSession: (sessionId, questions, timeLeft) =>
    set({ sessionId, questions, timeLeft, currentIndex: 0, answers: {}, flags: [], isActive: true }),
  setAnswer: (questionId, answer) =>
    set((s) => ({ answers: { ...s.answers, [questionId]: answer } })),
  toggleFlag: (questionId) =>
    set((s) => ({
      flags: s.flags.includes(questionId)
        ? s.flags.filter((f) => f !== questionId)
        : [...s.flags, questionId],
    })),
  setIndex: (currentIndex) => set({ currentIndex }),
  setTimeLeft: (timeLeft) => set({ timeLeft }),
  clearSession: () =>
    set({ sessionId: null, questions: [], answers: {}, flags: [], currentIndex: 0, timeLeft: 0, isActive: false }),
}));
