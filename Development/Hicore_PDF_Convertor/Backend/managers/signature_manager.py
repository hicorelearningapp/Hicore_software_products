import logging
from core.data_manager import DataManager
from modules.signature.signature import SignatureFactory


class SignatureManager:
    def __init__(self, data_manager: DataManager):
        self.data_manager = data_manager
        logging.info("✅ SignatureManager initialized (v2)")

    def start_action(self, action_type: str, input_files, **kwargs):
        """
        Handles:
            - signature_type
            - x, y, width, height
            - draw/upload/text signature params
            - add_datetime
            - flatten_pdf
        """
        try:
            logging.info(f"🚀 Starting signature action: {action_type}")

            # Ensure input_files is a list
            if isinstance(input_files, str):
                input_files = [input_files]

            logging.info(f"📥 Raw input files: {input_files}")

            self.data_manager.add_input_files(input_files)
            self.data_manager.auto_set_output_file(action_type)

            input_files = self.data_manager.get_input_files()
            output_file = self.data_manager.get_output_file()

            logging.info(f"📄 Resolved input files: {input_files}")
            logging.info(f"💾 Target output file: {output_file}")

            # Select AddSignature class
            action = SignatureFactory.GetAction(action_type)

            # Run signature stamping
            final_output = action.Execute(input_files, output_file, **kwargs)

            if not final_output:
                logging.error("❌ Signature stamping failed (action returned None)")
                return None

            logging.info(f"✅ Signature action completed → {final_output}")
            return final_output

        except Exception as e:
            logging.error(f"❌ SignatureManager failed: {e}", exc_info=True)
            return None
