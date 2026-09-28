import os
import sqlalchemy
from dotenv import load_dotenv

load_dotenv()

# Uses DATABASE_URL from your .env
db_url = os.getenv("DATABASE_URL")
if not db_url:
    raise RuntimeError("DATABASE_URL is not set. Add it to your .env file.")

if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

engine = sqlalchemy.create_engine(db_url)

with engine.connect() as conn:
    result = conn.execute(sqlalchemy.text("SELECT * FROM rsvps;"))
    rows = result.fetchall()
    
    print(f"\nTotal RSVPs: {len(rows)}")
    print("-" * 60)
    for row in rows:
        print(row)
    print("-" * 60)