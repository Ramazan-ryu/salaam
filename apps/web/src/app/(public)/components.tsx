import Link from 'next/link';
import { dayBadge, fmtKm, fmtWhen, type Dict, type Locale } from '@/lib/i18n';
import { priceLabel, type OccurrenceItem } from '@/lib/public-api';

/**
 * Placeholder companion — full-body proportions (founder feedback 2026-11-17). Not final avatar art
 * (docs/AVATAR_ART_SPEC.md). Idle: breathe, blink, wave twice; all motion off with prefers-reduced-motion.
 */
export function Avatar({ label }: { label: string }) {
  const skin = '#C98E6B';
  return (
    <svg className="avatar" viewBox="0 0 160 320" role="img" aria-label={label}>
      <ellipse cx="80" cy="310" rx="50" ry="7" fill="#0D5F5B" opacity="0.14" />
      <g className="breath">
        <rect x="56" y="186" width="21" height="112" rx="10" fill="#2F3A56" />
        <rect x="83" y="186" width="21" height="112" rx="10" fill="#2F3A56" />
        <rect x="44" y="290" width="36" height="15" rx="7.5" fill="#1B1A1F" />
        <rect x="80" y="290" width="36" height="15" rx="7.5" fill="#1B1A1F" />
        <rect x="46" y="293" width="12" height="4" rx="2" fill="#FFFFFF" opacity="0.5" />
        <rect x="102" y="293" width="12" height="4" rx="2" fill="#FFFFFF" opacity="0.5" />
        <path d="M44 112 C44 97 59 90 80 90 C101 90 116 97 116 112 L119 196 L41 196 Z" fill="#E8603C" />
        <path d="M70 91 L80 106 L90 91 Z" fill="#F6E3D6" />
        <path d="M80 106 L80 196" stroke="#C94E2D" strokeWidth="2" />
        <rect x="41" y="186" width="78" height="10" rx="3" fill="#C94E2D" />
        <rect x="52" y="140" width="16" height="12" rx="3" fill="#C94E2D" opacity="0.6" />
        <path d="M47 108 C33 122 29 152 31 182" stroke="#E8603C" strokeWidth="15" strokeLinecap="round" fill="none" />
        <circle cx="31" cy="188" r="8.5" fill={skin} />
        <g className="wave">
          <path d="M113 106 C129 96 136 74 132 52" stroke="#E8603C" strokeWidth="15" strokeLinecap="round" fill="none" />
          <circle cx="132" cy="45" r="9.5" fill={skin} />
        </g>
        <rect x="72" y="76" width="16" height="18" rx="6" fill={skin} />
        <circle cx="80" cy="54" r="27" fill={skin} />
        <path d="M53 52 C51 29 67 21 82 23 C99 23 109 34 107 50 C101 41 91 37 80 39 C68 39 59 44 53 52 Z" fill="#2B1E1A" />
        <circle cx="55" cy="40" r="8.5" fill="#2B1E1A" />
        <g className="eyes">
          <circle cx="71" cy="57" r="3.2" fill="#1B1A1F" />
          <circle cx="89" cy="57" r="3.2" fill="#1B1A1F" />
        </g>
        <path d="M72 67 C77 73 83 73 88 67" stroke="#1B1A1F" strokeWidth="2.6" strokeLinecap="round" fill="none" />
        <circle cx="63" cy="65" r="4" fill="#E8603C" opacity="0.25" />
        <circle cx="97" cy="65" r="4" fill="#E8603C" opacity="0.25" />
      </g>
    </svg>
  );
}

export function Skyline() {
  return (
    <svg className="stage-skyline" viewBox="0 0 358 120" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <rect x="0" y="96" width="358" height="24" fill="#BFE0DB" />
      <rect x="18" y="40" width="34" height="56" rx="6" fill="#C9E6E2" />
      <rect x="58" y="20" width="26" height="76" rx="6" fill="#C9E6E2" />
      <path d="M248 96 C248 50 262 18 274 8 C286 18 300 50 300 96 Z" fill="#C9E6E2" />
      <path d="M296 96 C296 60 306 34 316 26 C326 34 336 60 336 96 Z" fill="#C9E6E2" />
      <rect x="208" y="54" width="34" height="42" rx="6" fill="#C9E6E2" />
    </svg>
  );
}

const ART: Record<string, { bg: string; fg: string; icon: React.ReactNode }> = {
  music: { bg: '#F6E3D6', fg: '#B4472A', icon: <><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></> },
  exhibition_culture: { bg: '#DCEFEC', fg: '#0D5F5B', icon: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="m21 16-5-5-9 9" /></> },
  workshop_talk: { bg: '#E7E4F3', fg: '#4D3F7A', icon: <><path d="M4 19h16" /><path d="M6 15l4-9 4 6 2-3 3 6" /></> },
  community_free: { bg: '#E6F0D9', fg: '#3F6A1E', icon: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M3 20c.8-3.5 3.2-5.5 6-5.5s5.2 2 6 5.5" /><path d="M15 15c2.5 0 4.5 1.6 5.2 4.5" /></> },
  cinema: { bg: '#F3E2E6', fg: '#8A2D45', icon: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M7 5v14M17 5v14M3 9h4M3 15h4M17 9h4M17 15h4" /></> },
};
const DEFAULT_ART = { bg: '#EDE8DF', fg: '#5F5B66', icon: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></> };

export function CategoryArt({ category, badge }: { category?: string; badge?: { day: number; mon: string } }) {
  const a = (category && ART[category]) || DEFAULT_ART;
  return (
    <div className="card-art" style={{ background: `linear-gradient(135deg, ${a.bg} 0%, ${a.fg}33 100%)`, color: a.fg }}>
      {badge && (
        <span className="date-badge">
          <b>{badge.day}</b>
          <small>{badge.mon}</small>
        </span>
      )}
      <svg width="40" height="40" viewBox="0 0 24 24" style={{ position: 'relative', zIndex: 1 }} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {a.icon}
      </svg>
    </div>
  );
}

export function TrustBadge({ item, t }: { item: OccurrenceItem; t: Dict }) {
  const organizer = item.trust.badge === 'from_organizer';
  return (
    <span className="badge badge-ok">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 6 9 17l-5-5" />
      </svg>
      {organizer ? t.fromOrganizer : t.verified}
    </span>
  );
}

export function EventCard({ item, t, locale }: { item: OccurrenceItem; t: Dict; locale: Locale }) {
  const price = priceLabel(item, t);
  const when = item.timeUnknown ? `${fmtWhen(item.startsAt, locale, { timeUnknown: true })} · ${t.timeTbc}` : fmtWhen(item.startsAt, locale);
  return (
    <Link href={`/e/${item.id}`} className="card">
      <CategoryArt category={item.event.categories[0]} badge={dayBadge(item.startsAt, locale)} />
      <h3>{item.event.title}</h3>
      <p className="card-meta">
        {when} · {item.place.name}
        {item.place.distanceKm !== undefined ? ` · ${fmtKm(item.place.distanceKm, locale)}` : ''}
      </p>
      <div className="card-foot">
        <TrustBadge item={item} t={t} />
        <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {item.attribution.synthetic && <span className="tag tag-sample">{t.sampleBadge}</span>}
          {item.lifecycle === 'cancelled' && <span className="tag tag-bad">{t.cancelled}</span>}
          {price && <span style={{ color: 'var(--muted)' }}>{price}</span>}
        </span>
      </div>
    </Link>
  );
}

export function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}
