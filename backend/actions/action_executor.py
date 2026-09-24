import logging
from datetime import datetime
from backend.models.schemas import ActionPlan, TimelineEvent

logger = logging.getLogger(__name__)

class ActionExecutor:
    def execute_action(self, case_id: str, action: ActionPlan, actor: str = "System Engine") -> TimelineEvent:
        action.execution_status = "EXECUTED"
        logger.info(f"Executing action {action.action} on case {case_id} by {actor}")
        return TimelineEvent(
            event_id=f"EVT-EXEC-{int(datetime.utcnow().timestamp())}",
            timestamp=datetime.utcnow().isoformat() + "Z",
            event_type=f"ACTION_EXECUTED_{action.action}",
            summary=f"Action '{action.action}' executed successfully under Policy {action.policy_basis}.",
            actor=actor,
            details={"action": action.dict()}
        )
