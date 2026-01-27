from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any
import logging

from app.modules.exams.services.content_service import ContentService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/course", tags=["All Courses"])

service = ContentService()

# ---------- HELPERS ----------
def ok(data):
    return data


def safe_fetch(func):
    try:
        return ok(func())

    except FileNotFoundError:
        raise HTTPException(
            status_code=404,
            detail="Requested content not found",
        )

    except ValueError as e:
        raise HTTPException(
            status_code=422,
            detail=str(e),
        )

    except Exception:
        logger.exception("Unexpected content retrieval error")
        raise HTTPException(
            status_code=500,
            detail="Unable to load content"
        )


# ---------- ROUTES ----------

@router.get("/courses", summary="Get all courses")
async def get_all_courses() -> Dict[str, Any]:
    try:
        return ok(service.get_all_courses())
    except Exception:
        logger.exception("Failed to load course list")
        raise HTTPException(
            status_code=500,
            detail="Unable to load courses"
        )


@router.get("/{exam_id}", summary="Get exam detail")
async def get_exam_detail(exam_id: str) -> Dict[str, Any]:
    try:
        return ok(service.get_exam_detail(exam_id))

    except FileNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found",
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e),
        )

    except Exception:
        logger.exception("Unexpected error fetching exam detail")
        raise HTTPException(
            status_code=500,
            detail="Unable to fetch exam detail"
        )


@router.get("/{exam_id}/roadmap")
async def get_roadmap(exam_id: str):
    return safe_fetch(lambda: service.get_roadmap(exam_id))


@router.get("/{exam_id}/learn")
async def get_learn(exam_id: str):
    return safe_fetch(lambda: service.get_learn(exam_id))


@router.get("/{exam_id}/practice")
async def get_practice(exam_id: str):
    return safe_fetch(lambda: service.get_practice(exam_id))


@router.get("/{exam_id}/test")
async def get_test(exam_id: str):
    return safe_fetch(lambda: service.get_test(exam_id))


@router.get("/{exam_id}/revision")
async def get_revision(exam_id: str):
    return safe_fetch(lambda: service.get_revision(exam_id))


@router.get("/{exam_id}/reference")
async def get_reference(exam_id: str):
    return safe_fetch(lambda: service.get_reference(exam_id))
