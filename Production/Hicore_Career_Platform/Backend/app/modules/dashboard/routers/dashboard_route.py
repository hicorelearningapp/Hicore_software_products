from fastapi import APIRouter, Depends, HTTPException, status
from app.modules.dashboard.managers.student_manager import StudentManager
from app.modules.dashboard.managers.jobseeker_manager import JobseekerManager
from app.modules.dashboard.managers.mentor_manager import MentorDashboardManager
from app.modules.dashboard.managers.employee_manager import EmployeeManager
from app.modules.auth.managers.user_manager import UserManager
from app.core.database.config import get_db

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


async def get_user_manager(session=Depends(get_db)):
    manager = UserManager()
    manager.session = session
    return manager


@router.get("/{role}/{user_id}")
async def get_dashboard(role: str, user_id: int, user_manager: UserManager = Depends(get_user_manager)):
    role = role.lower()

    role_managers = {
        "student": StudentManager,
        "jobseeker": JobseekerManager,
        "mentor": MentorDashboardManager,
        "employee": EmployeeManager,
    }

    if role not in role_managers:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role. Allowed roles: student, jobseeker, mentor, employee."
        )

    manager = role_managers[role](user_manager)

    try:
        dashboard_data = await manager.get_dashboard(user_id)
        return {"status": "success", "role": role, "data": dashboard_data}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch {role} dashboard: {str(e)}"
        )


@router.get("/admin/list/all")
async def list_all_dashboards(user_manager: UserManager = Depends(get_user_manager)):
    """
    List all dashboards grouped by role (student, jobseeker, mentor, employee).
    Returns each category with a total count.
    """
    try:
        student_manager = StudentManager(user_manager)
        jobseeker_manager = JobseekerManager(user_manager)
        # mentor_manager = MentorManager(user_manager)
        # employee_manager = EmployeeManager(user_manager)

        # Fetch dashboards by role
        student_dash = await student_manager.list_dashboards()
        jobseeker_dash = await jobseeker_manager.list_dashboards()
        # mentor_dash = await mentor_manager.list_dashboards()
        # employee_dash = await employee_manager.list_dashboards()

        response = {
            "status": "success",
            "summary": {
                "total_students": len(student_dash),
                "total_jobseekers": len(jobseeker_dash),
                # "total_mentors": len(mentor_dash),
                # "total_employees": len(employee_dash),
                # "grand_total": len(student_dash) + len(jobseeker_dash) + len(mentor_dash) + len(employee_dash)
            },
            "data": {
                "students": student_dash or [],
                "jobseekers": jobseeker_dash or [],
                # "mentors": mentor_dash or [],
                # "employees": employee_dash or [],
            },
        }

        return response

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error listing dashboards: {str(e)}"
        )