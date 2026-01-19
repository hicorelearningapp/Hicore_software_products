from fastapi import HTTPException
from ..managers.catalog_manager import CatalogManager
from ..managers.quiz_manager import QuizManager


class QuizService:

    async def add_course_with_files(self, name: str, description: str, files: dict):

        levels = ["beginner", "intermediate", "advance"]

        try:
            new_course = CatalogManager.add_course(
                name=name,
                description=description,
                levels=levels
            )
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

        # Save uploaded json files
        for level, file in files.items():
            content = await file.read()

            if QuizManager.quiz_exists(name, level):
                raise HTTPException(
                    status_code=400,
                    detail=f"Quiz file for level '{level}' already exists"
                )

            QuizManager.save_uploaded_quiz_file(name, level, content)

        return {
            "message": "Course created successfully",
            "course": new_course
        }

    # ------------------------------------------------
    # FIXED: Return array, not {"courses": []}
    # ------------------------------------------------
    async def get_quiz_catalog(self):
        catalog = CatalogManager.load_catalog()
        return catalog  # <-- directly return list

    # ------------------------------------------------
    # FIXED: Wrap quiz in { access, quiz }
    # ------------------------------------------------
    async def get_quiz(self, user_id, item_type, item_id, course_name, level):

        try:
            quiz_content = QuizManager.get_quiz(course_name, level)

            return {
                "access": True,
                "quiz": quiz_content
            }

        except FileNotFoundError as e:
            raise HTTPException(status_code=404, detail=str(e))

    async def update_course(self, course_id: str, data: dict):
        try:
            updated = CatalogManager.update_course(course_id, data)
            return {"message": "Course updated", "course": updated}
        except ValueError as e:
            raise HTTPException(status_code=404, detail=str(e))

    async def delete_course(self, course_id: str):
        try:
            course = CatalogManager.get_course(course_id)
            if not course:
                raise HTTPException(status_code=404, detail="Course not found")

            course_name = course["name"]

            CatalogManager.delete_course(course_id)
            QuizManager.delete_course_folder(course_name)

            return {"message": "Course deleted successfully"}

        except Exception:
            raise HTTPException(status_code=404, detail="Course not found")

    async def update_quiz_file(self, course: str, level: str, new_json: dict):

        if not QuizManager.quiz_exists(course, level):
            raise HTTPException(
                status_code=404,
                detail=f"Quiz '{course}/{level}.json' not found"
            )

        QuizManager.update_quiz(course, level, new_json)

        return {"message": "Quiz file updated successfully"}

    async def delete_quiz_file(self, course: str, level: str):

        if not QuizManager.quiz_exists(course, level):
            raise HTTPException(
                status_code=404,
                detail=f"Quiz '{course}/{level}.json' does not exist"
            )

        QuizManager.delete_quiz(course, level)

        return {"message": "Quiz file deleted successfully"}
