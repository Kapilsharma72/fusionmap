import { useState, useMemo, useRef } from 'react';
import type L from 'leaflet';
import Navbar from './components/Navbar';
import FilterBar from './components/FilterBar';
import IngestionPanel from './components/IngestionPanel';
import MapView from './components/MapView';
import SummaryBar from './components/SummaryBar';
import { MANUAL_NODES } from './data/mockDatabase';
import type { IntelNode, IntelType, ReviewStatus } from './types/intel';

export default function App() {
  const [nodes, setNodes] = useState<IntelNode[]>(MANUAL_NODES);
  const [mongoLoaded, setMongoLoaded] = useState(false);
  const [s3Loaded, setS3Loaded] = useState(false);
  const [showDemoBanner, setShowDemoBanner] = useState(false);

  const [activeTypes, setActiveTypes] = useState<Set<IntelType>>(new Set(['OSINT', 'HUMINT', 'IMINT']));
  const [search, setSearch] = useState('');
  const [minConfidence, setMinConfidence] = useState(0);
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | 'all'>('all');

  const mapRef = useRef<L.Map | null>(null);
  const markerRefs = useRef<Record<string, L.CircleMarker>>({});

  const addNodes = (incoming: IntelNode[]) => {
    setNodes(prev => {
      const ids = new Set(prev.map(n => n.id));
      return [...prev, ...incoming.filter(n => !ids.has(n.id))];
    });
  };

  const handleMongoNodes = (incoming: IntelNode[]) => {
    addNodes(incoming);
    setMongoLoaded(true);
  };

  const handleS3Nodes = (incoming: IntelNode[]) => {
    addNodes(incoming);
    setS3Loaded(true);
  };

  const updateNode = (id: string, patch: Partial<IntelNode>) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, ...patch } : n));
  };

  const toggleType = (t: IntelType) => {
    setActiveTypes(prev => {
      const next = new Set(prev);
      next.has(t) ? next.delete(t) : next.add(t);
      return next;
    });
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return nodes.filter(n =>
      activeTypes.has(n.type) &&
      n.confidence >= minConfidence &&
      (statusFilter === 'all' || n.status === statusFilter) &&
      (!q || n.title.toLowerCase().includes(q) || n.location.toLowerCase().includes(q) || n.tags.some(t => t.includes(q)))
    );
  }, [nodes, activeTypes, search, minConfidence, statusFilter]);

  const handleDemoMode = () => {
    setActiveTypes(new Set(['OSINT', 'HUMINT', 'IMINT']));
    setMinConfidence(0);
    setSearch('');
    setStatusFilter('all');

    const imintNode = nodes.find(n => n.type === 'IMINT' && n.imageUrl);
    if (imintNode && mapRef.current) {
      setTimeout(() => {
        mapRef.current!.flyTo([imintNode.lat, imintNode.lng], 8, { duration: 1.5 });
      }, 400);
      setTimeout(() => {
        const marker = markerRefs.current[imintNode.id];
        if (marker) marker.openPopup();
      }, 2200);
    }

    setShowDemoBanner(true);
    setTimeout(() => setShowDemoBanner(false), 7000);
  };

  const handleExport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      classification: 'UNCLASSIFIED//FOR OFFICIAL USE ONLY',
      summary: {
        totalNodes: nodes.length,
        byType: {
          OSINT: nodes.filter(n => n.type === 'OSINT').length,
          HUMINT: nodes.filter(n => n.type === 'HUMINT').length,
          IMINT: nodes.filter(n => n.type === 'IMINT').length,
        },
        byConfidence: {
          HIGH: nodes.filter(n => n.confidence >= 80).length,
          MEDIUM: nodes.filter(n => n.confidence >= 60 && n.confidence < 80).length,
          LOW: nodes.filter(n => n.confidence < 60).length,
        },
        byStatus: {
          pending: nodes.filter(n => n.status === 'pending').length,
          reviewed: nodes.filter(n => n.status === 'reviewed').length,
          flagged: nodes.filter(n => n.status === 'flagged').length,
        },
      },
      nodes: nodes.map(n => ({
        id: n.id,
        type: n.type,
        title: n.title,
        location: n.location,
        coordinates: { lat: n.lat, lng: n.lng },
        confidence: n.confidence,
        confidenceLevel: n.confidenceLevel,
        source: n.source,
        sourceType: n.sourceType,
        timestamp: n.timestamp,
        summary: n.summary,
        tags: n.tags,
        status: n.status,
        classification: n.classification,
        hasImagery: !!n.imageUrl,
      })),
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FUSIONMAP_INTEL_REPORT_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen" style={{ background: '#020408', fontFamily: "'Courier New', monospace" }}>
      {showDemoBanner && (
        <div style={{
          position: 'fixed', top: '48px', left: '50%', transform: 'translateX(-50%)',
          background: '#1a3a5f', border: '1px solid #3b82f6',
          borderRadius: '6px', padding: '8px 16px',
          color: '#93c5fd', fontSize: '11px', fontFamily: 'monospace',
          zIndex: 9999, display: 'flex', alignItems: 'center', gap: '12px',
          boxShadow: '0 4px 20px rgba(59,130,246,0.3)',
        }}>
          <span style={{ color: '#22c55e', fontWeight: 'bold' }}>● DEMO ACTIVE</span>
          <span>Click or hover any dot to inspect intelligence data. IMINT nodes display satellite imagery.</span>
          <button
            onClick={() => setShowDemoBanner(false)}
            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '14px' }}
          >✕</button>
        </div>
      )}

      <Navbar onDemoMode={handleDemoMode} onExport={handleExport} />
      <FilterBar
        activeTypes={activeTypes}
        onToggleType={toggleType}
        search={search}
        onSearch={setSearch}
        minConfidence={minConfidence}
        onMinConfidence={setMinConfidence}
        statusFilter={statusFilter}
        onStatusFilter={setStatusFilter}
        nodeCount={filtered.length}
      />
      <div className="flex flex-1 min-h-0">
        <IngestionPanel
          mongoLoaded={mongoLoaded}
          s3Loaded={s3Loaded}
          onMongoNodes={handleMongoNodes}
          onS3Nodes={handleS3Nodes}
          onManualNode={node => addNodes([node])}
          onFileNodes={addNodes}
        />
        <MapView
          nodes={filtered}
          onUpdateNode={updateNode}
          mapRef={mapRef}
          markerRefs={markerRefs}
        />
      </div>
      <SummaryBar nodes={nodes} />
    </div>
  );
}
