from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from pydantic import BaseModel
from pathlib import Path
import logging

from app.modules.exams.services.analyzer_service import AnalyzerService

logger = logging.getLogger(__name__)

DATA_ROOT = str(Path(__file__).parent.parent / "data")
service = AnalyzerService(DATA_ROOT)

router = APIRouter(prefix="/analyzer", tags=["Analyzer"])

class UnitTestRequest(BaseModel):
    user_id: int
    exam_id: str
    subject_name: str
    unit_name: str
    total_questions: int
    attempted: int
    correct: int
    wrong: int
    timeTakenSeconds: int


# ---------- CREATE ----------
@router.post("/unit")
async def save_unit_result(req: UnitTestRequest) -> Dict[str, Any]:
    try:
        return service.save_unit_result(req.dict())
    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Missing field: {str(e)}")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.exception("Unexpected error saving unit result")
        raise HTTPException(status_code=500, detail="Unexpected error occurred")


# ---------- READ ----------
@router.get("/unit/{user_id}")
async def get_user_all(user_id: int):
    try:
        return service.get_user_all(user_id)
    except Exception:
        logger.exception("Error reading user analyzer data")
        raise HTTPException(status_code=500, detail="Unable to load data")


@router.get("/unit/{user_id}/{exam_id}")
async def get_by_exam(user_id: int, exam_id: str, limit: int = 10):
    try:
        return service.get_by_exam(user_id, exam_id, limit)
    except Exception:
        logger.exception("Error reading exam analyzer data")
        raise HTTPException(status_code=500, detail="Unable to load exam data")


@router.get("/unit/{user_id}/{exam_id}/{subject}")
async def get_by_exam_subject(user_id: int, exam_id: str, subject: str):
    try:
        return service.get_by_exam_subject(user_id, exam_id, subject)
    except Exception:
        logger.exception("Error reading subject analyzer data")
        raise HTTPException(status_code=500, detail="Unable to load subject data")


# ---------- DELETE ----------
@router.delete("/unit/{user_id}/{exam_id}/{subject}/{index}")
async def delete_record(user_id: int, exam_id: str, subject: str, index: int):
    try:
        ok = service.delete_record(user_id, exam_id, subject, index)
        if not ok:
            raise HTTPException(status_code=404, detail="Record not found")
        return {"deleted": True}
    except HTTPException:
        raise
    except Exception:
        logger.exception("Error deleting analyzer record")
        raise HTTPException(status_code=500, detail="Unable to delete record")


@router.delete("/unit/{user_id}/{exam_id}")
async def delete_exam(user_id: int, exam_id: str):
    try:
        ok = service.delete_exam(user_id, exam_id)
        if not ok:
            raise HTTPException(status_code=404, detail="Exam data not found")
        return {"deleted": True}
    except HTTPException:
        raise
    except Exception:
        logger.exception("Error deleting exam analyzer data")
        raise HTTPException(status_code=500, detail="Unable to delete exam data")


@router.delete("/unit/{user_id}")
async def clear_user(user_id: int):
    try:
        service.clear_user(user_id)
        return {"deleted": True}
    except Exception:
        logger.exception("Error clearing analyzer user data")
        raise HTTPException(status_code=500, detail="Unable to clear user data")
