import os
import json
from pathlib import Path
from typing import Any
from functools import lru_cache

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    Depends,
    HTTPException,
)
from sqlalchemy.ext.asyncio import AsyncSession

from app.main import BASE_DIR
from app.core.database.config import get_db
from app.modules.find_my_career.services.course_service import CourseService
from app.modules.find_my_career.utils.id_generator import generate_course_id
from app.modules.find_my_career.schemas.course_schema import (
    ModuleResponse,
    CourseStructureResponse,
    CourseListResponse,
)

router = APIRouter(prefix="/find-my-courses", tags=["Find My Career"])

# ---------------------------------------------------------
# Upload Paths
# ---------------------------------------------------------
UPLOAD_ROOT = BASE_DIR / "app" / "uploads"
SAVE_DIR = UPLOAD_ROOT / "find_my_career"
IMAGE_DIR = SAVE_DIR / "images"

os.makedirs(SAVE_DIR, exist_ok=True)
os.makedirs(IMAGE_DIR, exist_ok=True)


def rel(path: Path) -> str:
    """
    Convert absolute path → 'uploads/...'
    Stored in DB and returned in API.
    Example: app/uploads/find_my_career/... → uploads/find_my_career/...
    """
    return str(path.as_posix().split("app/")[-1])


# =====================================================================
# ✅ POST: Create Course — Fast & Minimal Validation
# =====================================================================
@router.post("/create")
async def create_course(
    title: str = Form(...),
    description1: str = Form(...),
    highlight: str = Form(...),
    description2: str = Form(...),
    closing: str = Form(...),
    rating: float = Form(...),
    price: float = Form(...),
    offer_price: float = Form(...),
    domain: str = Form(...),
    months: int = Form(...),

    image: UploadFile = File(...),
    background: UploadFile = File(...),
    module_json: UploadFile = File(...),
    full_course_json: UploadFile = File(...),

    db: AsyncSession = Depends(get_db),
):
    service = CourseService(db)

    # Load JSON as-is
    try:
        module_data = json.loads((await module_json.read()).decode("utf-8"))
        full_data = json.loads((await full_course_json.read()).decode("utf-8"))
    except Exception:
        raise HTTPException(400, "Invalid JSON format in module_json/full_course_json")

    # Save images (preserve extension)
    img_path = IMAGE_DIR / f"img_{image.filename}"
    bg_path = IMAGE_DIR / f"bg_{background.filename}"

    with open(img_path, "wb") as f:
        f.write(await image.read())

    with open(bg_path, "wb") as f:
        f.write(await background.read())

    # Generate / reuse course_id
    existing = await service.get_by_domain_and_months(domain, months)
    course_id = existing.course_id if existing else generate_course_id(domain, months)

    # Minimal metadata
    for js in (module_data, full_data):
        js["courseId"] = course_id
        js["domain"] = domain
        js["durationMonths"] = months

    # Save JSON files
    module_file = SAVE_DIR / f"{course_id}_module.json"
    full_file = SAVE_DIR / f"{course_id}_full.json"

    module_file.write_text(json.dumps(module_data, indent=4), encoding="utf-8")
    full_file.write_text(json.dumps(full_data, indent=4), encoding="utf-8")

    # Save in DB (store relative paths)
    await service.upsert_course(
        course_id=course_id,
        domain=domain,
        months=months,
        title=title,
        description1=description1,
        highlight=highlight,
        description2=description2,
        closing=closing,
        rating=rating,
        price=price,
        offer_price=offer_price,
        image_file_path=rel(img_path),
        background_file_path=rel(bg_path),
        module_path=rel(module_file),
        full_path=rel(full_file),
    )

    return {
        "message": "Course created successfully",
        "course_id": course_id,
    }


# =====================================================================
# ✅ GET: Module API — Course Overview Screen
# =====================================================================
@router.get("/module/{course_id}", response_model=ModuleResponse)
async def get_module_details(course_id: str, db: AsyncSession = Depends(get_db)):
    service = CourseService(db)

    course = await service.get_by_course_id(course_id)
    if not course:
        raise HTTPException(404, "Course not found")

    module_abs = BASE_DIR / "app" / Path(course.module_file_path)
    if not module_abs.exists():
        raise HTTPException(500, "Module JSON missing on server")

    module_json = json.loads(module_abs.read_text(encoding="utf-8"))

    # Detect main block
    if "data" in module_json:
        data_block: Any = module_json["data"]
    elif "modules" in module_json:
        data_block = module_json["modules"]
    else:
        data_block = module_json

    return {
        "modules": {
            "title": course.title,
            "domain": course.domain,
            "duration_months": course.duration_months,
            "course_id": course.course_id,
            "description1": course.description1,
            "highlight": course.highlight,
            "description2": course.description2,
            "closing": course.closing,
            "rating": f"{course.rating}/5",
            "image": course.image_file_path.replace("\\", "/"),
            "background": course.background_file_path.replace("\\", "/"),
            "price": course.price,
            "offer_price": course.offer_price,
            "data": data_block,
        }
    }


