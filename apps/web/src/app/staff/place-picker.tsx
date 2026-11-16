'use client';

import { useEffect, useState } from 'react';
import { api, pick, type Localized } from '@/lib/api';

export interface PlaceHit {
  id: string;
  name: Localized;
  kind: string;
  lat: number;
  lng: number;
}

export interface NewPlaceDraft {
  name: { az: string };
  districtSlug?: string;
  lat: number;
  lng: number;
}

export type PlaceChoice = { placeId: string } | { newPlace: NewPlaceDraft } | null;

/** Resolve a place: search existing places (trigram) or describe a new one. */
export function PlacePicker({ initialQuery, onChange }: { initialQuery?: string; onChange: (c: PlaceChoice) => void }) {
  const [q, setQ] = useState(initialQuery ?? '');
  const [hits, setHits] = useState<PlaceHit[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [mode, setMode] = useState<'existing' | 'new'>('existing');
  const [districts, setDistricts] = useState<Array<{ slug: string; name: Localized }>>([]);
  const [draft, setDraft] = useState({ name: initialQuery ?? '', districtSlug: '', lat: '', lng: '' });

  useEffect(() => {
    api<Array<{ slug: string; name: Localized }>>('/v1/cities/baku/districts').then(setDistricts).catch(() => setDistricts([]));
  }, []);

  useEffect(() => {
    if (mode !== 'existing' || q.trim().length < 2) {
      setHits([]);
      return;
    }
    const t = setTimeout(() => {
      api<PlaceHit[]>(`/v1/admin/places/search?q=${encodeURIComponent(q)}`).then(setHits).catch(() => setHits([]));
    }, 250);
    return () => clearTimeout(t);
  }, [q, mode]);

  useEffect(() => {
    if (mode === 'existing') onChange(selected ? { placeId: selected } : null);
    else {
      const lat = Number(draft.lat);
      const lng = Number(draft.lng);
      const ok = draft.name.trim() && draft.lat && draft.lng && Number.isFinite(lat) && Number.isFinite(lng);
      onChange(
        ok
          ? { newPlace: { name: { az: draft.name.trim() }, lat, lng, ...(draft.districtSlug ? { districtSlug: draft.districtSlug } : {}) } }
          : null,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, selected, draft]);

  return (
    <div>
      <div className="row" style={{ marginBottom: 8 }}>
        <label className="check" style={{ flex: 'none', minWidth: 0 }}>
          <input type="radio" checked={mode === 'existing'} onChange={() => setMode('existing')} /> Existing place
        </label>
        <label className="check" style={{ flex: 'none', minWidth: 0 }}>
          <input type="radio" checked={mode === 'new'} onChange={() => setMode('new')} /> New place
        </label>
      </div>
      {mode === 'existing' ? (
        <>
          <label>
            Search places
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type at least 2 letters" />
          </label>
          {hits.length > 0 && (
            <table style={{ marginTop: 8 }}>
              <tbody>
                {hits.map((h) => (
                  <tr key={h.id}>
                    <td style={{ width: 28 }}>
                      <input type="radio" name="place" checked={selected === h.id} onChange={() => setSelected(h.id)} />
                    </td>
                    <td>{pick(h.name)}</td>
                    <td className="muted">{h.kind}</td>
                    <td className="muted">
                      {h.lat.toFixed(4)}, {h.lng.toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {q.trim().length >= 2 && hits.length === 0 && <p className="muted">No match — add it as a new place.</p>}
        </>
      ) : (
        <div className="row">
          <label>
            Name (az)
            <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          </label>
          <label>
            District
            <select value={draft.districtSlug} onChange={(e) => setDraft({ ...draft, districtSlug: e.target.value })}>
              <option value="">—</option>
              {districts.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {pick(d.name)}
                </option>
              ))}
            </select>
          </label>
          <label style={{ maxWidth: 140 }}>
            Latitude
            <input value={draft.lat} onChange={(e) => setDraft({ ...draft, lat: e.target.value })} placeholder="40.3667" />
          </label>
          <label style={{ maxWidth: 140 }}>
            Longitude
            <input value={draft.lng} onChange={(e) => setDraft({ ...draft, lng: e.target.value })} placeholder="49.8352" />
          </label>
        </div>
      )}
    </div>
  );
}
