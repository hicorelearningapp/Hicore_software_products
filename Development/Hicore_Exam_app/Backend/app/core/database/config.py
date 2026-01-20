import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from sqlalchemy.exc import SQLAlchemyError

# ============================================================
# DATABASE CONFIGURATION
# ============================================================

DB_TYPE = os.getenv("DB_TYPE", "sqlite").lower()  # sqlite / postgres / mysql
DB_USER = os.getenv("DB_USER", "user")
DB_PASSWORD = os.getenv("DB_PASSWORD", "password")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "")
DB_NAME = os.getenv("DB_NAME", "AI_career_studio.db")

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
PROVIDER = os.getenv("PROVIDER", "gemini")

# ============================================================
# DYNAMIC DATABASE URL BUILDER
# ============================================================

if DB_TYPE == "postgres":
    DB_PORT = DB_PORT or "5432"
    DATABASE_URL = f"postgresql+asyncpg://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
elif DB_TYPE == "mysql":
    DB_PORT = DB_PORT or "3306"
    DATABASE_URL = f"mysql+aiomysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
elif DB_TYPE == "sqlite":
    DATABASE_URL = f"sqlite+aiosqlite:///{DB_NAME}"
else:
    raise ValueError(f"Unsupported DB_TYPE: {DB_TYPE}")

# ============================================================
# SQLAlchemy Setup
# ============================================================

Base = declarative_base()

async_engine = create_async_engine(
    DATABASE_URL,
    echo=False,          # Set to True to see SQL queries in logs
    future=True,
    pool_pre_ping=True   # Detect and recycle broken connections
)

async_session = async_sessionmaker(
    bind=async_engine,
    expire_on_commit=False,
    class_=AsyncSession
)

# ============================================================
# FastAPI Dependency for Async DB Session
# ============================================================

async def get_db() -> AsyncSession:
    """
    ✅ Provides one async database session per request.
    Rolls back on exception and always closes session.
    """
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except SQLAlchemyError as e:
            await session.rollback()
            raise e
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

# ============================================================
# Database Initialization Helper (Optional)
# ============================================================

async def init_db():
    """
    ✅ Call this on app startup to automatically create tables
    (useful for SQLite or first-time setup).
    """
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
