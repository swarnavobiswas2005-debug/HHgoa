from fastapi import APIRouter

router = APIRouter()

@router.get("/patterns")
def get_fraud_patterns():
    return [
        {"pattern_id": "FP-101", "name": "Shared Device Ring", "risk": "HIGH", "frequency": 42},
        {"pattern_id": "FP-102", "name": "Transaction Velocity Spike", "risk": "MEDIUM", "frequency": 28},
        {"pattern_id": "FP-103", "name": "Proxy / VPN IP Anomaly", "risk": "HIGH", "frequency": 18},
        {"pattern_id": "FP-104", "name": "Crypto Exchange Drain", "risk": "CRITICAL", "frequency": 12}
    ]
