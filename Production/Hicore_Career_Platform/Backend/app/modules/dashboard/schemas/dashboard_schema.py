from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any


# ---------- Common ----------
class ProgressItem(BaseModel):
    item_type: str
    item_id: str
    progress: float
    status: str


class ProgressGroup(BaseModel):
    inprogress: List[ProgressItem] = Field(default_factory=list)
    completed: List[ProgressItem] = Field(default_factory=list)


# ---------- Student ----------
class StudentSummary(BaseModel):
    projects_completed: int = 0
    courses_completed: int = 0
    certificates_acquired: int = 0
    challenges_completed: int = 0
    ongoing_courses: int = 0


class StudentDashboard(BaseModel):
    summary: StudentSummary
    details: Dict[str, ProgressGroup] = Field(default_factory=dict)
    generated_at: str
    message: Optional[str] = None


# ---------- Jobseeker ----------
class JobseekerSummary(StudentSummary):
    total_applications: int = 0
    shortlisted: int = 0


class JobseekerDashboard(BaseModel):
    summary: JobseekerSummary
    details: Dict[str, ProgressGroup] = Field(default_factory=dict)
    generated_at: str


# ---------- Mentor ----------
class MentorSummary(BaseModel):
    total_mentees: int = 0
    active_sessions: int = 0
    completed_sessions: int = 0


class MentorDashboard(BaseModel):
    summary: MentorSummary
    generated_at: str


# ---------- Employee ----------
class EmployeeSummary(BaseModel):
    total_projects: int = 0
    tasks_completed: int = 0
    performance_score: float = 0.0


class EmployeeDashboard(BaseModel):
    summary: EmployeeSummary
    generated_at: str


# ---------- Unified Response ----------
class DashboardResponse(BaseModel):
    status: str = "success"
    role: str
    data: Dict[str, Any]
