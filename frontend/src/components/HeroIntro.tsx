import React from 'react';
import { ArrowRight, Activity, Network, Brain } from 'lucide-react';

interface HeroIntroProps {
  onDismiss: () => void;
  onOpenCase: () => void;
}

export const HeroIntro: React.FC<HeroIntroProps> = ({ onDismiss, onOpenCase }) => {
  return (
    <div className="relative w-full bg-[#040406] border-b border-red-500/20 overflow-hidden select-none">
      {/* Diffused Atmospheric Lighting: Crimson Red & Deep Burgundy */}
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-rose-900/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        {/* Left Editorial Text (MoneyInCheck Style) */}
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-3 font-mono text-[11px] text-red-400 font-semibold tracking-caps uppercase">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span className="text-zinc-500">[GRID A-01]</span>
            <span>MONEY IN CHECK — THE STRATEGIC BOARD OF FRAUD</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif-editorial italic font-normal text-[#F4F6F8] tracking-tight leading-tight">
            "Every move on the page echoes a move in the game."
          </h1>
          <p className="text-xs text-[#A1A1AA] font-sans leading-relaxed">
            Multi-agent swarm intelligence grounded in TigerGraph GSQL graph traversal, GraphRAG reasoning, and deterministic compliance policies.
          </p>
        </div>

        {/* Right Feature Highlights & Launch Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <div className="flex items-center gap-3 bg-[#0A0A0E] border border-red-500/20 rounded-xl px-3.5 py-2 text-xs font-mono text-zinc-300 shadow-sm">
            <div className="flex items-center gap-1.5 text-red-400 font-bold">
              <Network className="w-3.5 h-3.5" />
              <span>GSQL Graph</span>
            </div>
            <div className="h-3.5 w-px bg-white/10"></div>
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Brain className="w-3.5 h-3.5" />
              <span>Swarm AI</span>
            </div>
            <div className="h-3.5 w-px bg-white/10"></div>
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Activity className="w-3.5 h-3.5" />
              <span>POL-101</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCase}
              className="luminous-button text-red-200 font-mono text-xs font-bold px-4.5 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg"
            >
              <span>Explore Live Case</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onDismiss}
              className="px-3 py-2 rounded-xl text-xs font-mono text-[#71717A] hover:text-[#F4F6F8] hover:bg-white/5 transition-colors"
              title="Dismiss Intro Header"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
