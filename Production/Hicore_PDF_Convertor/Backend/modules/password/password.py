import os
import logging
from PyPDF2 import PdfReader, PdfWriter
from abc import ABC, abstractmethod

# ============================================================
# 🧠 Base Class
# ============================================================
class PasswordBase(ABC):
    @abstractmethod
    def Execute(self, InputFiles: list[str], OutputFile: str, **kwargs):
        pass


# ============================================================
# 🔐 Add Password Protection
# ============================================================
class AddPassword(PasswordBase):
    """Encrypts a PDF file with a password."""
    def Execute(self, InputFiles, OutputFile, **kwargs):
        try:
            input_pdf = InputFiles[0]
            password = kwargs.get("password")
            if not password:
                raise ValueError("Password must be provided.")

            reader = PdfReader(input_pdf)
            writer = PdfWriter()
            for page in reader.pages:
                writer.add_page(page)

            writer.encrypt(password)
            with open(OutputFile, "wb") as f:
                writer.write(f)

            logging.info(f"🔒 Password added to PDF → {OutputFile}")
            return OutputFile
        except Exception as e:
            logging.error(f"❌ AddPassword failed: {e}")
            return None


# ============================================================
# 🔓 Remove Password Protection
# ============================================================
class RemovePassword(PasswordBase):
    """Decrypts a password-protected PDF file."""
    def Execute(self, InputFiles, OutputFile, **kwargs):
        try:
            input_pdf = InputFiles[0]
            password = kwargs.get("password")
            if not password:
                raise ValueError("Password required to decrypt file.")

            reader = PdfReader(input_pdf)
            if reader.is_encrypted:
                reader.decrypt(password)

            writer = PdfWriter()
            for page in reader.pages:
                writer.add_page(page)

            with open(OutputFile, "wb") as f:
                writer.write(f)

            logging.info(f"🔓 Password removed → {OutputFile}")
            return OutputFile
        except Exception as e:
            logging.error(f"❌ RemovePassword failed: {e}")
            return None


# ============================================================
# 🏭 Factory
# ============================================================
class PasswordFactory:
    @staticmethod
    def GetAction(ActionType: str) -> PasswordBase:
        mapping = {
            "add_password": AddPassword,
            "remove_password": RemovePassword,
        }
        ActionClass = mapping.get(ActionType.lower())
        if not ActionClass:
            raise ValueError(f"Unsupported password action: {ActionType}")
        return ActionClass()
