import os
import json
import uuid
import aiofiles
import shutil
from app.core.logger import logger
from pathlib import Path
from fastapi import UploadFile, HTTPException
from typing import Dict, Optional, Any, List

# ---------- Paths ----------
BASE_DIR = Path("app/uploads")
WEEK_DATA_DIR = BASE_DIR / "week_data"
ALL_WEEKS_FILE = WEEK_DATA_DIR / "all_weeks.json"
IMAGE_DIR = BASE_DIR / "static" / "images" / "freshers-program"

# Create directories if missing
WEEK_DATA_DIR.mkdir(parents=True, exist_ok=True)
IMAGE_DIR.mkdir(parents=True, exist_ok=True)


# ============================================================
# 🔍 JSON FILE HANDLING
# ============================================================
def load_all_weeks() -> Dict:
    """Load master JSON file (all weeks)."""
    logger.debug("[load_all_weeks] Loading all_weeks.json")

    if not ALL_WEEKS_FILE.exists():
        logger.warning("[load_all_weeks] File not found, returning empty dict")
        return {}

    try:
        with ALL_WEEKS_FILE.open("r", encoding="utf-8") as f:
            data = json.load(f)
            logger.info("[load_all_weeks] Successfully loaded week data")
            return data
    except json.JSONDecodeError:
        logger.error("[load_all_weeks] Invalid JSON in all_weeks.json", exc_info=True)
        return {}
    except Exception:
        logger.exception("[load_all_weeks] Unexpected error while loading JSON")
        return {}


