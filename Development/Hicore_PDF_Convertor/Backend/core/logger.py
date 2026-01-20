import logging
import os
import sys

def setup_logger(name: str):
    """Sets up a UTF-8 safe project-wide logger with both file and console output."""
    base_dir = os.getcwd()
    log_file = os.path.join(base_dir, "logs.txt")

    # Ensure UTF-8 for stdout (avoids emoji/Unicode crash on Windows)
    sys.stdout.reconfigure(encoding="utf-8")

    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)

    if not logger.handlers:
        # File handler (UTF-8 safe)
        file_handler = logging.FileHandler(log_file, encoding="utf-8")
        file_handler.setFormatter(logging.Formatter(
            "%(asctime)s | %(levelname)s | %(name)s | %(message)s"
        ))

        # Console handler (UTF-8 safe)
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setFormatter(logging.Formatter(
            "%(levelname)s | %(message)s"
        ))

        logger.addHandler(file_handler)
        logger.addHandler(console_handler)

    return logger
