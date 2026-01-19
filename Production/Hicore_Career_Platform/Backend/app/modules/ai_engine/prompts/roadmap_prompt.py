ROADMAP_PROMPT = """
You are an AI tutor. For each of the following technical topics, generate a simple beginner-level learning roadmap.

Return only valid JSON:
[
  {{
    "topic": "Short title + summary",
    "details": [
      "- First step",
      "- Second step"
    ]
  }}
]

Topics:
{topic}
"""
