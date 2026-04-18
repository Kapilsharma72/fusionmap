import { useState, useRef, useEffect } from 'react';
import { Cloud, ChevronDown, ChevronRight } from 'lucide-react';
import { fetchS3Nodes, type S3Status, type S3Log } from '../services/s3Service';
import type { IntelNode } from '../types/intel';

interface Props {
  onNodesLoaded: (nodes: IntelNode[]) => void;
  loaded: boolean;
}

export default function S3Panel({ onNodesLoaded, loaded }: Props) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<S3Status>('disconnected');
  const [logs, setLogs] = useState<S3Log[]>([]);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  const connect = async () => {
    if (status === 'connecting') return;
    setLogs([]);
    const nodes = await fetchS3Nodes(
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
        <Cloud size={12} className="text-orange-400" />
        <span className="text-slate-300">AWS S3</span>
        <span className="ml-auto w-2 h-2 rounded-full" style={{ background: statusColor }} />
        {loaded && <span className="text-green-400 text-xs">✓</span>}
      </button>

      {open && (
        <div className="px-3 pb-3 space-y-2">
          <div className="text-slate-600 text-xs font-mono space-y-0.5">
            <div>BUCKET: cyberjoar-intel</div>
            <div>REGION: ap-south-1 | PREFIX: imint/</div>
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
            style={{ borderColor: '#f97316', color: '#f97316' }}
          >
            {status === 'connecting' ? '⟳ SCANNING...' : status === 'connected' ? '↻ REFRESH BUCKET' : '☁ CONNECT S3'}
          </button>
        </div>
      )}
    </div>
  );
}
