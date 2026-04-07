import { getIdToken } from "./firebase";
import { sanitizeNoteHtml } from "./dompurify-config";
import type {
  SubjectResponse,
  ChapterResponse,
  FlashcardResponse,
  LeaderboardResponse,
  QuizSessionResponse,
  QuizSubmitResponse,
  BookmarkResponse,
  UserProfile,
  DoubtCreateRequest,
  JudgeSubmitRequest,
  ProfileUpdateRequest,
  SessionResponse,
  NoteProgressRequest,
  NoteProgressResponse,
  AvatarUploadResponse,
} from "../types";

const BASE = import.meta.env.VITE_API_URL;

class ApiError extends Error {
  status: number;
  data: any; // FastAPI detail or other error info
  constructor(status: number, data: any) {
    let message = `API Error ${status}`;
    if (status === 422 && data?.detail) {
      // Format FastAPI's "detail" [loc, msg, type] into a readable string
      const details = Array.isArray(data.detail)
        ? data.detail.map((d: any) => `${d.loc.join(" -> ")}: ${d.msg}`).join("; ")
        : JSON.stringify(data.detail);
      message = `Validation Error (422): ${details}`;
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

// ── Public endpoints ──

export const fetchSubjects = () =>
  apiFetch<SubjectResponse[] | any>("/api/subjects").then((res) => {
    const data = res as any;
    if (Array.isArray(data)) return data as SubjectResponse[];
    if (data && Array.isArray(data.subjects)) return data.subjects as SubjectResponse[];
    return [] as SubjectResponse[];
  }); // Requires auth for progress calculation

export const fetchChapters = (subjectId: string) =>
  apiFetch<ChapterResponse[] | any>(`/api/chapters/${subjectId}`).then((res) => {
    const data = res as any;
    if (Array.isArray(data)) return data as ChapterResponse[];
    if (data && Array.isArray(data.chapters)) return data.chapters as ChapterResponse[];
    return [] as ChapterResponse[];
  });

export const createSession = (idToken: string) =>
  publicFetch<SessionResponse>("/api/auth/session", {
    method: "POST",
    body: JSON.stringify({ id_token: idToken }),
  });

export const healthCheck = () => publicFetch<{ status: string }>("/health");

// ── Authenticated endpoints ──

export const fetchQuestions = (params: Record<string, string>) => {
  const qs = new URLSearchParams(params).toString();
  return apiFetch<QuizSessionResponse>(`/api/quiz/questions?${qs}`);
};

export const startQuiz = (params: Record<string, string>) => {
  const qs = new URLSearchParams(params).toString();
  return apiFetch<QuizSessionResponse>(`/api/quiz/questions?${qs}`);
};

export const saveQuiz = (body: {
  session_id: string;
  answers: Record<string, string>;
  flags: string[];
}) =>
  apiFetch<{ ok: boolean; saved_at: string }>("/api/quiz/save", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const submitQuiz = (body: {
  session_id: string;
}) =>
  apiFetch<QuizSubmitResponse>("/api/quiz/submit", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const fetchFlashcards = (subjectId?: string) => {
  const path = subjectId ? `/api/flashcards/due?subject_id=${subjectId}` : "/api/flashcards/due";
  return apiFetch<{ due_count: number; flashcards: FlashcardResponse[] }>(path);
};

export const reviewFlashcard = (flashcardId: string, quality: number) =>
  apiFetch<{ next_review: string; new_ease_factor: number; new_interval: number }>(
    `/api/flashcards/review`,
    {
      method: "POST",
      body: JSON.stringify({ flashcard_id: flashcardId, quality }),
    },
  );

export const fetchBookmarks = () =>
  apiFetch<BookmarkResponse[]>("/api/bookmarks").then((data) => (Array.isArray(data) ? data : []));

export const createBookmark = (body: {
  chapter_id: string;
  section_id: string;
  section_title: string;
}) =>
  apiFetch<BookmarkResponse>("/api/bookmarks", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const deleteBookmark = (id: string) =>
  apiFetch<void>(`/api/bookmarks/${id}`, { method: "DELETE" });

export const fetchLeaderboard = (scope = "weekly", page = 1) =>
  apiFetch<LeaderboardResponse>(`/api/leaderboard?scope=${scope}&page=${page}`);

export const fetchProfile = () => apiFetch<UserProfile>("/api/profile/me");

export const updateProfile = (body: ProfileUpdateRequest) =>
  apiFetch<UserProfile>("/api/profile/me", {
    method: "PATCH",
    body: JSON.stringify(body),
  });

export const uploadAvatar = async (file: File) => {
  const token = await getIdToken();
  const formData = new FormData();
  formData.append("file", file);
  
  const res = await fetch(`${BASE}/api/profile/avatar`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  
  if (!res.ok) throw new ApiError(res.status, await res.json().catch(() => ({})));
  return res.json() as Promise<AvatarUploadResponse>;
};

export const deleteAvatar = () =>
  apiFetch<{ ok: boolean }>("/api/profile/avatar", { method: "DELETE" });

export const updateNoteProgress = (body: NoteProgressRequest) =>
  apiFetch<NoteProgressResponse>("/api/notes/progress", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const exportProgress = async () => {
  const token = await getIdToken();
  const res = await fetch(`${BASE}/api/export/data`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new ApiError(res.status, {});
  return res.json();
};

// ── Notes fetch — CDN direct, signed_url consumed immediately ──

export async function loadNoteHtml(chapterId: string): Promise<string> {
  const { signed_url } = await apiFetch<{ signed_url: string }>(
    `/api/notes/url?chapter_id=${chapterId}`,
  );
  const html = await fetch(signed_url).then((r) => r.text());
  // Cache for offline
  try {
    const cache = await caches.open("notes-v1");
    await cache.put(`notes-chapter-${chapterId}`, new Response(html));
  } catch {
    // Cache API not available
  }
  return sanitizeNoteHtml(html);
}

export async function loadCachedNoteHtml(
  chapterId: string,
): Promise<string | null> {
  try {
    const cache = await caches.open("notes-v1");
    const response = await cache.match(`notes-chapter-${chapterId}`);
    if (!response) return null;
    const html = await response.text();
    return sanitizeNoteHtml(html);
  } catch {
    return null;
  }
}

// ── Code execution — via backend proxy ──

export async function runCode(
  language: string,
  source_code: string,
  stdin = "",
) {
  const body: JudgeSubmitRequest = { language, source_code, stdin };
  return apiFetch<{ stdout: string; stderr: string; exit_code: number }>(
    "/api/judge/submit",
    { method: "POST", body: JSON.stringify(body) },
  );
}

// ── AI doubt answering — via backend proxy ──

export async function askDoubt(payload: DoubtCreateRequest) {
  return apiFetch<{ answer: string }>("/api/doubts", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export { ApiError };
