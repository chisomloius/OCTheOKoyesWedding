# import os
# from dotenv import load_dotenv
# from sqlalchemy import create_engine
# from sqlalchemy.orm import declarative_base, sessionmaker

# load_dotenv()

# class Config:
#     # API
#     API_HOST = os.getenv('API_HOST', '0.0.0.0')
#     API_PORT = int(os.getenv('API_PORT', 8000))
#     API_RELOAD = os.getenv('API_RELOAD', 'True').lower() == 'true'
    
#     # CORS
#     # FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')
#     # BACKEND_URL = os.getenv('BACKEND_URL', 'http://localhost:8000')
    
#     # CORS - with proper defaults
#     FRONTEND_URL = os.getenv('FRONTEND_URL', 'https://octheokoyes.netlify.app')
#     BACKEND_URL = os.getenv('BACKEND_URL', 'https://octheokoyesweddingapi.onrender.com')
    
#     # Environment
#     # ENVIRONMENT = os.getenv('ENVIRONMENT', 'development')
#     ENVIRONMENT = os.getenv('ENVIRONMENT', 'production')  # Change to 'production' for deployment

    
#     # Database
#     DATABASE_URL = os.getenv(
#         'DATABASE_URL',
#         # 'postgresql://rsvpoctheokoyedb_user:tXWouKUSlSWyHflrEGdfZUmKa8hfH7Uo@dpg-daa9qfajnfac73fumrcg-a.oregon-postgres.render.com/rsvpoctheokoyedb'
#         'postgresql://rsvpoctheokoyedb_user:u02V6l0nzgzuy7QPdxpXgx7RPEgB39KV@dpg-datdmnl9fdbs73bbl5sg-a.oregon-postgres.render.com/rsvpoctheokoyedb2'

#     )

# config = Config()

# # Database Setup
# engine = create_engine(
#     config.DATABASE_URL,
#     pool_pre_ping=True,
#     echo=False
# )

# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# Base = declarative_base()

# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
        # db.close()

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

class Config:
    # API
    API_HOST = os.getenv('API_HOST', '0.0.0.0')
    API_PORT = int(os.getenv('API_PORT', 8000))
    API_RELOAD = os.getenv('API_RELOAD', 'False').lower() == 'true'
    
    # CORS
    FRONTEND_URL = os.getenv('FRONTEND_URL', 'https://octheokoyes.netlify.app')
    BACKEND_URL = os.getenv('BACKEND_URL', 'https://octheokoyesweddingapi.onrender.com')
    
    # Environment
    ENVIRONMENT = os.getenv('ENVIRONMENT', 'production')
    
    # Database
    DATABASE_URL: str = os.getenv('DATABASE_URL') or ""

    if not DATABASE_URL:
        raise ValueError("DATABASE_URL environment variable is not set!")

config = Config()

# Lazy load database engine to avoid import errors
_engine = None
_SessionLocal = None
Base = declarative_base()

def get_engine():
    global _engine
    if _engine is None:
        _engine = create_engine(
            config.DATABASE_URL,
            pool_pre_ping=True,
            echo=False
        )
    return _engine

def get_session_local():
    global _SessionLocal
    if _SessionLocal is None:
        _SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=get_engine())
    return _SessionLocal

@property
def engine():
    return get_engine()

def get_db():
    SessionLocal = get_session_local()
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()