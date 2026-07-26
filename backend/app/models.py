"""
SQLAlchemy ORM models for the Duolingo clone.

Schema overview:
  Course → Unit → Skill → Lesson → Exercise   (content hierarchy)
  User → UserProgress (per-skill)              (learner progress)
  User → Streak                                (daily streak)
  User → Hearts                                (lives system)
  User → XPLog                                 (audit trail of XP earned)
  User → Leaderboard                           (weekly league ranking)
  User → Achievement                           (badges)
"""
import json
from datetime import datetime, date
from typing import Optional, List

from sqlalchemy import (
    Integer, String, Boolean, DateTime, Date, Float,
    ForeignKey, Text, func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


# ---------------------------------------------------------------------------
# Content hierarchy
# ---------------------------------------------------------------------------

class Course(Base):
    """A language course, e.g. "Spanish"."""
    __tablename__ = "courses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    flag_emoji: Mapped[str] = mapped_column(String(10), nullable=False, default="🇪🇸")
    description: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now())

    units: Mapped[List["Unit"]] = relationship(
        "Unit", back_populates="course", order_by="Unit.order_index"
    )


class Unit(Base):
    """
    A thematic unit inside a course (e.g., "Basics 1").
    Each unit has a unique accent color used for the path nodes.
    """
    __tablename__ = "units"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    course_id: Mapped[int] = mapped_column(Integer, ForeignKey("courses.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    order_index: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    color_hex: Mapped[str] = mapped_column(String(7), nullable=False, default="#58cc02")

    course: Mapped["Course"] = relationship("Course", back_populates="units")
    skills: Mapped[List["Skill"]] = relationship(
        "Skill", back_populates="unit", order_by="Skill.order_index"
    )


class Skill(Base):
    """
    A skill node on the learning path (e.g., "Greetings").
    total_lessons drives the progress ring.
    """
    __tablename__ = "skills"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    unit_id: Mapped[int] = mapped_column(Integer, ForeignKey("units.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    icon_emoji: Mapped[str] = mapped_column(String(10), nullable=False, default="⭐")
    order_index: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    total_lessons: Mapped[int] = mapped_column(Integer, nullable=False, default=3)

    unit: Mapped["Unit"] = relationship("Unit", back_populates="skills")
    lessons: Mapped[List["Lesson"]] = relationship(
        "Lesson", back_populates="skill", order_by="Lesson.order_index"
    )
    user_progress: Mapped[List["UserProgress"]] = relationship(
        "UserProgress", back_populates="skill"
    )


class Lesson(Base):
    """A sequence of exercises within a skill."""
    __tablename__ = "lessons"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    skill_id: Mapped[int] = mapped_column(Integer, ForeignKey("skills.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    order_index: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    skill: Mapped["Skill"] = relationship("Skill", back_populates="lessons")
    exercises: Mapped[List["Exercise"]] = relationship(
        "Exercise", back_populates="lesson", order_by="Exercise.order_index"
    )


class Exercise(Base):
    """
    A single question/task inside a lesson.

    type can be:
      'multiple_choice'  – options_json: ["a","b","c","d"]
      'word_bank'        – word_bank_json: ["word1","word2",...], correct_answer is full sentence
      'match_pairs'      – pairs_json: [{"left":"hola","right":"hello"}, ...]
      'fill_blank'       – prompt contains ___ placeholder
      'type_answer'      – free text input
    """
    __tablename__ = "exercises"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    lesson_id: Mapped[int] = mapped_column(Integer, ForeignKey("lessons.id"), nullable=False)
    type: Mapped[str] = mapped_column(String(30), nullable=False)
    prompt: Mapped[str] = mapped_column(Text, nullable=False)
    correct_answer: Mapped[str] = mapped_column(Text, nullable=False)
    options_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # JSON array
    word_bank_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # JSON array
    pairs_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # JSON array of {left, right}
    audio_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)  # optional pre-recorded clip
    order_index: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    lesson: Mapped["Lesson"] = relationship("Lesson", back_populates="exercises")

    # Convenience property: parsed options
    @property
    def options(self) -> Optional[List[str]]:
        return json.loads(self.options_json) if self.options_json else None

    @property
    def word_bank(self) -> Optional[List[str]]:
        return json.loads(self.word_bank_json) if self.word_bank_json else None

    @property
    def pairs(self) -> Optional[List[dict]]:
        return json.loads(self.pairs_json) if self.pairs_json else None


# ---------------------------------------------------------------------------
# Learner / User models
# ---------------------------------------------------------------------------

class User(Base):
    """Simplified user — authentication is mocked (single default learner)."""
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(200), unique=True, nullable=False)
    avatar_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    total_xp: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now())

    progress: Mapped[List["UserProgress"]] = relationship(
        "UserProgress", back_populates="user"
    )
    streak: Mapped[Optional["Streak"]] = relationship(
        "Streak", back_populates="user", uselist=False
    )
    hearts: Mapped[Optional["Hearts"]] = relationship(
        "Hearts", back_populates="user", uselist=False
    )
    xp_log: Mapped[List["XPLog"]] = relationship("XPLog", back_populates="user")
    leaderboard_entry: Mapped[Optional["LeaderboardEntry"]] = relationship(
        "LeaderboardEntry", back_populates="user", uselist=False
    )
    achievements: Mapped[List["Achievement"]] = relationship(
        "Achievement", back_populates="user"
    )


class UserProgress(Base):
    """
    Tracks a learner's completion state for a specific skill.
    crowns: 0–5 (Duolingo crown levels).
    completed_lessons: how many lessons in this skill are done.
    """
    __tablename__ = "user_progress"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    skill_id: Mapped[int] = mapped_column(Integer, ForeignKey("skills.id"), nullable=False)
    xp_earned: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    completed_lessons: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    crowns: Mapped[int] = mapped_column(Integer, nullable=False, default=0)  # 0=locked,1-5=crowns
    completed: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=func.now(), onupdate=func.now())

    user: Mapped["User"] = relationship("User", back_populates="progress")
    skill: Mapped["Skill"] = relationship("Skill", back_populates="user_progress")


class Streak(Base):
    """Daily streak tracking for a user."""
    __tablename__ = "streaks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    current_streak: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    longest_streak: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    last_activity_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)

    user: Mapped["User"] = relationship("User", back_populates="streak")


class Hearts(Base):
    """
    Lives system: learner starts with 5 hearts, loses one per wrong answer.
    Hearts refill over time (1 per 30 min, configurable) or via the shop.
    """
    __tablename__ = "hearts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    count: Mapped[int] = mapped_column(Integer, nullable=False, default=5)
    max_hearts: Mapped[int] = mapped_column(Integer, nullable=False, default=5)
    last_refill_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    user: Mapped["User"] = relationship("User", back_populates="hearts")


class XPLog(Base):
    """Audit trail of every XP award."""
    __tablename__ = "xp_log"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    amount: Mapped[int] = mapped_column(Integer, nullable=False)
    source: Mapped[str] = mapped_column(String(100), nullable=False)  # e.g. "lesson_complete"
    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now())

    user: Mapped["User"] = relationship("User", back_populates="xp_log")


class LeaderboardEntry(Base):
    """Weekly XP leaderboard entry per user."""
    __tablename__ = "leaderboard"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    weekly_xp: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    total_xp: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    league: Mapped[str] = mapped_column(String(50), nullable=False, default="Bronze")
    rank: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    user: Mapped["User"] = relationship("User", back_populates="leaderboard_entry")


class Achievement(Base):
    """Badges earned by a user."""
    __tablename__ = "achievements"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    badge_type: Mapped[str] = mapped_column(String(100), nullable=False)
    badge_name: Mapped[str] = mapped_column(String(200), nullable=False)
    badge_description: Mapped[str] = mapped_column(Text, nullable=True)
    earned_at: Mapped[datetime] = mapped_column(DateTime, default=func.now())

    user: Mapped["User"] = relationship("User", back_populates="achievements")
