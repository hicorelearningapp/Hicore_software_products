import json
import logging
from typing import Optional, Type, Dict, List

from fastapi import (
    APIRouter,
    HTTPException,
    Depends,
    UploadFile,
    File,
    Form,
    status,
)
from fastapi.responses import FileResponse, JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, distinct
from sqlalchemy.exc import SQLAlchemyError

from app.core.database.config import async_session
from app.modules.project.models.models import (
    Internship_project,
    Mini_project,
    Major_project,
    Final_year_project,
)
from app.modules.project.schemas.schemas import ProjectWithFiles
from app.modules.project.services.services import ProjectService


# -------------------- LOGGER --------------------
logger = logging.getLogger("project_router")
logging.basicConfig(level=logging.INFO)

router = APIRouter(prefix="/projects", tags=["Projects"])
service = ProjectService()


# -------------------- DATABASE SESSION --------------------
async def get_session() -> AsyncSession:
    """Dependency: provide async SQLAlchemy session."""
    try:
        async with async_session() as session:
            yield session
    except SQLAlchemyError as e:
        logger.exception("Database session error")
        raise HTTPException(status_code=500, detail="Database session error")


# -------------------- HELPER: FILE SAVE --------------------
async def save_project_and_files(
    service: ProjectService,
    project_id: str,
    session: AsyncSession,
    files: dict,
    tools: Optional[str],
    techStack: Optional[str],
    mentor: Optional[str],
):
    """Save uploaded project files and metadata."""
    try:
        tools_list = [t.strip() for t in tools.split(",")] if tools else []
        techStack_list = [t.strip() for t in techStack.split(",")] if techStack else []
        await service.save_files(project_id, files, tools_list, techStack_list, mentor)
        return await service.load_files(project_id)
    except Exception as e:
        logger.exception(f"Error saving files for project {project_id}")
        raise HTTPException(status_code=500, detail="Error saving project files")


