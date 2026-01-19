from sqlalchemy import Column, Integer, String, Float
from app.core.database.config import Base


class Find_my_course(Base):
    __tablename__ = "find_my_courses_db_data"

    id = Column(Integer, primary_key=True, index=True)

    course_id = Column(String(150), unique=True, index=True, nullable=False)

    # Main metadata
    domain = Column(String(200), nullable=False, index=True)
    duration_months = Column(Integer, nullable=False, index=True)

    title = Column(String(300), nullable=False)
    description1 = Column(String(2000), nullable=False)
    highlight = Column(String(2000), nullable=False)
    description2 = Column(String(3000), nullable=False)
    closing = Column(String(2000), nullable=False)

    rating = Column(Float, nullable=False)
    price = Column(Float, nullable=False)
    offer_price = Column(Float, nullable=False)

    # File paths
    image_file_path = Column(String(500), nullable=False)
    background_file_path = Column(String(500), nullable=False)
    module_file_path = Column(String(500), nullable=False)
    full_file_path = Column(String(500), nullable=False)
