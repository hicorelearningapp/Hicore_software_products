from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.week_exams.models.result_schema import ExamResultCreate
from app.modules.week_exams.services.exam_service import exam_service
from app.modules.week_exams.services.result_service import result_service
from app.core.database.config import get_db

router = APIRouter(prefix="/exam", tags=["Student Exam"])


@router.get("/active")
async def active_exams(
    db: AsyncSession = Depends(get_db)
):
    return await exam_service.get_active_exams(db)


@router.get("/{exam_id}")
async def start_exam(
    exam_id: str,
    db: AsyncSession = Depends(get_db)
):

    exam = await exam_service.get_exam(exam_id, db)

    if not exam:
        raise HTTPException(404, "Exam not found")

    if exam.status != "active":
        raise HTTPException(403, "Exam not active")

    # hide answers
    qs = []
    for q in exam.questions:
        q.pop("answer", None)
        q.pop("explanation", None)
        qs.append(q)

    exam.questions = qs
    return exam

@router.post("/submit-result")
async def submit_result(
    payload: ExamResultCreate,
    db: AsyncSession = Depends(get_db)
):
    return await result_service.submit_result(payload, db)


# ---------------- LEADERBOARD ---------------- #

@router.get("/leaderboard/{exam_type}/{exam_id}")
async def leaderboard(
    exam_type: str,
    exam_id: str,
    db: AsyncSession = Depends(get_db)
):
    return await result_service.leaderboard(
        exam_type,
        exam_id,
        db
    )