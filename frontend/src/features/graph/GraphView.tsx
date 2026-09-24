import React from 'react';
import type { GraphData } from '../../types';
import { InteractiveGraph } from '../../components/InteractiveGraph';

interface GraphViewProps {
  graphData: GraphData | null;
}

export const GraphView: React.FC<GraphViewProps> = ({ graphData }) => {
  return (
    <div className="h-full flex flex-col bg-[#07090C] overflow-hidden select-none">
      <div className="h-14 glass-surface border-b border-white/10 px-6 flex items-center justify-between shrink-0 z-10">
        <div>
          <div className="text-[10px] font-mono text-cyan-400 font-semibold uppercase tracking-caps">
            GRAPH EXPLORER / TIGERGRAPH GSQL CANVASES
          </div>
          <h1 className="text-sm font-bold font-display text-[#F4F6F8]">
            Full Network Graph Canvas
          </h1>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <InteractiveGraph graphData={graphData} />
      </div>
    </div>
  );
};
