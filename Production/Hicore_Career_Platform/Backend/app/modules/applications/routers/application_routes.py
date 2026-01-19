from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from app.modules.applications.schemas.application_schema import (
    ApplicationCreate,
    ApplicationResponse,
    EmailRequest,
)
from app.modules.applications.services.application_service import ApplicationService
from app.modules.auth.managers.user_manager import UserManager
from app.core.database.config import get_db

router = APIRouter(prefix="/applications", tags=["Applications"])


# ============================================================
# ✅ Shared Dependency — UserManager with Active Session
# ============================================================
async def get_user_manager(session=Depends(get_db)):
    manager = UserManager()
    manager.session = session
    return manager


# ============================================================
# 🟢 APPLY FOR JOB OR INTERNSHIP
# ============================================================
@router.post(
    "/apply",
    response_model=ApplicationResponse,
    status_code=status.HTTP_201_CREATED,
)
async def apply_job(
    payload: ApplicationCreate,
    user_manager: UserManager = Depends(get_user_manager)
):
    service = ApplicationService(user_manager)
    try:
        return await service.apply(payload)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to apply: {str(e)}")


# ============================================================
# 📋 LIST APPLICATIONS BY APPLIER (USER)
# ============================================================
@router.get(
    "/by-applyer/{applyer_id}",
    response_model=List[ApplicationResponse],
    status_code=status.HTTP_200_OK,
)
async def list_applications_by_applyer(
    applyer_id: int,
    user_manager: UserManager = Depends(get_user_manager)
):
    service = ApplicationService(user_manager)
    try:
        return await service.manager.read_all(filters={"applyer_id": applyer_id})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================
# 📋 LIST APPLICATIONS BY JOB OR INTERNSHIP
# ============================================================
@router.get(
    "/by-job/{job_id}",
    response_model=List[ApplicationResponse],
    status_code=status.HTTP_200_OK,
)
async def list_applications_by_job(
    job_id: int,
    user_manager: UserManager = Depends(get_user_manager)
):
    service = ApplicationService(user_manager)
    try:
        return await service.manager.read_all(filters={"job_id": job_id})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================
# 🔄 UPDATE APPLICATION STAGE (with email notification)
# ============================================================
@router.put(
    "/update-stage/{application_id}",
    response_model=ApplicationResponse,
    status_code=status.HTTP_200_OK,
)
async def update_application_stage(
    application_id: int,
    new_stage: str,
    user_manager: UserManager = Depends(get_user_manager),
):
    service = ApplicationService(user_manager)
    try:
        return await service.update_stage(application_id, new_stage)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================
# 🔴 REVOKE (DELETE) APPLICATION
# ============================================================
@router.delete(
    "/revoke/{application_id}",
    status_code=status.HTTP_200_OK,
)
async def revoke_application(
    application_id: int,
    user_manager: UserManager = Depends(get_user_manager)
):
    service = ApplicationService(user_manager)
    try:
        application = await service.manager.get_by_id(application_id)
        if not application:
            raise HTTPException(status_code=404, detail="Application not found")

        await user_manager.session.delete(application)
        await user_manager.session.commit()

        return {"status": "success", "message": f"Application {application_id} revoked successfully"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================
# ✉️ SEND CUSTOM EMAIL MESSAGE TO APPLICANT
# ============================================================
@router.post("/notify", status_code=status.HTTP_200_OK)
async def notify_applicant(
    data: EmailRequest,
    user_manager: UserManager = Depends(get_user_manager)
):
    service = ApplicationService(user_manager)
    try:
        email = await service._get_email_by_user_id(data.user_id)
        if not email:
            raise HTTPException(status_code=404, detail="Applicant email not found")

        await service._send_email(email, data.subject, data.message)

        return {
            "status": "success",
            "email": email,
            "message": f"Email sent successfully to {email}",
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")


# ============================================================
# 📋 LIST APPLICATIONS BY POSTER (Jobs + Internships)
# ============================================================
@router.get(
    "/by-poster/{poster_user_id}",
    response_model=List[ApplicationResponse],
    status_code=status.HTTP_200_OK,
)
async def list_applications_by_poster(
    poster_user_id: int,
    user_manager: UserManager = Depends(get_user_manager),
):
    service = ApplicationService(user_manager)

    try:
        return await service.get_applications_by_poster(poster_user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================
# 📋 LIST ACTIVE / CLOSED APPLICATIONS BY POSTER
# ============================================================
@router.get(
    "/by-poster/{poster_user_id}/status/{status}",
    status_code=status.HTTP_200_OK,
)
async def list_applications_by_poster_and_status(
    poster_user_id: int,
    status: str,     # "active", "closed", or "all"
    user_manager: UserManager = Depends(get_user_manager),
):
    """
    Get all applications for postings created by the poster,
    filtered by application_deadline:
        - active: deadline >= now
        - closed: deadline < now
        - all: no filter
    """
    service = ApplicationService(user_manager)

    valid_status = {"active", "closed", "all"}
    if status.lower() not in valid_status:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Allowed: {valid_status}"
        )

    try:
        result = await service.get_applications_by_poster_with_deadline(
            poster_user_id=poster_user_id,
            status=status
        )

        # Convert ORM objects to serializable dicts
        # ----------------------------------------
        formatted = []
        for item in result:
            app = item["application"]
            posting = item["posting"]
            posting_status = item["posting_status"]

            formatted.append({
                "id": app.id,
                "applyer_id": app.applyer_id,
                "posting_type": app.posting_type,
                "job_id": app.job_id,
                "match": app.match,
                "stage": app.stage,
                "applied_at": app.applied_at,
                "updated_at": app.updated_at,
                # "posting": posting,
                "posting_status": posting_status
            })

        return formatted

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
