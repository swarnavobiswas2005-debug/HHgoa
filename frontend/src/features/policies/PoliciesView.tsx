import React, { useEffect, useState } from 'react';
import { ShieldCheck, Search } from 'lucide-react';
import type { PolicyRule } from '../../types';
import { fetchPolicies } from '../../api';

export const PoliciesView: React.FC = () => {
  const [policies, setPolicies] = useState<PolicyRule[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPolicies().then(setPolicies).catch(console.error);
  }, []);

  const filteredPolicies = policies.filter(p =>
    p.policy_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full overflow-y-auto p-6 space-y-5 bg-[#07090C] select-none">
      <div className="space-y-1">
        <div className="text-[11px] font-mono text-cyan-400 font-semibold uppercase tracking-caps flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          POLICY CENTER / COMPLIANCE RULES DIRECTORY
        </div>
        <h1 className="text-xl font-bold font-display text-[#F4F6F8] tracking-heading-lg">
          Deterministic Policy Engine
        </h1>
        <p className="text-xs text-[#9AA3AE]">
          Enforces compliance limits, mandatory human approval workflows, and prohibited actions.
        </p>
      </div>

      <div className="max-w-md bg-[#0B0F14] border border-white/10 rounded-xl px-3 py-2 flex items-center text-xs font-mono">
        <Search className="w-4 h-4 text-[#66707C] mr-2 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter policy rules..."
          className="w-full bg-transparent text-[#F4F6F8] focus:outline-none"
        />
      </div>

      <div className="space-y-3 max-w-4xl">
        {filteredPolicies.map((p) => {
          const hasApprovalRules = p.approval_required_actions.length > 0;
          return (
            <div key={p.policy_id} className="solid-panel rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-cyan-400 font-bold text-sm">{p.policy_id} — {p.name}</span>
                <span className={`px-2.5 py-0.5 rounded font-bold text-[10px] ${
                  hasApprovalRules
                    ? 'bg-amber-950/60 text-amber-400 border border-amber-800/60'
                    : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                }`}>
                  {hasApprovalRules ? 'APPROVAL REQUIRED' : 'AUTONOMOUS PERMITTED'}
                </span>
              </div>

              <p className="text-xs text-[#9AA3AE] leading-relaxed font-sans">{p.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/5 text-xs font-mono">
                <div className="bg-[#07090C] p-2.5 rounded-lg border border-white/5 space-y-1">
                  <div className="text-[10px] text-[#66707C] uppercase">Permitted Actions:</div>
                  <div className="text-emerald-400 font-bold">{p.permitted_actions.join(', ') || 'None'}</div>
                </div>
                <div className="bg-[#07090C] p-2.5 rounded-lg border border-white/5 space-y-1">
                  <div className="text-[10px] text-[#66707C] uppercase">Prohibited Actions:</div>
                  <div className="text-red-400 font-bold">{p.prohibited_actions.join(', ') || 'None'}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
