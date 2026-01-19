from fastapi import Depends
from app.core.database.config import get_db
from app.modules.auth.managers.user_manager import UserManager
from app.modules.access.managers.access_manager import AccessManager
from app.modules.dashboard.managers.student_manager import StudentManager
# from app.modules.enroll.managers.enroll_manager import EnrollManager
from app.modules.profile.managers.student_profile_service import StudentProfileService
# from app.modules.progress.managers.progress_manager import ProgressManager

# from app.core.logger.logger import logger
# ============================================================
# DATABASE SESSION → USER MANAGER
# ============================================================

async def get_user_manager(session=Depends(get_db)):
    """
    Provides a UserManager instance with an active DB session.
    """
    manager = UserManager()
    manager.session = session
    return manager


# ============================================================
# ACCESS MANAGER → depends on USER MANAGER
# ============================================================

async def get_access_manager(user_manager: UserManager = Depends(get_user_manager)):
    return AccessManager(user_manager)

# ============================================================
# ENROLL MANAGER → depends on USER MANAGER
# ============================================================

# async def get_enroll_manager(user_manager: UserManager = Depends(get_user_manager)):
#     return EnrollManager(user_manager)

async def get_profile_service(user_manager: UserManager = Depends(get_user_manager)):
    return StudentProfileService(user_manager)

# async def get_progress_manager(user_manager: UserManager = Depends(get_user_manager)):
#     return ProgressManager(user_manager)

async def get_student_manager(user_manager: UserManager = Depends(get_user_manager)):
    return StudentManager(user_manager)