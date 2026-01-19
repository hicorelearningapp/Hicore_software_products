# app/modules/ai_engine/routers/freshers_interview_router.py

from fastapi import APIRouter, Body, Query, HTTPException
from fastapi.responses import JSONResponse
from ..services.interview_service import AIInterviewService
from ..managers.ai_manager import AIManager
from ..services.gemini_service import AI_KEY, AI_ENGINE


class InterviewPreparation:
    def __init__(self):
        self.router = APIRouter(prefix="/ai", tags=[" Interview preparation"])
        self.ai = AIManager(AI_ENGINE, AI_KEY)
        self.service = AIInterviewService(self.ai)
        self.register_routes()

    # ------------------------------------------------------
    # ROUTE REGISTRATION
    # ------------------------------------------------------
    def register_routes(self):

        @self.router.post("/quiz/generate")
        async def generate_quiz(data: dict = Body(...)):
            topic = data.get("topic")
            if not topic:
                raise HTTPException(status_code=400, detail="Missing field: topic")

            result = await self.service.generate_quiz(
                topic=topic,
                level=data.get("level", "beginner"),
                count=data.get("number_of_questions", 5),
                mode=data.get("mode", "practice"),
            )

            return JSONResponse({
                "topic": topic,
                "level": data.get("level", "beginner"),
                "mode": data.get("mode", "practice"),
                "questions": result
            })

        @self.router.post("/flashcard/generate")
        async def generate_flashcard(data: dict = Body(...)):
            topic = data.get("topic")
            if not topic:
                raise HTTPException(status_code=400, detail="Missing field: topic")

            result = await self.service.generate_flashcard(
                topic=topic,
                level=data.get("level", "beginner"),
                count=data.get("number_of_questions", 5),
            )

            return JSONResponse({
                "topic": topic,
                "level": data.get("level", "beginner"),
                "questions": result
            })

        @self.router.get("/mock-interview")
        async def generate_mock_interview(
            interview_type: str = Query(None),
            difficulty: str = Query(None),
            jobrole: str = Query(None),
        ):
            if not all([interview_type, difficulty, jobrole]):
                raise HTTPException(
                    status_code=400,
                    detail="Missing 'interview_type', 'difficulty', or 'jobrole'"
                )

            result = await self.service.generate_mock_interview(
                interview_type, difficulty, jobrole
            )

            return {"mockInterviewQuestions": result}

        @self.router.post("/mock-interview/evaluate")
        async def evaluate_mock(data: dict = Body(...)):

            required = ["transcript", "context", "interview_type", "difficulty", "jobrole"]
            if not all(data.get(key) for key in required):
                raise HTTPException(status_code=400, detail="Missing required fields")

            result = await self.service.evaluate_mock(
                transcript=data["transcript"],
                context=data["context"],
                audio_conf=data.get("audioConfidence", 1.0),
                interview_type=data["interview_type"],
                difficulty=data["difficulty"],
                jobrole=data["jobrole"],
            )

            return {"mockInterviewEvaluation": result}


# ---------
# EXPORT
# ---------
router = InterviewPreparation().router
