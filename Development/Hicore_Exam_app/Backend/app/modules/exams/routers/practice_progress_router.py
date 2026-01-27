from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.database.local_json import LocalJSONRepository
from ..services.content_service import ContentService
from ..services.practice_progress_service import PracticeProgressService

router = APIRouter(
    prefix="/practice-progress",
    tags=["Practice Progress"]
)

# ---------- DEPENDENCY ---------- #

def get_service():
    repo = LocalJSONRepository("app/data")
    content = ContentService(repo=repo)
    return PracticeProgressService(repo, content)

# ---------- SCHEMA ---------- #

class PracticeUpdateRequest(BaseModel):
    userId: str
    examId: str
    unitName: str
    setName: str
    questionId: int
    status: str   # completed | ongoing

# ---------- ROUTES ---------- #

@router.post("/")
def update_practice_progress(
    payload: PracticeUpdateRequest,
    service: PracticeProgressService = Depends(get_service)
):
    return service.update_progress(
        user_id=payload.userId,
        exam_id=payload.examId,
        unit_name=payload.unitName,
        set_name=payload.setName,
        question_id=payload.questionId,
        status=payload.status
    )

@router.get("/{user_id}/{exam_id}")
def get_practice_progress(
    user_id: str,
    exam_id: str,
    service: PracticeProgressService = Depends(get_service)
):
    return service.get_progress(user_id, exam_id)
