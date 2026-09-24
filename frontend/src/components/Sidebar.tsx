import React from 'react';
import {
  LayoutDashboard,
  ListFilter,
  Network,
  ShieldCheck,
  Activity,
  History,
  FileCheck2,
  FileSpreadsheet,
  Settings as SettingsIcon,
  ShieldAlert,
  Server,
  UserCheck
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  demoMode: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab, demoMode: _demoMode }) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'investigations', label: 'Investigations', icon: Network, badge: 'LIVE' },
    { id: 'cases', label: 'Cases Queue', icon: ListFilter },
    { id: 'evidence', label: 'Evidence', icon: FileCheck2 },
    { id: 'graph-explorer', label: 'Graph Explorer', icon: Network },
    { id: 'case-memory', label: 'Case Memory', icon: History },
    { id: 'policies', label: 'Policies', icon: ShieldCheck },
    { id: 'reports', label: 'Reports & Audit', icon: FileSpreadsheet },
    { id: 'system', label: 'System', icon: Activity },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="w-60 glass-sidebar flex flex-col h-screen select-none shrink-0 z-20">
      {/* Platform Branding Header */}
      <div className="p-4 border-b border-red-500/15 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 shrink-0 pulse-red">
          <ShieldAlert className="w-4 h-4" />
        </div>
        <div>
          <div className="font-bold text-xs tracking-heading-md text-[#F4F6F8] font-display uppercase tracking-wider">
            AEGIS FRAUD SOC
          </div>
          <div className="text-[10px] text-[#A1A1AA] flex items-center gap-1 font-mono mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            TigerGraph v1.0
          </div>
        </div>
      </div>

      {/* Production Status Engine Banner */}
      <div className="mx-3 mt-3 px-3 py-1.5 bg-red-950/30 border border-red-500/30 rounded-lg flex items-center justify-between text-xs text-red-200">
        <span className="font-semibold flex items-center gap-1.5 font-mono text-[10px]">
          <ShieldAlert className="w-3 h-3 text-red-400 animate-pulse" /> PRODUCTION SOC
        </span>
        <span className="text-[9px] bg-red-950/80 px-1.5 py-0.5 rounded font-mono font-bold border border-red-500/50 text-red-400">
          LIVE
        </span>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        <div className="px-3 text-[10px] font-semibold text-[#71717A] uppercase tracking-caps mb-2 font-mono">
          Operational Views
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'glass-nav-active text-red-400 font-bold'
                  : 'text-[#A1A1AA] hover:bg-red-950/20 hover:text-[#F4F6F8]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-red-500' : 'text-zinc-500'}`} />
                <span className="font-sans">{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] bg-red-950/80 text-red-300 border border-red-600/60 px-1.5 py-0.5 rounded font-mono font-bold animate-pulse">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer System Status & User */}
      <div className="p-3 border-t border-red-500/15 bg-[#050505]/80 space-y-2 text-xs text-[#A1A1AA]">
        <div className="flex items-center justify-between text-[10px] font-mono px-1">
          <span className="flex items-center gap-1.5 text-[#71717A]">
            <Server className="w-3 h-3 text-emerald-400" /> SUPABASE DB
          </span>
          <span className="text-emerald-500 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            CONNECTED
          </span>
        </div>

        <div className="flex items-center gap-2.5 pt-1 border-t border-white/5">
          <div className="w-7 h-7 rounded-full bg-red-950/60 border border-red-500/40 flex items-center justify-center text-xs font-bold text-red-400 font-mono">
            FA
          </div>
          <div>
            <div className="text-[#F4F6F8] font-medium text-xs font-sans flex items-center gap-1">
              <span>Analyst #001</span>
              <UserCheck className="w-3 h-3 text-red-400" />
            </div>
            <div className="text-[10px] text-[#71717A] font-mono">Senior Crime Specialist</div>
          </div>
        </div>
      </div>
    </div>
  );
};
