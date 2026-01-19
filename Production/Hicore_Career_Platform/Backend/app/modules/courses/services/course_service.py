import os
import json
from fastapi import Depends, UploadFile
from cachetools import TTLCache

from ..models.course_model import Course
from app.core.services.db_service import DBService
from app.core.managers.sql_manager import SQLManager
from app.core.utils.file_manager import save_upload_file


# ---------------- Cached Stores ----------------
# Auto-expires after 24 hours (86400 sec)
# Stores up to 500 items to prevent memory overflow
course_cache = TTLCache(maxsize=500, ttl=86400)
module_cache = TTLCache(maxsize=500, ttl=86400)


class CourseService:
    """
    Async Service layer for Course operations using SQLManager + TTLCache.
    """

    def __init__(self, manager: SQLManager):
        self.manager = manager

    # ----------------------------------------------------------
    # Generate Unique Course ID
    # ----------------------------------------------------------
    async def generate_course_id(self):

        courses = await self.manager.read_all()

        if not courses:
            return "C001"

        try:
            last = max(courses, key=lambda c: int(c.course_id[1:]))
            num = int(last.course_id[1:]) + 1
            return f"C{num:03d}"
        except Exception:
            ids = [int(c.course_id[1:]) for c in courses if c.course_id[1:].isdigit()]
            next_id = max(ids) + 1 if ids else 1
            return f"C{next_id:03d}"

    # ----------------------------------------------------------
    # Get Course (TTLCache)
    # ----------------------------------------------------------
    async def get_course_by_id(self, course_id: str):

        # Cache hit
        if course_id in course_cache:
            return course_cache[course_id]

        # Cache miss → DB fetch
        course = await self.manager.get_by_attrs(course_id=course_id)
        if course:
            course_cache[course_id] = course

        return course

    # ----------------------------------------------------------
    async def get_all_courses(self):
        return await self.manager.read_all()

    # ----------------------------------------------------------
    # Create Course
    # ----------------------------------------------------------
    async def create_course(self, form: dict, files: dict):
        course_id = await self.generate_course_id()

        image_path = await self._save_optional_file(files.get("image"), "images", prefix=course_id)
        background_path = await self._save_optional_file(files.get("background"), "banners", prefix=course_id)
        module_path = await self._save_optional_file(files.get("module_json"), "modules", prefix=course_id)
        full_course_path = await self._save_optional_file(files.get("full_course_json"), "full_courses", prefix=course_id)

        data = {
            "course_id": course_id,
            "title": form.get("title"),
            "description1": form.get("description1"),
            "highlight": form.get("highlight"),
            "description2": form.get("description2"),
            "closing": form.get("closing"),
            "rating": float(form.get("rating", 0)),
            "price": float(form.get("price", 0)),
            "offer_price": float(form.get("offer_price", 0)),
            "image_path": image_path,
            "background_path": background_path,
            "module_path": module_path,
            "full_course_path": full_course_path,
        }

        course = await self.manager.create(data)

        # Remove old cache entries (just in case)
        course_cache.pop(course.course_id, None)
        module_cache.pop(course.course_id, None)

        return course

    # ----------------------------------------------------------
    # Update Course
    # ----------------------------------------------------------
    async def update_course(self, course_id: str, form: dict, files: dict):

        course = await self.get_course_by_id(course_id)
        if not course:
            return None

        # Update text fields
        updatable = [
            "title", "description1", "highlight",
            "description2", "closing", "rating",
            "price", "offer_price"
        ]
        for key in updatable:
            if form.get(key) is not None:
                setattr(course, key, form.get(key))

        # Update file fields
        if files.get("image"):
            course.image_path = await self._save_optional_file(files["image"], "images", prefix=course_id)
        if files.get("background"):
            course.background_path = await self._save_optional_file(files["background"], "banners", prefix=course_id)
        if files.get("module_json"):
            course.module_path = await self._save_optional_file(files["module_json"], "modules", prefix=course_id)
        if files.get("full_course_json"):
            course.full_course_path = await self._save_optional_file(files["full_course_json"], "full_courses", prefix=course_id)

        # Apply DB update
        await self.manager.update_by_attrs({"course_id": course_id}, {
            "title": course.title,
            "description1": course.description1,
            "highlight": course.highlight,
            "description2": course.description2,
            "closing": course.closing,
            "rating": course.rating,
            "price": course.price,
            "offer_price": course.offer_price,
            "image_path": course.image_path,
            "background_path": course.background_path,
            "module_path": course.module_path,
            "full_course_path": course.full_course_path,
        })

        # Update cache
        course_cache[course_id] = course
        module_cache.pop(course_id, None)

        return course

    # ----------------------------------------------------------
    # Delete Course
    # ----------------------------------------------------------
    async def delete_course(self, course_id: str):

        course = await self.get_course_by_id(course_id)
        if not course:
            return None

        await self.manager.delete(course_id)

        # Remove from cache
        course_cache.pop(course_id, None)
        module_cache.pop(course_id, None)

        return {"status": "deleted", "course_id": course_id}

    # ----------------------------------------------------------
    # Get Merged Module JSON
    # ----------------------------------------------------------
    async def get_module_by_course(self, course_id: str):

        # Cache hit
        if course_id in module_cache:
            return module_cache[course_id]

        course = await self.get_course_by_id(course_id)
        if not course:
            return {"error": "Course not found"}

        from pathlib import Path
        from app.core.utils.file_manager import BASE_UPLOAD_DIR

        if not course.module_path:
            return {"error": "Module path missing"}

        abs_module_path = (BASE_UPLOAD_DIR.parent / course.module_path).resolve()
        if not abs_module_path.exists():
            return {"error": "Module file not found"}

        with open(abs_module_path, "r", encoding="utf-8") as f:
            module_data = json.load(f)

        if not module_data:
            return {"error": "Module file is empty"}

        course_key = list(module_data.keys())[0]
        module_content = module_data[course_key]

        # Normalize module content
        if isinstance(module_content, str):
            module_content = {"content": module_content}
        elif not isinstance(module_content, dict):
            module_content = {"data": module_content}

        merged = {
            course_key: {
                "title": course.title,
                "course_id": course.course_id,
                "description1": course.description1,
                "highlight": course.highlight,
                "description2": course.description2,
                "closing": course.closing,
                "rating": f"{course.rating}/5",
                "image": course.image_path,
                "background": course.background_path,
                "price": course.price,
                "offer_price": course.offer_price,
                **module_content,
            }
        }

        module_cache[course_id] = merged
        return merged

    # ----------------------------------------------------------
    # Clear all or specific cache
    # ----------------------------------------------------------
    def clear_cache(self, course_id: str = None):
        if course_id:
            course_cache.pop(course_id, None)
            module_cache.pop(course_id, None)
            return True

        course_cache.clear()
        module_cache.clear()
        return True

    # ----------------------------------------------------------
    async def _save_optional_file(self, file: UploadFile, folder: str, prefix: str = None):
        if not file:
            return None
        return await save_upload_file(file, folder, prefix)


# Dependency for FastAPI
def get_service(manager: SQLManager = Depends(DBService.dependency(Course))):
    return CourseService(manager)
