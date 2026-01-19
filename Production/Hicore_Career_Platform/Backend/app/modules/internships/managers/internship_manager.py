from app.core.logger import logger
from app.core.managers.sql_manager import SQLManager
from app.modules.internships.models.internship_model import InternshipPosting
from app.modules.auth.managers.user_manager import UserManager

class InternshipManager:
    """
    Manager for InternshipPosting model.
    Uses SQLManager for CRUD and shares DB session via UserManager.
    """

    def __init__(self, user_manager: UserManager):
        self.user_manager = user_manager
        self.session = user_manager.session
        self.sql = SQLManager(self.session, InternshipPosting)

    # ======================================================
    # 🟢 CREATE
    # ======================================================
    async def create(self, data):
        try:
            obj = await self.sql.create(data)
            await self.session.commit()
            logger.info(f"[CREATE] Internship created successfully: {obj.id}")
            return obj
        except Exception as e:
            await self.session.rollback()
            logger.exception(f"[CREATE] Internship creation failed: {e}")
            raise

    # ======================================================
    # 🔍 GET ONE
    # ======================================================
    async def get(self, internship_id: int):
        try:
            obj = await self.sql.read_one(internship_id)
            return obj
        except Exception as e:
            logger.exception(f"[GET] Failed to fetch Internship {internship_id}: {e}")
            raise

    # ======================================================
    # 📋 LIST ALL
    # ======================================================
    async def list(self, skip: int = 0, limit: int = None):
        try:
            if limit is None:
                result = await self.sql.read_all()
            else:
                result = await self.sql.read_all_paginated(skip=skip, limit=limit)
            logger.info(f"[LIST] Retrieved {len(result)} internship(s)")
            return result
        except Exception as e:
            logger.exception(f"[LIST] Failed to fetch internships: {e}")
            raise

    # ======================================================
    # ♻️ UPDATE
    # ======================================================
    async def update(self, internship_id: int, data):
        try:
            obj = await self.sql.update(internship_id, data)
            await self.session.commit()
            if obj:
                logger.info(f"[UPDATE] Internship {internship_id} updated successfully")
            else:
                logger.warning(f"[UPDATE] Internship {internship_id} not found")
            return obj
        except Exception as e:
            await self.session.rollback()
            logger.exception(f"[UPDATE] Failed for Internship {internship_id}: {e}")
            raise

    # ======================================================
    # 🗑️ DELETE
    # ======================================================
    async def delete(self, internship_id: int):
        try:
            result = await self.sql.delete(internship_id)
            await self.session.commit()
            logger.info(f"[DELETE] Internship {internship_id} delete status: {result}")
            return result
        except Exception as e:
            await self.session.rollback()
            logger.exception(f"[DELETE] Failed for Internship {internship_id}: {e}")
            raise

