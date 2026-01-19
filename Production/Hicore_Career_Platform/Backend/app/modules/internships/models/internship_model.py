from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.sql import func
from app.core.database.config import Base
import json


class InternshipPosting(Base):
    __tablename__ = "internship_posting_table"

    id = Column(Integer, primary_key=True, index=True)
    posting_type = Column(String(50), default="Internship")
    user_id = Column(Integer, nullable=True, index=True)

    company_name = Column(String(255), nullable=False)
    company_logo = Column(String(255), nullable=True)
    company_website = Column(String(255), nullable=False)
    title = Column(String(255), nullable=False)
    department = Column(String(255), nullable=True)
    eligibility = Column(Text, nullable=True)
    employment_type = Column(String(100), nullable=True)
    location_type = Column(String(100), nullable=True)
    location = Column(String(255), nullable=True)

    internship_overview = Column(Text, nullable=True)
    about_company = Column(Text, nullable=True)

    # ✅ Store list-like fields as JSON strings
    highlights = Column(Text, nullable=True)
    required_skills = Column(Text, nullable=True)
    preferred_skills = Column(Text, nullable=True)
    what_we_offer = Column(Text, nullable=True)
    benefits = Column(Text, nullable=True)

    stipend_min = Column(Float, nullable=True)
    stipend_max = Column(Float, nullable=True)
    duration_min_months = Column(Float, nullable=True)
    duration_max_months = Column(Float, nullable=True)
    openings = Column(Integer, default=1)

    application_deadline = Column(DateTime, nullable=True)
    industry_type = Column(String(255), nullable=True)
    apply_link = Column(String(255), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # ✅ Automatically convert JSON string fields back to Python lists
    def as_dict(self):
        obj_dict = {c.name: getattr(self, c.name) for c in self.__table__.columns}

        list_fields = [
            "highlights",
            "required_skills",
            "preferred_skills",
            "what_we_offer",
            "benefits",
        ]
        for field in list_fields:
            value = obj_dict.get(field)
            if isinstance(value, str):
                try:
                    obj_dict[field] = json.loads(value)
                except json.JSONDecodeError:
                    obj_dict[field] = []
        return obj_dict
