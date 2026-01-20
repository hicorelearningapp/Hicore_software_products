import logging
from core.data_manager import DataManager
from modules.convert.converter import ConverterFactory

class ConvertManager:
    def __init__(self, data_manager: DataManager):
        self.data_manager = data_manager

    def start_action(self, conversion_type: str, input_file, settings: dict = None):
        try:
            logging.info(f"🚀 Starting conversion: {conversion_type} with settings: {settings}")

            settings = settings or {}

            # ============================================================
            # SPECIAL CASE → image_to_pdf
            # ============================================================
            if conversion_type == "image_to_pdf":

                # Normalize to list (handle both single image and multiple images)
                if not isinstance(input_file, list):
                    input_file = [input_file]

                logging.info(f"🖼 image_to_pdf detected → Processing {len(input_file)} image(s)")

                # Only create output file path via DataManager
                self.data_manager.auto_set_output_file(conversion_type)
                output_file = self.data_manager.get_output_file()

                converter = ConverterFactory.GetConverter(conversion_type)

                # Extract page_format from settings (default: "a4")
                page_format = settings.pop("page_format", "a4").lower()
                if page_format not in ["a4", "original"]:
                    logging.warning(f"⚠️ Invalid page_format '{page_format}', using 'a4'")
                    page_format = "a4"

                result = converter.Convert(input_file, output_file, page_format=page_format, **settings)

                actual_output = result if result else output_file
                logging.info(f"✅ image_to_pdf completed → {actual_output}")
                return actual_output

            # ============================================================
            # NORMAL CONVERSIONS (single input file)
            # ============================================================
            self.data_manager.add_input_file(input_file)
            self.data_manager.auto_set_output_file(conversion_type)

            input_files = self.data_manager.get_input_files()
            output_file = self.data_manager.get_output_file()

            converter = ConverterFactory.GetConverter(conversion_type)

            actual_output = None

            for file in input_files:
                result = converter.Convert(file, output_file)
                actual_output = result if result else output_file

            logging.info(f"✅ Conversion completed successfully → {actual_output}")
            return actual_output

        except Exception as e:
            logging.error(f"❌ Conversion failed: {e}", exc_info=True)
            return None
