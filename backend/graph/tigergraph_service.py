import logging
from typing import Dict, Any, List, Optional
from backend.models.schemas import GraphNode, GraphEdge, GraphData

logger = logging.getLogger(__name__)

class TigerGraphService:
    def __init__(self, demo_mode: bool = True):
        self.demo_mode = demo_mode
        self._nodes: Dict[str, GraphNode] = {}
        self._edges: List[GraphEdge] = []
        self._seed_demo_graph()

    def _seed_demo_graph(self):
        """Seed rich graph data for Demo Mode execution."""
        nodes = [
            GraphNode(id="CUS-1001", label="Alice Smith", type="Customer", risk_score=0.15, properties={"email": "alice@example.com", "kyc_level": 3}),
            GraphNode(id="CUS-1002", label="Bob Jones", type="Customer", risk_score=0.88, properties={"email": "bob.jones@anonmail.com", "kyc_level": 1}),
            GraphNode(id="ACC-8801", label="Checking AC-8801", type="Account", risk_score=0.10, properties={"balance": 14200.0, "opened": "2021-03-15"}),
            GraphNode(id="ACC-8802", label="Crypto AC-8802", type="Account", risk_score=0.92, properties={"balance": 45000.0, "opened": "2024-01-10"}),
            GraphNode(id="TX-1001", label="TX-1001 ($4,950)", type="Transaction", risk_score=0.87, properties={"amount": 4950.0, "currency": "USD", "timestamp": "2026-09-24T00:15:00Z"}),
            GraphNode(id="TX-1002", label="TX-1002 ($8,900)", type="Transaction", risk_score=0.91, properties={"amount": 8900.0, "currency": "USD", "timestamp": "2026-09-24T00:20:00Z"}),
            GraphNode(id="DVC-9082", label="MacBook Pro DVC-9082", type="Device", risk_score=0.89, properties={"os": "macOS", "fingerprint": "fp_88192a"}),
            GraphNode(id="IP-192.168.1.50", label="192.168.1.50", type="IPAddress", risk_score=0.75, properties={"vpn": True, "country": "US"}),
            GraphNode(id="MERCH-5501", label="Apex Crypto Exchange", type="Merchant", risk_score=0.82, properties={"mcc": "6051", "category": "Crypto"}),
        ]
        
        edges = [
            GraphEdge(source="CUS-1001", target="ACC-8801", relationship="CUSTOMER_OWNS_ACCOUNT"),
            GraphEdge(source="CUS-1002", target="ACC-8802", relationship="CUSTOMER_OWNS_ACCOUNT"),
            GraphEdge(source="ACC-8801", target="TX-1001", relationship="ACCOUNT_MADE_TRANSACTION"),
            GraphEdge(source="ACC-8802", target="TX-1002", relationship="ACCOUNT_MADE_TRANSACTION"),
            GraphEdge(source="CUS-1001", target="DVC-9082", relationship="CUSTOMER_USES_DEVICE"),
            GraphEdge(source="CUS-1002", target="DVC-9082", relationship="CUSTOMER_USES_DEVICE"),
            GraphEdge(source="TX-1001", target="DVC-9082", relationship="TRANSACTION_FROM_DEVICE"),
            GraphEdge(source="TX-1002", target="DVC-9082", relationship="TRANSACTION_FROM_DEVICE"),
            GraphEdge(source="TX-1001", target="IP-192.168.1.50", relationship="TRANSACTION_FROM_IP"),
            GraphEdge(source="TX-1002", target="MERCH-5501", relationship="TRANSACTION_AT_MERCHANT"),
        ]

        for n in nodes:
            self._nodes[n.id] = n
        self._edges = edges

    def get_transaction(self, tx_id: str) -> Optional[GraphNode]:
        return self._nodes.get(tx_id)

    def get_customer(self, customer_id: str) -> Optional[GraphNode]:
        return self._nodes.get(customer_id)

    def find_shared_devices(self, customer_id: str) -> List[Dict[str, Any]]:
        """Detect if customer shares devices with high-risk accounts."""
        connected_devices = [e.target for e in self._edges if e.source == customer_id and e.relationship == "CUSTOMER_USES_DEVICE"]
        shared = []
        for dev_id in connected_devices:
            other_users = [e.source for e in self._edges if e.target == dev_id and e.source != customer_id and e.relationship == "CUSTOMER_USES_DEVICE"]
            if other_users:
                shared.append({
                    "device_id": dev_id,
                    "shared_with": other_users,
                    "risk_score": self._nodes[dev_id].risk_score if dev_id in self._nodes else 0.8
                })
        return shared

    def get_subgraph_for_case(self, case_id: str) -> GraphData:
        """Return full connected graph for case investigation workspace."""
        return GraphData(
            nodes=list(self._nodes.values()),
            edges=self._edges
        )
