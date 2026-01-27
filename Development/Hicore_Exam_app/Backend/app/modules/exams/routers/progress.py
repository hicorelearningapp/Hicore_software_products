from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.database.local_json import LocalJSONRepository
from ..services.content_service import ContentService
from ..services.progress_service import ProgressService

router = APIRouter(prefix="/progress", tags=["Progress"])


# ---------- DEPENDENCY ---------- #

def get_progress_service():
    repo = LocalJSONRepository("app/data")
    content_service = ContentService(repo=repo)
    return ProgressService(repo, content_service)


# ---------- SCHEMA ---------- #

class ProgressUpdateRequest(BaseModel):
    userId: str
    examId: str
    unitName: str
    topicName: str
    status: str  # completed | ongoing


# ---------- ROUTES ---------- #

@router.post("/")
def update_progress(
    payload: ProgressUpdateRequest,
    service: ProgressService = Depends(get_progress_service)
):
    return service.update_progress(
        user_id=payload.userId,
        exam_id=payload.examId,
        unit_name=payload.unitName,
        topic=payload.topicName,
        status=payload.status
    )


@router.get("/{user_id}/{exam_id}")
def get_progress(
    user_id: str,
    exam_id: str,
    service: ProgressService = Depends(get_progress_service)
):
    return service.get_progress(user_id, exam_id)
