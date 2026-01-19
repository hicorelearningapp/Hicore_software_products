from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Body
from app.modules.quiz.services.quiz_service import QuizService

router = APIRouter(prefix="/quiz", tags=["Quiz Certificate"])
service = QuizService()


# ------------------------------------------------
# ADD COURSE + UPLOAD JSON FILES
# ------------------------------------------------
@router.post("/course-with-files")
async def add_course_with_files(
    name: str = Form(...),
    description: str = Form(...),
    beginner: UploadFile = File(...),
    intermediate: UploadFile = File(...),
    advance: UploadFile = File(...)
):

    files = {
        "beginner": beginner,
        "intermediate": intermediate,
        "advance": advance
    }

    result = await service.add_course_with_files(name, description, files)
    return {"success": True, "data": result}


# ------------------------------------------------
# GET QUIZ CATALOG
# ------------------------------------------------
@router.get("/catalog")
async def get_quiz_catalog():
    catalog = await service.get_quiz_catalog()
    return {"success": True, "data": catalog["courses"]}


# ------------------------------------------------
# GET QUIZ FILE
# ------------------------------------------------
@router.get("/get-quiz")
async def get_quiz(
    user_id: int,
    item_type: str,
    item_id: str,
    course_name: str,
    level: str
):
    quiz_response = await service.get_quiz(
        user_id, item_type, item_id, course_name, level
    )
    return {"success": True, "data": quiz_response}


# ------------------------------------------------
# UPDATE COURSE
# ------------------------------------------------
@router.put("/update-course/{course_id}")
async def update_course(course_id: str, data: dict = Body(...)):
    result = await service.update_course(course_id, data)
    return {"success": True, "data": result}


# ------------------------------------------------
# DELETE COURSE
# ------------------------------------------------
@router.delete("/delete-course/{course_id}")
async def delete_course(course_id: str):
    return {"success": True, "data": await service.delete_course(course_id)}


# ------------------------------------------------
# UPDATE QUIZ JSON FILE
# ------------------------------------------------
@router.put("/update-quiz")
async def update_quiz(course: str, level: str, new_json: dict = Body(...)):
    return {
        "success": True,
        "data": await service.update_quiz_file(course, level, new_json)
    }


# ------------------------------------------------
# DELETE QUIZ JSON FILE
# ------------------------------------------------
@router.delete("/delete-quiz")
async def delete_quiz(course: str, level: str):
    return {
        "success": True,
        "data": await service.delete_quiz_file(course, level)
    }
