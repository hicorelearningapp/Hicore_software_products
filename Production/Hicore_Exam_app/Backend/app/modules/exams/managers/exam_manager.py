from pathlib import Path
from typing import Dict, Any, Optional
import copy
import logging
import time

logger = logging.getLogger(__name__)


class ExamManager:
    """
    Service responsible for retrieving exam data with overrides, caching,
    and safe merge behavior.
    """

    def __init__(self, repo, cache_ttl_seconds: int = 60):
        self.repo = repo
        self.root = Path(repo.data_root)

        # in-memory cache { cache_key: { "data": obj, "expires": ts } }
        self._cache: Dict[str, Dict[str, Any]] = {}
        self.cache_ttl = cache_ttl_seconds

    # ----------------- internal helpers ---------------- #

    def _cache_get(self, key: str) -> Optional[Dict[str, Any]]:
        item = self._cache.get(key)
        if not item:
            return None

        if item["expires"] < time.time():
            logger.debug("Cache expired: %s", key)
            self._cache.pop(key, None)
            return None

        logger.debug("Cache hit: %s", key)
        return item["data"]

    def _cache_set(self, key: str, value: Dict[str, Any]):
        self._cache[key] = {
            "data": value,
            "expires": time.time() + self.cache_ttl,
        }
        logger.debug("Cache stored: %s", key)

    def _read(self, path: Path) -> Dict[str, Any]:
        if not path.exists():
            return {}
        return self.repo._read_json(path)

    def _merge(self, base: Dict[str, Any], overrides: Dict[str, Any]) -> Dict[str, Any]:
        """
        Deep-merge with custom merge rules.
        """
        result = copy.deepcopy(base)

        for key, value in overrides.items():
            # custom merge behavior
            if key == "infoBox" and isinstance(result.get("infoBox"), dict):
                result["infoBox"].update(value)
            else:
                result[key] = value

        return result

    # ----------------- public API ---------------- #

    def get_detail(self, exam_id: str) -> Dict[str, Any]:
        """
        Return merged exam detail: base + override.
        Cached for performance.
        """

        cache_key = f"detail:{exam_id}"
        cached = self._cache_get(cache_key)
        if cached:
            return cached

        base_path = self.root / "examDetail.json"
        override_path = self.root / "general" / exam_id / "examDetail.json"

        base = self._read(base_path)
        override = self._read(override_path)

        if not base and not override:
            logger.warning("Exam not found: %s", exam_id)
            raise FileNotFoundError(f"Exam '{exam_id}' does not exist")

        merged = self._merge(base, override)
        self._cache_set(cache_key, merged)

        return merged

    def get_file(self, exam_id: str, filename: str):
        """
        Fetch a supporting file safely through repository.
        """
        return self.repo.get_exam_file(exam_id, filename)
