# app/modules/ai_engine/routers/skills_router.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ..managers.ai_manager import AIManager
from ..services.gemini_service import AI_ENGINE, AI_KEY
from ..services.grouping_service import SkillService


router = APIRouter(prefix="/ai", tags=["AI Roadmap"])

ai = AIManager(AI_ENGINE, AI_KEY)
skill_service = SkillService(ai)


class JobRequest(BaseModel):
    job_description: str


@router.post("/grouped-skills")
async def get_grouped_skills(request: JobRequest):
    jd = request.job_description.strip()
    if not jd:
        raise HTTPException(status_code=400, detail="Missing job_description")

    try:
        skills_json = skill_service.extract_skills(jd)
        grouped = skill_service.smart_group_skills(skills_json)
        return {"grouped_skills": grouped}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
