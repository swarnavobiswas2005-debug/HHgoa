from typing import List, Dict
from backend.models.schemas import PolicyRule, ActionPlan, RiskLevel

class PolicyEngine:
    def __init__(self):
        self.rules: Dict[str, PolicyRule] = {
            "POL-101": PolicyRule(
                policy_id="POL-101",
                name="High Value Wire Transfer Clearance",
                description="Transactions exceeding $2,500 with risk score > 0.80 require mandatory human analyst approval.",
                risk_threshold="HIGH",
                permitted_actions=["REQUEST_STEP_UP", "WARN_CUSTOMER"],
                prohibited_actions=["ALLOW_TRANSACTION"],
                approval_required_actions=["BLOCK_ACCOUNT", "BLOCK_TRANSACTION"],
                escalation_role="Senior Fraud Analyst"
            ),
            "POL-102": PolicyRule(
                policy_id="POL-102",
                name="Shared Device Ring Protocol",
                description="When a device is shared across 2 or more distinct customer accounts with past fraud activity, automatically trigger step-up auth or freeze account.",
                risk_threshold="HIGH",
                permitted_actions=["REQUEST_STEP_UP", "MONITOR_ACCOUNT"],
                prohibited_actions=[],
                approval_required_actions=["BLOCK_ACCOUNT"],
                escalation_role="Fraud Analyst"
            ),
            "POL-103": PolicyRule(
                policy_id="POL-103",
                name="VPN & Proxy Anomaly Rule",
                description="High velocity transactions initiated behind anonymizing proxies require out-of-band verification.",
                risk_threshold="MEDIUM",
                permitted_actions=["REQUEST_STEP_UP"],
                prohibited_actions=[],
                approval_required_actions=["BLOCK_ACCOUNT"],
                escalation_role="Fraud Analyst"
            ),
            "POL-104": PolicyRule(
                policy_id="POL-104",
                name="Ambiguous Step-Up Resolution Policy",
                description="If evidence confidence is between 60% and 85%, trigger step-up authentication prior to taking destructive blocking actions.",
                risk_threshold="MEDIUM",
                permitted_actions=["REQUEST_STEP_UP", "REQUEST_MORE_EVIDENCE"],
                prohibited_actions=["BLOCK_ACCOUNT"],
                approval_required_actions=[],
                escalation_role="Fraud Analyst"
            ),
            "POL-105": PolicyRule(
                policy_id="POL-105",
                name="Low Risk Autonomous Clearance",
                description="Transactions with risk score below 0.30 and verified device fingerprint permit autonomous clearance.",
                risk_threshold="LOW",
                permitted_actions=["ALLOW_TRANSACTION", "CLOSE_CASE"],
                prohibited_actions=["BLOCK_ACCOUNT", "BLOCK_TRANSACTION"],
                approval_required_actions=[],
                escalation_role="System"
            )
        }

    def evaluate_action(self, recommended_action: str, amount: float, risk_level: RiskLevel, shared_device_detected: bool) -> PolicyRule:
        if shared_device_detected or (amount > 2500 and (risk_level == "HIGH" or risk_level == "CRITICAL")):
            return self.rules["POL-101"]
        elif amount < 500 and risk_level == "LOW":
            return self.rules["POL-105"]
        elif 0.60 <= amount <= 2500 and risk_level == "MEDIUM":
            return self.rules["POL-104"]
        else:
            return self.rules["POL-102"]

    def is_approval_required(self, action: str, policy: PolicyRule) -> bool:
        return action in policy.approval_required_actions
