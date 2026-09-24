export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type CaseStatus =
  | 'NEW'
  | 'INVESTIGATING'
  | 'WAITING_FOR_EVIDENCE'
  | 'PENDING_APPROVAL'
  | 'ACTION_REQUIRED'
  | 'RESOLVED'
  | 'ESCALATED'
  | 'FALSE_POSITIVE';

export type ActionType =
  | 'ALLOW_TRANSACTION'
  | 'BLOCK_TRANSACTION'
  | 'MONITOR_ACCOUNT'
  | 'BLOCK_ACCOUNT'
  | 'WARN_CUSTOMER'
  | 'CREATE_FRAUD_CASE'
  | 'REQUEST_MORE_EVIDENCE'
  | 'REQUEST_STEP_UP'
  | 'ESCALATE_TO_ANALYST'
  | 'FILE_REPORT'
  | 'CLOSE_CASE';

export interface EvidenceItem {
  evidence_id: string;
  type: string;
  source: string;
  entity_id: string;
  finding: string;
  relevance: number;
  confidence: number;
  timestamp: string;
  case_id: string;
  metadata?: Record<string, any>;
}

export interface ActionPlan {
  action: ActionType | string;
  reason: string;
  confidence: number;
  risk_level: RiskLevel;
  required_approval: boolean;
  approval_role?: string;
  policy_basis: string;
  supporting_evidence: string[];
  blocked_reasons: string[];
  execution_status: string;
}

export interface PolicyRule {
  policy_id: string;
  name: string;
  description: string;
  risk_threshold: RiskLevel;
  permitted_actions: string[];
  prohibited_actions: string[];
  approval_required_actions: string[];
  escalation_role: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: string;
  risk_score?: number;
  properties?: Record<string, any>;
}

export interface GraphEdge {
  source: string;
  target: string;
  relationship: string;
  properties?: Record<string, any>;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface TimelineEvent {
  event_id: string;
  timestamp: string;
  event_type: string;
  summary: string;
  actor: string;
  details?: Record<string, any>;
}

export interface SimilarCaseMatch {
  case_id: string;
  similarity_score: number;
  matching_entities: string[];
  matching_patterns: string[];
  previous_action: string;
  previous_outcome: string;
  analyst_decision: string;
}

export interface FraudCase {
  case_id: string;
  trigger: string;
  customer_id: string;
  account_id: string;
  transaction_id: string;
  status: CaseStatus;
  risk_level: RiskLevel;
  confidence: number;
  fraud_pattern?: string;
  evidence: EvidenceItem[];
  findings: string[];
  uncertainty: string;
  requested_evidence: string[];
  actions: ActionPlan[];
  approval_status: string;
  analyst_notes?: string;
  timeline: TimelineEvent[];
  final_outcome?: string;
  created_at: string;
  updated_at: string;
}

export interface SystemStatus {
  status: string;
  demo_mode: boolean;
  tigergraph: {
    status: string;
    host: string;
    graph_name: string;
  };
  llm: {
    provider: string;
    model: string;
  };
  mcp_server: {
    status: string;
    url: string;
  };
  graphrag_engine: {
    status: string;
  };
  case_manager: {
    database: string;
    total_cases: number;
  };
}
