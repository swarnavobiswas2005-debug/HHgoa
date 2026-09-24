from fastapi import APIRouter
from backend.policies.policy_engine import PolicyEngine

router = APIRouter()
policy_engine = PolicyEngine()

@router.get("/policies")
def get_policies():
    return list(policy_engine.rules.values())
