import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import { MapContainer, CircleMarker, useMap } from 'react-leaflet';
import type L from 'leaflet';
import type { IntelNode } from '../types/intel';
import { IntelPopup } from './IntelPopup';
import { TileLayerController, LayerSwitcherOverlay, type BaseLayer } from './LayerSwitcher';

interface Props {
  nodes: IntelNode[];
  onUpdateNode: (id: string, patch: Partial<IntelNode>) => void;
  mapRef?: React.MutableRefObject<L.Map | null>;
  markerRefs?: React.MutableRefObject<Record<string, L.CircleMarker>>;
}

const TYPE_COLORS: Record<string, string> = {
  OSINT: '#3b82f6',
  HUMINT: '#f97316',
  IMINT: '#10b981',
};

function getRadius(zoom: number): number {
  if (zoom <= 4) return 14;
  if (zoom <= 5) return 12;
  if (zoom <= 7) return 10;
  if (zoom <= 9) return 9;
  return 8;
}

function MapRefCapture({ mapRef }: { mapRef?: React.MutableRefObject<L.Map | null> }) {
  const map = useMap();
  useEffect(() => {
    if (mapRef) mapRef.current = map;
  }, [map, mapRef]);
  return null;
}

function DynamicMarkers({
  nodes,
  onUpdateNode,
  markerRefs,
  onHoverNode,
}: {
  nodes: IntelNode[];
  onUpdateNode: (id: string, patch: Partial<IntelNode>) => void;
  markerRefs?: React.MutableRefObject<Record<string, L.CircleMarker>>;
  onHoverNode: (node: IntelNode | null, pos: { x: number; y: number } | null) => void;
}) {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());

  useEffect(() => {
    const handler = () => setZoom(map.getZoom());
    map.on('zoomend', handler);
    return () => { map.off('zoomend', handler); };
  }, [map]);

  const radius = getRadius(zoom);

  return (
    <>
      {nodes.map(node => {
        const color = TYPE_COLORS[node.type] ?? '#94a3b8';
        const isFlagged = node.status === 'flagged';
        const dotRadius = isFlagged ? radius + 3 : radius;

        return (
          <span key={node.id}>
            <CircleMarker
              key={`${node.id}-pulse`}
              center={[node.lat, node.lng]}
              radius={dotRadius + 6}
              pathOptions={{
                fillColor: color,
                fillOpacity: 0,
                color: isFlagged ? '#ef4444' : color,
                weight: 1,
                opacity: 0.4,
                className: `pulse-ring pulse-ring-${node.type.toLowerCase()}`,
              }}
              interactive={false}
            />
            <CircleMarker
              key={node.id}
              center={[node.lat, node.lng]}
              radius={dotRadius}
              pathOptions={{
                color: isFlagged ? '#ef4444' : color,
                weight: isFlagged ? 2.5 : 1.5,
                fillColor: color,
                fillOpacity: 0.85,
              }}
              ref={(ref) => {
                if (ref && markerRefs) markerRefs.current[node.id] = ref;
              }}
              eventHandlers={{
                click: (e) => {
                  e.target.openPopup();
                  e.originalEvent.stopPropagation();
                },
                mouseover: (e) => {
                  e.target.openPopup();
                  const orig = e.originalEvent as MouseEvent;
                  onHoverNode(node, { x: orig.clientX, y: orig.clientY });
                },
                mouseout: () => {
                  onHoverNode(null, null);
                },
              }}
            >
              <IntelPopup node={node} onUpdate={onUpdateNode} />
            </CircleMarker>
          </span>
        );
      })}
    </>
  );
}

