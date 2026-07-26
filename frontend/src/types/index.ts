/**
 * Shared TypeScript interfaces matching the FastAPI Pydantic schemas.
 * Keep in sync with backend/app/schemas.py
 */

export interface Course {
  id: number;
  name: string;
  flag_emoji: string;
  description: string | null;
}

export interface Lesson {
  id: number;
  skill_id: number;
  title: string;
  order_index: number;
}

export interface SkillWithProgress {
  id: number;
  unit_id: number;
  title: string;
  icon_emoji: string;
  order_index: number;
  total_lessons: number;
  xp_earned: number;
  completed_lessons: number;
  crowns: number;
  completed: boolean;
  is_locked: boolean;
  lessons: Lesson[];
}

export interface Unit {
  id: number;
  title: string;
  description: string | null;
  order_index: number;
  color_hex: string;
  skills: SkillWithProgress[];
}

export interface CourseWithUnits extends Course {
  units: Unit[];
}

export interface Exercise {
  id: number;
  type: ExerciseType;
  prompt: string;
  correct_answer: string;
  options?: string[] | null;
  word_bank?: string[] | null;
  pairs?: Array<{ left: string; right: string }> | null;
  audio_url?: string | null;
  order_index: number;
}

export type ExerciseType =
  | 'multiple_choice'
  | 'word_bank'
  | 'match_pairs'
  | 'fill_blank'
  | 'type_answer';

export interface LessonWithExercises extends Lesson {
  exercises: Exercise[];
}

export interface StreakInfo {
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
}

export interface HeartsInfo {
  count: number;
  max_hearts: number;
  last_refill_at: string | null;
}

export interface Achievement {
  id: number;
  badge_type: string;
  badge_name: string;
  badge_description: string | null;
  earned_at: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  avatar_url: string | null;
  total_xp: number;
  created_at: string;
  streak: StreakInfo | null;
  hearts: HeartsInfo | null;
  achievements: Achievement[];
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar_url: string | null;
  weekly_xp: number;
  total_xp: number;
  league: string;
  is_current_user: boolean;
}

export interface CompleteLessonPayload {
  user_id: number;
  lesson_id: number;
  xp_earned: number;
  mistakes?: number;
}

export interface ProgressResult {
  xp_earned: number;
  total_xp: number;
  skill_completed: boolean;
  crowns: number;
  current_streak: number;
}
