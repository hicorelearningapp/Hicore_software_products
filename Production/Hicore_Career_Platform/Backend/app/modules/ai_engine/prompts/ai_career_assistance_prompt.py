CAREER_ROADMAP_PROMPT = """
You are an AI that outputs ONLY valid JSON. 
Do not include markdown, backticks, comments, explanations, natural language text, or anything outside the JSON object.

Task:
Generate a structured weekly learning roadmap for the goal: "{goal}".

The output MUST follow EXACTLY this JSON format:

{{
  "title": "AI-powered Learning Roadmap",
  "description": "Your personalized roadmap to master the skills you need to become a {goal_lower}, step by step.",
  "weeks": [
    {{
      "title": "Week 1: [Topic]",
      "points": [
        "First learning goal",
        "Second learning goal",
        "Third learning goal"
      ]
    }}
  ]
}}

Strict Rules:
- Return ONLY a JSON object. No sentences before or after.
- Include exactly 5 or 6 weeks.
- Each week must have exactly 3 short, actionable learning goals.
- Keep the content concise and realistic.
- Follow the provided JSON key names EXACTLY.
"""

ROLE_MATCH_PROMPT = """
You are a career advisor AI.

Input Skills:
[[SKILLS]]

Generate a JSON array of 3–5 suggested tech roles.

Each item must follow this schema:

{
  "role": "string",
  "demand": "High | Medium | Low",
  "match": "percentage like 85%",
  "salary": "₹6-12 LPA",
  "skills": {
    "excellent": "comma separated",
    "intermediate": "comma separated",
    "needsImprovement": "comma separated"
  },
  "suggestion": "2–3 lines"
}

Rules:
- excellent/intermediate must come only from: [[SKILLS]]
- needsImprovement must be skills not in input.
- Output only valid JSON.
"""



# -------------------------------------------
# 5 QUESTIONS + ANSWERS (Q&A MODE)
# -------------------------------------------
MOCK_INTERVIEW_QA_PROMPT = """
You are a technical interviewer.

Generate EXACTLY 5 interview questions AND short answers for the domain "{domain}".

Rules:
- Keep questions short and clear.
- Answers must be 1–2 lines only.
- No markdown.
- Return ONLY valid JSON.

JSON Format:
[
  {{
    "id": 1,
    "question": "What is ...?",
    "answer": "..."
  }}
]
"""


# -------------------------------------------
# EVALUATE ANSWER FOR Q&A MODE
# -------------------------------------------
MOCK_INTERVIEW_EVALUATE_QA_PROMPT = """
You are an AI interview coach.

Evaluate this mock interview response.

Transcript: {transcript}
Topic: {topic}
Context: {context}
Audio Confidence: {audio_confidence}

Respond ONLY in valid JSON:

{{
  "summary": "...",
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


SKILL_MATCH_PROMPT = """
You are an expert technical evaluator.

Your task:
Given:
1. A job role
2. A user profile with skill levels

Return ONLY the skills that are RELEVANT for the job role.
 Do NOT include unrelated skills.
 Do NOT include duplicates.
 Do NOT invent skills not commonly required.

Rules:
- Use standard industry skill expectations for that role.
- If the user does not have a required skill → userLevel = 0
- industryLevel must ALWAYS be between 1 and 10.
- ONLY include skills REQUIRED for the given job role.
- Output must be CLEAN JSON ONLY. No markdown, no text.

Expected JSON format:
{
  "role": "<jobRole>",
  "skills": [
    {
      "name": "Skill Name",
      "userLevel": 0,
      "industryLevel": 8
    }
  ]
}

Job Role: {{job_role}}

User Profile JSON:
{{profile}}
"""

