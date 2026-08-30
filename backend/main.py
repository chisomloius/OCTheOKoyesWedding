from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize FastAPI
app = FastAPI(
    title="Wedding Website API",
    description="API for Chisom & Onyinye's wedding",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===================================
# MODELS
# ===================================

class RSVPRequest(BaseModel):
    name: str
    email: EmailStr
    phone: str
    attendance: str  # yes, maybe, no
    guests: str
    message: str = ""

class RegistryItem(BaseModel):
    id: int
    name: str
    category: str
    icon: str

# ===================================
# GOOGLE SHEETS INTEGRATION (Simple Version)
# ===================================

def log_rsvp_to_sheet(rsvp_data: dict):
    """
    Log RSVP data to Google Sheets
    For now, we'll just print it. You can integrate with Google Sheets API later.
    """
    try:
        # TODO: Integrate with Google Sheets API
        # For testing, just print the data
        print(f"\n{'='*50}")
        print("RSVP RECEIVED:")
        print(f"Name: {rsvp_data['name']}")
        print(f"Email: {rsvp_data['email']}")
        print(f"Phone: {rsvp_data['phone']}")
        print(f"Attendance: {rsvp_data['attendance']}")
        print(f"Guests: {rsvp_data['guests']}")
        print(f"Message: {rsvp_data['message']}")
        print(f"Submitted: {datetime.now().isoformat()}")
        print(f"{'='*50}\n")
        return True
    except Exception as e:
        print(f"Error logging RSVP: {str(e)}")
        return False

# ===================================
# ENDPOINTS
# ===================================

@app.get("/")
async def root():
    """Welcome endpoint"""
    return {
        "message": "Wedding Website API",
        "endpoints": {
            "docs": "/docs",
            "health": "/health",
            "rsvp": "/api/rsvp",
            "registry": "/api/registry"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "message": "Server is running"}

# ===================================
# RSVP ENDPOINT
# ===================================

@app.post("/api/rsvp")
async def submit_rsvp(rsvp: RSVPRequest):
    """
    Submit RSVP information
    
    Validates guest information and logs to Google Sheets
    """
    try:
        # Validate required fields
        if not rsvp.name.strip():
            raise HTTPException(status_code=400, detail="Name is required")
        if not rsvp.email:
            raise HTTPException(status_code=400, detail="Email is required")
        if not rsvp.phone.strip():
            raise HTTPException(status_code=400, detail="Phone is required")
        if not rsvp.attendance:
            raise HTTPException(status_code=400, detail="Attendance status is required")

        # Prepare RSVP data
        rsvp_data = {
            "name": rsvp.name.strip(),
            "email": rsvp.email,
            "phone": rsvp.phone.strip(),
            "attendance": rsvp.attendance,
            "guests": rsvp.guests,
            "message": rsvp.message.strip() if rsvp.message else "",
            "timestamp": datetime.now().isoformat()
        }

        # Log to Google Sheets (or console for now)
        log_rsvp_to_sheet(rsvp_data)

        return {
            "success": True,
            "message": "RSVP submitted successfully!",
            "data": {
                "name": rsvp_data["name"],
                "email": rsvp_data["email"],
                "timestamp": rsvp_data["timestamp"]
            }
        }

    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Error processing RSVP: {str(e)}")
        raise HTTPException(status_code=500, detail="Error processing RSVP")

# ===================================
# REGISTRY ENDPOINT
# ===================================

@app.get("/api/registry")
async def get_registry():
    """
    Get wedding gift registry items
    """
    try:
        registry_items = [
            {
                "id": 1,
                "name": "Refrigerator",
                "category": "Appliances",
                "icon": "❄️"
            },
            {
                "id": 2,
                "name": "Generator",
                "category": "Power",
                "icon": "⚡"
            },
            {
                "id": 3,
                "name": "Washing Machine",
                "category": "Appliances",
                "icon": "🔄"
            },
            {
                "id": 4,
                "name": "Microwave",
                "category": "Kitchen",
                "icon": "🍳"
            },
            {
                "id": 5,
                "name": "Air Conditioner",
                "category": "Climate",
                "icon": "❄️"
            },
            {
                "id": 6,
                "name": "Home Theater System",
                "category": "Entertainment",
                "icon": "🎬"
            },
            {
                "id": 7,
                "name": "Dinning Set",
                "category": "Furniture",
                "icon": "🎣"
            }
        ]
        
        return {
            "success": True,
            "items": registry_items,
            "total": len(registry_items)
        }

    except Exception as e:
        print(f"Error fetching registry: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching registry")

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
        host="0.0.0.0",
        port=8000,
        reload=True
    )