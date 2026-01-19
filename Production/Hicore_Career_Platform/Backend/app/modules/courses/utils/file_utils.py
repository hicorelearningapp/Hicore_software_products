import os
from pathlib import Path
from fastapi import UploadFile
from uuid import uuid4

# Define your base uploads directory (matches main.py)
PROJECT_ROOT = Path(__file__).resolve().parents[3]  # -> points to AI_career_platform_application
PROFILE_UPLOADS_DIR = PROJECT_ROOT / "app" / "modules" / "profile" / "uploads"

def save_file(file: UploadFile, folder: str) -> str:
    if not file:
        return None

    # ✅ Ensure base upload directory exists
    os.makedirs(PROFILE_UPLOADS_DIR / folder, exist_ok=True)

    # Extract file extension
    ext = os.path.splitext(file.filename)[1]
    unique_name = f"{uuid4().hex}{ext}"

    # ✅ Absolute path to save
    file_path = PROFILE_UPLOADS_DIR / folder / unique_name

    # Save file
    with open(file_path, "wb") as f:
        f.write(file.file.read())

    # ✅ Return relative path for URL access
    return f"/uploads/{folder}/{unique_name}"
