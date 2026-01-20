from fastapi import APIRouter, UploadFile, File, HTTPException, Form, Request
from fastapi.responses import FileResponse
from starlette.background import BackgroundTask
import mimetypes
import os
from pydantic import BaseModel, ValidationError
from typing import Optional, List, Union
import json

from core.logger import setup_logger
from app_manager import AppManager
from api.utils.file_utils import save_upload_file

logger = setup_logger(__name__)

router = APIRouter()

class AnnotationModel(BaseModel):
    type: str  # "text", "ink", "highlight"
    text: Optional[str] = None
    page: Optional[int] = None
    x: Optional[float] = None  # Normalized 0-1
    y: Optional[float] = None  # Normalized 0-1
    rect: Optional[List[float]] = None  # [x, y, width, height] - normalized 0-1
    color: Optional[List[float]] = None  # [r, g, b] floats 0-1
    font_size: Optional[int] = None  # For text annotations
    points: Optional[List[List[float]]] = None  # For ink/highlight: [[x,y], [x,y], ...]
    width: Optional[int] = None  # Stroke width for ink annotations
    opacity: Optional[float] = None  # Opacity 0-1 for highlights (default 0.35)

@router.post("/edit")
async def edit(
    request: Request,
    action: str = Form(...),
    file: UploadFile = File(...),
    annotations: Optional[str] = Form(None),  # JSON string for annotate_pdf
    settings: Optional[str] = Form(None),  # JSON string for watermark/other settings
    # New fields for edit_pdf_content (frontend-heavy text editing)
    edits: Optional[str] = Form(None),
    operation: Optional[str] = Form(None),
    # Other fields for non-annotation actions
    text: Optional[str] = Form(None),
    page: Optional[Union[int, str]] = Form(None),  # Can be int or "all"
    position_x: Optional[int] = Form(None),
    position_y: Optional[int] = Form(None),
    width: Optional[int] = Form(None),
    height: Optional[int] = Form(None),
    # Crop-specific parameters
    crop_x: Optional[float] = Form(None),
    crop_y: Optional[float] = Form(None),
    crop_width: Optional[float] = Form(None),
    crop_height: Optional[float] = Form(None),
    # Watermark-specific parameters
    watermark_type: Optional[str] = Form(None),  # "text" or "image"
    watermark_image: Optional[UploadFile] = File(None),  # Image file for watermark
    watermark_x: Optional[float] = Form(None),  # X position (normalized 0-1)
    watermark_y: Optional[float] = Form(None),  # Y position (normalized 0-1)
    watermark_scale: Optional[float] = Form(None),  # Scale factor
    watermark_opacity: Optional[float] = Form(None),  # Opacity 0-1
    # Smart Cleanup parameters
    remove_duplicates: Optional[str] = Form(None),  # "true" or "false"
    remove_blanks: Optional[str] = Form(None),  # "true" or "false"
    fix_orientation: Optional[str] = Form(None),  # "true" or "false"
):
    """Edit PDF files (annotate, watermark, crop, add page numbers, remove duplicates, etc.)
    For annotate_pdf, only use the annotations JSON field.
    For other actions, use individual fields as needed.
    """
    try:
        saved_path = save_upload_file(file)
        kwargs = {}
        # If annotate_pdf, only use annotations
        if action == "annotate_pdf":
            if not annotations:
                raise HTTPException(status_code=400, detail="annotations field required for annotate_pdf")
            try:
                ann_list = json.loads(annotations)
                parsed_annotations = [AnnotationModel(**a).dict() for a in ann_list]
            except Exception as ve:
                logger.error(f"Invalid annotations JSON: {ve}")
                raise HTTPException(status_code=422, detail="Invalid annotations JSON format.")
            kwargs["annotations"] = parsed_annotations
        elif action == "edit_pdf_content":
            # Frontend-heavy text editing flow
            if operation != "edit_text":
                raise HTTPException(status_code=400, detail="operation must be 'edit_text' for edit_pdf_content")
            if not edits:
                raise HTTPException(status_code=400, detail="'edits' JSON string is required for edit_pdf_content")
            try:
                edits_list = json.loads(edits)
                if not isinstance(edits_list, list):
                    raise ValueError("edits must be a JSON array")
            except Exception as ve:
                logger.error(f"Invalid edits JSON: {ve}")
                raise HTTPException(status_code=422, detail="Invalid edits JSON format.")
            kwargs["operation"] = operation
            kwargs["edits"] = edits_list
        elif action == "add_page_numbers":
            # Handle settings for page numbers (format, style, etc.)
            if settings:
                try:
                    settings_dict = json.loads(settings)
                    logger.info(f"🔢 Page number settings parsed: {settings_dict}")
                    # Merge settings into kwargs
                    kwargs.update(settings_dict)
                except Exception as e:
                    logger.error(f"❌ Invalid settings JSON for page numbers: {e}")
                    raise HTTPException(status_code=422, detail=f"Invalid settings JSON: {str(e)}")
        elif action == "add_watermark":
            # Handle watermark settings from frontend
            if settings:
                try:
                    settings_dict = json.loads(settings)
                    logger.info(f"📋 Watermark settings parsed: {settings_dict}")
                    
                    # Extract watermarks array
                    watermarks = settings_dict.get("watermarks", [])
                    apply_to_all = settings_dict.get("apply_to_all_pages", False)
                    
                    if watermarks:
                        # Get all form data to access dynamic file fields
                        form_data = await request.form()
                        
                        # Process each watermark configuration
                        watermark_configs = []
                        for wm in watermarks:
                            wm_config = wm.copy()
                            
                            # If it's an image watermark, get the uploaded file
                            if wm.get("type") == "image" and wm.get("image_key"):
                                image_key = wm["image_key"]
                                if image_key in form_data:
                                    uploaded_file = form_data[image_key]
                                    if hasattr(uploaded_file, 'filename'):  # It's a file
                                        # Save the uploaded image
                                        image_path = save_upload_file(uploaded_file)
                                        wm_config["image_path"] = image_path
                                        logger.info(f"🖼️ Watermark image saved: {image_path} (from {image_key})")
                            
                            watermark_configs.append(wm_config)
                        
                        kwargs["watermarks"] = watermark_configs
                        kwargs["apply_to_all_pages"] = apply_to_all
                        logger.info(f"✅ Processed {len(watermark_configs)} watermark(s)")
                    else:
                        # Check for global image watermark (simple mode from frontend)
                        global_image_key = settings_dict.get("global_image_watermark")
                        
                        if global_image_key:
                            form_data = await request.form()
                            if global_image_key in form_data:
                                uploaded_file = form_data[global_image_key]
                                if hasattr(uploaded_file, 'filename'):
                                    image_path = save_upload_file(uploaded_file)
                                    
                                    # Set up simple image watermark parameters
                                    kwargs["watermark_type"] = "image"
                                    kwargs["image_path"] = image_path
                                    kwargs["apply_to_all_pages"] = apply_to_all
                                    
                                    # Use default positioning (bottom right) or whatever _add_image_watermark defaults to
                                    # unless we want to extract other settings from settings_dict if they existed contextually
                                    
                                    logger.info(f"🖼️ Global watermark image saved: {image_path}")
                        else:
                            # Fallback to default text watermark
                            kwargs["text"] = settings_dict.get("text", "CONFIDENTIAL")
                        
                except Exception as e:
                    logger.error(f"❌ Invalid settings JSON: {e}")
                    raise HTTPException(status_code=422, detail=f"Invalid settings JSON: {str(e)}")
            else:
                # Legacy support: use individual watermark parameters
                if watermark_type:
                    kwargs["watermark_type"] = watermark_type
                    
                if watermark_type == "image" and watermark_image:
                    watermark_path = save_upload_file(watermark_image)
                    kwargs["image_path"] = watermark_path
                    logger.info(f"🖼️ Watermark image saved: {watermark_path}")
                    
                if watermark_x is not None:
                    kwargs["x"] = watermark_x
                if watermark_y is not None:
                    kwargs["y"] = watermark_y
                if watermark_scale is not None:
                    kwargs["scale"] = watermark_scale
                if watermark_opacity is not None:
                    kwargs["opacity"] = watermark_opacity
                if text:
                    kwargs["text"] = text
        else:
            # For other actions, use individual fields
            if text:
                kwargs["text"] = text
            if page is not None:
                # Handle page parameter - can be int or "all"
                if isinstance(page, str) and page.lower() == "all":
                    kwargs["page"] = "all"
                else:
                    try:
                        kwargs["page"] = int(page)
                    except (ValueError, TypeError):
                        raise HTTPException(status_code=422, detail="Page must be an integer or 'all'")
            if position_x is not None and position_y is not None:
                kwargs["position"] = (position_x, position_y)
            if width is not None:
                kwargs["width"] = width
            if height is not None:
                kwargs["height"] = height
            # Handle crop box parameters
            if crop_x is not None and crop_y is not None and crop_width is not None and crop_height is not None:
                kwargs["crop_box"] = (crop_x, crop_y, crop_x + crop_width, crop_y + crop_height)
                logger.info(f"📐 Crop params received: x={crop_x}, y={crop_y}, w={crop_width}, h={crop_height}")
                logger.info(f"📦 Constructed crop_box: {kwargs['crop_box']}")
        
        # Handle smart_cleanup action parameters
        if action == "smart_cleanup":
            # Parse boolean form fields (they come as "true"/"false" strings)
            if remove_duplicates is not None:
                kwargs["remove_duplicates"] = remove_duplicates.lower() == "true"
            if remove_blanks is not None:
                kwargs["remove_blanks"] = remove_blanks.lower() == "true"
            if fix_orientation is not None:
                kwargs["fix_orientation"] = fix_orientation.lower() == "true"
        
        logger.info(f"🔧 Action: {action}, kwargs: {kwargs}")
        app = AppManager()
        output_file = app.edit(action, saved_path, **kwargs)
        if not output_file or not os.path.exists(output_file):
            logger.error(f"Edit produced no output: {output_file}")
            raise HTTPException(status_code=500, detail="Edit operation failed - no output generated")
        mime_type, _ = mimetypes.guess_type(output_file)
        if not mime_type:
            mime_type = "application/pdf"
        filename = os.path.basename(output_file)
        logger.info(f"✅ Edit complete: {filename}")
        def cleanup():
            try:
                if os.path.exists(saved_path):
                    os.remove(saved_path)
                    logger.info(f"🧹 Cleaned up temp file: {saved_path}")
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
        logger.error(f"❌ Edit endpoint error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))