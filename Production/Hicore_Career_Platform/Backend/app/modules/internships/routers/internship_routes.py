from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    Form,
    HTTPException,
)
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.responses import JSONResponse
import json

from app.modules.internships.schemas.internship_schema import InternshipResponse
from app.modules.internships.services.internship_service import InternshipService
from app.modules.auth.managers.user_manager import UserManager
from app.core.database.config import get_db

router = APIRouter(prefix="/internships", tags=["Internships"])


# ============================================================
# ✅ Dependency: UserManager (shared session)
# ============================================================
async def get_user_manager(session: AsyncSession = Depends(get_db)):
    """
    Provides a shared UserManager instance using the async DB session.
    """
    manager = UserManager()
    manager.session = session
    return manager


# ============================================================
# 🟢 CREATE INTERNSHIP
# ============================================================
@router.post("", response_model=InternshipResponse, status_code=201)
async def create_internship(
    internship_data: str = Form(...),
    company_logo: Optional[UploadFile] = File(None),
    user_manager: UserManager = Depends(get_user_manager),
):
    """
    ➕ Create a new internship posting.
    - `internship_data`: JSON string of internship fields (must include user_id)
    - `company_logo`: Optional company logo upload
    """
    try:
        internship_dict = json.loads(internship_data)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON for internship_data")

    service = InternshipService(user_manager)
    return await service.create_internship(internship_dict, company_logo)


# ============================================================
# 📋 LIST INTERNSHIPS
# ============================================================
@router.get("", response_model=List[InternshipResponse])
async def list_internships(user_manager: UserManager = Depends(get_user_manager)):
    """
    📄 Fetch all internship postings.
    """
    service = InternshipService(user_manager)
    return await service.list_internships()


# ============================================================
# 🔍 GET SINGLE INTERNSHIP
# ============================================================
@router.get("/{internship_id}", response_model=InternshipResponse)
async def get_internship(internship_id: int, user_manager: UserManager = Depends(get_user_manager)):
    """
    🔍 Fetch a single internship posting by ID.
    """
    service = InternshipService(user_manager)
    return await service.get_internship(internship_id)


# ============================================================
# ✏️ UPDATE INTERNSHIP
# ============================================================
@router.patch("/{internship_id}", response_model=InternshipResponse)
async def update_internship(
    internship_id: int,
    internship_data: str = Form(...),
    company_logo: Optional[UploadFile] = File(None),
    user_manager: UserManager = Depends(get_user_manager),
):
    """
    ✏️ Update an internship posting.
    - Accepts partial updates.
    - Can upload a new logo or modify existing fields.
    """
    try:
        internship_dict = json.loads(internship_data)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON for internship_data")

    service = InternshipService(user_manager)
    return await service.update_internship(internship_id, internship_dict, company_logo)


# ============================================================
# 🗑️ DELETE INTERNSHIP
# ============================================================
@router.delete("/{internship_id}", status_code=200)
async def delete_internship(internship_id: int, user_manager: UserManager = Depends(get_user_manager)):
    """
    ❌ Delete an internship posting by ID.
    """
    service = InternshipService(user_manager)
    result = await service.delete_internship(internship_id)
    return JSONResponse(content=result)
