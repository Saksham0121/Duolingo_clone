"""
Course router — returns course list and the full unit+skill tree
with user progress embedded.
"""
import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload

from app.database import get_db
from app.models import Course, Unit, Skill, UserProgress, Lesson
from app.schemas import CourseOut, CourseWithUnits, UnitOut, SkillWithProgress, LessonOut

router = APIRouter(prefix="/api/courses", tags=["courses"])

DEFAULT_USER_ID = 1  # simplified auth: always user 1


def _skill_with_progress(skill: Skill, progress_map: dict, prev_completed: bool, is_first: bool) -> SkillWithProgress:
    """
    Build a SkillWithProgress from an ORM Skill + the user progress map.
    Lock/unlock logic: a skill is available if the previous skill is complete
    OR it's the very first skill.
    """
    prog = progress_map.get(skill.id)
    lessons_out = [LessonOut.model_validate(l) for l in skill.lessons]

    if prog:
        is_locked = False if (is_first or prev_completed) else True
        return SkillWithProgress(
            **SkillWithProgress.model_validate(skill).model_dump(exclude={"xp_earned", "completed_lessons", "crowns", "completed", "is_locked", "lessons"}),
            xp_earned=prog.xp_earned,
            completed_lessons=prog.completed_lessons,
            crowns=prog.crowns,
            completed=prog.completed,
            is_locked=is_locked,
            lessons=lessons_out,
        )
    else:
        return SkillWithProgress(
            **SkillWithProgress.model_validate(skill).model_dump(exclude={"xp_earned", "completed_lessons", "crowns", "completed", "is_locked", "lessons"}),
            xp_earned=0,
            completed_lessons=0,
            crowns=0,
            completed=False,
            is_locked=not (is_first or prev_completed),
            lessons=lessons_out,
        )


@router.get("/", response_model=List[CourseOut])
def list_courses(db: Session = Depends(get_db)):
    """Return all available courses."""
    return db.query(Course).all()


@router.get("/{course_id}/units", response_model=CourseWithUnits)
def get_course_with_units(course_id: int, user_id: int = DEFAULT_USER_ID, db: Session = Depends(get_db)):
    """
    Return full unit → skill tree for a course, with user progress embedded.
    Accepts optional ?user_id= query param (defaults to 1).
    """
    course = (
        db.query(Course)
        .options(
            selectinload(Course.units)
            .selectinload(Unit.skills)
            .selectinload(Skill.lessons)
        )
        .filter(Course.id == course_id)
        .first()
    )
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    # Build a skill_id → UserProgress lookup for this user
    progress_records = db.query(UserProgress).filter(UserProgress.user_id == user_id).all()
    progress_map = {p.skill_id: p for p in progress_records}

    units_out = []
    for unit in course.units:
        skills_out = []
        prev_completed = True  # first skill in a unit is always unlocked
        for i, skill in enumerate(unit.skills):
            sp = _skill_with_progress(skill, progress_map, prev_completed, i == 0)
            prev_completed = sp.completed
            skills_out.append(sp)

        units_out.append(UnitOut(
            id=unit.id,
            title=unit.title,
            description=unit.description,
            order_index=unit.order_index,
            color_hex=unit.color_hex,
            skills=skills_out,
        ))

    return CourseWithUnits(
        id=course.id,
        name=course.name,
        flag_emoji=course.flag_emoji,
        description=course.description,
        units=units_out,
    )
