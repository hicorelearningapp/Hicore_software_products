import json
from app.core.logger import logger
from datetime import datetime
from typing import Dict, Any, Optional
from fastapi import HTTPException, UploadFile
from pydantic import HttpUrl

from app.core.utils.file_manager import save_upload_file
from app.modules.jobs.schemas.job_schema import JobCreate, JobResponse
from app.modules.auth.managers.user_manager import UserManager
from app.modules.jobs.managers.job_manager import JobManager

class JobService:
    """Handles all business logic for Job management (CRUD)."""

    def __init__(self, user_manager: UserManager):
        self.user_manager = user_manager
        self.manager = JobManager(user_manager)
        self.session = user_manager.session

    # ======================================================
    # 🟢 CREATE JOB
    # ======================================================
    async def create_job(self, data: dict, logo_file: Optional[UploadFile] = None):
        data = self._normalize_data(data)

        # ✅ Validate employer (user_id)
        user_id = data.get("user_id")
        if not user_id:
            raise HTTPException(status_code=400, detail="user_id is required to create job")

        user = await self.user_manager.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail=f"User with id {user_id} not found")

        # ✅ Validate Pydantic schema
        try:
            job_in = JobCreate(**data)
        except Exception as e:
            raise HTTPException(status_code=422, detail=str(e))

        # ✅ Save logo file (if provided)
        if logo_file:
            try:
                logo_path = await save_upload_file(
                    logo_file, folder="company_logos", prefix=f"user_{user_id}"
                )
                job_in.company_logo = logo_path
            except Exception as e:
                logger.error(f"❌ Error saving logo: {e}")
                raise HTTPException(status_code=500, detail="Error saving logo file")

        cleaned_data = self._prepare_for_db(job_in.dict(exclude_none=True))
        obj = await self.manager.create(cleaned_data)
        return JobResponse.model_validate(obj.as_dict())

    # ======================================================
    # 📘 GET ONE JOB
    # ======================================================
    async def get_job(self, job_id: int):
        obj = await self.manager.get(job_id)
        if not obj:
            raise HTTPException(status_code=404, detail="Job not found")
        return JobResponse.model_validate(obj.as_dict())

    # ======================================================
    # 📋 LIST JOBS
    # ======================================================
    async def list_jobs(self):
        objs = await self.manager.list(skip=0, limit=None)
        if not objs:
            return []
        return [JobResponse.model_validate(o.as_dict()) for o in objs]

    # ======================================================
    # ♻️ UPDATE JOB
    # ======================================================
    async def update_job(self, job_id: int, data: Dict[str, Any], file: Optional[UploadFile] = None):
        data = self._normalize_data(data)

        # ✅ Validate user existence before update
        user_id = data.get("user_id")
        if user_id:
            user = await self.user_manager.get_user_by_id(user_id)
            if not user:
                raise HTTPException(status_code=404, detail=f"User with id {user_id} not found")

        # ✅ Save new logo if provided
        if file:
            try:
                logo_path = await save_upload_file(
                    file, folder="company_logos", prefix=f"updated_{user_id or 'job'}"
                )
                data["company_logo"] = logo_path
            except Exception as e:
                logger.error(f"❌ Error saving updated logo: {e}")
                raise HTTPException(status_code=500, detail="Error saving updated logo")

        cleaned_data = self._prepare_for_db(data)
        obj = await self.manager.update(job_id, cleaned_data)

        if not obj:
            raise HTTPException(status_code=404, detail="Job not found")

        return JobResponse.model_validate(obj.as_dict())

    # ======================================================
    # 🗑️ DELETE JOB
    # ======================================================
    async def delete_job(self, job_id: int):
        result = await self.manager.delete(job_id)
        if result.get("status") == "not_found":
            raise HTTPException(status_code=404, detail="Job not found")
        return {"message": "Job deleted successfully", "id": result["id"]}

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
        """Convert lists and URLs to DB-safe formats."""
        list_fields = [
            "key_responsibilities",
            "must_have_skills",
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
