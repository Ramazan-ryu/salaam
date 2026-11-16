import Link from 'next/link';
import { DICTS, fmtKm, fmtToday, fmtWhen, greeting, type Dict, type Locale } from '@/lib/i18n';
import { getLocale } from '@/lib/locale-server';
import { onePerEvent, priceLabel, serverGet, type DiscoverResponse, type OccurrenceItem } from '@/lib/public-api';
import { LangSwitch, TopNav } from './chrome';
import { MOODS, type Mood } from '@/lib/moods';
import { CompanionWorld, ITEM_ICONS, ITEM_TONES, type WorldItem } from './companion-world';
import { EventCard, PinIcon } from './components';

export const dynamic = 'force-dynamic';

const LENSES = ['now', 'tonight', 'weekend'] as const;
type HomeLens = (typeof LENSES)[number];

/** Which kinds of events suit a mood (rule-based, explainable — no AI). */
const MOOD_CATEGORIES: Record<Mood, string[]> = {
  calm: ['exhibition_culture', 'cinema', 'community_free'],
  energetic: ['music', 'workshop_talk'],
  curious: ['workshop_talk', 'exhibition_culture'],
};

/** Rule-based companion line (no AI): the soonest verified item in the chosen lens (and mood), with its reasons. */
function suggestion(items: OccurrenceItem[], t: Dict, locale: Locale, mood?: Mood) {
  const scheduled = items.filter((i) => i.lifecycle === 'scheduled');
  // Categories are in order of preference: the first category with an event wins.
  const byMood = mood ? MOOD_CATEGORIES[mood].map((c) => scheduled.find((i) => i.event.categories.includes(c))).find(Boolean) : undefined;
  const pick = byMood ?? scheduled[0];
  if (!pick) return null;
  const reasons = [
    pick.timeUnknown ? fmtWhen(pick.startsAt, locale, { timeUnknown: true }) : fmtWhen(pick.startsAt, locale),
    pick.place.distanceKm !== undefined ? fmtKm(pick.place.distanceKm, locale) : pick.place.name,
    priceLabel(pick, t),
  ].filter(Boolean);
  return { item: pick, why: reasons.join(' · ') };
}

export default async function Home({ searchParams }: { searchParams: Promise<{ lens?: string; mood?: string }> }) {
  const locale = await getLocale();
  const t = DICTS[locale];
  const sp = await searchParams;
  const lens: HomeLens = (LENSES as readonly string[]).includes(sp.lens ?? '') ? (sp.lens as HomeLens) : 'tonight';
  const mood = (MOODS as string[]).includes(sp.mood ?? '') ? (sp.mood as Mood) : undefined;
  const moodQ = mood ? `&mood=${mood}` : '';
  const res = await serverGet<DiscoverResponse>(`/v1/discover?lens=${lens}&limit=50`, locale);
  const all = res.ok ? res.data.items : [];
  const items = onePerEvent(all).slice(0, 8);
  const count = (slug: string) => onePerEvent(all).filter((i) => i.event.categories.includes(slug)).length;
  const worldItems: WorldItem[] = [
    { key: 'music', label: t.itemMusic },
    { key: 'exhibition_culture', label: t.itemExhibition },
    { key: 'workshop_talk', label: t.itemWorkshop },
    { key: 'cinema', label: t.itemCinema },
    { key: 'community_free', label: t.itemCommunity },
  ].map((x) => ({
    ...x,
    href: `/discover?lens=${lens}&category=${x.key}`,
    count: count(x.key),
    tone: ITEM_TONES[x.key]!,
    icon: ITEM_ICONS[x.key as keyof typeof ITEM_ICONS],
  }));
  worldItems.push({ key: 'near', label: t.nearMe, href: `/discover?lens=${lens}&near=1`, tone: ITEM_TONES.near!, icon: ITEM_ICONS.near });
  const s = suggestion(all, t, locale, mood);
  const prefix = mood === 'calm' ? t.suggestCalm : mood === 'energetic' ? t.suggestEnergetic : mood === 'curious' ? t.suggestCurious : t.suggestPrefix;
  const moodPills: Array<{ key: Mood | undefined; label: string; color: string }> = [
    { key: undefined, label: t.moodMixed, color: 'linear-gradient(90deg,#0D5F5B,#E8603C,#4D3F7A)' },
    { key: 'calm', label: t.moodCalm, color: '#0D5F5B' },
    { key: 'energetic', label: t.moodEnergetic, color: '#E8603C' },
    { key: 'curious', label: t.moodCurious, color: '#4D3F7A' },
  ];
  const heading = lens === 'now' ? t.inBakuNow : lens === 'tonight' ? t.inBakuTonight : t.inBakuWeekend;
  const anySample = all.some((i) => i.attribution.synthetic);

  return (
    <main>
      <header className="pub-header">
        <div>
          <p className="pub-date">{fmtToday(locale)}</p>
          <h1 className="pub-hello">{greeting(locale)}</h1>
          <p className="pub-loc">
            <PinIcon />
            {t.city}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          <TopNav locale={locale} />
          <LangSwitch locale={locale} />
        </div>
      </header>

      <div className="home-grid">
        <div className="stage-col">
          <CompanionWorld
            t={t}
            items={worldItems}
            mood={mood}
            bubble={
              s ? (
                <>
                  <p className="bubble-title">
                    {prefix} <Link href={`/e/${s.item.id}`}>{s.item.event.title}</Link>
                  </p>
                  <p className="bubble-why">{s.why}</p>
                </>
              ) : (
                <p className="bubble-title">
                  {res.ok ? t.emptyLens : t.apiDown}{' '}
                  {res.ok && lens !== 'weekend' && <Link href={`/?lens=weekend${moodQ}`}>{t.tryWeekend}</Link>}
                </p>
              )
            }
          />

          <nav className="moods" aria-label={t.moodLabel}>
            <span className="moods-label">{t.moodLabel}</span>
            {moodPills.map((p) => (
              <Link
                key={p.label}
                href={`/?lens=${lens}${p.key ? `&mood=${p.key}` : ''}`}
                className="mood-pill"
                aria-current={p.key === mood ? 'true' : undefined}
              >
                <span className="mood-dot" style={{ background: p.color }} aria-hidden="true" />
                {p.label}
              </Link>
            ))}
          </nav>
          <nav className="chips" aria-label={t.when}>
            {LENSES.map((l) => (
              <Link key={l} href={`/?lens=${l}${moodQ}`} className="chip" aria-current={l === lens ? 'true' : undefined}>
                {t[l]}
              </Link>
            ))}
          </nav>
        </div>

        <section className="section" aria-label={heading}>
          <div className="section-head">
            <h2>{heading}</h2>
            <Link href={`/discover?lens=${lens}`}>{t.seeAll}</Link>
          </div>
          {!res.ok && <div className="error-box">{t.apiDown}</div>}
          {res.ok && items.length === 0 && (
            <div className="empty">
              <p>{t.emptyLens}</p>
              {lens !== 'weekend' && (
                <Link className="btn" href="/?lens=weekend">
                  {t.tryWeekend}
                </Link>
              )}
            </div>
          )}
          {items.length > 0 && (
            <div className="cards-row">
              {items.map((i) => (
                <EventCard key={i.id} item={i} t={t} locale={locale} />
              ))}
            </div>
          )}
          {anySample && <p className="note" style={{ margin: 0 }}>{t.sample}</p>}
        </section>
      </div>
    </main>
  );
}
