from pydantic import BaseModel
from typing import List, Optional
from enum import Enum

class RequestStatusEnum(str, Enum):
    pending = "pending"
    accepted = "accepted"
    rejected = "rejected"
    completed = "completed"


class CreateRequestIn(BaseModel):
    student_id: int
    project_id: str
    project_type: str

class StudentOut(BaseModel):
    id: int
    email: Optional[str] = None
    role: Optional[str] = None

    class Config:
        orm_mode = True


class ProjectOut(BaseModel):
    project_id: str
    project_type: str
    title: str
    domain: str
    tools: List[str] = []
    techStack: List[str] = []
    image: Optional[str]

    class Config:
        orm_mode = True


class NewRequestOut(BaseModel):
    request_id: int
    student: StudentOut
    project: ProjectOut
    status: RequestStatusEnum


class ActiveMenteeOut(BaseModel):
    session_id: int
    student: StudentOut
    project: ProjectOut
    status: RequestStatusEnum


class SimpleResponse(BaseModel):
    status: str
    message: str


class AcceptResponse(BaseModel):
    status: str
    message: str
    request_id: int
    student_id: int
    mentor_id: int
    project_id: str
    project_type: str
    request_status: RequestStatusEnum
