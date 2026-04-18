import { useState, useRef } from 'react';
import { PlusCircle, ChevronDown, ChevronRight } from 'lucide-react';
import type { IntelNode, IntelType } from '../types/intel';

interface Props {
  onAdd: (node: IntelNode) => void;
}

const EMPTY = {
  type: 'OSINT' as IntelType,
  title: '',
  location: '',
  lat: '',
  lng: '',
  source: '',
  confidence: 50,
  classification: 'UNCLASSIFIED' as IntelNode['classification'],
  summary: '',
};

export default function ManualEntryForm({ onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageCaption, setImageCaption] = useState('');
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: string, v: string | number) => setForm(f => ({ ...f, [k]: v }));

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/jpeg') && !file.name.toLowerCase().match(/\.(jpg|jpeg)$/)) {
      setFeedback({ ok: false, msg: 'Only JPG/JPEG images allowed.' });
      return;
    }
    const reader = new FileReader();
    reader.onload = ev => setImageUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const submit = () => {
    if (!form.title || !form.lat || !form.lng) {
      setFeedback({ ok: false, msg: 'Title, Lat, and Lng are required.' });
      return;
    }
    const lat = Number(form.lat), lng = Number(form.lng);
    if (isNaN(lat) || isNaN(lng)) {
      setFeedback({ ok: false, msg: 'Lat/Lng must be valid numbers.' });
      return;
    }
    const c = form.confidence;
    const node: IntelNode = {
      id: `manual-${Date.now()}`,
      type: form.type,
      lat, lng,
      title: form.title,
      source: form.source || 'manual-entry',
      sourceType: 'manual',
      confidence: c,
      confidenceLevel: c >= 75 ? 'HIGH' : c >= 45 ? 'MEDIUM' : 'LOW',
      timestamp: new Date().toISOString(),
      summary: form.summary,
      imageUrl: form.type === 'IMINT' ? imageUrl : null,
      imageCaption: form.type === 'IMINT' ? imageCaption || null : null,
      location: form.location,
      tags: [],
      status: 'pending',
      classification: form.classification,
    };
    onAdd(node);
    setForm(EMPTY);
    setImageUrl(null);
    setImageCaption('');
    setFeedback({ ok: true, msg: 'Node added to map.' });
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="border-b" style={{ borderColor: '#1e293b' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-mono hover:bg-slate-800 transition-colors"
      >
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        <PlusCircle size={12} className="text-green-400" />
        <span className="text-slate-300">MANUAL ENTRY</span>
      </button>

      {open && (
        <div className="px-3 pb-3 space-y-2 text-xs font-mono">
          {/* Type */}
          <div className="flex gap-1">
            {(['OSINT', 'HUMINT', 'IMINT'] as IntelType[]).map(t => (
              <button
                key={t}
                onClick={() => set('type', t)}
                className="flex-1 py-1 rounded border text-xs font-bold transition-colors"
                style={{
                  borderColor: form.type === t ? '#10b981' : '#1e293b',
                  color: form.type === t ? '#10b981' : '#64748b',
                  background: form.type === t ? '#10b98122' : 'transparent',
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <input
            value={form.title}
            onChange={e => set('title', e.target.value)}
            placeholder="Title *"
            className="w-full bg-transparent border rounded px-2 py-1 text-slate-300 outline-none placeholder-slate-700"
            style={{ borderColor: '#1e293b' }}
          />
          <input
            value={form.location}
            onChange={e => set('location', e.target.value)}
            placeholder="Location"
            className="w-full bg-transparent border rounded px-2 py-1 text-slate-300 outline-none placeholder-slate-700"
            style={{ borderColor: '#1e293b' }}
          />
          <div className="flex gap-2">
            <input
              value={form.lat}
              onChange={e => set('lat', e.target.value)}
              placeholder="Lat *"
              className="flex-1 bg-transparent border rounded px-2 py-1 text-slate-300 outline-none placeholder-slate-700"
              style={{ borderColor: '#1e293b' }}
            />
            <input
              value={form.lng}
              onChange={e => set('lng', e.target.value)}
              placeholder="Lng *"
              className="flex-1 bg-transparent border rounded px-2 py-1 text-slate-300 outline-none placeholder-slate-700"
              style={{ borderColor: '#1e293b' }}
            />
          </div>
          <input
            value={form.source}
            onChange={e => set('source', e.target.value)}
            placeholder="Source"
            className="w-full bg-transparent border rounded px-2 py-1 text-slate-300 outline-none placeholder-slate-700"
            style={{ borderColor: '#1e293b' }}
          />

          {/* Confidence */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500">CONF:</span>
            <input
              type="range" min={0} max={100} value={form.confidence}
              onChange={e => set('confidence', Number(e.target.value))}
              className="flex-1 accent-green-500"
            />
            <span className="text-green-400 w-8">{form.confidence}%</span>
          </div>

          {/* Classification */}
          <select
            value={form.classification}
            onChange={e => set('classification', e.target.value)}
            className="w-full bg-transparent border rounded px-2 py-1 text-slate-300 outline-none"
            style={{ borderColor: '#1e293b' }}
          >
            <option value="UNCLASSIFIED">UNCLASSIFIED</option>
            <option value="CONFIDENTIAL">CONFIDENTIAL</option>
            <option value="SECRET">SECRET</option>
          </select>

          <textarea
            value={form.summary}
            onChange={e => set('summary', e.target.value)}
            placeholder="Summary..."
            rows={3}
            className="w-full bg-transparent border rounded px-2 py-1 text-slate-300 outline-none placeholder-slate-700 resize-none"
            style={{ borderColor: '#1e293b' }}
          />

          {/* IMINT image upload */}
          {form.type === 'IMINT' && (
            <div className="space-y-1">
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full py-1 rounded border text-slate-400 border-dashed"
                style={{ borderColor: '#1e293b' }}
              >
                + Upload JPG Image
              </button>
              <input ref={fileRef} type="file" accept=".jpg,.jpeg" className="hidden" onChange={handleImage} />
              {imageUrl && (
                <div className="rounded border overflow-hidden" style={{ borderColor: '#10b981' }}>
                  <div className="px-2 py-1 text-xs font-mono" style={{ background: '#052e16', color: '#4ade80' }}>
                    IMINT IMAGERY LOADED ✓
                  </div>
                  <img
                    src={imageUrl}
                    alt="preview"
                    style={{ width: '80px', height: '60px', objectFit: 'cover', display: 'block', margin: '4px' }}
                  />
                  <input
                    value={imageCaption}
                    onChange={e => setImageCaption(e.target.value)}
                    placeholder="Image caption..."
                    className="w-full bg-transparent border-t px-2 py-1 text-slate-300 outline-none placeholder-slate-700 text-xs"
                    style={{ borderColor: '#1e293b' }}
                  />
                </div>
              )}
            </div>
          )}

          {feedback && (
            <div className={`text-xs px-2 py-1 rounded ${feedback.ok ? 'text-green-400' : 'text-red-400'}`}
              style={{ background: feedback.ok ? '#10b98122' : '#ef444422' }}>
              {feedback.msg}
            </div>
          )}

          <button
            onClick={submit}
            className="w-full py-1.5 rounded text-xs font-bold border transition-colors"
            style={{ borderColor: '#10b981', color: '#10b981' }}
          >
            + ADD TO MAP
          </button>
        </div>
      )}
    </div>
  );
}
