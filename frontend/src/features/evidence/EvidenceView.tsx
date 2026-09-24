import React from 'react';
import { Filter } from 'lucide-react';
import type { FraudCase } from '../../types';

interface EvidenceViewProps {
  cases: FraudCase[];
}

export const EvidenceView: React.FC<EvidenceViewProps> = ({ cases }) => {
  const allEvidence = cases.flatMap(c => c.evidence.map(e => ({ ...e, caseId: c.case_id })));

  return (
    <div className="h-full overflow-y-auto p-6 space-y-5 bg-[#07090C] select-none">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono text-cyan-400 font-semibold uppercase tracking-caps">
            EVIDENCE / INFORMATION REPOSITORY
          </div>
          <h1 className="text-xl font-bold font-display text-[#F4F6F8] tracking-heading-lg">
            Evidence Records & Audit Trail
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#9AA3AE] bg-[#0B0F14] border border-white/10 px-3 py-1.5 rounded-xl">
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
          <span>Total Records: {allEvidence.length}</span>
        </div>
      </div>

      {/* Dense Evidence Card Grid (Rule 24) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allEvidence.map((ev, i) => (
          <div key={ev.evidence_id || i} className="solid-panel rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-cyan-400 font-bold">{ev.type}</span>
              <span className="text-[#66707C]">{ev.source}</span>
            </div>
            <p className="text-xs text-[#F4F6F8] font-sans leading-relaxed font-medium">
              {ev.finding}
            </p>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-[#9AA3AE]">
              <span>Case: <span className="text-cyan-400">{ev.caseId}</span></span>
              <span>Relevance: {Math.round(ev.relevance * 100)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
