# app/modules/access/managers/access_manager.py

from fastapi import HTTPException
from sqlalchemy import select, delete

from app.modules.access.models.access_model import Access
from app.modules.access.schemas.access_schema import AccessCreate
from app.modules.auth.managers.user_manager import UserManager

from app.modules.progress_manager.services.progress_service import ProgressService
from app.modules.progress_manager.schemas.progress_schema import ProgressUpdate


class AccessManager:
    """Handles granting/revoking access + initializes JSON progress."""

    def __init__(self, user_manager: UserManager):
        self.user_manager = user_manager
        self.db = user_manager.session

    # -------------------------------
    # VALIDATE USER EXISTS
    # -------------------------------
    async def _validate_user(self, user_id: int):
        user = await self.user_manager.get_user_by_id(user_id)
        if not user:
            raise HTTPException(404, f"User {user_id} not found")
        return user

    # -------------------------------
    # SERIALIZER FOR ORM
    # -------------------------------
    def _serialize(self, obj: Access):
        return {
            "id": obj.id,
            "user_id": obj.user_id,
            "item_type": obj.item_type,
            "item_id": obj.item_id,
            "status": obj.status,
            "created_at": obj.created_at.isoformat() if obj.created_at else None,
        }

    # -------------------------------
    # GRANT ACCESS (ACTIVE + INIT PROGRESS)
    # -------------------------------
    async def grant_access(self, data: AccessCreate):
        try:
            await self._validate_user(data.user_id)

            # Check if already exists
            result = await self.db.execute(
                select(Access).where(
                    Access.user_id == data.user_id,
                    Access.item_type == data.item_type,
                    Access.item_id == data.item_id
                )
            )
            if result.scalars().first():
                raise HTTPException(400, "Access already granted")

            # Create new access entry
            new_access = Access(**data.dict())
            self.db.add(new_access)
            await self.db.commit()
            await self.db.refresh(new_access)

            # Create initial ACTIVE progress state
            ProgressService.save_progress(
                ProgressUpdate(
                    userId=str(data.user_id),
                    itemType=data.item_type,
                    itemId=data.item_id,
                    lessonPath=None,
                    totalLessons=1,
                    status="active"
                )
            )

            return {
                "status": "success",
                "message": "Access granted + progress created as active",
                "access": self._serialize(new_access)
            }

        except HTTPException:
            raise
        except Exception as e:
            await self.db.rollback()
            raise HTTPException(500, f"[AccessManager] Failed: {e}")

    # -------------------------------
    # CHECK ACCESS
    # -------------------------------
    async def check_access(self, user_id: int, item_type: str, item_id: str) -> bool:
        try:
            await self._validate_user(user_id)

            result = await self.db.execute(
                select(Access).where(
                    Access.user_id == user_id,
                    Access.item_type == item_type,
                    Access.item_id == item_id
                )
            )
            access = result.scalars().first()
            return bool(access and access.status == "granted")

        except Exception as e:
            raise HTTPException(500, f"[AccessManager] Failed: {e}")

    # -------------------------------
    # REVOKE ACCESS + DELETE PROGRESS
    # -------------------------------
    async def revoke_access(self, user_id: int, item_type: str, item_id: str):
        try:
            await self._validate_user(user_id)

            await self.db.execute(
                delete(Access).where(
                    Access.user_id == user_id,
                    Access.item_type == item_type,
                    Access.item_id == item_id
                )
            )
            await self.db.commit()

            # FIXED: Must pass itemType also
            ProgressService.delete_item(
                userId=str(user_id),
                itemId=item_id,
                itemType=item_type
            )

            return {
                "status": "success",
                "message": "Access revoked + progress deleted"
            }

        except HTTPException:
            raise
        except Exception as e:
            await self.db.rollback()
            raise HTTPException(500, f"[AccessManager] Failed: {e}")

    # -------------------------------
    # LIST ACCESS (FULL FIX)
    # -------------------------------
    async def list_access(self, user_id: int):
        try:
            await self._validate_user(user_id)

            result = await self.db.execute(
                select(Access).where(Access.user_id == user_id)
            )
            items = result.scalars().all()

            # FIX: Convert ORM → dict
            return [self._serialize(i) for i in items]

        except Exception as e:
            raise HTTPException(500, f"[AccessManager] Failed: {e}")


    # -------------------------------
    # DELETE ALL ACCESS BY ITEM TYPE (FOR ONE USER)
    # -------------------------------
    async def delete_by_item_type(self, user_id: int, item_type: str):
        """
        Delete ALL access entries for a user with the given item_type.
        Example:
        delete_by_item_type(12, "course") → deletes all courses for user 12
        """

        try:
            await self._validate_user(user_id)

            # Fetch all access entries of this type
            result = await self.db.execute(
                select(Access).where(
                    Access.user_id == user_id,
                    Access.item_type == item_type
                )
            )
            access_items = result.scalars().all()

            if not access_items:
                return {
                    "status": "success",
                    "message": f"No access entries found for type '{item_type}'.",
                    "deleted_count": 0
                }

            deleted_items = []

            # Delete all matched items
            for item in access_items:
                # Delete DB access
                await self.db.execute(
                    delete(Access).where(
                        Access.user_id == user_id,
                        Access.item_type == item_type,
                        Access.item_id == item.item_id
                    )
                )

                # Delete progress
                ProgressService.delete_item(
                    userId=str(user_id),
                    itemId=item.item_id,
                    itemType=item_type
                )

                deleted_items.append({
                    "item_id": item.item_id,
                    "item_type": item_type
                })

            await self.db.commit()

            return {
                "status": "success",
                "message": f"Deleted all items of type '{item_type}' for user {user_id}",
                "deleted": deleted_items,
                "deleted_count": len(deleted_items)
            }

        except Exception as e:
            await self.db.rollback()
            raise HTTPException(500, f"[AccessManager] Failed delete by item type: {e}")
