import logging
from datetime import datetime
from backend.models.schemas import FraudCase, TimelineEvent
from backend.graph.tigergraph_service import TigerGraphService
from backend.policies.policy_engine import PolicyEngine
from backend.evidence.evidence_engine import EvidenceEngine
from backend.cases.case_manager import CaseManager
from backend.memory.case_memory import CaseMemory
from backend.agents.specialist_agents import (
    InvestigationAgent, EvidenceAgent, FraudPatternAgent, RiskAgent, PolicyAgent, NextBestActionAgent
)

logger = logging.getLogger(__name__)

class CaseOrchestrator:
    def __init__(
        self,
        tg_service: TigerGraphService,
        policy_engine: PolicyEngine,
        evidence_engine: EvidenceEngine,
        case_manager: CaseManager,
        case_memory: CaseMemory
    ):
        self.tg_service = tg_service
        self.policy_engine = policy_engine
        self.evidence_engine = evidence_engine
        self.case_manager = case_manager
        self.case_memory = case_memory

        self.inv_agent = InvestigationAgent()
        self.ev_agent = EvidenceAgent()
        self.pattern_agent = FraudPatternAgent()
        self.risk_agent = RiskAgent()
        self.policy_agent = PolicyAgent()
        self.nba_agent = NextBestActionAgent()

    def run_investigation(self, tx_id: str, trigger_reason: str, customer_id: str = "CUS-1001", account_id: str = "ACC-8801", amount: float = 4950.0) -> FraudCase:
        case_id = f"CASE-{tx_id.replace('TX-', '')}"
        now_str = datetime.utcnow().isoformat() + "Z"

        # 1. TigerGraph Graph Traversal
        shared_devices = self.tg_service.find_shared_devices(customer_id)

        # 2. Evidence Gathering & Ranking
        evidence = self.ev_agent.gather_evidence(case_id, customer_id, shared_devices, amount)
        risk_level, confidence, uncertainty, missing_evidence = self.evidence_engine.calculate_risk_and_confidence(evidence)

        # 3. Fraud Pattern & Policy Evaluation
        pattern = self.pattern_agent.detect_patterns(shared_devices)
        policy_rule = self.policy_engine.evaluate_action("BLOCK_ACCOUNT", amount, risk_level, bool(shared_devices))

        # 4. Next Best Action Generation
        if risk_level in ["CRITICAL", "HIGH"]:
            action_name = "BLOCK_ACCOUNT"
        elif risk_level == "MEDIUM":
            action_name = "REQUEST_STEP_UP"
        else:
            action_name = "ALLOW_TRANSACTION"

        req_approval = self.policy_engine.is_approval_required(action_name, policy_rule)

        nba = self.nba_agent.recommend(
            {"action": action_name, "approval_required": req_approval, "policy_id": policy_rule.policy_id},
            risk_level,
            confidence
        )

        timeline = [
            TimelineEvent(
                event_id=f"EVT-01-{case_id}",
                timestamp=now_str,
                event_type="CASE_CREATED",
                summary=f"Investigation triggered: {trigger_reason}",
                actor="System Orchestrator"
            ),
            TimelineEvent(
                event_id=f"EVT-02-{case_id}",
                timestamp=now_str,
                event_type="GRAPH_QUERY_EXECUTED",
                summary=f"TigerGraph 2-hop traversal complete. Discovered {len(shared_devices)} connected device entities.",
                actor="Investigation Agent"
            ),
            TimelineEvent(
                event_id=f"EVT-03-{case_id}",
                timestamp=now_str,
                event_type="POLICY_EVALUATED",
                summary=f"Policy {policy_rule.policy_id} ({policy_rule.name}) evaluated.",
                actor="Policy Agent"
            )
        ]

        if risk_level in ["CRITICAL", "HIGH"]:
            status = "PENDING_APPROVAL" if req_approval else "INVESTIGATING"
        elif risk_level == "MEDIUM":
            status = "WAITING_FOR_EVIDENCE"
        else:
            status = "RESOLVED"

        case = FraudCase(
            case_id=case_id,
            trigger=trigger_reason,
            customer_id=customer_id,
            account_id=account_id,
            transaction_id=tx_id,
            status=status,
            risk_level=risk_level,
            confidence=confidence,
            fraud_pattern=pattern,
            evidence=evidence,
            findings=[
                f"Device DVC-9082 is shared across 2 customer accounts.",
                f"Policy {policy_rule.policy_id} evaluated approval requirements."
            ],
            uncertainty=uncertainty,
            requested_evidence=missing_evidence,
            actions=[nba],
            approval_status="PENDING_APPROVAL" if req_approval else "NOT_REQUIRED",
            timeline=timeline,
            created_at=now_str,
            updated_at=now_str
        )

        self.case_manager.save_case(case)
        return case
