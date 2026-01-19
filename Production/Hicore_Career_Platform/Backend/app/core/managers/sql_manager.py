import logging
from typing import Any, Dict, List, Optional, Type
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.managers.base_manager import BaseManager

logger = logging.getLogger(__name__)


class SQLManager(BaseManager):
    def __init__(self, session: AsyncSession, model: Type[Any]):
        self.session = session
        self.model = model

    # ==============================================================
    # ✅ CREATE
    # ==============================================================
    async def create(self, data: Dict[str, Any]):
        try:
            obj = self.model(**data)
            self.session.add(obj)
            await self.session.flush()
            await self.session.refresh(obj)
            return obj
        except SQLAlchemyError as e:
            await self.session.rollback()
            logger.exception(f"[CREATE] Error in {self.model.__name__}: {e}")
            raise

    # ==============================================================
    # ✅ READ ALL (with filters)
    # ==============================================================
    async def read_all(self, filters: Optional[Dict[str, Any]] = None) -> List[Any]:
        try:
            stmt = select(self.model)
            if filters:
                for key, value in filters.items():
                    if hasattr(self.model, key):
                        stmt = stmt.where(getattr(self.model, key) == value)
            result = await self.session.execute(stmt)
            return result.scalars().all()
        except SQLAlchemyError as e:
            logger.exception(f"[READ_ALL] Error in {self.model.__name__}: {e}")
            raise

    async def read_all_paginated(self, skip: int = 0, limit: int = 10) -> List[Any]:
        try:
            stmt = select(self.model).offset(skip).limit(limit)
            result = await self.session.execute(stmt)
            return result.scalars().all()
        except SQLAlchemyError as e:
            logger.exception(f"[READ_PAGINATED] Error in {self.model.__name__}: {e}")
            raise

    # ==============================================================
    # ✅ GET BY ID (new)
    # ==============================================================
    async def get_by_id(self, id: int) -> Optional[Any]:
        """Fetch a single record by its primary key ID."""
        try:
            obj = await self.session.get(self.model, id)
            if not obj:
                logger.info(f"[GET_BY_ID] {self.model.__name__} not found with id={id}")
                return None
            return obj
        except SQLAlchemyError as e:
            logger.exception(f"[GET_BY_ID] Error fetching {self.model.__name__} with id={id}: {e}")
            raise

    # ==============================================================
    # ✅ GET BY ATTRIBUTES
    # ==============================================================
    async def get_by_attrs(self, **attrs) -> Optional[Any]:
        """Fetch a single row by arbitrary attributes."""
        try:
            stmt = select(self.model)
            for key, value in attrs.items():
                if hasattr(self.model, key):
                    stmt = stmt.where(getattr(self.model, key) == value)
            result = await self.session.execute(stmt)
            return result.scalars().first()
        except SQLAlchemyError as e:
            logger.exception(f"[GET_BY_ATTRS] Error in {self.model.__name__} with filters {attrs}: {e}")
            raise

    # ==============================================================
    # ✅ UPDATE (by ID)
    # ==============================================================
    async def update(self, id: int, data: Dict[str, Any]) -> Optional[Any]:
        try:
            obj = await self.session.get(self.model, id)
            if not obj:
                return None
            for key, value in data.items():
                if hasattr(obj, key):
                    setattr(obj, key, value)
            await self.session.flush()
            await self.session.refresh(obj)
            return obj
        except SQLAlchemyError as e:
            await self.session.rollback()
            logger.exception(f"[UPDATE] Error updating {self.model.__name__} with id {id}: {e}")
            raise

    async def update_by_attrs(self, filters: dict, data: dict):
        record = await self.get_by_attrs(**filters)
        if not record:
            return None
        for key, value in data.items():
            setattr(record, key, value)
        await self.session.commit()
        await self.session.refresh(record)
        return record

    # ==============================================================
    # ✅ DELETE (by ID)
    # ==============================================================
    async def delete(self, id: int) -> Dict[str, Any]:
        try:
            obj = await self.session.get(self.model, id)
            if not obj:
                return {"status": "not_found", "id": id}
            await self.session.delete(obj)
            return {"status": "deleted", "id": id}
        except SQLAlchemyError as e:
            await self.session.rollback()
            logger.exception(f"[DELETE] Error deleting {self.model.__name__} with id {id}: {e}")
            raise


    # ==============================================================
    # ❌ DELETE BY ATTRIBUTES (NEW)
    # ==============================================================
    async def delete_by_attrs(self, **filters) -> Dict[str, Any]:
        """
        Delete a single row by matching attributes.
        Example: delete_by_attrs(course_id="DS-1M-COURSE-12345678")
        """
        try:
            # Fetch record
            record = await self.get_by_attrs(**filters)
            if not record:
                return {"status": "not_found", "filters": filters}

            await self.session.delete(record)
            await self.session.flush()

            return {"status": "deleted", "filters": filters}

        except SQLAlchemyError as e:
            await self.session.rollback()
            logger.exception(f"[DELETE_BY_ATTRS] Error deleting {self.model.__name__} using {filters}: {e}")
            raise

    # ==============================================================
    # ✅ READ ONE (Fix for BaseManager.read_one())
    # ==============================================================
    async def read_one(self, id: int) -> Optional[Any]:
        """Compatibility method for BaseManager.read_one()"""
        try:
            result = await self.session.execute(
                select(self.model).where(self.model.id == id)
            )
            return result.scalar_one_or_none()
        except SQLAlchemyError as e:
            logger.exception(f"[READ_ONE] Error in {self.model.__name__} id={id}: {e}")
            raise


