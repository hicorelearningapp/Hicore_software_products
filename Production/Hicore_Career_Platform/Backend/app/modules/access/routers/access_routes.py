# app/modules/access/routers/access_router.py

from fastapi import APIRouter, Depends, HTTPException, status
from app.modules.access.managers.access_manager import AccessManager
from app.modules.access.schemas.access_schema import AccessCreate
from app.core.dependencies import get_access_manager

router = APIRouter(prefix="/access", tags=["Access Management"])


# ============================================================
# Grant Access (with progress initialization)
# ============================================================
@router.post("/grant", response_model=dict)
async def grant_access(
    data: AccessCreate,
    access_manager: AccessManager = Depends(get_access_manager),
):
    """
    Grant access for a user to a specific item using JSON storage.
    Automatically initializes progress (0%).
    """
    try:
        return await access_manager.grant_access(data)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


# ============================================================
# Check Access
# ============================================================
@router.get("/check", response_model=dict)
async def check_access(
    user_id: int,
    item_type: str,
    item_id: str,
    access_manager: AccessManager = Depends(get_access_manager),
):
    """
    Check if a user has access to an item — JSON storage version.
    """
    try:
        has_access = await access_manager.check_access(user_id, item_type, item_id)
        return {
            "user_id": user_id,
            "item_type": item_type,
            "item_id": item_id,
            "has_access": has_access,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


# ============================================================
# Revoke Access (also resets progress)
# ============================================================
@router.delete("/revoke", response_model=dict)
async def revoke_access(
    user_id: int,
    item_type: str,
    item_id: str,
    access_manager: AccessManager = Depends(get_access_manager),
):
    """
    Revoke access + reset progress using JSON storage.
    """
    try:
        return await access_manager.revoke_access(user_id, item_type, item_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


# ============================================================
# List All Access for a User
# ============================================================
@router.get("/list/{user_id}", response_model=dict)
async def list_access(
    user_id: int,
    access_manager: AccessManager = Depends(get_access_manager),
):
    """
    List all access entries for a user from JSON file.
    """
    try:
        access_list = await access_manager.list_access(user_id)

        return {
            "status": "success",
            "count": len(access_list),
            "data": [
                {
                    "item_type": access["item_type"],
                    "item_id": access["item_id"],
                    "status": access["status"],
                }
                for access in access_list
            ],
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )

@router.delete("/delete-by-type", response_model=dict)
async def delete_by_item_type(
    user_id: int,
    item_type: str,
    access_manager: AccessManager = Depends(get_access_manager)
):
    """
    Delete all access entries for a user by item_type.
    Example:
    /access/delete-by-type?user_id=12&item_type=course
    """
    try:
        return await access_manager.delete_by_item_type(user_id, item_type)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Delete by item type failed: {e}"
        )
