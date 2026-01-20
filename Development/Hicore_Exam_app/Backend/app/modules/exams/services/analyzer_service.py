from pathlib import Path
import json
from typing import Dict, Any, List
import tempfile
import logging

logger = logging.getLogger(__name__)


class AnalyzerService:
    """
    Stores and retrieves user performance analytics, grouped by:
      user -> exam -> subject -> [records]

    Records for the same (unit, total_questions) overwrite older ones.
    """

    def __init__(self, data_root: str):
        self.root = Path(data_root) / "analyzer" / "users"
        self.root.mkdir(parents=True, exist_ok=True)

    # ---------- internal helpers ---------- #

    def _path(self, user_id: int):
        return self.root / f"{user_id}.json"

    def _load_user(self, user_id: int) -> Dict[str, Any]:
        path = self._path(user_id)

        if not path.exists():
            return {}

        try:
            with open(path, "r") as f:
                return json.load(f)
        except json.JSONDecodeError:
            logger.error("Corrupted analyzer file for user %s — resetting", user_id)
            return {}

    def _save_user(self, user_id: int, data: Dict[str, Any]):
        """
        Atomic write — reduces chance of corrupted JSON
        if two writes happen nearly at the same time.
        """
        path = self._path(user_id)
        with tempfile.NamedTemporaryFile("w", delete=False, dir=path.parent) as tmp:
            json.dump(data, tmp, indent=2)
            temp_name = tmp.name

        Path(temp_name).replace(path)

    # ---------- CREATE / UPDATE ---------- #

    def save_unit_result(self, payload: Dict[str, Any]) -> Dict[str, Any]:

        required = [
            "user_id", "total_questions", "correct",
            "attempted", "wrong", "timeTakenSeconds",
            "exam_id", "subject_name", "unit_name"
        ]
        for key in required:
            if key not in payload:
                raise ValueError(f"Missing field: {key}")

        user_id = payload["user_id"]
        total = payload["total_questions"]
        correct = payload["correct"]

        if total == 0:
            accuracy = 0
        else:
            accuracy = round((correct / total) * 100)

        payload["overall_score"] = f"{correct}/{total}"
        payload["accuracy_percent"] = accuracy

        data = self._load_user(user_id)

        exam = payload["exam_id"]
        subject = payload["subject_name"]
        unit = payload["unit_name"]

        data.setdefault(exam, {})
        data[exam].setdefault(subject, [])

        records = data[exam][subject]

        replaced = False
        for idx, record in enumerate(records):
            if (
                record["unit"].lower() == unit.lower()
                and record["total_questions"] == total
            ):
                records[idx] = {
                    "unit": unit,
                    "total_questions": total,
                    "attempted": payload["attempted"],
                    "correct": payload["correct"],
                    "wrong": payload["wrong"],
                    "timeTakenSeconds": payload["timeTakenSeconds"],
                    "overall_score": payload["overall_score"],
                    "accuracy_percent": payload["accuracy_percent"],
                }
                replaced = True
                break

        if not replaced:
            records.append({
                "unit": unit,
                "total_questions": total,
                "attempted": payload["attempted"],
                "correct": payload["correct"],
                "wrong": payload["wrong"],
                "timeTakenSeconds": payload["timeTakenSeconds"],
                "overall_score": payload["overall_score"],
                "accuracy_percent": payload["accuracy_percent"],
            })

        self._save_user(user_id, data)

        return {
            "success": True,
            "message": "Updated existing record" if replaced else "Saved new record",
            "data": payload,
        }

    # ---------- READ ---------- #

    def get_user_all(self, user_id: int):
        return self._load_user(user_id)

    def get_by_exam(self, user_id: int, exam_id: str, limit: int = 10):
        data = self._load_user(user_id)
        if exam_id not in data:
            return []

        results: List[Dict[str, Any]] = []
        for subject, records in data[exam_id].items():
            for r in records:
                results.append({"subject_name": subject, **r})

        # newest at bottom → reverse
        return results[::-1][:limit]

    def get_by_exam_subject(self, user_id: int, exam_id: str, subject: str):
        data = self._load_user(user_id)
        return data.get(exam_id, {}).get(subject, [])

    # ---------- DELETE ---------- #

    def delete_record(self, user_id: int, exam_id: str, subject: str, index: int):
        data = self._load_user(user_id)

        try:
            data[exam_id][subject].pop(index)
        except Exception:
            return False

        self._save_user(user_id, data)
        return True

    def delete_exam(self, user_id: int, exam_id: str):
        data = self._load_user(user_id)

        if exam_id in data:
            del data[exam_id]
            self._save_user(user_id, data)
            return True

        return False

    def clear_user(self, user_id: int):
        self._save_user(user_id, {})
        return True
