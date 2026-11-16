import Link from 'next/link';
import { fmtKm, fmtWhen, type Dict, type Locale } from '@/lib/i18n';
import { priceLabel, type OccurrenceItem } from '@/lib/public-api';

/** Placeholder companion (not final avatar art — see docs/AVATAR_ART_SPEC.md). Idle: breathe, blink, wave twice. */
export function Avatar({ label }: { label: string }) {
  return (
    <svg className="avatar" viewBox="0 0 150 210" role="img" aria-label={label}>
      <ellipse cx="72" cy="202" rx="44" ry="6" fill="#0D5F5B" opacity="0.12" />
      <g className="breath">
        <rect x="50" y="150" width="17" height="48" rx="8" fill="#2F3A56" />
        <rect x="77" y="150" width="17" height="48" rx="8" fill="#2F3A56" />
        <rect x="44" y="193" width="27" height="10" rx="5" fill="#1B1A1F" />
        <rect x="74" y="193" width="27" height="10" rx="5" fill="#1B1A1F" />
        <path d="M40 112 C40 96 54 88 72 88 C90 88 104 96 104 112 L106 160 L38 160 Z" fill="#E8603C" />
        <path d="M72 88 L72 160" stroke="#C94E2D" strokeWidth="2" />
        <path d="M42 106 C30 112 26 134 30 150" stroke="#E8603C" strokeWidth="13" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="152" r="7" fill="#C98E6B" />
        <g className="wave">
          <path d="M102 104 C116 96 122 78 120 60" stroke="#E8603C" strokeWidth="13" strokeLinecap="round" fill="none" />
          <circle cx="120" cy="56" r="8" fill="#C98E6B" />
        </g>
        <rect x="64" y="76" width="16" height="16" rx="6" fill="#C98E6B" />
        <circle cx="72" cy="56" r="30" fill="#C98E6B" />
        <path d="M42 54 C40 30 58 20 74 22 C92 22 104 34 102 52 C96 42 84 38 72 40 C60 40 50 46 42 54 Z" fill="#2B1E1A" />
        <circle cx="44" cy="44" r="9" fill="#2B1E1A" />
        <g className="eyes">
          <circle cx="61" cy="58" r="3.2" fill="#1B1A1F" />
          <circle cx="83" cy="58" r="3.2" fill="#1B1A1F" />
        </g>
        <path d="M63 69 C68 75 76 75 81 69" stroke="#1B1A1F" strokeWidth="2.6" strokeLinecap="round" fill="none" />
        <circle cx="54" cy="66" r="4" fill="#E8603C" opacity="0.25" />
        <circle cx="90" cy="66" r="4" fill="#E8603C" opacity="0.25" />
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

export function CategoryArt({ category }: { category?: string }) {
  const a = (category && ART[category]) || DEFAULT_ART;
  return (
    <div className="card-art" style={{ background: a.bg, color: a.fg }}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
      <CategoryArt category={item.event.categories[0]} />
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
