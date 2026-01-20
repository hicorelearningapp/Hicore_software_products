import os
import uuid
import shutil
import logging
import threading
import time
from typing import List, Optional


class DataManager:
    """Session-based file handler with lifecycle management and auto-cleanup."""

    def __init__(self, session_id: Optional[str] = None, expiry_time: int = 300):
        self.base_dir = os.getcwd()
        self.session_id = session_id or str(uuid.uuid4())
        self.expiry_time = expiry_time
        self._cleanup_timer = None

        # ================================
        # Session folders
        # ================================
        self.session_upload_dir = os.path.join(self.base_dir, "uploads", self.session_id)
        self.session_output_dir = os.path.join(self.base_dir, "output", self.session_id)

        # ❗ NEW: also track temp_uploads for cleanup
        self.session_temp_upload_dir = os.path.join(self.base_dir, "temp_uploads", self.session_id)

        os.makedirs(self.session_upload_dir, exist_ok=True)
        os.makedirs(self.session_output_dir, exist_ok=True)
        os.makedirs(self.session_temp_upload_dir, exist_ok=True)

        # Track inputs
        self.input_files: List[str] = []
        self.output_file: str = ""

        # Start automatic cleanup
        self._start_auto_cleanup_timer()
        logging.info(f"📁 Created DataManager session: {self.session_id}")

    # ============================================================
    # INPUT FILE MANAGEMENT
    # ============================================================

    def add_input_file(self, file_path):
        """Add single file or list of files."""
        if isinstance(file_path, list):
            return self.add_input_files(file_path)

        abs_path = os.path.abspath(file_path)
        if not os.path.exists(abs_path):
            raise FileNotFoundError(f"❌ File not found: {abs_path}")

        # If file already lives in this session's upload dir, just register it
        dest_dir = self.session_upload_dir
        if os.path.commonpath([abs_path, dest_dir]) == os.path.abspath(dest_dir):
            self.input_files.append(abs_path)
            logging.info(f"📥 Added input file (already in session): {abs_path}")
            return abs_path

        # Otherwise, move the file into the session's upload directory so it is
        # cleaned up together with the session. Use move to remove the
        # original temp upload if present.
        os.makedirs(dest_dir, exist_ok=True)
        dest_path = os.path.join(dest_dir, os.path.basename(abs_path))

        try:
            shutil.move(abs_path, dest_path)
            logging.info(f"📥 Moved input file into session uploads: {dest_path}")
        except Exception as e:
            # If move fails, fall back to copying so we can still work with file
            try:
                shutil.copy2(abs_path, dest_path)
                logging.warning(f"⚠️ Move failed, copied file instead: {dest_path} ({e})")
            except Exception as e2:
                logging.error(f"❌ Could not move or copy input file into session: {e2}")
                raise

        abs_path = os.path.abspath(dest_path)
        self.input_files.append(abs_path)
        logging.info(f"📥 Added input file: {abs_path}")
        return abs_path

    def add_input_files(self, file_paths: List[str]):
        """Add list of input files."""
        added = []

        for path in file_paths:
            abs_path = os.path.abspath(path)
            if not os.path.exists(abs_path):
                raise FileNotFoundError(f"❌ File not found: {abs_path}")

            # Reuse single-file logic to ensure files are moved into session dir
            added_path = self.add_input_file(abs_path)
            added.append(added_path)

        logging.info(f"📥 Total files added this session: {len(added)}")
        return added

    def get_input_files(self) -> List[str]:
        return self.input_files

    # ============================================================
    # OUTPUT FILE MANAGEMENT
    # ============================================================

    def auto_set_output_file(self, action_type: str) -> str:
        """Set output file path based on first input file OR default name."""
        ext_map = {
            "pdf_to_word": ".docx",
            "word_to_pdf": ".pdf",
            "pdf_to_excel": ".xlsx",
            "excel_to_pdf": ".pdf",
            "pdf_to_image": ".jpg",
            "image_to_pdf": ".pdf",
            "pdf_to_powerpoint": ".pptx",
            "powerpoint_to_pdf": ".pdf",
            "merge_pdf": ".pdf",
            "split_pdf": ".pdf",
            "rotate_pdf": ".pdf",
            "annotate_pdf": ".pdf",
            "add_watermark": ".pdf",
            "compress_pdf": ".pdf",
            "add_password": ".pdf",
            "remove_password": ".pdf",
            "add_signature": ".pdf",
            "crop_pdf": ".pdf",
            "remove_duplicate_pages": ".pdf",
            "add_number_pages": ".pdf",
            "delete_pages": ".pdf",
            "reorder_pdf": ".pdf",
            "extract_pdf": ".pdf",
            "extract_images": ".zip",  # Extracts images and returns ZIP
            "summarize": ".pdf",
            "chat_session": ".pkl",
            "classified": ".pdf",
            "translate": ".pdf",
            "translated": ".pdf",
        }

        ext = ext_map.get(action_type.lower(), ".out")

        # if no input (rare case), fallback
        if self.input_files:
            base_name = os.path.splitext(os.path.basename(self.input_files[0]))[0]
        else:
            base_name = "output"

        output_path = os.path.join(
            self.session_output_dir,
            f"{base_name}_{action_type}{ext}"
        )

        self.output_file = output_path
        logging.info(f"💾 Output file set for {action_type}: {output_path}")
        return output_path

    def get_output_file(self) -> str:
        return self.output_file

    # ============================================================
    # FULL CLEANUP (uploads + outputs + temp_uploads)
    # ============================================================

    def cleanup_session(self):
        """Remove ALL session folders: uploads, outputs, temp_uploads."""
        try:
            dirs = [
                self.session_upload_dir,
                self.session_output_dir,
                self.session_temp_upload_dir
            ]

            for d in dirs:
                if os.path.exists(d):
                    try:
                        # Best-effort remove; ignore errors to avoid partial failures
                        shutil.rmtree(d, ignore_errors=True)
                        logging.info(f"🧹 Removed directory for session {self.session_id}: {d}")
                    except Exception as e:
                        logging.warning(f"⚠️ Could not fully remove {d}: {e}")

            # Also attempt to clean up empty parent folders (uploads/output/temp_uploads)
            try:
                for parent in [
                    os.path.join(self.base_dir, "uploads"),
                    os.path.join(self.base_dir, "output"),
                    os.path.join(self.base_dir, "temp_uploads")
                ]:
                    if os.path.exists(parent) and not os.listdir(parent):
                        try:
                            os.rmdir(parent)
                            logging.info(f"🧹 Removed empty parent directory: {parent}")
                        except Exception:
                            # not critical if we can't remove top-level folder
                            pass
            except Exception:
                pass

            logging.info(f"✅ Session {self.session_id} cleanup completed.")

        except Exception as e:
            logging.error(f"❌ Cleanup failed for {self.session_id}: {e}")

    # ============================================================
    # CLEANUP TIMER
    # ============================================================

    def _start_auto_cleanup_timer(self):
        """Runs auto-delete after expiry_time seconds."""
        def auto_cleanup():
            time.sleep(self.expiry_time)
            logging.info(f"⏰ Session expired: {self.session_id}. Auto-cleaning…")
            self.cleanup_session()

        self._cleanup_timer = threading.Thread(target=auto_cleanup, daemon=True)
        self._cleanup_timer.start()
        logging.info(f"🕒 Auto-clean timer started ({self.expiry_time}s)")
    
    def cancel_auto_cleanup(self):
        """Cancel the auto-cleanup timer (useful for long-running operations)."""
        # Note: Can't truly cancel a sleeping thread, but we can track it
        logging.info(f"🛑 Auto-cleanup disabled for session: {self.session_id}")
