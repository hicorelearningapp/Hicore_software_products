from app.modules.ai_resume_builder.prompts.resume_prompts import (
    RESUME_SUMMARY_PROMPT,
    RESUME_EXPERIENCE_PROMPT,
    RESUME_DEFAULT_PROMPT
)

class ResumePromptFactory:
    """Factory to select the correct resume rewrite prompt."""

    @staticmethod
    def get_prompt(section: str, content: str) -> str:
        section = section.strip().lower()

        mapping = {
            "summary": RESUME_SUMMARY_PROMPT,
            "experience": RESUME_EXPERIENCE_PROMPT,
        }

        template = mapping.get(section, RESUME_DEFAULT_PROMPT)
        return template.format(content=content)
