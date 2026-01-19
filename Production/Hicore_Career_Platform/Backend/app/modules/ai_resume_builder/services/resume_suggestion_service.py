from fastapi import HTTPException
from app.modules.ai_engine.managers.ai_manager import AIManager
from app.modules.ai_engine.services.gemini_service import AI_KEY, AI_ENGINE
from .resume_prompt_factory import ResumePromptFactory

ai = AIManager(AI_ENGINE, AI_KEY)

def clean_ai_output(output):
    """
    Converts list/dict/quoted text into clean plain text.
    """
    # If AI returned a list like ['text']
    if isinstance(output, list) and len(output) > 0:
        return output[0].strip()

    # If AI returned a dict accidentally
    if isinstance(output, dict):
        # Get first value
        return next(iter(output.values())).strip()

    # If AI returned string with ["text"] or ['text']
    text = str(output).strip()

    # Remove surrounding list brackets
    if text.startswith("[") and text.endswith("]"):
        text = text[1:-1].strip()

    # Remove surrounding quotes
    if (text.startswith('"') and text.endswith('"')) or (text.startswith("'") and text.endswith("'")):
        text = text[1:-1]

    return text.strip()

async def generate_resume_suggestion(section: str, content: str) -> str:
    try:
        prompt = ResumePromptFactory.get_prompt(section, content)
        response = ai.generate(prompt)

        print("raw response:", response)

        # CLEAN the output
        suggestion = clean_ai_output(response)

        if not suggestion:
            raise HTTPException(status_code=500, detail="Empty AI response")

        return suggestion

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"SUGGESTION_FAILED: {e}")
