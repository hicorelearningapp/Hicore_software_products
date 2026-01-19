from app.core.json_store import JSONStore

mentor_session_store = JSONStore(
    file_path="app/data/mentor_project_sessions.json",
    default={"sessions": [], "last_id": 0}
)
