FLASHCARD_PROMPT = """
Generate 5 flashcards (Q&A format) from this job description.

Return only valid JSON:
[
  {{ "question": "What is ...?", "answer": "It is ..." }}
]

Job Description:
{job_description}
"""
