import { getIdToken } from "./firebase";
import { sanitizeNoteHtml } from "./dompurify-config";
import { useAuthStore } from './store/authStore';
import type {
  ProfileResponse,
  SubjectResponse,
  SubjectListResponse,
  ChapterResponse,
  ChapterListResponse,
  NoteProgressRequest,
  QuizSessionResponse,
  QuizSubmitRequest,
  QuizSubmitResponse,
  ActiveSessionResponse,
  LeaderboardResponse,
  LeaderboardEntry,
  FlashcardResponse,
  FlashcardDueResponse,
  FlashcardReviewRequest,
  FlashcardReviewResponse,
  DoubtRequest,
  DoubtResponse,
  BookmarkResponse,
  BookmarkListResponse,
  BookmarkCreateRequest,
  AuthSyncPayload,
  SessionResponse,
  ApiErrorBody,
  ProfileUpdateRequest,
} from '../types';

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ── Custom API Error ──
export class ApiError extends Error {
  status: number;
  title: string;
  detail: string;

  constructor(status: number, title: string, detail: string) {
    super(`${status}: ${title} — ${detail}`);
    this.name = 'ApiError';
    this.status = status;
    this.title = title;
    this.detail = detail;
  }
}

// ── Core request function ──
async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const token = useAuthStore.getState().idToken || await getIdToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    await useAuthStore.getState().signOut();
    window.location.href = '/login';
    throw new ApiError(401, 'Unauthorized', 'Session expired. Please log in again.');
  }

  if (!res.ok) {
    let errorBody: ApiErrorBody = {};
    try {
      errorBody = (await res.json()) as ApiErrorBody;
    } catch {
      // Response body is not JSON
    }
    throw new ApiError(
      errorBody.status ?? res.status,
      errorBody.title ?? 'Error',
      errorBody.detail ?? res.statusText
    );
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

// ── Auth ──
export async function syncAuth(payload: AuthSyncPayload): Promise<SessionResponse> {
  return request<SessionResponse>('POST', '/api/auth/session', payload);
}

export async function getMe(): Promise<ProfileResponse> {
  return request<ProfileResponse>('GET', '/api/profile/me');
}

// ── Subjects ──
export async function getSubjects(): Promise<SubjectResponse[]> {
  const res = await request<SubjectListResponse>('GET', '/api/subjects');
  return res.subjects;
}

// ── Chapters ──
export async function getChapters(subjectSlug: string): Promise<ChapterResponse[]> {
  const res = await request<ChapterListResponse>('GET', `/api/chapters/${subjectSlug}`);
  return res.chapters;
}

// ── Notes & HTML Sanitization ──
export async function loadNoteHtml(notesFile: string): Promise<string> {
  const res = await fetch(`/notes/${notesFile}`);
  if (!res.ok) throw new Error("Failed to load notes");
  const html = await res.text();
  return sanitizeNoteHtml(html);
}

export function updateNoteProgress(payload: NoteProgressRequest): Promise<{ ok: boolean }> {
  return request<{ ok: boolean }>('POST', '/api/notes/progress', payload);
}

// ── Practice / Quiz ──
export function startQuiz(
  mode: string = 'custom',
  subjectSlugs?: string,
  count: number = 20
): Promise<QuizSessionResponse> {
  const params = new URLSearchParams({ mode: mode.toLowerCase(), count: count.toString() });
  if (subjectSlugs) {
    params.append('subject_slugs', subjectSlugs);
  }
  return request<QuizSessionResponse>('GET', `/api/quiz/questions?${params.toString()}`);
}

export function submitQuiz(sessionId: string): Promise<QuizSubmitResponse> {
  return request<QuizSubmitResponse>('POST', '/api/quiz/submit', { session_id: sessionId });
}

export function getActiveSession(): Promise<ActiveSessionResponse> {
  return request<ActiveSessionResponse>('GET', '/api/quiz/active');
}

export function saveQuizState(sessionId: string, answers: Record<string, string>, flags: string[]): Promise<{ ok: boolean }> {
  return request<{ ok: boolean }>('POST', '/api/quiz/save', {
    session_id: sessionId,
    answers,
    flags
  });
}

// ── Flashcards ──
export async function getFlashcards(subjectId?: string): Promise<FlashcardResponse[]> {
  let path = '/api/flashcards/due';
  if (subjectId) {
    path += `?subject_id=${subjectId}`;
  }
  const res = await request<FlashcardDueResponse>('GET', path);
  return res.flashcards;
}

export function reviewFlashcard(flashcardId: string, quality: number): Promise<FlashcardReviewResponse> {
  return request<FlashcardReviewResponse>('POST', '/api/flashcards/review', {
    flashcard_id: flashcardId,
    quality
  });
}

// ── Leaderboard ──
export async function getLeaderboard(scope: string = 'weekly', page: number = 1): Promise<LeaderboardEntry[]> {
  const res = await request<LeaderboardResponse>('GET', `/api/leaderboard?scope=${scope}&page=${page}`);
  return res.entries;
}

// ── Bookmarks ────────────────────────────────────────────────────────
export async function getBookmarks(): Promise<BookmarkResponse[]> {
  const res = await request<BookmarkListResponse>('GET', '/api/bookmarks');
  return res.bookmarks;
}

export function createBookmark(payload: BookmarkCreateRequest): Promise<{ id: string }> {
  return request<{ id: string }>('POST', '/api/bookmarks', payload);
}

export function deleteBookmark(bookmarkId: string): Promise<{ deleted: boolean }> {
  return request<{ deleted: boolean }>('DELETE', `/api/bookmarks/${bookmarkId}`);
}

// ── Doubts ───────────────────────────────────────────────────────────
export function askDoubt(payload: DoubtRequest): Promise<DoubtResponse> {
  return request<DoubtResponse>('POST', '/api/doubts/ask', payload);
}

// ── Profile Management ──
export function updateProfile(payload: ProfileUpdateRequest): Promise<ProfileResponse> {
  return request<ProfileResponse>('PATCH', '/api/profile/me', payload);
}

// ── Compatibility Aliases ──
export const fetchProfile = getMe;
export const getProfile = getMe;
export const getProgress = getMe;
export const fetchSubjects = getSubjects;
export const fetchChapters = getChapters;
export const markChapterProgress = (chapterSlug: string, subjectSlug: string, completed: boolean) => {
  return updateNoteProgress({
    chapter_slug: chapterSlug,
    subject_slug: subjectSlug,
    status: completed ? 'done' : 'in_progress',
    time_spent_s: 0
  });
};
export const fetchLeaderboard = getLeaderboard;
export const fetchBookmarks = getBookmarks;
