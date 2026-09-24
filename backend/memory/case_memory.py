import sqlite3
import json
from typing import List
from backend.models.schemas import SimilarCaseMatch

DB_PATH = "fraud_platform.db"

class CaseMemory:
    def __init__(self, db_path: str = DB_PATH):
        self.db_path = db_path
        self._init_memory_db()

    def _init_memory_db(self):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS case_memory (
                    case_id TEXT PRIMARY KEY,
                    similarity_score REAL,
                    matching_entities TEXT,
                    matching_patterns TEXT,
                    previous_action TEXT,
                    previous_outcome TEXT,
                    analyst_decision TEXT
                )
            """)
            conn.commit()

            # Seed default historical precedents if empty
            cursor.execute("SELECT COUNT(*) FROM case_memory")
            if cursor.fetchone()[0] == 0:
                defaults = [
                    ("CASE-HIST-881", 0.94, ["DVC-9082", "CUS-1002"], ["Shared Device Ring"], "BLOCK_ACCOUNT", "Confirmed Fraud", "Approved by Analyst"),
                    ("CASE-HIST-742", 0.88, ["IP-192.168.1.50"], ["VPN Anomaly Spike"], "REQUEST_STEP_UP", "Step-Up Passed", "Approved Autonomous"),
                    ("CASE-HIST-519", 0.82, ["ACC-8802"], ["High Velocity Transfer"], "BLOCK_TRANSACTION", "Confirmed Fraud", "Approved by Analyst")
                ]
                for d in defaults:
                    cursor.execute("""
                        INSERT INTO case_memory VALUES (?, ?, ?, ?, ?, ?, ?)
                    """, (d[0], d[1], json.dumps(d[2]), json.dumps(d[3]), d[4], d[5], d[6]))
                conn.commit()

    def find_similar_cases(self, case_id: str) -> List[SimilarCaseMatch]:
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM case_memory ORDER BY similarity_score DESC")
            rows = cursor.fetchall()
            return [
                SimilarCaseMatch(
                    case_id=r[0],
                    similarity_score=r[1],
                    matching_entities=json.loads(r[2]),
                    matching_patterns=json.loads(r[3]),
                    previous_action=r[4],
                    previous_outcome=r[5],
                    analyst_decision=r[6]
                ) for r in rows
            ]
