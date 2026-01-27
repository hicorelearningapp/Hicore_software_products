from datetime import datetime
from typing import Dict, Any, Tuple


class ProgressService:

    VALID_STATUS = {"completed", "ongoing"}

    def __init__(self, repo, content_service):
        self.repo = repo
        self.content_service = content_service

    # ---------------- VALIDATION ---------------- #

    def _validate_unit_and_topic(
        self,
        exam_id: str,
        unit_name: str,
        topic_name: str
    ) -> Tuple[bool, str | None]:
        """
        Soft validation: returns (is_valid, error_message)
        """
        try:
            learn_data = self.content_service.get_learn(exam_id)["data"]
        except Exception:
            return False, "Invalid exam syllabus"

        for units in learn_data.values():
            if not isinstance(units, list):
                continue

            for unit in units:
                if not isinstance(unit, dict):
                    continue

                name = (
                    unit.get("title")
                    or unit.get("chapterName")
                    or f"Unit-{unit.get('id')}"
                )

                if name != unit_name:
                    continue

                topics = {
                    t.get("name") for t in unit.get("topics", [])
                    if t.get("name")
                }

                if topic_name not in topics:
                    return False, f"Topic '{topic_name}' not found in '{unit_name}'"

                return True, None

        return False, f"Unit '{unit_name}' not found"

    # ---------------- SAVE / UPDATE ---------------- #

    def update_progress(
        self,
        user_id: str,
        exam_id: str,
        unit_name: str,
        topic: str,
        status: str
    ) -> Dict[str, Any]:

        if status not in self.VALID_STATUS:
            return {
                "success": False,
                "message": "Invalid status. Use 'completed' or 'ongoing'."
            }

        # ✅ Validate against syllabus
        is_valid, error = self._validate_unit_and_topic(
            exam_id, unit_name, topic
        )

        if not is_valid:
            return {
                "success": False,
                "message": error
            }

        path = f"user_progress/{user_id}.json"

        try:
            data = self.repo.get_json(path)
        except FileNotFoundError:
            data = {
                "userId": user_id,
                "exams": {}
            }
        except Exception:
            return {
                "success": False,
                "message": "Failed to read user progress"
            }

        exams = data.setdefault("exams", {})
        exam = exams.setdefault(exam_id, {
            "progress": {},
            "lastUpdated": None
        })

        progress = exam.setdefault("progress", {})
        unit = progress.setdefault(unit_name, {
            "completed": [],
            "ongoing": []
        })

        # remove topic from both lists
        unit["completed"] = [t for t in unit["completed"] if t != topic]
        unit["ongoing"] = [t for t in unit["ongoing"] if t != topic]

        unit[status].append(topic)

        exam["lastUpdated"] = datetime.utcnow().isoformat()

        try:
            self.repo.save_json(path, data)
        except Exception:
            return {
                "success": False,
                "message": "Failed to save progress"
            }

        return {
            "success": True,
            "message": "Progress updated",
            "exam": exam
        }

    # ---------------- GET FULL PROGRESS ---------------- #

    def get_progress(self, user_id: str, exam_id: str) -> Dict[str, Any]:
        path = f"user_progress/{user_id}.json"

        try:
            data = self.repo.get_json(path)
        except FileNotFoundError:
            return {
                "summary": self._empty_summary(exam_id),
                "units": {},
                "topics": {}
            }
        except Exception:
            return {
                "success": False,
                "message": "Failed to load progress"
            }

        exam = data.get("exams", {}).get(exam_id, {
            "progress": {}
        })

        return {
            "success": True,
            "summary": self._calculate_summary(exam_id, exam),
            "units": self._unit_completion_stats(exam_id, exam),
            "topics": self._topic_status(exam_id, exam)
        }

    # ---------------- HELPERS ---------------- #

    def _empty_summary(self, exam_id: str) -> Dict[str, Any]:
        totals = self.content_service.get_learn(exam_id)["totals"]
        return {
            "totalTopics": totals["examTotal"],
            "completedTopics": 0,
            "remainingTopics": totals["examTotal"],
            "percentage": 0
        }

    def _calculate_summary(self, exam_id: str, exam_data: dict) -> Dict[str, Any]:
        totals = self.content_service.get_learn(exam_id)["totals"]

        completed = sum(
            len(unit.get("completed", []))
            for unit in exam_data.get("progress", {}).values()
        )

        total = totals["examTotal"]

        return {
            "totalTopics": total,
            "completedTopics": completed,
            "remainingTopics": total - completed,
            "percentage": round((completed / total) * 100, 2) if total else 0
        }

    def _unit_completion_stats(self, exam_id: str, exam_data: dict) -> Dict[str, Any]:
        learn_data = self.content_service.get_learn(exam_id)["data"]
        progress = exam_data.get("progress", {})
        result = {}

        for units in learn_data.values():
            if not isinstance(units, list):
                continue

            for unit in units:
                unit_name = (
                    unit.get("title")
                    or unit.get("chapterName")
                    or f"Unit-{unit.get('id')}"
                )

                total_topics = len(unit.get("topics", []))
                completed_topics = len(
                    progress.get(unit_name, {}).get("completed", [])
                )

                result[unit_name] = {
                    "completed": completed_topics,
                    "total": total_topics,
                    "percentage": round(
                        (completed_topics / total_topics) * 100, 2
                    ) if total_topics else 0
                }

        return result

    def _topic_status(self, exam_id: str, exam_data: dict) -> Dict[str, Any]:
        learn_data = self.content_service.get_learn(exam_id)["data"]
        progress = exam_data.get("progress", {})
        result = {}

        for subject, units in learn_data.items():
            result.setdefault(subject, {})

            for unit in units:
                unit_name = (
                    unit.get("title")
                    or unit.get("chapterName")
                    or f"Unit-{unit.get('id')}"
                )

                unit_progress = progress.get(unit_name, {})
                completed = unit_progress.get("completed", [])
                ongoing = unit_progress.get("ongoing", [])

                result[subject].setdefault(unit_name, {})

                for topic in unit.get("topics", []):
                    name = topic.get("name")
                    if not name:
                        continue

                    if name in completed:
                        status = "completed"
                    elif name in ongoing:
                        status = "ongoing"
                    else:
                        status = "not_started"

                    result[subject][unit_name][name] = status

        return result
