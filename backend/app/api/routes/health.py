from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "FinOmaly API",
        "version": "1.0.0"
    }

@router.get("/ping")
def ping():
    return {"ping": "pong"}
