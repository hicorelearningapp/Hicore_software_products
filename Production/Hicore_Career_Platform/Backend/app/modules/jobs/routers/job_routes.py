from fastapi import (APIRouter,Depends,UploadFile,File,Form,HTTPException)
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.responses import JSONResponse
import json
from app.modules.jobs.schemas.job_schema import JobResponse
from app.modules.jobs.services.job_service import JobService
from app.modules.auth.managers.user_manager import UserManager
from app.core.database.config import get_db

router = APIRouter(prefix="/jobs", tags=["Jobs"])


# ============================================================
# ✅ Dependency: UserManager with shared DB session
# ============================================================
async def get_user_manager(session: AsyncSession = Depends(get_db)):
    """
    Provides a shared UserManager instance using the active async DB session.
    """
    manager = UserManager()
    manager.session = session
    return manager


# ============================================================
# ✅ Create Job (POST)
# ============================================================
@router.post("", response_model=JobResponse, status_code=201)
async def create_job(
    job_data: str = Form(...),
    company_logo: Optional[UploadFile] = File(None),
    user_manager: UserManager = Depends(get_user_manager),
):
    """
    ➕ Create a new job posting.
    - `job_data`: JSON string of job fields (must include user_id)
    - `company_logo`: Optional company logo file
    """
    try:
        job_dict = json.loads(job_data)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON for job_data")

    service = JobService(user_manager)
    return await service.create_job(job_dict, company_logo)


# ============================================================
# ✅ List All Jobs (GET)
# ============================================================
@router.get("", response_model=List[JobResponse])
async def list_jobs(user_manager: UserManager = Depends(get_user_manager)):
    """
    📄 Fetch all job postings.
    """
    service = JobService(user_manager)
    jobs = await service.list_jobs()
    return jobs


# ============================================================
# ✅ Get Single Job (GET)
# ============================================================
@router.get("/{job_id}", response_model=JobResponse)
async def get_job(job_id: int, user_manager: UserManager = Depends(get_user_manager)):
    """
    🔍 Fetch a single job posting by ID.
    """
    service = JobService(user_manager)
    return await service.get_job(job_id)


# ============================================================
# ✅ Update Job (PATCH)
# ============================================================
@router.patch("/{job_id}", response_model=JobResponse)
async def update_job(
    job_id: int,
    job_data: str = Form(...),
    company_logo: Optional[UploadFile] = File(None),
    user_manager: UserManager = Depends(get_user_manager),
):
    """
    ✏️ Update an existing job posting.
    - Can modify text fields and/or upload a new company logo.
    - Must include `user_id` for validation if updating owner info.
    """
    try:
        job_dict = json.loads(job_data)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON for job_data")

    service = JobService(user_manager)
    return await service.update_job(job_id, job_dict, company_logo)


# ============================================================
# ✅ Delete Job (DELETE)
# ============================================================
@router.delete("/{job_id}", status_code=200)
async def delete_job(job_id: int, user_manager: UserManager = Depends(get_user_manager)):
    """
    ❌ Delete a job posting by its ID.
    """
    service = JobService(user_manager)
    result = await service.delete_job(job_id)
    return JSONResponse(content=result)
