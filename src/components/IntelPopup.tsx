import { Popup } from 'react-leaflet';
import type { IntelNode } from '../types/intel';

interface IntelPopupProps {
  node: IntelNode;
  onUpdate: (id: string, updates: Partial<IntelNode>) => void;
}

const TYPE_CONFIG = {
  OSINT:  { color: '#3b82f6', label: 'OPEN SOURCE INTEL' },
  HUMINT: { color: '#f97316', label: 'HUMAN INTEL' },
  IMINT:  { color: '#10b981', label: 'IMAGERY INTEL' },
};

const confColor = (c: number) => c >= 80 ? '#22c55e' : c >= 60 ? '#f59e0b' : '#ef4444';

export function IntelPopup({ node, onUpdate }: IntelPopupProps) {
  const cfg = TYPE_CONFIG[node.type];
  const ts = new Date(node.timestamp).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false,
    timeZone: 'UTC',
  }) + ' UTC';

  return (
    <Popup maxWidth={400} minWidth={320} autoPan={true} closeButton={true} className="fusion-popup">
      <div style={{
        fontFamily: "'Courier New', Courier, monospace",
        background: '#0f172a',
        border: `1px solid ${cfg.color}40`,
        borderRadius: '6px',
        padding: '14px',
        color: '#e2e8f0',
        fontSize: '12px',
        lineHeight: '1.5',
        maxWidth: '380px',
        boxSizing: 'border-box',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{
            background: cfg.color, color: '#000', fontSize: '9px',
            fontWeight: 'bold', padding: '2px 8px', borderRadius: '2px', letterSpacing: '1.5px',
          }}>{cfg.label}</span>
          <span style={{
            fontSize: '9px', color: '#94a3b8', letterSpacing: '0.5px',
            border: '1px solid #334155', padding: '2px 6px', borderRadius: '3px',
          }}>{node.classification}</span>
        </div>

        <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#f1f5f9', marginBottom: '6px' }}>{node.title}</div>

        <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '8px', display: 'flex', gap: '16px' }}>
          <span>📍 {node.location}</span>
          <span>🕐 {ts}</span>
        </div>

        <div style={{ fontSize: '10px', color: '#475569', marginBottom: '10px', padding: '4px 6px', background: '#1e293b', borderRadius: '3px' }}>
          SRC: {node.source}
        </div>

        <div style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b', marginBottom: '4px' }}>
            <span>CONFIDENCE RATING</span>
            <span style={{ color: confColor(node.confidence), fontWeight: 'bold' }}>{node.confidence}% — {node.confidenceLevel}</span>
          </div>
          <div style={{ background: '#1e293b', borderRadius: '2px', height: '5px', overflow: 'hidden' }}>
            <div style={{ width: `${node.confidence}%`, height: '100%', background: confColor(node.confidence), transition: 'width 0.4s ease' }} />
          </div>
        </div>

        <div style={{
          fontSize: '11px', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '12px',
          padding: '8px', background: '#1e293b40', borderRadius: '4px',
          borderLeft: `2px solid ${cfg.color}`,
        }}>{node.summary}</div>

        {node.imageUrl && (
          <div style={{ marginBottom: '12px', borderRadius: '4px', overflow: 'hidden', border: `1px solid ${cfg.color}30` }}>
            <div style={{ background: '#0a0f1e', padding: '3px 8px', fontSize: '9px', color: cfg.color, letterSpacing: '1px', fontWeight: 'bold' }}>
              ▼ INTELLIGENCE IMAGERY
            </div>
            <img
              src={node.imageUrl}
              alt={node.imageCaption || 'Intelligence imagery'}
              style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', display: 'block' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            {node.imageCaption && (
              <div style={{ background: '#0a0f1e', padding: '5px 8px', fontSize: '9px', color: '#64748b', lineHeight: '1.4' }}>
                ▲ {node.imageCaption}
              </div>
            )}
          </div>
        )}

        {node.tags && node.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
            {node.tags.map(tag => (
              <span key={tag} style={{
                background: '#1e293b', color: '#475569', fontSize: '9px',
                padding: '1px 6px', borderRadius: '3px', border: '1px solid #334155',
              }}>#{tag}</span>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={(e) => { e.stopPropagation(); onUpdate(node.id, { status: 'reviewed' }); }}
            style={{
              flex: 1, padding: '6px', borderRadius: '4px', cursor: 'pointer',
              fontFamily: "'Courier New', monospace", fontSize: '10px', fontWeight: 'bold',
              letterSpacing: '0.5px', border: '1px solid',
              background: node.status === 'reviewed' ? '#14532d' : '#052e16',
              color: node.status === 'reviewed' ? '#4ade80' : '#86efac',
              borderColor: node.status === 'reviewed' ? '#166534' : '#14532d',
            }}
          >{node.status === 'reviewed' ? '✓ REVIEWED' : '✓ MARK REVIEWED'}</button>
          <button
            onClick={(e) => { e.stopPropagation(); onUpdate(node.id, { status: 'flagged' }); }}
            style={{
              flex: 1, padding: '6px', borderRadius: '4px', cursor: 'pointer',
              fontFamily: "'Courier New', monospace", fontSize: '10px', fontWeight: 'bold',
              letterSpacing: '0.5px', border: '1px solid',
              background: '#450a0a', color: '#fca5a5', borderColor: '#7f1d1d',
            }}
          >⚑ FLAG PRIORITY</button>
        </div>

        <div style={{ marginTop: '8px', fontSize: '9px', color: '#334155', textAlign: 'right' }}>
          NODE ID: {node.id} | STATUS: {node.status.toUpperCase()}
        </div>
      </div>
    </Popup>
  );
}

export default IntelPopup;
