import type { FraudCase, GraphData, PolicyRule, SimilarCaseMatch, SystemStatus } from './types';

const API_BASE = '/api';

export async function fetchInvestigations(): Promise<FraudCase[]> {
  const res = await fetch(`${API_BASE}/investigations`);
  if (!res.ok) throw new Error('Failed to fetch investigations');
  return res.json();
}

export async function triggerNewInvestigation(transactionId: string, triggerReason: string): Promise<FraudCase> {
  const res = await fetch(`${API_BASE}/investigations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transaction_id: transactionId, trigger_reason: triggerReason }),
  });
  if (!res.ok) throw new Error('Failed to trigger investigation');
  return res.json();
}

export async function fetchInvestigationDetail(caseId: string): Promise<FraudCase> {
  const res = await fetch(`${API_BASE}/investigations/${caseId}`);
  if (!res.ok) throw new Error(`Failed to fetch case ${caseId}`);
  return res.json();
}

export async function approveCaseAction(caseId: string, notes: string): Promise<any> {
  const res = await fetch(`${API_BASE}/investigations/${caseId}/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ notes }),
  });
  if (!res.ok) throw new Error('Failed to approve action');
  return res.json();
}

export async function rejectCaseAction(caseId: string, notes: string): Promise<any> {
  const res = await fetch(`${API_BASE}/investigations/${caseId}/reject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ notes }),
  });
  if (!res.ok) throw new Error('Failed to reject action');
  return res.json();
}

export async function submitEvidence(caseId: string, evidenceType: string, details: any): Promise<any> {
  const res = await fetch(`${API_BASE}/investigations/${caseId}/evidence`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ evidence_type: evidenceType, details }),
  });
  if (!res.ok) throw new Error('Failed to submit evidence');
  return res.json();
}

export async function fetchCaseGraph(caseId: string): Promise<GraphData> {
  const res = await fetch(`${API_BASE}/investigations/${caseId}/graph`);
  if (!res.ok) throw new Error('Failed to fetch case graph');
  return res.json();
}

export async function fetchSimilarCases(caseId: string): Promise<SimilarCaseMatch[]> {
  const res = await fetch(`${API_BASE}/investigations/${caseId}/similar-cases`);
  if (!res.ok) throw new Error('Failed to fetch similar cases');
  return res.json();
}

export async function fetchPolicies(): Promise<PolicyRule[]> {
  const res = await fetch(`${API_BASE}/policies`);
  if (!res.ok) throw new Error('Failed to fetch policies');
  return res.json();
}

export async function fetchSystemStatus(): Promise<SystemStatus> {
  const res = await fetch(`${API_BASE}/system/status`);
  if (!res.ok) throw new Error('Failed to fetch system status');
  return res.json();
}
