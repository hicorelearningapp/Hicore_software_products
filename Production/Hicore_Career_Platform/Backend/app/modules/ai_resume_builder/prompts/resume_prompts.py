# ---------------------------------------------------
# Resume Summary Rewrite
# ---------------------------------------------------
RESUME_SUMMARY_PROMPT = """
You are a professional resume writer.

Rewrite the following resume summary using polished, confident,
and concise professional language.

Avoid overused terms like “hardworking” or “dedicated”.
Keep it strong, modern, industry-ready.

User Summary:
\"\"\"{content}\"\"\"

Return ONLY the rewritten summary text.
No markdown, no notes, no explanations.
"""


# ---------------------------------------------------
# Resume Experience Rewrite
# ---------------------------------------------------
RESUME_EXPERIENCE_PROMPT = """
You are an expert resume writer.

Rewrite the following experience entry using:
- strong action verbs
- measurable achievements (if possible)
- concise professional tone

User Experience:
\"\"\"{content}\"\"\"

Return ONLY one rewritten version.
No bullet points, no explanations, no formatting.
"""


# ---------------------------------------------------
# Default Resume Section Rewrite
# ---------------------------------------------------
RESUME_DEFAULT_PROMPT = """
You are a professional resume editor.

Improve the following resume content for:
- clarity
- tone
- impact
- professionalism

User Content:
\"\"\"{content}\"\"\"

Return ONLY one improved version with no extra formatting.
"""
