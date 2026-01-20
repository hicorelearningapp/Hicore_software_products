import logging
from core.data_manager import DataManager
from modules.edit.edit_operations import EditFactory

# ============================================================
# ✏️ Edit Manager
# ============================================================
# Handles editing actions: annotate, crop, watermark, page numbers.
# ============================================================

class EditManager:
    def __init__(self, data_manager: DataManager):
        self.data_manager = data_manager

    def start_action(self, action_type: str, input_file: str, **kwargs):
        try:
            logging.info(f"🚀 Starting edit action: {action_type}")

            self.data_manager.add_input_file(input_file)
            self.data_manager.auto_set_output_file(action_type)

            input_files = self.data_manager.get_input_files()
            output_file = self.data_manager.get_output_file()

            editor = EditFactory.GetEditor(action_type)
            result = editor.Execute(input_files, output_file, **kwargs)

            logging.info(f"✅ Edit completed → {output_file}")
            return result

        except Exception as e:
            logging.error(f"❌ Edit action failed: {e}")
            return None
