import Link from 'next/link';
import { DICTS, fmtKm, fmtToday, fmtWhen, greeting, type Dict, type Locale } from '@/lib/i18n';
import { getLocale } from '@/lib/locale-server';
import { priceLabel, serverGet, type DiscoverResponse, type OccurrenceItem } from '@/lib/public-api';
import { LangSwitch, TopNav } from './chrome';
import { Avatar, EventCard, PinIcon, Skyline } from './components';

export const dynamic = 'force-dynamic';

const LENSES = ['now', 'tonight', 'weekend'] as const;
type HomeLens = (typeof LENSES)[number];

/** Rule-based companion line (no AI): the soonest verified item in the chosen lens, with its reasons. */
function suggestion(items: OccurrenceItem[], t: Dict, locale: Locale) {
  const pick = items.find((i) => i.lifecycle === 'scheduled');
  if (!pick) return null;
  const reasons = [
    pick.timeUnknown ? fmtWhen(pick.startsAt, locale, { timeUnknown: true }) : fmtWhen(pick.startsAt, locale),
    pick.place.distanceKm !== undefined ? fmtKm(pick.place.distanceKm, locale) : pick.place.name,
    priceLabel(pick, t),
  ].filter(Boolean);
  return { item: pick, why: reasons.join(' · ') };
}

export default async function Home({ searchParams }: { searchParams: Promise<{ lens?: string }> }) {
  const locale = await getLocale();
  const t = DICTS[locale];
  const sp = await searchParams;
  const lens: HomeLens = (LENSES as readonly string[]).includes(sp.lens ?? '') ? (sp.lens as HomeLens) : 'tonight';
  const res = await serverGet<DiscoverResponse>(`/v1/discover?lens=${lens}&limit=8`, locale);
  const items = res.ok ? res.data.items : [];
  const s = suggestion(items, t, locale);
  const heading = lens === 'now' ? t.inBakuNow : lens === 'tonight' ? t.inBakuTonight : t.inBakuWeekend;
  const anySample = items.some((i) => i.attribution.synthetic);

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
          <section className="stage" aria-label={t.avatarLabel}>
            <Skyline />
            {s ? (
              <div className="bubble">
                <p className="bubble-title">
                  {t.suggestPrefix} {s.item.event.title}
                </p>
                <p className="bubble-why">{s.why}</p>
                <div className="bubble-actions">
                  <Link className="btn btn-primary" href={`/e/${s.item.id}`}>
                    {t.show}
                  </Link>
                  <Link className="btn" href={`/discover?lens=${lens}`}>
                    {t.suggestOther}
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bubble">
                <p className="bubble-title">{res.ok ? t.emptyLens : t.apiDown}</p>
                {res.ok && lens !== 'weekend' && (
                  <div className="bubble-actions">
                    <Link className="btn btn-primary" href="/?lens=weekend">
                      {t.tryWeekend}
                    </Link>
                  </div>
                )}
              </div>
            )}
            <Avatar label={t.avatarLabel} />
          </section>

          <nav className="chips" aria-label={t.when}>
            {LENSES.map((l) => (
              <Link key={l} href={`/?lens=${l}`} className="chip" aria-current={l === lens ? 'true' : undefined}>
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
