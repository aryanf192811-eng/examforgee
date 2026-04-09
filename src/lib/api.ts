import { getIdToken } from "./firebase";
import { sanitizeNoteHtml } from "./dompurify-config";
import type {
  Subject,
  Chapter,
  Question,
  QuizSession,
  Flashcard,
  FlashcardReview,
  UserProgress,
  Bookmark,
  DoubtHistory,
  UserProfile,
  SessionResponse,
  ToastType
} from "../types";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

class ApiError extends Error {
  status: number;
  data: any;
  constructor(status: number, data: any) {
    let message = `API Error ${status}`;
    if (status === 422 && data?.detail) {
      const details = Array.isArray(data.detail)
        ? data.detail.map((d: any) => `${d.loc.join(" -> ")}: ${d.msg}`).join("; ")
        : JSON.stringify(data.detail);
      message = `Validation Error (422): ${details}`;
    } else if (data?.detail) {
      message = data.detail;
    } else if (data?.message) {
      message = data.message;
    }
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getIdToken();
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new ApiError(res.status, data);
  }
  return res.json();
}

async function publicFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!res.ok)
    throw new ApiError(res.status, await res.json().catch(() => ({})));
  return res.json();
}

// ── Auth ──

export const createSession = (idToken: string) =>
  publicFetch<SessionResponse>("/api/auth/session", {
    method: "POST",
    body: JSON.stringify({ id_token: idToken }),
  });

// ── Content (SQLite) ──

export const fetchSubjects = () =>
  apiFetch<Subject[]>("/api/content/subjects");

export const fetchChapters = (subjectSlug: string) =>
  apiFetch<Chapter[]>(`/api/content/subjects/${subjectSlug}/chapters`);

export const fetchChapterDetail = (chapterSlug: string) =>
  apiFetch<Chapter>(`/api/content/chapters/${chapterSlug}`);

// ── Notes (Static HTML) ──

export async function loadNoteHtml(notesFile: string): Promise<string> {
  // Static notes are served from /notes/ inside the public folder
  const res = await fetch(`/notes/${notesFile}`);
  if (!res.ok) throw new Error("Failed to load notes");
  const html = await res.text();
  return sanitizeNoteHtml(html);
}

// ── Quiz (Hybrid) ──

export const fetchQuestions = (subjectId: string, chapterId?: string, mode = "practice", limit = 10) =>
  apiFetch<Question[]>(`/api/quiz/questions?subject_id=${subjectId}&chapter_id=${chapterId || ""}&mode=${mode}&limit=${limit}`);

export const startQuizSession = (payload: { subject_id: string, chapter_id?: string, mode?: string, total_questions?: number }) =>
  apiFetch<QuizSession>("/api/quiz/sessions", {
    method: "POST",
    body: JSON.stringify(payload)
  });

export const submitQuizSession = (sessionId: string, payload: { score: number, correct_count: number, time_taken_s: number, answers: any[] }) =>
  apiFetch<{ status: string }>(`/api/quiz/sessions/${sessionId}/submit`, {
    method: "POST",
    body: JSON.stringify(payload)
  });

// ── User Progress (Supabase) ──

export const fetchUserProgress = (subjectId?: string) =>
  apiFetch<UserProgress[]>(`/api/progress/` + (subjectId ? `?subject_id=${subjectId}` : ""));

export const updateUserProgress = (payload: { chapter_slug: string, subject_id: string, progress_pct: number, time_spent_s: number, completed: boolean }) =>
  apiFetch<UserProgress>("/api/progress/update", {
    method: "POST",
    body: JSON.stringify(payload)
  });

// ── Bookmarks ──

export const fetchBookmarks = () =>
  apiFetch<Bookmark[]>("/api/bookmarks/");

export const toggleBookmark = (payload: { chapter_slug: string, subject_id: string }) =>
  apiFetch<{ bookmarked: boolean }>("/api/bookmarks/toggle", {
    method: "POST",
    body: JSON.stringify(payload)
  });

// ── Doubts (AI) ──

export const askDoubt = (payload: { chapter_slug: string, subject_id: string, question: string, selected_text?: string }) =>
  apiFetch<{ answer: string, history_item: DoubtHistory }>("/api/doubts/ask", {
    method: "POST",
    body: JSON.stringify(payload)
  });

export const fetchDoubtHistory = () =>
  apiFetch<DoubtHistory[]>("/api/doubts/");

// ── Flashcards ──

export const fetchFlashcardsByChapter = (chapterSlug: string) =>
  apiFetch<Flashcard[]>(`/api/flashcards/chapter/${chapterSlug}`);

export const fetchDueFlashcards = () =>
  apiFetch<FlashcardReview[]>("/api/flashcards/due");

export const reviewFlashcard = (flashcardId: string, rating: number) =>
  apiFetch<FlashcardReview>("/api/flashcards/review", {
    method: "POST",
    body: JSON.stringify({ flashcard_id: flashcardId, rating })
  });

// ── Leaderboard ──

export const fetchLeaderboard = (limit = 50) =>
  apiFetch<LeaderboardEntry[]>(`/api/leaderboard/?limit=${limit}`);

export const fetchMyRank = () =>
  apiFetch<{ rank: number }>("/api/leaderboard/me");

export { ApiError };
