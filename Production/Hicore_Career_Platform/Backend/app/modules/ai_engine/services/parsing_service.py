import json
import ast
import re


def extract_json_from_text(text: str):
    text = text.strip()  # Production improvement

    match = re.search(r'(\{[\s\S]*\}|\[[\s\S]*\])', text)
    if match:
        return match.group(1)

    if '"mainTopic"' in text:
        start = text.find('"mainTopic"')
        partial = text[start:]

        arr_start = partial.find("[")
        arr_end = partial.rfind("]")

        if arr_start != -1 and arr_end != -1:
            array_str = partial[arr_start : arr_end + 1]
            return f'{{ "mainTopic": {array_str} }}'

    return None



def safe_json_load(text: str, label: str = ""):
    if not text:
        return []
    try:
        return json.loads(text)
    except Exception:
        try:
            return ast.literal_eval(text)
        except Exception:
            return []


def fallback_parse_bullets(text: str):
    lines = text.split("\n")
    return [line.strip("-• ").strip() for line in lines if line.strip()]


def normalize_text(text: str) -> str:
    return re.sub(r"[^a-zA-Z0-9]", "", text).lower()
