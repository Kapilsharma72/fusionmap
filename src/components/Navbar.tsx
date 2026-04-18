import { useEffect, useState } from 'react';
import { Zap, Shield } from 'lucide-react';

interface Props {
  onDemoMode?: () => void;
  onExport?: () => void;
}

export default function Navbar({ onDemoMode, onExport }: Props) {
  const [utc, setUtc] = useState('');

  useEffect(() => {
    const tick = () => setUtc(new Date().toUTCString().slice(0, 25) + ' UTC');
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <nav
      className="flex items-center justify-between px-4 h-12 border-b shrink-0"
      style={{ background: '#020408', borderColor: '#1e293b' }}
    >
      <div className="flex items-center gap-2">
        <Zap size={18} className="text-blue-400" />
        <span className="font-mono font-bold text-blue-400 tracking-widest text-sm">FUSIONMAP</span>
        <span className="text-xs text-slate-500 font-mono ml-2">// MULTI-SOURCE INTELLIGENCE DASHBOARD</span>
      </div>
      <div className="flex items-center gap-3">
        {onExport && (
          <button
            onClick={onExport}
            style={{
              padding: '4px 12px',
              background: 'transparent',
              border: '1px solid #10b981',
              borderRadius: '4px',
              color: '#34d399',
              fontSize: '11px',
              fontFamily: 'monospace',
              cursor: 'pointer',
              letterSpacing: '1px',
              marginRight: '8px',
            }}
          >↓ EXPORT</button>
        )}
        {onDemoMode && (
          <button
            onClick={onDemoMode}
            style={{
              padding: '4px 12px',
              background: 'transparent',
              border: '1px solid #3b82f6',
              borderRadius: '4px',
              color: '#60a5fa',
              fontSize: '11px',
              fontFamily: 'monospace',
              cursor: 'pointer',
              letterSpacing: '1px',
              marginRight: '16px',
              transition: 'all 0.2s',
            }}
          >▶ DEMO</button>
        )}
        <Shield size={14} className="text-green-400" />
        <span className="text-xs font-mono text-green-400">CYBERJOAR AI</span>
        <span className="text-xs font-mono text-slate-400 border border-slate-700 px-2 py-0.5 rounded">
          {utc}
        </span>
      </div>
    </nav>
  );
}
