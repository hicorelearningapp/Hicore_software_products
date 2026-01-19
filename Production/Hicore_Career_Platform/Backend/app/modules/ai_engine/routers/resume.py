# app/modules/ai_engine/routers/resume_router.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ..managers.ai_manager import AIManager
from ..services.gemini_service import AI_ENGINE, AI_KEY
from ..services.resume_service import ResumeService


router = APIRouter(prefix="/ai", tags=["AI Roadmap"])

ai = AIManager(AI_ENGINE, AI_KEY)
resume_service = ResumeService(ai)


class JobRequest(BaseModel):
    job_description: str


@router.post("/resume-bullets")
async def generate_resume_bullets(request: JobRequest):
    jd = request.job_description.strip()
    if not jd:
        raise HTTPException(status_code=400, detail="Missing job_description")

    try:
        bullets = resume_service.get_resume_bullets(jd)
        return {"resume_bullets": bullets}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
