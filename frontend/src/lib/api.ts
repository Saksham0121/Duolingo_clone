/**
 * Typed API client — all calls go through here.
 * Base URL reads from NEXT_PUBLIC_API_URL env var (falls back to localhost).
 */
import type {
  Course,
  CourseWithUnits,
  LessonWithExercises,
  User,
  StreakInfo,
  HeartsInfo,
  LeaderboardEntry,
  Achievement,
  CompleteLessonPayload,
  ProgressResult,
} from '@/types';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API ${path} → ${res.status}: ${err}`);
  }
  return res.json() as Promise<T>;
}

// ── Courses ──────────────────────────────────────────────────────────────────

export const getCourses = () =>
  request<Course[]>('/api/courses/');

export const getCourseWithUnits = (courseId: number, userId = 1) =>
  request<CourseWithUnits>(`/api/courses/${courseId}/units?user_id=${userId}`);

// ── Lessons ───────────────────────────────────────────────────────────────────

export const getLessonExercises = (lessonId: number) =>
  request<LessonWithExercises>(`/api/lessons/${lessonId}/exercises`);

// ── User ──────────────────────────────────────────────────────────────────────

export const getUser = (userId = 1) =>
  request<User>(`/api/user/${userId}`);

export const getUserStreak = (userId = 1) =>
  request<StreakInfo>(`/api/user/${userId}/streak`);

export const getUserHearts = (userId = 1) =>
  request<HeartsInfo>(`/api/user/${userId}/hearts`);

export const getUserAchievements = (userId = 1) =>
  request<Achievement[]>(`/api/user/${userId}/achievements`);

export const simulateMissedDay = (userId = 1) =>
  request<{ success: boolean; message: string; data: { current_streak: number } }>(
    `/api/user/${userId}/simulate-missed-day`,
    { method: 'POST' }
  );

// ── Leaderboard ───────────────────────────────────────────────────────────────

export const getLeaderboard = (userId = 1) =>
  request<LeaderboardEntry[]>(`/api/leaderboard/?user_id=${userId}`);

// ── Progress ──────────────────────────────────────────────────────────────────

export const completeLesson = (payload: CompleteLessonPayload) =>
  request<{ success: boolean; data: ProgressResult }>('/api/progress/complete', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const reportWrongAnswer = (userId = 1) =>
  request<{ success: boolean; data: { hearts_remaining: number } }>(
    '/api/progress/wrong',
    { method: 'POST', body: JSON.stringify({ user_id: userId }) }
  );

export const refillHearts = (userId = 1) =>
  request<{ success: boolean; data: { hearts: number } }>(
    '/api/progress/refill-hearts',
    { method: 'POST', body: JSON.stringify({ user_id: userId }) }
  );
