import { useState, useRef, useEffect } from 'react';
import { Database, ChevronDown, ChevronRight } from 'lucide-react';
import { fetchMongoNodes, type MongoStatus, type MongoLog } from '../services/mongoService';
import type { IntelNode } from '../types/intel';

interface Props {
  onNodesLoaded: (nodes: IntelNode[]) => void;
  loaded: boolean;
}

export default function MongoPanel({ onNodesLoaded, loaded }: Props) {
  const [open, setOpen] = useState(true);
  const [status, setStatus] = useState<MongoStatus>('disconnected');
  const [logs, setLogs] = useState<MongoLog[]>([]);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  const connect = async () => {
    if (status === 'connecting') return;
    setLogs([]);
    const nodes = await fetchMongoNodes(
      log => setLogs(prev => [...prev, log]),
      setStatus
    );
    onNodesLoaded(nodes);
  };

  const statusColor = { disconnected: '#ef4444', connecting: '#f59e0b', connected: '#10b981', error: '#ef4444' }[status];

  return (
    <div className="border-b" style={{ borderColor: '#1e293b' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-mono hover:bg-slate-800 transition-colors"
      >
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        <Database size={12} className="text-blue-400" />
        <span className="text-slate-300">MONGODB</span>
        <span className="ml-auto w-2 h-2 rounded-full" style={{ background: statusColor }} />
        {loaded && <span className="text-green-400 text-xs">✓</span>}
      </button>

      {open && (
        <div className="px-3 pb-3 space-y-2">
          <div className="text-slate-600 text-xs font-mono space-y-0.5">
            <div>HOST: intel-db.cyberjoar.internal:27017</div>
            <div>DB: intel_nodes | AUTH: SCRAM-SHA-256</div>
          </div>

          <div
            ref={logRef}
            className="rounded p-2 h-28 overflow-y-auto text-xs font-mono"
            style={{ background: '#020408', border: '1px solid #1e293b' }}
          >
            {logs.length === 0 && (
              <span className="text-slate-700">// awaiting connection...</span>
            )}
            {logs.map((l, i) => (
              <div key={i} style={{ color: l.level === 'success' ? '#10b981' : l.level === 'error' ? '#ef4444' : l.level === 'warn' ? '#f59e0b' : '#94a3b8' }}>
                <span className="text-slate-700">[{l.time}] </span>{l.message}
              </div>
            ))}
            {status === 'connecting' && (
              <span className="text-yellow-400 animate-pulse">▋</span>
            )}
          </div>

          <button
            onClick={connect}
            disabled={status === 'connecting'}
            className="w-full py-1.5 rounded text-xs font-mono font-bold border transition-colors disabled:opacity-50"
            style={{ borderColor: '#3b82f6', color: '#3b82f6' }}
          >
            {status === 'connecting' ? '⟳ SYNCING...' : status === 'connected' ? '↻ SYNC LATEST' : '⚡ CONNECT & FETCH'}
          </button>
        </div>
      )}
    </div>
  );
}