# =====================================================================
# 🔥 Cached JSON Loader — Ultra-Fast Read
# =====================================================================
@lru_cache(maxsize=300)
def load_json_fast(path: str):
    """Fast JSON loader with caching."""
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


# =====================================================================
# ✅ GET: Full Structure API — Return JSON As-Is
# =====================================================================
@router.get("/structure/{course_id}", response_model=CourseStructureResponse)
async def get_course_structure(course_id: str, db: AsyncSession = Depends(get_db)):
    service = CourseService(db)

    course = await service.get_by_course_id(course_id)
    if not course:
        raise HTTPException(404, "Course not found")

    full_abs = BASE_DIR / "app" / Path(course.full_file_path)
    if not full_abs.exists():
        raise HTTPException(500, "Full course JSON missing on server")

    full_json = load_json_fast(str(full_abs))

    # Detect course block automatically (e.g. "python", "html")
    course_key = next((k for k, v in full_json.items() if isinstance(v, dict)), None)
    if not course_key:
        raise HTTPException(400, "Invalid full-course JSON format")

    menu_list = full_json[course_key].get("menu", [])

    # Count lessons having "path"
    total_lessons = sum(
        1
        for m in menu_list
        if isinstance(m, dict)
        for i in m.get("items", [])
        if isinstance(i, dict) and i.get("path")
    )

    return {
        "courseId": course.course_id,
        "totalLessons": total_lessons,
        "course": full_json,
    }


# =====================================================================
# ✅ GET: List All Courses — Fast Query
# =====================================================================
@router.get("/all", response_model=CourseListResponse)
async def list_all_courses(db: AsyncSession = Depends(get_db)):
    service = CourseService(db)

    async with service.get_manager() as manager:
        courses = await manager.read_all()

    return {
        "total": len(courses),
        "courses": [
            {
                "domain": c.domain,
                "duration_months": c.duration_months,
                "course_id": c.course_id,
            }
            for c in courses
        ]
    }


# =============================================================
# ✅ PUT: Full Update Course (form-data + optional files)
# =============================================================
@router.put("/update/{course_id}")
async def update_course(
    course_id: str,
    title: str = Form(...),
    description1: str = Form(...),
    highlight: str = Form(...),
    description2: str = Form(...),
    closing: str = Form(...),
    rating: float = Form(...),
    price: float = Form(...),
    offer_price: float = Form(...),
    domain: str = Form(...),
    months: int = Form(...),

    image: UploadFile = File(None),
    background: UploadFile = File(None),
    module_json: UploadFile = File(None),
    full_course_json: UploadFile = File(None),

    db: AsyncSession = Depends(get_db),
):
    service = CourseService(db)

    course = await service.get_by_course_id(course_id)
    if not course:
        raise HTTPException(404, "Course not found")

    # Update image if provided
    if image:
        img_path = IMAGE_DIR / f"img_{course_id}_{image.filename}"
        with open(img_path, "wb") as f:
            f.write(await image.read())
        course.image_file_path = rel(img_path)

    # Update background if provided
    if background:
        bg_path = IMAGE_DIR / f"bg_{course_id}_{background.filename}"
        with open(bg_path, "wb") as f:
            f.write(await background.read())
        course.background_file_path = rel(bg_path)

    # Update module JSON if provided
    if module_json:
        try:
            module_data = json.loads((await module_json.read()).decode("utf-8"))
        except Exception:
            raise HTTPException(400, "Invalid JSON in module_json")
        module_file = SAVE_DIR / f"{course_id}_module.json"
        module_file.write_text(json.dumps(module_data, indent=4), encoding="utf-8")
        course.module_file_path = rel(module_file)

    # Update full JSON if provided
    if full_course_json:
        try:
            full_data = json.loads((await full_course_json.read()).decode("utf-8"))
        except Exception:
            raise HTTPException(400, "Invalid JSON in full_course_json")
        full_file = SAVE_DIR / f"{course_id}_full.json"
        full_file.write_text(json.dumps(full_data, indent=4), encoding="utf-8")
        course.full_file_path = rel(full_file)

    # Update scalar fields
    course.title = title
    course.description1 = description1
    course.highlight = highlight
    course.description2 = description2
    course.closing = closing
    course.rating = rating
    course.price = price
    course.offer_price = offer_price
    course.domain = domain
    course.duration_months = months

    await db.commit()
    await db.refresh(course)

    return {"message": "Course updated successfully", "course_id": course_id}


