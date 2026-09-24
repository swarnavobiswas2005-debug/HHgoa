import React, { useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { HeroIntro } from './components/HeroIntro';
import { OverviewView } from './features/overview/OverviewView';
import { CasesQueueView } from './features/cases/CasesQueueView';
import { InvestigationWorkspace } from './components/InvestigationWorkspace';
import { EvidenceView } from './features/evidence/EvidenceView';
import { GraphView } from './features/graph/GraphView';
import { MemoryView } from './features/memory/MemoryView';
import { PoliciesView } from './features/policies/PoliciesView';
import { ReportsView } from './features/reports/ReportsView';
import { SystemView } from './features/system/SystemView';
import { SettingsView } from './features/settings/SettingsView';
import { CommandPalette } from './components/CommandPalette';
import type { FraudCase, GraphData, SystemStatus } from './types';
import {
  fetchInvestigations,
  fetchInvestigationDetail,
  fetchCaseGraph,
  fetchSystemStatus,
  triggerNewInvestigation
} from './api';

export function App() {
  const [currentTab, setCurrentTab] = useState('overview');
  const [showHeroIntro, setShowHeroIntro] = useState(true);
  const [cases, setCases] = useState<FraudCase[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [currentCase, setCurrentCase] = useState<FraudCase | null>(null);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [showTriggerModal, setShowTriggerModal] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [triggerTxId, setTriggerTxId] = useState('TX-1001');
  const [triggerReason, setTriggerReason] = useState('Shared device risk alert');

  const loadData = async () => {
    try {
      const caseList = await fetchInvestigations();
      setCases(caseList);

      if (caseList.length > 0 && !selectedCaseId) {
        setSelectedCaseId(caseList[0].case_id);
      }

      const sys = await fetchSystemStatus();
      setSystemStatus(sys);
    } catch (err) {
      console.error('Error loading platform data:', err);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedCaseId) {
      setLoading(true);
      Promise.all([
        fetchInvestigationDetail(selectedCaseId),
        fetchCaseGraph(selectedCaseId)
      ])
        .then(([c, g]) => {
          setCurrentCase(c);
          setGraphData(g);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [selectedCaseId]);

  const handleSelectCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setCurrentTab('investigations');
  };

  const handleTriggerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const decision = await triggerNewInvestigation(triggerTxId, triggerReason);
      setShowTriggerModal(false);
      await loadData();
      setSelectedCaseId(decision.case_id);
      setCurrentTab('investigations');
    } catch (err) {
      alert(`Trigger failed: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-transparent text-[#F4F6F8] font-sans overflow-hidden select-none">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        demoMode={systemStatus?.demo_mode ?? true}
      />

      {/* Main Content Body */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar
          currentTab={currentTab}
          systemStatus={systemStatus}
          cases={cases}
          onRefresh={loadData}
          onOpenCommandPalette={() => setShowCommandPalette(true)}
          onSelectCase={handleSelectCase}
        />

        {/* Optional Entry Experience Banner */}
        {showHeroIntro && (
          <HeroIntro
            onDismiss={() => setShowHeroIntro(false)}
            onOpenCase={() => {
              if (cases.length > 0) handleSelectCase(cases[0].case_id);
              else setCurrentTab('investigations');
            }}
          />
        )}

        {/* View Switcher */}
        <main className="flex-1 overflow-hidden relative">
          {currentTab === 'overview' && (
            <OverviewView cases={cases} onSelectCase={handleSelectCase} />
          )}

          {currentTab === 'investigations' && (
            <InvestigationWorkspace
              currentCase={currentCase}
              graphData={graphData}
              onRefreshCase={loadData}
            />
          )}

          {currentTab === 'cases' && (
            <CasesQueueView
              cases={cases}
              onSelectCase={handleSelectCase}
              onTriggerNew={() => setShowTriggerModal(true)}
            />
          )}

          {currentTab === 'evidence' && <EvidenceView cases={cases} />}

          {currentTab === 'graph-explorer' && <GraphView graphData={graphData} />}

          {currentTab === 'case-memory' && <MemoryView />}

          {currentTab === 'policies' && <PoliciesView />}

          {currentTab === 'reports' && <ReportsView cases={cases} />}

          {currentTab === 'system' && <SystemView />}

          {currentTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onSelectCase={handleSelectCase}
        cases={cases}
      />

      {/* Trigger New Investigation Modal */}
      {showTriggerModal && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleTriggerSubmit}
            className="bg-[#10151C]/90 backdrop-blur-2xl border border-white/10 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-[#F4F6F8] font-mono uppercase tracking-caps">
                Trigger New Fraud Investigation
              </h3>
              <button
                type="button"
                onClick={() => setShowTriggerModal(false)}
                className="text-[#66707C] hover:text-white font-mono"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#66707C] mb-1.5 font-mono">
                Transaction ID:
              </label>
              <select
                value={triggerTxId}
                onChange={(e) => setTriggerTxId(e.target.value)}
                className="w-full bg-[#07090C] border border-white/10 rounded-lg p-2.5 text-xs text-[#F4F6F8] font-mono focus:outline-none focus:border-cyan-400"
              >
                <option value="TX-1001">TX-1001 ($4,950 - Shared Device)</option>
                <option value="TX-1002">TX-1002 ($8,900 - VPN Proxy IP)</option>
                <option value="TX-1003">TX-1003 ($120 - Ambiguous Step-Up)</option>
                <option value="TX-1004">TX-1004 ($14,500 - Crypto Exchange)</option>
                <option value="TX-1005">TX-1005 ($45.99 - Verified POS Purchase)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#66707C] mb-1.5 font-mono">
                Trigger Reason:
              </label>
              <input
                type="text"
                value={triggerReason}
                onChange={(e) => setTriggerReason(e.target.value)}
                placeholder="Describe reason for manual trigger..."
                className="w-full bg-[#07090C] border border-white/10 rounded-lg p-2.5 text-xs text-[#F4F6F8] font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2 font-mono">
              <button
                type="button"
                onClick={() => setShowTriggerModal(false)}
                className="px-4 py-2 rounded-lg text-xs text-[#66707C] hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-lg text-xs font-bold text-white luminous-button"
              >
                {loading ? 'Triggering...' : 'Launch Agent Investigation'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
