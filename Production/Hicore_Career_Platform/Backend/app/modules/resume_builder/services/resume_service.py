# app/services/resume_download_service.py
from fastapi.templating import Jinja2Templates
from fastapi import Request
from xhtml2pdf import pisa
from ..models.resume_model import Resume
import os
import uuid

templates = Jinja2Templates(directory="app/modules/resume_builder/templates")


class ResumeService:
    @staticmethod
    def generate_pdf(request: Request, resume: Resume):
        """
        Convert HTML → PDF using xhtml2pdf (pure Python)
        """
        # Render the HTML template
        html_str = templates.get_template("resume.html").render(
            request=request,
            resume=resume
        )

        # Ensure output directory exists
        output_dir = "app/generated"
        os.makedirs(output_dir, exist_ok=True)

        file_name = f"resume_{uuid.uuid4()}.pdf"
        file_path = f"{output_dir}/{file_name}"

        # Convert HTML to PDF
        with open(file_path, "wb") as pdf_file:
            pisa.CreatePDF(
                html_str,
                dest=pdf_file
            )

        return file_path
