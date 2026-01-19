from pydantic import BaseModel, HttpUrl
from typing import List, Optional
from datetime import datetime


class InternshipBase(BaseModel):
    posting_type: str = "Internship"
    user_id: Optional[int] = None

    company_name: str
    company_logo: Optional[str] = None
    company_website: HttpUrl
    title: str
    department: Optional[str] = None
    eligibility: Optional[str] = None
    employment_type: Optional[str] = None
    location_type: Optional[str] = None
    location: Optional[str] = None

    internship_overview: Optional[str] = None
    about_company: Optional[str] = None
    highlights: Optional[List[str]] = []
    required_skills: Optional[List[str]] = []
    preferred_skills: Optional[List[str]] = []
    what_we_offer: Optional[List[str]] = []
    benefits: Optional[List[str]] = []

    stipend_min: Optional[float] = None
    stipend_max: Optional[float] = None
    duration_min_months: Optional[float] = None
    duration_max_months: Optional[float] = None
    openings: Optional[int] = None
    application_deadline: Optional[datetime] = None
    industry_type: Optional[str] = None
    apply_link: Optional[HttpUrl] = None


class InternshipCreate(InternshipBase):
    pass


class InternshipUpdate(InternshipBase):
    pass


class InternshipResponse(InternshipBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
