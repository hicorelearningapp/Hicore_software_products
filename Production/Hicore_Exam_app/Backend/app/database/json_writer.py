# app/database/json_writer.py
from pathlib import Path
import json
from typing import Dict, Any, Optional
import shutil
import tempfile
import logging

logger = logging.getLogger(__name__)


class LocalJSONWriter:
    """
    Low-level safe file writer for JSON + assets.
    Ensures:
      - no path traversal
      - atomic writes
      - consistent error handling
    """

    def __init__(self, data_root: str):
        self.data_root = Path(data_root).resolve()
        self.data_root.mkdir(parents=True, exist_ok=True)

    # ---------- internal helpers ---------- #

    def _resolve(self, relative_path: str) -> Path:
        """
        Safely resolve a path inside data_root.
        Prevents directory traversal and absolute injection.
        """
        target = (self.data_root / relative_path).resolve()

        if not str(target).startswith(str(self.data_root)):
            raise ValueError("Invalid or unsafe path")

        return target

    def _atomic_write(self, target: Path, writer):
        """
        Write using a temp file, then move — prevents partial writes.
        """
        target.parent.mkdir(parents=True, exist_ok=True)

        with tempfile.NamedTemporaryFile(
            "wb", delete=False, dir=target.parent
        ) as tmp:
            writer(tmp)
            temp_name = tmp.name

        Path(temp_name).replace(target)

    # ---------- JSON ---------- #

    def read_json(self, relative_path: str) -> Dict[str, Any]:
        target = self._resolve(relative_path)

        if not target.exists():
            raise FileNotFoundError(f"JSON file not found: {relative_path}")

        try:
            with target.open("r", encoding="utf-8") as f:
                return json.load(f)
        except json.JSONDecodeError:
            logger.error("Corrupted JSON: %s", relative_path)
            raise ValueError("Stored JSON is corrupted")

    def write_json(self, relative_path: str, data: Dict[str, Any]) -> None:
        target = self._resolve(relative_path)

        def writer(tmp):
            tmp.write(
                json.dumps(data, indent=2, ensure_ascii=False).encode("utf-8")
            )

        self._atomic_write(target, writer)

    def write_json_file(self, relative_path: str, file_obj) -> None:
        target = self._resolve(relative_path)

        def writer(tmp):
            shutil.copyfileobj(file_obj, tmp)

        self._atomic_write(target, writer)

    # ---------- DELETE ---------- #

    def delete_file(self, relative_path: str) -> None:
        target = self._resolve(relative_path)

        if not target.exists():
            raise FileNotFoundError(f"File not found: {relative_path}")

        target.unlink()

    # ---------- ASSETS ---------- #

    def write_asset(self, relative_path: str, file_obj) -> None:
        target = self._resolve(relative_path)

        def writer(tmp):
            shutil.copyfileobj(file_obj, tmp)

        self._atomic_write(target, writer)

    # ---------- COURSE FOLDERS ---------- #

    def create_course_folder(self, course_id: str) -> None:
        target = self._resolve(f"general/{course_id}")

        if target.exists():
            raise FileExistsError(f"Course already exists: {course_id}")

        target.mkdir(parents=True, exist_ok=False)

    def delete_course_folder(self, course_id: str) -> None:
        target = self._resolve(f"general/{course_id}")

        if not target.exists() or not target.is_dir():
            raise FileNotFoundError(f"Course not found: {course_id}")

        shutil.rmtree(target)
