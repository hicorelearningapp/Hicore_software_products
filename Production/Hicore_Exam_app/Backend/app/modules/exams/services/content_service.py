from pathlib import Path
from typing import Dict, Any, Callable, Optional
import os
import time
import logging

from app.database.local_json import LocalJSONRepository
from app.database.base import BaseRepository

from ..managers.image_manager import ImageManager
from ..managers.exam_manager import ExamManager

logger = logging.getLogger(__name__)


class ContentService:

    def __init__(
        self,
        repo: BaseRepository | None = None,
        data_root: str | None = None,
        cache_ttl_seconds: int = 60,
    ):
        # default: app/data
        data_root = data_root or str(Path(__file__).parent.parent / "data")
        os.makedirs(data_root, exist_ok=True)

        self.repo = repo or LocalJSONRepository(data_root)
        self.exams = ExamManager(self.repo)

        # simple in-memory cache
        self._cache: Dict[str, Dict[str, Any]] = {}
        self.cache_ttl = cache_ttl_seconds

    # ------------- cache helpers ------------- #

    def _cache_get(self, key: str) -> Optional[Any]:
        item = self._cache.get(key)
        if not item:
            return None

        if item["expires"] < time.time():
            self._cache.pop(key, None)
            logger.debug("ContentService cache expired: %s", key)
            return None

        logger.debug("ContentService cache hit: %s", key)
        return item["data"]

    def _cache_set(self, key: str, value: Any):
        self._cache[key] = {
            "data": value,
            "expires": time.time() + self.cache_ttl,
        }

    def _with_cache(self, key: str, loader: Callable[[], Any]):
        cached = self._cache_get(key)
        if cached is not None:
            return cached

        data = loader()
        self._cache_set(key, data)
        return data

    # ------------- HOMEPAGE ------------- #

    def get_homepage(self) -> Dict[str, Any]:
        return self._with_cache(
            "homepage",
            lambda: {
                "tabs": ImageManager.HOMEPAGE,
                "data": self.repo.get_homepage(),
            },
        )

    # ------------- EXAMS ------------- #

    def get_exam_detail(self, exam_id: str):
        return {
            "images": ImageManager.EXAM_DETAIL,
            "data": self.exams.get_detail(exam_id),
        }

    def get_roadmap(self, exam_id: str):
        return self._with_cache(
            f"roadmap:{exam_id}",
            lambda: {
                "images": ImageManager.ROADMAP,
                "data": self.exams.get_file(exam_id, "overview.json"),
            },
        )

    def get_learn(self, exam_id: str):
        return self._with_cache(
            f"learn:{exam_id}",
            lambda: {
                "images": ImageManager.LEARN,
                "data": self.exams.get_file(exam_id, "learn.json"),
            },
        )

    def get_practice(self, exam_id: str):
        return self._with_cache(
            f"practice:{exam_id}",
            lambda: {
                "images": ImageManager.PRACTICE,
                "data": self.exams.get_file(exam_id, "practice.json"),
            },
        )

    def get_test(self, exam_id: str):
        return self._with_cache(
            f"test:{exam_id}",
            lambda: {
                "images": ImageManager.TEST,
                "data": self.exams.get_file(exam_id, "test.json"),
            },
        )

    def get_revision(self, exam_id: str):
        return self._with_cache(
            f"revision:{exam_id}",
            lambda: {
                "data": self.exams.get_file(exam_id, "revision.json"),
            },
        )

    def get_all_courses(self) -> Dict[str, list[str]]:
        return self._with_cache(
            "courses",
            lambda: {"courses": self.repo.get_general_courses()},
        )
