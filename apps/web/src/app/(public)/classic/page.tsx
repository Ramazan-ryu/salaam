import Link from 'next/link';
import { DICTS, fmtKm, fmtToday, fmtWhen, greeting, type Dict, type Locale } from '@/lib/i18n';
import { getLocale } from '@/lib/locale-server';
import { onePerEvent, priceLabel, serverGet, type DiscoverResponse, type OccurrenceItem } from '@/lib/public-api';
import { LangSwitch, TopNav } from '../chrome';
import { MOODS, type Mood } from '@/lib/moods';
import { CompanionWorld, ITEM_ICONS, ITEM_TONES, type WorldItem } from '../companion-world';
import { EventCard, PinIcon } from '../components';
import { Logo, timeOfDay, type TimeOfDay } from '../scene';

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

export default async function Home({ searchParams }: { searchParams: Promise<{ lens?: string; mood?: string; tod?: string }> }) {
  const locale = await getLocale();
  const t = DICTS[locale];
  const sp = await searchParams;
  const lens: HomeLens = (LENSES as readonly string[]).includes(sp.lens ?? '') ? (sp.lens as HomeLens) : 'tonight';
  const mood = (MOODS as string[]).includes(sp.mood ?? '') ? (sp.mood as Mood) : undefined;
  const moodQ = mood ? `&mood=${mood}` : '';
  // ?tod= is a preview override (design review); real visitors always get Baku's current time of day.
  const tod: TimeOfDay = (['morning', 'day', 'evening', 'night'] as const).find((x) => x === sp.tod) ?? timeOfDay();
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
          <p className="brand">
            <Logo />
            <span className="wordmark">salaam</span>
          </p>
          <p className="pub-date">{fmtToday(locale)}</p>
          <h1 className="pub-hello">{sp.tod ? (tod === 'morning' ? t.morning : tod === 'day' ? t.afternoon : t.evening) : greeting(locale)}</h1>
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
            tod={tod}
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
                  {res.ok && lens !== 'weekend' && <Link href={`/classic?lens=weekend${moodQ}`}>{t.tryWeekend}</Link>}
                </p>
              )
            }
          />

          <nav className="moods" aria-label={t.moodLabel}>
            <span className="moods-label">{t.moodLabel}</span>
            {moodPills.map((p) => (
              <Link
                key={p.label}
                href={`/classic?lens=${lens}${p.key ? `&mood=${p.key}` : ''}`}
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
              <Link key={l} href={`/classic?lens=${l}${moodQ}`} className="chip" aria-current={l === lens ? 'true' : undefined}>
                {t[l]}
              </Link>
            ))}
          </nav>
        </div>

        <section className="section" aria-label={heading}>
          <nav className="tiles" aria-label={t.itemsLabel} style={{ padding: 0 }}>
            <Link className="tile tile-now" href="/discover?lens=now">
              <b>{t.tileNow}</b>
              <span>{t.tileNowSub}</span>
              <svg viewBox="0 0 110 90" aria-hidden="true">
                <circle cx="70" cy="58" r="22" fill="#FFF6D6" opacity="0.9" />
                <g stroke="#FFF6D6" strokeWidth="5" strokeLinecap="round" opacity="0.8">
                  <path d="M70 22v-10M100 58h10M42 58H32M91 37l7-7M49 37l-7-7" />
                </g>
              </svg>
            </Link>
            <Link className="tile tile-free" href="/discover?lens=weekend&category=community_free">
              <b>{t.tileFree}</b>
              <span>{t.tileFreeSub}</span>
              <svg viewBox="0 0 110 90" aria-hidden="true">
                <circle cx="52" cy="46" r="12" fill="#F1FFF6" opacity="0.9" />
                <circle cx="80" cy="50" r="10" fill="#F1FFF6" opacity="0.75" />
                <path d="M30 92c2-18 12-28 22-28s20 10 22 28zM64 92c2-14 9-22 16-22s14 8 16 22z" fill="#F1FFF6" opacity="0.8" />
              </svg>
            </Link>
            <Link className="tile tile-near" href={`/discover?lens=${lens}&near=1`}>
              <b>{t.tileNear}</b>
              <span>{t.tileNearSub}</span>
              <svg viewBox="0 0 110 90" aria-hidden="true">
                <circle cx="70" cy="66" r="30" fill="none" stroke="#EEF7FF" strokeWidth="3" opacity="0.6" />
                <circle cx="70" cy="66" r="16" fill="none" stroke="#EEF7FF" strokeWidth="3" opacity="0.8" />
                <path d="M70 66s-14-12-14-24a14 14 0 0 1 28 0c0 12-14 24-14 24z" fill="#EEF7FF" />
                <circle cx="70" cy="42" r="5" fill="#93C2EE" />
              </svg>
            </Link>
            <Link className="tile tile-weekend" href="/discover?lens=weekend">
              <b>{t.tileWeekend}</b>
              <span>{t.tileWeekendSub}</span>
              <svg viewBox="0 0 110 90" aria-hidden="true">
                <circle cx="82" cy="36" r="12" fill="#FFF0F7" opacity="0.9" />
                <path d="M0 92 L34 52 L56 74 L76 56 L110 92 Z" fill="#FFF0F7" opacity="0.8" />
              </svg>
            </Link>
          </nav>
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
