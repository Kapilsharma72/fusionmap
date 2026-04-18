import { useState, useRef } from 'react';
import { Upload, ChevronDown, ChevronRight } from 'lucide-react';
import { parseCSV, parseExcel, parseJSON, rowsToIntelNodes, type ParsedRow } from '../services/fileParser';
import type { IntelNode } from '../types/intel';

interface Props {
  onNodesLoaded: (nodes: IntelNode[]) => void;
}

export default function FileDropZone({ onNodesLoaded }: Props) {
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [sourceType, setSourceType] = useState<IntelNode['sourceType']>('csv');
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setParsing(true);
    setFileName(file.name);
    let result;
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'csv') { result = await parseCSV(file); setSourceType('csv'); }
    else if (ext === 'xlsx' || ext === 'xls') { result = await parseExcel(file); setSourceType('excel'); }
    else if (ext === 'json') { result = await parseJSON(file); setSourceType('json'); }
    else { setError('Unsupported file type. Use CSV, XLSX, or JSON.'); setParsing(false); return; }
    setParsing(false);
    if (result.error) { setError(result.error); return; }
    setRows(result.rows);
    setHeaders(result.headers);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const addAll = () => {
    const nodes = rowsToIntelNodes(rows, sourceType);
    if (nodes.length === 0) { setError('No rows with valid lat/lng found.'); return; }
    onNodesLoaded(nodes);
    setRows([]);
    setHeaders([]);
    setFileName('');
  };

  return (
    <div className="border-b" style={{ borderColor: '#1e293b' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-mono hover:bg-slate-800 transition-colors"
      >
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        <Upload size={12} className="text-purple-400" />
        <span className="text-slate-300">FILE IMPORT</span>
        <span className="ml-auto text-slate-600">CSV / XLSX / JSON</span>
      </button>

      {open && (
        <div className="px-3 pb-3 space-y-2 text-xs font-mono">
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed rounded p-4 text-center cursor-pointer transition-colors"
            style={{ borderColor: dragging ? '#a855f7' : '#1e293b', background: dragging ? '#a855f711' : 'transparent' }}
          >
            <Upload size={16} className="mx-auto mb-1 text-slate-600" />
            <div className="text-slate-500">{fileName || 'Drop file or click to browse'}</div>
            <div className="text-slate-700 mt-1">CSV · XLSX · JSON</div>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.xlsx,.xls,.json"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />

          {parsing && <div className="text-yellow-400 animate-pulse">Parsing file...</div>}
          {error && <div className="text-red-400">{error}</div>}

          {rows.length > 0 && (
            <div className="space-y-2">
              <div className="text-slate-500">{rows.length} rows parsed — preview (first 3):</div>
              <div className="overflow-x-auto rounded border" style={{ borderColor: '#1e293b' }}>
                <table className="text-xs w-full">
                  <thead>
                    <tr style={{ background: '#0f172a' }}>
                      {headers.slice(0, 5).map(h => (
                        <th key={h} className="px-2 py-1 text-left text-slate-500 border-b" style={{ borderColor: '#1e293b' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(0, 3).map((row, i) => (
                      <tr key={i}>
                        {headers.slice(0, 5).map(h => (
                          <td key={h} className="px-2 py-1 text-slate-400 border-b" style={{ borderColor: '#1e293b' }}>
                            {String(row[h] ?? '').slice(0, 20)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                onClick={addAll}
                className="w-full py-1.5 rounded text-xs font-bold border transition-colors"
                style={{ borderColor: '#a855f7', color: '#a855f7' }}
              >
                + ADD ALL TO MAP
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
