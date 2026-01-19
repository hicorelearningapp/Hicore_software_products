# app/modules/ai_engine/routers/career_assistance_router.py

from fastapi import APIRouter, Query, HTTPException, Body, Depends
from fastapi.responses import JSONResponse
from ..services.career_assistance_service import AICareerAssistanceService
from ..managers.ai_manager import AIManager
from ..services.gemini_service import AI_ENGINE, AI_KEY
from app.core.dependencies import get_user_manager


class CareerAssistanceRouter:

    def __init__(self):
        self.router = APIRouter(prefix="/ai", tags=["AI Career Assistance"])
        self.ai = AIManager(AI_ENGINE, AI_KEY)
        self.service = AICareerAssistanceService(self.ai)
        self.register_routes()

    # ------------------------------------------------------
    # ROUTES
    # ------------------------------------------------------
    def register_routes(self):

        # -------------------------------
        # 1. CAREER ROADMAP
        # -------------------------------
        @self.router.get("/career-roadmap")
        async def career_roadmap(
            goal: str = Query(None)
        ):
            if not goal:
                raise HTTPException(status_code=400, detail="No career goal provided")

            roadmap = await self.service.get_career_roadmap(goal)
            return JSONResponse({"learningRoadmapData": roadmap})

        # -------------------------------
        # 2. ROLE MATCHES
        # -------------------------------
        @self.router.get("/role-matches")
        async def role_matches(skills: str = Query(None)):
            if not skills:
                raise HTTPException(status_code=400, detail="No skills provided")

            skills_list = [s.strip() for s in skills.split(",") if s.strip()]
            result = await self.service.get_role_matches(skills_list)

            return {
                "status": "success",
                "skills": skills_list,
                "roles": result
            }

        # -------------------------------
        # 3. COMPARE SKILLS WITH AI
        # -------------------------------
        @self.router.post("/compare-skills-ai")
        async def compare_skills_ai(
            data: dict = Body(...),
            user_manager=Depends(get_user_manager)
        ):
            job_role = data.get("jobRole")
            user_id = data.get("user_id")

            if not job_role or not user_id:
                raise HTTPException(status_code=400, detail="jobRole and user_id required")

            result = await self.service.compare_skills_ai(
                job_role, user_id, user_manager
            )
            return result

        # -------------------------------
        # 4. MOCK INTERVIEW QA
        # -------------------------------
        @self.router.get("/mock-interview-qa")
        async def mock_interview_qa(domain: str = Query(None)):
            if not domain:
                raise HTTPException(status_code=400, detail="Missing 'domain' parameter")

            result = await self.service.mock_interview_qa(domain)
            return JSONResponse({"mockInterviewQA": result})

        # -------------------------------
        # 5. MOCK INTERVIEW QA EVALUATION
        # -------------------------------
        @self.router.post("/mock-interview/evaluate-qa")
        async def evaluate_interview_answer(data: dict = Body(...)):
            transcript = data.get("transcript", "").strip()
            topic = data.get("topic", "").strip()
            context = data.get("context", "").strip()
            audio_conf = data.get("audioConfidence", 0.0)

            if not transcript:
                raise HTTPException(status_code=400, detail="Transcript is required")

            result = await self.service.evaluate_interview_answer(
                transcript, topic, context, audio_conf
            )
            return JSONResponse({"evaluation": result})


# EXPORT ROUTER
router = CareerAssistanceRouter().router
