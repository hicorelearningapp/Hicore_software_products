from sqlalchemy import Column, Integer, String, DateTime, func, UniqueConstraint
from app.core.database.config import Base

class Access(Base):
    __tablename__ = "accesss"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    item_type = Column(String, nullable=False)    # e.g., 'course', 'lesson', 'module'
    item_id = Column(String, nullable=False)      # can be string or numeric identifier
    status = Column(String, default="granted")
    created_at = Column(DateTime, server_default=func.now())

    __table_args__ = (
        UniqueConstraint("user_id", "item_type", "item_id", name="_user_item_uc"),
    )
