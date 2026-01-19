from sqlalchemy import Column, String, Integer, DateTime
from datetime import datetime
from app.core.database.config import Base

class ExamResult(Base):

    __tablename__ = "exam_result"

    id = Column(String, primary_key=True)

    # NEW
    exam_id = Column(String, index=True)

    exam_type = Column(String, index=True)
    exam_name = Column(String)
    exam_date = Column(String)

    user_id = Column(String, index=True)

    total_questions = Column(Integer)
    attempted = Column(Integer)
    correct = Column(Integer)
    wrong = Column(Integer)

    time_taken_seconds = Column(Integer)
    score = Column(Integer)

    created_at = Column(DateTime, default=datetime.utcnow)
