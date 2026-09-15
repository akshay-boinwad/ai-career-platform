from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func

from database import Base


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(255), nullable=False)
    company = Column(String(255), nullable=False)
    location = Column(String(255), nullable=True)

    skills = Column(Text, nullable=True)
    description = Column(Text, nullable=True)

    job_type = Column(String(100), nullable=True)
    experience = Column(String(100), nullable=True)

    # -----------------------------------------
    # LIVE JOB SOURCE
    # -----------------------------------------

    application_url = Column(
        Text,
        nullable=True
    )

    adzuna_id = Column(
        String(255),
        nullable=True,
        unique=True,
        index=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )