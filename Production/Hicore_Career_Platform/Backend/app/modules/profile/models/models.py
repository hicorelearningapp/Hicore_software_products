from sqlalchemy import Column, Integer, JSON, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from sqlalchemy.ext.mutable import MutableDict  # ✅ important for JSON updates

from app.core.database.config import Base


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), unique=True, index=True)

    # ✅ Make JSON column mutable so in-place changes are tracked & persisted
    profile_data = Column(
        MutableDict.as_mutable(JSON),
        nullable=False,
        default={}
    )

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    # reverse relationship
    user = relationship("User", back_populates="profile")

