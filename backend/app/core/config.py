from pathlib import Path
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

# backend/app/core/config.py  →  go up 3 levels  →  backend/
_KEYS_ENV = Path(__file__).parent.parent.parent / "keys.env"


class Settings(BaseSettings):
    """
    Application settings loaded from keys.env.
    Pydantic Settings validates types and raises clear errors
    if required variables are missing.
    """

    model_config = SettingsConfigDict(
        env_file=_KEYS_ENV,           # loaded from the computed absolute path
        env_file_encoding="utf-8",
        extra="ignore",               # ignore unknown env vars silently
    )

    # ── Database ───────────────────────────────────────────
    DATABASE_URL: str

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def fix_driver_prefix(cls, v: str) -> str:
        """
        SQLAlchemy requires the psycopg3 driver prefix.
        Automatically converts:
          postgresql://  →  postgresql+psycopg://
          postgres://    →  postgresql+psycopg://   (Render / Heroku style)
        so the value in keys.env can use the standard URL format.
        """
        if v.startswith("postgres://"):
            return v.replace("postgres://", "postgresql+psycopg://", 1)
        if v.startswith("postgresql://"):
            return v.replace("postgresql://", "postgresql+psycopg://", 1)
        return v  # already has the correct prefix

    # ── Project metadata ───────────────────────────────────
    PROJECT_NAME: str = "FinOmaly"
    VERSION: str = "0.3.0"
    API_PREFIX: str = "/api/v1"

    # ── CORS ───────────────────────────────────────────────
    # Comma-separated list of allowed frontend origins.
    # Override in keys.env when deploying (e.g. your Vercel URL).
    CORS_ORIGINS: str = "http://localhost:5173"

    @property
    def cors_origins_list(self) -> list[str]:
        """Return CORS_ORIGINS as a list for FastAPI middleware."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]


# Single shared instance — import this everywhere in the app:
#   from app.core.config import settings
settings = Settings()
