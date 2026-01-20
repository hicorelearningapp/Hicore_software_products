# app/database/base.py
from abc import ABC, abstractmethod
from typing import Dict, Any


class BaseRepository(ABC):
    """Abstract interface for all database sources."""

    @abstractmethod
    def get_homepage(self) -> Dict[str, Any]:
        pass

    @abstractmethod
    def get_exam_file(self, exam_id: str, filename: str) -> Dict[str, Any]:
        pass
