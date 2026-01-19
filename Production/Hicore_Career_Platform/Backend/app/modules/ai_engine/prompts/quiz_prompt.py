QUIZ_PROMPT = """
Generate 5 multiple choice questions from this job description.

Each question should include:
- `question`: The question text.
- `options`: An array of 4 options.
- `correctIndex`: The index (0–3) of the correct answer in the options array.
- `explanation`: A brief explanation for the correct answer.

Return only valid JSON:
[
  {{
    "question": "Which hook is used to manage state in React?",
    "options": ["useEffect", "useState", "useMemo", "useRef"],
    "correctIndex": 1,
    "explanation": "useState is used to create and manage local component state."
  }}
]

Job Description:
{job_description}
"""
