# # app/routers/resume_download.py
# from fastapi import APIRouter, Request
# from fastapi.responses import HTMLResponse, FileResponse
# from ..models.resume_model import Resume
# from ..services.resume_service import ResumeService
#
# router = APIRouter(prefix="/resume", tags=["Resume"])
#
#
# @router.post("/pdf")
# async def get_resume_pdf(request: Request, resume: Resume):
#     pdf_path = ResumeService.generate_pdf(request, resume)
#     return FileResponse(
#         pdf_path,
#         filename="resume.pdf",
#         media_type="application/pdf"
#     )
