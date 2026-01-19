#app/modules/exams/routers/upload.py
from fastapi import (
    APIRouter,
    Query,
    UploadFile,
    File,
    Form,
    Body,
    HTTPException,
)
from typing import Optional, Dict, Any
from pathlib import Path
import json
import logging

from app.modules.exams.services.upload_service import UploadService

logger = logging.getLogger(__name__)

DATA_ROOT = str(Path(__file__).parent.parent / "data")
router = APIRouter(prefix="/upload", tags=["Content Upload"])

service = UploadService(DATA_ROOT)


# ---------- JSON ----------

@router.post("/json")
async def create_json(
    path: str = Query("", description="{course_id}"),
    filename: str = Query(...),
    json_file: Optional[UploadFile] = File(None),
    payload: Optional[str] = Form(None),
):
    """
    POST → multipart/form-data
    Accepts either JSON file OR raw JSON string.
    """

    if json_file and payload:
        raise HTTPException(400, "Provide either json_file OR payload — not both")

    try:
        if json_file:
            return service.upload_json_file(path, filename, json_file)

        if payload:
            try:
                data = json.loads(payload)
            except json.JSONDecodeError:
                raise HTTPException(400, "Invalid JSON payload")

            return service.upload_json_body(path, filename, data)

        raise HTTPException(400, "Provide either json_file or payload")

    except HTTPException:
        raise
    except Exception:
        logger.exception("Failed to create JSON file")
        raise HTTPException(500, "Failed to save JSON")


@router.put("/json")
async def replace_json(
    path: str = Query(""),
    filename: str = Query(...),
    payload: Dict[str, Any] = Body(...),
):
    try:
        return service.put_json_body(path, filename, payload)
    except HTTPException:
        raise
    except Exception:
        logger.exception("Failed to replace JSON file")
        raise HTTPException(500, "Replace failed")


@router.patch("/json")
async def patch_json(
    path: str = Query(""),
    filename: str = Query(...),
    payload: Dict[str, Any] = Body(...),
):
    try:
        return service.patch_json_body(path, filename, payload)
    except HTTPException:
        raise
    except FileNotFoundError:
        raise HTTPException(404, "JSON file not found")
    except Exception:
        logger.exception("Failed to patch JSON file")
        raise HTTPException(500, "Patch failed")


@router.delete("/json")
async def delete_json(
    path: str = Query(""),
    filename: str = Query(...),
):
    try:
        return service.delete_json(path, filename)
    except HTTPException:
        raise
    except FileNotFoundError:
        raise HTTPException(404, "JSON file not found")
    except Exception:
        logger.exception("Failed to delete JSON file")
        raise HTTPException(500, "Delete failed")


# ---------- ASSETS ----------

@router.post("/asset")

@router.put("/asset")
async def upload_asset(
    asset_path: str = Query(...),
    file: UploadFile = File(...),
):
    try:
        return service.upload_asset(asset_path, file)
    except HTTPException:
        raise
    except Exception:
        logger.exception("Failed to upload asset")
        raise HTTPException(500, "Asset upload failed")


@router.delete("/asset")
async def delete_asset(
    asset_path: str = Query(...),
    filename: str = Query(...),
):
    try:
        return service.delete_asset(asset_path, filename)
    except HTTPException:
        raise
    except FileNotFoundError:
        raise HTTPException(404, "Asset not found")
    except Exception:
        logger.exception("Failed to delete asset")
        raise HTTPException(500, "Asset delete failed")


# ---------- COURSE FOLDERS ----------

@router.post("/course")
async def create_course(
    course_id: str = Query(..., description="Course folder name under general/"),
):
    try:
        return service.create_course(course_id)
    except HTTPException:
        raise
    except Exception:
        logger.exception("Failed to create course folder")
        raise HTTPException(500, "Could not create course folder")


