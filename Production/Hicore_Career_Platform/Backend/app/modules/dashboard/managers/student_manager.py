from datetime import datetime
from typing import Any, Dict, List
from fastapi import HTTPException
from app.core.services.db_service import DBService
from app.modules.auth.managers.user_manager import UserManager
from app.modules.dashboard.models.student_dashboard_model import StudentDashboard
from app.modules.progress_manager.utils.json_store import progress_store


class StudentManager:
    """Handles CRUD operations and dashboard analytics for students."""

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
                raise HTTPException(status_code=400, detail="Dashboard already exists")

            new_dashboard = await manager.create({
                "user_id": user_id,
                "summary": data["summary"],
                "details": data["details"],
                "generated_at": data["generated_at"]
            })

            await self.session.commit()
            return {
                "status": "success",
                "message": "Dashboard created and saved successfully",
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

        # If not found → create automatically
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

        # Refresh existing dashboard
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
    async def update_dashboard(self, user_id: int, custom_data: Dict[str, Any]) -> Dict[str, Any]:
        await self._validate_user(user_id)

        async with self.db_service.get_manager() as manager:
            dashboard = await manager.get_by_attrs(user_id=user_id)

            if not dashboard:
                raise HTTPException(status_code=404, detail="Dashboard not found")

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
    async def delete_dashboard(self, user_id: int) -> Dict[str, Any]:
        await self._validate_user(user_id)

        async with self.db_service.get_manager() as manager:
            dashboard = await manager.get_by_attrs(user_id=user_id)
            if not dashboard:
                raise HTTPException(status_code=404, detail="Dashboard not found")

            await manager.delete(dashboard.id)
            await self.session.commit()

        return {"status": "deleted", "message": f"Dashboard for user {user_id} deleted"}

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
    # ⚙️ INTERNAL SUMMARY BUILDER (JSON VERSION)
    # ==========================================================
    async def _generate_summary(self, user_id: int) -> Dict[str, Any]:
        """Generate dashboard summary from JSON storage (progress_store)."""

        db = progress_store.load()

        user = next((u for u in db.get("users", []) if u["userId"] == str(user_id)), None)

        if not user or "items" not in user:
            return {
                "summary": self._empty_summary(),
                "details": {},
                "generated_at": datetime.utcnow().isoformat() + "Z",
                "message": "No progress found for this student."
            }

        summary = self._empty_summary()
        details = {}

        for item in user["items"]:
            item_type = item.get("itemType")
            item_id = item.get("itemId")
            completed_list = item.get("completed", [])
            total = item.get("totalLessons", 0)

            if not item_type:
                continue

            # Calculate percentage
            percentage = int((len(completed_list) / total) * 100) if total > 0 else 0
            percentage = min(percentage, 100)
            status = "completed" if percentage == 100 else "inprogress"

            # Map dynamic names to old format
            completed_key = f"{item_type}s_completed"
            if item_type == "certificate":
                completed_key = "certificates_acquired"

            ongoing_key = f"ongoing_{item_type}s"

            # Ensure keys exist
            summary.setdefault(completed_key, 0)
            summary.setdefault(ongoing_key, 0)

            # Update summary counters
            if status == "completed":
                summary[completed_key] += 1
            else:
                summary[ongoing_key] += 1

            # Prepare details structure
            details.setdefault(item_type, {"completed": [], "inprogress": []})

            details[item_type][status].append({
                "item_type": item_type,
                "item_id": item_id,
                "progress": percentage,
                "completed": completed_list,
                "total": total,
                "status": status
            })

        return {
            "summary": summary,
            "details": details,
            "generated_at": datetime.utcnow().isoformat() + "Z"
        }

    # ==========================================================
    # 🧩 OLD SYSTEM COMPATIBLE DEFAULT SUMMARY
    # ==========================================================
    def _empty_summary(self) -> Dict[str, int]:
        return {
            "projects_completed": 0,
            "courses_completed": 0,
            "certificates_acquired": 0,
            "challenges_completed": 0,
            "ongoing_courses": 0,
            "ongoing_projects": 0,
            "ongoing_challenges": 0
        }