# =============================================================
# ✅ PATCH: Partial Update Course (form-data + optional files)
# =============================================================
@router.patch("/patch/{course_id}")
async def patch_course(
    course_id: str,

    title: str = Form(None),
    description1: str = Form(None),
    highlight: str = Form(None),
    description2: str = Form(None),
    closing: str = Form(None),
    rating: float = Form(None),
    price: float = Form(None),
    offer_price: float = Form(None),
    domain: str = Form(None),
    months: int = Form(None),

    image: UploadFile = File(None),
    background: UploadFile = File(None),
    module_json: UploadFile = File(None),
    full_course_json: UploadFile = File(None),

    db: AsyncSession = Depends(get_db),
):
    service = CourseService(db)

    course = await service.get_by_course_id(course_id)
    if not course:
        raise HTTPException(404, "Course not found")

    # Partial scalar updates
    if title is not None:
        course.title = title
    if description1 is not None:
        course.description1 = description1
    if highlight is not None:
        course.highlight = highlight
    if description2 is not None:
        course.description2 = description2
    if closing is not None:
        course.closing = closing
    if rating is not None:
        course.rating = rating
    if price is not None:
        course.price = price
    if offer_price is not None:
        course.offer_price = offer_price
    if domain is not None:
        course.domain = domain
    if months is not None:
        course.duration_months = months

    # Optional file updates
    if image:
        img_path = IMAGE_DIR / f"img_{course_id}_patch_{image.filename}"
        with open(img_path, "wb") as f:
            f.write(await image.read())
        course.image_file_path = rel(img_path)

    if background:
        bg_path = IMAGE_DIR / f"bg_{course_id}_patch_{background.filename}"
        with open(bg_path, "wb") as f:
            f.write(await background.read())
        course.background_file_path = rel(bg_path)

    if module_json:
        try:
            module_data = json.loads((await module_json.read()).decode("utf-8"))
        except Exception:
            raise HTTPException(400, "Invalid JSON in module_json")
        module_file = SAVE_DIR / f"{course_id}_module.json"
        module_file.write_text(json.dumps(module_data, indent=4), encoding="utf-8")
        course.module_file_path = rel(module_file)

    if full_course_json:
        try:
            full_data = json.loads((await full_course_json.read()).decode("utf-8"))
        except Exception:
            raise HTTPException(400, "Invalid JSON in full_course_json")
        full_file = SAVE_DIR / f"{course_id}_full.json"
        full_file.write_text(json.dumps(full_data, indent=4), encoding="utf-8")
        course.full_file_path = rel(full_file)

    await db.commit()
    await db.refresh(course)

    return {"message": "Course patched successfully", "course_id": course_id}


# =====================================================================
# ❌ DELETE COURSE — Remove DB Record + JSON + Images
# =====================================================================
@router.delete("/delete/{course_id}")
async def delete_course(
    course_id: str,
    db: AsyncSession = Depends(get_db),
):
    service = CourseService(db)

    course = await service.get_by_course_id(course_id)
    if not course:
        raise HTTPException(404, "Course not found")

    # -----------------------------------------
    # DELETE FILES SAFELY
    # -----------------------------------------
    def safe_remove(path_str: str):
        if not path_str:
            return
        abs_path = BASE_DIR / "app" / Path(path_str)
        try:
            if abs_path.exists():
                abs_path.unlink()
        except Exception:
            # Don't block delete if file removal fails
            pass

    safe_remove(course.image_file_path)
    safe_remove(course.background_file_path)
    safe_remove(course.module_file_path)
    safe_remove(course.full_file_path)

    # -----------------------------------------
    # DELETE FROM DATABASE
    # -----------------------------------------
    async with service.get_manager() as manager:
        await manager.delete_by_attrs(course_id=course_id)

    return {
        "message": "Course deleted successfully",
        "course_id": course_id,
    }
