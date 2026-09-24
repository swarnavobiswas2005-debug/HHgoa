import logging
from typing import Dict, Any, List
from backend.graph.tigergraph_service import TigerGraphService

logger = logging.getLogger(__name__)

class TigerGraphMCP:
    def __init__(self, tg_service: TigerGraphService):
        self.tg_service = tg_service

    def inspect_customer(self, customer_id: str) -> Dict[str, Any]:
        cust = self.tg_service.get_customer(customer_id)
        if not cust:
            return {"status": "NOT_FOUND", "customer_id": customer_id}
        shared_devices = self.tg_service.find_shared_devices(customer_id)
        return {
            "status": "FOUND",
            "customer": cust.dict(),
            "shared_devices": shared_devices
        }

    def detect_shared_device_network(self, customer_id: str) -> List[Dict[str, Any]]:
        return self.tg_service.find_shared_devices(customer_id)
