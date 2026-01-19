import json
from app.core.logger import logger
from datetime import datetime
from fastapi import UploadFile, HTTPException
from typing import Dict, Any, Optional
from pydantic import HttpUrl

from app.core.utils.file_manager import save_upload_file
from app.modules.internships.schemas.internship_schema import InternshipCreate, InternshipResponse
from app.modules.auth.managers.user_manager import UserManager
from app.modules.internships.managers.internship_manager import InternshipManager

class InternshipService:
    """Handles business logic for internship management (CRUD)."""

    def __init__(self, user_manager: UserManager):
        self.user_manager = user_manager
        self.manager = InternshipManager(user_manager)
        self.session = user_manager.session

    # ======================================================
    # 🟢 CREATE INTERNSHIP
    # ======================================================
    async def create_internship(self, data: dict, logo_file: Optional[UploadFile] = None):
        data = self._normalize_data(data)

        # ✅ Validate user
        user_id = data.get("user_id")
        if not user_id:
            raise HTTPException(status_code=400, detail="user_id is required to create internship")

        user = await self.user_manager.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail=f"User with id {user_id} not found")

        # ✅ Validate input schema
        try:
            internship_in = InternshipCreate(**data)
        except Exception as e:
            raise HTTPException(status_code=422, detail=str(e))

        # ✅ Handle logo upload
        if logo_file:
            try:
                logo_path = await save_upload_file(
                    logo_file, folder="company_logos", prefix=f"user_{user_id}"
                )
                internship_in.company_logo = logo_path
            except Exception as e:
                logger.error(f"❌ Error saving company logo: {e}")
                raise HTTPException(status_code=500, detail="Error saving company logo")

        cleaned_data = self._prepare_for_db(internship_in.dict(exclude_none=True))
        obj = await self.manager.create(cleaned_data)
        return InternshipResponse.model_validate(obj.as_dict())

    # ======================================================
    # 📋 LIST ALL INTERNSHIPS
    # ======================================================
    async def list_internships(self):
        objs = await self.manager.list(skip=0, limit=None)
        if not objs:
            return []
        return [InternshipResponse.model_validate(o.as_dict()) for o in objs]

    # ======================================================
    # 🔍 GET INTERNSHIP BY ID
    # ======================================================
    async def get_internship(self, internship_id: int):
        obj = await self.manager.get(internship_id)
        if not obj:
            raise HTTPException(status_code=404, detail="Internship not found")
        return InternshipResponse.model_validate(obj.as_dict())

    # ======================================================
    # ♻️ UPDATE INTERNSHIP
    # ======================================================
    async def update_internship(self, internship_id: int, data: Dict[str, Any], file: Optional[UploadFile] = None):
        data = self._normalize_data(data)

        # ✅ Validate user if present
        user_id = data.get("user_id")
        if user_id:
            user = await self.user_manager.get_user_by_id(user_id)
            if not user:
                raise HTTPException(status_code=404, detail=f"User with id {user_id} not found")

        # ✅ Handle logo upload
        if file:
            try:
                logo_path = await save_upload_file(
                    file, folder="company_logos", prefix=f"updated_{user_id or 'internship'}"
                )
                data["company_logo"] = logo_path
            except Exception as e:
                logger.error(f"❌ Error saving updated logo: {e}")
                raise HTTPException(status_code=500, detail="Error saving updated logo")

        cleaned_data = self._prepare_for_db(data)
        obj = await self.manager.update(internship_id, cleaned_data)
        if not obj:
            raise HTTPException(status_code=404, detail="Internship not found")

        return InternshipResponse.model_validate(obj.as_dict())

    # ======================================================
    # 🗑️ DELETE INTERNSHIP
    # ======================================================
    async def delete_internship(self, internship_id: int):
        result = await self.manager.delete(internship_id)
        if result.get("status") == "not_found":
            raise HTTPException(status_code=404, detail="Internship not found")
        return {"message": "Internship deleted successfully", "id": result["id"]}

    # ======================================================
    # ⚙️ UTILITIES
    # ======================================================
    def _normalize_data(self, data: dict) -> dict:
        """Normalize ISO date strings."""
        if isinstance(data.get("application_deadline"), str):
            try:
                data["application_deadline"] = datetime.fromisoformat(
                    data["application_deadline"].replace("Z", "+00:00")
                )
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Invalid date format: {e}")
        return data

    def _prepare_for_db(self, data: dict) -> dict:
        """Prepare list, URL, and JSON-safe DB values."""
        list_fields = [
            "highlights",
            "required_skills",
            "preferred_skills",
            "what_we_offer",
            "benefits",
        ]
        for field in list_fields:
            if field in data:
                if isinstance(data[field], list):
                    data[field] = json.dumps(data[field])
                elif isinstance(data[field], str):
                    try:
                        json.loads(data[field])
                    except json.JSONDecodeError:
                        data[field] = json.dumps([data[field]])

        for field in ["company_website", "apply_link"]:
            value = data.get(field)
            if isinstance(value, HttpUrl):
                data[field] = str(value)

        return data
