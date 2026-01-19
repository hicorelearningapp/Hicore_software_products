import os
import json
import aiofiles
import aiofiles.os
from pathlib import Path
from fastapi import UploadFile
import logging

# ---------------- CONFIG ----------------
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
UPLOAD_DIR = BASE_DIR / "app" / "uploads" / "projects"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

FILE_TYPES = ["system_requirement", "srs", "design", "coding", "testing", "report"]

logger = logging.getLogger("project_file_service")
logging.basicConfig(level=logging.INFO)


# ---------------- FILE SERVICE ----------------
async def save_file(project_id: str, file_type: str, file: UploadFile) -> str:
    """Save a single uploaded file asynchronously."""
    folder = UPLOAD_DIR / project_id
    await aiofiles.os.makedirs(folder, exist_ok=True)
    ext = os.path.splitext(file.filename)[1]
    safe_filename = f"{file_type}_{project_id}{ext}"
    path = folder / safe_filename

    try:
        # Handle JSON files safely
        if file_type in FILE_TYPES and ext.lower() == ".json":
            content = await file.read()
            data = json.loads(content.decode("utf-8"))
            async with aiofiles.open(path, "w", encoding="utf-8") as f:
                await f.write(json.dumps(data, ensure_ascii=False, indent=2))
        else:
            async with aiofiles.open(path, "wb") as f:
                await f.write(await file.read())

        # ✅ Convert internal path → API-style public path
        relative_path = os.path.relpath(path, BASE_DIR)
        public_path = "/" + relative_path.replace("\\", "/")

        logger.info(f"[save_file] Saved {file_type}: {public_path}")
        return public_path

    except Exception as e:
        logger.error(f"[save_file] Error saving {file_type}: {e}")
        raise


async def save_all_files(project_id: str, files: dict):
    """Save all files in the dictionary asynchronously."""
    saved_paths = {}
    for file_type, file in files.items():
        if file:
            path = await save_file(project_id, file_type, file)
            saved_paths[file_type] = path
    return saved_paths


async def delete_project_folder(project_id: str):
    """Delete a project's entire upload folder asynchronously."""
    folder = UPLOAD_DIR / project_id
    if folder.exists():
        try:
            for f in folder.iterdir():
                await aiofiles.os.remove(f)
            await aiofiles.os.rmdir(folder)
            logger.info(f"[delete_project_folder] Deleted folder: {folder}")
        except Exception as e:
            logger.error(f"[delete_project_folder] Error deleting {folder}: {e}")
