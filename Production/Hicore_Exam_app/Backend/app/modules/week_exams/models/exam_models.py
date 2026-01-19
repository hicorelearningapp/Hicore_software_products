from pydantic import BaseModel
from sqlalchemy import Column, String, Integer, DateTime, JSON
from datetime import datetime
from app.core.database.config import Base


class Exam(Base):

    __tablename__ = "exams"

    id = Column(String, primary_key=True, index=True)
    exam_type = Column(String)
    exam_name = Column(String)
    exam_date = Column(String)
    total_questions = Column(Integer)

    questions = Column(JSON)

    created_by = Column(String, default="admin")
    created_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="active")


class ExamCreate(BaseModel):
    exam_type: str
    exam_name: str
    exam_date: datetime
    total_questions: int = 180

