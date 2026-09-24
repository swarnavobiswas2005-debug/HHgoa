import React, { useState } from 'react';
import { Search, Filter, Plus, ArrowUpDown } from 'lucide-react';
import type { FraudCase } from '../../types';

interface CasesQueueViewProps {
  cases: FraudCase[];
  onSelectCase: (caseId: string) => void;
  onTriggerNew: () => void;
}

export const CasesQueueView: React.FC<CasesQueueViewProps> = ({
  cases,
  onSelectCase,
  onTriggerNew
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');

  const filteredCases = cases.filter(c => {
    const matchesSearch =
      c.case_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.transaction_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.customer_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.trigger.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRisk = riskFilter === 'ALL' || c.risk_level === riskFilter;

    return matchesSearch && matchesRisk;
  });

  return (
    <div className="h-full flex flex-col bg-transparent overflow-hidden select-none p-6 space-y-4">
      {/* Header & Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
        <div>
          <div className="text-[11px] font-mono text-cyan-400 font-semibold uppercase tracking-caps">
            CASES / INVESTIGATION QUEUE
          </div>
          <h1 className="text-xl font-bold font-display text-[#F4F6F8] tracking-heading-lg">
            Fraud Case Directory
          </h1>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64 bg-[#0B0F14] border border-white/10 rounded-xl px-3 py-1.5 flex items-center text-xs font-mono">
            <Search className="w-3.5 h-3.5 text-[#66707C] mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ID, customer, trigger..."
              className="w-full bg-transparent text-[#F4F6F8] focus:outline-none placeholder:text-[#66707C]"
            />
          </div>

          {/* Risk Level Filter */}
          <div className="flex items-center gap-1.5 bg-[#0B0F14] border border-white/10 rounded-xl px-3 py-1.5 text-xs font-mono text-[#9AA3AE]">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="bg-transparent text-[#F4F6F8] focus:outline-none font-mono"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="HIGH">High Risk</option>
              <option value="CRITICAL">Critical Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="LOW">Low Risk</option>
            </select>
          </div>

          {/* Trigger New Button */}
          <button
            onClick={onTriggerNew}
            className="luminous-button px-4 py-2 rounded-xl text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Trigger Investigation</span>
          </button>
        </div>
      </div>

      {/* Serious Data Table (Rule 45) */}
      <div className="flex-1 solid-panel rounded-xl overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead className="sticky top-0 bg-[#10151C] border-b border-white/10 text-[#66707C] uppercase tracking-caps text-[10px]">
              <tr>
                <th className="py-3 px-4">CASE ID <ArrowUpDown className="w-3 h-3 inline ml-1" /></th>
                <th className="py-3 px-4">TRANSACTION</th>
                <th className="py-3 px-4">CUSTOMER</th>
                <th className="py-3 px-4">TRIGGER / REASON</th>
                <th className="py-3 px-4">RISK</th>
                <th className="py-3 px-4">CONFIDENCE</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[#F4F6F8]">
              {filteredCases.map((c) => (
                <tr
                  key={c.case_id}
                  onClick={() => onSelectCase(c.case_id)}
                  className="table-row-hover cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 text-cyan-400 font-bold">{c.case_id}</td>
                  <td className="py-3.5 px-4 text-[#9AA3AE]">{c.transaction_id}</td>
                  <td className="py-3.5 px-4 text-[#9AA3AE]">{c.customer_id}</td>
                  <td className="py-3.5 px-4 font-sans max-w-[220px] truncate">{c.trigger}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      c.risk_level === 'HIGH' || c.risk_level === 'CRITICAL'
                        ? 'bg-red-950/60 text-red-400 border border-red-800/60'
                        : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                    }`}>
                      {c.risk_level}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">{Math.round(c.confidence * 100)}%</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-white/5 border border-white/10 px-2.5 py-0.5 rounded text-[10px] text-slate-300">
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="text-xs text-cyan-400 hover:underline">Open Workspace →</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
