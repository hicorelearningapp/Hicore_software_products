from pydantic import BaseModel
from typing import List, Optional


class PersonalInfo(BaseModel):
    firstName: str
    lastName: str
    title: Optional[str] = None
    email: str
    linkedin: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None


class WorkExperience(BaseModel):
    company: str
    role: str
    startDate: str
    endDate: str
    location: Optional[str] = None
    responsibilities: Optional[str] = None


class Education(BaseModel):
    institution: str
    degree: str
    startDate: str
    endDate: str
    details: Optional[str] = None


class Certification(BaseModel):
    name: str
    issuer: str
    date: str


class Resume(BaseModel):
    personalInfo: PersonalInfo
    summary: Optional[str] = ""
    workExperiences: List[WorkExperience] = []
    education: List[Education] = []
    skills: List[str] = []
    certifications: List[Certification] = []