export default function MapView({ nodes, onUpdateNode, mapRef, markerRefs }: Props) {
  const internalMapRef = useRef<L.Map | null>(null);
  const resolvedMapRef = mapRef ?? internalMapRef;
  const [activeLayer, setActiveLayer] = useState<BaseLayer>('dark');
  const [hoveredNode, setHoveredNode] = useState<IntelNode | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);

  const handleHover = (node: IntelNode | null, pos: { x: number; y: number } | null) => {
    setHoveredNode(node);
    setHoverPos(pos);
  };

  return (
    <div className="flex-1 relative" style={{ minHeight: 0 }}>
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{ height: '100%', width: '100%', background: '#020408' }}
        zoomControl={true}
      >
        <MapRefCapture mapRef={resolvedMapRef} />
        <TileLayerController activeLayer={activeLayer} />
        <DynamicMarkers
          nodes={nodes}
          onUpdateNode={onUpdateNode}
          markerRefs={markerRefs}
          onHoverNode={handleHover}
        />
      </MapContainer>

      <LayerSwitcherOverlay activeLayer={activeLayer} onChange={setActiveLayer} />

      <div
        className="absolute bottom-4 right-4 z-[1000] rounded border p-3 text-xs font-mono space-y-1"
        style={{ background: '#0f172aee', borderColor: '#1e293b' }}
      >
        <div className="text-slate-500 mb-1">LEGEND</div>
        {Object.entries(TYPE_COLORS).map(([type, color]) => (
          <div key={type} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full inline-block" style={{ background: color }} />
            <span style={{ color }}>{type}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 border-t pt-1 mt-1" style={{ borderColor: '#1e293b' }}>
          <span className="w-3 h-3 rounded-full inline-block border-2" style={{ borderColor: '#ef4444', background: 'transparent' }} />
          <span className="text-red-400">FLAGGED</span>
        </div>
      </div>

      {hoveredNode && hoverPos && (
        <HoverModal node={hoveredNode} pos={hoverPos} />
      )}
    </div>
  );
}

function HoverModal({ node, pos }: { node: IntelNode; pos: { x: number; y: number } }) {
  const cfg = {
    OSINT:  { color: '#3b82f6', label: 'OSINT' },
    HUMINT: { color: '#f97316', label: 'HUMINT' },
    IMINT:  { color: '#10b981', label: 'IMINT' },
  }[node.type];

  const confColor = node.confidence >= 80 ? '#22c55e' : node.confidence >= 60 ? '#f59e0b' : '#ef4444';
  const left = pos.x + 16;
  const top = pos.y - 10;

  return (
    <div
      style={{
        position: 'fixed',
        left,
        top,
        zIndex: 9998,
        background: '#0f172a',
        border: `1px solid ${cfg.color}60`,
        borderRadius: '6px',
        padding: '10px 12px',
        fontFamily: "'Courier New', monospace",
        fontSize: '11px',
        color: '#e2e8f0',
        minWidth: '220px',
        maxWidth: '300px',
        pointerEvents: 'none',
        boxShadow: `0 8px 32px rgba(0,0,0,0.7), 0 0 0 1px ${cfg.color}20`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <span style={{
          background: cfg.color, color: '#000', fontSize: '8px',
          fontWeight: 'bold', padding: '1px 6px', borderRadius: '2px', letterSpacing: '1px',
        }}>{cfg.label}</span>
        <span style={{ fontSize: '8px', color: '#64748b', border: '1px solid #334155', padding: '1px 5px', borderRadius: '2px' }}>
          {node.classification}
        </span>
      </div>
      <div style={{ fontWeight: 'bold', color: '#f1f5f9', marginBottom: '4px', fontSize: '11px', lineHeight: '1.3' }}>
        {node.title}
      </div>
      <div style={{ color: '#64748b', fontSize: '10px', marginBottom: '6px' }}>
        📍 {node.location}
      </div>
      <div style={{ marginBottom: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#475569', marginBottom: '2px' }}>
          <span>CONFIDENCE</span>
          <span style={{ color: confColor, fontWeight: 'bold' }}>{node.confidence}% {node.confidenceLevel}</span>
        </div>
        <div style={{ background: '#1e293b', borderRadius: '2px', height: '3px' }}>
          <div style={{ width: `${node.confidence}%`, height: '100%', background: confColor, borderRadius: '2px' }} />
        </div>
      </div>
      {node.imageUrl && (
        <div style={{ marginBottom: '6px', borderRadius: '3px', overflow: 'hidden', border: `1px solid ${cfg.color}30` }}>
          <div style={{ background: '#0a0f1e', padding: '2px 6px', fontSize: '8px', color: cfg.color, letterSpacing: '1px' }}>
            ▼ IMAGERY AVAILABLE
          </div>
          <img
            src={node.imageUrl}
            alt="intel"
            style={{ width: '100%', height: '80px', objectFit: 'cover', display: 'block' }}
          />
        </div>
      )}
      <div style={{ fontSize: '9px', color: '#334155', textAlign: 'right' }}>
        STATUS: {node.status.toUpperCase()} · CLICK TO INSPECT
      </div>
    </div>
  );
}
