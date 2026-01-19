import os
import logging
from pathlib import Path
from fastapi import UploadFile
import aiofiles
from datetime import datetime
from typing import Optional

# -------------------------------------------------------------------
# 🔧 Logger Setup
# -------------------------------------------------------------------
logger = logging.getLogger(__name__)

# -------------------------------------------------------------------
# 📁 Global Upload Directory
# -------------------------------------------------------------------
# All files (from any module) will be stored inside: app/uploads/
BASE_UPLOAD_DIR = Path(__file__).resolve().parents[2] / "uploads"
BASE_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

logger.info(f"[FileHandler] BASE_UPLOAD_DIR set to: {BASE_UPLOAD_DIR}")


# -------------------------------------------------------------------
# 💾 Async File Save Function
# -------------------------------------------------------------------
async def save_upload_file(file: UploadFile, folder: str, prefix: Optional[str] = None) -> str:
    """
    Save an UploadFile asynchronously to disk and return a clean relative path.

    Args:
        file (UploadFile): File uploaded via FastAPI.
        folder (str): Subfolder under /uploads (e.g., 'profile', 'resume').
        prefix (Optional[str]): Optional prefix for filename (e.g., user_id, module_name).

    Returns:
        str: POSIX-style relative path (e.g., 'uploads/profile/1234_20251028_resume.pdf')
    """
    try:
        # Sanitize and prepare folder
        folder = folder.strip("/\\")
        folder_path = BASE_UPLOAD_DIR / folder
        folder_path.mkdir(parents=True, exist_ok=True)

        # Construct a unique filename
        original_name = (file.filename or "file").replace(" ", "_")
        timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S%f")
        filename = f"{prefix}_{timestamp}_{original_name}" if prefix else f"{timestamp}_{original_name}"
        file_path = folder_path / filename

        logger.info(f"[FileHandler] Saving file: {original_name}")
        logger.info(f"[FileHandler] Target path: {file_path}")

        # Async write chunks
        async with aiofiles.open(file_path, "wb") as out_file:
            while chunk := await file.read(8192):
                await out_file.write(chunk)

        # Return POSIX-style relative path (for DB)
        relative_path = file_path.relative_to(BASE_UPLOAD_DIR.parent).as_posix()

        logger.info(f"[FileHandler] ✅ File saved successfully at: {file_path}")
        logger.info(f"[FileHandler] Returning relative path: {relative_path}")

        return relative_path

    except Exception as e:
        logger.error(f"[FileHandler] ❌ Failed to save file '{getattr(file, 'filename', 'unknown')}' in '{folder}': {e}")
        raise RuntimeError(f"Failed to save file '{getattr(file, 'filename', 'unknown')}' in '{folder}': {e}")


# -------------------------------------------------------------------
# 🌐 Optional Helper: File URL
# -------------------------------------------------------------------
def get_file_url(relative_path: str, base_url: str = "http://localhost:8000") -> str:
    """
    Generate a full public URL for the uploaded file.
    Example: http://localhost:8000/uploads/profile/1234_photo.png
    """
    return f"{base_url}/{relative_path}"