# -------------------- CRUD ROUTE FACTORY --------------------
def create_project_router(model: Type):
    """Dynamically register CRUD routers for each project model."""

    @router.post(f"/{model.__tablename__}/", response_model=ProjectWithFiles, status_code=status.HTTP_201_CREATED)
    async def create_project(
        title: str = Form(...),
        domain: str = Form(...),
        description: Optional[str] = Form(None),
        tools: Optional[str] = Form(None),
        techStack: Optional[str] = Form(None),
        mentor: Optional[str] = Form(None),
        image: Optional[UploadFile] = File(None),
        system_requirement: Optional[UploadFile] = File(None),
        srs: Optional[UploadFile] = File(None),
        design: Optional[UploadFile] = File(None),
        coding: Optional[UploadFile] = File(None),
        testing: Optional[UploadFile] = File(None),
        report: Optional[UploadFile] = File(None),
        session: AsyncSession = Depends(get_session),
    ):
        """Create a new project entry with file uploads."""
        try:
            project_id = await service.generate_project_id(session, model)
            project = model(id=project_id, title=title, domain=domain, description=description)

            session.add(project)
            await session.commit()
            await session.refresh(project)

            files = {
                "system_requirement": system_requirement,
                "srs": srs,
                "design": design,
                "coding": coding,
                "testing": testing,
                "report": report,
                "image": image,
            }

            saved_files = await save_project_and_files(service, project_id, session, files, tools, techStack, mentor)

            project.tools = json.dumps(saved_files.get("tools", []))
            project.techStack = json.dumps(saved_files.get("techStack", []))
            project.mentor = saved_files.get("mentor")
            project.image = saved_files.get("image")

            session.add(project)
            await session.commit()
            await session.refresh(project)

            project.tools = json.loads(project.tools)
            project.techStack = json.loads(project.techStack)

            return {"project": project, "files": saved_files}

        except SQLAlchemyError:
            logger.exception("Database error while creating project")
            raise HTTPException(status_code=500, detail="Database error")
        except Exception:
            logger.exception("Unexpected error while creating project")
            raise HTTPException(status_code=500, detail="Internal server error")

    @router.get(f"/{model.__tablename__}/{{project_id}}", response_model=ProjectWithFiles)
    async def get_project(project_id: str, session: AsyncSession = Depends(get_session)):
        """Fetch single project by ID."""
        try:
            project = await service.get_project(session, model, project_id)
            if not project:
                raise HTTPException(status_code=404, detail="Project not found")

            project.tools = json.loads(project.tools) if project.tools else []
            project.techStack = json.loads(project.techStack) if project.techStack else []

            saved_files = await service.load_files(project_id)
            return {"project": project, "files": saved_files}

        except Exception:
            logger.exception(f"Error fetching project {project_id}")
            raise HTTPException(status_code=500, detail="Error fetching project")

    @router.put(f"/{model.__tablename__}/{{project_id}}", response_model=ProjectWithFiles)
    async def update_project(
        project_id: str,
        title: str = Form(...),
        domain: str = Form(...),
        description: Optional[str] = Form(None),
        tools: Optional[str] = Form(None),
        techStack: Optional[str] = Form(None),
        mentor: Optional[str] = Form(None),
        image: Optional[UploadFile] = File(None),
        system_requirement: Optional[UploadFile] = File(None),
        srs: Optional[UploadFile] = File(None),
        design: Optional[UploadFile] = File(None),
        coding: Optional[UploadFile] = File(None),
        testing: Optional[UploadFile] = File(None),
        report: Optional[UploadFile] = File(None),
        session: AsyncSession = Depends(get_session),
    ):
        """Update existing project."""
        try:
            updated_project = await service.update_project(
                session, model, project_id, {"title": title, "domain": domain, "description": description}
            )
            if not updated_project:
                raise HTTPException(status_code=404, detail="Project not found")

            files = {
                "system_requirement": system_requirement,
                "srs": srs,
                "design": design,
                "coding": coding,
                "testing": testing,
                "report": report,
                "image": image,
            }

            saved_files = await save_project_and_files(service, project_id, session, files, tools, techStack, mentor)

            updated_project.tools = json.dumps(saved_files.get("tools", []))
            updated_project.techStack = json.dumps(saved_files.get("techStack", []))
            updated_project.mentor = saved_files.get("mentor")
            updated_project.image = saved_files.get("image")

            session.add(updated_project)
            await session.commit()
            await session.refresh(updated_project)

            updated_project.tools = json.loads(updated_project.tools)
            updated_project.techStack = json.loads(updated_project.techStack)

            return {"project": updated_project, "files": saved_files}

        except Exception:
            logger.exception(f"Error updating project {project_id}")
            raise HTTPException(status_code=500, detail="Internal server error")

    @router.delete(f"/{model.__tablename__}/{{project_id}}")
    async def delete_project(project_id: str, session: AsyncSession = Depends(get_session)):
        """Delete project by ID."""
        try:
            deleted = await service.delete_project(session, model, project_id)
            if not deleted:
                raise HTTPException(status_code=404, detail="Project not found")
            return {"message": "Project deleted successfully"}
        except Exception:
            logger.exception(f"Error deleting project {project_id}")
            raise HTTPException(status_code=500, detail="Internal server error")


# -------------------- DOMAIN HELPERS --------------------
async def projects_by_domain_for_model(session: AsyncSession, model: Type) -> Dict[str, List[Dict]]:
    """Return all projects grouped by domain."""
    try:
        domain_dict: Dict[str, List[Dict]] = {}
        result = await session.execute(select(model))
        for proj in result.scalars().all():
            domain = getattr(proj, "domain", "Other")
            domain_dict.setdefault(domain, []).append(
                {
                    "id": proj.id,
                    "title": proj.title,
                    "description": proj.description,
                    "tools": json.loads(proj.tools) if proj.tools else [],
                    "techStack": json.loads(proj.techStack) if proj.techStack else [],
                    "mentor": proj.mentor,
                    "image": proj.image,
                }
            )
        return domain_dict
    except Exception:
        logger.exception(f"Error fetching domain data for {model.__name__}")
        raise HTTPException(status_code=500, detail="Internal server error")


