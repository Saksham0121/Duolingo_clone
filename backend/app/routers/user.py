"""
User router — profile, streak, hearts, achievements, and testable controls.
"""
from datetime import date, datetime, timezone, timedelta
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload

from app.database import get_db
from app.models import User, Streak, Hearts, Achievement
from app.schemas import UserOut, StreakOut, HeartsOut, AchievementOut, SuccessResponse

router = APIRouter(prefix="/api/user", tags=["user"])

REGEN_INTERVAL_SECONDS = 600  # 10 minutes per heart refill


def _evaluate_streak_break(db: Session, streak: Streak):
    """If user missed a day (last activity > 1 day ago), break current streak to 0."""
    if not streak or not streak.last_activity_date:
        return
    today = date.today()
    if (today - streak.last_activity_date).days > 1:
        streak.current_streak = 0
        db.commit()


def _evaluate_heart_regeneration(db: Session, hearts: Hearts):
    """Automatically refill 1 heart point for every 10 minutes elapsed."""
    if not hearts or hearts.count >= hearts.max_hearts:
        return

    now = datetime.now(timezone.utc)
    last_refill = hearts.last_refill_at

    if last_refill is None:
        hearts.last_refill_at = now
        db.commit()
        return

    if last_refill.tzinfo is None:
        last_refill = last_refill.replace(tzinfo=timezone.utc)

    elapsed_seconds = (now - last_refill).total_seconds()
    if elapsed_seconds >= REGEN_INTERVAL_SECONDS:
        hearts_to_add = int(elapsed_seconds // REGEN_INTERVAL_SECONDS)
        new_count = min(hearts.max_hearts, hearts.count + hearts_to_add)
        hearts.count = new_count

        if new_count >= hearts.max_hearts:
            hearts.last_refill_at = now
        else:
            hearts.last_refill_at = last_refill + timedelta(seconds=hearts_to_add * REGEN_INTERVAL_SECONDS)

        db.commit()


@router.get("/{user_id}", response_model=UserOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    """Full user profile with streak, hearts, and achievements."""
    user = (
        db.query(User)
        .options(
            selectinload(User.streak),
            selectinload(User.hearts),
            selectinload(User.achievements),
        )
        .filter(User.id == user_id)
        .first()
    )
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.streak:
        _evaluate_streak_break(db, user.streak)
    if user.hearts:
        _evaluate_heart_regeneration(db, user.hearts)

    return user


@router.get("/{user_id}/streak", response_model=StreakOut)
def get_streak(user_id: int, db: Session = Depends(get_db)):
    streak = db.query(Streak).filter_by(user_id=user_id).first()
    if not streak:
        raise HTTPException(status_code=404, detail="Streak not found")
    _evaluate_streak_break(db, streak)
    return streak


@router.get("/{user_id}/hearts", response_model=HeartsOut)
def get_hearts(user_id: int, db: Session = Depends(get_db)):
    hearts = db.query(Hearts).filter_by(user_id=user_id).first()
    if not hearts:
        raise HTTPException(status_code=404, detail="Hearts not found")
    _evaluate_heart_regeneration(db, hearts)
    return hearts


@router.get("/{user_id}/achievements", response_model=List[AchievementOut])
def get_achievements(user_id: int, db: Session = Depends(get_db)):
    return db.query(Achievement).filter_by(user_id=user_id).all()


@router.post("/{user_id}/simulate-missed-day", response_model=SuccessResponse)
def simulate_missed_day(user_id: int, db: Session = Depends(get_db)):
    """Simulate missing a day — sets last_activity_date 2 days ago, breaking the streak to 0."""
    streak = db.query(Streak).filter_by(user_id=user_id).first()
    if not streak:
        raise HTTPException(status_code=404, detail="Streak not found")

    streak.last_activity_date = date.today() - timedelta(days=2)
    streak.current_streak = 0
    db.commit()

    return SuccessResponse(
        success=True,
        message="Simulated missed day: streak reset to 0",
        data={"current_streak": 0, "last_activity_date": str(streak.last_activity_date)},
    )
