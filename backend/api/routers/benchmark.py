from fastapi import APIRouter
from backend.graph.tigergraph_service import TigerGraphService
from backend.policies.policy_engine import PolicyEngine
from backend.evidence.evidence_engine import EvidenceEngine
from backend.cases.case_manager import CaseManager
from backend.memory.case_memory import CaseMemory
from backend.agents.orchestrator import CaseOrchestrator
from backend.services.benchmark_service import BenchmarkService

router = APIRouter()

tg_service = TigerGraphService(demo_mode=True)
policy_engine = PolicyEngine()
evidence_engine = EvidenceEngine()
case_manager = CaseManager()
case_memory = CaseMemory()
orchestrator = CaseOrchestrator(tg_service, policy_engine, evidence_engine, case_manager, case_memory)
benchmark_service = BenchmarkService(orchestrator)

@router.post("/benchmark/run")
def run_benchmark_suite():
    return benchmark_service.run_benchmark()

@router.get("/benchmark/status")
def get_benchmark_status():
    return {"status": "READY", "cases_configured": 20}

@router.post("/benchmark/export")
def export_benchmark():
    return benchmark_service.run_benchmark()
