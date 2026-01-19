from sqlalchemy import Column, String
from app.core.database.config import Base

class ProjectMixin:
    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    domain = Column(String, nullable=False)
    description = Column(String, nullable=True)
    tools = Column(String, nullable=True)      # JSON string
    techStack = Column(String, nullable=True)  # JSON string
    mentor = Column(String, nullable=True)
    image = Column(String, nullable=True)


class Internship_project(Base, ProjectMixin):
    __tablename__ = "internship_projects"


class Mini_project(Base, ProjectMixin):
    __tablename__ = "mini_projects"


class Major_project(Base, ProjectMixin):
    __tablename__ = "major_projects"


class Final_year_project(Base, ProjectMixin):
    __tablename__ = "final_year_projects"
