import logging
import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from backend.config.settings import settings
from backend.api.routers import health, system, policies, patterns, investigations, benchmark
from backend.graph.tigergraph_service import TigerGraphService
from backend.policies.policy_engine import PolicyEngine
from backend.evidence.evidence_engine import EvidenceEngine
from backend.cases.case_manager import CaseManager
from backend.memory.case_memory import CaseMemory
from backend.agents.orchestrator import CaseOrchestrator

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing AEGIS Fraud Platform Backend Services...")
    # Seed initial demo cases
    cm = CaseManager()
    if len(cm.list_cases()) == 0:
        logger.info("Initializing production investigation case records...")
        tg = TigerGraphService(demo_mode=settings.demo_mode)
        pe = PolicyEngine()
        ee = EvidenceEngine()
        mem = CaseMemory()
        orch = CaseOrchestrator(tg, pe, ee, cm, mem)
        orch.run_investigation("TX-1001", "Shared device ring fraud alert ($4,950)", customer_id="CUS-1001", amount=4950.0)
        orch.run_investigation("TX-1002", "High velocity transfer behind VPN ($8,900)", customer_id="CUS-1002", amount=8900.0)
        orch.run_investigation("TX-1003", "Standard POS retail clearance ($45.00)", customer_id="CUS-1003", amount=45.0)
        
        from backend.services.benchmark_service import BenchmarkService
        bs = BenchmarkService(orch)
        bs.run_benchmark()
    logger.info(f"Platform backend started successfully on port {settings.port}. Production Engine Active (Demo Mode: {settings.demo_mode})")
    yield
    logger.info("Shutting down platform backend services...")

app = FastAPI(
    title="AEGIS Fraud SOC — Agentic Intelligence Platform API",
    description="Production-grade API for agentic fraud investigation, GSQL graph traversal, GraphRAG, and deterministic policy enforcement.",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api", tags=["Health"])
app.include_router(system.router, prefix="/api", tags=["System"])
app.include_router(policies.router, prefix="/api", tags=["Policies"])
app.include_router(patterns.router, prefix="/api", tags=["Patterns"])
app.include_router(investigations.router, prefix="/api", tags=["Investigations"])
app.include_router(benchmark.router, prefix="/api", tags=["Benchmark"])

# Mount static frontend dist folder if built
dist_dir = os.path.join(os.path.dirname(__file__), "frontend", "dist")
if os.path.exists(dist_dir):
    app.mount("/", StaticFiles(directory=dist_dir, html=True), name="static")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=settings.port, reload=True)
