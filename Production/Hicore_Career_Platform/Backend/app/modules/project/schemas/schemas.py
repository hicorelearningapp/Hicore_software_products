from pydantic import BaseModel
from typing import Optional, Dict, Any, List

class ProjectBase(BaseModel):
    title: str
    domain: str
    description: Optional[str] = None

class ProjectOut(ProjectBase):
    id: str
    tools: Optional[List[str]] = []
    techStack: Optional[List[str]] = []
    mentor: Optional[str] = None
    image: Optional[str] = None

class ProjectFiles(BaseModel):
    system_requirement: Optional[Dict[str, Any]] = None
    srs: Optional[Dict[str, Any]] = None
    design: Optional[Dict[str, Any]] = None
    coding: Optional[Dict[str, Any]] = None
    testing: Optional[Dict[str, Any]] = None
    report: Optional[Dict[str, Any]] = None

class ProjectWithFiles(BaseModel):
    project: ProjectOut
    files: Optional[ProjectFiles] = ProjectFiles()
