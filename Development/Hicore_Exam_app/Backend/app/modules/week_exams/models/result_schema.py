from pydantic import BaseModel

class ExamResultCreate(BaseModel):

    # 🔥 NEW
    exam_id: str

    exam_type: str
    exam_name: str
    exam_date: str
    user_id: str

    total_questions: int
    attempted: int
    correct: int
    wrong: int

    timeTakenSeconds: int
