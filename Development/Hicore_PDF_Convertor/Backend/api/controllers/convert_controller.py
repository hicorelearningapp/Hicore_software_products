from fastapi import APIRouter, UploadFile, File, HTTPException, Form, Request
from fastapi.responses import FileResponse
import mimetypes
import os
from pydantic import BaseModel, ValidationError
from typing import Optional

from core.logger import setup_logger
from app_manager import AppManager
from api.utils.file_utils import save_upload_file

logger = setup_logger(__name__)
router = APIRouter()

class ConvertRequestModel(BaseModel):
    action: str
    tool: Optional[str] = "convert"
    session_id: Optional[str] = None

# Map conversion actions to required file extensions
REQUIRED_EXTENSIONS = {
    "pdf_to_word": [".pdf"],
    "word_to_pdf": [".docx"],
    "pdf_to_excel": [".pdf"],
    "excel_to_pdf": [".xlsx"],
    "pdf_to_powerpoint": [".pdf"],
    "powerpoint_to_pdf": [".pptx"],
    "pdf_to_image": [".pdf"],
    "image_to_pdf": [".png", ".jpg", ".jpeg"],
    "merge_pdf": [".pdf"],
    "split_pdf": [".pdf"],
}

@router.post("/convert")
async def convert(
    request: Request,

    # ⭐ Added for Swagger UI (not used in logic)
    file: UploadFile = File(..., description="File to convert"),
    action: str = Form(..., description="Conversion action, e.g., pdf_to_word"),
    tool: str = Form("convert", description="Always 'convert'"),
    session_id: str = Form(None, description="Optional session ID"),
    page_format: str = Form("a4", description="For image_to_pdf: 'a4' (default, fits to A4 page) or 'original' (preserve image size)"),
):
    """
    Convert between document formats.
    Validates file type based on conversion action.
    """

    try:
        # ⭐ Manual extraction stays the same (overrides Swagger inputs)
        form = await request.form()

        # Log received fields
        form_keys = list(form.keys())
        logger.info(f"📋 Form keys received: {form_keys}")

        # Correct file extraction
        file = form.get("file") or (form.getlist("file")[0] if form.getlist("file") else None)
        tool = form.get("tool", "convert")
        action = form.get("action")
        session_id = form.get("session_id")

        logger.info(f"📥 Extracted: file={type(file).__name__ if file else 'None'}, tool={tool}, action={action}, session_id={session_id}")

        if not file:
            raise HTTPException(400, "File is required")
        if not action:
            raise HTTPException(400, "Action is required")

        # Validate tool and action
        valid_convert_actions = list(REQUIRED_EXTENSIONS.keys())
        if action not in valid_convert_actions:
            raise HTTPException(400, f"Unknown action: {action}")

        # Validate file extension
        filename = file.filename or ""
        ext = os.path.splitext(filename)[1].lower()
        required_exts = REQUIRED_EXTENSIONS.get(action, [])
        if required_exts and ext not in required_exts:
            raise HTTPException(
                status_code=422,
                detail=f"Invalid file type for {action}. Expected: {', '.join(required_exts)}. Got: {ext}"
            )

        # Save uploaded file
        saved_path = save_upload_file(file, session_id)
        logger.info(f"✅ File saved: {saved_path}")

        # Extract dynamic settings from form
        settings = {}
        for key, value in form.items():
            if key not in ["file", "tool", "action", "session_id"]:
                if value in ["on", "true"]:
                    settings[key] = True
                elif value in ["", "false"]:
                    settings[key] = False
                else:
                    try:
                        settings[key] = int(value)
                    except:
                        settings[key] = value

        logger.info(f"⚙️ Settings: {settings}")

        # Convert
        app = AppManager()
        output_file = app.convert(action, saved_path, settings=settings)

        # Handle pdf_to_image which returns a list of files
        if isinstance(output_file, list):
            if not output_file or not all(os.path.exists(f) for f in output_file):
                raise HTTPException(500, "Conversion failed - no output generated")
            # For multiple images, zip them and return the zip
            import zipfile
            zip_path = os.path.join(os.path.dirname(output_file[0]), "images.zip")
            with zipfile.ZipFile(zip_path, 'w') as zipf:
                for img_file in output_file:
                    zipf.write(img_file, os.path.basename(img_file))
            output_file = zip_path
            mime_type = "application/zip"
            filename = "converted_images.zip"
        else:
            if not output_file or not os.path.exists(output_file):
                raise HTTPException(500, "Conversion failed - no output generated")
            # MIME type detection
            mime_type, _ = mimetypes.guess_type(output_file)
            mime_type = mime_type or "application/octet-stream"
            filename = os.path.basename(output_file)

        logger.info(f"✅ Conversion complete: {filename} ({mime_type})")

        return FileResponse(output_file, media_type=mime_type, filename=filename)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Convert endpoint error: {e}", exc_info=True)
        raise HTTPException(500, str(e))
