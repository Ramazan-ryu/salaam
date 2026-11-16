'use client';

import { useEffect, useState } from 'react';
import { coarseGeohash } from '@/lib/geohash';
import { DICTS, type Locale } from '@/lib/i18n';
import { onePerEvent, type Category, type DiscoverResponse } from '@/lib/public-api';
import { EventCard } from '../components';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
type Lens = 'now' | 'tonight' | 'weekend';
type Near = { state: 'off' } | { state: 'locating' } | { state: 'on'; area: string } | { state: 'denied' };

export function DiscoverClient({
  locale,
  categories,
  initialLens,
  initialCategory,
  initialNear = false,
}: {
  locale: Locale;
  categories: Category[];
  initialLens: Lens;
  initialCategory: string;
  initialNear?: boolean;
}) {
  const t = DICTS[locale];
  const [lens, setLens] = useState<Lens>(initialLens);
  const [category, setCategory] = useState(initialCategory);
  const [near, setNear] = useState<Near>({ state: 'off' });
  const [radiusKm, setRadiusKm] = useState(5);
  const [data, setData] = useState<DiscoverResponse | null>(null);
  const [failed, setFailed] = useState(false);

  // Keep the URL shareable (lens + category only — never location).
  useEffect(() => {
    const q = new URLSearchParams({ lens, ...(category ? { category } : {}) });
    window.history.replaceState(null, '', `/discover?${q}`);
  }, [lens, category]);

  useEffect(() => {
    const ctrl = new AbortController();
    setData(null);
    setFailed(false);
    const q = new URLSearchParams({ lens, limit: '30', ...(category ? { category } : {}) });
    const headers: Record<string, string> = { 'accept-language': locale };
    if (near.state === 'on') {
      q.set('radiusKm', String(radiusKm));
      headers['x-approx-area'] = near.area;
    }
    fetch(`${API}/v1/discover?${q}`, { headers, signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: DiscoverResponse) => setData(d))
      .catch((e: unknown) => {
        if ((e as Error).name !== 'AbortError') setFailed(true);
      });
    return () => ctrl.abort();
  }, [lens, category, near, radiusKm, locale]);

  // Opened from the companion's map pin: ask for the area once (the browser asks permission).
  useEffect(() => {
    if (initialNear) toggleNear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleNear = () => {
    if (near.state === 'on' || near.state === 'locating') return setNear({ state: 'off' });
    if (!('geolocation' in navigator)) return setNear({ state: 'denied' });
    setNear({ state: 'locating' });
    navigator.geolocation.getCurrentPosition(
      (pos) => setNear({ state: 'on', area: coarseGeohash(pos.coords.latitude, pos.coords.longitude, 5) }),
      () => setNear({ state: 'denied' }),
      { enableHighAccuracy: false, maximumAge: 10 * 60_000, timeout: 10_000 },
    );
  };

  const items = onePerEvent(data?.items ?? []);

  return (
    <>
      <div className="chips" role="group" aria-label={t.when}>
        {(['now', 'tonight', 'weekend'] as const).map((l) => (
          <button key={l} type="button" className="chip" aria-pressed={l === lens} onClick={() => setLens(l)}>
            {t[l]}
          </button>
        ))}
      </div>

      <div className="chips" role="group" aria-label="Category" style={{ paddingTop: 6 }}>
        <button type="button" className="chip chip-sm" aria-pressed={category === ''} onClick={() => setCategory('')}>
          {t.allCategories}
        </button>
        {categories.map((c) => (
          <button key={c.slug} type="button" className="chip chip-sm" aria-pressed={category === c.slug} onClick={() => setCategory(c.slug)}>
            {c.name[locale] ?? c.name.az ?? c.slug}
          </button>
        ))}
      </div>

      <div className="ctrl-row">
        <button type="button" className="chip chip-sm" aria-pressed={near.state === 'on'} onClick={toggleNear}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
          </svg>
          {near.state === 'locating' ? t.locating : t.nearMe}
        </button>
        {near.state === 'on' && (
          <label>
            <span className="sr-only">{t.radius}</span>
            <select className="select" value={radiusKm} onChange={(e) => setRadiusKm(Number(e.target.value))}>
              {[2, 5, 10, 25].map((r) => (
                <option key={r} value={r}>
                  {r} km
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      {near.state === 'on' && <p className="hint">{t.nearMeHint}</p>}
      {near.state === 'denied' && <p className="hint">{t.locationDenied}</p>}

      <section className="section" aria-live="polite" aria-busy={!data && !failed}>
        {failed && <div className="error-box">{t.apiDown}</div>}
        {!data && !failed && (
          <div className="cards">
            <div className="skeleton" />
            <div className="skeleton" />
            <div className="skeleton" />
          </div>
        )}
        {data && items.length === 0 && (
          <div className="empty">
            <p>{t.noResults}</p>
          </div>
        )}
        {items.length > 0 && (
          <div className="cards discover-grid">
            {items.map((i) => (
              <EventCard key={i.id} item={i} t={t} locale={locale} />
            ))}
          </div>
        )}
        {items.some((i) => i.attribution.synthetic) && <p className="note" style={{ margin: 0 }}>{t.sample}</p>}
      </section>
    </>
  );
}
