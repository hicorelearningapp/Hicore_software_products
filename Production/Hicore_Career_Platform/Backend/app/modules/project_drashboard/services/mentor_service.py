import json
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException

from app.core.json_store import JSONStore

from app.modules.auth.models.user import User, RoleEnum
from app.modules.project.models.models import (
    Internship_project, Mini_project, Major_project, Final_year_project
)
from ..models.mentor_session import RequestStatus
from ..schemas.mentor_schemas import (
    CreateRequestIn, StudentOut, ProjectOut,
    NewRequestOut, ActiveMenteeOut, RequestStatusEnum
)

# ----------------------------------------------------------
# JSON STORE
# ----------------------------------------------------------
mentor_session_store = JSONStore(
    file_path="app/data/mentor_sessions.json",
    default={"sessions": [], "last_id": 0}
)

# Simple logger
def log(*msg):
    print("[MENTOR_SERVICE]", *msg)


# ----------------------------------------------------------
# DTO CLASS
# ----------------------------------------------------------
class _SessionDTO:
    def __init__(self, **kwargs):
        for k, v in kwargs.items():
            setattr(self, k, v)


# ----------------------------------------------------------
# SERVICE CLASS
# ----------------------------------------------------------
class MentorService:

    # ==========================================================
    # INTERNAL JSON HELPERS
    # ==========================================================
    @staticmethod
    def _load_sessions_raw():
        data = mentor_session_store.load()
        log("LOAD JSON =>", data)
        return data, data.get("sessions", []), data.get("last_id", 0)

    @staticmethod
    def _save_sessions_raw(data, sessions):
        data["sessions"] = sessions
        log("SAVE JSON =>", sessions)
        mentor_session_store.save(data)

    # ==========================================================
    # BUILD DTO
    # ==========================================================
    @staticmethod
    async def _build_session_dto_from_raw(raw_session: dict, db: AsyncSession) -> _SessionDTO:
        log("BUILD DTO =>", raw_session)

        student = await MentorService._get_user(raw_session["student_id"], db)
        if not student:
            raise HTTPException(404, "Student not found")

        log("DTO STUDENT =>", student)

        return _SessionDTO(
            id=raw_session["id"],
            student_id=raw_session["student_id"],
            mentor_id=raw_session.get("mentor_id"),
            project_id=raw_session["project_id"],
            project_type=raw_session["project_type"],
            status=RequestStatus(raw_session["status"]),
            requested_date=raw_session.get("requested_date"),
            rejected_by=raw_session.get("rejected_by") or [],
            student=student,
        )

    # ==========================================================
    # CREATE REQUEST
    # ==========================================================
    @staticmethod
    async def create_request(payload: CreateRequestIn, db: AsyncSession):

        log("CREATE REQUEST =>", payload)

        project = await MentorService._get_project(db, payload.project_id, payload.project_type)
        if not project:
            raise HTTPException(404, "Project not found")

        data, sessions, last_id = MentorService._load_sessions_raw()

        # Prevent duplicate
        for s in sessions:
            if (
                s["student_id"] == payload.student_id
                and s["project_id"] == payload.project_id
                and s["project_type"] == payload.project_type
                and s["status"] in [RequestStatus.pending.value, RequestStatus.accepted.value]
            ):
                raise HTTPException(400, "Request already submitted")

        new_id = last_id + 1

        new_session = {
            "id": new_id,
            "student_id": payload.student_id,
            "mentor_id": None,
            "project_id": payload.project_id,
            "project_type": payload.project_type,
            "status": RequestStatus.pending.value,
            "requested_date": datetime.utcnow().isoformat(),
            "rejected_by": [],
        }

        log("NEW SESSION =>", new_session)

        sessions.append(new_session)
        data["last_id"] = new_id
        MentorService._save_sessions_raw(data, sessions)

    # ==========================================================
    # NEW REQUESTS
    # ==========================================================
    @staticmethod
    async def get_new_requests(mentor_id: int, db: AsyncSession):

        log("GET NEW REQUESTS for mentor =>", mentor_id)

        sessions = await MentorService._get_sessions(db, filter_status=RequestStatus.pending)
        log("PENDING SESSIONS =>", sessions)

        filtered = [s for s in sessions if mentor_id not in (s.rejected_by or [])]
        log("FILTERED NEW REQUESTS =>", filtered)

        return [
            await MentorService._format_session(s, db, NewRequestOut)
            for s in filtered
        ]

    # ==========================================================
    # ACCEPT REQUEST
    # ==========================================================
    @staticmethod
    async def accept_request(mentor_id: int, request_id: int, db: AsyncSession):

        mentor = await MentorService._get_user(mentor_id, db)
        if not mentor or mentor.role != RoleEnum.mentor:
            raise HTTPException(400, "User is not a mentor")

        data, sessions, _ = MentorService._load_sessions_raw()

        for s in sessions:
            if s["id"] == request_id:

                if s["status"] != RequestStatus.pending.value:
                    raise HTTPException(400, "Already processed")

                s["mentor_id"] = mentor_id
                s["status"] = RequestStatus.accepted.value

                MentorService._save_sessions_raw(data, sessions)
                return await MentorService._build_session_dto_from_raw(s, db)

        raise HTTPException(404, "Request not found")

    # ==========================================================
    # REJECT FOR MENTOR
    # ==========================================================
    @staticmethod
    async def reject_for_mentor(mentor_id: int, request_id: int, db: AsyncSession):

        data, sessions, _ = MentorService._load_sessions_raw()

        for s in sessions:
            if s["id"] == request_id:
                rejected = s.get("rejected_by") or []
                if mentor_id not in rejected:
                    rejected.append(mentor_id)

                s["rejected_by"] = rejected

                MentorService._save_sessions_raw(data, sessions)
                return await MentorService._build_session_dto_from_raw(s, db)

        raise HTTPException(404, "Request not found")

    # ==========================================================
    # ACTIVE MENTEES / REJECTED / APPROVED / COMPLETED
    # ==========================================================
    @staticmethod
    async def get_active_mentees(mentor_id: int, db: AsyncSession):
        sessions = await MentorService._get_sessions(
            db, filter_status=RequestStatus.accepted, mentor_id=mentor_id
        )
        return [await MentorService._format_session(s, db, ActiveMenteeOut) for s in sessions]

    # ==========================================================
    # ONGOING PROJECTS (same as active_mentees)
    # ==========================================================
    @staticmethod
    async def get_ongoing_projects(mentor_id: int, db: AsyncSession):
        log("GET ONGOING PROJECTS =>", mentor_id)

        sessions = await MentorService._get_sessions(
            db,
            filter_status=RequestStatus.accepted,
            mentor_id=mentor_id
        )

        log("ONGOING PROJECTS =>", sessions)

        return [
            await MentorService._format_session(s, db, ActiveMenteeOut)
            for s in sessions
        ]

    @staticmethod
    async def get_rejected_projects(mentor_id: int, db: AsyncSession):
        sessions = await MentorService._get_sessions(db)
        rejected = [s for s in sessions if mentor_id in (s.rejected_by or [])]
        return [
            await MentorService._format_session(s, db, ActiveMenteeOut, "rejected")
            for s in rejected
        ]

    @staticmethod
    async def get_approved_projects(mentor_id: int, db: AsyncSession):
        accepted = await MentorService._get_sessions(db, filter_status=RequestStatus.accepted, mentor_id=mentor_id)
        completed = await MentorService._get_sessions(db, filter_status=RequestStatus.completed, mentor_id=mentor_id)
        combined = accepted + completed
        return [await MentorService._format_session(s, db, ActiveMenteeOut) for s in combined]

    @staticmethod
    async def get_completed_projects(mentor_id: int, db: AsyncSession):
        sessions = await MentorService._get_sessions(db, filter_status=RequestStatus.completed, mentor_id=mentor_id)
        return [await MentorService._format_session(s, db, ActiveMenteeOut) for s in sessions]

    # ==========================================================
    # INTERNAL UTILITIES
    # ==========================================================
    @staticmethod
    async def _get_user(user_id: int, db: AsyncSession):
        log("GET USER =>", user_id)
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalars().first()
        log("USER RESULT =>", user)
        return user

    # ==========================================================
    # CRUD METHODS (ALL REQUESTS)
    # ==========================================================
    @staticmethod
    async def get_all_requests(db: AsyncSession):
        log("GET ALL REQUESTS")
        sessions = await MentorService._get_sessions(db)
        return [
            await MentorService._format_session(s, db, NewRequestOut)
            for s in sessions
        ]

    @staticmethod
    async def get_request_by_id(request_id: int, db: AsyncSession):
        log("GET REQUEST BY ID =>", request_id)

        _, sessions, _ = MentorService._load_sessions_raw()

        for s in sessions:
            if s["id"] == request_id:
                dto = await MentorService._build_session_dto_from_raw(s, db)
                return await MentorService._format_session(dto, db, NewRequestOut)

        raise HTTPException(404, "Request not found")

    @staticmethod
    async def update_request(request_id: int, data: dict, db: AsyncSession):

        log("UPDATE REQUEST =>", request_id, data)

        json_data, sessions, _ = MentorService._load_sessions_raw()
        found = False

        for s in sessions:
            if s["id"] == request_id:
                found = True

                if "status" in data:
                    s["status"] = RequestStatus(data["status"]).value

                if "mentor_id" in data:
                    s["mentor_id"] = data["mentor_id"]

                break

        if not found:
            raise HTTPException(404, "Request not found")

        MentorService._save_sessions_raw(json_data, sessions)

        return await MentorService.get_request_by_id(request_id, db)

    @staticmethod
    async def delete_request(request_id: int, db: AsyncSession):

        log("DELETE REQUEST =>", request_id)

        json_data, sessions, _ = MentorService._load_sessions_raw()
        new_sessions = [s for s in sessions if s["id"] != request_id]

        if len(new_sessions) == len(sessions):
            raise HTTPException(404, "Request not found")

        MentorService._save_sessions_raw(json_data, new_sessions)

        return {"status": "success", "message": "Request deleted"}

    # ==========================================================
    # STUDENT CANCEL REQUEST
    # ==========================================================
    @staticmethod
    async def cancel_request(student_id: int, request_id: int, db: AsyncSession):

        log("CANCEL REQUEST =>", student_id, request_id)

        json_data, sessions, _ = MentorService._load_sessions_raw()

        for idx, s in enumerate(sessions):
            if s["id"] == request_id:

                if s["student_id"] != student_id:
                    raise HTTPException(403, "You cannot cancel someone else’s request")

                if s["status"] != RequestStatus.pending.value:
                    raise HTTPException(400, "Only pending requests can be cancelled")

                sessions.pop(idx)
                MentorService._save_sessions_raw(json_data, sessions)

                return {"status": "success", "message": "Request cancelled"}

        raise HTTPException(404, "Request not found")

    # ==========================================================
    # MARK COMPLETED
    # ==========================================================
    @staticmethod
    async def mark_completed(mentor_id: int, request_id: int, db: AsyncSession):

        log("MARK COMPLETED =>", mentor_id, request_id)

        json_data, sessions, _ = MentorService._load_sessions_raw()

        target = next((s for s in sessions if s["id"] == request_id), None)

        if not target:
            raise HTTPException(404, "Request not found")

        if target.get("mentor_id") != mentor_id:
            raise HTTPException(403, "This project is not assigned to you")

        target["status"] = RequestStatus.completed.value
        MentorService._save_sessions_raw(json_data, sessions)

        dto = await MentorService._build_session_dto_from_raw(target, db)
        return await MentorService._format_session(dto, db, ActiveMenteeOut)

    @staticmethod
    async def _get_project(db: AsyncSession, project_id, project_type):
        log("GET PROJECT =>", project_id, project_type)

        table_map = {
            "internship": Internship_project,
            "mini": Mini_project,
            "major": Major_project,
            "final_year": Final_year_project,
        }
        Model = table_map.get(project_type)
        if not Model:
            raise HTTPException(400, "Invalid project_type")

        result = await db.execute(select(Model).where(Model.id == project_id))
        project = result.scalars().first()
        log("PROJECT RESULT =>", project)
        return project

    @staticmethod
    async def _get_sessions(db: AsyncSession, filter_status=None, mentor_id=None):

        data, sessions, _ = MentorService._load_sessions_raw()
        log("GET SESSIONS filter_status:", filter_status, "mentor_id:", mentor_id)

        final = []
        for s in sessions:
            if filter_status and s["status"] != filter_status.value:
                continue
            if mentor_id and s.get("mentor_id") != mentor_id:
                continue

            dto = await MentorService._build_session_dto_from_raw(s, db)
            final.append(dto)

        log("FILTERED SESSIONS =>", final)
        return final

    # ==========================================================
    # FORMAT SESSION
    # ==========================================================
    @staticmethod
    async def _format_session(session_obj, db: AsyncSession, schema_class, force_status=None):

        log("FORMAT SESSION =>", session_obj.id)

        project = await MentorService._get_project(
            db, session_obj.project_id, session_obj.project_type
        )

        key = "request_id" if schema_class.__name__ == "NewRequestOut" else "session_id"

        return schema_class(
            **{
                key: session_obj.id,
                "student": StudentOut(
                    id=session_obj.student.id,
                    email=session_obj.student.email,
                    role=session_obj.student.role.value,
                ),
                "project": MentorService._project_to_schema(session_obj, project),
                "status": RequestStatusEnum(force_status or session_obj.status.value)
            }
        )

    # ==========================================================
    # PROJECT -> SCHEMA
    # ==========================================================
    @staticmethod
    def _project_to_schema(session_obj, project):
        return ProjectOut(
            project_id=session_obj.project_id,
            project_type=session_obj.project_type,
            title=project.title,
            domain=project.domain,
            tools=json.loads(project.tools) if project.tools else [],
            techStack=json.loads(project.techStack) if project.techStack else [],
            image=project.image
        )
