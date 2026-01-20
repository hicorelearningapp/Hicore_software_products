from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import FileResponse
from pydantic import BaseModel, ValidationError
from typing import Optional
import mimetypes
import os
import json
from core.logger import setup_logger
from app_manager import AppManager
from api.utils.file_utils import save_upload_file
from api.utils.helpers import parse_page_list


logger = setup_logger(__name__)

router = APIRouter()

class OrganizeRequestModel(BaseModel):
    action: str
    mode: Optional[str] = "merge"
    pages: Optional[str] = None  # Accepts string or JSON array as string


@router.post("/organize")
async def organize(
    action: str = Form(..., description="Action: merge_pdf, split_pdf, rotate_pdf, compress_pdf, delete_pages, extract_pdf, reorder_pdf, extract_images"),
    files: list[UploadFile] = File(..., description="Files to organize"),

    # Optional fields (Swagger auto-fills them with "string", so we must filter that out)
    degrees: str = Form(None, description="For rotate_pdf: rotation angle in degrees (90, 180, 270)"),
    pages_to_delete: str = Form(None, description="For delete_pages: comma-separated page numbers (e.g., '2,4,7')"),
    page_ranges: str = Form(None, description="For split_pdf: page ranges (e.g., '1-3,5-7')"),
    order: str = Form(None, description="For merge_pdf: file order (1-indexed, e.g., '2,1,3'). For reorder_pdf: page order"),

    # New extract fields
    pages: str = Form(None, description="For extract_pdf: pages to extract (e.g., '1,3,5-7')"),   
    mode: str = Form("merge", description="For extract_pdf: 'merge' (combine pages) or 'separate' (split into files)"),
    
    # New compression fields
    compression_quality: str = Form("medium", description="For compress_pdf: quality preset - 'high' (minimal compression), 'medium' (balanced), or 'low' (maximum compression)"),
    target_size_kb: str = Form(None, description="For compress_pdf: optional target file size in KB (e.g., '500')"),
    
    # Settings JSON (used by frontend components)
    settings: str = Form(None, description="JSON settings object (used by some frontend components)"), 
):
    """
    Handle PDF organization operations.
    
    ### 1. **merge_pdf** - Merge multiple PDFs into one
    - Upload multiple PDF files
    - Optionally set `order` = comma-separated file order (1-indexed, e.g., '2,1,3')
    - Returns: Merged PDF
    
    ### 2. **split_pdf** - Split PDF into parts
    - Upload one PDF file
    - **Option A:** Set `page_ranges` = ranges (e.g., '1-3,5-7') to split by ranges
    - **Option B:** Leave empty to split each page into separate files
    - Returns: ZIP file with split PDFs
    
    ### 3. **rotate_pdf** - Rotate PDF pages
    - Set `degrees` = 90, 180, or 270
    - Set `pages` = specific pages to rotate (e.g., '1,3,5') or leave empty for all
    - Returns: Rotated PDF
    
    ### 4. **compress_pdf** - Compress PDF to reduce file size
    - Upload one PDF file
    - Set `compression_quality` = 'high', 'medium' (default), or 'low'
      - **high**: Minimal compression, best quality (~10-20% reduction)
      - **medium**: Balanced compression (~30-50% reduction)
      - **low**: Maximum compression, may reduce image quality (~50-70% reduction)
    - Optionally set `target_size_kb` = desired size in KB (e.g., '500')
    - Returns: Compressed PDF
    
    ### 5. **delete_pages** - Delete specific pages from PDF
    - Set `pages_to_delete` = comma-separated page numbers (e.g., '2,4,7')
    - Returns: PDF with pages removed
    
    ### 6. **reorder_pdf** - Reorder pages within a PDF
    - Set `order` = new page order (e.g., '3,1,2,4')
    - Returns: Reordered PDF
    
    ### 7. **extract_pdf** - Extract specific pages from PDF
    - Set `pages` = pages to extract (e.g., '1,3,5-7')
    - Set `mode` = 'merge' (one PDF) or 'separate' (ZIP with individual PDFs)
    - Returns: PDF or ZIP file
    
    ### 8. **extract_images** - Extract all images from PDF
    - Upload one PDF file
    - No additional parameters required
    - Returns: ZIP file with all extracted images (page_X_image_Y.ext)
    """

    try:
        # Initial validation using Pydantic
        try:
            req = OrganizeRequestModel(action=action, mode=mode, pages=pages)
        except ValidationError as ve:
            raise HTTPException(400, f"Validation error: {ve}")

        logger.info(f"Organize request: action={action}, files={len(files)}")

        # Save uploaded files
        saved_paths = [save_upload_file(f) for f in files]

        # Build settings dictionary
        settings_dict = {}
        
        # Parse settings JSON if provided (used by frontend components like RotatePdf)
        if settings not in (None, "", "string"):
            try:
                parsed_settings = json.loads(settings)
                logger.info(f"📦 Parsed settings JSON: {parsed_settings}")
                
                # Extract degree (singular) from settings and map to degrees (plural)
                if "degree" in parsed_settings:
                    try:
                        settings_dict["degrees"] = int(parsed_settings["degree"])
                        logger.info(f"🔄 Extracted rotation degree: {settings_dict['degrees']}°")
                    except (ValueError, TypeError):
                        logger.warning(f"⚠️ Invalid degree value in settings: {parsed_settings['degree']}")
                
                # Extract pages from settings (for rotation)
                if "pages" in parsed_settings and parsed_settings["pages"]:
                    try:
                        # Parse pages string (e.g., "1,3,5" or "1-3")
                        pages_str = str(parsed_settings["pages"]).strip()
                        if pages_str:
                            parsed_pages = parse_page_list(pages_str)
                            if parsed_pages:
                                settings_dict["pages"] = parsed_pages
                                logger.info(f"📄 Extracted pages from settings JSON: {parsed_pages}")
                    except ValueError as ve:
                        logger.warning(f"⚠️ Invalid pages in settings: {ve}")
                        
            except json.JSONDecodeError as je:
                logger.warning(f"⚠️ Failed to parse settings JSON: {je}")
                # Continue processing - individual form fields may still be valid

        # ROTATE ---------------
        if degrees not in (None, "", "string"):
            try:
                settings_dict["degrees"] = int(degrees)
            except ValueError:
                raise HTTPException(400, f"Invalid degrees value: {degrees}")
        
        # ROTATE PAGES (optional: specific pages to rotate)
        if action == "rotate_pdf" and pages not in (None, "", "string"):
            try:
                # Parse pages for rotation (e.g., "2" or "1,3,5" or "1-3")
                parsed_pages = parse_page_list(pages)
                if parsed_pages:
                    settings_dict["pages"] = parsed_pages
            except ValueError as ve:
                raise HTTPException(400, f"Invalid pages for rotate: {ve}")

        # DELETE PAGES ---------------
        if pages_to_delete not in (None, "", "string"):
            cleaned_pages = []
            for p in pages_to_delete.split(","):
                p = p.strip()
                if p.isdigit():
                    cleaned_pages.append(int(p))
                else:
                    raise HTTPException(
                        400,
                        f"Invalid page number '{p}'. Use comma-separated integers like: 2,4,7"
                    )
            settings_dict["pages_to_delete"] = cleaned_pages

        # SPLIT RANGES ---------------
        if page_ranges not in (None, "", "string"):
            ranges = []
            for r in page_ranges.split(","):
                r = r.strip()
                if "-" not in r:
                    raise HTTPException(
                        400,
                        f"Invalid page range '{r}'. Expected format: start-end (ex: 1-3)"
                    )
                start, end = r.split("-")
                try:
                    ranges.append((int(start), int(end)))
                except ValueError:
                    raise HTTPException(
                        400,
                        f"Invalid numbers in page range '{r}'. Use integers."
                    )
            settings_dict["page_ranges"] = ranges

        # REORDER ---------------
        if order not in (None, "", "string"):
            cleaned_order = []
            for p in order.split(","):
                p = p.strip()
                if p.isdigit():
                    cleaned_order.append(int(p))
                else:
                    raise HTTPException(
                        400,
                        f"Invalid page number '{p}' in order. Use comma-separated integers."
                    )
            settings_dict["order"] = cleaned_order

        # EXTRACT PAGES ---------------
        # Only process pages for extract_pdf (rotate_pdf handles pages separately above)
        # Skip if pages were already extracted from settings JSON
        if action == "extract_pdf" and pages not in (None, "", "string") and "pages" not in settings_dict:
            try:
                # Try JSON first
                parsed_pages = []
                try:
                    parsed = json.loads(pages)
                    if isinstance(parsed, list):
                        if all(isinstance(x, int) for x in parsed):
                            parsed_pages = parsed
                        elif all(isinstance(x, (list, tuple)) and len(x) == 2 for x in parsed):
                            for a, b in parsed:
                                if not (isinstance(a, int) and isinstance(b, int)):
                                    raise ValueError("Range bounds must be integers")
                                parsed_pages.extend(list(range(a, b + 1)))
                except Exception:
                    # Fallback to string parser
                    parsed_pages = parse_page_list(pages)
                if not parsed_pages:
                    raise HTTPException(400, "No valid pages provided for extract")
                mode_val = (mode or "merge").lower()
                if mode_val not in ("merge", "separate"):
                    raise HTTPException(400, f"Invalid extract mode: {mode}")
                settings_dict["pages"] = parsed_pages
                settings_dict["mode"] = mode_val
            except ValueError as ve:
                raise HTTPException(400, str(ve))
        
        # Set mode for extract_pdf if not already set (from settings JSON or form field processing)
        if action == "extract_pdf" and "mode" not in settings_dict:
            mode_val = (mode or "merge").lower()
            if mode_val not in ("merge", "separate"):
                raise HTTPException(400, f"Invalid extract mode: {mode}")
            settings_dict["mode"] = mode_val
        
        # COMPRESS PDF ---------------
        if action == "compress_pdf":
            # Validate and set compression quality
            quality = (compression_quality or "medium").lower()
            if quality not in ["high", "medium", "low"]:
                raise HTTPException(
                    400,
                    f"Invalid compression_quality '{quality}'. Must be 'high', 'medium', or 'low'."
                )
            settings_dict["compression_quality"] = quality
            
            # Validate and set target size if provided
            if target_size_kb not in (None, "", "string"):
                try:
                    target_kb = int(target_size_kb)
                    if target_kb <= 0:
                        raise HTTPException(400, "Target size must be a positive integer (in KB)")
                    if target_kb < 10:
                        logger.warning(f"⚠️ Target size {target_kb}KB is very small, may not be achievable")
                    settings_dict["target_size_kb"] = target_kb
                except ValueError:
                    raise HTTPException(400, f"Invalid target_size_kb: '{target_size_kb}'. Must be an integer.")

        # Merge, delete_pages, etc use 1 file. Merge uses many.
        input_data = saved_paths if len(saved_paths) > 1 else saved_paths[0]

        # Call manager
        app = AppManager()
        output_file = app.organize(action, input_data, **settings_dict)

        if not output_file or not os.path.exists(output_file):
            raise HTTPException(
                500,
                f"Organize operation failed for action {action}"
            )

        # MIME
        mime_type, _ = mimetypes.guess_type(output_file)
        if not mime_type:
            mime_type = "application/octet-stream"

        return FileResponse(
            path=output_file,
            media_type=mime_type,
            filename=os.path.basename(output_file)
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Organize endpoint error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
