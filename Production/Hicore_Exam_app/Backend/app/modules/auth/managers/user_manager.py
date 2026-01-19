from datetime import datetime
from typing import Optional, Dict, Any
from fastapi import HTTPException
from fastapi import BackgroundTasks
from app.core.services.db_service import DBService
from ..models.user import User, RoleEnum
from ..services.email_service import EmailOtpService

# Use centralized project logger
from app.core.logger import logger

OTP_EXPIRY_MINUTES = 5

# Fixed OTP emails (no email sending)
FIXED_OTP_EMAILS = {
    # "hicoresoft@gmail.com": "1234",
    # "yokeshashwinktm@gmail.com": "1234",
    # "gokulpriya5757@gmail.com": "1234",
    # "gokulapriya5757@gmail.com": "1234",
}


class UserManager(DBService):
    """Handles user authentication, OTP verification, and user management."""

    def __init__(self):
        super().__init__(User)
        self.email_service = EmailOtpService()
        logger.debug("[UserManager] Initialized")

    # ======================================================
    # USER UTILITIES
    # ======================================================

    async def get_user_by_id(self, user_id: int) -> Optional[User]:
        logger.info(f"[UserManager] Fetching user by ID: {user_id}")
        async with self.get_manager() as manager:
            return await manager.get_by_id(user_id)

    async def get_user_by_email(self, email: str) -> Optional[User]:
        logger.info(f"[UserManager] Fetching user by email: {email}")
        async with self.get_manager() as manager:
            return await manager.get_by_attrs(email=email)

    # ======================================================
    # SEND EMAIL OTP (NO EMAIL FOR TEST USERS)
    # ======================================================

    async def send_email_otp(self, email: str, background: BackgroundTasks) -> Dict[str, Any]:
        logger.info(f"[UserManager] Requested OTP for email: {email}")

        try:
            # ------------------------------
            # TEST ACCOUNTS → FIXED OTP
            # ------------------------------
            if email in FIXED_OTP_EMAILS:
                otp = FIXED_OTP_EMAILS[email]
                self.email_service.generate_and_store_otp(email, OTP_EXPIRY_MINUTES)

                logger.info(f"[UserManager] Assigned fixed OTP for test email: {email}")

                return {
                    "success": True,
                    "message": f"Test OTP generated for {email}",
                    "otp": otp
                }

            # ------------------------------
            # REAL USERS → GENERATE OTP
            # ------------------------------
            otp = self.email_service.generate_and_store_otp(email, OTP_EXPIRY_MINUTES)

            # ------------------------------
            # 🚀 BACKGROUND EMAIL SENDING
            # ------------------------------
            background.add_task(
                self.email_service.send_otp_background,  # background-safe method
                email,
                otp,
                OTP_EXPIRY_MINUTES
            )

            logger.info(f"[UserManager] OTP queued for background sending to {email}")

            return {
                "success": True,
                "message": "OTP generated. Email is being sent in background."
            }

        except Exception as e:
            logger.error(f"[UserManager] send_email_otp failed: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail="Failed to send email OTP")

    # ======================================================
    # VERIFY EMAIL OTP
    # ======================================================

    async def verify_email_otp(self, email: str, otp: str, role: RoleEnum):
        logger.info(f"[UserManager] Verifying OTP for email: {email}")

        try:
            # OTP validation
            if not self.email_service.verify_otp(email, otp):
                logger.warning(f"[UserManager] OTP invalid or expired for {email}")
                raise HTTPException(status_code=400, detail="Invalid or expired OTP")

            # Fetch or create user
            async with self.get_manager() as manager:
                user = await manager.get_by_attrs(email=email)

                if not user:
                    logger.info(f"[UserManager] Creating new user for {email}")
                    user = await manager.create(
                        {"email": email, "role": role, "provider": "smtp"}
                    )

            logger.info(f"[UserManager] OTP verified successfully for {email}")

            return {
                "success": True,
                "message": "OTP verified successfully",
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "role": user.role.value,
                },
            }

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"[UserManager] verify_email_otp failed: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail="Failed to verify email OTP")

    # ======================================================
    # USER MANAGEMENT
    # ======================================================

    async def list_users(self, role: Optional[RoleEnum] = None):
        logger.info(f"[UserManager] Listing users (role={role})")

        try:
            filters = {"role": role.value} if role else None
            async with self.get_manager() as manager:
                return await manager.read_all(filters=filters)

        except Exception as e:
            logger.error(f"[UserManager] list_users failed: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail="Failed to fetch users")

    async def create_user(self, data: Dict[str, Any]):
        logger.info(f"[UserManager] Creating user: {data.get('email')}")

        try:
            email = data.get("email")
            phone = data.get("phone")

            async with self.get_manager() as manager:
                # Duplicate email
                if email:
                    logger.debug(f"[UserManager] Checking duplicate email: {email}")
                    if await manager.get_by_attrs(email=email):
                        logger.warning(f"[UserManager] Email already registered: {email}")
                        raise HTTPException(
                            status_code=400, detail="Email already registered"
                        )

                # Duplicate phone
                if phone:
                    logger.debug(f"[UserManager] Checking duplicate phone: {phone}")
                    if await manager.get_by_attrs(phone=phone):
                        logger.warning(
                            f"[UserManager] Phone already registered: {phone}"
                        )
                        raise HTTPException(
                            status_code=400, detail="Phone already registered"
                        )

                # Create user
                new_user = await manager.create(
                    {
                        "email": email,
                        "phone": phone,
                        "role": data.get("role"),
                        "provider": "manual",
                    }
                )

                logger.info(
                    f"[UserManager] User created: ID={new_user.id}, Email={new_user.email}"
                )

                return {
                    "id": new_user.id,
                    "email": new_user.email,
                    "phone": new_user.phone,
                    "role": new_user.role.value,
                    "created_at": str(new_user.created_at),
                }

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"[UserManager] create_user failed: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail="Failed to create user")

    async def update_user(self, user_id: int, data: Dict[str, Any]):
        logger.info(f"[UserManager] Updating user ID: {user_id}")

        try:
            async with self.get_manager() as manager:
                user = await manager.get_by_id(user_id)

                if not user:
                    logger.warning(f"[UserManager] User not found: {user_id}")
                    raise HTTPException(status_code=404, detail="User not found")

                # Duplicate email
                if data.get("email"):
                    logger.debug(
                        f"[UserManager] Checking email duplicate for {data['email']}"
                    )
                    existing = await manager.get_by_attrs(email=data["email"])
                    if existing and existing.id != user_id:
                        logger.warning(
                            f"[UserManager] Email already used: {data['email']}"
                        )
                        raise HTTPException(
                            status_code=400, detail="Email already used"
                        )

                # Duplicate phone
                if data.get("phone"):
                    logger.debug(
                        f"[UserManager] Checking phone duplicate for {data['phone']}"
                    )
                    existing = await manager.get_by_attrs(phone=data["phone"])
                    if existing and existing.id != user_id:
                        logger.warning(
                            f"[UserManager] Phone already used: {data['phone']}"
                        )
                        raise HTTPException(
                            status_code=400, detail="Phone already used"
                        )

                updated_user = await manager.update(user_id, data)

                logger.info(f"[UserManager] User updated: {user_id}")

                return {
                    "id": updated_user.id,
                    "email": updated_user.email,
                    "phone": updated_user.phone,
                    "role": updated_user.role.value,
                    "provider": updated_user.provider,
                    "created_at": str(updated_user.created_at),
                }

        except Exception as e:
            logger.error(f"[UserManager] update_user failed: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail="Failed to update user")

    async def delete_user(self, user_id: int):
        logger.info(f"[UserManager] Deleting user ID: {user_id}")

        try:
            async with self.get_manager() as manager:
                user = await manager.get_by_id(user_id)

                if not user:
                    logger.warning(f"[UserManager] User not found: {user_id}")
                    raise HTTPException(status_code=404, detail="User not found")

                await manager.delete(user_id)
                logger.info(f"[UserManager] User deleted: {user_id}")

                return True

        except Exception as e:
            logger.error(f"[UserManager] delete_user failed: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail="Failed to delete user")
