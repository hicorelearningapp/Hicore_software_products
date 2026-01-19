from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ApplicationBase(BaseModel):
    applyer_id: int
    job_id: int
    posting_type: str = Field(..., description="Type of posting: Job or Internship")  # ✅ Added this
    poster_user_id: Optional[int] = None
    applicant_name: Optional[str] = None
    job_title: Optional[str] = None
    match: Optional[float] = None
    stage: Optional[str] = Field(default="applied")

class ApplicationCreate(ApplicationBase):
    """Schema for creating a new application."""
    pass

class ApplicationResponse(ApplicationBase):
    id: int
    applied_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class EmailRequest(BaseModel):
    user_id: int
    subject: str
    message: str