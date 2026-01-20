import uuid
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.week_exams.models.result_model import ExamResult


class ResultService:

    async def submit_result(self, payload, db: AsyncSession):

        score = payload.correct * 4

        result = ExamResult(
            id=str(uuid.uuid4()),
            exam_id=payload.exam_id,

            exam_type=payload.exam_type,
            exam_name=payload.exam_name,
            exam_date=payload.exam_date,

            user_id=payload.user_id,

            total_questions=payload.total_questions,
            attempted=payload.attempted,
            correct=payload.correct,
            wrong=payload.wrong,

            time_taken_seconds=payload.timeTakenSeconds,
            score=score
        )

        db.add(result)
        await db.flush()
        return result


    # 🔥 Leaderboard by exam_type + exam_id
    async def leaderboard(
        self,
        exam_type: str,
        exam_id: str,
        db: AsyncSession
    ):

        res = await db.execute(
            select(ExamResult)
            .where(
                ExamResult.exam_type == exam_type,
                ExamResult.exam_id == exam_id
            )
            .order_by(
                ExamResult.score.desc(),
                ExamResult.time_taken_seconds.asc()
            )
        )

        return res.scalars().all()


result_service = ResultService()
