from typing import List, Tuple
from backend.models.schemas import EvidenceItem, RiskLevel

class EvidenceEngine:
    def calculate_risk_and_confidence(self, evidence: List[EvidenceItem]) -> Tuple[RiskLevel, float, str, List[str]]:
        if not evidence:
            return "LOW", 0.95, "No risk signals detected. Transaction matches normal cardholder baseline.", []

        total_weight = sum(e.relevance for e in evidence)
        weighted_score = sum(e.relevance * e.confidence for e in evidence) / total_weight if total_weight > 0 else 0.5

        has_shared_device = any("shared" in e.finding.lower() for e in evidence)
        has_high_velocity = any("high transaction velocity" in e.finding.lower() for e in evidence)
        has_vpn_proxy = any("vpn" in e.finding.lower() or "proxy" in e.finding.lower() for e in evidence)
        has_low_risk_pos = any("verified pos" in e.finding.lower() or "normal" in e.finding.lower() for e in evidence)

        if has_shared_device or (has_high_velocity and weighted_score > 0.75):
            risk_level = "CRITICAL" if has_shared_device and has_high_velocity else "HIGH"
        elif has_vpn_proxy or (weighted_score > 0.50 and not has_low_risk_pos):
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"

        confidence = round(weighted_score, 2)

        # Detect missing evidence & uncertainty rationale
        missing_evidence = []
        if risk_level in ["CRITICAL", "HIGH"] and confidence < 0.95:
            uncertainty = "High risk detected via shared device cluster, but customer ownership has not been independently verified via out-of-band SMS authentication."
            missing_evidence.append("Customer Out-Of-Band SMS Validation")
        elif risk_level == "MEDIUM":
            uncertainty = "Transaction velocity anomaly detected behind proxy IP; additional device biometric confirmation recommended."
            missing_evidence.append("Device Biometric Confirmation")
        else:
            uncertainty = "Evidence is consistent with normal customer spending behavior. No significant ambiguity."

        return risk_level, confidence, uncertainty, missing_evidence
