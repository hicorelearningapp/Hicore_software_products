import json
import os
from pathlib import Path
from filelock import FileLock


class JSONStore:
    """Universal JSON storage handler with full safety."""

    def __init__(self, file_path, default):
        self.file_path = Path(file_path)
        self.default = default

        # Ensure directory exists
        self.file_path.parent.mkdir(parents=True, exist_ok=True)

        # Ensure file exists
        if not self.file_path.exists():
            self._write_atomic(self.default)

    # ---------------------------------------
    # Public API — Load JSON
    # ---------------------------------------
    def load(self):
        lock = FileLock(str(self.file_path) + ".lock", timeout=10)
        with lock:
            try:
                with open(self.file_path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except json.JSONDecodeError:
                # backup corrupted file
                backup = str(self.file_path) + ".corrupted"
                os.rename(self.file_path, backup)

                # restore new empty file
                self._write_atomic(self.default)
                return self.default

    # ---------------------------------------
    # Public API — Save JSON
    # ---------------------------------------
    def save(self, data):
        lock = FileLock(str(self.file_path) + ".lock", timeout=10)
        with lock:
            self._write_atomic(data)

    # ---------------------------------------
    # Internal — safe atomic write
    # ---------------------------------------
    def _write_atomic(self, data):
        temp_path = str(self.file_path) + ".tmp"

        # Write to temp file
        with open(temp_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4)

        # Replace old file atomically
        os.replace(temp_path, self.file_path)
