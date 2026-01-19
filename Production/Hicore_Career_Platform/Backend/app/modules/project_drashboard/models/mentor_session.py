from sqlalchemy import Column, Integer, String, ForeignKey, Enum, JSON
from sqlalchemy.orm import relationship
from app.core.database.config import Base
import enum

class RequestStatus(str, enum.Enum):
    pending = "pending"
    accepted = "accepted"
    rejected = "rejected"
    completed = "completed"   # NEW


class MentorSession(Base):
    __tablename__ = "mentor_session_finals"

    id = Column(Integer, primary_key=True)

    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    mentor_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    project_id = Column(String, nullable=False)
    project_type = Column(String, nullable=False)

    status = Column(Enum(RequestStatus), default=RequestStatus.pending)
    requested_date = Column(String, nullable=True)

    rejected_by = Column(JSON, default=[])   # <--- NEW COLUMN

    student = relationship("User", foreign_keys=[student_id])
    mentor = relationship("User", foreign_keys=[mentor_id])
