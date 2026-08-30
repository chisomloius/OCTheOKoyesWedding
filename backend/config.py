import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Google Sheets not to be used again and to be replaced.
    # GOOGLE_SHEETS_CREDENTIALS = os.getenv('GOOGLE_SHEETS_CREDENTIALS')
    # SPREADSHEET_ID = os.getenv('SPREADSHEET_ID')
    # RSVP_SHEET_NAME = os.getenv('RSVP_SHEET_NAME', 'RSVP')
    # REGISTRY_SHEET_NAME = os.getenv('REGISTRY_SHEET_NAME', 'Registry')
    
    # API
    API_HOST = os.getenv('API_HOST', '0.0.0.0')
    API_PORT = int(os.getenv('API_PORT', 8000))
    API_RELOAD = os.getenv('API_RELOAD', 'True').lower() == 'true'
    
    # CORS
    FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')
    BACKEND_URL = os.getenv('BACKEND_URL', 'http://localhost:8000')
    
    # Environment
    ENVIRONMENT = os.getenv('ENVIRONMENT', 'development')

config = Config()