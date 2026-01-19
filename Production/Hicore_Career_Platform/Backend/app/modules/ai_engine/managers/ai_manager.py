from ..services.gemini_service import GeminiService
from ..services.openai_service import OpenAIService

class AIManager:
    def __init__(self, engine: str, api_key: str):
        if engine == "gemini":
            self.engine = GeminiService(api_key)
        elif engine == "openai":
            self.engine = OpenAIService(api_key)
        else:
            raise ValueError("Invalid AI engine")

    def generate(self, prompt: str):
        return self.engine.generate(prompt)
