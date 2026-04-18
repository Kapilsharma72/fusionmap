# FusionMap — Multi-Source Intelligence Fusion Dashboard

> **CYBERJOAR AI** · Problem Statement 1 Submission

A production-grade, browser-only intelligence fusion dashboard that aggregates OSINT, HUMINT, and IMINT data from multiple simulated sources and renders every node as an interactive geospatial marker on a live map.

---

## Live Demo

```
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## What It Does

FusionMap solves the "fragmented intelligence" problem by providing a single unified interface where analysts can:

- Pull intelligence nodes from **MongoDB** and **AWS S3** (simulated with realistic async log sequences)
- Import bulk data via **CSV, Excel, or JSON** drag-and-drop
- Add individual nodes manually including **JPG satellite imagery** for IMINT
- See every node as a **colored dot on a live Leaflet map** centered on India
- **Hover any dot** to instantly see a metadata modal with imagery
- **Click any dot** to open a full popup with confidence bar, source, tags, and action buttons
- **Filter** by intelligence type, confidence threshold, status, and keyword search
- Switch between **Dark, Terrain, and Satellite** basemaps
- **Export** a full JSON intelligence report
- Use **Demo Mode** to auto-fly to an IMINT node and open its popup

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript 5 |
| Build | Vite 5 |
| Styling | Tailwind CSS v4 |
| Map | Leaflet 1.9 + react-leaflet 4 |
| CSV parsing | PapaParse 5 |
| Excel parsing | SheetJS (xlsx 0.18) |
| Icons | lucide-react |

No backend. No API keys. Runs entirely in the browser.

---

## Project Structure

```
fusionmap/
├── src/
│   ├── App.tsx                  # Root — all state, filter logic, demo mode, export
│   ├── main.tsx                 # React entry point
│   ├── index.css                # Tailwind + Leaflet popup overrides + pulse animation
│   │
│   ├── types/
│   │   └── intel.ts             # IntelNode, IntelType, ReviewStatus, ConfidenceLevel
│   │
│   ├── data/
│   │   └── mockDatabase.ts      # MONGO_NODES (5), S3_NODES (4 IMINT), MANUAL_NODES (1)
│   │                            # Includes 4 realistic SVG satellite imagery variants
│   │
│   ├── services/
│   │   ├── mongoService.ts      # Simulated 6-step MongoDB connection with async logs
│   │   ├── s3Service.ts         # Simulated 6-step S3 fetch with async logs
│   │   └── fileParser.ts        # parseCSV / parseExcel / parseJSON / rowsToIntelNodes
│   │
│   └── components/
│       ├── Navbar.tsx            # Header — FUSIONMAP title, UTC clock, DEMO + EXPORT buttons
│       ├── FilterBar.tsx         # Type pills, search, confidence slider, status dropdown
│       ├── SummaryBar.tsx        # Live stats — total, per-type, per-confidence, per-status
│       ├── MapView.tsx           # Leaflet map — dynamic radius, pulse rings, hover modal
│       ├── IntelPopup.tsx        # Full click popup — imagery, confidence bar, action buttons
│       ├── LayerSwitcher.tsx     # Dark / Terrain / Satellite basemap switcher
│       ├── IngestionPanel.tsx    # Left sidebar container
│       ├── MongoPanel.tsx        # Collapsible MongoDB connector with terminal log
│       ├── S3Panel.tsx           # Collapsible S3 connector with terminal log
│       ├── ManualEntryForm.tsx   # Manual node entry with JPG upload + thumbnail preview
│       └── FileDropZone.tsx      # Drag-and-drop CSV/XLSX/JSON with 3-row preview table
│
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Intelligence Node Schema

Every data point in the system is an `IntelNode`:

```typescript
interface IntelNode {
  id: string
  type: 'OSINT' | 'HUMINT' | 'IMINT'
  lat: number
  lng: number
  title: string
  source: string
  sourceType: 'mongodb' | 's3' | 'manual' | 'csv' | 'json' | 'excel' | 'image'
  confidence: number          // 0–100
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW'
  timestamp: string           // ISO 8601
  summary: string
  imageUrl: string | null     // data URI for IMINT imagery
  imageCaption: string | null
  location: string
  tags: string[]
  status: 'pending' | 'reviewed' | 'flagged' | 'dismissed'
  classification: 'UNCLASSIFIED' | 'CONFIDENTIAL' | 'SECRET'
}
```

**Confidence levels:** HIGH ≥ 75 · MEDIUM ≥ 45 · LOW < 45

---

## Data Sources

