import json
from typing import Dict, List, Optional, Any
from sqlalchemy import select, delete
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.services.db_service import DBService
from app.modules.profile.models.models import UserProfile
from app.modules.auth.managers.user_manager import UserManager
from .base_profile_manager import BaseProfileManager
from fastapi import HTTPException, status


class ProfileServiceError(Exception):
    """Custom exception."""
    def __init__(self, message: str):
        super().__init__(message)
        self.message = message


# ---------------- Utility ----------------

def safe_get(profile_data: dict, key: str, default):
    return profile_data.get(key) if key in profile_data else default


# ---------------- Single-Table JSON Service ----------------
class StudentProfileService(BaseProfileManager):
    """Profile service using single-table JSON based UserProfile."""

    def __init__(self, user_manager: UserManager):
        self.user_manager = user_manager
        self.session: AsyncSession = user_manager.session
        self.db_service = DBService(UserProfile, self.session)

    # ---------------- VALIDATE USER ----------------
    async def _validate_user(self, user_id: int):
        user = await self.user_manager.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with id {user_id} not found",
            )
        return user

    # ---------------- GET BASIC INFO (same endpoint compatibility) ----------------
    async def get_basic_info(self, user_id: int):
        result = await self.session.execute(
            select(UserProfile).where(UserProfile.user_id == user_id)
        )
        profile = result.scalars().first()
        if not profile:
            return None
        return profile.profile_data.get("basicInfo")

    # ---------------- CREATE PROFILE ----------------
    async def create_profile(self, profile_data: Dict[str, Any]) -> UserProfile:
        try:
            user_id = profile_data.get("basicInfo", {}).get("user_id")
            if not user_id:
                raise HTTPException(status_code=400, detail="Missing user_id in basicInfo")

            await self._validate_user(user_id)

            async with self.session.begin():
                # store entire payload as JSON
                normalized = {
                    "basicInfo": profile_data.get("basicInfo", {}),
                    "jobPreference": profile_data.get("jobPreference", {}),
                    "workExperience": profile_data.get("workExperience", []),
                    "education": profile_data.get("education", []),
                    "skillsResume": profile_data.get("skillsResume", {
                        "id": None,
                        "resume_skills": [],
                        "resume_file": ""
                    }),
                    "certifications": profile_data.get("certifications", []),
                    "projects": profile_data.get("projects", []),
                }

                profile = UserProfile(user_id=user_id, profile_data=normalized)
                self.session.add(profile)

                await self.session.flush()
                await self.session.refresh(profile)
                return profile

        except SQLAlchemyError as e:
            await self.session.rollback()
            raise ProfileServiceError(f"Error creating profile: {str(e)}")

    # ---------------- GET PROFILE ----------------
    async def get_profile(self, user_id: int) -> Optional[Dict[str, Any]]:
        try:
            await self._validate_user(user_id)

            result = await self.session.execute(
                select(UserProfile).where(UserProfile.user_id == user_id)
            )
            profile = result.scalars().first()
            if not profile:
                return None

            return await self._serialize(profile)

        except SQLAlchemyError as e:
            raise ProfileServiceError(f"Error fetching profile: {str(e)}")

    # ---------------- LIST PROFILES ----------------
    async def list_profiles(self) -> List[Dict[str, Any]]:
        try:
            result = await self.session.execute(select(UserProfile))
            profiles = result.scalars().all()
            return [await self._serialize(p) for p in profiles]
        except SQLAlchemyError as e:
            raise ProfileServiceError(f"Error listing profiles: {str(e)}")

    # ---------------- UPDATE PROFILE ----------------
    async def update_profile(self, user_id: int, profile_data: Dict[str, Any]) -> Optional[UserProfile]:
        try:
            await self._validate_user(user_id)

            async with self.session.begin():
                db_result = await self.session.execute(
                    select(UserProfile).where(UserProfile.user_id == user_id)
                )
                profile = db_result.scalars().first()
                if not profile:
                    return None

                data = profile.profile_data

                # Option A: Replace only the provided sections
                for key, value in profile_data.items():
                    # For nested objects, update fields but NOT delete missing ones
                    if isinstance(value, dict) and isinstance(data.get(key), dict):
                        data[key].update(value)
                    else:
                        # Lists or primitives are fully replaced
                        data[key] = value

                profile.profile_data = data

                await self.session.flush()
                await self.session.refresh(profile)
                return profile

        except SQLAlchemyError as e:
            await self.session.rollback()
            raise ProfileServiceError(f"Error updating profile: {str(e)}")

    # ---------------- DELETE PROFILE ----------------
    async def delete_profile(self, user_id: int) -> bool:
        try:
            await self._validate_user(user_id)

            async with self.session.begin():
                result = await self.session.execute(
                    select(UserProfile).where(UserProfile.user_id == user_id)
                )
                profile = result.scalars().first()
                if not profile:
                    return False
                await self.session.delete(profile)
                return True

        except SQLAlchemyError as e:
            await self.session.rollback()
            raise ProfileServiceError(f"Error deleting profile: {str(e)}")

    # ---------------- SERIALIZE (same structure as old system) ----------------
    async def _serialize(self, profile: UserProfile) -> Dict[str, Any]:
        data = profile.profile_data

        return {
            "basicInfo": data.get("basicInfo", {}),
            "jobPreference": data.get("jobPreference", {}),
            "workExperience": data.get("workExperience", []),
            "education": data.get("education", []),
            "skillsResume": {
                "id": data.get("skillsResume", {}).get("id"),
                "resume_skills": data.get("skillsResume", {}).get("resume_skills", []),
                "resume_file": data.get("skillsResume", {}).get("resume_file", ""),
            },
            "certifications": data.get("certifications", []),
            "projects": data.get("projects", []),
        }

