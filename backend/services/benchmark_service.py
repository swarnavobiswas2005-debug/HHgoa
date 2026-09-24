import os
import json
import csv
import logging
from typing import List, Dict, Any
from backend.agents.orchestrator import CaseOrchestrator

logger = logging.getLogger(__name__)

OUTPUT_DIR = "outputs"

class BenchmarkService:
    def __init__(self, orchestrator: CaseOrchestrator):
        self.orchestrator = orchestrator

    def run_benchmark(self) -> Dict[str, Any]:
        os.makedirs(OUTPUT_DIR, exist_ok=True)
        results = []
        
        # 20 Standard Benchmark Cases (Rule 68)
        for i in range(1, 21):
            tx_id = f"TX-BENCH-{1000+i}"
            
            if i in [1, 2, 5, 9, 14, 18, 20]:
                amount = 5500.0 + (i * 750.0) # High/Critical -> PENDING_APPROVAL
                trigger = f"Benchmark Scenario #{i}: High velocity transfer & device anomaly"
                cust_id = f"CUS-{1001 if i % 2 == 0 else 1002}" # Shared devices
            elif i in [3, 6, 8, 11, 15, 19]:
                amount = 1400.0 + (i * 180.0) # Medium -> WAITING_FOR_EVIDENCE
                trigger = f"Benchmark Scenario #{i}: Location discrepancy behind VPN proxy"
                cust_id = f"CUS-{1000 + i}"
            else:
                amount = 85.0 + (i * 35.0) # Low -> RESOLVED (Cleared)
                trigger = f"Benchmark Scenario #{i}: POS merchant purchase baseline check"
                cust_id = f"CUS-{1000 + i}"
            
            case = self.orchestrator.run_investigation(
                tx_id=tx_id,
                trigger_reason=trigger,
                customer_id=cust_id,
                account_id=f"ACC-{8800 + i}",
                amount=amount
            )
            results.append(case.dict())

        # Export JSON (Rule 69)
        json_path = os.path.join(OUTPUT_DIR, "benchmark_summary.json")
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(results, f, indent=2)

        # Export CSV (Rule 69)
        csv_path = os.path.join(OUTPUT_DIR, "benchmark_summary.csv")
        with open(csv_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["case_id", "transaction_id", "risk_level", "confidence", "status", "action", "policy_basis"])
            for r in results:
                action_str = r["actions"][0]["action"] if r["actions"] else "NONE"
                policy_str = r["actions"][0]["policy_basis"] if r["actions"] else "NONE"
                writer.writerow([r["case_id"], r["transaction_id"], r["risk_level"], r["confidence"], r["status"], action_str, policy_str])

        logger.info(f"Exported benchmark output to {json_path} and {csv_path}")
        return {
            "total_cases_evaluated": len(results),
            "json_output": json_path,
            "csv_output": csv_path,
            "status": "COMPLETED"
        }
