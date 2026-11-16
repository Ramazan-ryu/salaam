import type { Metadata } from 'next';
import Link from 'next/link';
import { DICTS, fmtWhen, type Dict } from '@/lib/i18n';
import { getLocale } from '@/lib/locale-server';
import { priceLabel, serverGet, type OccurrenceItem } from '@/lib/public-api';
import { LangSwitch } from '../../chrome';
import { CategoryArt, TrustBadge } from '../../components';
import { CalendarButton } from './calendar-button';

export const dynamic = 'force-dynamic';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function load(id: string) {
  const locale = await getLocale();
  if (!UUID.test(id)) return { locale, res: { ok: false as const, status: 404 } };
  return { locale, res: await serverGet<OccurrenceItem>(`/v1/occurrences/${id}`, locale) };
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { res } = await load((await params).id);
  if (!res.ok) return { title: 'Salaam', robots: { index: false } };
  return {
    title: res.data.event.title ?? 'Salaam',
    description: res.data.event.description?.slice(0, 160) ?? undefined,
    // Sample data must never be indexed.
    robots: res.data.attribution.synthetic ? { index: false, follow: false } : undefined,
  };
}

function trustText(item: OccurrenceItem, t: Dict) {
  if (item.trust.badge === 'from_organizer') return t.trustOrganizer;
  if (item.trust.tier.startsWith('T4')) return t.trustCommunity;
  return t.trustVerified;
}

const Ico = ({ d }: { d: React.ReactNode }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d}
  </svg>
);

export default async function EventDetails({ params }: { params: Promise<{ id: string }> }) {
  const { locale, res } = await load((await params).id);
  const t = DICTS[locale];

  const top = (
    <header className="pub-header">
      <Link href="/discover" style={{ fontWeight: 600, textDecoration: 'none', alignSelf: 'center' }}>
        {t.back}
      </Link>
      <LangSwitch locale={locale} />
    </header>
  );

  if (!res.ok) {
    return (
      <main>
        {top}
        <div className="section">
          <div className={res.status === 404 ? 'empty' : 'error-box'}>{res.status === 404 ? t.notFound : t.apiDown}</div>
        </div>
      </main>
    );
  }

  const item = res.data;
  const price = priceLabel(item, t);
  const { lat, lng } = item.place.location;
  const mapUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`;
  const unconfirmed = item.trust.unconfirmedFields;
  const when = item.timeUnknown
    ? fmtWhen(item.startsAt, locale, { timeUnknown: true })
    : `${fmtWhen(item.startsAt, locale)}${item.endsAt ? `–${fmtWhen(item.endsAt, locale, { withDay: false })}` : ''}`;

  return (
    <main>
      {top}
      {item.lifecycle === 'cancelled' && <p className="banner banner-bad" role="status">{t.cancelled}</p>}
      {item.lifecycle === 'postponed' && <p className="banner banner-bad" role="status">{t.postponed}</p>}

      <section className="detail-hero" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}>
        <CategoryArt category={item.event.categories[0]} />
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <TrustBadge item={item} t={t} />
          {item.attribution.synthetic && <span className="tag tag-sample">{t.sampleBadge}</span>}
        </div>
        <h1>{item.event.title}</h1>
      </section>

      <dl className="facts" style={{ margin: '14px 16px 0' }}>
        <div className="fact">
          <Ico d={<><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>} />
          <div>
            <dt className="fact-label">{t.when}</dt>
            <dd className="fact-value" style={{ margin: 0 }}>{when}</dd>
            {item.timeUnknown && <dd className="fact-sub" style={{ margin: 0 }}><span className="tag">{t.timeTbc}</span></dd>}
          </div>
        </div>
        <div className="fact">
          <Ico d={<><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>} />
          <div>
            <dt className="fact-label">{t.where}</dt>
            <dd className="fact-value" style={{ margin: 0 }}>{item.place.name}</dd>
          </div>
        </div>
        <div className="fact">
          <Ico d={<><path d="M20 12V8H6a2 2 0 0 1 0-4h12v4" /><path d="M4 6v12a2 2 0 0 0 2 2h14v-4" /><circle cx="17" cy="14" r="1" /></>} />
          <div>
            <dt className="fact-label">{t.price}</dt>
            <dd className="fact-value" style={{ margin: 0 }}>{price ?? <span style={{ color: 'var(--muted)', fontWeight: 500 }}>{t.priceNotStated}</span>}</dd>
          </div>
        </div>
      </dl>

      <div className="actions">
        {item.event.ticketUrl && item.lifecycle !== 'cancelled' && (
          <a className="btn btn-primary btn-lg" href={item.event.ticketUrl} target="_blank" rel="noopener noreferrer nofollow">
            {t.tickets} ↗
          </a>
        )}
        <a className="btn btn-lg" href={mapUrl} target="_blank" rel="noopener noreferrer">
          {t.directions} ↗
        </a>
        {item.lifecycle !== 'cancelled' && (
          <CalendarButton
            label={t.addCalendar}
            title={item.event.title ?? 'Salaam'}
            place={item.place.name ?? ''}
            startsAt={item.startsAt}
            endsAt={item.endsAt}
            allDay={item.timeUnknown}
            uid={item.id}
          />
        )}
      </div>

      {item.event.description && <p className="desc">{item.event.description}</p>}

      <aside className="trust" style={{ marginTop: 16 }}>
        <strong>{trustText(item, t)}</strong>
        {item.trust.lastVerifiedAt && (
          <span>
            {t.lastVerified}: {fmtWhen(item.trust.lastVerifiedAt, locale)}
          </span>
        )}
        {unconfirmed.length > 0 && (
          <span>
            {t.unconfirmed}: {unconfirmed.map((f) => (f === 'start_time' ? t.timeTbc : f)).join(', ')}
          </span>
        )}
        <span>
          {t.source}:{' '}
          {item.attribution.url ? (
            <a href={item.attribution.url} target="_blank" rel="noopener noreferrer nofollow">
              {item.attribution.sourceName ?? item.attribution.url}
            </a>
          ) : (
            item.attribution.sourceName ?? '—'
          )}
        </span>
      </aside>
    </main>
  );
}
