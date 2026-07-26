"""
User router — profile, streak, hearts, achievements, and testable streak controls.
"""
from datetime import date, timedelta
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload

from app.database import get_db
from app.models import User, Streak, Hearts, Achievement
from app.schemas import UserOut, StreakOut, HeartsOut, AchievementOut, SuccessResponse

router = APIRouter(prefix="/api/user", tags=["user"])


def _evaluate_streak_break(db: Session, streak: Streak):
    """If user missed a day (last activity > 1 day ago), break current streak to 0."""
    if not streak or not streak.last_activity_date:
        return
    today = date.today()
    if (today - streak.last_activity_date).days > 1:
        streak.current_streak = 0
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
