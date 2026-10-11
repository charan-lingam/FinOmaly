from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api import auth
from app.api.routes import companies, statements, analyses, trends, health

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_PREFIX}/openapi.json"
)

# Set all CORS enabled origins
if settings.CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_origin_regex=r"https://finomaly.*\.vercel\.app",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(health.router, tags=["health"])
app.include_router(auth.router, prefix=settings.API_PREFIX, tags=["auth"])
app.include_router(companies.router, prefix=f"{settings.API_PREFIX}/companies", tags=["companies"])
app.include_router(statements.router, prefix=f"{settings.API_PREFIX}/statements", tags=["statements"])
app.include_router(analyses.router, prefix=f"{settings.API_PREFIX}/analyses", tags=["analyses"])
app.include_router(trends.router, prefix=f"{settings.API_PREFIX}/trends", tags=["trends"])

@app.get("/")
def root():
    return {"message": "FinOmaly API Backend is running"}
