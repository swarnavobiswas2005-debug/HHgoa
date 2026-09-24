from fastapi import APIRouter
from datetime import datetime

router = APIRouter()

@router.get("/health")
def health_check():
    return {
        "status": "HEALTHY",
        "service": "Agentic Fraud Investigation Platform",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }
