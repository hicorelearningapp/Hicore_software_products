from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import uvicorn
from app.core.startup import startup_event


app = FastAPI(
    title="ExamAI Content API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    """
    Correct startup. Pass app instance to startup_event.
    (startup_event should NOT import app.main — that caused circular import)
    """
    await startup_event(app)

# Homepage
from app.modules.exams.services.content_service import ContentService
_service = ContentService()

@app.get("/homepage")
def homepage():
    return _service.get_homepage()

BASE_DIR = Path(__file__).resolve().parent.parent
IMAGES_DIR = BASE_DIR / "app" / "data" / "assets"
app.mount("/assets", StaticFiles(directory=IMAGES_DIR), name="assets")


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8085, reload=True)
