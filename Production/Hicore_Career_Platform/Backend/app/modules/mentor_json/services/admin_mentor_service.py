# app/modules/mentor/services/admin_mentor_service.py

from datetime import datetime, timedelta
from .json_store import mentor_store, slots_store


class AdminMentorService:

    # -----------------------------------------------------
    # APPROVE MENTOR
    # -----------------------------------------------------
    @staticmethod
    async def approve_mentor(user_id: int):
        data = mentor_store.load()

        mentor = next((m for m in data["mentors"] if m["user_id"] == user_id), None)
        if not mentor:
            raise Exception("Mentor not found")

        mentor["status"] = "accepted"
        mentor_store.save(data)

        await AdminMentorService.generate_slots_for_mentor(user_id)

        return mentor

    # -----------------------------------------------------
    # REJECT MENTOR
    # -----------------------------------------------------
    @staticmethod
    async def reject_mentor(user_id: int):
        data = mentor_store.load()

        mentor = next((m for m in data["mentors"] if m["user_id"] == user_id), None)
        if not mentor:
            raise Exception("Mentor not found")

        mentor["status"] = "rejected"
        mentor_store.save(data)

        return mentor

    # -----------------------------------------------------
    # LIST PENDING MENTORS
    # -----------------------------------------------------
    @staticmethod
    async def list_pending():
        data = mentor_store.load()
        return [m for m in data["mentors"] if m.get("status") == "pending"]

    # -----------------------------------------------------
    # GENERATE ROLLING SLOTS FOR MENTOR
    # -----------------------------------------------------
    @staticmethod
    async def generate_slots_for_mentor(
        mentor_id: int,
        days_ahead: int = 14,
        start_hour: int = 10,
        end_hour: int = 21,
        slot_minutes: int = 30,
        break_minutes: int = 15
    ):

        slot_data = slots_store.load()
        today = datetime.today().date()

        # --------------------------------------------------
        # 1️⃣ REMOVE OLD SLOTS
        # --------------------------------------------------
        slot_data["slots"] = [
            s for s in slot_data["slots"]
            if datetime.strptime(s["date"], "%Y-%m-%d").date() >= today
        ]

        slots_store.save(slot_data)

        # --------------------------------------------------
        # 2️⃣ EXISTING FUTURE SLOTS FOR THIS MENTOR
        # --------------------------------------------------
        mentor_slots = [
            s for s in slot_data["slots"]
            if s["mentor_id"] == mentor_id
        ]

        if mentor_slots:
            last_date_str = max(s["date"] for s in mentor_slots)
            last_date = datetime.strptime(last_date_str, "%Y-%m-%d").date()
        else:
            last_date = None

        # --------------------------------------------------
        # 3️⃣ DETERMINE RANGE FOR NEW SLOTS
        # --------------------------------------------------
        start_date = today if last_date is None else last_date + timedelta(days=1)
        end_date = today + timedelta(days=days_ahead)

        if last_date and last_date >= end_date:
            return  # already enough slots

        # --------------------------------------------------
        # 4️⃣ GENERATE NEW SLOTS
        # --------------------------------------------------
        date = start_date
        while date <= end_date:

            current_time = datetime.combine(date, datetime.min.time()).replace(
                hour=start_hour, minute=0
            )
            end_time_obj = current_time.replace(hour=end_hour, minute=0)

            while current_time < end_time_obj:
                slot_start = current_time
                slot_end = current_time + timedelta(minutes=slot_minutes)

                if slot_end > end_time_obj:
                    break

                slot_entry = {
                    "id": len(slot_data["slots"]) + 1,
                    "mentor_id": mentor_id,
                    "date": date.strftime("%Y-%m-%d"),
                    "start_time": slot_start.strftime("%I:%M %p"),
                    "end_time": slot_end.strftime("%I:%M %p"),
                    "status": "available"
                }

                slot_data["slots"].append(slot_entry)

                current_time = slot_end + timedelta(minutes=break_minutes)

            date += timedelta(days=1)

        slots_store.save(slot_data)
