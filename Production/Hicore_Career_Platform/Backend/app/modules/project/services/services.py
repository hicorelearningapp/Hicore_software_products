import os
import json
import logging
from typing import Optional, List, Dict
from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import aiofiles
import aiofiles.os
from pathlib import Path

# ------------------- CONFIG -------------------

# ✅ BASE_DIR points to your project root (includes "app")
BASE_DIR = Path(__file__).resolve().parents[3]
UPLOAD_DIR = BASE_DIR / "app" / "uploads" / "projects"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_JSON_FILES = ["system_requirement", "srs", "design", "coding", "testing", "report"]

logger = logging.getLogger("project_service")
logging.basicConfig(level=logging.INFO)


# ------------------- SERVICE -------------------
class ProjectService:

    TYPE_PREFIX = {
        "internship_projects": "PI",
        "mini_projects": "PMI",
        "major_projects": "PMA",
        "final_year_projects": "PF"
    }

    # ------------------- ID GENERATION -------------------
    async def generate_project_id(self, session: AsyncSession, model) -> str:
        table_name = model.__tablename__
        prefix = self.TYPE_PREFIX.get(table_name, "PP")
        try:
            result = await session.execute(select(model.id))
            all_ids = [row[0] for row in result.fetchall() if row[0].startswith(prefix)]
            if not all_ids:
                return f"{prefix}1"
            nums = [int(id.replace(prefix, "")) for id in all_ids]
            new_id = max(nums) + 1
            return f"{prefix}{new_id}"
        except Exception as e:
            logger.error(f"[generate_project_id] Error generating ID: {e}")
            raise

    # ------------------- FILE HELPERS -------------------
    def _to_public_path(self, path: str) -> str:
        """Convert full file path to clean public-style path."""
        try:
            relative_path = os.path.relpath(path, BASE_DIR)
            clean_path = relative_path.replace("\\", "/")
            return clean_path  # e.g. uploads/projects/PI7/image_PI7.json
        except Exception as e:
            logger.error(f"[to_public_path] Error converting path: {e}")
            return path

    # ------------------- FILE SAVE -------------------
    async def save_files(
        self,
        project_id: str,
        files: Dict[str, Optional[UploadFile]],
        tools: Optional[List[str]] = None,
        techStack: Optional[List[str]] = None,
        mentor: Optional[str] = None
    ) -> Dict:
        """Save uploaded files and meta data for a project asynchronously."""
        folder = os.path.join(UPLOAD_DIR, project_id)
        await aiofiles.os.makedirs(folder, exist_ok=True)
        logger.info(f"[save_files] Saving files to {folder}")

        saved_files = {}

        for key, file in files.items():
            if not file:
                continue

            ext = os.path.splitext(file.filename)[1]
            safe_filename = f"{key}_{project_id}{ext}"
            path = os.path.join(folder, safe_filename)

            try:
                if key in ALLOWED_JSON_FILES:
                    content = await file.read()
                    data = json.loads(content.decode("utf-8"))
                    async with aiofiles.open(path, "w", encoding="utf-8") as f:
                        await f.write(json.dumps(data, ensure_ascii=False, indent=2))
                    logger.info(f"[save_files] Saved JSON file: {path}")

                elif key == "image":
                    async with aiofiles.open(path, "wb") as f:
                        await f.write(await file.read())
                    logger.info(f"[save_files] Saved image: {path}")

                # ✅ Return clean public path
                saved_files[key] = self._to_public_path(path)

            except Exception as e:
                logger.error(f"[save_files] Error saving {key}: {e}")
                continue

        # Save meta asynchronously
        meta = {"tools": tools or [], "techStack": techStack or [], "mentor": mentor}
        meta_path = os.path.join(folder, f"meta_{project_id}.json")
        try:
            async with aiofiles.open(meta_path, "w", encoding="utf-8") as f:
                await f.write(json.dumps(meta, ensure_ascii=False, indent=2))
            logger.info(f"[save_files] Saved meta: {meta_path}")
        except Exception as e:
            logger.error(f"[save_files] Error saving meta for {project_id}: {e}")

        saved_files.update(meta)
        return saved_files

    # ------------------- FILE LOAD -------------------
    async def load_files(self, project_id: str) -> Dict:
        """Load files and metadata asynchronously."""
        folder = os.path.join(UPLOAD_DIR, project_id)
        saved_files = {key: None for key in ALLOWED_JSON_FILES + ["tools", "techStack", "mentor", "image"]}

        if not os.path.exists(folder):
            logger.warning(f"[load_files] Folder not found: {folder}")
            return saved_files

        try:
            # Load JSON project files
            for key in ALLOWED_JSON_FILES:
                path = os.path.join(folder, f"{key}_{project_id}.json")
                if os.path.exists(path):
                    async with aiofiles.open(path, "r", encoding="utf-8") as f:
                        content = await f.read()
                        saved_files[key] = json.loads(content)
                        saved_files[key + "_path"] = self._to_public_path(path)

            # Load metadata
            meta_path = os.path.join(folder, f"meta_{project_id}.json")
            if os.path.exists(meta_path):
                async with aiofiles.open(meta_path, "r", encoding="utf-8") as f:
                    content = await f.read()
                    saved_files.update(json.loads(content))

            # Load image file path
            for f in os.listdir(folder):
                if f.startswith("image_"):
                    image_path = os.path.join(folder, f)
                    saved_files["image"] = self._to_public_path(image_path)

        except Exception as e:
            logger.error(f"[load_files] Error loading files for {project_id}: {e}")

        return saved_files

    # ------------------- FILE DELETE -------------------
    async def delete_files(self, project_id: str):
        folder = os.path.join(UPLOAD_DIR, project_id)
        if os.path.exists(folder):
            try:
                for f in os.listdir(folder):
                    await aiofiles.os.remove(os.path.join(folder, f))
                await aiofiles.os.rmdir(folder)
                logger.info(f"[delete_files] Deleted folder: {folder}")
            except Exception as e:
                logger.error(f"[delete_files] Error deleting folder {folder}: {e}")

    # ------------------- DATABASE -------------------
    async def get_project(self, session: AsyncSession, model, project_id: str):
        try:
            return await session.get(model, project_id)
        except Exception as e:
            logger.error(f"[get_project] Error fetching project {project_id}: {e}")
            return None

    async def update_project(
        self,
        session: AsyncSession,
        model,
        project_id: str,
        update_data: dict,
        files_data: Optional[Dict] = None
    ):
        try:
            project = await session.get(model, project_id)
            if not project:
                return None

            for key, value in update_data.items():
                setattr(project, key, value)

            if files_data:
                if "image" in files_data:
                    project.image = files_data["image"]
                if "tools" in files_data:
                    project.tools = json.dumps(files_data["tools"])
                if "techStack" in files_data:
                    project.techStack = json.dumps(files_data["techStack"])
                if "mentor" in files_data:
                    project.mentor = files_data["mentor"]

            await session.commit()
            await session.refresh(project)
            return project
        except Exception as e:
            logger.error(f"[update_project] Error updating project {project_id}: {e}")
            return None

    async def delete_project(self, session: AsyncSession, model, project_id: str):
        try:
            project = await session.get(model, project_id)
            if not project:
                return None
            await self.delete_files(project_id)
            await session.delete(project)
            await session.commit()
            return project
        except Exception as e:
            logger.error(f"[delete_project] Error deleting project {project_id}: {e}")
            return None
