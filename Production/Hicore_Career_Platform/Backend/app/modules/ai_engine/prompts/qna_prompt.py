QNA_PROMPT = """
Generate 5 simple Q&A pairs from this job description.

Return only valid JSON:
[
  {{ "question": "What is required?", "answer": "React and Node.js experience" }}
]

Job Description:
{job_description}
"""
