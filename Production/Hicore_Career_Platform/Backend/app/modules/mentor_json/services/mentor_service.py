# app/modules/mentor_json/services/mentor_service.py

from fastapi import UploadFile
from typing import Optional
from datetime import datetime
import random, string

from app.core.utils.file_manager import save_upload_file
from .json_store import mentor_store, slots_store, sessions_store


class MentorService:

    # ======================================================
    # APPLY AS MENTOR
    # ======================================================
    @staticmethod
    async def apply_mentor(data: dict, image: Optional[UploadFile]):

        db = mentor_store.load()

        # Duplicate check
        if any(m["user_id"] == data["user_id"] for m in db["mentors"]):
            raise Exception("User ID already exists")

        # Save image
        image_filename = None
        if image:
            image_filename = await save_upload_file(
                file=image,
                folder="mentors",
                prefix=str(data["user_id"])
            )

        mentor_entry = {
            **data,
            "image": image_filename,
            "status": "pending",
            "submitted_at": datetime.utcnow().isoformat()
        }

        db["mentors"].append(mentor_entry)
        mentor_store.save(db)

        return mentor_entry

    # ======================================================
    # LIST ACCEPTED MENTORS
    # ======================================================
    @staticmethod
    async def list_accepted():
        db = mentor_store.load()
        return [m for m in db["mentors"] if m["status"] == "accepted"]

    # ======================================================
    # GET MENTOR DETAILS
    # ======================================================
    @staticmethod
    async def get_mentor(user_id: int):
        db = mentor_store.load()
        mentor = next((m for m in db["mentors"] if m["user_id"] == user_id), None)

        if not mentor:
            raise Exception("Mentor not found")

        # Convert comma fields to list
        mentor["mentoring_formats"] = mentor["mentoring_formats"].split(",")
        mentor["available_time_slots"] = mentor["available_time_slots"].split(",")
        mentor["tags"] = mentor["tags"].split(",") if mentor.get("tags") else []

        return mentor

    # ======================================================
    # AVAILABLE DATES
    # ======================================================
    @staticmethod
    async def available_dates(mentor_id: int):
        db = slots_store.load()
        dates = {
            s["date"]
            for s in db["slots"]
            if s["mentor_id"] == mentor_id and s["status"] == "available"
        }
        return sorted(list(dates))

    # ======================================================
    # SLOTS FOR DATE
    # ======================================================
    @staticmethod
    async def slots_for_date(mentor_id: int, date: str):
        db = slots_store.load()
        return [
            s for s in db["slots"]
            if s["mentor_id"] == mentor_id and s["date"] == date
        ]

    # ======================================================
    # VALIDATION HELPERS
    # ======================================================
    @staticmethod
    def validate_mentor_exists(mentor_id: int):
        db = mentor_store.load()
        mentor = next((m for m in db["mentors"] if m["user_id"] == mentor_id), None)
        if not mentor:
            raise Exception(f"Mentor {mentor_id} not found")
        return mentor

    @staticmethod
    def validate_slot_belongs_to_mentor(slot, mentor_id):
        if slot["mentor_id"] != mentor_id:
            raise Exception(
                f"Slot ID {slot['id']} does not belong to Mentor ID {mentor_id}"
            )

    # ======================================================
    # BOOK SLOT (WITH FULL VALIDATION)
    # ======================================================
    @staticmethod
    async def book_slot(payload):

        slots_db = slots_store.load()
        sessions_db = sessions_store.load()

        # Validate mentor exists
        MentorService.validate_mentor_exists(payload.mentor_id)

        # Validate slot exists
        slot = next((s for s in slots_db["slots"] if s["id"] == payload.slot_id), None)
        if not slot:
            raise Exception("Slot ID not found")

        # Validate slot belongs to mentor
        MentorService.validate_slot_belongs_to_mentor(slot, payload.mentor_id)

        # Check if slot already booked
        if slot["status"] == "filled":
            raise Exception("Slot already booked")

        # Mark slot as filled
        slot["status"] = "filled"
        slots_store.save(slots_db)

        # Generate Google Meet link
        meet_link = "https://meet.google.com/" + "".join(
            random.choices(string.ascii_lowercase + string.digits, k=10)
        )

        # Create session
        session = {
            "id": len(sessions_db["sessions"]) + 1,
            "mentor_id": payload.mentor_id,
            "student_id": payload.student_id,
            "slot_id": payload.slot_id,
            "date": slot["date"],
            "start_time": slot["start_time"],
            "end_time": slot["end_time"],
            "session_type": payload.session_type,
            "google_meet_link": meet_link,
            "status": "requested",
            "topic": payload.topic
        }

        sessions_db["sessions"].append(session)
        sessions_store.save(sessions_db)

        return session

    # ======================================================
    # SESSIONS BY STATUS
    # ======================================================
    @staticmethod
    async def sessions_by_status(mentor_id: int, status: str):
        db = sessions_store.load()
        return [
            s for s in db["sessions"]
            if s["mentor_id"] == mentor_id and s["status"] == status
        ]

    # ======================================================
    # UPDATE SESSION STATUS
    # ======================================================
    @staticmethod
    async def update_session_status(session_id: int, status: str):

        allowed_statuses = {"upcoming", "ongoing", "completed", "cancelled"}
        if status not in allowed_statuses:
            raise Exception(
                f"Invalid status '{status}'. Allowed: {', '.join(allowed_statuses)}"
            )

        db = sessions_store.load()
        session = next((s for s in db["sessions"] if s["id"] == session_id), None)

        if not session:
            raise Exception("Session not found")

        session["status"] = status
        sessions_store.save(db)

        return session

    # ======================================================
    # ACCEPT SESSION
    # ======================================================
    @staticmethod
    async def accept_session(session_id: int):

        db = sessions_store.load()
        session = next((s for s in db["sessions"] if s["id"] == session_id), None)

        if not session:
            raise Exception("Session not found")

        if session["status"] != "requested":
            raise Exception("Session is not in requested state")

        session["status"] = "upcoming"
        sessions_store.save(db)

        return session

    # ======================================================
    # REJECT SESSION
    # ======================================================
    @staticmethod
    async def reject_session(session_id: int):

        sessions_db = sessions_store.load()
        slots_db = slots_store.load()

        session = next((s for s in sessions_db["sessions"] if s["id"] == session_id), None)
        if not session:
            raise Exception("Session not found")

        if session["status"] != "requested":
            raise Exception("Session is not in requested state")

        # Free slot
        slot = next((sl for sl in slots_db["slots"] if sl["id"] == session["slot_id"]), None)
        if slot:
            slot["status"] = "available"
            slots_store.save(slots_db)

        # Cancel session
        session["status"] = "cancelled"
        sessions_store.save(sessions_db)

        return session

    # ======================================================
    # DELETE MENTOR (REMOVE MENTOR + SLOTS + SESSIONS)
    # ======================================================
    @staticmethod
    async def delete_mentor(mentor_id: int):

        # ------------------------------
        # 1️⃣ Delete mentor
        # ------------------------------
        mentor_db = mentor_store.load()
        mentor = next((m for m in mentor_db["mentors"] if m["user_id"] == mentor_id), None)

        if not mentor:
            raise Exception("Mentor not found")

        mentor_db["mentors"].remove(mentor)
        mentor_store.save(mentor_db)

        # ------------------------------
        # 2️⃣ Delete mentor slots
        # ------------------------------
        slots_db = slots_store.load()
        before_count = len(slots_db["slots"])

        slots_db["slots"] = [
            s for s in slots_db["slots"]
            if s["mentor_id"] != mentor_id
        ]

        slots_store.save(slots_db)

        deleted_slots = before_count - len(slots_db["slots"])

        # ------------------------------
        # 3️⃣ Delete mentor sessions
        # ------------------------------
        sessions_db = sessions_store.load()
        before_sessions = len(sessions_db["sessions"])

        sessions_db["sessions"] = [
            s for s in sessions_db["sessions"]
            if s["mentor_id"] != mentor_id
        ]

        sessions_store.save(sessions_db)

        deleted_sessions = before_sessions - len(sessions_db["sessions"])

        return {
            "message": "Mentor deleted successfully",
            "mentor_id": mentor_id,
            "deleted_slots": deleted_slots,
            "deleted_sessions": deleted_sessions
        }
