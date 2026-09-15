from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func

from database import Base


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    filename = Column(String(255), nullable=False)

    resume_text = Column(Text, nullable=False)

    ats_score = Column(Integer, nullable=True)

    skills = Column(Text, nullable=True)

    strengths = Column(Text, nullable=True)

    weaknesses = Column(Text, nullable=True)

    missing_skills = Column(Text, nullable=True)

    suggestions = Column(Text, nullable=True)

    recommended_roles = Column(Text, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )