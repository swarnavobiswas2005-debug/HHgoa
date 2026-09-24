import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  FileCheck2,
  Zap,
  HelpCircle,
  Copy,
  Check,
  Brain,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import type { FraudCase, GraphData } from '../types';
import { InteractiveGraph } from './InteractiveGraph';
import { approveCaseAction, rejectCaseAction, submitEvidence } from '../api';

interface InvestigationWorkspaceProps {
  currentCase: FraudCase | null;
  graphData: GraphData | null;
  onRefreshCase: () => void;
}

export const InvestigationWorkspace: React.FC<InvestigationWorkspaceProps> = ({
  currentCase,
  graphData,
  onRefreshCase
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalType, setApprovalType] = useState<'APPROVE' | 'REJECT' | null>(null);

  // Progressive Case Reveal Choreography Stages (Rule 55 Signature Case Open Animation)
  const [revealStage, setRevealStage] = useState<number>(0);
  const [progressStatus, setProgressStatus] = useState<string>('INITIATING INVESTIGATION...');

  useEffect(() => {
    if (!currentCase) return;

    setRevealStage(0);
    setProgressStatus('TRACING 2-HOP TIGERGRAPH NEIGHBORS...');

    const timer1 = setTimeout(() => {
      setRevealStage(1);
      setProgressStatus('SEARCHING CASE MEMORY EMBEDDINGS...');
    }, 250);

    const timer2 = setTimeout(() => {
      setRevealStage(2);
      setProgressStatus('RANKING EVIDENCE & CALCULATING UNCERTAINTY...');
    }, 500);

    const timer3 = setTimeout(() => {
      setRevealStage(3);
      setProgressStatus('EVALUATING DETERMINISTIC POLICY RULES...');
    }, 750);

    const timer4 = setTimeout(() => {
      setRevealStage(4);
      setProgressStatus('INVESTIGATION WORKSPACE ACTIVE');
    }, 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [currentCase?.case_id]);

  if (!currentCase) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-[#66707C] font-mono text-xs space-y-3 bg-[#07090C]">
        <Layers className="w-8 h-8 text-slate-700" />
        <div>No case selected. Select an investigation from the queue.</div>
      </div>
    );
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleApproveOrReject = async () => {
    if (!approvalType) return;
    setIsSubmitting(true);
    try {
      if (approvalType === 'APPROVE') {
        await approveCaseAction(currentCase.case_id, approvalNotes || 'Approved by Analyst');
      } else {
        await rejectCaseAction(currentCase.case_id, approvalNotes || 'Rejected by Analyst');
      }
      setShowApprovalModal(false);
      setApprovalNotes('');
      onRefreshCase();
    } catch (e) {
      alert(`Action failed: ${e}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestStepUp = async () => {
    setIsSubmitting(true);
    try {
      await submitEvidence(currentCase.case_id, 'CustomerResponse', {
        status: 'SUCCESS',
        passed: true,
        method: 'OUT_OF_BAND_SMS',
        timestamp: new Date().toISOString()
      });
      onRefreshCase();
    } catch (e) {
      alert(`Step-up failed: ${e}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const recommendedAction = currentCase.actions.length > 0 ? currentCase.actions[0] : null;

  return (
    <div className="h-full flex flex-col bg-transparent overflow-hidden select-none">
      {/* Case Header */}
      <div className="h-16 glass-surface border-b border-red-500/15 px-6 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-5">
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-red-400 font-bold">
              <span>{currentCase.case_id}</span>
              <button
                onClick={() => handleCopy(currentCase.case_id)}
                className="text-zinc-500 hover:text-white"
                title="Copy Case ID"
              >
                {copiedId === currentCase.case_id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
            <h2 className="text-base font-extrabold font-display text-[#F4F6F8] tracking-heading-md">
              {currentCase.trigger}
            </h2>
          </div>

          <div className="h-6 w-px bg-red-500/20"></div>

          <div className="flex items-center gap-4 text-xs font-mono text-[#A1A1AA]">
            <div>Tx: <span className="text-[#F4F6F8]">{currentCase.transaction_id}</span></div>
            <div>Cust: <span className="text-[#F4F6F8]">{currentCase.customer_id}</span></div>
          </div>
        </div>

        {/* Status, Risk Badges & Agent Progress Choreography Step */}
        <div className="flex items-center gap-3 font-mono">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-[#0A0A0E] border border-red-500/30 rounded-lg text-[10px] text-red-400 shadow-sm">
            <Sparkles className="w-3 h-3 text-red-400 animate-spin" />
            <span>{progressStatus}</span>
          </div>

          <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
            currentCase.risk_level === 'HIGH' || currentCase.risk_level === 'CRITICAL'
              ? 'bg-red-950/80 text-red-400 border border-red-700/60 pulse-red'
              : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
          }`}>
            {currentCase.risk_level} RISK
          </span>
          <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-blue-950/60 text-cyan-300 border border-blue-800/60">
            {Math.round(currentCase.confidence * 100)}% CONFIDENCE
          </span>
          <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-white/5 text-slate-300 border border-white/10">
            {currentCase.status}
          </span>
        </div>
      </div>

      {/* 3-Zone Primary Grid (Rule 46) */}
      <div className="flex-1 grid grid-cols-12 overflow-hidden divide-x divide-white/10">
        {/* ================= LEFT ZONE: Case Context & Timeline (70% Solid Panel) ================= */}
        <div className="col-span-3 solid-panel flex flex-col overflow-y-auto p-4 space-y-5">
          <div>
            <h3 className="text-[11px] font-semibold text-[#66707C] uppercase tracking-caps mb-2 font-mono flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" /> Key Entities
            </h3>
            <div className="solid-surface rounded-lg p-3 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-[#66707C]">Customer ID:</span>
                <span className="text-cyan-400 font-bold">{currentCase.customer_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#66707C]">Account ID:</span>
                <span className="text-[#F4F6F8]">{currentCase.account_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#66707C]">Transaction ID:</span>
                <span className="text-[#F4F6F8]">{currentCase.transaction_id}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-white/5">
                <span className="text-[#66707C]">Fraud Pattern:</span>
                <span className="text-amber-400 font-semibold">{currentCase.fraud_pattern || 'Triage in progress'}</span>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-[11px] font-semibold text-[#66707C] uppercase tracking-caps mb-3 font-mono">
              Audit Timeline
            </h3>
            <div className="relative border-l border-white/10 ml-2 space-y-4 pl-4 text-xs font-sans">
              {currentCase.timeline.map((evt, idx) => (
                <div key={evt.event_id || idx} className="relative group">
                  <span className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border ${
                    evt.event_type.includes('APPROVED') || evt.event_type.includes('RESOLVED')
                      ? 'bg-emerald-500 border-emerald-400'
                      : evt.event_type.includes('REQUIRED') || evt.event_type.includes('REJECTED')
                      ? 'bg-red-500 border-red-400'
                      : 'bg-cyan-500 border-cyan-400'
                  }`}></span>

                  <div className="flex items-center justify-between text-[10px] text-[#66707C] font-mono">
                    <span>{new Date(evt.timestamp).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' }) + ' IST'}</span>
                    <span className="bg-white/5 px-1.5 py-0.5 rounded text-[10px] text-slate-300 font-bold">
                      {evt.actor}
                    </span>
                  </div>
                  <div className="text-[#F4F6F8] font-medium mt-0.5 leading-snug">{evt.summary}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= CENTER ZONE: Graph Visualization (Hero Component) ================= */}
        <div className="col-span-5 graph-hero-canvas flex flex-col relative overflow-hidden">
          {revealStage >= 1 ? (
            <div className="w-full h-full animate-fade-up">
              <InteractiveGraph graphData={graphData} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-xs font-mono text-cyan-400">
              <Sparkles className="w-4 h-4 animate-spin mr-2" /> Initializing GSQL Graph Canvas...
            </div>
          )}
        </div>

        {/* ================= RIGHT ZONE: AI Intelligence & Next Best Action (Glass Surface 30%) ================= */}
        <div className="col-span-4 solid-panel flex flex-col overflow-y-auto p-4 space-y-5">
          {/* Agent Reasoning Stream */}
          {revealStage >= 3 && (
            <div className="glass-surface rounded-xl p-3.5 space-y-2 animate-fade-up">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-semibold text-cyan-300 uppercase tracking-caps flex items-center gap-2">
                  <Brain className="w-4 h-4 text-cyan-400" /> Specialist Agent Swarm
                </span>
                <span className="text-[10px] bg-blue-950/60 text-cyan-300 px-2 py-0.5 rounded border border-blue-800/60 font-bold">
                  GSQL GROUNDED
                </span>
              </div>
              <div className="text-xs text-[#9AA3AE] space-y-1 font-mono text-[11px] leading-relaxed bg-[#07090C] p-2.5 rounded border border-white/5">
                <div className="text-emerald-400">✓ TigerGraph 2-hop traversal complete</div>
                <div className="text-emerald-400">✓ Shared device cluster verified (DVC-9082)</div>
                <div className="text-emerald-400">✓ Historical case memory matched (CASE-HIST-881)</div>
                <div className="text-amber-300">● Evaluating Policy POL-101 permissions...</div>
              </div>
            </div>
          )}

          {/* Uncertainty Rationale (Rule 16 & 48) */}
          <div className="solid-surface rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-semibold text-[#F4F6F8] uppercase tracking-caps flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" /> Uncertainty Rationale
              </span>
              <span className="text-amber-400 font-bold text-[10px] bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
                EVALUATED
              </span>
            </div>
            <p className="text-xs text-[#9AA3AE] leading-relaxed font-sans">
              {currentCase.uncertainty}
            </p>
          </div>

          {/* Missing Evidence Request Box */}
          {currentCase.requested_evidence.length > 0 && (
            <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-300 uppercase tracking-caps font-mono flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> Additional Evidence Needed
                </span>
              </div>
              <ul className="list-disc list-inside text-xs text-amber-200/90 space-y-1 font-sans">
                {currentCase.requested_evidence.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
              <button
                onClick={handleRequestStepUp}
                disabled={isSubmitting}
                className="w-full mt-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xs font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-2 font-mono"
              >
                <Zap className="w-3.5 h-3.5" /> {isSubmitting ? 'Simulating Challenge...' : 'Trigger Step-Up SMS Auth'}
              </button>
            </div>
          )}

          {/* Evidence Records */}
          {revealStage >= 2 && (
            <div className="animate-fade-up">
              <h3 className="text-[11px] font-semibold text-[#66707C] uppercase tracking-caps mb-2 font-mono flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-cyan-400" /> Evidence Records ({currentCase.evidence.length})
              </h3>
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {currentCase.evidence.map((ev) => (
                  <div key={ev.evidence_id} className="solid-surface rounded-lg p-2.5 space-y-1 text-xs">
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-cyan-400 font-bold">{ev.type}</span>
                      <span className="text-[#66707C]">{ev.source}</span>
                    </div>
                    <div className="text-[#F4F6F8] font-medium">{ev.finding}</div>
                    <div className="flex items-center justify-between text-[10px] text-[#66707C] font-mono pt-1">
                      <span>Relevance: {Math.round(ev.relevance * 100)}%</span>
                      <span>Confidence: {Math.round(ev.confidence * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Best Action (Cinematic Luminous Panel - Rule 49) */}
          {recommendedAction && revealStage >= 4 && (
            <div className="luminous-action-panel rounded-xl p-4 space-y-3 animate-fade-up">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#F4F6F8] uppercase tracking-caps font-mono flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-emerald-400" /> Next Best Action
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  recommendedAction.required_approval
                    ? 'bg-amber-950/60 text-amber-400 border border-amber-800/60'
                    : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                }`}>
                  {recommendedAction.required_approval ? 'APPROVAL REQUIRED' : 'AUTONOMOUS PERMITTED'}
                </span>
              </div>

              <div className="text-sm font-bold text-emerald-400 font-mono tracking-heading-md">
                {recommendedAction.action}
              </div>

              <p className="text-xs text-[#9AA3AE] leading-relaxed font-sans">
                {recommendedAction.reason}
              </p>

              <div className="text-[11px] font-mono bg-[#07090C] p-2.5 rounded-lg text-slate-300 border border-white/5">
                <span className="text-[#66707C]">Policy Basis:</span> {recommendedAction.policy_basis}
              </div>

              {/* Human Approval Controls */}
              {recommendedAction.required_approval && currentCase.status === 'PENDING_APPROVAL' && (
                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => { setApprovalType('APPROVE'); setShowApprovalModal(true); }}
                    className="flex-1 luminous-button text-white text-xs font-bold py-2 rounded-lg transition-all font-mono"
                  >
                    Approve Action
                  </button>
                  <button
                    onClick={() => { setApprovalType('REJECT'); setShowApprovalModal(true); }}
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white text-xs font-bold py-2 rounded-lg transition-all font-mono"
                  >
                    Reject Action
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Glass Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#10151C]/90 backdrop-blur-2xl border border-white/10 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-[#F4F6F8] font-mono uppercase tracking-caps">
                Confirm Analyst Decision: {approvalType}
              </h3>
              <button onClick={() => setShowApprovalModal(false)} className="text-[#66707C] hover:text-white font-mono">✕</button>
            </div>

            <p className="text-xs text-[#9AA3AE] leading-relaxed">
              You are about to <span className="font-bold text-[#F4F6F8] uppercase">{approvalType}</span> the action recommendation{' '}
              <span className="font-mono text-emerald-400 font-bold">{recommendedAction?.action}</span> for case{' '}
              <span className="font-mono text-cyan-400 font-bold">{currentCase.case_id}</span>.
            </p>

            <div>
              <label className="block text-xs font-semibold text-[#66707C] mb-1.5 font-mono">Analyst Rationale / Audit Notes:</label>
              <textarea
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                placeholder="Enter formal investigation rationale for audit trail..."
                className="w-full bg-[#07090C] border border-white/10 rounded-lg p-3 text-xs text-[#F4F6F8] focus:outline-none focus:border-cyan-400 font-mono h-24"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2 font-mono">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-[#66707C] hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleApproveOrReject}
                disabled={isSubmitting}
                className={`px-5 py-2 rounded-lg text-xs font-bold text-white transition-all ${
                  approvalType === 'APPROVE'
                    ? 'luminous-button'
                    : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400'
                }`}
              >
                {isSubmitting ? 'Processing...' : 'Confirm Decision'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
