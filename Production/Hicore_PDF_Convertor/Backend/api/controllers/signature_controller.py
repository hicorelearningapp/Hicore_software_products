from fastapi import APIRouter, UploadFile, File, HTTPException, Form, Request
from fastapi.responses import FileResponse
import mimetypes
import os
import json

from pydantic import BaseModel, ValidationError
from typing import Optional

from core.logger import setup_logger
from app_manager import AppManager
from api.utils.file_utils import save_upload_file
from api.utils.helpers import parse_page_list  # <- new helper

logger = setup_logger(__name__)
router = APIRouter()


class SignatureRequestModel(BaseModel):
    action: str
    signature_type: Optional[str]
    page: Optional[str] = "1"
    x: Optional[float] = 100
    y: Optional[float] = 100
    width: Optional[int] = 200
    height: Optional[int] = 80


@router.post("/signature", tags=["Signature"])
async def manage_signature(
    request: Request,
    action: str = Form(..., description="Action to perform: 'add_signature'"),
    file: UploadFile = File(..., description="PDF file to add signature to"),

    signature_type: Optional[str] = Form(None, description="Type of signature: 'draw', 'upload', or 'text'"),
    signature_data: str = Form(None, description="Base64-encoded signature data (required for signature_type='draw')"),
    signature_file_raw: str = Form(None, description="Signature image file (required for signature_type='upload')"),
    signature_text: str = Form(None, description="Signature text content (required for signature_type='text')"),
    signature_font: str = Form("Helvetica", description="Font for text signature (e.g., 'Helvetica', 'Times-Roman', 'Courier')"),
    signature_font_size: int = Form(36, description="Font size for text signature in points"),
    signature_color: str = Form("#000000", description="Hex color code for signature (e.g., '#000000' for black, '#FF0000' for red)"),

    page: str = Form("1", description="Target page(s): single page ('1'), multiple pages ('1,2,3'), or range ('1-3,5')"),
    x: float = Form(100, description="X coordinate for signature placement (pixels from left)"),
    y: float = Form(100, description="Y coordinate for signature placement (pixels from top)"),
    width: int = Form(200, description="Signature width in pixels"),
    height: int = Form(80, description="Signature height in pixels"),

    add_datetime: bool = Form(False, description="Whether to add current date/time next to signature"),
    flatten_pdf: bool = Form(False, description="Whether to flatten the PDF after adding signature (removes editability)"),
    settings: str = Form(None, description="JSON settings string containing multiple signatures (optional)"),
):
    """
    Add a signature to a PDF document.
    
    Supports three signature types:
    - **draw**: Canvas-drawn signature (provide signature_data as base64)
    - **upload**: Signature image file (provide signature_file)
    - **text**: Text-based signature (provide signature_text)
    
    Page selection supports:
    - Single: "1"
    - Multiple: "1,2,3"
    - Ranges: "1-3,5" (adds to pages 1, 2, 3, and 5)
    
    Returns the modified PDF with the signature applied.
    """
    # Initial validation using Pydantic
    try:
        req = SignatureRequestModel(
            action=action,
            signature_type=signature_type,
            page=page,
            x=x,
            y=y,
            width=width,
            height=height,
        )
    except ValidationError as ve:
        raise HTTPException(400, f"Validation error: {ve}")

    try:
        # manual form extraction so we can access signature_file if uploaded
        form = await request.form()
        signature_file = form.get("signature_file")
        if hasattr(signature_file, "filename") and signature_file.filename == "":
            signature_file = None
        if signature_file == "" or signature_file == "string":
            signature_file = None

        logger.info(f"Signature request: type={signature_type}")

        # Save main PDF
        saved_pdf_path = save_upload_file(file)

        if not os.path.exists(saved_pdf_path):
            logger.error(f"❌ Uploaded file was not saved: {saved_pdf_path}")
            raise HTTPException(500, "Failed to save uploaded PDF.")

        file_size = os.path.getsize(saved_pdf_path)
        logger.info(f"📄 Saved PDF: {saved_pdf_path} (size={file_size} bytes)")

        # parse pages (accept lists/ranges)
        try:
            pages = parse_page_list(page)
            if not pages:
                raise HTTPException(400, "No valid pages provided in `page` field.")
        except ValueError as ve:
            raise HTTPException(400, f"Invalid page value: {ve}")

        # build kwargs and include 'pages' list
        kwargs = {
            "signature_type": signature_type,
            "pages": pages,        # <-- pass list of target pages
            "x": x,
            "y": y,
            "width": width,
            "height": height,
            "add_datetime": add_datetime,
            "flatten_pdf": flatten_pdf,
            "signature_text": signature_text,
            "signature_font": signature_font,
            "signature_font_size": signature_font_size,
            "signature_color": signature_color,
        }

        if signature_type == "draw":
            if not signature_data:
                raise HTTPException(400, "Missing signature_data for draw type")
            kwargs["signature_base64"] = signature_data

        elif signature_type == "upload":
            if not signature_file:
                raise HTTPException(400, "Missing signature_file for upload type")
            sig_path = save_upload_file(signature_file)
            kwargs["signature_path"] = sig_path

        elif signature_type == "text":
            if not signature_text:
                raise HTTPException(400, "Missing signature_text for text type")
        
        # Parse settings for multi-signature support
        if settings:
            try:
                settings_data = json.loads(settings)
                if "signatures" in settings_data:
                    kwargs["signatures"] = settings_data["signatures"]
                    logger.info(f"📑 Received {len(kwargs['signatures'])} signatures in settings")
            except Exception as e:
                logger.error(f"Failed to parse settings JSON: {e}")


        # call manager
        app = AppManager()
        logger.info(f"🚀 Calling AppManager.sign() with action='add_signature', pdf={saved_pdf_path}")
        output_file = app.sign("add_signature", saved_pdf_path, **kwargs)
        logger.info(f"📊 AppManager returned: {output_file}")

        if not output_file:
            logger.error(f"❌ Signature operation returned None")
            raise HTTPException(500, "Signature operation failed (returned None).")
        
        if not os.path.exists(output_file):
            logger.error(f"❌ Output file does not exist: {output_file}")
            raise HTTPException(500, f"Signature output file not created: {output_file}")

        logger.info(f"✅ Signature complete: {output_file}")

        mime, _ = mimetypes.guess_type(output_file)
        mime = mime or "application/pdf"
        return FileResponse(output_file, media_type=mime, filename=os.path.basename(output_file))
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Signature endpoint error: {e}", exc_info=True)
        raise HTTPException(500, str(e))