@router.delete("/course")
async def delete_course(
    course_id: str = Query(..., description="Course folder name under general/"),
):
    try:
        return service.delete_course(course_id)
    except HTTPException:
        raise
    except FileNotFoundError:
        raise HTTPException(404, "Course not found")
    except Exception:
        logger.exception("Failed to delete course folder")
        raise HTTPException(500, "Could not delete course folder")

# ---------- HOMEPAGE ----------

@router.post("/homepage")
async def add_homepage_exam(
    domain: str = Form(...),
    title: str = Form(...),
    category: str = Form(...),
    exam_id: str = Form(...),
    label: str = Form(...),
):
    try:
        return service.add_homepage_exam(
            {
                "domain": domain,
                "title": title,
                "category": category,
                "exam_id": exam_id,
                "label": label,
            }
        )
    except HTTPException:
        raise
    except Exception:
        logger.exception("Failed to add homepage exam")
        raise HTTPException(500, "Homepage update failed")

@router.put("/homepage")
async def replace_homepage_exam(
    domain: str = Form(...),
    category: str = Form(...),
    exam_id: str = Form(...),
    label: str = Form(...),
):
    try:
        return service.replace_homepage_exam(
            {
                "domain": domain,
                "category": category,
                "exam_id": exam_id,
                "label": label,
            }
        )
    except HTTPException:
        raise
    except Exception:
        logger.exception("Failed to replace homepage exam")
        raise HTTPException(500, "Homepage replace failed")

@router.patch("/homepage")
async def patch_homepage_exam(
    domain: str = Form(...),
    category: str = Form(...),
    exam_id: str = Form(...),
    label: str | None = Form(None),
):
    try:
        payload = {
            "domain": domain,
            "category": category,
            "exam_id": exam_id,
        }
        if label is not None:
            payload["label"] = label

        return service.patch_homepage_exam(payload)

    except HTTPException:
        raise
    except Exception:
        logger.exception("Failed to patch homepage exam")
        raise HTTPException(500, "Homepage patch failed")

@router.delete("/homepage")
async def delete_homepage_exam(
    domain: str = Form(...),
    category: str = Form(...),
    exam_id: str = Form(...),
):
    try:
        return service.delete_homepage_exam(
            {
                "domain": domain,
                "category": category,
                "exam_id": exam_id,
            }
        )
    except HTTPException:
        raise
    except Exception:
        logger.exception("Failed to delete homepage exam")
        raise HTTPException(500, "Homepage delete failed")

# ---------- HOMEPAGE DOMAIN ----------

@router.post("/homepage/domain")
async def add_domain(
    domain: str = Form(...),
    title: str = Form(...),
):
    return service.add_homepage_domain(domain, title)


@router.put("/homepage/domain")
async def replace_domain(
    domain: str = Form(...),
    title: str = Form(...),
):
    return service.replace_homepage_domain(domain, title)


@router.patch("/homepage/domain")
async def patch_domain(
    domain: str = Form(...),
    title: str = Form(...),
):
    return service.patch_homepage_domain(domain, title)


@router.delete("/homepage/domain")
async def delete_domain(
    domain: str = Form(...),
):
    return service.delete_homepage_domain(domain)

# ---------- HOMEPAGE CATEGORY ----------

@router.post("/homepage/category")
async def add_category(
    domain: str = Form(...),
    category: str = Form(...),
):
    return service.add_homepage_category(domain, category)


@router.put("/homepage/category")
async def replace_category(
    domain: str = Form(...),
    old_name: str = Form(...),
    new_name: str = Form(...),
):
    return service.replace_homepage_category(domain, old_name, new_name)


@router.patch("/homepage/category")
async def patch_category(
    domain: str = Form(...),
    category: str = Form(...),
    new_name: str = Form(...),
):
    return service.patch_homepage_category(domain, category, new_name)


@router.delete("/homepage/category")
async def delete_category(
    domain: str = Form(...),
    category: str = Form(...),
):
    return service.delete_homepage_category(domain, category)
