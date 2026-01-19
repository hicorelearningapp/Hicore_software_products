from pathlib import Path
import json
from typing import Any, Dict, Optional, List


class LocalJSONRepository:
    """
    Read-only repository for structured JSON content.

    Guarantees:
    - Safe path resolution
    - Helpful errors for missing / corrupted files
    - Stable, defensive access
    """

    def __init__(self, data_root: Optional[str] = None):
        self.data_root = Path(data_root).resolve()
        self.data_root.mkdir(parents=True, exist_ok=True)

    # ---------- internal helpers ---------- #

    def _resolve(self, relative: Path) -> Path:
        """
        Prevent directory traversal and ensure file stays under data_root.
        """
        target = (self.data_root / relative).resolve()

        if not str(target).startswith(str(self.data_root)):
            raise ValueError("Unsafe path access detected")

        return target

    def _read_json(self, path: Path) -> Dict[str, Any]:
        path = self._resolve(path)

        if not path.exists():
            raise FileNotFoundError(f"JSON not found: {path.name}")

        try:
            with path.open("r", encoding="utf-8") as f:
                return json.load(f)
        except json.JSONDecodeError:
            raise ValueError(f"Corrupted JSON: {path.name}")

    # ---------- PUBLIC READ METHODS ---------- #

    def get_homepage(self) -> Dict[str, Any]:
        return self._read_json(Path("homepage.json"))

    def get_exam_file(self, exam_id: str, filename: str) -> Dict[str, Any]:
        return self._read_json(Path("general") / exam_id / filename)

    def get_course_ids(self) -> List[str]:
        return self.get_general_courses()

    def get_general_courses(self) -> List[str]:
        general_path = self._resolve(Path("general"))

        if not general_path.exists():
            return []

        return sorted(
            folder.name
            for folder in general_path.iterdir()
            if folder.is_dir()
        )
