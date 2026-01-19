from pathlib import Path
from app.core.json_store import JSONStore

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"

mentor_store = JSONStore(DATA_DIR / "mentor_data.json", {"mentors": []})
slots_store = JSONStore(DATA_DIR / "mentor_slots.json", {"slots": []})
sessions_store = JSONStore(DATA_DIR / "mentor_sessions.json", {"sessions": []})

