from typing import Optional, List
from pydantic import BaseModel, HttpUrl, Field
from datetime import datetime


# ============================================================
# ✅ Base Schema (Common Fields)
# ============================================================
class JobBase(BaseModel):
    posting_type: str = Field(default="Job")
    user_id: Optional[int] = None

    company_name: str
    company_logo: Optional[str] = None
    company_website: Optional[HttpUrl] = None

    title: str
    department: Optional[str] = None
    eligibility: Optional[str] = None
    employment_type: Optional[str] = None
    location_type: Optional[str] = None
    location: Optional[str] = None

    job_overview: Optional[str] = None
    about_company: Optional[str] = None

    key_responsibilities: List[str] = Field(default_factory=list)
    must_have_skills: List[str] = Field(default_factory=list)
    preferred_skills: List[str] = Field(default_factory=list)
    what_we_offer: List[str] = Field(default_factory=list)
    benefits: List[str] = Field(default_factory=list)

    salary_min_lpa: Optional[float] = None
    salary_max_lpa: Optional[float] = None
    experience_min_years: Optional[float] = None
    experience_max_years: Optional[float] = None
    openings: int = Field(default=1)

    application_deadline: Optional[datetime] = None
    industry_type: Optional[str] = None
    apply_link: Optional[HttpUrl] = None


# ============================================================
# ✅ Create Schema
# ============================================================
class JobCreate(JobBase):
    """Used for creating new job postings."""
    pass


# ============================================================
# ✅ Update Schema (PATCH)
# ============================================================
class JobUpdate(BaseModel):
    """Used for partial updates to job postings."""
    posting_type: Optional[str] = None
    applyer_id: Optional[int] = None  # ✅ Added field

    company_name: Optional[str] = None
    company_logo: Optional[str] = None
    company_website: Optional[HttpUrl] = None

    title: Optional[str] = None
    department: Optional[str] = None
    eligibility: Optional[str] = None
    employment_type: Optional[str] = None
    location_type: Optional[str] = None
    location: Optional[str] = None

    job_overview: Optional[str] = None
    about_company: Optional[str] = None

    key_responsibilities: Optional[List[str]] = None
    must_have_skills: Optional[List[str]] = None
    preferred_skills: Optional[List[str]] = None
    what_we_offer: Optional[List[str]] = None
    benefits: Optional[List[str]] = None

    salary_min_lpa: Optional[float] = None
    salary_max_lpa: Optional[float] = None
    experience_min_years: Optional[float] = None
    experience_max_years: Optional[float] = None
    openings: Optional[int] = None

    application_deadline: Optional[datetime] = None
    industry_type: Optional[str] = None
    apply_link: Optional[HttpUrl] = None


# ============================================================
# ✅ Response Schema (Client Output)
# ============================================================
class JobResponse(JobBase):
    """Used for returning data to clients."""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True  # ✅ ORM compatibility
