from backend.policies.policy_engine import PolicyEngine

def test_high_risk_policy_evaluation():
    engine = PolicyEngine()
    rule = engine.evaluate_action("BLOCK_ACCOUNT", 4950.0, "HIGH", True)
    assert rule.policy_id == "POL-101"
    assert "BLOCK_ACCOUNT" in rule.approval_required_actions

def test_low_risk_policy_evaluation():
    engine = PolicyEngine()
    rule = engine.evaluate_action("ALLOW_TRANSACTION", 120.0, "LOW", False)
    assert rule.policy_id == "POL-105"
    assert "ALLOW_TRANSACTION" in rule.permitted_actions
