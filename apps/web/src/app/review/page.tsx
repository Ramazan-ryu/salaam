'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api, ApiError, fmtBaku } from '@/lib/api';

interface TaskRow {
  id: string;
  type: string;
  status: string;
  priority: number;
  summary: string;
  openedAt: string;
  sourceCode: string | null;
}

export default function ReviewQueue() {
  const [status, setStatus] = useState<'open' | 'done'>('open');
  const [rows, setRows] = useState<TaskRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setRows(null);
    api<TaskRow[]>(`/v1/admin/review-tasks?status=${status}`)
      .then(setRows)
      .catch((e: unknown) => setError(e instanceof ApiError ? e.message : 'Could not reach the API'));
  }, [status]);

  return (
    <main>
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Review queue</h1>
        <select value={status} onChange={(e) => setStatus(e.target.value as 'open' | 'done')} style={{ maxWidth: 140 }}>
          <option value="open">Open</option>
          <option value="done">Decided</option>
        </select>
      </div>
      {error && <div className="error">{error}</div>}
      <div className="panel">
        {rows === null && !error && <p className="muted">Loading…</p>}
        {rows?.length === 0 && <p className="muted">Nothing waiting. 🎉</p>}
        {rows && rows.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Priority</th>
                <th>Item</th>
                <th>Source</th>
                <th>Received</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.priority <= 20 ? <span className="tag warn">≤72 h</span> : <span className="tag">normal</span>}</td>
                  <td>
                    <Link href={`/review/${r.id}`}>{r.summary}</Link>
                  </td>
                  <td className="muted">{r.sourceCode ?? '—'}</td>
                  <td className="muted">{fmtBaku(r.openedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
