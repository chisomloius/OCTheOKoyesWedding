from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text
from sqlalchemy.sql import func
from datetime import datetime
from config import Base

#======================
# Database Models

class RSVP(Base):
    """RSVP Database Model"""
    __tablename__ = "rsvps"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    email = Column(String(255), nullable=False, unique=True, index=True)
    phone = Column(String(20), nullable=False)
    attendance = Column(String(50), nullable=False)  # yes, maybe, no
    guests = Column(String(10), nullable=True)
    message = Column(Text, nullable=True)
    submitted_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    def __repr__(self):
        return f"<RSVP(id={self.id}, name={self.name}, attendance={self.attendance})>"

class GiftRegistry(Base):
    """Gift Registry Database Model"""
    __tablename__ = "gift_registry"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    image = Column(String(500), nullable=True)
    contributed_by = Column(String(255), nullable=True)
    contribution_amount = Column(Integer, nullable=True)  # in cents
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    def __repr__(self):
        return f"<GiftRegistry(id={self.id}, name={self.name})>"

class WeddingEvent(Base):
    """Wedding Events Database Model"""
    __tablename__ = "wedding_events"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    location = Column(String(500), nullable=False)
    event_date = Column(DateTime(timezone=True), nullable=False)
    description = Column(Text, nullable=True)
    latitude = Column(String(50), nullable=True)
    longitude = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    def __repr__(self):
        return f"<WeddingEvent(id={self.id}, name={self.name})>"