import { useEffect, useState } from 'react';
import type { IntelNode } from '../types/intel';

interface Props {
  nodes: IntelNode[];
}

export default function SummaryBar({ nodes }: Props) {
  const [utc, setUtc] = useState('');

  useEffect(() => {
    const tick = () => setUtc(new Date().toUTCString().slice(0, 25) + ' UTC');
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const count = (pred: (n: IntelNode) => boolean) => nodes.filter(pred).length;

  return (
    <div
      className="flex items-center gap-4 px-4 py-1.5 border-t shrink-0 flex-wrap text-xs font-mono"
      style={{ background: '#0a0f1e', borderColor: '#1e293b' }}
    >
      <Stat label="TOTAL" value={nodes.length} color="#94a3b8" />
      <Sep />
      <Stat label="OSINT" value={count(n => n.type === 'OSINT')} color="#3b82f6" />
      <Stat label="HUMINT" value={count(n => n.type === 'HUMINT')} color="#f97316" />
      <Stat label="IMINT" value={count(n => n.type === 'IMINT')} color="#10b981" />
      <Sep />
      <Stat label="HIGH" value={count(n => n.confidenceLevel === 'HIGH')} color="#10b981" />
      <Stat label="MED" value={count(n => n.confidenceLevel === 'MEDIUM')} color="#f59e0b" />
      <Stat label="LOW" value={count(n => n.confidenceLevel === 'LOW')} color="#ef4444" />
      <Sep />
      <Stat label="PENDING" value={count(n => n.status === 'pending')} color="#f59e0b" />
      <Stat label="REVIEWED" value={count(n => n.status === 'reviewed')} color="#10b981" />
      <Stat label="FLAGGED" value={count(n => n.status === 'flagged')} color="#ef4444" />
      <span className="ml-auto text-slate-600">{utc}</span>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <span className="flex items-center gap-1">
      <span className="text-slate-600">{label}:</span>
      <span style={{ color }} className="font-bold">{value}</span>
    </span>
  );
}

function Sep() {
  return <span className="text-slate-700">|</span>;
}
