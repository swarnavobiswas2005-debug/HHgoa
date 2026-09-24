from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from pydantic import BaseModel
from datetime import datetime

from backend.graph.tigergraph_service import TigerGraphService
from backend.policies.policy_engine import PolicyEngine
from backend.evidence.evidence_engine import EvidenceEngine
from backend.cases.case_manager import CaseManager
from backend.memory.case_memory import CaseMemory
from backend.agents.orchestrator import CaseOrchestrator
from backend.models.schemas import FraudCase, EvidenceItem, TimelineEvent

router = APIRouter()

tg_service = TigerGraphService(demo_mode=True)
policy_engine = PolicyEngine()
evidence_engine = EvidenceEngine()
case_manager = CaseManager()
case_memory = CaseMemory()
orchestrator = CaseOrchestrator(tg_service, policy_engine, evidence_engine, case_manager, case_memory)

class TriggerRequest(BaseModel):
    transaction_id: str
    trigger_reason: str

class DecisionRequest(BaseModel):
    notes: str

class EvidenceSubmissionRequest(BaseModel):
    evidence_type: str
    details: Dict[str, Any]

@router.get("/investigations", response_model=List[FraudCase])
def list_investigations():
    return case_manager.list_cases()

@router.post("/investigations", response_model=FraudCase)
def trigger_investigation(req: TriggerRequest):
    case = orchestrator.run_investigation(req.transaction_id, req.trigger_reason)
    return case

@router.get("/investigations/{case_id}", response_model=FraudCase)
def get_investigation_detail(case_id: str):
    c = case_manager.get_case(case_id)
    if not c:
        raise HTTPException(status_code=404, detail="Case not found")
    return c

@router.post("/investigations/{case_id}/approve")
def approve_action(case_id: str, req: DecisionRequest):
    c = case_manager.get_case(case_id)
    if not c:
        raise HTTPException(status_code=404, detail="Case not found")
    c.approval_status = "APPROVED"
    c.status = "RESOLVED"
    c.analyst_notes = req.notes
    c.timeline.append(TimelineEvent(
        event_id=f"EVT-APP-{int(datetime.utcnow().timestamp())}",
        timestamp=datetime.utcnow().isoformat() + "Z",
        event_type="ACTION_APPROVED",
        summary=f"Analyst approved action decision. Notes: {req.notes}",
        actor="Analyst #001"
    ))
    case_manager.save_case(c)
    return {"status": "SUCCESS", "case": c}

@router.post("/investigations/{case_id}/reject")
def reject_action(case_id: str, req: DecisionRequest):
    c = case_manager.get_case(case_id)
    if not c:
        raise HTTPException(status_code=404, detail="Case not found")
    c.approval_status = "REJECTED"
    c.status = "RESOLVED"
    c.analyst_notes = req.notes
    c.timeline.append(TimelineEvent(
        event_id=f"EVT-REJ-{int(datetime.utcnow().timestamp())}",
        timestamp=datetime.utcnow().isoformat() + "Z",
        event_type="ACTION_REJECTED",
        summary=f"Analyst rejected action decision. Notes: {req.notes}",
        actor="Analyst #001"
    ))
    case_manager.save_case(c)
    return {"status": "SUCCESS", "case": c}

@router.post("/investigations/{case_id}/evidence")
def submit_additional_evidence(case_id: str, req: EvidenceSubmissionRequest):
    c = case_manager.get_case(case_id)
    if not c:
        raise HTTPException(status_code=404, detail="Case not found")
    
    new_ev = EvidenceItem(
        evidence_id=f"EV-{case_id}-SUB",
        type=req.evidence_type,
        source="Customer Out-Of-Band Verification",
        entity_id=c.customer_id,
        finding="Customer completed out-of-band SMS authentication challenge successfully.",
        relevance=0.95,
        confidence=0.98,
        timestamp=datetime.utcnow().isoformat() + "Z",
        case_id=case_id
    )
    c.evidence.append(new_ev)
    c.requested_evidence = []
    c.uncertainty = "Customer identity independently verified via step-up authentication. Uncertainty resolved."
    c.risk_level = "LOW"
    c.confidence = 0.98
    c.status = "RESOLVED"
    
    c.timeline.append(TimelineEvent(
        event_id=f"EVT-EVID-{int(datetime.utcnow().timestamp())}",
        timestamp=datetime.utcnow().isoformat() + "Z",
        event_type="EVIDENCE_RECEIVED",
        summary="Customer passed Out-Of-Band SMS challenge. Risk reassessed to LOW.",
        actor="Customer Response"
    ))
    
    case_manager.save_case(c)
    return {"status": "SUCCESS", "case": c}

@router.get("/investigations/{case_id}/graph")
def get_case_graph(case_id: str):
    return tg_service.get_subgraph_for_case(case_id)

@router.get("/investigations/{case_id}/similar-cases")
def get_similar_cases(case_id: str):
    return case_memory.find_similar_cases(case_id)
