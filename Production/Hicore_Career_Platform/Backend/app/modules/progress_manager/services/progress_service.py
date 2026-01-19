# app/modules/progress/services/progress_service.py

from ..schemas.progress_schema import ProgressUpdate
from app.modules.progress_manager.utils.json_store import progress_store


class ProgressService:

    # ---------------------------------------------------
    # SAVE (CREATE or UPDATE) PROGRESS
    # ---------------------------------------------------
    @staticmethod
    def save_progress(data: ProgressUpdate):
        db = progress_store.load()

        # Find or create user
        user = next((u for u in db["users"] if u["userId"] == data.userId), None)
        if not user:
            user = {"userId": data.userId, "items": []}
            db["users"].append(user)

        # Ensure items array exists
        if "items" not in user:
            user["items"] = []

        # Find or create item
        item = next((i for i in user["items"] if i["itemId"] == data.itemId), None)
        if not item:
            item = {
                "itemId": data.itemId,
                "itemType": data.itemType,
                "completed": [],
                "active": None,
                "percentage": 0,
                "totalLessons": data.totalLessons
            }
            user["items"].append(item)

        # Update total lessons
        item["totalLessons"] = data.totalLessons

        # ACTIVE lesson update
        if data.status == "active" and data.lessonPath:
            item["active"] = data.lessonPath

        # COMPLETED lesson update
        if data.status == "completed" and data.lessonPath:
            if data.lessonPath not in item["completed"]:
                item["completed"].append(data.lessonPath)

        # Calculate percentage
        completed = len(item["completed"])
        total = item["totalLessons"]

        item["percentage"] = (
            min(int((completed / total) * 100), 100) if total > 0 else 0
        )

        progress_store.save(db)
        return {"message": "Progress saved"}

    # ---------------------------------------------------
    # GET ONE ITEM (userId + itemId + itemType)
    # ---------------------------------------------------
    @staticmethod
    def get_progress(userId: str, itemId: str, itemType: str):
        db = progress_store.load()

        user = next((u for u in db["users"] if u["userId"] == userId), None)
        if not user:
            return {"message": "User not found"}

        item = next(
            (i for i in user.get("items", [])
             if i["itemId"] == itemId and i["itemType"] == itemType),
            None
        )

        if not item:
            return {"message": "Item not found"}

        return item

    # ---------------------------------------------------
    # GET ALL ITEMS FOR USER
    # ---------------------------------------------------
    @staticmethod
    def get_all_items(userId: str):
        db = progress_store.load()

        user = next((u for u in db["users"] if u["userId"] == userId), None)
        if not user:
            return {"userId": userId, "items": []}

        if "items" not in user:
            user["items"] = []

        items = []

        for i in user["items"]:
            completed_count = len(i["completed"])
            total = i.get("totalLessons", 0)

            # Skip items with no progress
            if total == 0 or completed_count == 0:
                continue

            status = "completed" if completed_count >= total else "in-progress"

            items.append({
                "itemId": i["itemId"],
                "itemType": i["itemType"],
                "completed": i["completed"],
                "active": i["active"],
                "percentage": min(i["percentage"], 100),
                "totalLessons": total,
                "status": status
            })

        return {"userId": userId, "items": items}

    # ---------------------------------------------------
    # ASYNC VERSION (progress_manager API)
    # ---------------------------------------------------
    async def get_progress_for_item(self, user_id: int, item_type: str, item_id: str):
        db = progress_store.load()

        user = next((u for u in db["users"] if u["userId"] == user_id), None)
        if not user:
            return {"message": "User not found"}

        item = next(
            (i for i in user.get("items", [])
             if i["itemId"] == item_id and i["itemType"] == item_type),
            None
        )

        if not item:
            return {"message": "Item not found"}

        return item

    # ---------------------------------------------------
    # UPDATE PROGRESS (just wrapper)
    # ---------------------------------------------------
    @staticmethod
    def update_progress(data: ProgressUpdate):
        return ProgressService.save_progress(data)

    # ---------------------------------------------------
    # DELETE ONE ITEM
    # ---------------------------------------------------
    @staticmethod
    def delete_item(userId: str, itemId: str, itemType: str):
        db = progress_store.load()

        user = next((u for u in db["users"] if u["userId"] == userId), None)
        if not user:
            return {"message": "User not found"}

        if "items" not in user:
            user["items"] = []

        user["items"] = [
            i for i in user["items"]
            if not (i["itemId"] == itemId and i["itemType"] == itemType)
        ]

        progress_store.save(db)
        return {"message": "Item deleted"}

    # ---------------------------------------------------
    # DELETE USER COMPLETELY
    # ---------------------------------------------------
    @staticmethod
    def delete_user(userId: str):
        db = progress_store.load()

        db["users"] = [u for u in db["users"] if u["userId"] != userId]

        progress_store.save(db)
        return {"message": "User deleted"}
