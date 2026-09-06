from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

# ============ RSVP Schemas ============

class RSVPCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    phone: str = Field(..., min_length=10, max_length=20)
    attendance: str = Field(..., pattern="^(yes|maybe|no)$")
    guests: Optional[str] = "1"
    message: Optional[str] = None

class RSVPResponse(RSVPCreate):
    id: int
    submitted_at: datetime
    
    class Config:
        from_attributes = True

class RSVPList(BaseModel):
    total: int
    rsvps: list[RSVPResponse]

# ============ Gift Registry Schemas ============

class GiftRegistryCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    category: str = Field(..., max_length=100)
    image: Optional[str] = None
    
class GiftRegistryUpdate(BaseModel):
    contributed_by: Optional[str] = None
    contribution_amount: Optional[int] = None
    is_completed: Optional[bool] = None

class GiftRegistryResponse(GiftRegistryCreate):
    id: int
    contributed_by: Optional[str] = None
    contribution_amount: Optional[int] = None
    is_completed: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class GiftRegistryList(BaseModel):
    total: int
    items: list[GiftRegistryResponse]

# ============ Wedding Event Schemas ============

class WeddingEventCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    location: str = Field(..., max_length=500)
    event_date: datetime
    description: Optional[str] = None
    latitude: Optional[str] = None
    longitude: Optional[str] = None

class WeddingEventResponse(WeddingEventCreate):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class WeddingEventList(BaseModel):
    total: int
    events: list[WeddingEventResponse]

# ============ Health Check ============

class HealthResponse(BaseModel):
    status: str
    message: str
    database: str