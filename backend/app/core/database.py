"""Database setup with SQLite (dev) / PostgreSQL (prod)"""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.models.db_models import Base

_db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "finsentinel.db")
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"sqlite:///{_db_path}"
)

# SQLite fix for same-thread
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
    engine = create_engine(
        DATABASE_URL,
        connect_args=connect_args,
        poolclass=StaticPool,
    )
else:
    # PostgreSQL
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def create_tables():
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
