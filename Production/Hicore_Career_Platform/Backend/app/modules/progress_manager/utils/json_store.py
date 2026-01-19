from pathlib import Path
from app.core.json_store import JSONStore

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR

progress_store = JSONStore(DATA_DIR / "progress.json", {"users": []})
