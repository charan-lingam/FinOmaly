from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

# Create the SQLAlchemy Engine
# pool_pre_ping=True helps handle dropped connections gracefully
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    # Supabase standard connection pool size limits. Adjust if needed later.
    pool_size=10,
    max_overflow=20,
)

# SessionLocal class will act as a factory for database sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """
    Dependency generator for FastAPI endpoints.
    Yields a database session and ensures it is closed after the request.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

