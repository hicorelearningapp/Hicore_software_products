from pydantic import BaseModel
from typing import Optional

class ProgressUpdate(BaseModel):
    userId: str
    itemType: str
    itemId: str
    lessonPath: Optional[str] = None   # <-- FIXED
    totalLessons: int
    status: str       # "init", "active", "completed"