def save_all_weeks(data: Dict) -> None:
    """Persist master JSON file atomically."""
    logger.debug("[save_all_weeks] Saving updated week JSON")

    tmp = ALL_WEEKS_FILE.with_suffix(".tmp")
    try:
        with tmp.open("w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        tmp.replace(ALL_WEEKS_FILE)
        logger.info("[save_all_weeks] Successfully saved all_weeks.json")
    except Exception:
        logger.exception("[save_all_weeks] Failed to write all_weeks.json")
        raise


# ============================================================
# 📂 FILE OPERATIONS
# ============================================================
async def save_upload_file(upload: UploadFile, subfolder: str) -> str:
    """
    Save UploadFile to:
    app/uploads/static/images/freshers-program/<subfolder>/
    Returns relative URL path.
    """
    logger.info(f"[save_upload_file] Saving file '{upload.filename}' under subfolder '{subfolder}'")

    safe_sub = subfolder.replace(" ", "_").lower()
    folder = IMAGE_DIR / safe_sub
    folder.mkdir(parents=True, exist_ok=True)

    filename = f"{uuid.uuid4().hex}_{os.path.basename(upload.filename)}"
    file_path = folder / filename

    try:
        async with aiofiles.open(file_path, "wb") as out:
            content = await upload.read()
            await out.write(content)
        logger.info(f"[save_upload_file] File saved at: {file_path}")
    except Exception:
        logger.error(f"[save_upload_file] Failed to save upload {upload.filename}", exc_info=True)
        raise

    return f"/static/images/freshers-program/{safe_sub}/{filename}"


def get_local_path_from_url(url: str) -> Optional[str]:
    """Convert URL path → local filesystem path."""
    logger.debug(f"[get_local_path_from_url] Converting URL: {url}")

    if not url:
        logger.warning("[get_local_path_from_url] Received empty URL")
        return None

    converted = str(BASE_DIR / url.lstrip("/"))
    logger.debug(f"[get_local_path_from_url] Converted to local path: {converted}")
    return converted


def delete_folder_if_exists(subfolder: str) -> None:
    """Delete folder under IMAGE_DIR/<subfolder>."""
    safe_sub = subfolder.replace(" ", "_").lower()
    folder = IMAGE_DIR / safe_sub

    if folder.exists() and folder.is_dir():
        logger.warning(f"[delete_folder_if_exists] Deleting folder: {folder}")
        try:
            shutil.rmtree(folder)
            logger.info(f"[delete_folder_if_exists] Deleted folder {folder}")
        except Exception:
            logger.exception(f"[delete_folder_if_exists] Failed to delete {folder}")
            raise


# ============================================================
# 🧩 CRUD OPERATIONS FOR WEEK DATA
# ============================================================
def create_or_update_week(week_name: str, week_data: Dict) -> Dict:
    logger.info(f"[create_or_update_week] Creating/updating week '{week_name}'")

    all_weeks = load_all_weeks()
    all_weeks[week_name] = week_data
    save_all_weeks(all_weeks)

    return {
        "message": f"✅ {week_name} added/updated successfully!",
        "json_path": str(ALL_WEEKS_FILE),
        "data": week_data
    }


def get_week(week_name: str) -> Dict:
    logger.info(f"[get_week] Fetching week '{week_name}'")

    all_weeks = load_all_weeks()
    if week_name not in all_weeks:
        logger.warning(f"[get_week] Week '{week_name}' not found")
        raise HTTPException(status_code=404, detail=f"Week '{week_name}' not found")

    logger.info(f"[get_week] Successfully loaded week '{week_name}'")
    return all_weeks[week_name]


def delete_week(week_name: str) -> Dict:
    logger.warning(f"[delete_week] Deleting week '{week_name}'")

    all_weeks = load_all_weeks()
    if week_name not in all_weeks:
        logger.error(f"[delete_week] Week '{week_name}' not found")
        raise HTTPException(status_code=404, detail=f"Week '{week_name}' not found")

    deleted_data = all_weeks.pop(week_name)
    save_all_weeks(all_weeks)

    delete_folder_if_exists(week_name)

    logger.info(f"[delete_week] Successfully deleted week '{week_name}'")

    return {
        "message": f"🗑️ Week '{week_name}' deleted successfully!",
        "deleted": deleted_data
    }


def get_all_weeks() -> List[str]:
    logger.debug("[get_all_weeks] Listing all week names")

    all_weeks = load_all_weeks()
    week_keys = list(all_weeks.keys())

    logger.info(f"[get_all_weeks] Found {len(week_keys)} weeks")
    return week_keys


def get_card_json_data(week_name: str, topic_id: str) -> Dict:
    logger.info(f"[get_card_json_data] Fetching card JSON for {week_name}/{topic_id}")

    all_weeks = load_all_weeks()
    week_data = all_weeks.get(week_name)

    if not week_data:
        logger.warning(f"[get_card_json_data] Week '{week_name}' not found")
        raise HTTPException(status_code=404, detail=f"Week '{week_name}' not found")

    cards = week_data.get("cards", [])
    selected_card = next((card for card in cards if card.get("topicId") == topic_id), None)

    if not selected_card:
        logger.error(f"[get_card_json_data] topicId '{topic_id}' not found in week '{week_name}'")
        raise HTTPException(status_code=404, detail=f"Card with topicId '{topic_id}' not found")

    file_path = selected_card.get("files")
    if not file_path:
        logger.error("[get_card_json_data] 'files' field missing in selected card")
        raise HTTPException(status_code=404, detail="No 'files' field in this card")

    local_path = get_local_path_from_url(file_path)

    if not os.path.exists(local_path):
        logger.error(f"[get_card_json_data] File does not exist: {local_path}")
        raise HTTPException(status_code=404, detail=f"File not found: {local_path}")

    try:
        with open(local_path, "r", encoding="utf-8") as f:
            file_data = json.load(f)
            logger.info(f"[get_card_json_data] Successfully loaded file JSON for {topic_id}")
    except Exception as e:
        logger.exception(f"[get_card_json_data] Failed to read file JSON: {local_path}")
        raise HTTPException(status_code=500, detail=f"Failed to read file JSON: {str(e)}")

    return {
        "message": f"Retrieved data for {week_name} - {topic_id}",
        "week": week_name,
        "topicId": topic_id,
        "file": file_path,
        "data": file_data
    }
