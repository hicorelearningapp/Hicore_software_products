import json, random, uuid
from pathlib import Path
from datetime import datetime
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.week_exams.models.exam_models import Exam

class ExamService:
    # ---------------- LOAD JSON ---------------- #
    def _load_exam_json(self, exam_type: str):

        path = Path(__file__).parent.parent / f"data/{exam_type}.json"

        if not path.exists():
            raise ValueError("Invalid exam type")

        return json.loads(path.read_text(encoding="utf-8"))

    # ---------------- ADMIN ---------------- #

    async def create_exam(self, payload, db: AsyncSession):

        exam_json = self._load_exam_json(payload.exam_type)
        questions = self._flatten_questions(exam_json)

        selected = random.sample(
            questions, payload.total_questions
        )

        exam = Exam(
            id=str(uuid.uuid4()),
            exam_type=payload.exam_type,
            exam_name=payload.exam_name,
            exam_date=payload.exam_date,
            total_questions=payload.total_questions,
            questions=selected,
            created_by="admin",
            created_at=datetime.utcnow(),
            status="active"
        )

        db.add(exam)
        await db.flush()   # async commit done by dependency
        return exam

    async def get_all_exams(self, db: AsyncSession):

        res = await db.execute(select(Exam))
        return res.scalars().all()

    async def update_status(self, exam_id, status, db: AsyncSession):

        res = await db.execute(
            select(Exam).where(Exam.id == exam_id)
        )
        exam = res.scalar_one_or_none()

        if not exam:
            return None

        exam.status = status
        await db.flush()
        return exam

    # ---------------- STUDENT ---------------- #

    async def get_active_exams(self, db: AsyncSession):

        res = await db.execute(
            select(Exam).where(Exam.status == "active")
        )
        return res.scalars().all()

    async def get_exam(self, exam_id, db: AsyncSession):

        res = await db.execute(
            select(Exam).where(Exam.id == exam_id)
        )
        return res.scalar_one_or_none()

    # ---------------- HELPERS ---------------- #

    def _flatten_questions(self, data):

        qlist = []

        # NEET
        if "subjects" in data:
            for subject, sdata in data["subjects"].items():
                for unit in sdata["units"]:
                    for q in unit["questions"]:
                        q["subject"] = subject
                        q["unit"] = unit["unit_name"]
                        qlist.append(q)

        # TNPSC
        elif "Subject" in data:
            for exam, blocks in data["Subject"].items():
                for paper in blocks:
                    for q in paper["questions"]:
                        q["exam"] = exam
                        q["paper"] = paper["name"]
                        qlist.append(q)

        return qlist


exam_service = ExamService()
