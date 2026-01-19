import json
from typing import Optional, List
from fastapi import APIRouter, Depends, UploadFile, Form, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy import select
from app.modules.auth.models.user import User
from app.modules.profile.managers.student_profile_service import StudentProfileService
from app.modules.profile.models.models import UserProfile
from app.core.dependencies import get_profile_service
from app.core.utils.file_manager import save_upload_file, BASE_UPLOAD_DIR
from app.modules.profile.schemas.profile_schemas import ProfileCreate, ProfileUpdate, ProfileOut

router = APIRouter(prefix="/profile", tags=["Profile"])


# ======================================================
# ✅ CREATE PROFILE (NO FILE VALIDATION)
# ======================================================
@router.post("/create", summary="Create user profile with uploads")
async def create_profile(
    json_data: str = Form(...),
    profile_image: Optional[UploadFile] = None,
    selfintro_video: Optional[UploadFile] = None,
    company_images: Optional[List[UploadFile]] = None,
    resume_file: Optional[UploadFile] = None,
    project_images: Optional[List[UploadFile]] = None,
    srs_files: Optional[List[UploadFile]] = None,
    report_files: Optional[List[UploadFile]] = None,
    demo_files: Optional[List[UploadFile]] = None,
    project_videos: Optional[List[UploadFile]] = None,
    service: StudentProfileService = Depends(get_profile_service),
):
    """Create a new student profile with media uploads."""
    try:
        data = json.loads(json_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON: {e}")

    payload = ProfileCreate.model_validate(data)
    data = payload.model_dump(mode="python")

    user_id = data["basicInfo"]["user_id"]
    basic_info = data["basicInfo"]
    work_exps = data.get("workExperience", [])
    projects = data.get("projects", [])

    try:
        # ---------------- Single File Uploads ----------------
        if profile_image:
            basic_info["profile_image"] = await save_upload_file(
                profile_image, "profile_image", prefix=str(user_id)
            )

        if selfintro_video:
            basic_info["selfintro_video"] = await save_upload_file(
                selfintro_video, "selfintro_video", prefix=str(user_id)
            )

        if resume_file:
            data.setdefault("skillsResume", {})["resume_file"] = await save_upload_file(
                resume_file, "resume_file", prefix=str(user_id)
            )

        # ---------------- Work Experience Files ----------------
        for i, file in enumerate(company_images or []):
            if i < len(work_exps):
                work_exps[i]["company_image"] = await save_upload_file(
                    file, "company_images", prefix=str(user_id)
                )

        # ---------------- Project Files ----------------
        file_map = {
            "project_images": ("project_image", project_images),
            "project_videos": ("projectVideo", project_videos),
            "srs_files": ("srsFile", srs_files),
            "report_files": ("reportFile", report_files),
            "demo_files": ("demoFile", demo_files),
        }

        for key, (field_name, files) in file_map.items():
            for i, f in enumerate(files or []):
                if i >= len(projects):
                    break

                if field_name == "project_image":
                    projects[i][field_name] = await save_upload_file(
                        f, key, prefix=str(user_id)
                    )
                else:
                    projects[i].setdefault("details", {})[field_name] = await save_upload_file(
                        f, key, prefix=str(user_id)
                    )

        created_profile = await service.create_profile(data)
        return {"status": "success", "profile_id": created_profile.id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating profile: {str(e)}")


# ======================================================
# ✅ GET PROFILE
# ======================================================
@router.get("/{user_id}", response_model=ProfileOut)
async def get_profile(user_id: int, service: StudentProfileService = Depends(get_profile_service)):
    profile = await service.get_profile(user_id)
    if not profile:
        raise HTTPException(404, "Profile not found")
    return profile


# ======================================================
# ✅ LIST PROFILES
# ======================================================
@router.get("")
async def list_profiles(service: StudentProfileService = Depends(get_profile_service)):
    profiles = await service.list_profiles()
    return {"count": len(profiles), "results": profiles}


# ======================================================
# ✅ UPDATE PROFILE (NO FILE VALIDATION)
# ======================================================
@router.put("/{user_id}")
async def update_profile(
    user_id: int,
    json_data: str = Form(...),
    profile_image: Optional[UploadFile] = None,
    selfintro_video: Optional[UploadFile] = None,
    company_images: Optional[List[UploadFile]] = None,
    resume_file: Optional[UploadFile] = None,
    project_images: Optional[List[UploadFile]] = None,
    srs_files: Optional[List[UploadFile]] = None,
    report_files: Optional[List[UploadFile]] = None,
    demo_files: Optional[List[UploadFile]] = None,
    project_videos: Optional[List[UploadFile]] = None,
    service: StudentProfileService = Depends(get_profile_service),
):
    try:
        data = json.loads(json_data)
    except Exception as e:
        raise HTTPException(400, f"Invalid JSON: {e}")

    payload = ProfileUpdate.model_validate(data)
    data = payload.model_dump(mode="python")

    basic_info = data.setdefault("basicInfo", {})
    work_exps = data.get("workExperience", [])
    projects = data.get("projects", [])

    try:
        # ---------------- Single File Uploads ----------------
        if profile_image:
            basic_info["profile_image"] = await save_upload_file(
                profile_image, "profile_image", prefix=str(user_id)
            )

        if selfintro_video:
            basic_info["selfintro_video"] = await save_upload_file(
                selfintro_video, "selfintro_video", prefix=str(user_id)
            )

        if resume_file:
            data.setdefault("skillsResume", {})["resume_file"] = await save_upload_file(
                resume_file, "resume_file", prefix=str(user_id)
            )

        # ---------------- Work Experience ----------------
        for i, file in enumerate(company_images or []):
            if i < len(work_exps):
                work_exps[i]["company_image"] = await save_upload_file(
                    file, "company_images", prefix=str(user_id)
                )

        # ---------------- Project Files ----------------
        file_map = {
            "project_images": ("project_image", project_images),
            "project_videos": ("projectVideo", project_videos),
            "srs_files": ("srsFile", srs_files),
            "report_files": ("reportFile", report_files),
            "demo_files": ("demoFile", demo_files),
        }

        for key, (field_name, files) in file_map.items():
            for i, f in enumerate(files or []):
                if i >= len(projects):
                    break

                if field_name == "project_image":
                    projects[i][field_name] = await save_upload_file(
                        f, key, prefix=str(user_id)
                    )
                else:
                    projects[i].setdefault("details", {})[field_name] = await save_upload_file(
                        f, key, prefix=str(user_id)
                    )

        updated = await service.update_profile(user_id, data)
        if not updated:
            raise HTTPException(404, "Profile not found")

        return {"status": "success", "profile_id": updated.id}

    except Exception as e:
        raise HTTPException(500, f"Error updating profile: {str(e)}")


# ======================================================
# ✅ DELETE PROFILE
# ======================================================
@router.delete("/{user_id}")
async def delete_profile(user_id: int, service: StudentProfileService = Depends(get_profile_service)):
    deleted = await service.delete_profile(user_id)
    if not deleted:
        raise HTTPException(404, "Profile not found")
    return {"status": "success", "user_id": user_id}


# ======================================================
# ✅ SERVE UPLOADED FILES
# ======================================================
@router.get("/file/{file_path:path}")
async def get_uploaded_file(file_path: str):
    normalized = file_path.replace("\\", "/")
    full_path = (BASE_UPLOAD_DIR / normalized).resolve()

    if not full_path.exists():
        raise HTTPException(404, "File not found")

    return FileResponse(full_path, filename=full_path.name)


# ======================================================
# ✅ GET PROFILES BY USER ROLE
# ======================================================
@router.get("/role/{role}")
async def get_profiles_by_role(role: str, service: StudentProfileService = Depends(get_profile_service)):
    valid = {"student", "jobseeker", "mentor", "employer"}
    if role not in valid:
        raise HTTPException(400, f"Role must be one of {valid}")

    result = await service.session.execute(
        select(UserProfile).join(User).where(User.role == role)
    )

    profiles = result.scalars().all()
    if not profiles:
        raise HTTPException(404, f"No profiles found for {role}")

    serialized = [await service._serialize(p) for p in profiles]
    return {"role": role, "count": len(serialized), "profiles": serialized}

