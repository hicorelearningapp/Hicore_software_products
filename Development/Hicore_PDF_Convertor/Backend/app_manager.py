import logging
from core.data_manager import DataManager
from core.logger import setup_logger
from managers.convert_manager import ConvertManager
from managers.edit_manager import EditManager
from managers.organizer_manager import OrganizeManager
from managers.password_manager import PasswordManager
from managers.signature_manager import SignatureManager
from managers.ai_manager import AIManager

# ============================================================
# 🧠 APP MANAGER — Central Orchestrator
# ============================================================
# Handles routing of all operations (convert, edit, organize, password, signature, ai)
# Each call uses its own DataManager session for isolation.
# ============================================================

logger = setup_logger(__name__)

class AppManager:
    def __init__(self):
        self.active_sessions = {}
        logger.info("🚀 AppManager initialized successfully.")

    # ========================================================
    # 🧩 Create Fresh Session
    # ========================================================
    def _get_data_manager(self):
        """Creates a new DataManager session per operation."""
        dm = DataManager()
        self.active_sessions[dm.session_id] = dm
        return dm

    # ========================================================
    # ⚙️ Main Dispatcher (used by tests)
    # ========================================================
    def run_action(self, category: str, action_type: str, input_data, **kwargs):
        """
        Dynamically routes to the appropriate manager based on category.
        Used by test_app.py and FastAPI routes.
        """
        try:
            logger.info(f"⚙️ Running {category} → {action_type}")

            data_manager = self._get_data_manager()

            if category == "convert":
                manager = ConvertManager(data_manager)
                return manager.start_action(action_type, input_data)

            elif category == "edit":
                manager = EditManager(data_manager)
                return manager.start_action(action_type, input_data, **kwargs)

            elif category == "organize":
                manager = OrganizeManager(data_manager)
                return manager.start_action(action_type, input_data, **kwargs)

            elif category == "password":
                manager = PasswordManager(data_manager)
                return manager.start_action(action_type, input_data, **kwargs)

            elif category == "signature":
                manager = SignatureManager(data_manager)
                return manager.start_action(action_type, input_data, **kwargs)

            elif category == "ai":
                manager = AIManager(data_manager)
                return manager.start_action(action_type, input_data, **kwargs)

            else:
                raise ValueError(f"❌ Unknown category: {category}")

        except Exception as e:
            logger.error(f"❌ AppManager run_action failed: {e}")
            return None

    # 🔄 Direct Access Helpers
    # ========================================================
    def convert(self, conversion_type: str, input_file: str, settings: dict = None):
        """Convert with optional settings passed to converter."""
        logger.info(f"🔄 Convert: {conversion_type} with settings: {settings}")
        dm = self._get_data_manager()
        return ConvertManager(dm).start_action(conversion_type, input_file, settings=settings)

    def edit(self, action_type: str, input_file: str, **kwargs):
        logger.info(f"📝 Edit: {action_type}")
        dm = self._get_data_manager()
        return EditManager(dm).start_action(action_type, input_file, **kwargs)

    def organize(self, action_type: str, input_files, **kwargs):
        logger.info(f"📄 Organize: {action_type}")
        dm = self._get_data_manager()
        return OrganizeManager(dm).start_action(action_type, input_files, **kwargs)

    def password(self, action_type: str, input_file: str, **kwargs):
        logger.info(f"🔐 Password: {action_type}")
        dm = self._get_data_manager()
        return PasswordManager(dm).start_action(action_type, input_file, **kwargs)

    def sign(self, action_type: str, input_file: str, **kwargs):
        logger.info(f"🖋 Signature: {action_type}")
        dm = self._get_data_manager()
        return SignatureManager(dm).start_action(action_type, input_file, **kwargs)

    def ai_summarize(self, input_file, settings: dict = None):
        """AI-powered PDF summarization"""
        logger.info(f"🤖 AI Summarize with settings: {settings}")
        dm = self._get_data_manager()
        return AIManager(dm).start_action("summarize", input_file, settings=settings)

    # ========================================================
    # 🧹 Cleanup
    # ========================================================
    def cleanup_all_sessions(self):
        """Cleans up all active session folders."""
        for session_id, dm in list(self.active_sessions.items()):
            dm.cleanup_session()
            del self.active_sessions[session_id]
        logger.info("🧹 All sessions cleaned up.")


# ============================================================
# 🧪 LOCAL TEST BLOCK
# ============================================================
if __name__ == "__main__":
    import time
    import os
    
    # ============================================================
    # 📸 IMAGE EXTRACTION TEST
    # ============================================================
    print("\n" + "="*70)
    print("📸 Testing Image Extraction")
    print("="*70 + "\n")

    try:
        from reportlab.pdfgen import canvas
        from PIL import Image
    except ImportError:
        print("❌ ReportLab or Pillow not installed. Skipping image extraction test.")
        exit(1)

    # 1. Create a dummy PDF with images
    test_pdf_name = "test_image_extraction.pdf"
    img1_name = "temp_img1.png"
    img2_name = "temp_img2.png"

    # Create dummy images
    img1 = Image.new('RGB', (100, 100), color='red')
    img1.save(img1_name)
    img2 = Image.new('RGB', (100, 100), color='blue')
    img2.save(img2_name)

    c = canvas.Canvas(test_pdf_name)
    c.drawString(100, 750, "Page 1 - Red Image")
    c.drawImage(img1_name, 100, 600, width=100, height=100)
    c.showPage()
    c.drawString(100, 750, "Page 2 - Blue Image")
    c.drawImage(img2_name, 100, 600, width=100, height=100)
    c.save()

    input_path = os.path.abspath(test_pdf_name)
    print(f"📄 Input File: {input_path}")

    # 2. Run Extraction
    app = AppManager()
    output_zip = app.organize("extract_images", [test_pdf_name])

    if output_zip and os.path.exists(output_zip):
        output_path = os.path.abspath(output_zip)
        print(f"📦 Output ZIP: {output_path}")
        
        import zipfile
        with zipfile.ZipFile(output_zip, 'r') as z:
            print("\n📂 Content of ZIP:")
            for f in z.namelist():
                print(f"   - {f}")
    else:
        print("❌ Extraction Failed or no output produced.")

    # Cleanup
    for f in [img1_name, img2_name]:
        if os.path.exists(f):
            os.remove(f)

