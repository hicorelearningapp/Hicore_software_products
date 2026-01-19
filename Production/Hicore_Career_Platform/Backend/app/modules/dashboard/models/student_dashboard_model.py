from sqlalchemy import Column, Integer, JSON, String, func
from app.core.database.config import Base


class StudentDashboard(Base):
    __tablename__ = "student_dashboards"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    summary = Column(JSON, nullable=False, default={})
    details = Column(JSON, nullable=False, default={})
    generated_at = Column(String, nullable=False, default=lambda: func.now())
