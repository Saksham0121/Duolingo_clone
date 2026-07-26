"""
Pydantic schemas for request/response serialization.
Keeps API contracts separate from ORM models.
"""
from __future__ import annotations
from datetime import datetime, date
from typing import Optional, List, Any
from pydantic import BaseModel


# ── Exercise ────────────────────────────────────────────────────────────────

class ExerciseOut(BaseModel):
    id: int
    type: str
    prompt: str
    correct_answer: str
    options: Optional[List[str]] = None
    word_bank: Optional[List[str]] = None
    pairs: Optional[List[dict]] = None
    audio_url: Optional[str] = None
    order_index: int

    model_config = {"from_attributes": True}


# ── Lesson ───────────────────────────────────────────────────────────────────

class LessonOut(BaseModel):
    id: int
    skill_id: int
    title: str
    order_index: int

    model_config = {"from_attributes": True}


class LessonWithExercises(LessonOut):
    exercises: List[ExerciseOut] = []


# ── Skill ────────────────────────────────────────────────────────────────────

class SkillOut(BaseModel):
    id: int
    unit_id: int
    title: str
    icon_emoji: str
    order_index: int
    total_lessons: int

    model_config = {"from_attributes": True}


class SkillWithProgress(SkillOut):
    """Skill with the current user's progress baked in."""
    xp_earned: int = 0
    completed_lessons: int = 0
    crowns: int = 0
    completed: bool = False
    is_locked: bool = True
    lessons: List[LessonOut] = []


# ── Unit ─────────────────────────────────────────────────────────────────────

class UnitOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    order_index: int
    color_hex: str
    skills: List[SkillWithProgress] = []

    model_config = {"from_attributes": True}


# ── Course ───────────────────────────────────────────────────────────────────

class CourseOut(BaseModel):
    id: int
    name: str
    flag_emoji: str
    description: Optional[str]

    model_config = {"from_attributes": True}


class CourseWithUnits(CourseOut):
    units: List[UnitOut] = []


# ── User / Progress ──────────────────────────────────────────────────────────

class StreakOut(BaseModel):
    current_streak: int
    longest_streak: int
    last_activity_date: Optional[date]

    model_config = {"from_attributes": True}


class HeartsOut(BaseModel):
    count: int
    max_hearts: int
    last_refill_at: Optional[datetime]

    model_config = {"from_attributes": True}


class AchievementOut(BaseModel):
    id: int
    badge_type: str
    badge_name: str
    badge_description: Optional[str]
    earned_at: datetime

    model_config = {"from_attributes": True}


class UserOut(BaseModel):
    id: int
    username: str
    email: str
    avatar_url: Optional[str]
    total_xp: int
    created_at: datetime
    streak: Optional[StreakOut] = None
    hearts: Optional[HeartsOut] = None
    achievements: List[AchievementOut] = []

    model_config = {"from_attributes": True}


# ── Leaderboard ───────────────────────────────────────────────────────────────

class LeaderboardEntryOut(BaseModel):
    rank: int
    username: str
    avatar_url: Optional[str]
    weekly_xp: int
    total_xp: int
    league: str
    is_current_user: bool = False

    model_config = {"from_attributes": True}


# ── Progress update payloads ─────────────────────────────────────────────────

class CompleteLessonPayload(BaseModel):
    user_id: int
    lesson_id: int
    xp_earned: int = 10
    mistakes: int = 0          # number of wrong answers in this attempt


class WrongAnswerPayload(BaseModel):
    user_id: int


class RefillHeartsPayload(BaseModel):
    user_id: int


# ── Generic response ─────────────────────────────────────────────────────────

class SuccessResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None
