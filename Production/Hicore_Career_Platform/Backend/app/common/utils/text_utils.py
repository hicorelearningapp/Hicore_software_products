# app/utils/text_utils.py
import re
import unicodedata
import numpy as np
from typing import Sequence

def normalize_text(text: str) -> str:
    """Lowercase, strip, remove multiple spaces and non-printable chars."""
    if not text:
        return ""
    s = str(text)
    s = unicodedata.normalize("NFKD", s)
    s = s.replace("\n", " ").replace("\r", " ")
    s = re.sub(r"\s+", " ", s)
    s = s.strip()
    return s

def cosine_similarity(a: Sequence[float], b: Sequence[float]) -> float:
    """Return cosine similarity between two vectors. Safe to use on python lists or numpy arrays."""
    if a is None or b is None:
        return 0.0
    va = np.array(a, dtype=float)
    vb = np.array(b, dtype=float)
    a_norm = np.linalg.norm(va)
    b_norm = np.linalg.norm(vb)
    if a_norm == 0 or b_norm == 0:
        return 0.0
    return float(np.dot(va, vb) / (a_norm * b_norm))
