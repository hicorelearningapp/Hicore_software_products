# app/modules/freshers/schemas.py
from pydantic import BaseModel, Field
from typing import List, Optional, Any


class CardOut(BaseModel):
    icon: str
    title: str
    description: str
    bgColor: str
    topicId: str
    files: Optional[str] = None  # relative URL path to uploaded file
    # extra arbitrary data could be included in files content (not here)


class WeekDataOut(BaseModel):
    heading: str
    subheading: str
    paragraph: str
    banner: str
    weekName: str
    nextWeek: Optional[str] = None
    previousWeek: Optional[str] = None
    cards: List[CardOut]


class MessageOut(BaseModel):
    message: str
    data: Optional[Any] = None
