from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ..managers.ai_manager import AIManager
from ..services.gemini_service import AI_ENGINE, AI_KEY
from ..services.grouping_service import SkillService
from ..services.ai_service import AIStructureService
from ..prompts.roadmap_prompt import ROADMAP_PROMPT
from app.core.logger import logger


router = APIRouter(prefix="/ai", tags=["AI Roadmap"])

ai = AIManager(AI_ENGINE, AI_KEY)
skill_service = SkillService(ai)
structure_service = AIStructureService(ai)


class JobRequest(BaseModel):
    job_description: str


@router.post("/roadmap")
async def generate_roadmap(request: JobRequest):
    jd = request.job_description.strip()
    logger.debug(f"Roadmap JD received: {jd}")

    if not jd:
        raise HTTPException(status_code=400, detail="Missing job_description")

    try:
        logger.debug("Extracting skills...")
        skills_json = skill_service.extract_skills(jd)
        logger.debug(f"Extracted Skills JSON: {skills_json}")

        logger.debug("Grouping skills...")
        grouped = skill_service.smart_group_skills(skills_json)
        logger.debug(f"Grouped Skills: {grouped}")

        topics = []
        for g in grouped:
            topics.append(g["title"])
            topics.extend(g["subtopics"])

        logger.debug(f"Topics passed to roadmap generator: {topics}")

        roadmap = structure_service.generate_response_document(
            ROADMAP_PROMPT,
            "\n".join(topics)
        )

        logger.debug(f"Roadmap AI Raw Output: {roadmap}")

        return {"roadmap": roadmap}

    except Exception as e:
        logger.error(f"Roadmap generation failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
