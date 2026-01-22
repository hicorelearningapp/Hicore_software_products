#app/modules/exams/services/upload_service.py
from typing import Dict, Any
from fastapi import HTTPException, UploadFile
import copy
import logging
import os

from app.database.json_writer import LocalJSONWriter


logger = logging.getLogger(__name__)


class UploadService:
    """
    Business logic for handling JSON + asset uploads safely.
    Rules:
      - Only whitelisted JSON filenames allowed
      - Prevent path traversal
      - PATCH = deep merge
      - Clear HTTP-safe errors
    """

    ALLOWED_JSON_FILES = {
        "homepage.json",
        "examDetail.json",
        "overview.json",
        "learn.json",
        "practice.json",
        "test.json",
        "revision.json",
    }

    ALLOWED_IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".svg", ".webp"}
    MAX_UPLOAD_MB = 50

    HOMEPAGE_FILE = "homepage.json"

    def __init__(self, data_root: str):
        self.writer = LocalJSONWriter(data_root)

    # ---------- base helpers ---------- #

    def _safe_join(self, *parts: str) -> str:
        path = os.path.normpath("/".join(parts))
        if ".." in path.split("/"):
            raise HTTPException(400, "Invalid path")
        return path

    def _validate_json_filename(self, filename: str):
        if filename not in self.ALLOWED_JSON_FILES:
            raise HTTPException(400, f"Unsupported JSON file: {filename}")

    def _deep_update(self, original: Dict[str, Any], updates: Dict[str, Any]) -> Dict[str, Any]:
        result = copy.deepcopy(original)
        for key, value in updates.items():
            if isinstance(result.get(key), dict) and isinstance(value, dict):
                result[key] = self._deep_update(result[key], value)
            else:
                result[key] = value
        return result

    def _validate_file_size(self, file: UploadFile):
        file.file.seek(0, os.SEEK_END)
        size = file.file.tell()
        file.file.seek(0)
        if size > self.MAX_UPLOAD_MB * 1024 * 1024:
            raise HTTPException(413, "File too large")

    # ---------- JSON uploads ---------- #

    def upload_json_file(self, path: str, filename: str, file: UploadFile):
        self._validate_json_filename(filename)
        self._validate_file_size(file)

        relative = self._safe_join("general", path, filename) if path else filename
        self.writer.write_json_file(relative, file.file)

        logger.info("JSON uploaded: %s", relative)
        return {"status": "success", "saved_to": relative}

    def upload_json_body(self, path: str, filename: str, payload: Dict[str, Any]):
        self._validate_json_filename(filename)

        relative = self._safe_join("general", path, filename) if path else filename
        self.writer.write_json(relative, payload)

        return {"status": "success", "saved_to": relative}

    def put_json_body(self, path: str, filename: str, payload: Dict[str, Any]):
        self._validate_json_filename(filename)

        relative = self._safe_join("general", path, filename) if path else filename
        self.writer.write_json(relative, payload)

        return {"status": "replaced", "saved_to": relative}

    def patch_json_body(self, path: str, filename: str, payload: Dict[str, Any]):
        self._validate_json_filename(filename)

        relative = self._safe_join("general", path, filename) if path else filename

        try:
            existing = self.writer.read_json(relative)
        except FileNotFoundError:
            raise HTTPException(404, "JSON file not found")

        merged = self._deep_update(existing, payload)
        self.writer.write_json(relative, merged)

        return {"status": "patched", "saved_to": relative}

    def delete_json(self, path: str, filename: str):
        self._validate_json_filename(filename)

        relative = self._safe_join("general", path, filename) if path else filename
        self.writer.delete_file(relative)

        return {"status": "deleted", "deleted_from": relative}

    # ---------- asset uploads ---------- #

    def upload_asset(self, asset_path: str, file: UploadFile):
        ext = "." + file.filename.split(".")[-1].lower()

        if ext not in self.ALLOWED_IMAGE_EXTENSIONS:
            raise HTTPException(400, "Unsupported asset type")

        self._validate_file_size(file)

        relative = self._safe_join("assets", asset_path, file.filename)
        self.writer.write_asset(relative, file.file)

        logger.info("Asset uploaded: %s", relative)
        return {"status": "success", "saved_to": relative}

    def delete_asset(self, asset_path: str, filename: str):
        relative = self._safe_join("assets", asset_path, filename)
        self.writer.delete_file(relative)

        return {"status": "deleted", "deleted_from": relative}

    # ---------- course folder operations ---------- #

    def create_course(self, course_id: str):
        try:
            self.writer.create_course_folder(course_id)
        except FileExistsError as e:
            raise HTTPException(409, str(e))

        return {"status": "created", "course": course_id, "path": f"general/{course_id}"}

    def delete_course(self, course_id: str):
        try:
            self.writer.delete_course_folder(course_id)
        except FileNotFoundError as e:
            raise HTTPException(404, str(e))

        return {"status": "deleted", "course": course_id, "path": f"general/{course_id}"}

    def _load_homepage(self) -> Dict[str, Any]:
        try:
            return self.writer.read_json(self.HOMEPAGE_FILE)
        except FileNotFoundError:
            return {}

    def _save_homepage(self, data: Dict[str, Any]):
        self.writer.write_json(self.HOMEPAGE_FILE, data)

    def _find_category(self, categories, name):
        for c in categories:
            if c["name"] == name:
                return c
        return None

    def _find_exam(self, exams, exam_id):
        for e in exams:
            if e["id"] == exam_id:
                return e
        return None

    def _ensure_course_folder(self, exam_id: str):
        """
        Create course folder if it does not exist.
        Safe to call multiple times.
        """
        try:
            self.writer.create_course_folder(exam_id)
            logger.info("Created course folder: general/%s", exam_id)
        except FileExistsError:
            pass  # idempotent


    def _delete_course_folder_safe(self, exam_id: str):
        """
        Delete course folder if it exists.
        """
        try:
            self.writer.delete_course_folder(exam_id)
            logger.info("Deleted course folder: general/%s", exam_id)
        except FileNotFoundError:
            pass  # already gone


    def add_homepage_exam(self, payload: Dict[str, Any]):
        domain = payload["domain"]
        title = payload["title"]
        category_name = payload["category"]
        exam_id = payload["exam_id"]
        label = payload["label"]

        homepage = self._load_homepage()

        # domain
        if domain not in homepage:
            homepage[domain] = {
                "title": title,
                "categories": []
            }

        domain_block = homepage[domain]
        domain_block["title"] = title  # keep in sync

        # category
        category = self._find_category(domain_block["categories"], category_name)
        if not category:
            category = {"name": category_name, "exams": []}
            domain_block["categories"].append(category)

        # exam
        if not self._find_exam(category["exams"], exam_id):
            category["exams"].append({
                "id": exam_id,
                "label": label
            })

        self._save_homepage(homepage)

        #ensures course folder exists
        self._ensure_course_folder(exam_id)

        return {"status": "created", "exam": exam_id}

    def replace_homepage_exam(self, payload: Dict[str, Any]):
        homepage = self._load_homepage()

        domain = payload["domain"]
        category_name = payload["category"]
        exam_id = payload["exam_id"]
        label = payload["label"]

        try:
            category = self._find_category(homepage[domain]["categories"], category_name)
            exam = self._find_exam(category["exams"], exam_id)
            exam["label"] = label
        except Exception:
            raise HTTPException(404, "Homepage exam not found")

        self._save_homepage(homepage)
        return {"status": "replaced", "exam": exam_id}

    def patch_homepage_exam(self, payload: Dict[str, Any]):
        homepage = self._load_homepage()

        domain = payload["domain"]
        category_name = payload["category"]
        exam_id = payload["exam_id"]

        if domain not in homepage:
            raise HTTPException(404, f"Domain '{domain}' not found in homepage")

        category = self._find_category(homepage[domain]["categories"], category_name)
        if not category:
            raise HTTPException(404, f"Category '{category_name}' not found under domain '{domain}'")

        exam = self._find_exam(category["exams"], exam_id)
        if not exam:
            raise HTTPException(404, f"Exam '{exam_id}' not found under category '{category_name}'")

        if "label" in payload:
            exam["label"] = payload["label"]

        self._save_homepage(homepage)
        return {"status": "patched", "exam": exam_id}

    def delete_homepage_exam(self, payload: Dict[str, Any]):
        homepage = self._load_homepage()

        domain = payload["domain"]
        category_name = payload["category"]
        exam_id = payload["exam_id"]

        try:
            domain_block = homepage[domain]
            category = self._find_category(domain_block["categories"], category_name)
            category["exams"] = [
                e for e in category["exams"] if e["id"] != exam_id
            ]

            if not category["exams"]:
                domain_block["categories"].remove(category)

            if not domain_block["categories"]:
                del homepage[domain]

        except Exception:
            raise HTTPException(404, "Homepage exam not found")

        self._save_homepage(homepage)

        #deletes course folder
        self._delete_course_folder_safe(exam_id)

        return {"status": "deleted", "exam": exam_id}

    def add_homepage_domain(self, domain: str, title: str):
        homepage = self._load_homepage()

        if domain in homepage:
            raise HTTPException(409, "Domain already exists")

        homepage[domain] = {
            "title": title,
            "categories": []
        }

        self._save_homepage(homepage)
        return {"status": "created", "domain": domain}

    def replace_homepage_domain(self, domain: str, title: str):
        homepage = self._load_homepage()

        if domain not in homepage:
            raise HTTPException(404, "Domain not found")

        homepage[domain]["title"] = title
        self._save_homepage(homepage)

        return {"status": "replaced", "domain": domain}

    def patch_homepage_domain(self, domain: str, title: str):
        homepage = self._load_homepage()

        if domain not in homepage:
            raise HTTPException(404, "Domain not found")

        homepage[domain]["title"] = title
        self._save_homepage(homepage)

        return {"status": "patched", "domain": domain}

    def delete_homepage_domain(self, domain: str):
        homepage = self._load_homepage()

        if domain not in homepage:
            raise HTTPException(404, "Domain not found")

        del homepage[domain]
        self._save_homepage(homepage)

        return {"status": "deleted", "domain": domain}

    def add_homepage_category(self, domain: str, category: str):
        homepage = self._load_homepage()

        if domain not in homepage:
            raise HTTPException(404, "Domain not found")

        categories = homepage[domain]["categories"]

        if self._find_category(categories, category):
            raise HTTPException(409, "Category already exists")

        categories.append({
            "name": category,
            "exams": []
        })

        self._save_homepage(homepage)
        return {"status": "created", "category": category}

    def replace_homepage_category(self, domain: str, old_name: str, new_name: str):
        homepage = self._load_homepage()

        try:
            category = self._find_category(homepage[domain]["categories"], old_name)
            category["name"] = new_name
        except Exception:
            raise HTTPException(404, "Category not found")

        self._save_homepage(homepage)
        return {"status": "replaced", "category": new_name}

    def patch_homepage_category(self, domain: str, category: str, new_name: str):
        return self.replace_homepage_category(domain, category, new_name)

    def delete_homepage_category(self, domain: str, category: str):
        homepage = self._load_homepage()

        try:
            domain_block = homepage[domain]
            category_obj = self._find_category(domain_block["categories"], category)
            domain_block["categories"].remove(category_obj)
        except Exception:
            raise HTTPException(404, "Category not found")

        self._save_homepage(homepage)
        return {"status": "deleted", "category": category}
