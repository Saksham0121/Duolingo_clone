"""
User router — profile, streak, hearts, achievements.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload

from app.database import get_db
from app.models import User, Streak, Hearts, Achievement
from app.schemas import UserOut, StreakOut, HeartsOut, AchievementOut
from typing import List

router = APIRouter(prefix="/api/user", tags=["user"])


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
    return user


@router.get("/{user_id}/streak", response_model=StreakOut)
def get_streak(user_id: int, db: Session = Depends(get_db)):
    streak = db.query(Streak).filter_by(user_id=user_id).first()
    if not streak:
        raise HTTPException(status_code=404, detail="Streak not found")
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
