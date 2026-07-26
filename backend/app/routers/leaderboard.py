"""
Leaderboard router — weekly XP ranking across all users.
"""
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models import LeaderboardEntry, User
from app.schemas import LeaderboardEntryOut

router = APIRouter(prefix="/api/leaderboard", tags=["leaderboard"])

DEFAULT_USER_ID = 1


@router.get("/", response_model=List[LeaderboardEntryOut])
def get_leaderboard(user_id: int = DEFAULT_USER_ID, db: Session = Depends(get_db)):
    """
    Returns all leaderboard entries sorted by weekly_xp descending.
    Marks the requesting user's row with is_current_user=True.
    """
    entries = (
        db.query(LeaderboardEntry)
        .options(joinedload(LeaderboardEntry.user))
        .order_by(LeaderboardEntry.weekly_xp.desc())
        .all()
    )

    result = []
    for i, entry in enumerate(entries):
        result.append(LeaderboardEntryOut(
            rank=i + 1,
            username=entry.user.username,
            avatar_url=entry.user.avatar_url,
            weekly_xp=entry.weekly_xp,
            total_xp=entry.total_xp,
            league=entry.league,
            is_current_user=(entry.user_id == user_id),
        ))
    return result
