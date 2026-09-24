import sqlite3
import json
import logging
from typing import List, Optional
from datetime import datetime
from backend.models.schemas import FraudCase, EvidenceItem, ActionPlan, TimelineEvent

logger = logging.getLogger(__name__)

DB_PATH = "fraud_platform.db"

class CaseManager:
    def __init__(self, db_path: str = DB_PATH):
        self.db_path = db_path
        self._init_db()

    def _init_db(self):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS cases (
                    case_id TEXT PRIMARY KEY,
                    trigger TEXT,
                    customer_id TEXT,
                    account_id TEXT,
                    transaction_id TEXT,
                    status TEXT,
                    risk_level TEXT,
                    confidence REAL,
                    fraud_pattern TEXT,
                    evidence TEXT,
                    findings TEXT,
                    uncertainty TEXT,
                    requested_evidence TEXT,
                    actions TEXT,
                    approval_status TEXT,
                    analyst_notes TEXT,
                    timeline TEXT,
                    final_outcome TEXT,
                    created_at TEXT,
                    updated_at TEXT
                )
            """)
            conn.commit()

    def save_case(self, case: FraudCase):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO cases (
                    case_id, trigger, customer_id, account_id, transaction_id, status,
                    risk_level, confidence, fraud_pattern, evidence, findings, uncertainty,
                    requested_evidence, actions, approval_status, analyst_notes, timeline,
                    final_outcome, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(case_id) DO UPDATE SET
                    status=excluded.status,
                    risk_level=excluded.risk_level,
                    confidence=excluded.confidence,
                    fraud_pattern=excluded.fraud_pattern,
                    evidence=excluded.evidence,
                    findings=excluded.findings,
                    uncertainty=excluded.uncertainty,
                    requested_evidence=excluded.requested_evidence,
                    actions=excluded.actions,
                    approval_status=excluded.approval_status,
                    analyst_notes=excluded.analyst_notes,
                    timeline=excluded.timeline,
                    final_outcome=excluded.final_outcome,
                    updated_at=excluded.updated_at
            """, (
                case.case_id, case.trigger, case.customer_id, case.account_id, case.transaction_id, case.status,
                case.risk_level, case.confidence, case.fraud_pattern,
                json.dumps([e.dict() for e in case.evidence]),
                json.dumps(case.findings), case.uncertainty,
                json.dumps(case.requested_evidence),
                json.dumps([a.dict() for a in case.actions]),
                case.approval_status, case.analyst_notes,
                json.dumps([t.dict() for t in case.timeline]),
                case.final_outcome, case.created_at, case.updated_at
            ))
            conn.commit()

    def get_case(self, case_id: str) -> Optional[FraudCase]:
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM cases WHERE case_id = ?", (case_id,))
            row = cursor.fetchone()
            if not row:
                return None
            return self._row_to_case(row)

    def list_cases(self) -> List[FraudCase]:
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM cases ORDER BY created_at DESC")
            rows = cursor.fetchall()
            return [self._row_to_case(r) for r in rows]

    def _row_to_case(self, row) -> FraudCase:
        return FraudCase(
            case_id=row[0],
            trigger=row[1],
            customer_id=row[2],
            account_id=row[3],
            transaction_id=row[4],
            status=row[5],
            risk_level=row[6],
            confidence=row[7],
            fraud_pattern=row[8],
            evidence=[EvidenceItem(**e) for e in json.loads(row[9] or "[]")],
            findings=json.loads(row[10] or "[]"),
            uncertainty=row[11] or "",
            requested_evidence=json.loads(row[12] or "[]"),
            actions=[ActionPlan(**a) for a in json.loads(row[13] or "[]")],
            approval_status=row[14] or "NOT_REQUIRED",
            analyst_notes=row[15],
            timeline=[TimelineEvent(**t) for t in json.loads(row[16] or "[]")],
            final_outcome=row[17],
            created_at=row[18],
            updated_at=row[19]
        )
