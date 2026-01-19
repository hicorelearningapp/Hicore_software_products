RESUME_BULLET_PROMPT = """
You're a technical resume writer. Based on the job description below, generate exactly 6 strong resume bullet points suitable for a job seeker.

Return only valid JSON:
[
  "Built ...",
  "Led ...",
  "Optimized ..."
]

Job Description:
{job_description}
"""
