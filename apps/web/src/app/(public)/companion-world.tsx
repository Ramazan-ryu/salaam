import Link from 'next/link';
import type { Dict } from '@/lib/i18n';
import type { Mood } from '@/lib/moods';
import { AvatarAlive } from './avatar-alive';
import { Skyline } from './components';

/**
 * Avatar-centred home stage (founder direction 2026-11-17): the companion stands in the middle and the
 * objects around it open the matching kind of event. Every object is a real link with a text label
 * (accessible without touching the avatar) and shows how many verified events it leads to right now.
 */
export interface WorldItem {
  key: string;
  label: string;
  href: string;
  count?: number;
  tone: { bg: string; fg: string };
  icon: React.ReactNode;
}

const I = (d: React.ReactNode) => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d}
  </svg>
);

export const ITEM_ICONS = {
  music: I(<><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></>),
  exhibition_culture: I(<><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="m21 16-5-5-9 9" /></>),
  workshop_talk: I(<><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z" /></>),
  cinema: I(<><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" /><path d="M13 5v2M13 17v2M13 11v2" /></>),
  community_free: I(<><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M3 20c.8-3.5 3.2-5.5 6-5.5s5.2 2 6 5.5" /><path d="M15 15c2.5 0 4.5 1.6 5.2 4.5" /></>),
  near: I(<><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>),
};

export const ITEM_TONES: Record<string, { bg: string; fg: string }> = {
  music: { bg: '#F6E3D6', fg: '#B4472A' },
  exhibition_culture: { bg: '#FFFFFF', fg: '#0D5F5B' },
  workshop_talk: { bg: '#E7E4F3', fg: '#4D3F7A' },
  cinema: { bg: '#F3E2E6', fg: '#8A2D45' },
  community_free: { bg: '#E6F0D9', fg: '#3F6A1E' },
  near: { bg: '#1B1A1F', fg: '#FFFFFF' },
};

export function CompanionWorld({
  t,
  items,
  bubble,
  mood,
}: {
  t: Dict;
  items: WorldItem[];
  bubble: React.ReactNode;
  mood?: Mood;
}) {
  return (
    <section className="world" aria-label={t.avatarLabel}>
      <Skyline />
      <div className="world-bubble">{bubble}</div>
      <div className="world-avatar">
        <AvatarAlive label={t.avatarLabel} mood={mood} />
      </div>
      <nav className="world-items" aria-label={t.itemsLabel}>
        {items.map((it, i) => (
          <Link
            key={it.key}
            href={it.href}
            className={`world-item world-item-${i}`}
            aria-label={`${it.label}${it.count ? `, ${it.count} ${t.eventsCount}` : ''}`}
          >
            <span className="world-orb" style={{ background: it.tone.bg, color: it.tone.fg }}>
              {it.icon}
              {it.count ? <span className="world-count">{it.count}</span> : null}
            </span>
            <span className="world-label">{it.label}</span>
          </Link>
        ))}
      </nav>
    </section>
  );
}
