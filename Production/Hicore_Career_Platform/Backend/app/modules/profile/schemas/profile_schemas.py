from typing import Any, Dict, List, Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict


# ---------- BASIC NESTED SCHEMAS ----------

class BasicInfo(BaseModel):
    user_id: int
    first_name: str = Field(..., min_length=1)
    last_name: Optional[str] = ""
    email: EmailStr
    mobile_number: str
    location: str
    professional_title: Optional[str] = None
    professional_bio: Optional[str] = None
    job_alerts: Optional[bool] = True
    linkedin_profile: Optional[str] = None
    portfolio_website: Optional[str] = None
    github_profile: Optional[str] = None
    selfintro_video: Optional[str] = ""
    profile_image: Optional[str] = ""

    model_config = ConfigDict(extra="allow")  # allow frontend to send extra fields


class ProfileBase(BaseModel):
    basicInfo: BasicInfo
    jobPreference: Optional[Dict[str, Any]] = None
    workExperience: List[Dict[str, Any]] = []
    education: List[Dict[str, Any]] = []
    skillsResume: Dict[str, Any] = {}
    certifications: List[Dict[str, Any]] = []
    projects: List[Dict[str, Any]] = []

    model_config = ConfigDict(extra="allow")


class ProfileCreate(ProfileBase):
    """Payload for profile creation."""
    pass


class ProfileUpdate(ProfileBase):
    """
    Payload for profile update.
    We keep same structure to allow full/partial updates.
    """
    pass


class ProfileOut(ProfileBase):
    """Response shape for profile read."""
    pass
