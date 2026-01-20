from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
import logging
from core.logger import setup_logger
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# from core.logger import setup_logger # Already there but I want to restore the block
from api.controllers import (
    dispatcher_controller,
    convert_controller,
    edit_controller,
    organizer_controller,
    password_controller,
    signature_controller,
    ai_controller,
    auth_controller
)
from core.database import engine
from modules.auth import models
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from core.limiter import limiter

# Create all tables in the database
models.Base.metadata.create_all(bind=engine)

# Setup logger
logger = setup_logger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="PDFinity API",
    description="Complete PDF manipulation API for PDFinity web app",
    version="1.0.0"
)

# Add SlowAPI state to app
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)


# Add file size limit middleware (100 MB)
class FileSizeLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, max_size: int = 100 * 1024 * 1024):
        super().__init__(app)
        self.max_size = max_size
    async def dispatch(self, request: Request, call_next):
        if request.method == "POST":
            content_length = request.headers.get("content-length")
            if content_length:
                try:
                    size = int(content_length)
                    if size > self.max_size:
                        raise HTTPException(
                            status_code=413,
                            detail=f"File too large. Maximum size is 100 MB."
                        )
                except ValueError:
                    pass
        return await call_next(request)

app.add_middleware(FileSizeLimitMiddleware, max_size=100*1024*1024)

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routers
app.include_router(dispatcher_controller.router, prefix="/api", tags=["Dispatcher"])
app.include_router(convert_controller.router, prefix="/api", tags=["Convert"])
app.include_router(edit_controller.router, prefix="/api", tags=["Edit"])
app.include_router(organizer_controller.router, prefix="/api", tags=["Organize"])
app.include_router(password_controller.router, prefix="/api", tags=["Password"])
app.include_router(signature_controller.router, prefix="/api", tags=["Signature"])
app.include_router(ai_controller.router, prefix="/api", tags=["AI"])
app.include_router(auth_controller.router, prefix="/api", tags=["Auth"])

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "message": "PDFinity API is running",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Health check for monitoring"""
    return {"status": "ok"}

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error occurred"}
    )

if __name__ == "__main__":
    import uvicorn
    print("="*60)
    print("Starting PDFinity Backend Server")
    print("Host: 0.0.0.0")
    print("Port: 8002")
    print("="*60)
    uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=True)