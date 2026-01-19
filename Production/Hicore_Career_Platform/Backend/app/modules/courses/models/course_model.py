from sqlalchemy import Column, String, Float
from app.core.database.config import Base

class Course(Base):
    __tablename__ = "courses"

    course_id = Column(String(20), primary_key=True)
    title = Column(String(255))
    description1 = Column(String(500))
    highlight = Column(String(255))
    description2 = Column(String(500))
    closing = Column(String(255))
    rating = Column(Float)
    price = Column(Float)
    offer_price = Column(Float)
    image_path = Column(String(255))
    background_path = Column(String(255))
    module_path = Column(String(255))
    full_course_path = Column(String(255))
