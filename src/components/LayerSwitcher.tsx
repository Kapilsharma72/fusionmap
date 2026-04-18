import { TileLayer } from 'react-leaflet';

export type BaseLayer = 'dark' | 'terrain' | 'satellite';

const LAYERS: Record<BaseLayer, { label: string; url: string; attribution: string; maxZoom: number }> = {
  dark: {
    label: '🌑 DARK',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 19,
  },
  terrain: {
    label: '🏔 TERRAIN',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
    maxZoom: 17,
  },
  satellite: {
    label: '🛰 SATELLITE',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
    maxZoom: 19,
  },
};

interface Props {
  activeLayer: BaseLayer;
  onChange: (layer: BaseLayer) => void;
}

export function TileLayerController({ activeLayer }: { activeLayer: BaseLayer }) {
  const cfg = LAYERS[activeLayer];
  return (
    <TileLayer
      key={activeLayer}
      url={cfg.url}
      attribution={cfg.attribution}
      maxZoom={cfg.maxZoom}
    />
  );
}

export function LayerSwitcherOverlay({ activeLayer, onChange }: Props) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}
    >
      {(Object.keys(LAYERS) as BaseLayer[]).map(key => (
        <button
          key={key}
          onClick={() => onChange(key)}
          style={{
            padding: '4px 10px',
            fontSize: '10px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            letterSpacing: '0.5px',
            borderRadius: '3px',
            cursor: 'pointer',
            border: '1px solid',
            background: activeLayer === key ? '#1e3a5f' : '#0f172acc',
            color: activeLayer === key ? '#60a5fa' : '#64748b',
            borderColor: activeLayer === key ? '#3b82f6' : '#1e293b',
            transition: 'all 0.15s',
          }}
        >
          {LAYERS[key].label}
        </button>
      ))}
    </div>
  );
}
