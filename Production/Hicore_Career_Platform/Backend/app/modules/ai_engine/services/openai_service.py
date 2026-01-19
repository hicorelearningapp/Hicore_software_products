from openai import OpenAI
import logging

logger = logging.getLogger(__name__)

AI_ENGINE = "openai"
AI_KEY = "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"

class OpenAIService:
    def __init__(self, api_key: str, model: str = "gpt-4o-mini"):
        if not api_key:
            raise ValueError("OpenAI API key is missing!")

        self.client = OpenAI(api_key=api_key)
        self.model = model

    def generate(self, prompt: str) -> str:
        """
        Sends a prompt to OpenAI and returns raw text.
        Matches behavior of GeminiService for compatibility.
        """
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0,
            )

            content = response.choices[0].message.content

            if not content:
                logger.error("OpenAI returned empty content.")
                return ""

            return content.strip()

        except Exception as e:
            logger.error(f"OpenAI generation error: {e}")
            return ""
