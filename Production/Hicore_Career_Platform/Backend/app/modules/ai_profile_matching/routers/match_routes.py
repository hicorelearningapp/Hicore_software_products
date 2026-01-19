# app/api/routers/match_routes.py
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from ..services.match_service_async import build_profile_embeddings, match_profiles
from app.core.dependencies import get_user_manager
from app.modules.auth.managers.user_manager import UserManager

router = APIRouter(prefix="/match", tags=["AI Profile Match"])

@router.post("/refresh")
async def refresh_profiles(user_manager: UserManager = Depends(get_user_manager)):
    try:
        count = await build_profile_embeddings(user_manager)
        return {"status": "success", "message": f"Regenerated embeddings for {count} profiles"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/getmatch")
async def get_matches(
    query: Optional[str] = None,
    top_k: int = 5,
    user_manager: UserManager = Depends(get_user_manager)
):
    try:
        results = await match_profiles(query, top_k, user_manager)
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
