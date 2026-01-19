from pathlib import Path
from app.core.json_store import JSONStore

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR

bookmark_store = JSONStore(DATA_DIR / "bookmarks.json", {"bookmarks": []})
