from typing import AsyncGenerator, Type, Any, Optional
from contextlib import asynccontextmanager
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import DeclarativeMeta

from app.core.database.config import async_session, async_engine
from app.core.managers.sql_manager import SQLManager


class DBService:
    def __init__(self, model: Type[DeclarativeMeta], session: Optional[AsyncSession] = None):
        """
        DBService can work with:
        - a provided AsyncSession (shared session from a manager)
        - or its own internally created session (via async_session)
        """
        self.model = model
        self._external_session = session  # store shared session if provided

    async def init_models(self):
        """Create the table for this model (if not already created)."""
        async with async_engine.begin() as conn:
            await conn.run_sync(self.model.metadata.create_all)

    @asynccontextmanager
    async def get_manager(self) -> AsyncGenerator[SQLManager, None]:
        """
        Context manager that yields an SQLManager with proper session handling.

        - Uses shared session if provided.
        - Otherwise, creates and manages its own session lifecycle.
        """
        if self._external_session is not None:
            # Use shared session (e.g., injected from UserManager)
            manager = SQLManager(self._external_session, self.model)
            yield manager
        else:
            # Create independent session
            async with async_session() as session:
                manager = SQLManager(session, self.model)
                try:
                    yield manager
                    await session.commit()
                except Exception:
                    await session.rollback()
                    raise
                finally:
                    await session.close()

    @classmethod
    def dependency(cls, model: Type[Any]):
        """Factory to create FastAPI dependency for any model."""
        async def _get_manager() -> AsyncGenerator[SQLManager, None]:
            service = cls(model)
            async with service.get_manager() as manager:
                yield manager
        return _get_manager
