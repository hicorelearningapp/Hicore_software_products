import logging
from core.data_manager import DataManager
from modules.organizer.organizer import OrganizerFactory

# ============================================================
# 🧩 Organizer Manager
# ============================================================
# Manages structural PDF operations (merge, split, rotate, reorder).
# ============================================================

class OrganizeManager:
    def __init__(self, data_manager: DataManager):
        self.data_manager = data_manager

    def start_action(self, action_type: str, input_files, **kwargs):
        try:
            logging.info(f"🚀 Starting organizer action: {action_type}")

            # Allow single or multiple inputs
            if isinstance(input_files, str):
                input_files = [input_files]

            self.data_manager.add_input_files(input_files)
            self.data_manager.auto_set_output_file(action_type)

            input_files = self.data_manager.get_input_files()
            output_file = self.data_manager.get_output_file()

            organizer = OrganizerFactory.GetOrganizer(action_type)
            result = organizer.Execute(input_files, output_file, **kwargs)

            logging.info(f"✅ Organizer action completed → {output_file}")
            return result

        except Exception as e:
            logging.error(f"❌ Organizer action failed: {e}")
            return None
