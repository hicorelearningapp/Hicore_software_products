import logging
import os
from logging.handlers import TimedRotatingFileHandler

# -----------------------------
# Create logs folder
# -----------------------------
LOG_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "logs")
os.makedirs(LOG_DIR, exist_ok=True)

LOG_FILE = os.path.join(LOG_DIR, "app.log")


# -----------------------------
# Configure Logger
# -----------------------------
def get_logger(name: str = "app"):
    logger = logging.getLogger(name)

    if not logger.handlers:
        logger.setLevel(logging.INFO)

        # Format
        formatter = logging.Formatter(
            "[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        )

        # File handler (rotates daily)
        file_handler = TimedRotatingFileHandler(
            LOG_FILE, when="midnight", interval=1, backupCount=7, encoding="utf-8"
        )
        file_handler.setFormatter(formatter)

        # Console handler
        console_handler = logging.StreamHandler()
        console_handler.setFormatter(formatter)

        logger.addHandler(file_handler)
        logger.addHandler(console_handler)

        logger.propagate = False  # Prevent duplicate logs

    return logger


# Global logger instance
logger = get_logger()
