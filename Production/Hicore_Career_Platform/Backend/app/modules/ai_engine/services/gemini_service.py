import google.generativeai as genai

AI_ENGINE = "gemini"
AI_KEY = "AIzaSyByj8-X0Un8qZhP0YvZofg5hKnLKDRwuNo"
# AI_KEY="AIzaSyDCqpVGpvL3QR8B_e7lZ10bJ8oKb599CwM"

# AI_ENGINE = "openai"
# AI_KEY = "sk-live-qTWhWPjQzqLhjyjHKWReNRHh-ACHpa8yhNb9NrjSmHIPuZAB5PP4h5A5h_HteCz3FC7aZ7NDUYT3BlbkFJlKqt4fJBrgPElH3F23DndMJREo_ClXgoroR_TO22EMggNEfmBhpO7-jkEEqjcz77R0_MzzH-AA"

class GeminiService:
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)

        self.model = genai.GenerativeModel(
            "gemini-2.5-flash",
            generation_config={
                "temperature": 0.0,
                "top_p": 1,
                "top_k": 1,
                "candidate_count": 1,
                "max_output_tokens": 2500
            }
        )

    def generate(self, prompt: str):
        response = self.model.generate_content(prompt)
        return response.text.strip()       # return raw text, not JSON
