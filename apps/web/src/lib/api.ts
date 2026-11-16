'use client';

/**
 * Minimal API client for the staff/organizer web (stage S1).
 * Identity: DEV-ONLY header stand-in until spike S-AUTH (ADR-0010). Stored per browser.
 */
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export type DevRole = 'curator' | 'organizer' | 'admin';
export interface DevIdentity {
  id: string;
  role: DevRole;
}

const KEY = 'salaam.devIdentity';

export function getIdentity(): DevIdentity {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as DevIdentity;
  } catch {
    /* storage unavailable — fall through */
  }
  return { id: 'curator-1', role: 'curator' };
}

export function setIdentity(identity: DevIdentity) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(identity));
  } catch {
    /* ignore */
  }
}

export interface Problem {
  status: number;
  code: string;
  detail: string;
  errors?: Array<{ path: string; message: string }>;
}

export class ApiError extends Error {
  constructor(public readonly problem: Problem) {
    super(`${problem.code}: ${problem.detail}`);
  }
}

export async function api<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const who = getIdentity();
  const res = await fetch(`${API_URL}${path}`, {
    method: init.method ?? 'GET',
    headers: {
      'content-type': 'application/json',
      'x-dev-user-id': who.id,
      'x-dev-role': who.role,
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
  const data = res.headers.get('content-type')?.includes('json') ? await res.json() : null;
  if (!res.ok) throw new ApiError((data as Problem) ?? { status: res.status, code: 'HTTP_ERROR', detail: res.statusText });
  return data as T;
}

export type Localized = Partial<Record<'az' | 'ru' | 'en', string>>;
export const pick = (t: Localized | null | undefined) => (t ? (t.az ?? t.ru ?? t.en ?? '') : '');

export function fmtBaku(iso: string | null | undefined) {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Baku',
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}
