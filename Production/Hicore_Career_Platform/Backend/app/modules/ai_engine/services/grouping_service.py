from ..managers.ai_manager import AIManager
from .parsing_service import extract_json_from_text, safe_json_load, normalize_text
from ..prompts.topic_prompt import TOPIC_EXTRACTION_PROMPT
from app.core.logger import logger


class SkillService:
    def __init__(self, ai: AIManager):
        self.ai = ai

    def extract_skills(self, job_description: str):
        prompt = TOPIC_EXTRACTION_PROMPT.format(job_description=job_description)

        logger.debug(f"Skill Extraction Prompt Sent:\n{prompt}")

        raw = self.ai.generate(prompt)
        logger.debug(f"Raw AI Skill Output: {raw}")

        extracted = extract_json_from_text(raw)
        logger.debug(f"Extracted JSON: {extracted}")

        skills = safe_json_load(extracted, "Skills")

        if not isinstance(skills, dict):
            logger.error(f"Skill extraction returned invalid structure. Extracted: {extracted}")
            return {"mainTopic": []}

        return skills

    def smart_group_skills(self, skills_json):
        flat = []

        for item in skills_json.get("mainTopic", []):
            title = item.get("title", "").strip()
            subs = item.get("subtopics", [])
            if isinstance(subs, list):
                flat.append((title, subs))

        groups = {}

        for title, subs in flat:
            norm = normalize_text(title)
            matched = False

            for existing in groups.keys():
                if normalize_text(existing) in norm or norm in normalize_text(existing):
                    groups[existing].extend(subs)
                    matched = True
                    break

            if not matched:
                groups[title] = subs

        return [
            {"title": title, "subtopics": sorted(set(subs))}
            for title, subs in groups.items()
        ]
