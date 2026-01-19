import json
from pathlib import Path

CATALOG_FILE = Path(__file__).resolve().parent.parent.parent.parent / "data" / "quiz_certificate" / "catalog.json"


class CatalogManager:

    # Load & Save
    @staticmethod
    def load_catalog():
        if not CATALOG_FILE.exists():
            return {"courses": []}
        with open(CATALOG_FILE, "r") as f:
            return json.load(f)

    @staticmethod
    def save_catalog(data):
        with open(CATALOG_FILE, "w") as f:
            json.dump(data, f, indent=4)

    # ID Generators
    @staticmethod
    def generate_course_id(name: str, index: int):
        return f"{index:03d}_{name.lower()}"

    @staticmethod
    def generate_quiz_id(course_id: str, level: str):
        return f"{course_id}_{level[0].upper()}"

    # -------------------------------
    # CREATE COURSE
    # -------------------------------
    @staticmethod
    def add_course(name: str, description: str, levels: list):
        catalog = CatalogManager.load_catalog()

        # -------------------------------
        # CHECK DUPLICATE COURSE NAME
        # -------------------------------
        for course in catalog["courses"]:
            if course["name"].lower() == name.lower():
                raise ValueError(f"Course '{name}' already exists")

        index = len(catalog["courses"]) + 1
        course_id = CatalogManager.generate_course_id(name, index)

        quizzes = []
        for lvl in levels:

            # ------------------------------------
            # CHECK DUPLICATE LEVEL FOR THIS COURSE
            # ------------------------------------
            for course in catalog["courses"]:
                if course["name"].lower() == name.lower():
                    existing_levels = [q["level"] for q in course["quizzes"]]
                    if lvl in existing_levels:
                        raise ValueError(f"Level '{lvl}' already exists for course '{name}'")

            quizzes.append({
                "level": lvl,
                "quiz_id": CatalogManager.generate_quiz_id(course_id, lvl),
                "item_type": "quiz_level",
                "course_name": name,
                "amount": 100
            })

        new_course = {
            "name": name,
            "id": course_id,
            "description": description,
            "quizzes": quizzes
        }

        catalog["courses"].append(new_course)
        CatalogManager.save_catalog(catalog)
        return new_course

    # -------------------------------
    # READ COURSE
    # -------------------------------
    @staticmethod
    def get_course(course_id: str):
        catalog = CatalogManager.load_catalog()
        for c in catalog["courses"]:
            if c["id"] == course_id:
                return c
        return None

    # -------------------------------
    # UPDATE COURSE
    # -------------------------------
    @staticmethod
    def update_course(course_id: str, update_data: dict):
        catalog = CatalogManager.load_catalog()

        for course in catalog["courses"]:
            if course["id"] == course_id:
                course.update(update_data)
                CatalogManager.save_catalog(catalog)
                return course

        raise ValueError("Course not found")

    # -------------------------------
    # DELETE COURSE
    # -------------------------------
    @staticmethod
    def delete_course(course_id: str):
        catalog = CatalogManager.load_catalog()

        updated_courses = [c for c in catalog["courses"] if c["id"] != course_id]
        catalog["courses"] = updated_courses

        CatalogManager.save_catalog(catalog)
        return True