### MongoDB (simulated)
5 nodes — OSINT and HUMINT across Delhi, Mumbai, Lucknow, Bengaluru, Kolkata.
Click **⚡ CONNECT & FETCH** in the ingestion panel to run the 6-step connection sequence and load nodes onto the map.

### AWS S3 (simulated)
4 IMINT nodes — Chandigarh, Ahmedabad, Chennai, Hyderabad — each with embedded SVG satellite imagery:
- Industrial zone with building footprints and targeting reticle
- Thermal/IR imaging with heat signature gradients
- Port/harbour with vessel tracking overlay
- Airfield with runway, taxiways, and construction zone

Click **☁ CONNECT S3** to run the fetch sequence.

### Manual Entry
Fill the form in the ingestion panel. For IMINT nodes, upload a JPG — a thumbnail preview appears immediately. The node appears on the map instantly on submit.

### File Import (CSV / Excel / JSON)
Drag a file onto the drop zone or click to browse. A 3-row preview table appears. Click **+ ADD ALL TO MAP** to convert rows with valid `lat`/`lng` columns to nodes.

Expected columns: `lat`, `lng`, `title`, `type`, `source`, `confidence`, `location`, `summary`, `tags`, `timestamp`

---

## Map Features

### Dot Colors
| Type | Color |
|---|---|
| OSINT | Blue `#3b82f6` |
| HUMINT | Orange `#f97316` |
| IMINT | Green `#10b981` |

Flagged nodes render with a **red border** and larger radius.

### Zoom-Adaptive Radius
| Zoom | Radius |
|---|---|
| ≤ 4 | 14px |
| ≤ 5 | 12px |
| ≤ 7 | 10px |
| ≤ 9 | 9px |
| > 9 | 8px |

### Pulse Animation
Every dot has an animated pulse ring that scales outward and fades — staggered by type (OSINT 0s · HUMINT 0.8s · IMINT 1.6s).

### Hover Modal
Moving the cursor over any dot instantly shows a lightweight overlay with type badge, title, location, confidence bar, and — for IMINT nodes — a satellite imagery thumbnail. No click required.

### Click Popup
Clicking a dot opens the full `IntelPopup` with:
- Type label + classification badge
- Title, location, formatted UTC timestamp
- Source identifier
- Animated confidence bar (green/yellow/red)
- Full summary text
- Satellite imagery (IMINT only) with caption
- All tags as `#hash` badges
- **✓ MARK REVIEWED** and **⚑ FLAG PRIORITY** action buttons

### Basemap Switcher
Three layers available via the top-right overlay:
- 🌑 **DARK** — CARTO dark (default)
- 🏔 **TERRAIN** — OpenTopoMap with elevation contours
- 🛰 **SATELLITE** — Esri World Imagery

---

## Filtering

| Control | Function |
|---|---|
| OSINT / HUMINT / IMINT pills | Toggle type visibility |
| Search box | Matches title, location, or any tag (case-insensitive) |
| MIN CONF slider | Hides nodes below the confidence threshold |
| Status dropdown | All / Pending / Reviewed / Flagged / Dismissed |

The **NODES VISIBLE** counter updates live. The **Summary Bar** always shows totals across all nodes regardless of filters.

---

## Navbar Actions

### ▶ DEMO
1. Resets all filters to show all 10 nodes
2. Flies the map to the first IMINT node (Chandigarh)
3. Opens its popup automatically after the fly animation
4. Shows a dismissable banner for 7 seconds

### ↓ EXPORT
Downloads `FUSIONMAP_INTEL_REPORT_<date>.json` containing:
- Generation timestamp and classification header
- Summary counts by type, confidence level, and status
- Full node array (without raw imagery data)

---

## Running Locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

No environment variables required. No API keys. No backend.

---

## Deployment

The output of `npm run build` is a static site in `dist/`. Deploy to any static host:

```bash
# Vercel
vercel deploy --prod

# Netlify
netlify deploy --prod --dir=dist

# GitHub Pages, Cloudflare Pages, etc. — point to dist/
```

---

## Correctness Properties

The system enforces these invariants at all times:

1. **No duplicate nodes** — `addNodes()` deduplicates by `id` before merging
2. **Confidence level always derived** — `HIGH` ≥ 75, `MEDIUM` ≥ 45, `LOW` < 45
3. **Filter pipeline is pure** — `filtered` is a `useMemo` over `nodes` + filter state, never mutated
4. **Node updates are non-destructive** — `updateNode` uses spread merge, preserving all fields
5. **SummaryBar counts partition total** — type counts + confidence counts + status counts each sum to `nodes.length`

---

## Author

Built for **CYBERJOAR AI** — Problem Statement 1: Multi-Source Intelligence Fusion Dashboard
