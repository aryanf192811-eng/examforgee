import { create } from 'zustand';
import type { QuizQuestion, QuizSubmitResponse } from '../../types';

interface QuizState {
  sessionId: string | null;
  questions: QuizQuestion[];
  answers: Record<string, unknown>;
  currentIndex: number;
  timePerQuestion: Record<string, number>;
  isSubmitted: boolean;
  submissionResult: QuizSubmitResponse | null;

  setSession: (sessionId: string) => void;
  setQuestions: (questions: QuizQuestion[]) => void;
  recordAnswer: (questionId: string, answer: unknown) => void;
  recordTime: (questionId: string, seconds: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  goToQuestion: (index: number) => void;
  setSubmitted: (submitted: boolean) => void;
  setSubmissionResult: (result: QuizSubmitResponse) => void;
  reset: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  sessionId: null,
  questions: [],
  answers: {},
  currentIndex: 0,
  timePerQuestion: {},
  isSubmitted: false,
  submissionResult: null,

  setSession: (sessionId) => set({ sessionId }),

  setQuestions: (questions) => set({
    questions,
    currentIndex: 0,
    answers: {},
    isSubmitted: false,
    submissionResult: null,
  }),

  recordAnswer: (questionId, answer) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: answer },
    })),

  recordTime: (questionId, seconds) =>
    set((state) => ({
      timePerQuestion: { ...state.timePerQuestion, [questionId]: seconds },
    })),

  nextQuestion: () =>
    set((state) => ({
      currentIndex: Math.min(state.currentIndex + 1, state.questions.length - 1),
    })),

  prevQuestion: () =>
    set((state) => ({
      currentIndex: Math.max(state.currentIndex - 1, 0),
    })),

  goToQuestion: (index) => set({ currentIndex: index }),

  setSubmitted: (isSubmitted) => set({ isSubmitted }),

  setSubmissionResult: (submissionResult) => set({ submissionResult }),

  reset: () =>
    set({
      sessionId: null,
      questions: [],
      answers: {},
      currentIndex: 0,
      timePerQuestion: {},
      isSubmitted: false,
      submissionResult: null,
    }),
}));
