'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Component, useEffect, useMemo, useState, type ReactNode } from 'react';
import { DICTS, dayBadge, fmtWhen, type Locale } from '@/lib/i18n';
import { onePerEvent, priceLabel, type OccurrenceItem } from '@/lib/public-api';
import { LangSwitch } from '@/app/(public)/chrome';
import { Logo } from '@/app/(public)/scene';
import { DEFAULT_AVATAR, loadAvatar, type AvatarConfig } from './avatar';
import type { FeatureKey } from './scene';
import type { TimeOfDay } from './textures';

const WorldCanvas = dynamic(() => import('./WorldCanvas'), { ssr: false });

class WebGLBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

const ORDER: FeatureKey[] = ['music', 'exhibition_culture', 'workshop_talk', 'cinema', 'community_free', 'near'];
const TONE: Record<string, [string, string]> = {
  music: ['#3B1F4A', '#E8603C'],
  exhibition_culture: ['#0D3B3A', '#5FB0A8'],
  workshop_talk: ['#2B2550', '#8E7BD6'],
  cinema: ['#2A1420', '#C2445E'],
  community_free: ['#1F3A1F', '#7FB069'],
};

export interface WorldHomeProps {
  locale: Locale;
  tod: TimeOfDay;
  greeting: string;
  lens: 'now' | 'tonight' | 'weekend';
  items: OccurrenceItem[];
  apiOk: boolean;
}

export function WorldHome({ locale, tod, greeting, lens, items, apiOk }: WorldHomeProps) {
  const t = DICTS[locale];
  const [avatar, setAvatar] = useState<AvatarConfig>(DEFAULT_AVATAR);
  const [selected, setSelected] = useState<FeatureKey | null>(null);
  const [open, setOpen] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [now, setNow] = useState<string>('');
  // Object labels show for a few seconds on arrival (and on hover/focus/selection), then step back.
  const [hints, setHints] = useState(true);
  useEffect(() => {
    const id = setTimeout(() => setHints(false), 4500);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    setAvatar(loadAvatar());
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const tick = () =>
      setNow(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Baku', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  const unique = useMemo(() => onePerEvent(items), [items]);
  const shown = useMemo(
    () => (selected && selected !== 'near' ? unique.filter((i) => i.event.categories.includes(selected)) : unique),
    [unique, selected],
  );
  const objLabels: Record<FeatureKey, string> = {
    music: t.objMusic,
    exhibition_culture: t.objExhibition,
    workshop_talk: t.objWorkshop,
    cinema: t.objCinema,
    community_free: t.objCommunity,
    near: t.objWindow,
  };
  const short: Record<FeatureKey, string> = {
    music: t.itemMusic,
    exhibition_culture: t.itemExhibition,
    workshop_talk: t.itemWorkshop,
    cinema: t.itemCinema,
    community_free: t.itemCommunity,
    near: t.nearMe,
  };
  const heading = selected ? short[selected] : lens === 'now' ? t.inBakuNow : lens === 'tonight' ? t.inBakuTonight : t.inBakuWeekend;

  const choose = (f: FeatureKey) => {
    setSelected(f);
    if (reduced) setOpen(true);
  };

  return (
    <div className={`world-home tod-${tod}${hints ? ' show-hints' : ''}`}>
      <div className="wh-stage">
        <WebGLBoundary fallback={<div className="wh-fallback">{t.worldFallback}</div>}>
          <WorldCanvas
            tod={tod}
            avatar={avatar}
            labels={{ objects: objLabels, hello: t.worldHello }}
            selected={selected}
            onSelect={choose}
            onArrive={() => setOpen(true)}
            reducedMotion={reduced}
          />
        </WebGLBoundary>
      </div>

      <header className="wh-top">
        <Link href="/" className="wh-brand" aria-label="Salaam">
          <Logo size={28} />
          <span className="wordmark">salaam</span>
        </Link>
        <div className="wh-top-right">
          <span className="wh-chip">
            {t.city}
            {now && ` · ${now}`}
          </span>
          <LangSwitch locale={locale} />
        </div>
      </header>

      <div className="wh-hello">
        <h1>{greeting}</h1>
        <p>{t.worldHint}</p>
        <button type="button" className="wh-hints-btn" onClick={() => setHints((h) => !h)} aria-pressed={hints}>
          {t.showObjects}
        </button>
      </div>

      <aside className={`wh-panel${open ? ' is-open' : ''}`} aria-label={heading}>
        <button className="wh-handle" type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <span className="wh-grip" aria-hidden="true" />
          <span className="wh-panel-title">
            {heading}
            <small>
              {selected === 'near' ? '' : `${shown.length}`}
            </small>
          </span>
        </button>

        <nav className="wh-interests" aria-label={t.exploreBy}>
          {ORDER.map((f) => (
            <button key={f} type="button" className="wh-int" aria-pressed={selected === f} onClick={() => choose(f)}>
              {short[f]}
            </button>
          ))}
          {selected && (
            <button type="button" className="wh-int wh-clear" onClick={() => setSelected(null)}>
              {t.close}
            </button>
          )}
        </nav>

        <div className="wh-list">
          {!apiOk && <p className="wh-note">{t.apiDown}</p>}
          {selected === 'near' ? (
            <div className="wh-near">
              <p>{t.nearText}</p>
              <Link className="wh-cta" href={`/discover?lens=${lens}&near=1`}>
                {t.nearCta} →
              </Link>
            </div>
          ) : shown.length === 0 && apiOk ? (
            <p className="wh-note">{t.noneHere}</p>
          ) : (
            shown.map((i) => {
              const b = dayBadge(i.startsAt, locale);
              const [c1, c2] = TONE[i.event.categories[0] ?? ''] ?? ['#1B1A1F', '#5F5B66'];
              const price = priceLabel(i, t);
              return (
                <Link key={i.id} href={`/e/${i.id}`} className="wh-row">
                  <span className="wh-thumb" style={{ background: `linear-gradient(140deg, ${c1}, ${c2})` }}>
                    <b>{b.day}</b>
                    <small>{b.mon}</small>
                  </span>
                  <span className="wh-row-body">
                    <span className="wh-row-title">{i.event.title}</span>
                    <span className="wh-row-meta">
                      {i.timeUnknown ? t.timeTbc : fmtWhen(i.startsAt, locale, { withDay: false })} · {i.place.name}
                    </span>
                    <span className="wh-row-tags">
                      <span className="wh-ok">✓ {i.trust.badge === 'from_organizer' ? t.fromOrganizer : t.verified}</span>
                      {price && <span>{price}</span>}
                      {i.attribution.synthetic && <span className="wh-sample">{t.sampleBadge}</span>}
                    </span>
                  </span>
                </Link>
              );
            })
          )}
          {unique.some((i) => i.attribution.synthetic) && <p className="wh-note">{t.sample}</p>}
        </div>
      </aside>

      <nav className="wh-nav" aria-label="Menu">
        <Link href="/" aria-current="page">
          {t.navWorld}
        </Link>
        <Link href={`/discover?lens=${lens}`}>{t.discover}</Link>
        <Link href="/studio">{t.navStudio}</Link>
      </nav>
    </div>
  );
}
