from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

RiskLevel = str  # 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
CaseStatus = str # 'NEW' | 'INVESTIGATING' | 'WAITING_FOR_EVIDENCE' | 'PENDING_APPROVAL' | 'RESOLVED'

class EvidenceItem(BaseModel):
    evidence_id: str
    type: str
    source: str
    entity_id: str
    finding: str
    relevance: float
    confidence: float
    timestamp: str
    case_id: str
    metadata: Optional[Dict[str, Any]] = None

class ActionPlan(BaseModel):
    action: str
    reason: str
    confidence: float
    risk_level: RiskLevel
    required_approval: bool
    approval_role: Optional[str] = "Fraud Analyst"
    policy_basis: str
    supporting_evidence: List[str] = Field(default_factory=list)
    blocked_reasons: List[str] = Field(default_factory=list)
    execution_status: str = "RECOMMENDED"

class PolicyRule(BaseModel):
    policy_id: str
    name: str
    description: str
    risk_threshold: RiskLevel
    permitted_actions: List[str]
    prohibited_actions: List[str]
    approval_required_actions: List[str]
    escalation_role: str = "Fraud Analyst"

class GraphNode(BaseModel):
    id: str
    label: str
    type: str
    risk_score: Optional[float] = 0.0
    properties: Optional[Dict[str, Any]] = Field(default_factory=dict)

class GraphEdge(BaseModel):
    source: str
    target: str
    relationship: str
    properties: Optional[Dict[str, Any]] = Field(default_factory=dict)

class GraphData(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]

class TimelineEvent(BaseModel):
    event_id: str
    timestamp: str
    event_type: str
    summary: str
    actor: str
    details: Optional[Dict[str, Any]] = None

class SimilarCaseMatch(BaseModel):
    case_id: str
    similarity_score: float
    matching_entities: List[str]
    matching_patterns: List[str]
    previous_action: str
    previous_outcome: str
    analyst_decision: str

class FraudCase(BaseModel):
    case_id: str
    trigger: str
    customer_id: str
    account_id: str
    transaction_id: str
    status: CaseStatus
    risk_level: RiskLevel
    confidence: float
    fraud_pattern: Optional[str] = None
    evidence: List[EvidenceItem] = Field(default_factory=list)
    findings: List[str] = Field(default_factory=list)
    uncertainty: str = ""
    requested_evidence: List[str] = Field(default_factory=list)
    actions: List[ActionPlan] = Field(default_factory=list)
    approval_status: str = "NOT_REQUIRED"
    analyst_notes: Optional[str] = None
    timeline: List[TimelineEvent] = Field(default_factory=list)
    final_outcome: Optional[str] = None
    created_at: str
    updated_at: str

class DecisionObject(BaseModel):
    case_id: str
    risk_level: RiskLevel
    confidence: float
    fraud_pattern: Optional[str] = None
    investigation_status: CaseStatus
    evidence: List[EvidenceItem]
    missing_evidence: List[str]
    policy: Optional[PolicyRule] = None
    recommended_actions: List[ActionPlan]
    approval_required: bool
    approval_role: str
    explanation: str
    uncertainty: str
    final_outcome: Optional[str] = None
    memory_updated: bool = False

class SystemStatus(BaseModel):
    status: str = "OPERATIONAL"
    demo_mode: bool = True
    tigergraph: Dict[str, Any]
    llm: Dict[str, Any]
    mcp_server: Dict[str, Any]
    graphrag_engine: Dict[str, Any]
    case_manager: Dict[str, Any]
