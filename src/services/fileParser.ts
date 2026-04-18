import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import type { IntelNode } from '../types/intel';

export interface ParsedRow {
  [key: string]: string | number;
}

export interface ParseResult {
  rows: ParsedRow[];
  headers: string[];
  error?: string;
}

export function parseCSV(file: File): Promise<ParseResult> {
  return new Promise(resolve => {
    Papa.parse<ParsedRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: result => {
        resolve({
          rows: result.data,
          headers: result.meta.fields ?? [],
          error: result.errors[0]?.message,
        });
      },
      error: err => resolve({ rows: [], headers: [], error: err.message }),
    });
  });
}

export async function parseExcel(file: File): Promise<ParseResult> {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: 'array' });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<ParsedRow>(ws, { defval: '' });
  const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
  return { rows, headers };
}

export async function parseJSON(file: File): Promise<ParseResult> {
  const text = await file.text();
  try {
    const data = JSON.parse(text);
    const arr: ParsedRow[] = Array.isArray(data) ? data : [data];
    const headers = arr.length > 0 ? Object.keys(arr[0]) : [];
    return { rows: arr, headers };
  } catch (e) {
    return { rows: [], headers: [], error: String(e) };
  }
}

export function rowsToIntelNodes(rows: ParsedRow[], sourceType: IntelNode['sourceType']): IntelNode[] {
  return rows
    .filter(r => r.lat && r.lng)
    .map((r, i) => ({
      id: `${sourceType}-import-${Date.now()}-${i}`,
      type: (String(r.type || 'OSINT').toUpperCase() as IntelNode['type']),
      lat: Number(r.lat),
      lng: Number(r.lng),
      title: String(r.title || `Imported Node ${i + 1}`),
      source: `${sourceType}-import`,
      sourceType,
      confidence: Number(r.confidence ?? 50),
      confidenceLevel: confidenceToLevel(Number(r.confidence ?? 50)),
      timestamp: String(r.timestamp || new Date().toISOString()),
      summary: String(r.summary || ''),
      imageUrl: null,
      imageCaption: null,
      location: String(r.location || ''),
      tags: String(r.tags || '').split(',').map(t => t.trim()).filter(Boolean),
      status: 'pending' as IntelNode['status'],
      classification: 'UNCLASSIFIED' as IntelNode['classification'],
    }));
}

function confidenceToLevel(c: number): IntelNode['confidenceLevel'] {
  if (c >= 75) return 'HIGH';
  if (c >= 45) return 'MEDIUM';
  return 'LOW';
}
