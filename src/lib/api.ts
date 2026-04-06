import { getIdToken } from './firebase';
import { sanitizeNoteHtml } from './dompurify-config';
import type {
  SubjectResponse,
  ChapterResponse,
  QuestionResponse,
  FlashcardResponse,
  LeaderboardEntry,
  QuizSessionResponse,
  QuizSubmitResponse,
  UserProgressResponse,
  BookmarkResponse,
  UserProfile,
  PracticeConfig,
  DoubtCreateRequest,
  JudgeSubmitRequest,
  ProfileUpdateRequest,
} from '../types';

const BASE = import.meta.env.VITE_API_URL;

class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(status: number, data: unknown) {
    super(`API Error ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getIdToken();
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new ApiError(res.status, data);
  }
  return res.json();
}

async function publicFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new ApiError(res.status, await res.json().catch(() => ({})));
  return res.json();
}

// ── Public endpoints ──

export const fetchSubjects = () => publicFetch<SubjectResponse[]>('/api/subjects');

export const fetchChapters = (slug: string) =>
  publicFetch<ChapterResponse[]>(`/api/subjects/${slug}/chapters`);

export const healthCheck = () => publicFetch<{ status: string }>('/health');

// ── Authenticated endpoints ──

export const fetchPracticeConfig = (slug: string) =>
  apiFetch<PracticeConfig>(`/api/subjects/${slug}/practice-config`);

export const fetchQuestions = (params: Record<string, string>) => {
  const qs = new URLSearchParams(params).toString();
  return apiFetch<QuestionResponse[]>(`/api/questions?${qs}`);
};

export const startQuiz = (body: { subject_id: string; chapter_id?: string; question_count?: number }) =>
  apiFetch<QuizSessionResponse>('/api/quiz/start', {
    method: 'POST',
    body: JSON.stringify(body),
  });

export const saveQuiz = (body: { session_id: string; answers: Record<string, string>; flags: string[] }) =>
  apiFetch<void>('/api/quiz/save', { method: 'POST', body: JSON.stringify(body) });

export const submitQuiz = (body: { session_id: string; answers: Record<string, string> }) =>
  apiFetch<QuizSubmitResponse>('/api/quiz/submit', { method: 'POST', body: JSON.stringify(body) });

export const fetchFlashcards = (subjectId: string) =>
  apiFetch<FlashcardResponse[]>(`/api/flashcards?subject_id=${subjectId}`);

export const reviewFlashcard = (id: string, quality: number) =>
  apiFetch<{ next_review: string; ease_factor: number; interval: number }>(`/api/flashcards/${id}/review`, {
    method: 'POST',
    body: JSON.stringify({ quality }),
  });

export const fetchBookmarks = () => apiFetch<BookmarkResponse[]>('/api/bookmarks');

export const createBookmark = (body: { chapter_id: string; section_id: string; section_title: string }) =>
  apiFetch<BookmarkResponse>('/api/bookmarks', { method: 'POST', body: JSON.stringify(body) });

export const deleteBookmark = (id: string) =>
  apiFetch<void>(`/api/bookmarks/${id}`, { method: 'DELETE' });

export const fetchLeaderboard = (branchSlug = 'cse') =>
  apiFetch<LeaderboardEntry[]>(`/api/leaderboard?branch_slug=${branchSlug}`);

export const fetchProfile = () => apiFetch<UserProfile>('/api/profile');

export const updateProfile = (body: ProfileUpdateRequest) =>
  apiFetch<UserProfile>('/api/profile', { method: 'PUT', body: JSON.stringify(body) });

export const fetchProgress = () => apiFetch<UserProgressResponse>('/api/progress');

export const exportProgress = async () => {
  const token = await getIdToken();
  const res = await fetch(`${BASE}/api/export/progress`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new ApiError(res.status, {});
  return res.blob();
};

// ── Notes fetch — CDN direct, signed_url consumed immediately ──

export async function loadNoteHtml(chapterId: string): Promise<string> {
  const { signed_url } = await apiFetch<{ signed_url: string }>(
    `/api/notes/${chapterId}/url`
  );
  // signed_url consumed here — never stored
  const html = await fetch(signed_url).then((r) => r.text());
  // Cache for offline
  try {
    const cache = await caches.open('notes-v1');
    await cache.put(`notes-chapter-${chapterId}`, new Response(html));
  } catch {
    // Cache API not available (e.g. incognito)
  }
  return sanitizeNoteHtml(html);
}

export async function loadCachedNoteHtml(chapterId: string): Promise<string | null> {
  try {
    const cache = await caches.open('notes-v1');
    const response = await cache.match(`notes-chapter-${chapterId}`);
    if (!response) return null;
    const html = await response.text();
    return sanitizeNoteHtml(html);
  } catch {
    return null;
  }
}

// ── Code execution — via backend proxy ──

export async function runCode(language: string, source_code: string, stdin = '') {
  const body: JudgeSubmitRequest = { language, source_code, stdin };
  return apiFetch<{ stdout: string; stderr: string; exit_code: number }>(
    '/api/judge/submit',
    { method: 'POST', body: JSON.stringify(body) }
  );
}

// ── AI doubt answering — via backend proxy ──

export async function askDoubt(payload: DoubtCreateRequest) {
  return apiFetch<{ answer: string }>('/api/doubts/ask', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export { ApiError };
