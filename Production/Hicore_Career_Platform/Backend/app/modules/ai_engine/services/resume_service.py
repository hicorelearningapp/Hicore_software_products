from app.core.logger import logger
from app.modules.ai_engine.managers.ai_manager import AIManager
from app.modules.ai_engine.prompts.resume_prompt import RESUME_BULLET_PROMPT
from app.modules.ai_engine.services.parsing_service import extract_json_from_text, fallback_parse_bullets, \
    safe_json_load


class ResumeService:
    def __init__(self, ai: AIManager):
        self.ai = ai

    def get_resume_bullets(self, job_description: str):
        prompt = RESUME_BULLET_PROMPT.format(job_description=job_description)

        logger.debug(f"Resume Prompt Sent:\n{prompt}")

        raw = self.ai.generate(prompt)
        logger.debug(f"Resume Raw Output: {raw}")

        extracted = extract_json_from_text(raw)
        logger.debug(f"Resume Extracted JSON: {extracted}")

        bullets = safe_json_load(extracted, "Resume") if extracted else fallback_parse_bullets(raw)

        if not isinstance(bullets, list):
            logger.error(f"Invalid resume JSON structure. Extracted content: {extracted}")
            return []

        logger.debug(f"Parsed Resume Bullets: {bullets}")

        return bullets
