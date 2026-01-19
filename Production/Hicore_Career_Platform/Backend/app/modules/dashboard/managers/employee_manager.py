# app/modules/dashboard/managers/employee_manager.py
from datetime import datetime

class EmployeeManager:
    """Dashboard logic for employees."""

    async def get_dashboard(self, user_id: int):
        # Dummy metrics for now (replace with project tracking)
        total_projects = 5
        tasks_completed = 42
        performance_score = 87.5

        return {
            "summary": {
                "total_projects": total_projects,
                "tasks_completed": tasks_completed,
                "performance_score": performance_score
            },
            "generated_at": datetime.utcnow().isoformat() + "Z"
        }
