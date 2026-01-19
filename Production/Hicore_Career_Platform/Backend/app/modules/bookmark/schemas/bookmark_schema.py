from pydantic import BaseModel
from typing import Any, Dict

class BookmarkRequest(BaseModel):
    user_id: int
    bookmark_type: str
    bookmarked_data: Dict[str, Any]
