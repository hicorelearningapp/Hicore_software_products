import json
from ..managers.ai_manager import AIManager
from .parsing_service import extract_json_from_text
from app.core.logger import logger


class AIStructureService:
    def __init__(self, ai: AIManager):
        self.ai = ai

    def generate_response_document(self, prompt: str, topic: str):
        formatted = prompt.format(job_description=topic, topic=topic)
        logger.debug(f"Prompt Sent:\n{formatted}")

        raw = self.ai.generate(formatted)
        logger.debug(f"AI Raw Output: {raw}")

        text = raw.strip()

        # Remove markdown fences
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]

        logger.debug(f"Cleaned AI Output: {text}")

        # Extract valid JSON from the cleaned text
        extracted = extract_json_from_text(text)
        logger.debug(f"Extracted JSON Block: {extracted}")

        if not extracted:
            logger.error("No JSON structure detected in AI output.")
            return []

        try:
            parsed = json.loads(extracted)
            logger.debug(f"Parsed JSON: {parsed}")
            return parsed
        except Exception as e:
            logger.error(f"Final JSON parsing failed: {e}")
            return []
