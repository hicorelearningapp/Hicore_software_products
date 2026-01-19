import uuid
import re


def generate_course_id(domain: str, months: int) -> str:
    """
    Generate dynamic course IDs like:
    AI-6M-COURSE-A1B2C3D4
    DATA-SCIENCE-3M-COURSE-9F3B12AA

    - Converts domain → uppercase prefix
    - Removes non-alphanumeric characters
    - Replaces spaces with hyphens
    - Ensures prefix is clean for URLs
    """

    # Normalize domain → PREFIX
    # Example: "Data Science" → "DATA-SCIENCE"
    clean_prefix = re.sub(r"[^A-Za-z0-9 ]+", "", domain).strip()
    clean_prefix = re.sub(r"\s+", "-", clean_prefix).upper()

    # Fallback prefix if domain empty
    if not clean_prefix:
        clean_prefix = "GEN"

    # Unique 8-character ID
    unique_id = uuid.uuid4().hex[:8].upper()

    return f"{clean_prefix}-{months}M-COURSE-{unique_id}"
