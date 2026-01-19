# app/modules/bookmark/services/bookmark_service.py

from typing import Dict, Any, List
from app.modules.bookmark.utils.json_store import bookmark_store


class BookmarkService:

    # ---------------------------------------------------
    # ADD BOOKMARK
    # ---------------------------------------------------
    @staticmethod
    def add_bookmark(user_id: int, bookmark_type: str, bookmarked_data: Dict[str, Any]) -> int:
        db = bookmark_store.load()
        bookmarks = db["bookmarks"]

        new_id = bookmarks[-1]["id"] + 1 if bookmarks else 1

        new_entry = {
            "id": new_id,
            "user_id": user_id,
            "bookmark_type": bookmark_type,
            "data": bookmarked_data
        }

        bookmarks.append(new_entry)
        bookmark_store.save(db)

        return new_id

    # ---------------------------------------------------
    # LIST ALL BOOKMARKS FOR A USER
    # ---------------------------------------------------
    @staticmethod
    def list_bookmarks(user_id: int) -> List[Dict[str, Any]]:
        db = bookmark_store.load()
        return [b for b in db["bookmarks"] if b["user_id"] == user_id]

    # ---------------------------------------------------
    # LIST BOOKMARKS BY TYPE
    # ---------------------------------------------------
    @staticmethod
    def list_bookmarks_by_type(user_id: int, bookmark_type: str) -> List[Dict[str, Any]]:
        db = bookmark_store.load()
        return [
            b for b in db["bookmarks"]
            if b["user_id"] == user_id and b["bookmark_type"] == bookmark_type
        ]

    # ---------------------------------------------------
    # DELETE A BOOKMARK
    # ---------------------------------------------------
    @staticmethod
    def delete_bookmark(user_id: int, bookmark_id: int) -> bool:
        db = bookmark_store.load()
        bookmarks = db["bookmarks"]

        entry = next(
            (b for b in bookmarks if b["id"] == bookmark_id and b["user_id"] == user_id),
            None
        )

        if not entry:
            return False

        bookmarks.remove(entry)
        bookmark_store.save(db)
        return True
