import os
import json
import logging
from typing import List, Optional
from datetime import datetime
from dotenv import load_dotenv
load_dotenv()
from supabase import create_client, Client
from backend.models.schemas import FraudCase, EvidenceItem, ActionPlan, TimelineEvent

logger = logging.getLogger(__name__)

class CaseManager:
    def __init__(self):
        supabase_url = os.environ.get("SUPABASE_URL")
        supabase_key = os.environ.get("SUPABASE_KEY")
        if not supabase_url or not supabase_key:
            logger.warning("SUPABASE_URL and SUPABASE_KEY not set. Case Manager will fail.")
        else:
            self.supabase: Client = create_client(supabase_url, supabase_key)

    def save_case(self, case: FraudCase):
        data = {
            "case_id": case.case_id,
            "trigger": case.trigger,
            "customer_id": case.customer_id,
            "account_id": case.account_id,
            "transaction_id": case.transaction_id,
            "status": case.status,
            "risk_level": case.risk_level,
            "confidence": case.confidence,
            "fraud_pattern": case.fraud_pattern,
            "evidence": [e.dict() for e in case.evidence],
            "findings": case.findings,
            "uncertainty": case.uncertainty,
            "requested_evidence": case.requested_evidence,
            "actions": [a.dict() for a in case.actions],
            "approval_status": case.approval_status,
            "analyst_notes": case.analyst_notes,
            "timeline": [t.dict() for t in case.timeline],
            "final_outcome": case.final_outcome,
            "created_at": case.created_at,
            "updated_at": case.updated_at
        }
        try:
            self.supabase.table("cases").upsert(data).execute()
        except Exception as e:
            logger.error(f"Error saving case to Supabase: {e}")

    def get_case(self, case_id: str) -> Optional[FraudCase]:
        try:
            res = self.supabase.table("cases").select("*").eq("case_id", case_id).execute()
            if not res.data:
                return None
            return self._row_to_case(res.data[0])
        except Exception as e:
            logger.error(f"Error getting case from Supabase: {e}")
            return None

    def list_cases(self) -> List[FraudCase]:
        try:
            res = self.supabase.table("cases").select("*").order("created_at", desc=True).execute()
            return [self._row_to_case(row) for row in res.data]
        except Exception as e:
            logger.error(f"Error listing cases from Supabase: {e}")
            return []

    def _row_to_case(self, row: dict) -> FraudCase:
        return FraudCase(
            case_id=row.get("case_id"),
            trigger=row.get("trigger"),
            customer_id=row.get("customer_id"),
            account_id=row.get("account_id"),
            transaction_id=row.get("transaction_id"),
            status=row.get("status"),
            risk_level=row.get("risk_level"),
            confidence=row.get("confidence"),
            fraud_pattern=row.get("fraud_pattern"),
            evidence=[EvidenceItem(**e) for e in (row.get("evidence") or [])],
            findings=row.get("findings") or [],
            uncertainty=row.get("uncertainty") or "",
            requested_evidence=row.get("requested_evidence") or [],
            actions=[ActionPlan(**a) for a in (row.get("actions") or [])],
            approval_status=row.get("approval_status") or "NOT_REQUIRED",
            analyst_notes=row.get("analyst_notes"),
            timeline=[TimelineEvent(**t) for t in (row.get("timeline") or [])],
            final_outcome=row.get("final_outcome"),
            created_at=row.get("created_at"),
            updated_at=row.get("updated_at")
        )
