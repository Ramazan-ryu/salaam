'use client';

import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import { api, ApiError, fmtBaku, pick, type Localized } from '@/lib/api';
import { PlacePicker, type PlaceChoice } from '../../place-picker';

interface Submission {
  title: Localized;
  description?: Localized;
  placeName: string;
  placeAddress?: string;
  occurrences: Array<{ date: string; startTime?: string; endTime?: string }>;
  price?: { isFree?: boolean; min?: number; max?: number; currency: string };
  ticketUrl?: string;
  eventLanguage?: string;
  categorySlugs: string[];
}

interface TaskDetail {
  task: { id: string; status: string; summary: string; openedAt: string; type: string };
  source: { code: string; name: string; trustTier: string } | null;
  evidence: { payload: { organizerId?: string; submission?: Submission }; collectedAt: string } | null;
}

const REASONS = ['insufficient_info', 'duplicate', 'out_of_scope', 'not_permitted', 'spam', 'other'] as const;

export default function ReviewTask({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [detail, setDetail] = useState<TaskDetail | null>(null);
  const [place, setPlace] = useState<PlaceChoice>(null);
  const [reason, setReason] = useState<(typeof REASONS)[number]>('insufficient_info');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  useEffect(() => {
    api<TaskDetail>(`/v1/admin/review-tasks/${id}`)
      .then(setDetail)
      .catch((e: unknown) => setError(e instanceof ApiError ? e.message : 'Could not load task'));
  }, [id]);

  const decide = async (body: Record<string, unknown>) => {
    setBusy(true);
    setError(null);
    try {
      const res = await api<{ decision: string; eventId?: string }>(`/v1/admin/review-tasks/${id}/decision`, {
        method: 'POST',
        body: { ...body, ...(note ? { note } : {}) },
      });
      setDone(res.decision === 'approve' ? `Approved and published (event ${res.eventId}).` : 'Rejected. Nothing was published.');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Decision failed');
    } finally {
      setBusy(false);
    }
  };

  const s = detail?.evidence?.payload.submission;
  const open = detail?.task.status === 'open' && !done;

  return (
    <main>
      <p>
        <Link href="/review">← Review queue</Link>
      </p>
      <h1>{detail?.task.summary ?? 'Review task'}</h1>
      {error && <div className="error">{error}</div>}
      {done && <div className="success">{done}</div>}
      {detail && (
        <div className="grid2">
          <div className="panel">
            <h2 style={{ marginTop: 0 }}>Evidence</h2>
            <p className="muted">
              Source {detail.source?.code} · {detail.source?.name} · default trust {detail.source?.trustTier}
              <br />
              Received {fmtBaku(detail.evidence?.collectedAt)}
            </p>
            {s ? (
              <table>
                <tbody>
                  <tr>
                    <th>Title</th>
                    <td>
                      {Object.entries(s.title).map(([l, t]) => (
                        <div key={l}>
                          <span className="tag">{l}</span> {t}
                        </div>
                      ))}
                    </td>
                  </tr>
                  {s.description && (
                    <tr>
                      <th>Description</th>
                      <td>{pick(s.description)}</td>
                    </tr>
                  )}
                  <tr>
                    <th>Place (as given)</th>
                    <td>
                      {s.placeName}
                      {s.placeAddress ? <div className="muted">{s.placeAddress}</div> : null}
                    </td>
                  </tr>
                  <tr>
                    <th>Dates</th>
                    <td>
                      {s.occurrences.map((o, i) => (
                        <div key={i}>
                          {o.date} {o.startTime ?? <span className="tag warn">time unknown</span>}
                          {o.endTime ? `–${o.endTime}` : ''}
                        </div>
                      ))}
                    </td>
                  </tr>
                  <tr>
                    <th>Price</th>
                    <td>
                      {s.price
                        ? s.price.isFree
                          ? 'Free'
                          : `${s.price.min ?? '?'}${s.price.max ? `–${s.price.max}` : ''} ${s.price.currency}`
                        : <span className="muted">not stated (will not be shown)</span>}
                    </td>
                  </tr>
                  <tr>
                    <th>Tickets</th>
                    <td>{s.ticketUrl ? <a href={s.ticketUrl} target="_blank" rel="noreferrer noopener">{s.ticketUrl}</a> : '—'}</td>
                  </tr>
                  <tr>
                    <th>Categories</th>
                    <td>{s.categorySlugs.join(', ') || '—'}</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <pre>{JSON.stringify(detail.evidence?.payload, null, 2)}</pre>
            )}
          </div>

          <div className="panel">
            <h2 style={{ marginTop: 0 }}>Decision</h2>
            {!open && !done && <p className="muted">This task is already decided.</p>}
            {open && (
              <>
                <p className="muted">Check facts against the evidence. Approving publishes immediately with your name in the audit log.</p>
                <PlacePicker initialQuery={s?.placeName} onChange={setPlace} />
                <label style={{ marginTop: 12 }}>
                  Note (optional)
                  <textarea value={note} onChange={(e) => setNote(e.target.value)} />
                </label>
                <div className="row" style={{ marginTop: 12 }}>
                  <button className="primary" disabled={busy || !place} onClick={() => decide({ decision: 'approve', ...place })}>
                    Approve &amp; publish
                  </button>
                </div>
                <hr style={{ border: 0, borderTop: '1px solid var(--line)', margin: '18px 0' }} />
                <div className="row">
                  <label>
                    Reject reason
                    <select value={reason} onChange={(e) => setReason(e.target.value as (typeof REASONS)[number])}>
                      {REASONS.map((r) => (
                        <option key={r} value={r}>
                          {r.replace(/_/g, ' ')}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button className="danger" disabled={busy} onClick={() => decide({ decision: 'reject', reasonCode: reason })}>
                    Reject
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
