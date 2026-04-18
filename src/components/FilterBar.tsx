import { Search } from 'lucide-react';
import type { IntelType, ReviewStatus } from '../types/intel';

interface Props {
  activeTypes: Set<IntelType>;
  onToggleType: (t: IntelType) => void;
  search: string;
  onSearch: (s: string) => void;
  minConfidence: number;
  onMinConfidence: (n: number) => void;
  statusFilter: ReviewStatus | 'all';
  onStatusFilter: (s: ReviewStatus | 'all') => void;
  nodeCount: number;
}

const TYPE_COLORS: Record<IntelType, string> = {
  OSINT: '#3b82f6',
  HUMINT: '#f97316',
  IMINT: '#10b981',
};

export default function FilterBar({
  activeTypes, onToggleType, search, onSearch,
  minConfidence, onMinConfidence, statusFilter, onStatusFilter, nodeCount,
}: Props) {
  return (
    <div
      className="flex items-center gap-4 px-4 py-2 border-b shrink-0 flex-wrap"
      style={{ background: '#0a0f1e', borderColor: '#1e293b' }}
    >
      {/* Type pills */}
      <div className="flex gap-2">
        {(['OSINT', 'HUMINT', 'IMINT'] as IntelType[]).map(t => (
          <button
            key={t}
            onClick={() => onToggleType(t)}
            className="px-3 py-1 rounded text-xs font-mono font-bold border transition-all"
            style={{
              borderColor: TYPE_COLORS[t],
              color: activeTypes.has(t) ? '#020408' : TYPE_COLORS[t],
              background: activeTypes.has(t) ? TYPE_COLORS[t] : 'transparent',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-1 border rounded px-2 py-1" style={{ borderColor: '#1e293b' }}>
        <Search size={12} className="text-slate-500" />
        <input
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder="Search nodes..."
          className="bg-transparent text-xs font-mono text-slate-300 outline-none w-40 placeholder-slate-600"
        />
      </div>

      {/* Confidence slider */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-slate-500">MIN CONF:</span>
        <input
          type="range" min={0} max={100} value={minConfidence}
          onChange={e => onMinConfidence(Number(e.target.value))}
          className="w-24 accent-blue-500"
        />
        <span className="text-xs font-mono text-blue-400 w-8">{minConfidence}%</span>
      </div>

      {/* Status filter */}
      <select
        value={statusFilter}
        onChange={e => onStatusFilter(e.target.value as ReviewStatus | 'all')}
        className="text-xs font-mono bg-transparent border rounded px-2 py-1 text-slate-300 outline-none"
        style={{ borderColor: '#1e293b' }}
      >
        <option value="all">ALL STATUS</option>
        <option value="pending">PENDING</option>
        <option value="reviewed">REVIEWED</option>
        <option value="flagged">FLAGGED</option>
        <option value="dismissed">DISMISSED</option>
      </select>

      <span className="ml-auto text-xs font-mono text-slate-500">
        <span className="text-blue-400 font-bold">{nodeCount}</span> NODES VISIBLE
      </span>
    </div>
  );
}
