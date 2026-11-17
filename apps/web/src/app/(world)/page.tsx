import { DICTS } from '@/lib/i18n';
import { getLocale } from '@/lib/locale-server';
import { serverGet, type DiscoverResponse } from '@/lib/public-api';
import { timeOfDay, type TimeOfDay } from '../(public)/scene';
import { WorldHome } from '@/world/WorldHome';

export const dynamic = 'force-dynamic';

/** SALAAM World — the home is a place (FD-03): the personal room, the companion, and real events on top. */
export default async function WorldPage({ searchParams }: { searchParams: Promise<{ tod?: string }> }) {
  const locale = await getLocale();
  const t = DICTS[locale];
  const sp = await searchParams;
  const tod: TimeOfDay = (['morning', 'day', 'evening', 'night'] as const).find((x) => x === sp.tod) ?? timeOfDay();
  let lens: 'tonight' | 'weekend' = 'tonight';
  let res = await serverGet<DiscoverResponse>(`/v1/discover?lens=tonight&limit=50`, locale);
  if (res.ok && res.data.items.length === 0) {
    lens = 'weekend';
    res = await serverGet<DiscoverResponse>(`/v1/discover?lens=weekend&limit=50`, locale);
  }
  const greeting = tod === 'morning' ? t.morning : tod === 'day' ? t.afternoon : t.evening;
  return <WorldHome locale={locale} tod={tod} greeting={greeting} lens={lens} items={res.ok ? res.data.items : []} apiOk={res.ok} />;
}
