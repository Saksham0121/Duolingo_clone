"""
Lessons router — returns exercises for a given lesson.
Audio: audio_url is passed through; frontend uses Web Speech API (de-DE) as primary TTS.
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload

from app.database import get_db
from app.models import Lesson, Exercise
from app.schemas import LessonWithExercises, ExerciseOut

router = APIRouter(prefix="/api/lessons", tags=["lessons"])


def _exercise_to_out(ex: Exercise) -> ExerciseOut:
    return ExerciseOut(
        id=ex.id,
        type=ex.type,
        prompt=ex.prompt,
        correct_answer=ex.correct_answer,
        options=ex.options,
        word_bank=ex.word_bank,
        pairs=ex.pairs,
        audio_url=ex.audio_url,
        order_index=ex.order_index,
    )


@router.get("/{lesson_id}/exercises", response_model=LessonWithExercises)
def get_lesson_exercises(lesson_id: int, db: Session = Depends(get_db)):
    """Return a lesson with all its exercises, ordered by order_index."""
    lesson = (
        db.query(Lesson)
        .options(selectinload(Lesson.exercises))
        .filter(Lesson.id == lesson_id)
        .first()
    )
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    exercises_sorted = sorted(lesson.exercises, key=lambda e: e.order_index)
    return LessonWithExercises(
        id=lesson.id,
        skill_id=lesson.skill_id,
        title=lesson.title,
        order_index=lesson.order_index,
        exercises=[_exercise_to_out(e) for e in exercises_sorted],
    )
