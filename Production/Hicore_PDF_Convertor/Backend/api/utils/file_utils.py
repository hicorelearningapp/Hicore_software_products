import os
import uuid
from fastapi import UploadFile

BASE_UPLOAD_DIR = os.path.join(os.getcwd(), "temp_uploads")
os.makedirs(BASE_UPLOAD_DIR, exist_ok=True)


def save_upload_file(upload_file: UploadFile, session_id: str | None = None) -> str:
    """Save an UploadFile to disk under temp_uploads/<session_id>/ and return the path.

    Args:
        upload_file: FastAPI UploadFile object
        session_id: optional session id to group files

    Returns:
        absolute path to saved file
    """
    sid = session_id or str(uuid.uuid4())
    dest_dir = os.path.join(BASE_UPLOAD_DIR, sid)
    os.makedirs(dest_dir, exist_ok=True)

    filename = upload_file.filename or f"upload_{uuid.uuid4()}"
    destination = os.path.join(dest_dir, filename)

    with open(destination, "wb") as f:
        while True:
            chunk = upload_file.file.read(1024 * 64)
            if not chunk:
                break
            f.write(chunk)

    return os.path.abspath(destination)
