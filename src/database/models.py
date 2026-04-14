from sqlalchemy import Column, Integer, String, DateTime, Date
from datetime import datetime
from src.database.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Tracking Stats
    documents_analyzed = Column(Integer, default=0)
    flashcards_generated = Column(Integer, default=0)
    study_guides_created = Column(Integer, default=0)
    
    # --- NEW STREAK COLUMNS ---
    current_streak = Column(Integer, default=0)
    last_login_date = Column(Date, nullable=True)