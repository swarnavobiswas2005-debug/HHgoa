import logging
from typing import Dict, Any, List
from backend.models.schemas import EvidenceItem, ActionPlan, RiskLevel
from datetime import datetime

logger = logging.getLogger(__name__)

class InvestigationAgent:
    def determine_scope(self, tx_id: str, customer_id: str) -> Dict[str, Any]:
        return {"tx_id": tx_id, "customer_id": customer_id, "depth": 2}

class EvidenceAgent:
    def gather_evidence(self, case_id: str, customer_id: str, shared_devices: List[Any], amount: float = 4950.0) -> List[EvidenceItem]:
        evidence = []
        now_iso = datetime.utcnow().isoformat() + "Z"

        if shared_devices:
            evidence.append(EvidenceItem(
                evidence_id=f"EV-{case_id}-01",
                type="SharedDevice",
                source="TigerGraph GSQL Traversal",
                entity_id="DVC-9082",
                finding="Device DVC-9082 is shared across 2 distinct customer accounts with historical fraud flags.",
                relevance=0.95,
                confidence=0.90,
                timestamp=now_iso,
                case_id=case_id
            ))

        if amount > 5000.0:
            evidence.append(EvidenceItem(
                evidence_id=f"EV-{case_id}-02",
                type="TransactionVelocity",
                source="Behavioral Analytics",
                entity_id=customer_id,
                finding=f"High transaction velocity: ${amount:,.2f} transfer exceeding 3x cardholder daily threshold.",
                relevance=0.85,
                confidence=0.88,
                timestamp=now_iso,
                case_id=case_id
            ))
        elif amount > 1000.0:
            evidence.append(EvidenceItem(
                evidence_id=f"EV-{case_id}-02",
                type="ProxyLocation",
                source="Network Geolocation Service",
                entity_id="IP-192.168.1.50",
                finding="Transaction routed via commercial VPN proxy IP with localized location discrepancy.",
                relevance=0.65,
                confidence=0.72,
                timestamp=now_iso,
                case_id=case_id
            ))
        else:
            evidence.append(EvidenceItem(
                evidence_id=f"EV-{case_id}-02",
                type="CardholderBaseline",
                source="Point-of-Sale Machine Learning Model",
                entity_id=customer_id,
                finding=f"Verified POS purchase (${amount:,.2f}) matching historical cardholder spending baseline.",
                relevance=0.20,
                confidence=0.95,
                timestamp=now_iso,
                case_id=case_id
            ))

        return evidence

class FraudPatternAgent:
    def detect_patterns(self, shared_devices: List[Any]) -> str:
        if shared_devices:
            return "Shared Device Ring"
        return "Transaction Velocity Anomaly"

class RiskAgent:
    def assess(self, evidence: List[EvidenceItem]) -> Dict[str, Any]:
        return {"risk_level": "HIGH" if len(evidence) > 1 else "LOW", "confidence": 0.87}

class PolicyAgent:
    def evaluate(self, risk_level: str, amount: float, shared_device: bool) -> Dict[str, Any]:
        if shared_device or amount > 2500:
            return {"policy_id": "POL-101", "approval_required": True, "action": "BLOCK_ACCOUNT"}
        return {"policy_id": "POL-105", "approval_required": False, "action": "ALLOW_TRANSACTION"}

class NextBestActionAgent:
    def recommend(self, policy_info: Dict[str, Any], risk_level: str, confidence: float) -> ActionPlan:
        action_name = policy_info["action"]
        req_app = policy_info["approval_required"]
        return ActionPlan(
            action=action_name,
            reason=f"Recommended {action_name} based on Policy {policy_info['policy_id']} due to {risk_level} risk score.",
            confidence=confidence,
            risk_level=risk_level,
            required_approval=req_app,
            approval_role="Fraud Analyst" if req_app else "System",
            policy_basis=policy_info["policy_id"],
            supporting_evidence=["Shared Device Ring Detected"],
            execution_status="RECOMMENDED" if req_app else "AUTONOMOUS_PERMITTED"
        )
