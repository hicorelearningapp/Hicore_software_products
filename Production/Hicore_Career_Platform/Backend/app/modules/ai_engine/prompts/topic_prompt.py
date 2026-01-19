TOPIC_EXTRACTION_PROMPT = """
Extract key skill areas from the following job description and organize them into JSON format.

Return only valid JSON.

Job Description:
{job_description}

Format:
{{
  "mainTopic": [
    {{
      "title": "Main Topic 1",
      "subtopics": ["Subtopic A", "Subtopic B","Subtopic C","Subtopic D","Subtopic E",etc]
    }}
  ]
}}
"""
