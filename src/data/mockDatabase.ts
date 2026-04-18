import type { IntelNode } from '../types/intel';

function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const makeSatSvg = (color: string, label: string, variant: number = 0) => {
  const variants = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="380" height="220" viewBox="0 0 380 220">
      <rect width="380" height="220" fill="#111827"/>
      <rect x="20" y="30" width="80" height="60" fill="#1a2332" rx="2"/>
      <rect x="120" y="20" width="100" height="80" fill="#162030" rx="2"/>
      <rect x="240" y="40" width="70" height="50" fill="#1a2332" rx="2"/>
      <rect x="30" y="120" width="120" height="70" fill="#162030" rx="2"/>
      <rect x="200" y="110" width="150" height="90" fill="#1a2332" rx="2"/>
      <rect x="35" y="38" width="28" height="20" fill="${color}33" stroke="${color}88" stroke-width="0.5"/>
      <rect x="70" y="42" width="20" height="14" fill="${color}22" stroke="${color}66" stroke-width="0.5"/>
      <rect x="130" y="30" width="40" height="30" fill="${color}44" stroke="${color}" stroke-width="0.8"/>
      <rect x="180" y="35" width="25" height="18" fill="${color}33" stroke="${color}77" stroke-width="0.5"/>
      <rect x="210" y="28" width="35" height="25" fill="${color}22" stroke="${color}55" stroke-width="0.5"/>
      <rect x="250" y="48" width="45" height="32" fill="${color}33" stroke="${color}88" stroke-width="0.5"/>
      <rect x="40" y="130" width="50" height="35" fill="${color}44" stroke="${color}" stroke-width="0.8"/>
      <rect x="100" y="135" width="35" height="25" fill="${color}22" stroke="${color}55" stroke-width="0.5"/>
      <rect x="210" y="120" width="60" height="40" fill="${color}33" stroke="${color}77" stroke-width="0.5"/>
      <rect x="285" y="125" width="50" height="60" fill="${color}44" stroke="${color}" stroke-width="0.8"/>
      <line x1="0" y1="100" x2="380" y2="100" stroke="#2a3a4a" stroke-width="3"/>
      <line x1="190" y1="0" x2="190" y2="220" stroke="#2a3a4a" stroke-width="3"/>
      <line x1="0" y1="100" x2="380" y2="100" stroke="#334155" stroke-width="1" stroke-dasharray="8,6"/>
      <circle cx="150" cy="45" r="22" fill="none" stroke="${color}" stroke-width="1" opacity="0.9"/>
      <circle cx="150" cy="45" r="4" fill="${color}" opacity="0.9"/>
      <line x1="128" y1="45" x2="138" y2="45" stroke="${color}" stroke-width="1"/>
      <line x1="162" y1="45" x2="172" y2="45" stroke="${color}" stroke-width="1"/>
      <line x1="150" y1="23" x2="150" y2="33" stroke="${color}" stroke-width="1"/>
      <line x1="150" y1="57" x2="150" y2="67" stroke="${color}" stroke-width="1"/>
      <polyline points="5,5 5,18 18,18" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.7"/>
      <polyline points="375,5 375,18 362,18" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.7"/>
      <polyline points="5,215 5,202 18,202" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.7"/>
      <polyline points="375,215 375,202 362,202" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.7"/>
      <line x1="95" y1="0" x2="95" y2="220" stroke="${color}22" stroke-width="0.5"/>
      <line x1="190" y1="0" x2="190" y2="220" stroke="${color}22" stroke-width="0.5"/>
      <line x1="285" y1="0" x2="285" y2="220" stroke="${color}22" stroke-width="0.5"/>
      <line x1="0" y1="73" x2="380" y2="73" stroke="${color}22" stroke-width="0.5"/>
      <line x1="0" y1="146" x2="380" y2="146" stroke="${color}22" stroke-width="0.5"/>
      <rect x="0" y="200" width="380" height="20" fill="#0a0f1ecc"/>
      <text x="8" y="214" fill="${color}" font-size="9" font-family="monospace" font-weight="bold">${label}</text>
      <text x="280" y="214" fill="${color}88" font-size="8" font-family="monospace">CLASSIFIED//NOFORN</text>
    </svg>`,

    `<svg xmlns="http://www.w3.org/2000/svg" width="380" height="220" viewBox="0 0 380 220">
      <rect width="380" height="220" fill="#0a1628"/>
      <rect x="0" y="110" width="380" height="110" fill="#0c2340"/>
      <line x1="0" y1="120" x2="380" y2="118" stroke="#0e2a4a" stroke-width="2"/>
      <line x1="0" y1="135" x2="380" y2="133" stroke="#0e2a4a" stroke-width="1.5"/>
      <line x1="0" y1="150" x2="380" y2="152" stroke="#0e2a4a" stroke-width="2"/>
      <line x1="0" y1="168" x2="380" y2="165" stroke="#0e2a4a" stroke-width="1.5"/>
      <line x1="0" y1="185" x2="380" y2="188" stroke="#0e2a4a" stroke-width="2"/>
      <rect x="0" y="0" width="380" height="115" fill="#111827"/>
      <rect x="60" y="90" width="260" height="30" fill="#1e293b" stroke="#334155" stroke-width="1"/>
      <rect x="80" y="110" width="20" height="60" fill="#1e293b" stroke="#334155" stroke-width="0.5"/>
      <rect x="160" y="110" width="20" height="80" fill="#1e293b" stroke="#334155" stroke-width="0.5"/>
      <rect x="240" y="110" width="20" height="70" fill="#1e293b" stroke="#334155" stroke-width="0.5"/>
      <ellipse cx="90" cy="145" rx="35" ry="10" fill="${color}33" stroke="${color}" stroke-width="1"/>
      <rect x="70" y="138" width="40" height="8" fill="${color}44" stroke="${color}88" stroke-width="0.5"/>
      <ellipse cx="170" cy="160" rx="45" ry="12" fill="${color}22" stroke="${color}77" stroke-width="1"/>
      <rect x="148" y="152" width="44" height="9" fill="${color}33" stroke="${color}66" stroke-width="0.5"/>
      <ellipse cx="260" cy="150" rx="38" ry="11" fill="${color}44" stroke="${color}" stroke-width="1.2"/>
      <rect x="238" y="143" width="44" height="8" fill="${color}55" stroke="${color}" stroke-width="0.5"/>
      <circle cx="260" cy="150" r="20" fill="none" stroke="${color}" stroke-width="1.2" opacity="0.9"/>
      <circle cx="260" cy="150" r="3" fill="${color}"/>
      <line x1="240" y1="150" x2="248" y2="150" stroke="${color}" stroke-width="1"/>
      <line x1="272" y1="150" x2="280" y2="150" stroke="${color}" stroke-width="1"/>
      <line x1="260" y1="130" x2="260" y2="138" stroke="${color}" stroke-width="1"/>
      <line x1="260" y1="162" x2="260" y2="170" stroke="${color}" stroke-width="1"/>
      <rect x="20" y="20" width="60" height="40" fill="${color}22" stroke="${color}55" stroke-width="0.5"/>
      <rect x="100" y="30" width="80" height="50" fill="${color}33" stroke="${color}77" stroke-width="0.5"/>
      <rect x="200" y="15" width="50" height="35" fill="${color}22" stroke="${color}55" stroke-width="0.5"/>
      <rect x="270" y="25" width="90" height="55" fill="${color}33" stroke="${color}66" stroke-width="0.5"/>
      <polyline points="5,5 5,18 18,18" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.7"/>
      <polyline points="375,5 375,18 362,18" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.7"/>
      <polyline points="5,215 5,202 18,202" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.7"/>
      <polyline points="375,215 375,202 362,202" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.7"/>
      <rect x="0" y="200" width="380" height="20" fill="#0a0f1ecc"/>
      <text x="8" y="214" fill="${color}" font-size="9" font-family="monospace" font-weight="bold">${label}</text>
      <text x="260" y="214" fill="${color}88" font-size="8" font-family="monospace">3 VESSELS TRACKED</text>
    </svg>`,

    `<svg xmlns="http://www.w3.org/2000/svg" width="380" height="220" viewBox="0 0 380 220">
      <rect width="380" height="220" fill="#111827"/>
      <rect x="30" y="90" width="320" height="40" fill="#1e293b" stroke="#334155" stroke-width="1"/>
      <rect x="40" y="108" width="20" height="4" fill="#334155"/>
      <rect x="80" y="108" width="20" height="4" fill="#334155"/>
      <rect x="120" y="108" width="20" height="4" fill="#334155"/>
      <rect x="160" y="108" width="20" height="4" fill="#334155"/>
      <rect x="200" y="108" width="20" height="4" fill="#334155"/>
      <rect x="240" y="108" width="20" height="4" fill="#334155"/>
      <rect x="280" y="108" width="20" height="4" fill="#334155"/>
      <rect x="320" y="108" width="20" height="4" fill="#334155"/>
      <rect x="180" y="50" width="20" height="90" fill="#1a2332" stroke="#2a3a4a" stroke-width="0.5"/>
      <rect x="280" y="50" width="20" height="90" fill="#1a2332" stroke="#2a3a4a" stroke-width="0.5"/>
      <rect x="20" y="20" width="120" height="60" fill="${color}22" stroke="${color}55" stroke-width="0.5"/>
      <rect x="160" y="15" width="80" height="65" fill="${color}33" stroke="${color}77" stroke-width="0.8"/>
      <rect x="260" y="20" width="100" height="55" fill="${color}22" stroke="${color}55" stroke-width="0.5"/>
      <ellipse cx="200" cy="60" rx="18" ry="5" fill="${color}55" stroke="${color}" stroke-width="0.8"/>
      <line x1="200" y1="55" x2="200" y2="65" stroke="${color}" stroke-width="1"/>
      <line x1="185" y1="60" x2="215" y2="60" stroke="${color}" stroke-width="1.5"/>
      <ellipse cx="290" cy="55" rx="15" ry="4" fill="${color}44" stroke="${color}88" stroke-width="0.8"/>
      <line x1="290" y1="51" x2="290" y2="59" stroke="${color}" stroke-width="1"/>
      <line x1="278" y1="55" x2="302" y2="55" stroke="${color}" stroke-width="1.5"/>
      <rect x="30" y="150" width="200" height="50" fill="${color}11" stroke="${color}44" stroke-width="1" stroke-dasharray="4,3"/>
      <text x="80" y="180" fill="${color}66" font-size="9" font-family="monospace">CONSTRUCTION ZONE</text>
      <circle cx="200" cy="60" r="25" fill="none" stroke="${color}" stroke-width="1" opacity="0.9"/>
      <circle cx="200" cy="60" r="3" fill="${color}"/>
      <line x1="175" y1="60" x2="183" y2="60" stroke="${color}" stroke-width="1"/>
      <line x1="217" y1="60" x2="225" y2="60" stroke="${color}" stroke-width="1"/>
      <line x1="200" y1="35" x2="200" y2="43" stroke="${color}" stroke-width="1"/>
      <line x1="200" y1="77" x2="200" y2="85" stroke="${color}" stroke-width="1"/>
      <polyline points="5,5 5,18 18,18" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.7"/>
      <polyline points="375,5 375,18 362,18" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.7"/>
      <polyline points="5,215 5,202 18,202" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.7"/>
      <polyline points="375,215 375,202 362,202" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.7"/>
      <rect x="0" y="200" width="380" height="20" fill="#0a0f1ecc"/>
      <text x="8" y="214" fill="${color}" font-size="9" font-family="monospace" font-weight="bold">${label}</text>
      <text x="270" y="214" fill="${color}88" font-size="8" font-family="monospace">RUNWAY EXT +40%</text>
    </svg>`,

    `<svg xmlns="http://www.w3.org/2000/svg" width="380" height="220" viewBox="0 0 380 220">
      <rect width="380" height="220" fill="#120808"/>
      <ellipse cx="190" cy="110" rx="120" ry="80" fill="${color}08"/>
      <ellipse cx="190" cy="110" rx="80" ry="55" fill="${color}15"/>
      <ellipse cx="190" cy="110" rx="50" ry="35" fill="${color}25"/>
      <ellipse cx="190" cy="110" rx="25" ry="18" fill="${color}45"/>
      <ellipse cx="190" cy="110" rx="10" ry="8" fill="${color}88"/>
      <ellipse cx="80" cy="60" rx="30" ry="20" fill="${color}18"/>
      <ellipse cx="80" cy="60" rx="15" ry="10" fill="${color}35"/>
      <ellipse cx="80" cy="60" rx="6" ry="4" fill="${color}66"/>
      <ellipse cx="300" cy="160" rx="35" ry="22" fill="${color}15"/>
      <ellipse cx="300" cy="160" rx="18" ry="12" fill="${color}30"/>
      <ellipse cx="300" cy="160" rx="7" ry="5" fill="${color}55"/>
      <rect x="100" y="60" width="180" height="100" fill="none" stroke="${color}44" stroke-width="1" stroke-dasharray="4,3"/>
      <rect x="120" y="75" width="60" height="45" fill="none" stroke="${color}66" stroke-width="0.8"/>
      <rect x="200" y="80" width="65" height="40" fill="none" stroke="${color}55" stroke-width="0.8"/>
      <circle cx="190" cy="110" r="30" fill="none" stroke="${color}" stroke-width="1.2" opacity="0.9"/>
      <circle cx="190" cy="110" r="5" fill="${color}" opacity="0.9"/>
      <line x1="160" y1="110" x2="170" y2="110" stroke="${color}" stroke-width="1"/>
      <line x1="210" y1="110" x2="220" y2="110" stroke="${color}" stroke-width="1"/>
      <line x1="190" y1="80" x2="190" y2="90" stroke="${color}" stroke-width="1"/>
      <line x1="190" y1="130" x2="190" y2="140" stroke="${color}" stroke-width="1"/>
      <rect x="340" y="30" width="12" height="160" fill="url(#thermal)" rx="2"/>
      <defs>
        <linearGradient id="thermal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${color}"/>
          <stop offset="50%" stop-color="${color}66"/>
          <stop offset="100%" stop-color="${color}11"/>
        </linearGradient>
      </defs>
      <text x="338" y="26" fill="${color}88" font-size="7" font-family="monospace">HOT</text>
      <text x="336" y="200" fill="${color}44" font-size="7" font-family="monospace">COLD</text>
      <polyline points="5,5 5,18 18,18" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.7"/>
      <polyline points="375,5 375,18 362,18" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.7"/>
      <polyline points="5,215 5,202 18,202" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.7"/>
      <polyline points="375,215 375,202 362,202" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.7"/>
      <rect x="0" y="200" width="380" height="20" fill="#0a0f1ecc"/>
      <text x="8" y="214" fill="${color}" font-size="9" font-family="monospace" font-weight="bold">${label}</text>
      <text x="240" y="214" fill="${color}88" font-size="8" font-family="monospace">IR BAND | ANOMALY DETECTED</text>
    </svg>`,
  ];

  const svg = variants[variant % variants.length];
  return svgToDataUri(svg);
};

export const MONGO_NODES: IntelNode[] = [
  {
    id: 'mongo-001',
    type: 'OSINT',
    lat: 28.6139,
    lng: 77.209,
    title: 'Social Media Activity Spike — Delhi NCR',
    source: 'mongodb://intel-db/osint',
    sourceType: 'mongodb',
    confidence: 82,
    confidenceLevel: 'HIGH',
    timestamp: '2025-07-14T08:23:00Z',
    summary: 'Unusual spike in encrypted social media traffic detected across Delhi NCR region. Coordinated posting patterns suggest organized activity.',
    imageUrl: null,
    imageCaption: null,
    location: 'New Delhi, India',
    tags: ['social-media', 'encrypted-traffic', 'coordinated'],
    status: 'pending',
    classification: 'CONFIDENTIAL',
  },
  {
    id: 'mongo-002',
    type: 'HUMINT',
    lat: 19.076,
    lng: 72.8777,
    title: 'Field Agent Report — Mumbai Port',
    source: 'mongodb://intel-db/humint',
    sourceType: 'mongodb',
    confidence: 91,
    confidenceLevel: 'HIGH',
    timestamp: '2025-07-13T14:10:00Z',
    summary: 'Field operative reports unusual cargo movement at Mumbai port. Three unregistered containers offloaded after midnight. Local contacts corroborate.',
    imageUrl: null,
    imageCaption: null,
    location: 'Mumbai, Maharashtra',
    tags: ['port', 'cargo', 'field-report'],
    status: 'reviewed',
    classification: 'SECRET',
  },
  {
    id: 'mongo-003',
    type: 'OSINT',
    lat: 26.8467,
    lng: 80.9462,
    title: 'Dark Web Forum Chatter — Lucknow',
    source: 'mongodb://intel-db/osint',
    sourceType: 'mongodb',
    confidence: 55,
    confidenceLevel: 'MEDIUM',
    timestamp: '2025-07-12T22:45:00Z',
    summary: 'Dark web forum posts referencing Lucknow coordinates. Mentions of "package delivery" in coded language. Low confidence due to unverified sources.',
    imageUrl: null,
    imageCaption: null,
    location: 'Lucknow, Uttar Pradesh',
    tags: ['dark-web', 'coded-language', 'unverified'],
    status: 'flagged',
    classification: 'CONFIDENTIAL',
  },
  {
    id: 'mongo-004',
    type: 'HUMINT',
    lat: 12.9716,
    lng: 77.5946,
    title: 'Tech Sector Surveillance — Bengaluru',
    source: 'mongodb://intel-db/humint',
    sourceType: 'mongodb',
    confidence: 74,
    confidenceLevel: 'HIGH',
    timestamp: '2025-07-11T09:30:00Z',
    summary: 'Source reports foreign nationals conducting systematic visits to tech campuses in Bengaluru. Pattern suggests industrial espionage reconnaissance.',
    imageUrl: null,
    imageCaption: null,
    location: 'Bengaluru, Karnataka',
    tags: ['tech-sector', 'espionage', 'reconnaissance'],
    status: 'pending',
    classification: 'SECRET',
  },
  {
    id: 'mongo-005',
    type: 'OSINT',
    lat: 22.5726,
    lng: 88.3639,
    title: 'Network Anomaly — Kolkata',
    source: 'mongodb://intel-db/osint',
    sourceType: 'mongodb',
    confidence: 38,
    confidenceLevel: 'LOW',
    timestamp: '2025-07-10T17:00:00Z',
    summary: 'Network traffic anomaly detected originating from Kolkata ISP nodes. Possible botnet activity. Confidence low — requires further analysis.',
    imageUrl: null,
    imageCaption: null,
    location: 'Kolkata, West Bengal',
    tags: ['network', 'botnet', 'anomaly'],
    status: 'dismissed',
    classification: 'UNCLASSIFIED',
  },
];

export const S3_NODES: IntelNode[] = [
  {
    id: 's3-001',
    type: 'IMINT',
    lat: 30.7333,
    lng: 76.7794,
    title: 'Satellite Pass — Chandigarh Industrial Zone',
    source: 's3://cyberjoar-intel/imint/chandigarh/',
    sourceType: 's3',
    confidence: 88,
    confidenceLevel: 'HIGH',
    timestamp: '2025-07-14T06:00:00Z',
    summary: 'Satellite imagery reveals new construction activity in Chandigarh industrial zone. Three new structures identified since last pass 30 days ago.',
    imageUrl: makeSatSvg('#10b981', 'CHD-INDUSTRIAL-ZONE', 0),
    imageCaption: 'SAT-PASS-CHD-20250714 | RES: 0.5m | BAND: RGB',
    location: 'Chandigarh, India',
    tags: ['construction', 'industrial', 'satellite'],
    status: 'reviewed',
    classification: 'CONFIDENTIAL',
  },
  {
    id: 's3-002',
    type: 'IMINT',
    lat: 23.0225,
    lng: 72.5714,
    title: 'Thermal Imaging — Ahmedabad Facility',
    source: 's3://cyberjoar-intel/imint/ahmedabad/',
    sourceType: 's3',
    confidence: 79,
    confidenceLevel: 'HIGH',
    timestamp: '2025-07-13T03:15:00Z',
    summary: 'Thermal satellite pass detects elevated heat signatures at Ahmedabad facility. Consistent with 24/7 operational activity. Unusual for declared use.',
    imageUrl: makeSatSvg('#f97316', 'AMD-THERMAL-FACILITY', 3),
    imageCaption: 'SAT-THERMAL-AMD-20250713 | RES: 1m | BAND: IR',
    location: 'Ahmedabad, Gujarat',
    tags: ['thermal', 'facility', 'heat-signature'],
    status: 'flagged',
    classification: 'SECRET',
  },
  {
    id: 's3-003',
    type: 'IMINT',
    lat: 13.0827,
    lng: 80.2707,
    title: 'Port Activity — Chennai Harbour',
    source: 's3://cyberjoar-intel/imint/chennai/',
    sourceType: 's3',
    confidence: 93,
    confidenceLevel: 'HIGH',
    timestamp: '2025-07-12T12:00:00Z',
    summary: 'High-resolution imagery of Chennai harbour shows 7 unscheduled vessels. Cross-referencing with AIS data reveals 2 vessels with transponders disabled.',
    imageUrl: makeSatSvg('#3b82f6', 'CHN-HARBOUR-VESSELS', 1),
    imageCaption: 'SAT-HR-CHN-20250712 | RES: 0.3m | BAND: RGB+NIR',
    location: 'Chennai, Tamil Nadu',
    tags: ['harbour', 'vessels', 'ais-dark'],
    status: 'pending',
    classification: 'SECRET',
  },
  {
    id: 's3-004',
    type: 'IMINT',
    lat: 17.385,
    lng: 78.4867,
    title: 'Airfield Expansion — Hyderabad',
    source: 's3://cyberjoar-intel/imint/hyderabad/',
    sourceType: 's3',
    confidence: 67,
    confidenceLevel: 'MEDIUM',
    timestamp: '2025-07-11T08:45:00Z',
    summary: 'Satellite imagery confirms runway extension work at secondary airfield near Hyderabad. New taxiway under construction. Capacity increase estimated 40%.',
    imageUrl: makeSatSvg('#a855f7', 'HYD-AIRFIELD-EXT', 2),
    imageCaption: 'SAT-PASS-HYD-20250711 | RES: 0.5m | BAND: RGB',
    location: 'Hyderabad, Telangana',
    tags: ['airfield', 'construction', 'runway'],
    status: 'reviewed',
    classification: 'CONFIDENTIAL',
  },
];

export const MANUAL_NODES: IntelNode[] = [
  {
    id: 'manual-001',
    type: 'HUMINT',
    lat: 26.9124,
    lng: 75.7873,
    title: 'Demo Node — Jaipur',
    source: 'manual-entry',
    sourceType: 'manual',
    confidence: 60,
    confidenceLevel: 'MEDIUM',
    timestamp: new Date().toISOString(),
    summary: 'Manually entered demonstration intelligence node for Jaipur. This node was added via the Manual Entry form to showcase the ingestion workflow.',
    imageUrl: null,
    imageCaption: null,
    location: 'Jaipur, Rajasthan',
    tags: ['demo', 'manual', 'jaipur'],
    status: 'pending',
    classification: 'UNCLASSIFIED',
  },
];
