from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from enum import Enum as PyEnum
from app.core.database.config import Base


class RoleEnum(PyEnum):
    student = "student"
    jobseeker = "jobseeker"
    mentor = "mentor"
    employer = "employer"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=True)
    phone = Column(String, unique=True, nullable=True)
    role = Column(Enum(RoleEnum), default=RoleEnum.student)
    provider = Column(String, default="manual")
    otp = Column(String, nullable=True)
    otp_created_at = Column(DateTime, nullable=True)
    otp_expiry = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    # NEW one-to-one relationship
    profile = relationship("UserProfile", back_populates="user", uselist=False)
