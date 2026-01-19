# app/modules/ai_engine/utils/json_cleaner.py
import re

def extract_clean_json(raw: str):
    raw = raw.strip()

    if raw.startswith("```"):
        raw = raw.replace("```json", "").replace("```", "").strip()

    match = re.search(r"\[.*\]|\{.*\}", raw, re.DOTALL)
    return match.group(0) if match else None


def clean_json(raw: str):
    raw = raw.strip()

    if raw.startswith("```"):
        raw = raw.replace("```json", "").replace("```", "").strip()

    match = re.search(r"(\{.*\}|\[.*\])", raw, re.DOTALL)
    return match.group(0) if match else raw
