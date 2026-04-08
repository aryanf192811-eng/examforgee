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

const BASE = import.meta.env.VITE_API_URL;

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
  const token = useAuthStore.getState().idToken;

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

  // Handle 204 No Content
  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

// ── Auth ──

/** Exchange Firebase token for Backend Session */
export async function syncAuth(payload: AuthSyncPayload): Promise<SessionResponse> {
  const res = await request<SessionResponse>('POST', '/api/auth/session', payload);
  console.log('[syncAuth] Response:', res);
  return res;
}

/** Get CURRENT authenticated profile and stats */
export async function getMe(): Promise<ProfileResponse> {
  const res = await request<ProfileResponse>('GET', '/api/profile/me');
  console.log('[getMe] Response:', res);
  return res;
}

// ── Subjects ──

/** List all subjects, returns unwrapped array */
export async function getSubjects(): Promise<SubjectResponse[]> {
  const res = await request<SubjectListResponse>('GET', '/api/subjects');
  return res.subjects;
}

// ── Chapters ──

/** List chapters for a subject, returns unwrapped array */
export async function getChapters(subjectSlug: string): Promise<ChapterResponse[]> {
  const res = await request<ChapterListResponse>('GET', `/api/chapters/${subjectSlug}`);
  return res.chapters;
}

// ── Notes ──

// getNoteUrl is deprecated. Use getManifest() and direct static fetching.

/** Update reading progress */
export function updateNoteProgress(payload: NoteProgressRequest): Promise<{ ok: boolean }> {
  return request<{ ok: boolean }>('POST', '/api/notes/progress', payload);
}

// ── Practice / Quiz ──

/** Start a new quiz session (fetches questions) */
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

/** Submit a quiz session for grading */
export function submitQuiz(sessionId: string): Promise<QuizSubmitResponse> {
  return request<QuizSubmitResponse>('POST', '/api/quiz/submit', { session_id: sessionId });
}

/** Check for active session */
export function getActiveSession(): Promise<ActiveSessionResponse> {
  return request<ActiveSessionResponse>('GET', '/api/quiz/active');
}

/** Save ephemeral quiz state (every 30s) */
export function saveQuizState(sessionId: string, answers: Record<string, string>, flags: string[]): Promise<{ ok: boolean }> {
  return request<{ ok: boolean }>('POST', '/api/quiz/save', {
    session_id: sessionId,
    answers,
    flags
  });
}

// ── Flashcards ──

/** Get due flashcards for revision */
export async function getFlashcards(subjectId?: string): Promise<FlashcardResponse[]> {
  let path = '/api/flashcards/due';
  if (subjectId) {
    path += `?subject_id=${subjectId}`;
  }
  const res = await request<FlashcardDueResponse>('GET', path);
  return res.flashcards;
}

/** Submit a flashcard review (SM-2 quality 0-5) */
export function reviewFlashcard(flashcardId: string, quality: number): Promise<FlashcardReviewResponse> {
  return request<FlashcardReviewResponse>('POST', '/api/flashcards/review', {
    flashcard_id: flashcardId,
    quality
  });
}

// ── Leaderboard ──

/** Get ranked leaderboard, returns unwrapped entries array */
export async function getLeaderboard(scope: string = 'weekly', page: number = 1): Promise<LeaderboardEntry[]> {
  const res = await request<LeaderboardResponse>('GET', `/api/leaderboard?scope=${scope}&page=${page}`);
  return res.entries;
}

// ── Bookmarks ────────────────────────────────────────────────────────
/** Get all bookmarked sections */
export async function getBookmarks(): Promise<BookmarkResponse[]> {
  const res = await request<BookmarkListResponse>('GET', '/api/bookmarks');
  return res.bookmarks;
}

/** Create a new bookmark for a note section */
export function createBookmark(payload: BookmarkCreateRequest): Promise<{ id: string }> {
  return request<{ id: string }>('POST', '/api/bookmarks', payload);
}

/** Remove a bookmark */
export function deleteBookmark(bookmarkId: string): Promise<{ deleted: boolean }> {
  return request<{ deleted: boolean }>('DELETE', `/api/bookmarks/${bookmarkId}`);
}

// ── Doubts ───────────────────────────────────────────────────────────

/** Ask AI tutor about a concept */
export function askDoubt(payload: DoubtRequest): Promise<DoubtResponse> {
  return request<DoubtResponse>('POST', '/api/doubts/ask', payload);
}

// ── Profile Management ──

/** Update profile info (college, target score, etc.) */
export function updateProfile(payload: ProfileUpdateRequest): Promise<ProfileResponse> {
  // Backend uses PATCH /api/profile/me
  return request<ProfileResponse>('PATCH', '/api/profile/me', payload);
}

// ── Legacy Compatibility / Aliases ──
// These help prevent breaking the dashboard if it expects old function names.

export const getProfile = getMe;
export const getProgress = getMe; // Stats are now inside profile response
export const markChapterProgress = (chapterSlug: string, subjectSlug: string, completed: boolean) => {
  return updateNoteProgress({
    chapter_slug: chapterSlug,
    subject_slug: subjectSlug,
    status: completed ? 'done' : 'in_progress',
    time_spent_s: 0
  });
};
