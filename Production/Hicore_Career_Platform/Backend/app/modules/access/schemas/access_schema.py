from pydantic import BaseModel
from typing import Optional
from typing import List

class AccessBase(BaseModel):
    user_id: int
    item_type: str
    item_id: str

class AccessCreate(AccessBase):
    status: Optional[str] = "granted"

class AccessResponse(AccessBase):
    id: int
    status: str

    class Config:
        orm_mode = True

