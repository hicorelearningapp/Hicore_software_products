from pydantic import BaseModel, EmailStr
from enum import Enum
from typing import Optional

class RoleEnum(str, Enum):
    student = "student"
    parent = "parent"
    teacher = "teacher"

class SendEmailOtpRequest(BaseModel):
    email: EmailStr

class VerifyEmailOtpRequest(BaseModel):
    email: EmailStr
    otp: str
    role: RoleEnum

class CreateUserRequest(BaseModel):
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    role: RoleEnum = RoleEnum.student
