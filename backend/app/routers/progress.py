"""
Progress router — handles:
  POST /api/progress/complete    → mark lesson done, award XP, update streak
  POST /api/progress/wrong       → deduct a heart
"""
from datetime import date, datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import (
    User, Lesson, Skill, UserProgress, Streak, Hearts, XPLog, Achievement, LeaderboardEntry
)
from app.schemas import CompleteLessonPayload, WrongAnswerPayload, SuccessResponse

router = APIRouter(prefix="/api/progress", tags=["progress"])

XP_PER_LESSON = 10
BONUS_XP_NO_MISTAKES = 5


def _get_or_create_progress(db: Session, user_id: int, skill_id: int) -> UserProgress:
    prog = db.query(UserProgress).filter_by(user_id=user_id, skill_id=skill_id).first()
    if not prog:
        prog = UserProgress(user_id=user_id, skill_id=skill_id)
        db.add(prog)
        db.flush()
    return prog


def _update_streak(db: Session, user_id: int):
    """
    Increment streak if the user hasn't already been active today.
    If they missed a day, reset to 1.
    """
    streak = db.query(Streak).filter_by(user_id=user_id).first()
    today = date.today()

    if not streak:
        streak = Streak(user_id=user_id, current_streak=1, longest_streak=1, last_activity_date=today)
        db.add(streak)
        return

    if streak.last_activity_date == today:
        return  # already counted today

    if streak.last_activity_date and (today - streak.last_activity_date).days == 1:
        streak.current_streak += 1
    else:
        streak.current_streak = 1  # streak broken

    streak.longest_streak = max(streak.longest_streak, streak.current_streak)
    streak.last_activity_date = today


def _award_achievement(db: Session, user_id: int, badge_type: str, name: str, desc: str):
    """Award a badge if the user doesn't already have it."""
    existing = db.query(Achievement).filter_by(user_id=user_id, badge_type=badge_type).first()
    if not existing:
        db.add(Achievement(user_id=user_id, badge_type=badge_type, badge_name=name, badge_description=desc))


@router.post("/complete", response_model=SuccessResponse)
def complete_lesson(payload: CompleteLessonPayload, db: Session = Depends(get_db)):
    """
    Called when a learner finishes a lesson.
    - Awards XP (base + bonus for no mistakes)
    - Updates skill progress and crowns
    - Updates streak
    - Checks and grants achievements
    """
    lesson = db.query(Lesson).filter(Lesson.id == payload.lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    user = db.query(User).filter(User.id == payload.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    skill = db.query(Skill).filter(Skill.id == lesson.skill_id).first()

    # Calculate XP
    xp = payload.xp_earned
    if payload.mistakes == 0:
        xp += BONUS_XP_NO_MISTAKES  # perfect lesson bonus

    # Update user total XP
    user.total_xp += xp
    db.add(XPLog(user_id=user.id, amount=xp, source="lesson_complete"))

    # Update skill progress
    prog = _get_or_create_progress(db, user.id, skill.id)
    prog.xp_earned += xp
    prog.completed_lessons = min(prog.completed_lessons + 1, skill.total_lessons)
    if prog.completed_lessons >= skill.total_lessons:
        prog.completed = True
        prog.crowns = min(prog.crowns + 1, 5)

    # Update leaderboard weekly XP
    lb = db.query(LeaderboardEntry).filter_by(user_id=user.id).first()
    if lb:
        lb.weekly_xp += xp
        lb.total_xp += xp

    # Update streak
    _update_streak(db, user.id)

    # Achievement checks
    streak = db.query(Streak).filter_by(user_id=user.id).first()
    _award_achievement(db, user.id, "first_lesson", "First Step", "Complete your first lesson")
    if user.total_xp >= 100:
        _award_achievement(db, user.id, "xp_100", "XP Centurion", "Earn 100 XP total")
    if user.total_xp >= 500:
        _award_achievement(db, user.id, "xp_500", "XP Legend", "Earn 500 XP total")
    if streak and streak.current_streak >= 7:
        _award_achievement(db, user.id, "streak_7", "Week Warrior", "7-day streak")
    if streak and streak.current_streak >= 30:
        _award_achievement(db, user.id, "streak_30", "Monthly Master", "30-day streak")

    db.commit()

    return SuccessResponse(
        success=True,
        message="Lesson complete!",
        data={
            "xp_earned": xp,
            "total_xp": user.total_xp,
            "skill_completed": prog.completed,
            "crowns": prog.crowns,
            "current_streak": streak.current_streak if streak else 1,
        },
    )


@router.post("/wrong", response_model=SuccessResponse)
def wrong_answer(payload: WrongAnswerPayload, db: Session = Depends(get_db)):
    """Deduct one heart. Returns remaining heart count."""
    hearts = db.query(Hearts).filter_by(user_id=payload.user_id).first()
    if not hearts:
        raise HTTPException(status_code=404, detail="Hearts record not found")

    if hearts.count > 0:
        # Start 10-minute refill timer if hearts were previously maxed or timestamp empty
        if hearts.count == hearts.max_hearts or hearts.last_refill_at is None:
            hearts.last_refill_at = datetime.now(timezone.utc)
        hearts.count -= 1
        db.commit()

    return SuccessResponse(
        success=True,
        message=f"Heart deducted. {hearts.count} remaining.",
        data={"hearts_remaining": hearts.count},
    )


@router.post("/refill-hearts", response_model=SuccessResponse)
def refill_hearts(payload: WrongAnswerPayload, db: Session = Depends(get_db)):
    """Refill hearts to max (mocked — costs gems in real Duolingo)."""
    hearts = db.query(Hearts).filter_by(user_id=payload.user_id).first()
    if not hearts:
        raise HTTPException(status_code=404, detail="Hearts record not found")

    hearts.count = hearts.max_hearts
    hearts.last_refill_at = datetime.now(timezone.utc)
    db.commit()

    return SuccessResponse(
        success=True,
        message="Hearts refilled!",
        data={"hearts": hearts.count},
    )
