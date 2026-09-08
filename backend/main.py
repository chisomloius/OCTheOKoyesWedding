import csv
import io
import logging
import os
from datetime import datetime


from fastapi import FastAPI, HTTPException, Depends, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from config import config, engine, get_db, Base
from models import RSVP, GiftRegistry, WeddingEvent
from schemas import (
    RSVPCreate, RSVPResponse, RSVPList,
    GiftRegistryCreate, GiftRegistryUpdate, GiftRegistryResponse, GiftRegistryList,
    WeddingEventCreate, WeddingEventResponse, WeddingEventList,
    HealthResponse
)

# Create tables
Base.metadata.create_all(bind=engine)

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI
app = FastAPI(
    title="Wedding Website API",
    description="API for Chisom & Onyinye's wedding - #OCtheOkoyes",
    version="1.0.0"
)

frontend_url = os.getenv('FRONTEND_URL', 'https://octheokoyes.netlify.app').rstrip('/')

print(f"🔧 CORS enabled for: {frontend_url}")  # Debug log

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        frontend_url,
        "http://localhost:3000",  # For local testing
        "https://octheokoyes.netlify.app"  # For production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# ===================================
# HEALTH CHECK ENDPOINTS
# ===================================

@app.get("/", response_model=dict)
async def root():
    """Welcome endpoint"""
    return {
        "message": "Wedding Website API - #OCtheOkoyes26",
        "version": "1.0.0",
        "endpoints": {
            "docs": "/docs",
            "health": "/health",
            "rsvp": {
                "create": "POST /api/rsvp",
                "list": "GET /api/rsvp",
                "detail": "GET /api/rsvp/{id}"
            },
            "registry": {
                "list": "GET /api/registry",
                "update": "PATCH /api/registry/{id}"
            },
            "events": {
                "list": "GET /api/events"
            }
        }
    }

@app.get("/health", response_model=HealthResponse)
async def health_check(db: Session = Depends(get_db)):
    """Health check endpoint with database connection test"""
    try:
        # Test database connection
        db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        logger.error(f"Database connection failed: {str(e)}")
        db_status = "disconnected"
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    return HealthResponse(
        status="ok",
        message="Server is running and healthy",
        database=db_status
    )

# ===================================
# RSVP ENDPOINTS
# ===================================

@app.post("/api/rsvp", response_model=RSVPResponse, status_code=status.HTTP_201_CREATED)
async def create_rsvp(rsvp: RSVPCreate, db: Session = Depends(get_db)):
    """Submit RSVP - saves to PostgreSQL database"""
    try:
        # Check if email already exists
        existing = db.query(RSVP).filter(RSVP.email == rsvp.email).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This email has already submitted an RSVP"
            )
        
        # Create new RSVP
        db_rsvp = RSVP(
            name=rsvp.name,
            email=rsvp.email,
            phone=rsvp.phone,
            attendance=rsvp.attendance,
            guests=rsvp.guests,
            message=rsvp.message
        )
        
        db.add(db_rsvp)
        db.commit()
        db.refresh(db_rsvp)
        
        logger.info(f"RSVP received from {rsvp.name} ({rsvp.email})")
        
        return db_rsvp
        
    except IntegrityError as e:
        db.rollback()
        logger.error(f"Database integrity error: {str(e)}")
        raise HTTPException(status_code=400, detail="Error saving RSVP")
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating RSVP: {str(e)}")
        raise HTTPException(status_code=500, detail="Error processing RSVP")

@app.get("/api/rsvp", response_model=RSVPList)
async def list_rsvps(db: Session = Depends(get_db)):
    """Get all RSVPs"""
    try:
        rsvps = db.query(RSVP).all()
        return RSVPList(
            total=len(rsvps),
            rsvps=[RSVPResponse.model_validate(rsvp) for rsvp in rsvps]
        )
    except Exception as e:
        logger.error(f"Error fetching RSVPs: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching RSVPs")

@app.get("/api/rsvp/{rsvp_id}", response_model=RSVPResponse)
async def get_rsvp(rsvp_id: int, db: Session = Depends(get_db)):
    """Get specific RSVP by ID"""
    try:
        rsvp = db.query(RSVP).filter(RSVP.id == rsvp_id).first()
        if not rsvp:
            raise HTTPException(status_code=404, detail="RSVP not found")
        return rsvp
    except Exception as e:
        logger.error(f"Error fetching RSVP: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching RSVP")
    
@app.get("/api/admin/rsvps/export")
def export_rsvps_csv(
    token: str = Query(..., description="Admin authorization token"),
    db: Session = Depends(get_db)
):
    admin_token = os.getenv("ADMIN_EXPORT_TOKEN", "octheokoyes26")
    if token != admin_token:
        raise HTTPException(status_code=401, detail="Unauthorized")

    # Order by ID instead of created_at
    records = db.query(RSVP).order_by(RSVP.id.desc()).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Name", "Email", "Phone", "Attendance", "Guests", "Message", "Submitted At"])

    for r in records:
        # Fallback safely if neither created_at nor timestamp exists on the model
        submission_time = getattr(r, "created_at", getattr(r, "timestamp", "N/A"))
        writer.writerow([r.id, r.name, r.email, r.phone, r.attendance, r.guests, r.message, submission_time])

    output.seek(0)
    filename = f"rsvps_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.csv"
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
# ===================================
# GIFT REGISTRY ENDPOINTS
# ===================================

@app.get("/api/registry", response_model=GiftRegistryList)
async def list_registry(db: Session = Depends(get_db)):
    """Get all gift registry items"""
    try:
        items = db.query(GiftRegistry).all()
        return GiftRegistryList(
            total=len(items),
            items=[GiftRegistryResponse.model_validate(item) for item in items]
        )
    except Exception as e:
        logger.error(f"Error fetching registry: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching registry")

@app.patch("/api/registry/{item_id}", response_model=GiftRegistryResponse)
async def update_registry_item(
    item_id: int,
    update: GiftRegistryUpdate,
    db: Session = Depends(get_db)
):
    """Update gift registry item (mark as completed, add contribution)"""
    try:
        item = db.query(GiftRegistry).filter(GiftRegistry.id == item_id).first()
        if not item:
            raise HTTPException(status_code=404, detail="Registry item not found")
        
        if update.contributed_by is not None:
            setattr(item, "contributed_by", update.contributed_by)
        if update.contribution_amount is not None:
            setattr(item, "contribution_amount", update.contribution_amount)
        if update.is_completed is not None:
            setattr(item, "is_completed", update.is_completed)
        
        db.commit()
        db.refresh(item)
        
        logger.info(f"Registry item {item_id} updated")
        return item
        
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating registry item: {str(e)}")
        raise HTTPException(status_code=500, detail="Error updating registry item")

# ===================================
# WEDDING EVENTS ENDPOINTS
# ===================================

@app.get("/api/events", response_model=WeddingEventList)
async def list_events(db: Session = Depends(get_db)):
    """Get all wedding events"""
    try:
        events = db.query(WeddingEvent).all()
        return WeddingEventList(
            total=len(events),
            events=[WeddingEventResponse.model_validate(event) for event in events]
        )
    except Exception as e:
        logger.error(f"Error fetching events: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching events")

# ===================================
# ERROR HANDLERS
# ===================================

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return {
        "success": False,
        "error": exc.detail,
        "status_code": exc.status_code
    }

# ===================================
# RUN SERVER
# ===================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=config.API_HOST,
        port=config.API_PORT,
        reload=config.API_RELOAD
    )