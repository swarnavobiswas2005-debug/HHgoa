import React, { useEffect, useState } from 'react';
import { History, Search } from 'lucide-react';
import type { SimilarCaseMatch } from '../../types';
import { fetchSimilarCases } from '../../api';

export const MemoryView: React.FC = () => {
  const [query, setQuery] = useState('Shared device ring fraud');
  const [similarCases, setSimilarCases] = useState<SimilarCaseMatch[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await fetchSimilarCases('CASE-1001');
      setSimilarCases(res);
    } catch (e) {
      console.error('Error querying case memory:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="h-full overflow-y-auto p-6 space-y-5 bg-[#07090C] select-none">
      <div className="space-y-1">
        <div className="text-[11px] font-mono text-cyan-400 font-semibold uppercase tracking-caps flex items-center gap-2">
          <History className="w-3.5 h-3.5" />
          CASE MEMORY / HISTORICAL VECTOR REPOSITORY
        </div>
        <h1 className="text-xl font-bold font-display text-[#F4F6F8] tracking-heading-lg">
          Similar Historical Cases
        </h1>
        <p className="text-xs text-[#9AA3AE]">
          Retrieve precedents using graph structure embeddings and transaction vector similarity.
        </p>
      </div>

      <div className="flex gap-3 max-w-xl">
        <div className="flex-1 bg-[#0B0F14] border border-white/10 rounded-xl px-3 py-2 flex items-center text-xs font-mono">
          <Search className="w-4 h-4 text-[#66707C] mr-2 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search case memory..."
            className="w-full bg-transparent text-[#F4F6F8] focus:outline-none"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="luminous-button px-4 py-2 rounded-xl text-xs font-mono font-bold text-cyan-300 shrink-0"
        >
          {loading ? 'Searching...' : 'Find Matches'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {similarCases.map((match) => (
          <div key={match.case_id} className="solid-panel rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-cyan-400 font-bold">{match.case_id}</span>
              <span className="px-2.5 py-0.5 rounded bg-blue-950/60 text-cyan-300 border border-blue-800/60 font-bold">
                {Math.round(match.similarity_score * 100)}% SIMILARITY
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold text-[#F4F6F8]">
                Matching Patterns: {match.matching_patterns.join(', ') || 'Shared Device'}
              </div>
              <p className="text-xs text-[#9AA3AE] leading-relaxed">
                Entities matched: {match.matching_entities.join(', ')}
              </p>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
              <span className="text-[#66707C]">Previous Outcome:</span>
              <span className="text-emerald-400 font-bold">{match.previous_outcome}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
