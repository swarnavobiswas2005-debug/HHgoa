import React, { useEffect, useState } from 'react';
import { Search, LayoutDashboard, ListFilter, Network, FileCheck2, History, ShieldCheck, PlaySquare, Activity, Settings } from 'lucide-react';
import type { FraudCase } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: string) => void;
  onSelectCase: (caseId: string) => void;
  cases: FraudCase[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onSelectCase,
  cases
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredCases = cases.filter(
    c => c.case_id.toLowerCase().includes(query.toLowerCase()) || c.transaction_id.toLowerCase().includes(query.toLowerCase())
  );

  const navigationCommands = [
    { label: 'Overview', tab: 'overview', icon: LayoutDashboard },
    { label: 'Investigations Workspace', tab: 'investigations', icon: Network },
    { label: 'Cases Queue', tab: 'cases', icon: ListFilter },
    { label: 'Evidence Explorer', tab: 'evidence', icon: FileCheck2 },
    { label: 'Case Memory', tab: 'case-memory', icon: History },
    { label: 'Policies Directory', tab: 'policies', icon: ShieldCheck },
    { label: 'Reports & Audit', tab: 'reports', icon: PlaySquare },
    { label: 'System Health', tab: 'system', icon: Activity },
    { label: 'Settings', tab: 'settings', icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-md flex items-start justify-center pt-24 px-4 select-none">
      <div className="w-full max-w-xl glass-modal rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Header */}
        <div className="flex items-center px-4 border-b border-white/10 py-3">
          <Search className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search case ID..."
            className="w-full bg-transparent text-xs text-[#F4F6F8] focus:outline-none font-mono placeholder:text-[#66707C]"
            autoFocus
          />
          <span className="text-[10px] font-mono text-[#66707C] bg-white/5 border border-white/10 px-2 py-0.5 rounded">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-3">
          <div>
            <div className="px-3 py-1 text-[10px] font-mono font-semibold text-[#66707C] uppercase tracking-caps">
              Navigation
            </div>
            <div className="space-y-0.5">
              {navigationCommands.map((cmd) => {
                const Icon = cmd.icon;
                return (
                  <button
                    key={cmd.tab}
                    onClick={() => {
                      onSelectTab(cmd.tab);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-slate-400" />
                      <span>{cmd.label}</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#66707C]">Jump to view</span>
                  </button>
                );
              })}
            </div>
          </div>

          {filteredCases.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-mono font-semibold text-[#66707C] uppercase tracking-caps">
                Matching Cases
              </div>
              <div className="space-y-0.5">
                {filteredCases.slice(0, 5).map((c) => (
                  <button
                    key={c.case_id}
                    onClick={() => {
                      onSelectCase(c.case_id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400 font-bold">{c.case_id}</span>
                      <span className="text-slate-400">({c.transaction_id})</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      c.risk_level === 'HIGH' || c.risk_level === 'CRITICAL' ? 'text-red-400 bg-red-950/40' : 'text-emerald-400 bg-emerald-950/40'
                    }`}>
                      {c.risk_level}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
