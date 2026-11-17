import Link from 'next/link';
import { dayBadge, fmtKm, fmtWhen, type Dict, type Locale } from '@/lib/i18n';
import { priceLabel, type OccurrenceItem } from '@/lib/public-api';
import { CoverArt } from './covers';

/** Editorial event card (Experiences mode): image first, then what / when / where, trust and price. */
export function ExploreCard({ item, t, locale, featured = false, seed = 0 }: { item: OccurrenceItem; t: Dict; locale: Locale; featured?: boolean; seed?: number }) {
  const price = priceLabel(item, t);
  const b = dayBadge(item.startsAt, locale);
  const when = item.timeUnknown ? t.timeTbc : fmtWhen(item.startsAt, locale, { withDay: false });
  return (
    <Link href={`/e/${item.id}`} className={`ex-card${featured ? ' ex-featured' : ''}`}>
      <span className="ex-media">
        <CoverArt category={item.event.categories[0]} seed={seed} title={item.event.title ?? ''} />
        <span className="ex-date">
          <b>{b.day}</b>
          <small>{b.mon}</small>
        </span>
        {item.attribution.synthetic && <span className="ex-sample">{t.sampleBadge}</span>}
        {featured && (
          <span className="ex-over">
            <span className="ex-kicker">{t.featured}</span>
            <span className="ex-title">{item.event.title}</span>
            <span className="ex-meta">
              {when} · {item.place.name}
            </span>
          </span>
        )}
      </span>
      {!featured && (
        <span className="ex-body">
          <span className="ex-title">{item.event.title}</span>
          <span className="ex-meta">
            {when} · {item.place.name}
            {item.place.distanceKm !== undefined ? ` · ${fmtKm(item.place.distanceKm, locale)}` : ''}
          </span>
          <span className="ex-tags">
            <span className="ex-ok">✓ {item.trust.badge === 'from_organizer' ? t.fromOrganizer : t.verified}</span>
            {price && <span>{price}</span>}
            {item.lifecycle === 'cancelled' && <span className="ex-bad">{t.cancelled}</span>}
          </span>
        </span>
      )}
    </Link>
  );
}
