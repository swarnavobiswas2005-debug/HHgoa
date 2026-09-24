from backend.evidence.evidence_engine import EvidenceEngine
from backend.models.schemas import EvidenceItem

def test_evidence_scoring_and_uncertainty():
    ee = EvidenceEngine()
    items = [
        EvidenceItem(
            evidence_id="EV-1", type="SharedDevice", source="Graph", entity_id="DVC-9082",
            finding="Shared device ring detected across 2 customer accounts.",
            relevance=0.95, confidence=0.90, timestamp="2026-09-24T00:00:00Z", case_id="CASE-1"
        )
    ]
    risk, conf, unc, missing = ee.calculate_risk_and_confidence(items)
    assert risk in ["HIGH", "MEDIUM", "LOW"]
    assert 0.0 <= conf <= 1.0
