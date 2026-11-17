'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DICTS, type Locale } from '@/lib/i18n';
import { LangSwitch } from '@/app/(public)/chrome';
import { Logo } from '@/app/(public)/scene';
import { BODIES, DEFAULT_AVATAR, HAIR, PANTS, SHIRT, SKIN, loadAvatar, saveAvatar, type AvatarConfig, type Body } from './avatar';

const StudioCanvas = dynamic(() => import('./StudioCanvas'), { ssr: false });

type Part = 'skin' | 'hair' | 'shirt' | 'pants';
const PALETTES: Record<Part, string[]> = { skin: SKIN, hair: HAIR, shirt: SHIRT, pants: PANTS };

/** SALAAM Studio: a creative space, not a settings form. Preview first, controls at the side. */
export function StudioHome({ locale }: { locale: Locale }) {
  const t = DICTS[locale];
  const [cfg, setCfg] = useState<AvatarConfig>(DEFAULT_AVATAR);
  const [saved, setSaved] = useState<AvatarConfig>(DEFAULT_AVATAR);
  const [cheer, setCheer] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => {
    const c = loadAvatar();
    setCfg(c);
    setSaved(c);
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const dirty = JSON.stringify(cfg) !== JSON.stringify(saved);
  const setColor = (part: Part, color: string) => setCfg({ ...cfg, colors: { ...cfg.colors, [part]: color } });
  const save = () => {
    saveAvatar(cfg);
    setSaved(cfg);
    setCheer((n) => n + 1);
    setNote(t.studioSaved);
    setTimeout(() => setNote(''), 2500);
  };
  const parts: Array<[Part, string]> = [
    ['skin', t.studioSkin],
    ['hair', t.studioHair],
    ['shirt', t.studioTop],
    ['pants', t.studioPants],
  ];
  const bodyLabel = (b: Body, i: number) => `${b.startsWith('casual2') ? t.styleStreet : t.styleCasual} · ${(i % 2) + 1}`;

  return (
    <div className="studio">
      <header className="wh-top">
        <Link href="/" className="wh-brand" aria-label="Salaam">
          <Logo size={28} />
          <span className="wordmark">salaam</span>
        </Link>
        <div className="wh-top-right">
          <LangSwitch locale={locale} />
        </div>
      </header>

      <section className="st-stage" aria-label={t.studioPreview}>
        <StudioCanvas cfg={cfg} cheer={cheer} reducedMotion={reduced} />
        <div className="st-title">
          <h1>{t.navStudio}</h1>
          <p>{t.studioIntro}</p>
        </div>
      </section>

      <aside className="st-panel" aria-label={t.studioCustomize}>
        <div className="st-group">
          <h2>{t.studioBody}</h2>
          <div className="st-bodies" role="radiogroup" aria-label={t.studioBody}>
            {BODIES.map((b, i) => (
              <button key={b} type="button" role="radio" aria-checked={cfg.body === b} className="st-body" onClick={() => setCfg({ ...cfg, body: b })}>
                {bodyLabel(b, i)}
              </button>
            ))}
          </div>
        </div>
        {parts.map(([part, label]) => (
          <div className="st-group" key={part}>
            <h2>{label}</h2>
            <div className="st-swatches" role="radiogroup" aria-label={label}>
              {PALETTES[part].map((c) => (
                <button
                  key={c}
                  type="button"
                  role="radio"
                  aria-checked={cfg.colors[part] === c}
                  aria-label={`${label} ${c}`}
                  className="st-swatch"
                  style={{ background: c }}
                  onClick={() => setColor(part, c)}
                />
              ))}
            </div>
          </div>
        ))}
        <div className="st-actions">
          <button type="button" className="st-save" onClick={save} disabled={!dirty}>
            {t.studioSave}
          </button>
          <button type="button" className="st-ghost" onClick={() => setCfg(saved)} disabled={!dirty}>
            {t.studioUndo}
          </button>
          <button type="button" className="st-ghost" onClick={() => setCfg(DEFAULT_AVATAR)}>
            {t.studioReset}
          </button>
        </div>
        <p className="st-note" role="status">
          {note || t.studioLocalNote}
        </p>
      </aside>

      <nav className="wh-nav" aria-label="Menu">
        <Link href="/">{t.navWorld}</Link>
        <Link href="/discover">{t.discover}</Link>
        <Link href="/studio" aria-current="page">
          {t.navStudio}
        </Link>
      </nav>
    </div>
  );
}
