import os
from fastapi import APIRouter, HTTPException,BackgroundTasks
from typing import Dict, Optional

from app.modules.auth.managers.user_manager import UserManager
from app.modules.auth.schemas.user_schemas import (
    SendEmailOtpRequest,
    VerifyEmailOtpRequest,
    RoleEnum,
    CreateUserRequest
)

router = APIRouter(prefix="/auth", tags=["Auth"])
user_manager = UserManager()


# ---------------------- Email OTP ----------------------
@router.post("/send-email-otp")
async def send_email_otp(req: SendEmailOtpRequest, background: BackgroundTasks):
    """Send OTP to user's email (background email sending)."""
    return await user_manager.send_email_otp(req.email, background)

@router.post("/verify-email-otp")
async def verify_email_otp(req: VerifyEmailOtpRequest):
    """Verify OTP and return user (NO JWT)"""
    result = await user_manager.verify_email_otp(req.email, req.otp, req.role)
    if not result:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    return result


# ---------------------- Create User ----------------------
@router.post("/users")
async def add_user(req: CreateUserRequest):
    user = await user_manager.create_user(req.dict())
    return {
        "success": True,
        "message": "User created successfully",
        "user": user
    }


# ---------------------- Read Users ----------------------
@router.get("/users")
async def list_users(role: RoleEnum = None):
    """List all users by optional role"""
    return await user_manager.list_users(role)


@router.get("/users/{user_id}")
async def get_user(user_id: int):
    """Get a single user by ID"""
    user = await user_manager.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": user.id,
        "email": user.email,
        "phone": user.phone,
        "role": user.role.value,
        "provider": user.provider,
        "created_at": str(user.created_at)
    }


# ---------------------- Update User ----------------------
@router.put("/users/{user_id}")
async def update_user(user_id: int, req: CreateUserRequest):
    updated = await user_manager.update_user(user_id, req.dict())
    return {
        "success": True,
        "message": "User updated successfully",
        "user": updated
    }


# ---------------------- Delete User ----------------------
@router.delete("/users/{user_id}")
async def delete_user(user_id: int):
    result = await user_manager.delete_user(user_id)
    return {
        "success": True,
        "message": "User deleted successfully",
        "deleted_id": user_id
    }
