from abc import ABC, abstractmethod
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any, List, Optional

class BaseProfileManager(ABC):
    @abstractmethod
    async def create_profile(self, db: AsyncSession, profile_data: Dict[str, Any]) -> Any:
        pass

    @abstractmethod
    async def get_profile(self, db: AsyncSession, user_id: int) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    async def list_profiles(self, db: AsyncSession) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    async def update_profile(self, db: AsyncSession, user_id: int, profile_data: Dict[str, Any]) -> Any:
        pass

    @abstractmethod
    async def delete_profile(self, db: AsyncSession, user_id: int) -> bool:
        pass
