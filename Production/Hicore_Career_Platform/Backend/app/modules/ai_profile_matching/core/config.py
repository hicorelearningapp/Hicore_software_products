# app/core/config.py

import os
import pickle
from sentence_transformers import SentenceTransformer


class Settings:

    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    DATA_DIR = os.path.join(BASE_DIR, "data")
    os.makedirs(DATA_DIR, exist_ok=True)

    PKL_FILE = os.path.join(DATA_DIR, "student_profiles_vectors.pkl")

    # Lightweight embedding model
    MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"


settings = Settings()

# -----------------------------
# Load Embedding Model Once
# -----------------------------
model = SentenceTransformer(settings.MODEL_NAME, device="cpu")

# -----------------------------
# Ensure PKL Exists
# -----------------------------
if not os.path.exists(settings.PKL_FILE):
    with open(settings.PKL_FILE, "wb") as f:
        pickle.dump([], f)
