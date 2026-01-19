# app/modules/ai_engine/routers/learning_materials_router.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ..managers.ai_manager import AIManager
from ..services.gemini_service import AI_ENGINE, AI_KEY
from ..services.ai_service import AIStructureService
from ..prompts.quiz_prompt import QUIZ_PROMPT
from ..prompts.flashcard_prompt import FLASHCARD_PROMPT
from ..prompts.qna_prompt import QNA_PROMPT
from ..prompts.question_answers_prompt import QUESTION_ANSWERS


router = APIRouter(prefix="/ai", tags=["AI Roadmap"])

ai = AIManager(AI_ENGINE, AI_KEY)
structure_service = AIStructureService(ai)


class JobRequest(BaseModel):
    job_description: str


@router.post("/learning-materials")
async def generate_learning_materials(request: JobRequest):
    jd = request.job_description.strip()
    if not jd:
        raise HTTPException(status_code=400, detail="Missing job_description")

    try:
        mcq = structure_service.generate_response_document(QUIZ_PROMPT, jd)
        flashcards = structure_service.generate_response_document(FLASHCARD_PROMPT, jd)
        written = structure_service.generate_response_document(QNA_PROMPT, jd)
        qa = structure_service.generate_response_document(QUESTION_ANSWERS, jd)

        return {
            "mcqQuestions": mcq,
            "flashcards": flashcards,
            "writtenQuestions": written,
            "qaPairs": qa,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
