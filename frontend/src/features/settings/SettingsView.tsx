import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Lock } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [demoMode, setDemoMode] = useState(true);
  const [tgHost, setTgHost] = useState('https://demo.i.tgcloud.io');
  const [tgGraph, setTgGraph] = useState('FraudInvestigationGraph');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="h-full overflow-y-auto p-6 space-y-5 bg-[#07090C] select-none">
      <div className="space-y-1">
        <div className="text-[11px] font-mono text-cyan-400 font-semibold uppercase tracking-caps flex items-center gap-2">
          <SettingsIcon className="w-3.5 h-3.5" />
          SETTINGS / PLATFORM CONFIGURATION
        </div>
        <h1 className="text-xl font-bold font-display text-[#F4F6F8] tracking-heading-lg">
          Connection Credentials & Execution Mode
        </h1>
      </div>

      <form onSubmit={handleSave} className="solid-panel rounded-xl p-6 space-y-4 max-w-xl">
        <div className="flex items-center justify-between p-3 bg-[#07090C] border border-white/5 rounded-xl text-xs font-mono">
          <span className="text-[#F4F6F8] font-bold flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" /> DEMO MODE (Local Graph Adapter)
          </span>
          <input
            type="checkbox"
            checked={demoMode}
            onChange={(e) => setDemoMode(e.target.checked)}
            className="w-4 h-4 accent-cyan-400 cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-[#66707C] mb-1">TigerGraph Host URL:</label>
          <input
            type="text"
            value={tgHost}
            onChange={(e) => setTgHost(e.target.value)}
            className="w-full bg-[#07090C] border border-white/10 rounded-lg p-2.5 text-xs text-[#F4F6F8] font-mono focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-[#66707C] mb-1">Graph Name:</label>
          <input
            type="text"
            value={tgGraph}
            onChange={(e) => setTgGraph(e.target.value)}
            className="w-full bg-[#07090C] border border-white/10 rounded-lg p-2.5 text-xs text-[#F4F6F8] font-mono focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="pt-2 flex items-center justify-between font-mono">
          {saved && <span className="text-xs text-emerald-400 font-bold">✓ Configuration Saved</span>}
          <button
            type="submit"
            className="luminous-button px-5 py-2 rounded-xl text-xs font-bold text-cyan-300 flex items-center gap-2 ml-auto"
          >
            <Save className="w-4 h-4" /> Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};
