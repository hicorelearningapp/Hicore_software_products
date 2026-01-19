import json
from app.core.logger import logger
import os
from typing import List, Dict, Optional
from fastapi import UploadFile, HTTPException
from app.modules.freshers_interview.managers import managers

# =====================================================================
# CREATE OR UPDATE WEEK
# =====================================================================
async def create_or_update_week(
    weekName: str,
    heading: str,
    subHeading: str,
    paragraph: str,
    bannerImage: UploadFile,
    card_titles: List[str],
    card_descriptions: List[str],
    card_bgcolors: List[str],
    card_topicIds: List[str],
    card_icons: List[UploadFile],
    card_files: List[UploadFile],
    nextWeek: Optional[str] = None,
    previousWeek: Optional[str] = None,
) -> Dict:

    logger.info(f"[create_or_update_week] Starting process for week: {weekName}")

    counts = [
        len(card_titles),
        len(card_descriptions),
        len(card_bgcolors),
        len(card_topicIds),
        len(card_icons),
        len(card_files),
    ]

    if len(set(counts)) != 1:
        logger.error(
            "[create_or_update_week] Card field length mismatch: %s",
            counts
        )
        raise HTTPException(status_code=400, detail="Card field counts do not match.")

    subfolder = weekName.replace(" ", "_").lower()
    logger.debug(f"[create_or_update_week] Using subfolder: {subfolder}")

    # -------------------------------------
    # Save banner
    # -------------------------------------
    try:
        banner_path = await managers.save_upload_file(bannerImage, subfolder=subfolder)
        logger.info(f"[create_or_update_week] Banner saved at: {banner_path}")
    except Exception:
        logger.exception(f"[create_or_update_week] Failed to save banner: {weekName}")
        raise HTTPException(status_code=500, detail="Failed to save banner image")

    # -------------------------------------
    # Save card uploads
    # -------------------------------------
    cards = []
    logger.debug(f"[create_or_update_week] Processing {len(card_titles)} cards")

    for i in range(len(card_titles)):
        try:
            icon_path = await managers.save_upload_file(card_icons[i], subfolder=subfolder)
            file_path = await managers.save_upload_file(card_files[i], subfolder=subfolder)
            logger.debug(
                f"[create_or_update_week] Card {i} uploaded. icon={icon_path}, file={file_path}"
            )
        except Exception:
            logger.exception(
                "[create_or_update_week] Failed card file save: week=%s index=%d",
                weekName, i
            )
            raise HTTPException(status_code=500, detail="Failed to save card files")

        cards.append({
            "icon": icon_path,
            "title": card_titles[i],
            "description": card_descriptions[i],
            "bgColor": card_bgcolors[i],
            "topicId": card_topicIds[i],
            "files": file_path,
        })

    week_key = weekName.lower().replace(" ", "")
    week_data = {
        "heading": heading,
        "subheading": subHeading,
        "paragraph": paragraph,
        "banner": banner_path,
        "weekName": weekName,
        "nextWeek": nextWeek,
        "previousWeek": previousWeek,
        "cards": cards,
    }

    logger.info(f"[create_or_update_week] Saving week data under key: {week_key}")

    all_weeks = managers.load_all_weeks()
    all_weeks[week_key] = week_data
    managers.save_all_weeks(all_weeks)

    logger.info(f"[create_or_update_week] Week '{weekName}' created/updated successfully")

    return week_data


# =====================================================================
# GET WEEK
# =====================================================================
def get_week(week_name: str) -> Dict:
    logger.info(f"[get_week] Fetching week: {week_name}")

    all_weeks = managers.load_all_weeks()
    key = week_name.lower().replace(" ", "")

    if key not in all_weeks:
        logger.warning(f"[get_week] Week not found: {week_name}")
        raise HTTPException(status_code=404, detail=f"Week '{week_name}' not found")

    logger.debug(f"[get_week] Week found with key: {key}")
    return all_weeks[key]


# =====================================================================
# GET ALL WEEKS
# =====================================================================
def get_all_weeks() -> Dict:
    logger.info("[get_all_weeks] Returning all week data")
    return managers.load_all_weeks()


# =====================================================================
# UPDATE WEEK (PARTIAL)
# =====================================================================
def update_week_partial(week_name: str, update_fields: Dict) -> Dict:
    logger.info(f"[update_week_partial] Updating week: {week_name}")

    all_weeks = managers.load_all_weeks()
    key = week_name.lower().replace(" ", "")

    if key not in all_weeks:
        logger.error(f"[update_week_partial] Week not found: {week_name}")
        raise HTTPException(status_code=404, detail=f"Week '{week_name}' not found")

    logger.debug(f"[update_week_partial] Fields to update: {update_fields}")

    all_weeks[key].update(update_fields)
    managers.save_all_weeks(all_weeks)

    logger.info(f"[update_week_partial] Week '{week_name}' updated successfully")

    return all_weeks[key]


# =====================================================================
# DELETE WEEK
# =====================================================================
def delete_week(week_name: str) -> None:
    logger.warning(f"[delete_week] Deleting week: {week_name}")

    all_weeks = managers.load_all_weeks()
    key = week_name.lower().replace(" ", "")

    if key not in all_weeks:
        logger.error(f"[delete_week] Week not found: {week_name}")
        raise HTTPException(status_code=404, detail=f"Week '{week_name}' not found")

    subfolder = week_name.replace(" ", "_").lower()

    try:
        managers.delete_folder_if_exists(subfolder)
        logger.info(f"[delete_week] Deleted assets for week: {week_name}")
    except Exception:
        logger.exception(f"[delete_week] Failed to delete assets folder for week {week_name}")

    del all_weeks[key]
    managers.save_all_weeks(all_weeks)

    logger.info(f"[delete_week] Week '{week_name}' removed successfully")


# =====================================================================
# GET CARD JSON FILE
# =====================================================================
def get_card_json(week_name: str, topic_id: str) -> Dict:
    logger.info(f"[get_card_json] Fetching card JSON for week={week_name}, topicId={topic_id}")

    week_data = get_week(week_name)
    card = next((c for c in week_data.get("cards", []) if c.get("topicId") == topic_id), None)

    if not card:
        logger.error(f"[get_card_json] Card not found: topicId={topic_id}")
        raise HTTPException(status_code=404, detail=f"Card with topicId '{topic_id}' not found")

    file_url = card.get("files")
    if not file_url:
        logger.error("[get_card_json] Card has no associated file")
        raise HTTPException(status_code=404, detail="Card has no associated file")

    local_path = managers.get_local_path_from_url(file_url)

    if not local_path or not os.path.exists(local_path):
        logger.error(f"[get_card_json] File not found: {local_path}")
        raise HTTPException(status_code=404, detail="Associated file not found on disk")

    logger.debug(f"[get_card_json] Reading file: {local_path}")

    # Try JSON parsing
    try:
        with open(local_path, "r", encoding="utf-8") as f:
            logger.info(f"[get_card_json] JSON file loaded successfully")
            return json.load(f)
    except json.JSONDecodeError:
        logger.warning(f"[get_card_json] File is not JSON, returning raw text")
        with open(local_path, "r", encoding="utf-8", errors="ignore") as f:
            return {"raw": f.read()}
    except Exception:
        logger.exception(f"[get_card_json] Failed to read card file: {local_path}")
        raise HTTPException(status_code=500, detail="Failed to read card file")
