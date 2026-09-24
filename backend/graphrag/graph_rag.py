from typing import Dict, Any
from backend.graph.tigergraph_service import TigerGraphService
from backend.policies.policy_engine import PolicyEngine

class GraphRAG:
    def __init__(self, tg_service: TigerGraphService, policy_engine: PolicyEngine):
        self.tg_service = tg_service
        self.policy_engine = policy_engine

    def assemble_grounded_context(self, customer_id: str, amount: float) -> Dict[str, Any]:
        shared_devices = self.tg_service.find_shared_devices(customer_id)
        is_shared_device = len(shared_devices) > 0
        policy = self.policy_engine.evaluate_action(
            recommended_action="BLOCK_ACCOUNT" if is_shared_device else "ALLOW_TRANSACTION",
            amount=amount,
            risk_level="HIGH" if is_shared_device else "LOW",
            shared_device_detected=is_shared_device
        )
        return {
            "customer_id": customer_id,
            "shared_devices": shared_devices,
            "policy_basis": policy.policy_id,
            "policy_name": policy.name,
            "approval_required_actions": policy.approval_required_actions
        }
