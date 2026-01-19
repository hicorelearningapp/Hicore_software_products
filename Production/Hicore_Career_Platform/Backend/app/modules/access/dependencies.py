# app/modules/access/dependencies.py

from fastapi import Depends
from app.core.database.config import get_db
from app.modules.auth.managers.user_manager import UserManager
from app.modules.access.managers.access_manager import AccessManager


async def get_user_manager(session=Depends(get_db)):
    """
    Create and inject UserManager with DB session.
    """
    manager = UserManager()
    manager.session = session  # attach the active async session
    return manager


async def get_access_manager(user_manager: UserManager = Depends(get_user_manager)):
    """
    Inject AccessManager with UserManager dependency.
    """
    return AccessManager(user_manager)
