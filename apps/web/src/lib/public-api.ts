import type { Locale } from './i18n';

/** Shape of an item returned by GET /v1/discover and GET /v1/occurrences/:id (SALAAM-owned API). */
export interface OccurrenceItem {
  id: string;
  startsAt: string;
  endsAt: string | null;
  timeUnknown: boolean;
  lifecycle: 'scheduled' | 'cancelled' | 'postponed' | 'rescheduled' | 'ended' | string;
  availability: string;
  event: {
    id: string;
    title: string | null;
    description: string | null;
    locale: string | null;
    translated: boolean;
    categories: string[];
    ticketUrl: string | null;
    price?: { isFree: boolean | null; min: number | null; max: number | null; currency: string | null };
  };
  place: { id: string; name: string | null; kind: string; location: { lat: number; lng: number }; distanceKm?: number };
  trust: { tier: string; verification: string; lastVerifiedAt: string | null; badge: string; unconfirmedFields: string[] };
  attribution: { sourceName: string | null; url: string | null; synthetic?: boolean };
}

export interface DiscoverResponse {
  lens: string;
  window: { from: string; to: string };
  items: OccurrenceItem[];
}

export interface Category {
  slug: string;
  name: Partial<Record<Locale, string>>;
}

/** Server-side base URL (inside Docker the API is reachable by service name). */
export const serverApiUrl = () => process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export async function serverGet<T>(path: string, locale: Locale): Promise<{ ok: true; data: T } | { ok: false; status: number }> {
  try {
    const res = await fetch(`${serverApiUrl()}${path}`, { headers: { 'accept-language': locale }, cache: 'no-store' });
    if (!res.ok) return { ok: false, status: res.status };
    return { ok: true, data: (await res.json()) as T };
  } catch {
    return { ok: false, status: 0 };
  }
}

export function priceLabel(item: OccurrenceItem, t: { free: string }): string | null {
  const p = item.event.price;
  if (!p) return null;
  if (p.isFree) return t.free;
  if (p.min === null && p.max === null) return null;
  const range = p.min !== null && p.max !== null && p.max !== p.min ? `${p.min}–${p.max}` : `${p.min ?? p.max}`;
  return `${range} ${p.currency ?? 'AZN'}`;
}
