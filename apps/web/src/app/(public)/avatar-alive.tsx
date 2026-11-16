'use client';

import { useEffect, useState } from 'react';
import { MOODS, type Mood } from '@/lib/moods';

/**
 * Living placeholder companion (not final art — docs/AVATAR_ART_SPEC.md).
 * Body parts are separate groups so each can move: head, eyes, brows, mouth, arms, torso, legs.
 * `mood` fixes the mood; without it the companion drifts through calm → energetic → curious ("mixed").
 * With prefers-reduced-motion the expression still changes, but nothing moves.
 */
export function AvatarAlive({ label, mood }: { label: string; mood?: Mood }) {
  const [auto, setAuto] = useState<Mood>('calm');
  useEffect(() => {
    if (mood) return;
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % MOODS.length;
      setAuto(MOODS[i]!);
    }, 5200);
    return () => clearInterval(id);
  }, [mood]);
  const m = mood ?? auto;
  const skin = '#C98E6B';
  const jacket = '#E8603C';
  const jacketDark = '#C94E2D';

  return (
    <svg className={`avatar alive mood-${m}`} viewBox="0 0 160 320" role="img" aria-label={label}>
      <ellipse className="shadow" cx="80" cy="310" rx="50" ry="7" fill="#0D5F5B" opacity="0.14" />

      {/* mood particles */}
      <g className="fx fx-energetic" fill="#E8603C">
        <path d="M18 70v-14l10-2v12" stroke="#E8603C" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <circle cx="16" cy="71" r="3" />
        <circle cx="26" cy="67" r="3" />
        <path d="M142 120v-12l8-2v10" stroke="#B4472A" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <circle cx="140" cy="121" r="2.6" fill="#B4472A" />
        <circle cx="148" cy="117" r="2.6" fill="#B4472A" />
      </g>
      <g className="fx fx-calm" fill="#0D5F5B" opacity="0.5">
        <circle cx="24" cy="96" r="3" />
        <circle cx="140" cy="80" r="2.4" />
        <circle cx="132" cy="140" r="2" />
      </g>
      <g className="fx fx-curious">
        <text x="116" y="26" fontSize="24" fontWeight="800" fill="#4D3F7A" fontFamily="system-ui, sans-serif">?</text>
      </g>

      <g className="body">
        {/* legs + shoes */}
        <g className="legs">
          <rect x="56" y="186" width="21" height="112" rx="10" fill="#2F3A56" />
          <rect x="83" y="186" width="21" height="112" rx="10" fill="#2F3A56" />
          <rect x="62" y="230" width="9" height="3" rx="1.5" fill="#25304A" />
          <rect x="89" y="230" width="9" height="3" rx="1.5" fill="#25304A" />
          <rect x="44" y="290" width="36" height="15" rx="7.5" fill="#1B1A1F" />
          <rect x="80" y="290" width="36" height="15" rx="7.5" fill="#1B1A1F" />
          <rect x="46" y="293" width="12" height="4" rx="2" fill="#FFFFFF" opacity="0.55" />
          <rect x="102" y="293" width="12" height="4" rx="2" fill="#FFFFFF" opacity="0.55" />
        </g>

        {/* torso: jacket with collar, zip, pockets, hem */}
        <g className="torso">
          <path d="M44 112 C44 97 59 90 80 90 C101 90 116 97 116 112 L119 196 L41 196 Z" fill={jacket} />
          <path d="M70 91 L80 107 L90 91 Z" fill="#F6E3D6" />
          <path d="M62 92 L72 112 M98 92 L88 112" stroke={jacketDark} strokeWidth="2" strokeLinecap="round" />
          <path d="M80 107 L80 186" stroke={jacketDark} strokeWidth="2" />
          <rect x="51" y="148" width="18" height="14" rx="3" fill={jacketDark} opacity="0.55" />
          <rect x="91" y="148" width="18" height="14" rx="3" fill={jacketDark} opacity="0.55" />
          <rect x="41" y="184" width="78" height="12" rx="4" fill={jacketDark} />
        </g>

        {/* arms: hang from the shoulders, rotated per mood */}
        <g className="arm arm-l">
          <path d="M47 108 C38 128 34 154 33 182" stroke={jacket} strokeWidth="15" strokeLinecap="round" fill="none" />
          <rect x="25" y="176" width="16" height="7" rx="3" fill={jacketDark} />
          <circle cx="33" cy="190" r="8.5" fill={skin} />
        </g>
        <g className="arm arm-r">
          <path d="M113 108 C122 128 126 154 127 182" stroke={jacket} strokeWidth="15" strokeLinecap="round" fill="none" />
          <rect x="119" y="176" width="16" height="7" rx="3" fill={jacketDark} />
          <circle cx="127" cy="190" r="8.5" fill={skin} />
        </g>

        {/* head */}
        <g className="head">
          <rect x="72" y="76" width="16" height="18" rx="6" fill={skin} />
          <circle cx="80" cy="54" r="27" fill={skin} />
          <ellipse cx="53.5" cy="57" rx="4" ry="6" fill={skin} />
          <ellipse cx="106.5" cy="57" rx="4" ry="6" fill={skin} />
          <path d="M53 52 C51 29 67 21 82 23 C99 23 109 34 107 50 C101 41 91 37 80 39 C68 39 59 44 53 52 Z" fill="#2B1E1A" />
          <path d="M66 30 C72 26 80 26 86 28" stroke="#4A352E" strokeWidth="2" strokeLinecap="round" fill="none" />
          <circle cx="55" cy="40" r="8.5" fill="#2B1E1A" />

          <g className="brows" stroke="#2B1E1A" strokeWidth="2.6" strokeLinecap="round" fill="none">
            <path className="brow-l" d="M65 47 L76 46" />
            <path className="brow-r" d="M84 46 L95 47" />
          </g>
          <g className="eyes">
            <g className="pupils">
              <circle cx="71" cy="57" r="3.3" fill="#1B1A1F" />
              <circle cx="89" cy="57" r="3.3" fill="#1B1A1F" />
              <circle cx="72.2" cy="55.8" r="1" fill="#FFFFFF" />
              <circle cx="90.2" cy="55.8" r="1" fill="#FFFFFF" />
            </g>
            <g className="lids" fill={skin}>
              <rect x="66" y="51" width="10" height="5" />
              <rect x="84" y="51" width="10" height="5" />
            </g>
          </g>
          {/* all expressions are drawn; CSS shows the one for the current mood */}
          <g className="mouth mouth-energetic">
            <path d="M71 66 C74 76 86 76 89 66 Z" fill="#1B1A1F" />
            <path d="M74 70 C77 74 83 74 86 70" fill="#E8603C" />
          </g>
          <path className="mouth mouth-calm" d="M73 68 C77 71 83 71 87 68" stroke="#1B1A1F" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          <ellipse className="mouth mouth-curious" cx="82" cy="69" rx="3.4" ry="4" fill="#1B1A1F" />
          <circle className="cheek" cx="63" cy="65" r="4" fill="#E8603C" />
          <circle className="cheek" cx="97" cy="65" r="4" fill="#E8603C" />

          {/* headphones only when energetic */}
          <g className="phones">
            <path d="M52 56 C50 24 110 24 108 56" stroke="#1B1A1F" strokeWidth="5" fill="none" strokeLinecap="round" />
            <rect x="46" y="50" width="11" height="17" rx="5" fill="#0D5F5B" />
            <rect x="103" y="50" width="11" height="17" rx="5" fill="#0D5F5B" />
          </g>
        </g>
      </g>
    </svg>
  );
}
