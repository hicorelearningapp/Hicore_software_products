from datetime import datetime
from typing import Dict, Any, Tuple


class PracticeProgressService:

    VALID_STATUS = {"completed", "ongoing"}

    def __init__(self, repo, content_service):
        self.repo = repo
        self.content_service = content_service

    # ---------------- VALIDATION ---------------- #

    def _validate(
        self,
        exam_id: str,
        unit_name: str,
        set_name: str,
        question_id: int
    ) -> Tuple[bool, str | None]:

        try:
            practice = self.content_service.get_practice(exam_id)["data"]
        except Exception:
            return False, "Invalid examId"

        for units in practice.values():
            if not isinstance(units, list):
                continue

            for unit in units:

                name = (
                    unit.get("title")
                    or unit.get("chapterName")
                    or f"Unit-{unit.get('id')}"
                )

                if name != unit_name:
                    continue

                for pset in unit.get("practiceSets", []):

                    if pset.get("name") != set_name:
                        continue

                    ids = {
                        q.get("id")
                        for q in pset.get("questions", [])
                    }

                    if question_id not in ids:
                        return False, "Question not found"

                    return True, None

        return False, "Unit or Practice Set not found"

    # ---------------- UPDATE ---------------- #

    def update_progress(
        self,
        user_id: str,
        exam_id: str,
        unit_name: str,
        set_name: str,
        question_id: int,
        status: str
    ) -> Dict[str, Any]:

        if status not in self.VALID_STATUS:
            return {"success": False, "message": "Invalid status"}

        ok, err = self._validate(
            exam_id, unit_name, set_name, question_id
        )

        if not ok:
            return {"success": False, "message": err}

        path = f"user_progress/{user_id}.json"

        try:
            data = self.repo.get_json(path)
        except FileNotFoundError:
            data = {"userId": user_id, "exams": {}}

        exams = data.setdefault("exams", {})
        exam = exams.setdefault(exam_id, {})
        practice = exam.setdefault("practice", {})
        progress = practice.setdefault("progress", {})

        unit = progress.setdefault(unit_name, {})
        pset = unit.setdefault(set_name, {
            "completed": [],
            "ongoing": []
        })

        # remove duplicates
        pset["completed"] = [i for i in pset["completed"] if i != question_id]
        pset["ongoing"] = [i for i in pset["ongoing"] if i != question_id]

        pset[status].append(question_id)

        practice["lastUpdated"] = datetime.utcnow().isoformat()
        self.repo.save_json(path, data)

        return {"success": True}

    # ---------------- GET ---------------- #

    def get_progress(
        self,
        user_id: str,
        exam_id: str
    ) -> Dict[str, Any]:

        path = f"user_progress/{user_id}.json"

        try:
            data = self.repo.get_json(path)
        except FileNotFoundError:
            return {"summary": {}, "sets": {}, "questions": {}}

        exam = data.get("exams", {}).get(exam_id, {})
        practice = exam.get("practice", {})
        progress = practice.get("progress", {})

        return {
            "summary": self._summary(exam_id, progress),
            "sets": self._set_stats(exam_id, progress),
            "questions": self._question_status(exam_id, progress)
        }

    # ---------------- HELPERS ---------------- #

    def _summary(self, exam_id: str, progress: dict):

        practice = self.content_service.get_practice(exam_id)["data"]

        total = 0
        for units in practice.values():
            for u in units:
                for s in u.get("practiceSets", []):
                    total += len(s.get("questions", []))

        completed = sum(
            len(pset.get("completed", []))
            for unit in progress.values()
            for pset in unit.values()
        )

        return {
            "totalQuestions": total,
            "completedQuestions": completed,
            "remainingQuestions": total - completed,
            "percentage": round((completed / total) * 100, 2)
            if total else 0
        }

    def _set_stats(self, exam_id: str, progress: dict):

        practice = self.content_service.get_practice(exam_id)["data"]
        result = {}

        for units in practice.values():
            for u in units:

                for s in u.get("practiceSets", []):

                    name = s.get("name")
                    total = len(s.get("questions", []))

                    completed = len(
                        progress.get(
                            u.get("title")
                            or u.get("chapterName")
                            or f"Unit-{u.get('id')}",
                            {}
                        )
                        .get(name, {})
                        .get("completed", [])
                    )

                    result[name] = {
                        "completed": completed,
                        "total": total,
                        "percentage": round((completed / total) * 100, 2)
                        if total else 0
                    }

        return result

    def _question_status(self, exam_id: str, progress: dict):

        practice = self.content_service.get_practice(exam_id)["data"]
        result = {}

        for subject, units in practice.items():
            result.setdefault(subject, {})

            for u in units:

                unit_name = (
                    u.get("title")
                    or u.get("chapterName")
                    or f"Unit-{u.get('id')}"
                )

                result[subject].setdefault(unit_name, {})

                for s in u.get("practiceSets", []):

                    set_name = s.get("name")
                    result[subject][unit_name].setdefault(set_name, {})

                    completed = (
                        progress.get(unit_name, {})
                        .get(set_name, {})
                        .get("completed", [])
                    )

                    ongoing = (
                        progress.get(unit_name, {})
                        .get(set_name, {})
                        .get("ongoing", [])
                    )

                    for q in s.get("questions", []):

                        qid = q.get("id")

                        if qid in completed:
                            status = "completed"
                        elif qid in ongoing:
                            status = "ongoing"
                        else:
                            status = "not_started"

                        result[subject][unit_name][set_name][qid] = status

        return result
