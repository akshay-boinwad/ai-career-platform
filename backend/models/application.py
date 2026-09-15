from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func

from database import Base


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    job_id = Column(
        Integer,
        ForeignKey("jobs.id"),
        nullable=False
    )

    status = Column(
        String(50),
        nullable=False,
        default="Applied"
    )

    applied_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )