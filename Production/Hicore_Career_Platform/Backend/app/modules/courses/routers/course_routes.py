import json
import os
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from typing import Optional
from ..services.course_service import CourseService, get_service

router = APIRouter(prefix="/courses", tags=["Courses"])

# ---------------- Create Course ----------------
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
    image: UploadFile = File(...),
    background: UploadFile = File(...),
    module_json: UploadFile = File(...),
    full_course_json: UploadFile = File(...),
    service: CourseService = Depends(get_service)
):
    form = {
        "title": title,
        "description1": description1,
        "highlight": highlight,
        "description2": description2,
        "closing": closing,
        "rating": rating,
        "price": price,
        "offer_price": offer_price
    }
    files = {
        "image": image,
        "background": background,
        "module_json": module_json,
        "full_course_json": full_course_json
    }

    course = await service.create_course(form, files)
    return course.to_dict() if hasattr(course, "to_dict") else course.__dict__


# ---------------- Get All Courses ----------------
@router.get("/all")
async def get_all_courses(service: CourseService = Depends(get_service)):
    courses = await service.get_all_courses()
    return [c.to_dict() if hasattr(c, "to_dict") else c.__dict__ for c in courses]


# ---------------- Get Single Course ----------------
@router.get("/{course_id}")
async def get_course(course_id: str, service: CourseService = Depends(get_service)):
    course = await service.get_course_by_id(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course.to_dict() if hasattr(course, "to_dict") else course.__dict__


# ---------------- Update Course ----------------
@router.put("/update/{course_id}")
async def update_course(
    course_id: str,
    title: str | None = Form(None),
    description1: str | None = Form(None),
    highlight: str | None = Form(None),
    description2: str | None = Form(None),
    closing: str | None = Form(None),
    rating: float | None = Form(None),
    price: float | None = Form(None),
    offer_price: float | None = Form(None),
    image: UploadFile | None = File(None),
    background: UploadFile | None = File(None),
    module_json: UploadFile | None = File(None),
    full_course_json: UploadFile | None = File(None),
    service: CourseService = Depends(get_service)
):
    form = {
        "title": title,
        "description1": description1,
        "highlight": highlight,
        "description2": description2,
        "closing": closing,
        "rating": rating,
        "price": price,
        "offer_price": offer_price
    }
    files = {
        "image": image,
        "background": background,
        "module_json": module_json,
        "full_course_json": full_course_json
    }

    course = await service.update_course(course_id, form, files)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    return course.to_dict() if hasattr(course, "to_dict") else course.__dict__


# ---------------- Delete Course ----------------
@router.delete("/delete/{course_id}")
async def delete_course(course_id: str, service: CourseService = Depends(get_service)):
    result = await service.delete_course(course_id)
    if not result:
        raise HTTPException(status_code=404, detail="Course not found")
    return {"success": True, "message": f"Course {course_id} deleted successfully"}


@router.get("/full_course/{course_id}")
async def get_full_course_json(course_id: str, service: CourseService = Depends(get_service)):
    course = await service.get_course_by_id(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    # Build absolute path
    abs_path = os.path.join(os.getcwd(), "app", course.full_course_path)
    abs_path = os.path.normpath(abs_path)

    if not os.path.exists(abs_path):
        raise HTTPException(
            status_code=404,
            detail=f"Full course file not found: {abs_path}"
        )

    try:
        with open(abs_path, "r", encoding="utf-8") as f:
            full_course_data = json.load(f)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error reading full course JSON: {str(e)}"
        )

    # -------------------------------------------------------
    # 🔥 Count all lesson paths inside the course JSON
    # -------------------------------------------------------
    totalLessons = 0

    course_key = list(full_course_data.keys())[0]
    course_content = full_course_data[course_key]

    if "menu" in course_content:
        for module in course_content["menu"]:
            for item in module.get("items", []):
                if "path" in item:
                    totalLessons += 1

    # -------------------------------------------------------
    # 🔥 Return both full JSON + lesson count
    # -------------------------------------------------------
    return JSONResponse(content={
        "courseId": course_id,
        "totalLessons": totalLessons,
        "course": full_course_data
    })

# ---------------- Get Merged Module JSON ----------------
@router.get("/module/{course_id}")
async def get_module(course_id: str, service: CourseService = Depends(get_service)):
    module = await service.get_module_by_course(course_id)
    if not module:
        raise HTTPException(status_code=404, detail="Course or module not found")
    return module


# ---------------- Clear Cache ----------------
@router.delete("/cache/clear")
async def clear_cache(course_id: str | None = None, service: CourseService = Depends(get_service)):
    result = service.clear_cache(course_id)
    return {"success": result, "message": "Cache cleared successfully"}


# ---------------- Clear All Cache ----------------
@router.delete("/cache/clear_all")
async def clear_all_cache(service: CourseService = Depends(get_service)):
    result = service.clear_cache()
    return {"success": True, "message": "All course caches cleared successfully"}


