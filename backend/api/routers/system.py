from fastapi import APIRouter
from backend.config.settings import settings

router = APIRouter()

@router.get("/system/status")
def system_status():
    return {
        "status": "OPERATIONAL",
        "demo_mode": settings.demo_mode,
        "tigergraph": {
            "status": "CONNECTED_LOCAL_ADAPTER" if settings.demo_mode else "ONLINE",
            "host": settings.tigergraph_host,
            "graph_name": settings.tigergraph_graph_name
        },
        "llm": {
            "provider": "openai",
            "model": settings.llm_model
        },
        "mcp_server": {
            "status": "ACTIVE",
            "url": "http://localhost:8001"
        },
        "graphrag_engine": {
            "status": "READY"
        },
        "case_manager": {
            "database": "SQLite Persistent Storage",
            "total_cases": 1
        }
    }
