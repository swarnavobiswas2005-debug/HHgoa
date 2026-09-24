from backend.graph.tigergraph_service import TigerGraphService
from backend.policies.policy_engine import PolicyEngine
from backend.evidence.evidence_engine import EvidenceEngine
from backend.cases.case_manager import CaseManager
from backend.memory.case_memory import CaseMemory
from backend.agents.orchestrator import CaseOrchestrator

def test_full_e2e_investigation_lifecycle(tmp_path):
    db_file = str(tmp_path / "test_fraud.db")
    tg = TigerGraphService(demo_mode=True)
    pe = PolicyEngine()
    ee = EvidenceEngine()
    cm = CaseManager(db_path=db_file)
    mem = CaseMemory(db_path=db_file)
    orch = CaseOrchestrator(tg, pe, ee, cm, mem)

    case = orch.run_investigation("TX-9999", "E2E Integration Test Trigger")
    assert case.case_id == "CASE-9999"
    assert case.status in ["PENDING_APPROVAL", "RESOLVED"]
    assert len(case.evidence) > 0
    assert len(case.actions) > 0
