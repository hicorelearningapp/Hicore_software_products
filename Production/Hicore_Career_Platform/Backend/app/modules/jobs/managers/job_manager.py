from app.core.logger import logger
from app.core.managers.sql_manager import SQLManager
from app.modules.jobs.models.job_model import JobPosting
from app.modules.auth.managers.user_manager import UserManager

class JobManager:
    """
    Manager layer for JobPosting operations.
    Interacts with SQLManager to perform CRUD.
    """

    def __init__(self, user_manager: UserManager):
        self.user_manager = user_manager
        self.session = user_manager.session
        self.sql = SQLManager(self.session, JobPosting)

    # ---------------------------------------------------
    # 🟢 CREATE
    # ---------------------------------------------------
    async def create(self, data: dict):
        try:
            obj = await self.sql.create(data)
            await self.session.commit()
            logger.info(f"[CREATE] Job created successfully: {obj.id}")
            return obj
        except Exception as e:
            logger.exception(f"[CREATE] Job creation failed: {e}")
            await self.session.rollback()
            raise

    # ---------------------------------------------------
    # 🟡 READ (Single)
    # ---------------------------------------------------
    async def get(self, job_id: int):
        try:
            obj = await self.sql.get_by_id(job_id)
            return obj
        except Exception as e:
            logger.exception(f"[GET] Failed to fetch Job {job_id}: {e}")
            raise

    # ---------------------------------------------------
    # 📋 LIST
    # ---------------------------------------------------
    async def list(self, skip: int = 0, limit: int = None):
        try:
            if limit is None:
                result = await self.sql.read_all()
            else:
                result = await self.sql.read_all_paginated(skip=skip, limit=limit)
            logger.info(f"[LIST] Retrieved {len(result)} job(s)")
            return result
        except Exception as e:
            logger.exception(f"[LIST] Failed to fetch jobs: {e}")
            raise

    # ---------------------------------------------------
    # ♻️ UPDATE
    # ---------------------------------------------------
    async def update(self, job_id: int, data: dict):
        try:
            obj = await self.sql.update(job_id, data)
            await self.session.commit()
            if obj:
                logger.info(f"[UPDATE] Job {job_id} updated successfully")
            else:
                logger.warning(f"[UPDATE] Job {job_id} not found")
            return obj
        except Exception as e:
            logger.exception(f"[UPDATE] Failed for Job {job_id}: {e}")
            await self.session.rollback()
            raise

    # ---------------------------------------------------
    # 🗑️ DELETE
    # ---------------------------------------------------
    async def delete(self, job_id: int):
        try:
            result = await self.sql.delete(job_id)
            await self.session.commit()
            logger.info(f"[DELETE] Job {job_id} delete status: {result}")
            return result
        except Exception as e:
            logger.exception(f"[DELETE] Failed for Job {job_id}: {e}")
            await self.session.rollback()
            raise
