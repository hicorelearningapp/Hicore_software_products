from typing import Any, Dict, List
from pydantic import BaseModel


# ============================================================
# Module (single course module view)
# ============================================================

class ModulePayload(BaseModel):
    title: str
    domain: str
    duration_months: int
    course_id: str
    description1: str
    highlight: str
    description2: str
    closing: str
    rating: str
    image: str
    background: str
    price: float
    offer_price: float
    data: Any

class ModuleResponse(BaseModel):
    modules: ModulePayload



# ============================================================
# Course Structure (full module – nested menu/items/lessons)
# ============================================================

class CourseStructureResponse(BaseModel):
    courseId: str
    totalLessons: int
    course: Dict[str, Any]


# ============================================================
# Course List
# ============================================================

class CourseListItem(BaseModel):
    domain: str
    duration_months: int
    course_id: str


class CourseListResponse(BaseModel):
    total: int
    courses: List[CourseListItem]
