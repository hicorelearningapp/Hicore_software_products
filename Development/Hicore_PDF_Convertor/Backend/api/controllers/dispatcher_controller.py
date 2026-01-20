from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import Optional, List
import os
import mimetypes
from fastapi.responses import FileResponse
from starlette.background import BackgroundTask

from core.logger import setup_logger
from app_manager import AppManager
from api.utils.file_utils import save_upload_file

logger = setup_logger(__name__)

router = APIRouter()


class ToolActionRequest(BaseModel):
    """Request model for tool-action endpoint"""
    tool: str
    action: str


class ToolActionResponse(BaseModel):
    """Response model mapping tool to endpoint"""
    redirect_to: str
    action: str


# Mapping of tool names to their API endpoints
TOOL_ENDPOINT_MAP = {
    "convert": "/convert",
    "edit": "/edit",
    "organize": "/organize",
    "password": "/password",
    "signature": "/signature",
}

# Valid actions per tool
VALID_ACTIONS = {
    "convert": ["pdf_to_word", "word_to_pdf", "pdf_to_excel", "excel_to_pdf", 
                "pdf_to_powerpoint", "powerpoint_to_pdf", "pdf_to_image", "image_to_pdf"],
    "edit": ["annotate_pdf", "add_watermark", "crop_pdf", "add_page_numbers"],
    "organize": ["merge_pdf", "split_pdf", "rotate_pdf", "compress_pdf", "delete_pages", "extract_pdf", "reorder_pdf","remove_duplicate_pages", "extract_images"],
    "password": ["add_password", "remove_password"],
    "signature": ["add_signature", "remove_signature"],
}


@router.post("/tool-action", response_model=ToolActionResponse)
async def tool_action(req: ToolActionRequest):
    """Dispatcher endpoint that validates tool/action and returns the correct endpoint.
    
    🧠 How it works:
    - Frontend calls this FIRST with {"tool": "convert", "action": "pdf_to_word"}
    - This endpoint validates the tool/action combination
    - Returns {"redirect_to": "/convert", "action": "pdf_to_word"}
    - Frontend then knows to POST the file to /convert endpoint
    
    Request: {"tool": "convert", "action": "pdf_to_word"}
    Response: {"redirect_to": "/convert", "action": "pdf_to_word"}
    """
    tool = req.tool.lower()
    action = req.action.lower()
    
    # Validate tool exists
    if tool not in TOOL_ENDPOINT_MAP:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown tool: {tool}. Valid tools: {list(TOOL_ENDPOINT_MAP.keys())}"
        )
    
    # Validate action for this tool
    valid_actions = VALID_ACTIONS.get(tool, [])
    if action not in valid_actions:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid action '{action}' for tool '{tool}'. Valid actions: {valid_actions}"
        )
    
    endpoint = TOOL_ENDPOINT_MAP[tool]
    logger.info(f"✅ Tool action validated: {tool} → {action} → {endpoint}")
    
    return ToolActionResponse(redirect_to=endpoint, action=action)


@router.post("/tool-action-complete")
async def tool_action_complete(
    tool: str = Form(...),
    action: str = Form(...),
    files: List[UploadFile] = File(...),
    password: Optional[str] = Form(None),
    degrees: Optional[int] = Form(None),
):
    """🧪 TESTING ENDPOINT: Complete tool processing in one call
    
    This endpoint combines the dispatcher + file upload in a single call.
    Use this in Swagger to test the entire flow without a frontend.
    
    Steps:
    1. Validates tool/action combination
    2. Saves uploaded files
    3. Routes to the appropriate manager (convert, edit, organize, password, signature)
    4. Processes the file(s)
    5. Returns the processed file as a download
    
    Example in Swagger:
    - tool: convert
    - action: pdf_to_word
    - files: (upload your PDF)
    - Result: Downloaded .docx file
    
    For testing /api/convert:
    - tool: convert
    - action: pdf_to_image
    - files: (upload PDF)
    - Result: Downloaded .zip of JPEG images
    """
    try:
        tool = tool.lower()
        action = action.lower()
        
        logger.info(f"🚀 Complete action request: tool={tool}, action={action}, file_count={len(files)}")
        
        # Step 1: Validate tool/action
        if tool not in TOOL_ENDPOINT_MAP:
            raise HTTPException(
                status_code=400,
                detail=f"Unknown tool: {tool}. Valid: {list(TOOL_ENDPOINT_MAP.keys())}"
            )
        
        valid_actions = VALID_ACTIONS.get(tool, [])
        if action not in valid_actions:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid action '{action}'. Valid for {tool}: {valid_actions}"
            )
        
        # Step 2: Save uploaded files
        saved_paths = [save_upload_file(f) for f in files]
        logger.info(f"📁 Saved {len(saved_paths)} files")
        
        # Step 3 & 4: Route and process
        app = AppManager()
        input_data = saved_paths[0] if len(saved_paths) == 1 else saved_paths
        
        # Prepare kwargs based on tool type
        kwargs = {}
        if tool == "password" and password:
            kwargs["password"] = password
        if tool == "organize" and degrees is not None:
            kwargs["degrees"] = degrees
        
        logger.info(f"⚙️  Processing via AppManager: {tool}.{action}")
        
        # Call AppManager.run_action which routes to the correct manager
        output_file = app.run_action(tool, action, input_data, **kwargs)
        
        if not output_file or not os.path.exists(output_file):
            logger.error(f"❌ Processing failed: no output generated")
            raise HTTPException(status_code=500, detail="Processing failed - no output generated")
        
        # Step 5: Return file as download
        mime_type, _ = mimetypes.guess_type(output_file)
        if not mime_type:
            mime_type = "application/octet-stream"
        
        filename = os.path.basename(output_file)
        
        logger.info(f"✅ Processing complete: {filename} ({mime_type})")
        
        def cleanup():
            try:
                for path in saved_paths:
                    if os.path.exists(path):
                        os.remove(path)
                logger.info(f"🧹 Cleaned up {len(saved_paths)} temp files")
            except Exception as e:
                logger.error(f"Cleanup error: {e}")
        
        return FileResponse(
            path=output_file,
            media_type=mime_type,
            filename=filename,
            headers={"Content-Disposition": f"attachment; filename={filename}"},
            background=BackgroundTask(cleanup)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Tool action complete error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
