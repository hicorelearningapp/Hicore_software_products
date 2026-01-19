import json
import shutil
from pathlib import Path

QUIZ_DIR = Path(__file__).resolve().parent.parent.parent.parent / "data" / "quiz_certificate"


class QuizManager:

    # -----------------------------------------------
    # CHECK IF A QUIZ FILE ALREADY EXISTS
    # -----------------------------------------------
    @staticmethod
    def quiz_exists(course: str, level: str) -> bool:
        file_path = QUIZ_DIR / course.lower() / f"{level.lower()}.json"
        return file_path.exists()

    # -----------------------------------------------
    # SAVE / UPLOAD JSON QUIZ FILE
    # -----------------------------------------------
    @staticmethod
    def save_uploaded_quiz_file(course: str, level: str, content: bytes):
        course_dir = QUIZ_DIR / course.lower()
        course_dir.mkdir(parents=True, exist_ok=True)

        file_path = course_dir / f"{level.lower()}.json"

        with open(file_path, "wb") as f:
            f.write(content)

        return str(file_path)

    # -----------------------------------------------
    # READ JSON QUIZ FILE
    # -----------------------------------------------
    @staticmethod
    def get_quiz(course: str, level: str):
        file_path = QUIZ_DIR / course.lower() / f"{level.lower()}.json"

        if not file_path.exists():
            raise FileNotFoundError(f"Quiz not found: {file_path}")

        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)

    # -----------------------------------------------
    # UPDATE EXISTING QUIZ JSON FILE
    # -----------------------------------------------
    @staticmethod
    def update_quiz(course: str, level: str, new_json: dict):
        file_path = QUIZ_DIR / course.lower() / f"{level.lower()}.json"

        if not file_path.exists():
            raise FileNotFoundError("Quiz file not found")

        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(new_json, f, indent=4)

        return True

    # -----------------------------------------------
    # DELETE SINGLE QUIZ FILE
    # -----------------------------------------------
    @staticmethod
    def delete_quiz(course: str, level: str):
        file_path = QUIZ_DIR / course.lower() / f"{level.lower()}.json"

        if file_path.exists():
            file_path.unlink()
            return True

        raise FileNotFoundError("Quiz file does not exist")

    # -----------------------------------------------
    # DELETE COURSE FOLDER (ON COURSE DELETE)
    # -----------------------------------------------
    @staticmethod
    def delete_course_folder(course: str):
        course_dir = QUIZ_DIR / course.lower()

        if course_dir.exists():
            shutil.rmtree(course_dir)  # Delete folder + all quiz files
            return True

        return False

    # -----------------------------------------------
    # RENAME COURSE FOLDER (ON NAME CHANGE)
    # -----------------------------------------------
    @staticmethod
    def rename_course_folder(old_name: str, new_name: str):
        old_path = QUIZ_DIR / old_name.lower()
        new_path = QUIZ_DIR / new_name.lower()

        # No folder? nothing to rename
        if not old_path.exists():
            return

        # New folder exists already → conflict
        if new_path.exists():
            raise FileExistsError(f"Folder '{new_name}' already exists.")

        # Rename folder
        old_path.rename(new_path)
        return True
