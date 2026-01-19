from datetime import datetime
from typing import Any, Dict, List
from fastapi import HTTPException

from app.core.services.db_service import DBService
from app.modules.auth.managers.user_manager import UserManager
from app.modules.dashboard.models.student_dashboard_model import StudentDashboard
from app.modules.project_drashboard.services.mentor_service import MentorService
from app.modules.mentor_json.services.mentor_service import MentorService as MentorSessions
class MentorDashboardManager:
    """Handles CRUD operations and dashboard analytics for mentors."""

    def __init__(self, user_manager: UserManager):
        self.user_manager = user_manager
        self.session = user_manager.session
        self.db_service = DBService(StudentDashboard, self.session)

    # ==========================================================
    # 🔍 VALIDATION
    # ==========================================================
    async def _validate_user(self, user_id: int):
        user = await self.user_manager.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail=f"User with id {user_id} not found")
        return user

    # ==========================================================
    # 🟢 CREATE DASHBOARD
    # ==========================================================
    async def create_dashboard(self, user_id: int) -> Dict[str, Any]:
        await self._validate_user(user_id)

        data = await self._generate_summary(user_id)

        async with self.db_service.get_manager() as manager:
            existing = await manager.get_by_attrs(user_id=user_id)
            if existing:
                raise HTTPException(status_code=400, detail="Mentor dashboard already exists")

            new_dashboard = await manager.create({
                "user_id": user_id,
                "summary": data["summary"],
                "details": data["details"],
                "generated_at": data["generated_at"]
            })

            await self.session.commit()
            return {
                "status": "success",
                "message": "Mentor dashboard created successfully",
                "dashboard": {
                    "id": new_dashboard.id,
                    "user_id": new_dashboard.user_id,
                    "generated_at": new_dashboard.generated_at
                }
            }

    # ==========================================================
    # 📘 GET OR AUTO-SYNC DASHBOARD
    # ==========================================================
    async def get_dashboard(self, user_id: int) -> Dict[str, Any]:
        await self._validate_user(user_id)

        async with self.db_service.get_manager() as manager:
            dashboard = await manager.get_by_attrs(user_id=user_id)

        # If dashboard does not exist → create one
        if not dashboard:
            generated = await self._generate_summary(user_id)

            async with self.db_service.get_manager() as manager:
                new_dashboard = await manager.create({
                    "user_id": user_id,
                    "summary": generated["summary"],
                    "details": generated["details"],
                    "generated_at": generated["generated_at"]
                })
                await self.session.commit()

            return {"status": "created", "dashboard": new_dashboard}

        # Refresh an existing dashboard
        refreshed = await self._generate_summary(user_id)

        async with self.db_service.get_manager() as manager:
            await manager.update(dashboard.id, {
                "summary": refreshed["summary"],
                "details": refreshed["details"],
                "generated_at": refreshed["generated_at"]
            })
            await self.session.commit()

        return {
            "status": "updated",
            "dashboard": {
                "id": dashboard.id,
                "user_id": dashboard.user_id,
                "summary": refreshed["summary"],
                "details": refreshed["details"],
                "generated_at": refreshed["generated_at"]
            }
        }

    # ==========================================================
    # 🧠 UPDATE DASHBOARD MANUALLY
    # ==========================================================
    async def update_dashboard(self, user_id: int, custom_data: Dict[str, Any]):
        await self._validate_user(user_id)

        async with self.db_service.get_manager() as manager:
            dashboard = await manager.get_by_attrs(user_id=user_id)

            if not dashboard:
                raise HTTPException(status_code=404, detail="Mentor dashboard not found")

            update_data = {
                "summary": custom_data.get("summary", dashboard.summary),
                "details": custom_data.get("details", dashboard.details),
                "generated_at": datetime.utcnow().isoformat() + "Z"
            }

            updated = await manager.update(dashboard.id, update_data)
            await self.session.commit()

            return {"status": "success", "message": "Dashboard updated", "dashboard": updated}

    # ==========================================================
    # 🔴 DELETE DASHBOARD
    # ==========================================================
    async def delete_dashboard(self, user_id: int):
        await self._validate_user(user_id)

        async with self.db_service.get_manager() as manager:
            dashboard = await manager.get_by_attrs(user_id=user_id)

            if not dashboard:
                raise HTTPException(status_code=404, detail="Mentor dashboard not found")

            await manager.delete(dashboard.id)
            await self.session.commit()

        return {"status": "deleted", "message": f"Dashboard for mentor {user_id} deleted"}

    # ==========================================================
    # 📋 LIST ALL DASHBOARDS
    # ==========================================================
    async def list_dashboards(self) -> List[Dict[str, Any]]:
        async with self.db_service.get_manager() as manager:
            dashboards = await manager.read_all()

        return [
            {
                "id": d.id,
                "user_id": d.user_id,
                "summary": d.summary,
                "generated_at": d.generated_at
            }
            for d in dashboards
        ]

    # ==========================================================
    # ⚙️ SUMMARY GENERATOR (USES MentorService)
    # ==========================================================
    async def _generate_summary(self, mentor_id: int) -> Dict[str, Any]:

        db = self.session

        # ---------------------------
        # FETCH PROJECT/MENTEE DATA
        # ---------------------------
        active_mentees = await MentorService.get_active_mentees(mentor_id, db)
        ongoing_projects = await MentorService.get_ongoing_projects(mentor_id, db)
        pending_requests = await MentorService.get_new_requests(mentor_id, db)

        # ---------------------------
        # FETCH UPCOMING SESSIONS (using status='upcoming')
        # ---------------------------
        upcoming_sessions = await MentorSessions.sessions_by_status(mentor_id, "upcoming")
        # ---------------------------
        # Convert all objects to JSON-safe dicts
        # ---------------------------
        def to_dict_list(items):
            result = []
            for item in items:
                if hasattr(item, "model_dump"):
                    result.append(item.model_dump())
                elif hasattr(item, "dict"):
                    result.append(item.dict())
                else:
                    result.append(item)
            return result

        active_list = to_dict_list(active_mentees)
        ongoing_list = to_dict_list(ongoing_projects)
        pending_list = to_dict_list(pending_requests)
        upcoming_list = to_dict_list(upcoming_sessions)

        # ---------------------------
        # SUMMARY COUNTS
        # ---------------------------
        summary = {
            "active_mentees": len(active_mentees),
            "ongoing_projects": len(ongoing_projects),
            "pending_requests": len(pending_requests),
            "upcoming_sessions": len(upcoming_sessions),
        }

        # ---------------------------
        # DETAILS STRUCTURE
        # ---------------------------
        details = {
            "active_mentees": active_list,
            "ongoing_projects": ongoing_list,
            "pending_requests": pending_list,
            "upcoming_sessions": upcoming_list
        }

        return {
            "summary": summary,
            "details": details,
            "generated_at": datetime.utcnow().isoformat() + "Z"
        }

