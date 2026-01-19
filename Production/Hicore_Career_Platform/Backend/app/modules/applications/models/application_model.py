from sqlalchemy import Column, Integer, String, DateTime, Float, func
from app.core.database.config import Base

class Application(Base):
    __tablename__ = "application"

    id = Column(Integer, primary_key=True, index=True)
    applyer_id = Column(Integer, nullable=False, index=True)
    job_id = Column(Integer, nullable=False, index=True)
    poster_user_id = Column(Integer, nullable=True, index=True)
    applicant_name = Column(String(255), nullable=True)
    job_title = Column(String(255), nullable=True)

    # NEW: posting_type to match schema (Job / Internship)
    posting_type = Column(String(50), nullable=False, default="Job", index=True)

    match = Column(Float, nullable=True)
    stage = Column(String(100), nullable=False, default="applied")
    applied_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
