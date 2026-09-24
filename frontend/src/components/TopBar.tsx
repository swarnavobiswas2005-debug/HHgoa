import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Bell,
  Server,
  RefreshCw,
  Command,
  Clock,
  Wifi,
  AlertTriangle,
  CheckCircle2,
  Activity,
  ShieldAlert,
  X,
  Check
} from 'lucide-react';
import type { SystemStatus, FraudCase } from '../types';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  category: 'CRITICAL' | 'WARNING' | 'INFO' | 'SUCCESS';
  caseId?: string;
  read: boolean;
}

interface TopBarProps {
  currentTab: string;
  systemStatus: SystemStatus | null;
  cases?: FraudCase[];
  onRefresh: () => void;
  onOpenCommandPalette: () => void;
  onSelectCase?: (caseId: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  systemStatus,
  cases = [],
  onRefresh,
  onOpenCommandPalette,
  onSelectCase
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [filterTab, setFilterTab] = useState<'ALL' | 'UNREAD' | 'CRITICAL'>('ALL');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initial seed notifications derived from live platform state
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'CRITICAL FRAUD DETECTED',
      message: 'CASE-004821: Shared device ring detected across 2 high-risk accounts ($4,950)',
      timestamp: '2m ago',
      category: 'CRITICAL',
      caseId: 'CASE-004821',
      read: false
    },
    {
      id: 'notif-2',
      title: 'ANALYST APPROVAL REQUIRED',
      message: 'CASE-004822: POL-101 requires manual authorization for account block ($8,900)',
      timestamp: '14m ago',
      category: 'WARNING',
      caseId: 'CASE-004822',
      read: false
    },
    {
      id: 'notif-3',
      title: 'GSQL GRAPH EXPANSION COMPLETE',
      message: 'TigerGraph 2-hop neighborhood query finished in 12ms (9 nodes, 10 edges)',
      timestamp: '28m ago',
      category: 'INFO',
      read: false
    },
    {
      id: 'notif-4',
      title: 'OUT-OF-BAND SMS STEP-UP PASSED',
      message: 'Customer responded successfully to identity verification challenge',
      timestamp: '1h ago',
      category: 'SUCCESS',
      caseId: 'CASE-004823',
      read: true
    }
  ]);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST');
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update notifications dynamically if new high risk cases arrive
  useEffect(() => {
    if (cases.length > 0) {
      const highRisk = cases.filter(c => c.risk_level === 'CRITICAL' || c.risk_level === 'HIGH');
      if (highRisk.length > 0) {
        const first = highRisk[0];
        setNotifications(prev => {
          if (prev.some(n => n.caseId === first.case_id)) return prev;
          return [
            {
              id: `notif-${first.case_id}`,
              title: `${first.risk_level} RISK ALERT`,
              message: `${first.case_id}: ${first.trigger}`,
              timestamp: 'Just now',
              category: first.risk_level === 'CRITICAL' ? 'CRITICAL' : 'WARNING',
              caseId: first.case_id,
              read: false
            },
            ...prev
          ];
        });
      }
    }
  }, [cases]);

  // Click outside to close notification dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleToggleRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    if (notif.caseId && onSelectCase) {
      onSelectCase(notif.caseId);
      setShowNotifications(false);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filterTab === 'UNREAD') return !n.read;
    if (filterTab === 'CRITICAL') return n.category === 'CRITICAL';
    return true;
  });

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'overview': return 'Fraud Operations Overview';
      case 'investigations': return '3-Zone Agentic Investigation Workspace';
      case 'cases': return 'Fraud Case Directory & Queue';
      case 'evidence': return 'Evidence Records & Information Repository';
      case 'graph-explorer': return 'TigerGraph Network Canvas';
      case 'case-memory': return 'Historical Case Memory & Similarity Search';
      case 'policies': return 'Deterministic Policy & Compliance Directory';
      case 'reports': return 'Platform Audit Trail & Reports Exporter';
      case 'system': return 'System Health & Component Telemetry';
      case 'settings': return 'Platform Credentials & Configuration';
      default: return 'Fraud Intelligence Platform';
    }
  };

  return (
    <header className="h-14 bg-[#0A0A0E]/95 backdrop-blur-xl border-b border-red-500/15 px-6 flex items-center justify-between shrink-0 select-none z-50 relative">
      {/* Page Title & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <div className="text-xs text-[#71717A] uppercase tracking-caps font-mono flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          SOC /
        </div>
        <h1 className="text-xs font-semibold text-[#F4F6F8] tracking-heading-md font-sans flex items-center gap-2 font-display">
          {getTabTitle(currentTab)}
        </h1>
      </div>

      {/* Global Controls & Status */}
      <div className="flex items-center gap-3">
        {/* Live Clock Ticker */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-[#111116] border border-red-500/20 rounded-xl text-[11px] text-[#A1A1AA] font-mono shadow-sm">
          <Clock className="w-3.5 h-3.5 text-red-500" />
          <span className="text-[#F4F6F8] font-bold">{timeStr || '12:00:00 IST'}</span>
        </div>

        {/* Command Palette Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 bg-[#111116] border border-red-500/20 rounded-xl px-3 py-1.5 text-xs text-[#A1A1AA] hover:text-[#F4F6F8] hover:border-red-500/50 transition-all font-mono shadow-sm"
        >
          <Search className="w-3.5 h-3.5 text-red-500" />
          <span className="hidden sm:inline font-sans">Type command or search...</span>
          <span className="text-[10px] bg-red-950/80 border border-red-500/40 px-1.5 py-0.5 rounded text-red-300 flex items-center gap-0.5 ml-2 font-bold">
            <Command className="w-2.5 h-2.5" /> K
          </span>
        </button>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          className="p-1.5 rounded-xl bg-[#111116] border border-red-500/20 text-[#A1A1AA] hover:text-[#F4F6F8] hover:bg-red-950/30 transition-colors"
          title="Refresh Platform Data"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* System Health Chip */}
        <div className="flex items-center gap-2 px-2.5 py-1 bg-[#111116] border border-red-500/20 rounded-xl text-xs text-[#A1A1AA] font-mono">
          <Server className="w-3.5 h-3.5 text-red-400" />
          <span>TG: {systemStatus?.demo_mode ? 'LOCAL_NODE' : 'CLUSTER_ONLINE'}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 pulse-red"></span>
        </div>

        {/* Network Ping */}
        <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-red-400 bg-red-950/50 border border-red-500/30 px-2 py-1 rounded-xl">
          <Wifi className="w-3 h-3" />
          <span>12ms</span>
        </div>

        {/* Notifications Button & Container */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-xl border transition-all ${
              showNotifications
                ? 'bg-red-950/80 border-red-500 text-red-400 shadow-xl'
                : 'bg-[#111116] border-red-500/20 text-[#A1A1AA] hover:text-[#F4F6F8] hover:border-red-500/40'
            }`}
            title="SOC Notifications & Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white font-mono text-[9px] font-extrabold flex items-center justify-center pulse-red">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Interactive Notifications Center Dropdown Flyout */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-96 sm:w-[420px] bg-[#0A0A0E] rounded-xl border-2 border-red-500/40 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] z-[100] overflow-hidden animate-fade-up">
              {/* Header */}
              <div className="p-3.5 border-b border-red-500/25 bg-[#050505] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-extrabold font-display uppercase tracking-wider text-[#F4F6F8]">
                    SOC Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="text-[9px] bg-red-950/90 border border-red-500/50 text-red-300 px-2 py-0.5 rounded font-mono font-bold">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[10px] text-red-400 hover:underline font-mono font-bold"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-zinc-400 hover:text-white p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center border-b border-red-500/15 bg-[#111116] px-3.5 py-2 gap-2 font-mono text-[10px]">
                <button
                  onClick={() => setFilterTab('ALL')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    filterTab === 'ALL' ? 'bg-red-950 text-red-400 font-bold border border-red-500/50' : 'text-zinc-400 hover:text-white bg-[#0A0A0E]'
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setFilterTab('UNREAD')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    filterTab === 'UNREAD' ? 'bg-red-950 text-red-400 font-bold border border-red-500/50' : 'text-zinc-400 hover:text-white bg-[#0A0A0E]'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
                <button
                  onClick={() => setFilterTab('CRITICAL')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    filterTab === 'CRITICAL' ? 'bg-red-950 text-red-400 font-bold border border-red-500/50' : 'text-zinc-400 hover:text-white bg-[#0A0A0E]'
                  }`}
                >
                  Critical ({notifications.filter(n => n.category === 'CRITICAL').length})
                </button>
              </div>

              {/* Notification Items List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-white/5 bg-[#0A0A0E]">
                {filteredNotifications.length === 0 ? (
                  <div className="p-6 text-center text-xs font-mono text-zinc-500">
                    No notifications in this category.
                  </div>
                ) : (
                  filteredNotifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`p-3.5 transition-colors cursor-pointer flex items-start gap-3 hover:bg-red-950/30 ${
                        !notif.read ? 'bg-[#140A0F]' : 'bg-[#0A0A0E] opacity-75'
                      }`}
                    >
                      {/* Category Icon */}
                      <div className="mt-0.5 shrink-0">
                        {notif.category === 'CRITICAL' && <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />}
                        {notif.category === 'WARNING' && <ShieldAlert className="w-4 h-4 text-amber-400" />}
                        {notif.category === 'INFO' && <Activity className="w-4 h-4 text-red-400" />}
                        {notif.category === 'SUCCESS' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-[11px] font-bold font-mono ${
                            notif.category === 'CRITICAL' ? 'text-red-400' : 'text-[#F4F6F8]'
                          }`}>
                            {notif.title}
                          </span>
                          <span className="text-[9px] text-zinc-500 font-mono">{notif.timestamp}</span>
                        </div>
                        <p className="text-xs text-zinc-300 font-sans leading-snug line-clamp-2">
                          {notif.message}
                        </p>

                        {notif.caseId && (
                          <div className="pt-1 flex items-center gap-1.5">
                            <span className="text-[10px] text-red-400 font-mono font-bold hover:underline">
                              Investigate {notif.caseId} →
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Toggle Read */}
                      <button
                        onClick={(e) => handleToggleRead(notif.id, e)}
                        className={`p-1 rounded hover:bg-white/10 ${notif.read ? 'text-zinc-600' : 'text-red-400'}`}
                        title={notif.read ? 'Mark as unread' : 'Mark as read'}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="p-2.5 border-t border-red-500/15 bg-[#050505] flex items-center justify-between text-[10px] font-mono">
                <span className="text-zinc-500">Live SOC Feed Active</span>
                <button
                  onClick={() => setNotifications([])}
                  className="text-zinc-400 hover:text-red-400 transition-colors font-bold"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
