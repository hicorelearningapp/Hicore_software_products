# app/modules/mentor/schemas/mentor_schemas.py

from pydantic import BaseModel, EmailStr
from typing import List, Optional

class MentorApplication(BaseModel):
    user_id: int

    first_name: str
    last_name: str
    email: EmailStr
    mobile: str

    professional_title: str
    experience_years: str
    company_name: Optional[str]

    domain: str

    mentoring_formats: List[str] = []
    available_time_slots: List[str] = []

    professional_bio: str
    why_become_mentor: str

    linkedin: Optional[str]
    portfolio: Optional[str]
    github: Optional[str]

    image: Optional[str] = None          # NEW
    tags: List[str] = []                 # NEW
               # NEW

class MentorOut(BaseModel):
    id: int
    user_id: int

    first_name: str
    last_name: str
    email: Optional[str] = None
    mobile: str
    professional_title: str
    experience_years: str
    company_name: Optional[str]
    domain: str

    mentoring_formats: List[str]
    available_time_slots: List[str]
    professional_bio: str
    why_become_mentor: str

    linkedin: Optional[str]
    portfolio: Optional[str]
    github: Optional[str]

    image: Optional[str]
    tags: List[str] = []

    status: str
    submitted_at: str

    model_config = {
        "from_attributes": True
    }

    @staticmethod
    def from_model(m):
        return MentorOut(
            id=m.id,
            user_id=m.user_id,
            first_name=m.first_name,
            last_name=m.last_name,
            email=m.email,
            mobile=m.mobile,
            professional_title=m.professional_title,
            experience_years=m.experience_years,
            company_name=m.company_name,
            domain=m.domain,
            mentoring_formats=m.mentoring_formats.split(",") if m.mentoring_formats else [],
            available_time_slots=m.available_time_slots.split(",") if m.available_time_slots else [],
            professional_bio=m.professional_bio,
            why_become_mentor=m.why_become_mentor,
            linkedin=m.linkedin,
            portfolio=m.portfolio,
            github=m.github,
            image=m.image,
            tags=m.tags.split(",") if m.tags else [],
            status=m.status,
            submitted_at=m.submitted_at,
        )



class SlotOut(BaseModel):
    slot_id: int
    start: str
    end: str
    status: str

    model_config = {
        "from_attributes": True
    }

class SlotBooking(BaseModel):
    slot_id: int
    mentor_id: int
    student_id: int
    student_email: EmailStr
    student_name: Optional[str] = None
    session_type: Optional[str] = None
    topic: Optional[str] = None

class SessionOut(BaseModel):
    id: int
    mentor_id: int
    student_id: int
    slot_id: int
    date: str
    start_time: str
    end_time: str
    session_type: Optional[str]
    google_meet_link: str
    status: str
    topic: Optional[str]

    # NEW FIELD
    student_profile: Optional[dict] = None

    model_config = {"from_attributes": True}




class SessionStatusUpdate(BaseModel):
    status: str
