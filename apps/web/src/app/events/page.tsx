'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, ApiError, fmtBaku, pick, type Localized } from '@/lib/api';
import { PlacePicker, type PlaceChoice } from '../place-picker';

interface EventRow {
  id: string;
  title: Localized;
  verificationStatus: string;
  lifecycleStatus: string;
  trustTier: string;
  lastVerifiedAt: string | null;
  nextStart: string | null;
}

interface Category {
  slug: string;
  name: Localized;
}

export default function EventsPage() {
  const [rows, setRows] = useState<EventRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    api<EventRow[]>('/v1/admin/events')
      .then(setRows)
      .catch((e: unknown) => setError(e instanceof ApiError ? e.message : 'Could not reach the API'));
  }, []);
  useEffect(load, [load]);

  return (
    <main>
      <h1>Events</h1>
      {error && <div className="error">{error}</div>}
      <ManualEntry onCreated={load} />
      <div className="panel">
        <h2 style={{ marginTop: 0 }}>Latest</h2>
        {rows === null && !error && <p className="muted">Loading…</p>}
        {rows?.length === 0 && <p className="muted">No events yet.</p>}
        {rows && rows.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Next</th>
                <th>Status</th>
                <th>Trust</th>
                <th>Verified</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{pick(r.title)}</td>
                  <td className="muted">{fmtBaku(r.nextStart)}</td>
                  <td>
                    <span className={`tag ${r.verificationStatus === 'staff_verified' ? 'ok' : 'warn'}`}>{r.verificationStatus}</span>{' '}
                    {r.lifecycleStatus !== 'scheduled' && <span className="tag bad">{r.lifecycleStatus}</span>}
                  </td>
                  <td className="muted">{r.trustTier.replace(/_/g, ' ')}</td>
                  <td className="muted">{fmtBaku(r.lastVerifiedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}

function ManualEntry({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [place, setPlace] = useState<PlaceChoice>(null);
  const [form, setForm] = useState({ titleAz: '', titleRu: '', titleEn: '', date: '', startTime: '', sourceUrl: '', category: '' });
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) api<Category[]>('/v1/categories').then(setCategories).catch(() => setCategories([]));
  }, [open]);

  const submit = async () => {
    setBusy(true);
    setMsg(null);
    try {
      let placeId: string;
      if (place && 'placeId' in place) placeId = place.placeId;
      else if (place && 'newPlace' in place) placeId = (await api<{ id: string }>('/v1/admin/places', { method: 'POST', body: place.newPlace })).id;
      else throw new Error('Choose a place');
      const title: Localized = {};
      if (form.titleAz) title.az = form.titleAz;
      if (form.titleRu) title.ru = form.titleRu;
      if (form.titleEn) title.en = form.titleEn;
      await api('/v1/admin/events', {
        method: 'POST',
        body: {
          placeId,
          title,
          occurrences: [{ date: form.date, ...(form.startTime ? { startTime: form.startTime } : {}) }],
          categorySlugs: form.category ? [form.category] : [],
          sourceUrl: form.sourceUrl,
        },
      });
      setMsg({ ok: true, text: 'Published.' });
      setForm({ titleAz: '', titleRu: '', titleEn: '', date: '', startTime: '', sourceUrl: '', category: '' });
      onCreated();
    } catch (e) {
      setMsg({ ok: false, text: e instanceof ApiError ? `${e.message}${e.problem.errors ? ' — ' + e.problem.errors.map((x) => `${x.path}: ${x.message}`).join('; ') : ''}` : (e as Error).message });
    } finally {
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <div className="panel">
        <button onClick={() => setOpen(true)}>+ Manual entry from an official source</button>
      </div>
    );
  }

  return (
    <div className="panel">
      <h2 style={{ marginTop: 0 }}>Manual entry (DS-001)</h2>
      <p className="muted">Only enter facts you can see on the official source. Leave the time empty if it is not stated — it will be shown as unconfirmed.</p>
      <div className="row">
        <label>
          Title (az)
          <input value={form.titleAz} onChange={(e) => setForm({ ...form, titleAz: e.target.value })} />
        </label>
        <label>
          Title (ru)
          <input value={form.titleRu} onChange={(e) => setForm({ ...form, titleRu: e.target.value })} />
        </label>
        <label>
          Title (en)
          <input value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} />
        </label>
      </div>
      <div className="row" style={{ marginTop: 10 }}>
        <label style={{ maxWidth: 180 }}>
          Date
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </label>
        <label style={{ maxWidth: 140 }}>
          Start time
          <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
        </label>
        <label>
          Category
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="">—</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {pick(c.name)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Official source URL
          <input value={form.sourceUrl} onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })} placeholder="https://" />
        </label>
      </div>
      <div style={{ marginTop: 12 }}>
        <PlacePicker onChange={setPlace} />
      </div>
      {msg && <div className={msg.ok ? 'success' : 'error'}>{msg.text}</div>}
      <div className="row" style={{ marginTop: 12 }}>
        <button className="primary" disabled={busy || !place || !form.date || !form.sourceUrl} onClick={submit}>
          Publish
        </button>
        <button onClick={() => setOpen(false)}>Close</button>
      </div>
    </div>
  );
}
