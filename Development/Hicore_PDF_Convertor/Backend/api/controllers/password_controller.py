from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import FileResponse
from starlette.background import BackgroundTask
from pydantic import BaseModel, ValidationError
import mimetypes
import os

from core.logger import setup_logger
from app_manager import AppManager
from api.utils.file_utils import save_upload_file

logger = setup_logger(__name__)

router = APIRouter()

class PasswordRequestModel(BaseModel):
    action: str
    password: str


import json
from typing import Optional

# ... (imports)

@router.post("/password")
async def manage_password(
    action: str = Form(...),
    file: UploadFile = File(...),
    password: Optional[str] = Form(None),
    settings: Optional[str] = Form(None),
):
    """Manage PDF password protection (add or remove password)"""
    try:
        # Parse settings if available
        settings_dict = {}
        if settings:
            try:
                settings_dict = json.loads(settings)
            except json.JSONDecodeError:
                pass

        # Extract password from settings if not directly provided
        if not password and settings_dict.get("password"):
            password = settings_dict.get("password")

        # Initial validation using Pydantic (allow None for now, strict check later)
        if action == "add_password" and not password:
             raise HTTPException(400, "Validation error: Password is required for 'add_password' action")

        try:
            # We can skip Pydantic model strict check for now or update it
            pass 
        except ValidationError as ve:
             raise HTTPException(400, f"Validation error: {ve}")

        logger.info(f"🔒 Password request: action={action}")

        # 1️⃣ Validate action BEFORE doing anything else
        if action not in ["add_password", "remove_password"]:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid password action: {action}. Use 'add_password' or 'remove_password'"
            )

        # 2️⃣ Save uploaded file
        saved_path = save_upload_file(file)

        # 3️⃣ Run password operation
        app = AppManager()
        
        # Remove 'password' from settings_dict to avoid duplicate kwarg error
        if "password" in settings_dict:
            del settings_dict["password"]
            
        output_file = app.password(action, saved_path, password=password, **settings_dict)

        # 4️⃣ Validate output file exists
        if not output_file or not os.path.exists(output_file):
            logger.error(f"Password operation produced no output: {output_file}")
            raise HTTPException(
                status_code=500,
                detail="Password operation failed - no output generated"
            )

        # 5️⃣ Determine MIME type
        mime_type, _ = mimetypes.guess_type(output_file)
        if not mime_type:
            mime_type = "application/pdf"
        
        filename = os.path.basename(output_file)
        
        logger.info(f"✅ Password operation complete: {filename}")
        
        # 6️⃣ Cleanup function for uploaded file
        def cleanup():
            try:
                if os.path.exists(saved_path):
                    os.remove(saved_path)
                    logger.info(f"🧹 Cleaned up temp file: {saved_path}")
            except Exception as e:
                logger.error(f"Cleanup error: {e}")
        
        # 7️⃣ Return file with cleanup task
        return FileResponse(
            path=output_file,
            media_type=mime_type,
            filename=filename,
            headers={"Content-Disposition": f"attachment; filename={filename}"},
            background=BackgroundTask(cleanup)
        )
        
    except HTTPException:
        raise  # ✅ Re-raise HTTPExceptions without modification
    except Exception as e:
        logger.error(f"❌ Password endpoint error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))