# app/modules/ai_engine/services/career_assistance_service.py

import json
from fastapi import HTTPException
from ..managers.ai_manager import AIManager
from ..utils.json_cleaner import clean_json
from ..prompts.ai_career_assistance_prompt import (
    CAREER_ROADMAP_PROMPT,
    ROLE_MATCH_PROMPT,
    SKILL_MATCH_PROMPT,
    MOCK_INTERVIEW_EVALUATE_QA_PROMPT,
    MOCK_INTERVIEW_QA_PROMPT
)
from ...profile.managers.student_profile_service import StudentProfileService


class AICareerAssistanceService:
    def __init__(self, ai: AIManager):
        self.ai = ai

    # ------------------------------------------------------
    # CAREER ROADMAP
    # ------------------------------------------------------
    async def get_career_roadmap(self, goal: str):
        prompt = CAREER_ROADMAP_PROMPT.format(
            goal=goal,
            goal_lower=goal.lower().strip()
        )

        try:
            response = self.ai.generate(prompt)
            return response
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    # ------------------------------------------------------
    # ROLE MATCHES
    # ------------------------------------------------------
    async def get_role_matches(self, skills_list):
        skills_str = ", ".join(skills_list)
        prompt = ROLE_MATCH_PROMPT.replace("[[SKILLS]]", skills_str)

        try:
            return self.ai.generate(prompt)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    # ------------------------------------------------------
    # COMPARE SKILLS AI
    # ------------------------------------------------------
    async def compare_skills_ai(self, job_role, user_id, user_manager):
        profile_service = StudentProfileService(user_manager)

        try:
            # Fetch all profiles
            profiles = await profile_service.list_profiles()

            # Find user
            profile = next(
                (p for p in profiles if p.get("basicInfo", {}).get("user_id") == user_id),
                None
            )

            if not profile:
                raise HTTPException(status_code=404, detail="User profile not found")

            # Extract resume skills
            resume_skills = profile.get("skillsResume", {}).get("resume_skills", [])
            skills_str = ", ".join(resume_skills)

            # No skills found?
            if not resume_skills:
                raise HTTPException(
                    status_code=400,
                    detail="No resume skills found for this user."
                )

            # Prepare prompt
            prompt = SKILL_MATCH_PROMPT \
                .replace("{{job_role}}", job_role) \
                .replace("{{skills}}", skills_str)

            # Call Gemini
            ai_output = self.ai.generate(prompt)

            # If dict → return direct
            if isinstance(ai_output, (dict, list)):
                return ai_output

            # Clean JSON
            cleaned = clean_json(str(ai_output))
            return json.loads(cleaned)

        except HTTPException:
            raise

        except Exception as e:
            # Return readable JSON error to frontend
            raise HTTPException(
                status_code=500,
                detail=f"Skill comparison failed: {str(e)}"
            )

    # ------------------------------------------------------
    # MOCK INTERVIEW QA
    # ------------------------------------------------------
    async def mock_interview_qa(self, domain):
        prompt = MOCK_INTERVIEW_QA_PROMPT.format(domain=domain)

        try:
            response = self.ai.generate(prompt)

            if isinstance(response, (dict, list)):
                return response

            cleaned = clean_json(str(response))
            return json.loads(cleaned)

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    # ------------------------------------------------------
    # MOCK INTERVIEW EVALUATE QA
    # ------------------------------------------------------
    async def evaluate_interview_answer(self, transcript, topic, context, audio_conf):
        prompt = MOCK_INTERVIEW_EVALUATE_QA_PROMPT.format(
            transcript=transcript,
            topic=topic,
            context=context,
            audio_confidence=audio_conf
        )

        try:
            response = self.ai.generate(prompt)

            if isinstance(response, dict):
                return response

            cleaned = clean_json(str(response))
            return json.loads(cleaned)

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Evaluation Failed: {e}")
