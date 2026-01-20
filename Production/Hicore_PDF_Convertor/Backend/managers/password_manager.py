import logging
from core.data_manager import DataManager
from modules.password.password import PasswordFactory


# ============================================================
# 🔐 Password Manager
# ============================================================
class PasswordManager:
    def __init__(self, data_manager: DataManager):
        self.data_manager = data_manager

    def start_action(self, action_type: str, input_file: str, **kwargs):
        try:
            logging.info(f"🚀 Starting password action: {action_type}")
            self.data_manager.add_input_file(input_file)
            self.data_manager.auto_set_output_file(action_type)

            input_files = self.data_manager.get_input_files()
            output_file = self.data_manager.get_output_file()

            # Dynamically get AddPassword or RemovePassword
            Action = PasswordFactory.GetAction(action_type)
            result = Action.Execute(input_files, output_file, **kwargs)

            logging.info(f"✅ Password action completed: {output_file}")
            return result

        except Exception as e:
            logging.error(f"❌ Password action failed: {e}")
            return None
