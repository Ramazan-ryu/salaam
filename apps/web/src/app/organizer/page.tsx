'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, ApiError, fmtBaku, pick, type Localized } from '@/lib/api';

interface MySubmission {
  id: string;
  title: Localized | null;
  receivedAt: string;
  status: 'pending_review' | 'published' | 'rejected';
}

const STATUS_LABEL: Record<MySubmission['status'], [string, string]> = {
  pending_review: ['In review', 'warn'],
  published: ['Published', 'ok'],
  rejected: ['Not published', 'bad'],
};

export default function OrganizerPage() {
  const [orgId, setOrgId] = useState('');
  const [mine, setMine] = useState<MySubmission[] | null>(null);
  const [categories, setCategories] = useState<Array<{ slug: string; name: Localized }>>([]);
  const [f, setF] = useState({
    titleAz: '',
    titleRu: '',
    descAz: '',
    placeName: '',
    placeAddress: '',
    date: '',
    startTime: '',
    endTime: '',
    isFree: false,
    priceMin: '',
    ticketUrl: '',
    category: '',
    rights: false,
  });
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    try {
      setOrgId(window.localStorage.getItem('salaam.orgId') ?? '');
    } catch {
      /* ignore */
    }
    api<Array<{ slug: string; name: Localized }>>('/v1/categories').then(setCategories).catch(() => setCategories([]));
  }, []);

  const loadMine = useCallback(() => {
    if (!/^[0-9a-f-]{36}$/i.test(orgId)) return setMine(null);
    try {
      window.localStorage.setItem('salaam.orgId', orgId);
    } catch {
      /* ignore */
    }
    api<MySubmission[]>(`/v1/organizer/${orgId}/submissions`)
      .then(setMine)
      .catch((e: unknown) => {
        setMine(null);
        setMsg({ ok: false, text: e instanceof ApiError ? e.message : 'Could not load submissions' });
      });
  }, [orgId]);
  useEffect(loadMine, [loadMine]);

  const submit = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const title: Localized = {};
      if (f.titleAz) title.az = f.titleAz;
      if (f.titleRu) title.ru = f.titleRu;
      await api(`/v1/organizer/${orgId}/submissions`, {
        method: 'POST',
        body: {
          title,
          ...(f.descAz ? { description: { az: f.descAz } } : {}),
          placeName: f.placeName,
          ...(f.placeAddress ? { placeAddress: f.placeAddress } : {}),
          occurrences: [
            { date: f.date, ...(f.startTime ? { startTime: f.startTime } : {}), ...(f.endTime ? { endTime: f.endTime } : {}) },
          ],
          ...(f.isFree
            ? { price: { isFree: true, currency: 'AZN' } }
            : f.priceMin
              ? { price: { min: Number(f.priceMin), currency: 'AZN' } }
              : {}),
          ...(f.ticketUrl ? { ticketUrl: f.ticketUrl } : {}),
          categorySlugs: f.category ? [f.category] : [],
          rightsConfirmed: f.rights,
        },
      });
      setMsg({ ok: true, text: 'Thank you — your event is in review. A Salaam editor checks every event before it appears.' });
      loadMine();
    } catch (e) {
      setMsg({
        ok: false,
        text:
          e instanceof ApiError
            ? `${e.problem.detail}${e.problem.errors ? ' — ' + e.problem.errors.map((x) => `${x.path}: ${x.message}`).join('; ') : ''}`
            : 'Submission failed',
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <main>
      <h1>Submit an event</h1>
      <div className="panel">
        <label style={{ maxWidth: 420 }}>
          Organizer ID
          <input value={orgId} onChange={(e) => setOrgId(e.target.value.trim())} placeholder="given to you by the Salaam team" />
        </label>
      </div>

      <div className="panel">
        <div className="row">
          <label>
            Title (az)
            <input value={f.titleAz} onChange={(e) => setF({ ...f, titleAz: e.target.value })} />
          </label>
          <label>
            Title (ru)
            <input value={f.titleRu} onChange={(e) => setF({ ...f, titleRu: e.target.value })} />
          </label>
        </div>
        <label style={{ marginTop: 10 }}>
          Short description (az)
          <textarea value={f.descAz} onChange={(e) => setF({ ...f, descAz: e.target.value })} />
        </label>
        <div className="row" style={{ marginTop: 10 }}>
          <label>
            Venue name
            <input value={f.placeName} onChange={(e) => setF({ ...f, placeName: e.target.value })} />
          </label>
          <label>
            Address
            <input value={f.placeAddress} onChange={(e) => setF({ ...f, placeAddress: e.target.value })} />
          </label>
        </div>
        <div className="row" style={{ marginTop: 10 }}>
          <label style={{ maxWidth: 180 }}>
            Date
            <input type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} />
          </label>
          <label style={{ maxWidth: 130 }}>
            Starts
            <input type="time" value={f.startTime} onChange={(e) => setF({ ...f, startTime: e.target.value })} />
          </label>
          <label style={{ maxWidth: 130 }}>
            Ends
            <input type="time" value={f.endTime} onChange={(e) => setF({ ...f, endTime: e.target.value })} />
          </label>
          <label>
            Category
            <select value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}>
              <option value="">—</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {pick(c.name)}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="row" style={{ marginTop: 10 }}>
          <label className="check" style={{ flex: 'none' }}>
            <input type="checkbox" checked={f.isFree} onChange={(e) => setF({ ...f, isFree: e.target.checked })} /> Free entry
          </label>
          {!f.isFree && (
            <label style={{ maxWidth: 160 }}>
              Price from (AZN)
              <input inputMode="decimal" value={f.priceMin} onChange={(e) => setF({ ...f, priceMin: e.target.value })} />
            </label>
          )}
          <label>
            Ticket link
            <input value={f.ticketUrl} onChange={(e) => setF({ ...f, ticketUrl: e.target.value })} placeholder="https://" />
          </label>
        </div>
        <label className="check" style={{ marginTop: 14 }}>
          <input type="checkbox" checked={f.rights} onChange={(e) => setF({ ...f, rights: e.target.checked })} />
          I organize this event (or am authorized to share it) and Salaam may publish these details.
        </label>
        {msg && <div className={msg.ok ? 'success' : 'error'}>{msg.text}</div>}
        <div className="row" style={{ marginTop: 12 }}>
          <button
            className="primary"
            disabled={busy || !orgId || !f.rights || !f.date || !f.placeName || !(f.titleAz || f.titleRu)}
            onClick={submit}
          >
            Send for review
          </button>
        </div>
      </div>

      {mine && (
        <div className="panel">
          <h2 style={{ marginTop: 0 }}>Your submissions</h2>
          {mine.length === 0 ? (
            <p className="muted">None yet.</p>
          ) : (
            <table>
              <tbody>
                {mine.map((m) => (
                  <tr key={m.id}>
                    <td>{pick(m.title)}</td>
                    <td className="muted">{fmtBaku(m.receivedAt)}</td>
                    <td>
                      <span className={`tag ${STATUS_LABEL[m.status][1]}`}>{STATUS_LABEL[m.status][0]}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </main>
  );
}
