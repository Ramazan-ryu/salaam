import type { Locale } from './i18n';

import type { components } from './api-types';

/** Types generated from docs/openapi.json (`pnpm --filter @salaam/web api:types`) — never hand-written. */
export type OccurrenceItem = components['schemas']['OccurrenceItem'];
export type DiscoverResponse = components['schemas']['DiscoverResponse'];
export type Category = components['schemas']['Category'];

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

/** One card per event: keep the soonest occurrence (lists are sorted by start time or distance). */
export function onePerEvent(items: OccurrenceItem[]): OccurrenceItem[] {
  const seen = new Set<string>();
  return items.filter((i) => (seen.has(i.event.id) ? false : (seen.add(i.event.id), true)));
}
