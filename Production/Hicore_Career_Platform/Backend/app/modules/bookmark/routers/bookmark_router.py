from fastapi import APIRouter, Query
from ..schemas.bookmark_schema import BookmarkRequest
from ..services.bookmark_service import BookmarkService

router = APIRouter(prefix="/bookmark", tags=["Bookmark"])


# ---------------------------------------
# ADD BOOKMARK
# ---------------------------------------
@router.post("/add")
async def add_bookmark(req: BookmarkRequest):
    bookmark_id = BookmarkService.add_bookmark(
        user_id=req.user_id,
        bookmark_type=req.bookmark_type,
        bookmarked_data=req.bookmarked_data
    )
    return {
        "message": "Bookmarked successfully",
        "bookmark_id": bookmark_id
    }


# ---------------------------------------
# LIST ALL BOOKMARKS
# ---------------------------------------
@router.get("/list/{user_id}")
async def list_bookmarks(user_id: int):
    bookmarks = BookmarkService.list_bookmarks(user_id)
    return {
        "total": len(bookmarks),
        "bookmarks": bookmarks
    }


# ---------------------------------------
# LIST BOOKMARKS BY TYPE
# ---------------------------------------
@router.get("/list/{user_id}/type")
async def list_bookmarks_by_type(user_id: int, type: str = Query(...)):
    bookmarks = BookmarkService.list_bookmarks_by_type(user_id, type)
    return {
        "total": len(bookmarks),
        "bookmarks": bookmarks
    }


# ---------------------------------------
# DELETE BOOKMARK
# ---------------------------------------
@router.delete("/delete/{user_id}/{bookmark_id}")
async def delete_bookmark(user_id: int, bookmark_id: int):
    success = BookmarkService.delete_bookmark(user_id, bookmark_id)

    if not success:
        return {"message": "Bookmark not found or does not belong to user"}

    return {"message": "Bookmark removed successfully"}
