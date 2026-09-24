import React, { useEffect, useRef, useState } from 'react';
import { Network as VisNetwork } from 'vis-network/standalone';
import { ZoomIn, ZoomOut, Maximize2, Filter, Sparkles } from 'lucide-react';
import type { GraphData, GraphNode } from '../types';

interface InteractiveGraphProps {
  graphData: GraphData | null;
  onSelectNode?: (node: GraphNode | null) => void;
}

export const InteractiveGraph: React.FC<InteractiveGraphProps> = ({
  graphData,
  onSelectNode,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<any>(null);
  const [selectedEntity, setSelectedEntity] = useState<GraphNode | null>(null);
  const [nodeFilter, setNodeFilter] = useState<string>('ALL');

  useEffect(() => {
    if (!containerRef.current || !graphData) return;

    const filteredNodes = graphData.nodes.filter(n => nodeFilter === 'ALL' || n.type === nodeFilter);
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredEdges = graphData.edges.filter(e => nodeIds.has(e.source) && nodeIds.has(e.target));

    const nodesDataset = filteredNodes.map(n => {
      let color = '#ef4444'; // crimson red accent default
      let shape = 'dot';
      let size = 22;

      switch (n.type) {
        case 'Customer':
          color = '#a855f7'; // purple
          shape = 'diamond';
          size = 26;
          break;
        case 'Account':
          color = '#10b981'; // emerald
          shape = 'square';
          size = 22;
          break;
        case 'Transaction':
          color = n.risk_score && n.risk_score > 0.7 ? '#ef4444' : '#f43f5e';
          shape = 'dot';
          size = 24;
          break;
        case 'Device':
          color = n.risk_score && n.risk_score > 0.7 ? '#ef4444' : '#f59e0b';
          shape = 'triangle';
          size = 24;
          break;
        case 'IPAddress':
          color = '#06b6d4'; // cyan
          shape = 'hexagon';
          size = 20;
          break;
        case 'Merchant':
          color = '#ec4899'; // pink
          shape = 'star';
          size = 22;
          break;
      }

      const isSelected = selectedEntity?.id === n.id;

      return {
        id: n.id,
        label: `${n.type}\n${n.id}`,
        shape,
        size: isSelected ? size + 6 : size,
        color: {
          background: color,
          border: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
          highlight: { background: color, border: '#ffffff' }
        },
        font: {
          color: '#0f172a',
          size: 11,
          face: 'Space Mono',
          background: 'rgba(255, 255, 255, 0.9)',
          strokeWidth: 2,
          strokeColor: '#f8fafc',
          vadjust: 6
        },
        shadow: isSelected ? { enabled: true, color: color, size: 24, x: 0, y: 0 } : false
      };
    });

    const edgesDataset = filteredEdges.map(e => {
      const isConnectedToSelected = selectedEntity && (e.source === selectedEntity.id || e.target === selectedEntity.id);
      const cleanRelName = e.relationship.replace(/_/g, ' ');

      return {
        from: e.source,
        to: e.target,
        label: cleanRelName,
        font: {
          color: isConnectedToSelected ? '#10b981' : '#64748b',
          size: 10,
          face: 'Space Mono',
          background: 'rgba(255, 255, 255, 0.95)',
          strokeWidth: 2,
          strokeColor: '#f8fafc',
          align: 'horizontal'
        },
        color: {
          color: isConnectedToSelected ? '#10b981' : 'rgba(16, 185, 129, 0.35)',
          highlight: '#10b981'
        },
        width: isConnectedToSelected ? 2.5 : 1.2,
        arrows: { to: { enabled: true, scaleFactor: 0.6 } }
      };
    });

    const options = {
      physics: {
        solver: 'forceAtlas2Based',
        forceAtlas2Based: {
          gravitationalConstant: -60,
          centralGravity: 0.005,
          springLength: 220, // spread out nodes so labels do not overlap!
          springConstant: 0.05,
          damping: 0.4
        },
        maxVelocity: 50,
        minVelocity: 0.1,
        stabilization: { iterations: 200 }
      },
      edges: {
        smooth: {
          enabled: true,
          type: 'continuous',
          roundness: 0.2
        }
      },
      interaction: {
        hover: true,
        tooltipDelay: 100,
        zoomView: true,
        dragView: true
      }
    };

    const data = { nodes: nodesDataset, edges: edgesDataset };
    networkRef.current = new VisNetwork(containerRef.current, data, options);

    networkRef.current.on('click', (params: any) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const found = graphData.nodes.find(n => n.id === nodeId) || null;
        setSelectedEntity(found);
        if (onSelectNode) onSelectNode(found);
      } else {
        setSelectedEntity(null);
        if (onSelectNode) onSelectNode(null);
      }
    });

    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [graphData, nodeFilter, selectedEntity?.id]);

  const handleZoomIn = () => {
    if (networkRef.current) {
      const scale = networkRef.current.getScale();
      networkRef.current.moveTo({ scale: scale * 1.3 });
    }
  };

  const handleZoomOut = () => {
    if (networkRef.current) {
      const scale = networkRef.current.getScale();
      networkRef.current.moveTo({ scale: scale / 1.3 });
    }
  };

  const handleFitView = () => {
    if (networkRef.current) {
      networkRef.current.fit({ animation: true });
    }
  };

  return (
    <div className="relative w-full h-full graph-hero-canvas border-r border-white/10 overflow-hidden flex flex-col select-none">
      {/* Top Graph Controls Bar */}
      <div className="absolute top-4 left-4 z-10 glass-surface p-1.5 rounded-xl flex items-center gap-2 shadow-xl">
        <button
          onClick={handleZoomIn}
          className="p-1.5 rounded-lg text-[#9AA3AE] hover:text-[#F4F6F8] hover:bg-white/10 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-1.5 rounded-lg text-[#9AA3AE] hover:text-[#F4F6F8] hover:bg-white/10 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleFitView}
          className="p-1.5 rounded-lg text-[#9AA3AE] hover:text-[#F4F6F8] hover:bg-white/10 transition-colors"
          title="Fit Network View"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-white/10 mx-1"></div>

        {/* Entity Type Filter */}
        <div className="flex items-center gap-1.5 text-xs text-[#9AA3AE] font-mono">
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
          <select
            value={nodeFilter}
            onChange={(e) => setNodeFilter(e.target.value)}
            className="bg-[#0B0F14] border border-white/10 rounded-lg text-[11px] px-2.5 py-1 text-[#F4F6F8] font-mono focus:outline-none"
          >
            <option value="ALL">All Entities</option>
            <option value="Customer">Customer</option>
            <option value="Account">Account</option>
            <option value="Transaction">Transaction</option>
            <option value="Device">Device</option>
            <option value="IPAddress">IP Address</option>
            <option value="Merchant">Merchant</option>
          </select>
        </div>
      </div>

      {/* Network Canvas */}
      <div ref={containerRef} className="w-full h-full min-h-[420px] cursor-crosshair"></div>

      {/* Selected Entity Inspector Side Drawer Overlay (Rule 22) */}
      {selectedEntity && (
        <div className="absolute bottom-4 right-4 z-10 w-80 glass-modal rounded-xl p-4 shadow-2xl animate-fade-up">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold font-mono uppercase tracking-caps text-[#F4F6F8]">
                {selectedEntity.type} Inspector
              </span>
            </div>
            <button
              onClick={() => setSelectedEntity(null)}
              className="text-xs text-[#66707C] hover:text-[#F4F6F8] font-mono"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-[#66707C]">Entity ID:</span>
              <span className="text-cyan-400 font-bold">{selectedEntity.id}</span>
            </div>
            {selectedEntity.risk_score !== undefined && (
              <div className="flex justify-between">
                <span className="text-[#66707C]">Risk Score:</span>
                <span className={selectedEntity.risk_score > 0.7 ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {(selectedEntity.risk_score * 100).toFixed(0)}%
                </span>
              </div>
            )}
            <div className="pt-2 border-t border-white/5 space-y-1">
              <div className="text-[10px] text-[#66707C] uppercase font-bold">Graph Properties:</div>
              {Object.entries(selectedEntity.properties || {}).map(([k, v]) => (
                <div key={k} className="flex justify-between text-[11px]">
                  <span className="text-[#66707C]">{k}:</span>
                  <span className="text-[#F4F6F8] truncate max-w-[140px]">{String(v)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
