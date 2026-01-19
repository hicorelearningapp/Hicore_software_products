from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database.config import get_db
from ..schemas.mentor_schemas import (
    CreateRequestIn, SimpleResponse, AcceptResponse,
    NewRequestOut, ActiveMenteeOut
)
from ..services.mentor_service import MentorService

router = APIRouter(prefix="/api", tags=["Mentor Assignment"])


@router.post("/student/request", response_model=SimpleResponse)
async def create_request(payload: CreateRequestIn, db: AsyncSession = Depends(get_db)):
    await MentorService.create_request(payload, db)
    return SimpleResponse(status="success", message="Request submitted")


@router.get("/mentor/{mentor_id}/new-requests", response_model=list[NewRequestOut])
async def new_requests(mentor_id: int, db: AsyncSession = Depends(get_db)):
    return await MentorService.get_new_requests(mentor_id, db)


@router.post("/mentor/{mentor_id}/accept/{request_id}", response_model=AcceptResponse)
async def accept_request(mentor_id: int, request_id: int, db: AsyncSession = Depends(get_db)):
    req = await MentorService.accept_request(mentor_id, request_id, db)
    return AcceptResponse(
        status="success",
        message="Request accepted",
        request_id=req.id,
        student_id=req.student_id,
        mentor_id=req.mentor_id,
        project_id=req.project_id,
        project_type=req.project_type,
        request_status=req.status.value
    )


@router.post("/mentor/{mentor_id}/reject/{request_id}")
async def reject_for_mentor_route(mentor_id: int, request_id: int, db: AsyncSession = Depends(get_db)):
    await MentorService.reject_for_mentor(mentor_id, request_id, db)
    return {
        "status": "success",
        "message": "Request hidden only for this mentor"
    }


@router.get("/mentor/{mentor_id}/active-mentees", response_model=list[ActiveMenteeOut])
async def active_mentees(mentor_id: int, db: AsyncSession = Depends(get_db)):
    return await MentorService.get_active_mentees(mentor_id, db)



@router.get("/mentor/{mentor_id}/ongoing-projects")
async def ongoing_projects(mentor_id: int, db: AsyncSession = Depends(get_db)):
    return await MentorService.get_ongoing_projects(mentor_id, db)


@router.get("/mentor/{mentor_id}/approved-projects")
async def approved_projects(mentor_id: int, db: AsyncSession = Depends(get_db)):
    return await MentorService.get_approved_projects(mentor_id, db)


@router.get("/mentor/{mentor_id}/rejected-projects")
async def rejected_projects(mentor_id: int, db: AsyncSession = Depends(get_db)):
    return await MentorService.get_rejected_projects(mentor_id, db)


@router.get("/mentor/{mentor_id}/completed-projects")
async def completed_projects(mentor_id: int, db: AsyncSession = Depends(get_db)):
    return await MentorService.get_completed_projects(mentor_id, db)


@router.get("/mentor/requests/all")
async def all_requests(db: AsyncSession = Depends(get_db)):
    return await MentorService.get_all_requests(db)


@router.get("/mentor/request/{request_id}")
async def get_request_by_id(request_id: int, db: AsyncSession = Depends(get_db)):
    return await MentorService.get_request_by_id(request_id, db)


@router.put("/mentor/request/{request_id}")
async def update_request(request_id: int, data: dict, db: AsyncSession = Depends(get_db)):
    return await MentorService.update_request(request_id, data, db)


@router.delete("/mentor/request/{request_id}")
async def delete_request(request_id: int, db: AsyncSession = Depends(get_db)):
    return await MentorService.delete_request(request_id, db)


@router.post("/student/{student_id}/cancel/{request_id}")
async def student_cancel_request(student_id: int, request_id: int, db: AsyncSession = Depends(get_db)):
    return await MentorService.cancel_request(student_id, request_id, db)


@router.post("/mentor/{mentor_id}/completed/{request_id}")
async def mark_completed(mentor_id: int, request_id: int, db: AsyncSession = Depends(get_db)):
    return await MentorService.mark_completed(mentor_id, request_id, db)
