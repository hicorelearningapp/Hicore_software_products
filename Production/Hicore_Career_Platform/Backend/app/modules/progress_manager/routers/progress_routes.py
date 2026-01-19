from fastapi import APIRouter
from ..schemas.progress_schema import ProgressUpdate
from ..services.progress_service import ProgressService

router = APIRouter(prefix="/api/progress", tags=["Progress manager"])


# ---------------------------------------------------
# SAVE PROGRESS  (CREATE OR UPDATE)
# ---------------------------------------------------
@router.post("/progress")
def save_progress(data: ProgressUpdate):
    return ProgressService.save_progress(data)


# ---------------------------------------------------
# GET PROGRESS (userId + itemId + itemType)
# ---------------------------------------------------
@router.get("/progress")
def get_progress(userId: str, itemId: str, itemType: str):
    """
    Example:
    GET /api/progress?userId=12&itemId=HTML101&itemType=course
    """
    return ProgressService.get_progress(userId, itemId, itemType)


# ---------------------------------------------------
# GET ALL ITEMS FOR USER
# ---------------------------------------------------
@router.get("/all")
def get_all_items(userId: str):
    return ProgressService.get_all_items(userId)


# ---------------------------------------------------
# UPDATE PROGRESS
# ---------------------------------------------------
@router.put("/progress")
def update_progress(data: ProgressUpdate):
    return ProgressService.update_progress(data)


# ---------------------------------------------------
# DELETE ITEM PROGRESS (userId + itemId + itemType)
# ---------------------------------------------------
@router.delete("/progress")
def delete_item(userId: str, itemId: str, itemType: str):
    return ProgressService.delete_item(userId, itemId, itemType)


# ---------------------------------------------------
# DELETE USER (REMOVE ALL ITEMS)
# ---------------------------------------------------
@router.delete("/user")
def delete_user(userId: str):
    return ProgressService.delete_user(userId)
