import React from 'react';
import {
  AlertTriangle,
  FileCheck2,
  Clock,
  ArrowRight,
  TrendingUp,
  Activity,
  CheckCircle2
} from 'lucide-react';
import type { FraudCase } from '../../types';

interface OverviewViewProps {
  cases: FraudCase[];
  onSelectCase: (caseId: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ cases, onSelectCase }) => {
  const activeCasesCount = cases.filter(c => c.status !== 'RESOLVED').length;
  const highRiskCount = cases.filter(c => c.risk_level === 'HIGH' || c.risk_level === 'CRITICAL').length;
  const pendingApprovalCount = cases.filter(c => c.status === 'PENDING_APPROVAL').length;
  const evidenceRequestsCount = cases.filter(c => c.requested_evidence.length > 0).length;

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6 bg-transparent select-none">
      {/* Header Section */}
      <div className="space-y-1">
        <div className="text-[11px] font-mono text-red-500 font-semibold uppercase tracking-caps flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          OVERVIEW / OPERATIONAL DASHBOARD
        </div>
        <h1 className="text-3xl font-extrabold font-display text-[#F4F6F8] tracking-heading-lg">
          Fraud Operations
        </h1>
        <p className="text-xs text-[#A1A1AA] font-sans">
          Investigate signals. Trace relationships. Make defensible decisions.
        </p>
      </div>

      {/* 4 Operational Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="solid-panel rounded-xl p-4 space-y-2 hover-card-elevate border border-red-500/20 relative overflow-hidden group bg-[#0A0A0E]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-xl group-hover:bg-red-500/20 transition-all"></div>
          <div className="flex items-center justify-between text-[#71717A] text-xs font-mono">
            <span>ACTIVE CASES</span>
            <Activity className="w-4 h-4 text-red-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-extrabold font-display text-[#F4F6F8]">
              {activeCasesCount}
            </div>
            <span className="text-[10px] font-mono text-red-400 bg-red-950/80 border border-red-500/40 px-1.5 py-0.5 rounded font-bold">
              +14% vs avg
            </span>
          </div>
          <div className="text-[11px] text-[#A1A1AA] font-mono flex items-center justify-between">
            <span>Real-time open cases</span>
            <span className="text-zinc-500">2ms latency</span>
          </div>
        </div>

        <div className="solid-panel rounded-xl p-4 space-y-2 hover-card-elevate border border-red-500/20 relative overflow-hidden group bg-[#0A0A0E]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/15 rounded-full blur-xl group-hover:bg-red-600/25 transition-all"></div>
          <div className="flex items-center justify-between text-[#71717A] text-xs font-mono">
            <span>HIGH & CRITICAL RISK</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-extrabold font-display text-red-500">
              {highRiskCount}
            </div>
            <span className="text-[10px] font-mono text-red-400 bg-red-950/80 border border-red-500/40 px-1.5 py-0.5 rounded font-bold animate-pulse">
              Urgent
            </span>
          </div>
          <div className="text-[11px] text-[#A1A1AA] font-mono">Risk score &gt; 80%</div>
        </div>

        <div className="solid-panel rounded-xl p-4 space-y-2 hover-card-elevate border border-red-500/20 relative overflow-hidden group bg-[#0A0A0E]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all"></div>
          <div className="flex items-center justify-between text-[#71717A] text-xs font-mono">
            <span>PENDING APPROVAL</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-extrabold font-display text-amber-400">
              {pendingApprovalCount}
            </div>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 border border-amber-500/40 px-1.5 py-0.5 rounded font-bold">
              Action Required
            </span>
          </div>
          <div className="text-[11px] text-[#A1A1AA] font-mono">Mandatory analyst decision</div>
        </div>

        <div className="solid-panel rounded-xl p-4 space-y-2 hover-card-elevate border border-red-500/20 relative overflow-hidden group bg-[#0A0A0E]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-xl group-hover:bg-red-500/20 transition-all"></div>
          <div className="flex items-center justify-between text-[#71717A] text-xs font-mono">
            <span>EVIDENCE REQUESTS</span>
            <FileCheck2 className="w-4 h-4 text-red-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-extrabold font-display text-red-400">
              {evidenceRequestsCount}
            </div>
            <span className="text-[10px] font-mono text-red-400 bg-red-950/80 border border-red-500/40 px-1.5 py-0.5 rounded font-bold">
              Active Step-Up
            </span>
          </div>
          <div className="text-[11px] text-[#A1A1AA] font-mono">Step-up challenges sent</div>
        </div>
      </div>

      {/* Investigation Queue & Pattern Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Investigation Queue Table (8 cols) */}
        <div className="lg:col-span-8 solid-panel rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold font-display text-[#F4F6F8] tracking-heading-md">
                Active Investigation Queue
              </h2>
              <p className="text-xs text-[#9AA3AE] font-sans">Priority cases sorted by risk and confidence</p>
            </div>
            <button
              onClick={() => { if (cases.length > 0) onSelectCase(cases[0].case_id); }}
              className="text-xs font-mono text-red-400 hover:text-red-300 flex items-center gap-1 font-bold"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[#71717A] uppercase tracking-caps text-[10px]">
                  <th className="py-2.5 px-3">CASE ID</th>
                  <th className="py-2.5 px-3">TRIGGER</th>
                  <th className="py-2.5 px-3">RISK</th>
                  <th className="py-2.5 px-3">CONFIDENCE</th>
                  <th className="py-2.5 px-3">STATUS</th>
                  <th className="py-2.5 px-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-[#F4F6F8]">
                {cases.map((c) => (
                  <tr
                    key={c.case_id}
                    onClick={() => onSelectCase(c.case_id)}
                    className="table-row-hover cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3 text-red-400 font-bold">{c.case_id}</td>
                    <td className="py-3 px-3 font-sans max-w-[180px] truncate">{c.trigger}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.risk_level === 'HIGH' || c.risk_level === 'CRITICAL'
                          ? 'bg-red-950/80 text-red-400 border border-red-700/60'
                          : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                      }`}>
                        {c.risk_level}
                      </span>
                    </td>
                    <td className="py-3 px-3">{Math.round(c.confidence * 100)}%</td>
                    <td className="py-3 px-3">
                      <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[10px] text-zinc-300">
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button className="text-xs text-red-400 hover:underline font-bold">Investigate →</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fraud Pattern & Activity Breakdown (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="solid-panel rounded-xl p-5 space-y-3">
            <h2 className="text-sm font-bold font-display text-[#F4F6F8] tracking-heading-md flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" /> Fraud Pattern Velocity
            </h2>
            <div className="space-y-2.5 text-xs font-mono">
              <div className="space-y-1">
                <div className="flex justify-between text-[#9AA3AE]">
                  <span>Shared Device Ring</span>
                  <span className="text-cyan-400">42%</span>
                </div>
                <div className="w-full bg-[#07090C] h-1.5 rounded-full overflow-hidden border border-white/5">
                  <div className="bg-cyan-400 h-full w-[42%]"></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[#9AA3AE]">
                  <span>Velocity Spikes</span>
                  <span className="text-amber-400">28%</span>
                </div>
                <div className="w-full bg-[#07090C] h-1.5 rounded-full overflow-hidden border border-white/5">
                  <div className="bg-amber-400 h-full w-[28%]"></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[#9AA3AE]">
                  <span>Proxy / VPN Anomaly</span>
                  <span className="text-red-400">18%</span>
                </div>
                <div className="w-full bg-[#07090C] h-1.5 rounded-full overflow-hidden border border-white/5">
                  <div className="bg-red-400 h-full w-[18%]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="solid-panel rounded-xl p-5 space-y-3">
            <h2 className="text-sm font-bold font-display text-[#F4F6F8] tracking-heading-md flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Platform Security Policy
            </h2>
            <p className="text-xs text-[#9AA3AE] font-sans leading-relaxed">
              Deterministic policies <span className="font-mono text-cyan-400">POL-101</span> through <span className="font-mono text-cyan-400">POL-105</span> enforce mandatory human approval on high-risk transfers exceeding $2,500.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
