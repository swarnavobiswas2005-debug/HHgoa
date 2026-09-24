import React, { useEffect, useState } from 'react';
import { Activity, Database, Brain, Cpu } from 'lucide-react';
import type { SystemStatus } from '../../types';
import { fetchSystemStatus } from '../../api';

export const SystemView: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus | null>(null);

  useEffect(() => {
    fetchSystemStatus().then(setStatus).catch(console.error);
  }, []);

  return (
    <div className="h-full overflow-y-auto p-6 space-y-5 bg-[#07090C] select-none">
      <div className="space-y-1">
        <div className="text-[11px] font-mono text-cyan-400 font-semibold uppercase tracking-caps flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          SYSTEM HEALTH / COMPONENT TELEMETRY
        </div>
        <h1 className="text-xl font-bold font-display text-[#F4F6F8] tracking-heading-lg">
          Platform Architecture Telemetry
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
        <div className="solid-panel rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#66707C]">
            <span>TIGERGRAPH DATABASE</span>
            <Database className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-sm font-bold text-emerald-400 font-mono">
            {status?.tigergraph?.status || 'CONNECTED_LOCAL_ADAPTER'}
          </div>
          <div className="text-xs text-[#9AA3AE] font-mono">
            Host: {status?.tigergraph?.host || 'https://demo.i.tgcloud.io'}
          </div>
        </div>

        <div className="solid-panel rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#66707C]">
            <span>SPECIALIST AGENT LLM</span>
            <Brain className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-sm font-bold text-[#F4F6F8] font-mono">
            {status?.llm?.model || 'gpt-4o-mini'}
          </div>
          <div className="text-xs text-[#9AA3AE] font-mono">
            Provider: {status?.llm?.provider || 'openai'}
          </div>
        </div>

        <div className="solid-panel rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#66707C]">
            <span>MCP SERVER LAYER</span>
            <Cpu className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-sm font-bold text-amber-400 font-mono">
            {status?.mcp_server?.status || 'ACTIVE'}
          </div>
          <div className="text-xs text-[#9AA3AE] font-mono">
            URL: {status?.mcp_server?.url || 'http://localhost:8001'}
          </div>
        </div>
      </div>
    </div>
  );
};
