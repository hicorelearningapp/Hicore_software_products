from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.week_exams.services.exam_service import exam_service
from app.modules.week_exams.models.exam_models import ExamCreate
from app.core.database.config import get_db

router = APIRouter(prefix="/admin/exam", tags=["Admin Exam"])


@router.post("/create")
async def create_exam(
    payload: ExamCreate,
    db: AsyncSession = Depends(get_db)
):
    return await exam_service.create_exam(payload, db)


@router.get("/all")
async def list_exams(db: AsyncSession = Depends(get_db)):
    return await exam_service.get_all_exams(db)


@router.put("/{exam_id}/status/{status}")
async def update_status(
    exam_id: str,
    status: str,
    db: AsyncSession = Depends(get_db)
):

    allowed = ["active", "inactive", "completed"]
    if status not in allowed:
        raise HTTPException(400, "Invalid status")

    exam = await exam_service.update_status(
        exam_id, status, db
    )

    if not exam:
        raise HTTPException(404, "Exam not found")

    return exam
