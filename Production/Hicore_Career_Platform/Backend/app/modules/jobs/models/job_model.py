from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.sql import func
from app.core.database.config import Base
import json


class JobPosting(Base):
    __tablename__ = "job_posting_table"

    # Primary Details
    id = Column(Integer, primary_key=True, index=True)
    posting_type = Column(String(50), default="Job")

    # New Field
    user_id = Column(Integer, nullable=True, index=True)

    # Company Info
    company_name = Column(String(255), nullable=False)
    company_logo = Column(String(255), nullable=True)
    company_website = Column(String(255), nullable=True)

    # Job Info
    title = Column(String(255), nullable=False)
    department = Column(String(255), nullable=True)
    eligibility = Column(String(255), nullable=True)
    employment_type = Column(String(100), nullable=True)
    location_type = Column(String(100), nullable=True)
    location = Column(String(255), nullable=True)

    # Overview
    job_overview = Column(Text, nullable=True)
    about_company = Column(Text, nullable=True)

    # List-based fields (stored as JSON strings)
    key_responsibilities = Column(Text, nullable=True)
    must_have_skills = Column(Text, nullable=True)
    preferred_skills = Column(Text, nullable=True)
    what_we_offer = Column(Text, nullable=True)
    benefits = Column(Text, nullable=True)

    # Compensation / Experience
    salary_min_lpa = Column(Float, nullable=True)
    salary_max_lpa = Column(Float, nullable=True)
    experience_min_years = Column(Float, nullable=True)
    experience_max_years = Column(Float, nullable=True)

    # Misc
    openings = Column(Integer, default=1)
    application_deadline = Column(DateTime, nullable=True)
    industry_type = Column(String(255), nullable=True)
    apply_link = Column(String(255), nullable=True)

    # Audit Fields
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # --------------------------------------------
    # ✅ Utility: Convert ORM object to safe dict
    # --------------------------------------------
    def as_dict(self):
        """
        Convert ORM object into dictionary.
        Automatically parses JSON string fields into Python lists.
        """
        obj_dict = {c.name: getattr(self, c.name) for c in self.__table__.columns}

        json_fields = [
            "key_responsibilities",
            "must_have_skills",
            "preferred_skills",
            "what_we_offer",
            "benefits",
        ]

        for field in json_fields:
            value = obj_dict.get(field)
            if isinstance(value, str):
                try:
                    obj_dict[field] = json.loads(value)
                except json.JSONDecodeError:
                    obj_dict[field] = []

        return obj_dict

    # --------------------------------------------
    # ✅ Utility: Prepare list fields for DB insert/update
    # --------------------------------------------
    @staticmethod
    def to_json_fields(data: dict) -> dict:
        """
        Converts Python list fields into JSON strings before saving to DB.
        """
        json_fields = [
            "key_responsibilities",
            "must_have_skills",
            "preferred_skills",
            "what_we_offer",
            "benefits",
        ]
        for field in json_fields:
            if field in data and isinstance(data[field], list):
                data[field] = json.dumps(data[field])
        return data


