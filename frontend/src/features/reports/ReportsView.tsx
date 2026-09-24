import React from 'react';
import { FileSpreadsheet, Download } from 'lucide-react';
import type { FraudCase } from '../../types';

interface ReportsViewProps {
  cases: FraudCase[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ cases }) => {
  const allEvents = cases.flatMap(c => c.timeline.map(t => ({ ...t, caseId: c.case_id })));

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cases, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "audit_log_export.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="h-full overflow-y-auto p-6 space-y-5 bg-[#07090C] select-none">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-[11px] font-mono text-cyan-400 font-semibold uppercase tracking-caps flex items-center gap-2">
            <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
            REPORTS & AUDIT LOG / IMMUTABLE TRANSACTION TRAIL
          </div>
          <h1 className="text-xl font-bold font-display text-[#F4F6F8] tracking-heading-lg">
            Platform Audit History
          </h1>
        </div>

        <button
          onClick={handleExportJson}
          className="luminous-button px-4 py-2 rounded-xl text-xs font-mono font-bold text-cyan-300 flex items-center gap-2 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit Log JSON</span>
        </button>
      </div>

      <div className="solid-panel rounded-xl p-5 space-y-4 max-w-4xl">
        <div className="relative border-l border-white/10 ml-2 space-y-4 pl-4 text-xs font-sans">
          {allEvents.map((evt, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#66707C]">
                <span className="text-cyan-400 font-bold">{evt.caseId}</span>
                <span>{new Date(evt.timestamp).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }) + ' IST'}</span>
              </div>
              <div className="text-[#F4F6F8] font-medium">{evt.summary}</div>
              <div className="text-[10px] font-mono text-[#9AA3AE]">Actor: <span className="text-slate-300">{evt.actor}</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
