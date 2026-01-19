# app/modules/mentor/routers/mentor_router.py

from fastapi import APIRouter, HTTPException, Form, UploadFile, File
from pydantic import EmailStr, TypeAdapter

from app.modules.mentor_json.services.mentor_service import MentorService
from app.modules.mentor_json.schemas.mentor_schemas import (
    SlotBooking, MentorOut, SlotOut, SessionOut, SessionStatusUpdate
)

router = APIRouter(prefix="/mentor", tags=["Mentor-JSON"])


# ======================================================
# APPLY AS MENTOR
# ======================================================
@router.post("/apply")
async def apply_mentor(
    user_id: int = Form(...),
    first_name: str = Form(...),
    last_name: str = Form(...),
    email: str = Form(...),
    mobile: str = Form(...),
    professional_title: str = Form(...),
    experience_years: str = Form(...),
    company_name: str = Form(None),
    domain: str = Form(...),
    mentoring_formats: str = Form(...),
    available_time_slots: str = Form(...),
    professional_bio: str = Form(...),
    why_become_mentor: str = Form(...),
    linkedin: str = Form(None),
    portfolio: str = Form(None),
    github: str = Form(None),
    tags: str = Form(""),
    image: UploadFile = File(None),
):

    # Validate Email
    try:
        TypeAdapter(EmailStr).validate_python(email)
    except:
        raise HTTPException(status_code=400, detail="Invalid email format")

    payload = {
        "user_id": user_id,
        "first_name": first_name,
        "last_name": last_name,
        "email": email,
        "mobile": mobile,
        "professional_title": professional_title,
        "experience_years": experience_years,
        "company_name": company_name,
        "domain": domain,
        "mentoring_formats": mentoring_formats,
        "available_time_slots": available_time_slots,
        "professional_bio": professional_bio,
        "why_become_mentor": why_become_mentor,
        "linkedin": linkedin,
        "portfolio": portfolio,
        "github": github,
        "tags": tags
    }

    mentor = await MentorService.apply_mentor(payload, image)
    return {"message": "Mentor Submitted", "user_id": mentor["user_id"]}


# ======================================================
# LIST ACCEPTED MENTORS
# ======================================================
@router.get("/list")
async def list_accepted():
    return await MentorService.list_accepted()


# ======================================================
# GET MENTOR DETAILS
# ======================================================
@router.get("/mentor/{user_id}")
async def get_mentor(user_id: int):
    try:
        return await MentorService.get_mentor(user_id)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


# ======================================================
# AVAILABLE DATES
# ======================================================
@router.get("/{mentor_id}/available-dates")
async def available_dates(mentor_id: int):
    return await MentorService.available_dates(mentor_id)


# ======================================================
# SLOTS ON A SPECIFIC DATE
# ======================================================
@router.get("/{mentor_id}/slots/{date}")
async def slots_for_date(mentor_id: int, date: str):
    return await MentorService.slots_for_date(mentor_id, date)


# ======================================================
# BOOK SLOT -> CREATE SESSION
# ======================================================
@router.post("/slot/book")
async def book_slot(data: SlotBooking):
    try:
        return await MentorService.book_slot(data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ======================================================
# GET SESSIONS BY STATUS
# ======================================================
@router.get("/{mentor_id}/sessions/{status}")
async def get_sessions(mentor_id: int, status: str):
    return await MentorService.sessions_by_status(mentor_id, status)


# ======================================================
# UPDATE SESSION STATUS
# ======================================================
@router.patch("/session/{session_id}/status")
async def update_status(session_id: int, body: SessionStatusUpdate):
    try:
        return await MentorService.update_session_status(session_id, body.status)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ======================================================
# ACCEPT SESSION (SERVICE VERSION)
# ======================================================
@router.patch("/session/{session_id}/accept")
async def accept_session(session_id: int):
    try:
        return await MentorService.accept_session(session_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ======================================================
# REJECT SESSION
# ======================================================
@router.patch("/session/{session_id}/reject")
async def reject_session(session_id: int):
    try:
        return await MentorService.reject_session(session_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ======================================================
# REQUESTED SESSIONS ONLY
# ======================================================
@router.get("/{mentor_id}/sessions/requested")
async def requested_sessions(mentor_id: int):
    # Use MentorService instead of raw JSON access
    sessions = await MentorService.sessions_by_status(mentor_id, "requested")
    return sessions


# ======================================================
# DELETE MENTOR (SERVICE HANDLED)
# ======================================================
@router.delete("/delete/{mentor_id}")
async def delete_mentor(mentor_id: int):
    try:
        return await MentorService.delete_mentor(mentor_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