async def get_domains(session: AsyncSession, model) -> List[str]:
    """Return all available project domains."""
    try:
        result = await session.execute(select(distinct(model.domain)))
        return [row[0] for row in result.fetchall() if row[0]]
    except Exception:
        logger.exception(f"Error fetching domains for {model.__name__}")
        raise HTTPException(status_code=500, detail="Internal server error")


# -------------------- DOMAIN ROUTES --------------------
@router.get("/internship_projects/by_domain")
async def internship_projects_by_domain(session: AsyncSession = Depends(get_session)):
    return await projects_by_domain_for_model(session, Internship_project)


@router.get("/mini_projects/by_domain")
async def mini_projects_by_domain(session: AsyncSession = Depends(get_session)):
    return await projects_by_domain_for_model(session, Mini_project)


@router.get("/major_projects/by_domain")
async def major_projects_by_domain(session: AsyncSession = Depends(get_session)):
    return await projects_by_domain_for_model(session, Major_project)


@router.get("/final_year_projects/by_domain")
async def final_year_projects_by_domain(session: AsyncSession = Depends(get_session)):
    return await projects_by_domain_for_model(session, Final_year_project)


# -------------------- DOMAIN LIST ROUTES --------------------
@router.get("/internship_projects/domains", response_model=List[str])
async def internship_project_domains(session: AsyncSession = Depends(get_session)):
    return await get_domains(session, Internship_project)


@router.get("/mini_projects/domains", response_model=List[str])
async def mini_project_domains(session: AsyncSession = Depends(get_session)):
    return await get_domains(session, Mini_project)


@router.get("/major_projects/domains", response_model=List[str])
async def major_project_domains(session: AsyncSession = Depends(get_session)):
    return await get_domains(session, Major_project)


@router.get("/final_year_projects/domains", response_model=List[str])
async def final_year_project_domains(session: AsyncSession = Depends(get_session)):
    return await get_domains(session, Final_year_project)


# -------------------- FILE FETCH HANDLER --------------------
async def fetch_project_file(model: Type, project_id: str, file_type: str, session: AsyncSession):
    """Fetch a specific file (system_requirement, srs, etc.) for a project."""
    allowed_files = {"system_requirement", "srs", "design", "coding", "testing", "report"}

    if file_type not in allowed_files:
        raise HTTPException(status_code=400, detail="Invalid file type")

    try:
        project = await service.get_project(session, model, project_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")

        files = await service.load_files(project_id)
        file_data = files.get(file_type)

        if not file_data:
            raise HTTPException(status_code=404, detail=f"{file_type} file not found")

        if isinstance(file_data, str):
            return FileResponse(file_data, filename=f"{project.title}_{file_type}.json", media_type="application/json")
        elif isinstance(file_data, dict):
            return JSONResponse(content=file_data)
        else:
            raise HTTPException(status_code=500, detail=f"Unexpected format for {file_type}")

    except HTTPException:
        raise
    except Exception:
        logger.exception(f"Error fetching {file_type} for project {project_id}")
        raise HTTPException(status_code=500, detail="Error retrieving project file")


# -------------------- FILE ROUTES (per project type) --------------------
@router.get("/internship_projects/{project_id}/files/{file_type}")
async def get_internship_project_file(project_id: str, file_type: str, session: AsyncSession = Depends(get_session)):
    return await fetch_project_file(Internship_project, project_id, file_type, session)


@router.get("/mini_projects/{project_id}/files/{file_type}")
async def get_mini_project_file(project_id: str, file_type: str, session: AsyncSession = Depends(get_session)):
    return await fetch_project_file(Mini_project, project_id, file_type, session)


@router.get("/major_projects/{project_id}/files/{file_type}")
async def get_major_project_file(project_id: str, file_type: str, session: AsyncSession = Depends(get_session)):
    return await fetch_project_file(Major_project, project_id, file_type, session)


@router.get("/final_year_projects/{project_id}/files/{file_type}")
async def get_final_year_project_file(project_id: str, file_type: str, session: AsyncSession = Depends(get_session)):
    return await fetch_project_file(Final_year_project, project_id, file_type, session)


# -------------------- REGISTER CRUD ROUTERS --------------------
for project_model in [Internship_project, Mini_project, Major_project, Final_year_project]:
    create_project_router(project_model)
