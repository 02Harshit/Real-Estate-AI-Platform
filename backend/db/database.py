import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

load_dotenv()

# Get the NeonDB URL from .env (e.g., postgresql://user:pass@host/dbname?sslmode=require)
# Docker's --env-file keeps surrounding quotes, so trim them if present.
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "").strip().strip("\"'")

if not SQLALCHEMY_DATABASE_URL:
    raise ValueError("DATABASE_URL is missing or empty.")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 
