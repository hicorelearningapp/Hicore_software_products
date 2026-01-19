# app/modules/mentor/routers/admin_router.py

from fastapi import APIRouter, HTTPException
from app.modules.mentor_json.services.admin_mentor_service import AdminMentorService

router = APIRouter(prefix="/admin/mentor", tags=["Admin - Mentor - Json"])


# APPROVE MENTOR
@router.patch("/approves/{user_id}")
async def approve_mentor(user_id: int):
    try:
        mentor = await AdminMentorService.approve_mentor(user_id)
        return {
            "message": "Mentor approved and slots generated",
            "user_id": mentor["user_id"]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# REJECT MENTOR
@router.patch("/rejects/{user_id}")
async def reject_mentor(user_id: int):
    try:
        mentor = await AdminMentorService.reject_mentor(user_id)
        return {
            "message": "Mentor rejected",
            "user_id": mentor["user_id"]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# LIST PENDING
@router.get("/pendings")
async def list_pending_mentors():
    try:
        mentors = await AdminMentorService.list_pending()
        return mentors
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
