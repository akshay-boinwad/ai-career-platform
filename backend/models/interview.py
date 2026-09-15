from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func

from database import Base


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    job_id = Column(
        Integer,
        ForeignKey("jobs.id"),
        nullable=True
    )

    role = Column(
        String(255),
        nullable=False
    )

    difficulty = Column(
        String(50),
        nullable=False,
        default="Medium"
    )

    question = Column(
        Text,
        nullable=False
    )

    answer = Column(
        Text,
        nullable=True
    )

    score = Column(
        Integer,
        nullable=True
    )

    feedback = Column(
        Text,
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )