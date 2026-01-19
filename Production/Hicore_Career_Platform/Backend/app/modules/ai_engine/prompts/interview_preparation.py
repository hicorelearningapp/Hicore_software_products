
QUIZ_PROMPT_TEMPLATE = """
Generate a multiple choice quiz with the following settings:
- Topic: {topic}
- Difficulty Level: {level}
- Number of Questions: {count}
- Mode: {mode} (practice: include explanations, challenge: no explanations)

Return ONLY valid JSON in this format:
[
  {{
    "id": 1,
    "question": "What is X?",
    "options": ["A", "B", "C", "D"],
    "answer": "Correct answer",
    "explanation": "Why it is correct"
  }}
]
"""


FLASHCARD_PROMPT_TEMPLATE = """
Generate flashcards (Q&A format) with the following settings:
- Topic: {topic}
- Difficulty Level: {level}
- Number of Questions: {count}

Return ONLY valid JSON in this format:
[
  {{
    "id": 1,
    "question": "What is X?",
    "answer": "Correct answer"
  }}
]
"""

# -------------------------------------------
# 5 QUESTIONS (NO ANSWERS)
# -------------------------------------------
MOCK_INTERVIEW_PROMPT = """
You are an AI interview simulator.

Generate EXACTLY 5 short questions for a mock interview.

Job Role: {jobrole}
Interview Type: {interview_type}
Difficulty Level: {difficulty}

Rules:
- Beginner → simple questions
- Intermediate → analytical questions
- Advanced → conceptual & scenario questions
- Keep questions crisp, short, clear.

Respond ONLY in this JSON format (no markdown):

[
  {{
    "id": 1,
    "question": "Your question here"
  }}
]
"""


# -------------------------------------------
# EVALUATE ANSWER FOR Q ONLY
# -------------------------------------------
MOCK_INTERVIEW_EVALUATE_PROMPT = """
You are an AI interview evaluator.

Evaluate the following answer based on:

- confidence
- clarity
- depth
- technical accuracy

Job Role: {jobrole}
Interview Type: {interview_type}
Difficulty: {difficulty}
Question Context: {context}
Answer Transcript: {transcript}
Audio Confidence: {audio_confidence}

Respond ONLY in this JSON format:

{{
  "summary": "...",
  "domain": "{jobrole}",
  "scores": {{
    "confidence": {{
      "score": 0-10,
      "feedback": "..."
    }},
    "structure_clarity": {{
      "score": 0-10,
      "feedback": "..."
    }},
    "depth": {{
      "score": 0-10,
      "feedback": "..."
    }},
    "technical_accuracy": {{
      "score": 0-10,
      "feedback": "..."
    }}
  }},
  "highlights": ["..."],
  "suggestions": ["..."]
}}
"""

