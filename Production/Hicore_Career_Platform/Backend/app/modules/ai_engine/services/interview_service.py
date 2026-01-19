# app/modules/ai_engine/services/interview_service.py

import json
from fastapi import HTTPException
from ..managers.ai_manager import AIManager
from ..utils.json_cleaner import extract_clean_json, clean_json
from ..prompts.interview_preparation import (
    QUIZ_PROMPT_TEMPLATE,
    FLASHCARD_PROMPT_TEMPLATE,
    MOCK_INTERVIEW_PROMPT,
    MOCK_INTERVIEW_EVALUATE_PROMPT
)

class AIInterviewService:
    def __init__(self, ai: AIManager):
        self.ai = ai

    # ------------------------------------
    # QUIZ GENERATOR
    # ------------------------------------
    async def generate_quiz(self, topic, level, count, mode):
        prompt = QUIZ_PROMPT_TEMPLATE.format(
            topic=topic, level=level, count=count, mode=mode
        )

        try:
            response = self.ai.generate(prompt)

            if isinstance(response, (list, dict)):
                return response

            json_str = extract_clean_json(str(response))
            if not json_str:
                raise Exception("Failed to extract JSON")

            return json.loads(json_str)

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    # ------------------------------------
    # FLASHCARD GENERATOR
    # ------------------------------------
    async def generate_flashcard(self, topic, level, count):
        prompt = FLASHCARD_PROMPT_TEMPLATE.format(
            topic=topic, level=level, count=count
        )

        try:
            response = self.ai.generate(prompt)

            if isinstance(response, (list, dict)):
                return response

            json_str = extract_clean_json(str(response))
            if not json_str:
                raise Exception("Failed to extract JSON")

            return json.loads(json_str)

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    # ------------------------------------
    # MOCK INTERVIEW GENERATOR
    # ------------------------------------
    async def generate_mock_interview(self, interview_type, difficulty, jobrole):
        prompt = MOCK_INTERVIEW_PROMPT.format(
            interview_type=interview_type,
            difficulty=difficulty,
            jobrole=jobrole
        )

        try:
            response = self.ai.generate(prompt)

            if isinstance(response, (dict, list)):
                return response

            cleaned = clean_json(str(response))
            return json.loads(cleaned)

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Mock Interview Failed: {e}")

    # ------------------------------------
    # MOCK INTERVIEW EVALUATION
    # ------------------------------------
    async def evaluate_mock(self, transcript, context, audio_conf, interview_type, difficulty, jobrole):
        prompt = MOCK_INTERVIEW_EVALUATE_PROMPT.format(
            jobrole=jobrole,
            interview_type=interview_type,
            difficulty=difficulty,
            context=context,
            transcript=transcript,
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
