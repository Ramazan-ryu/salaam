'use client';

import { useEffect, useState } from 'react';
import { MOODS, type Mood } from '@/lib/moods';

/**
 * Salaam companion v2 — semi-stylised adult, full body (docs/design/CREATIVE_DIRECTIVE.md §10).
 * Still a hand-drawn SVG placeholder for the final illustrated rig (TB-18), but built like the rig:
 * separate head / eyes / brows / mouths / arms / torso / legs groups, so moods only change CSS classes.
 * `mood` fixes the mood; without it the companion drifts calm → energetic → curious ("mixed").
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

  const ink = '#1B1A1F';
  const line = { stroke: ink, strokeOpacity: 0.22, strokeWidth: 1.2 };
  const skin = 'url(#av-skin)';
  const skinShade = '#B07756';
  const hoodie = 'url(#av-hoodie)';
  const hoodieFlat = '#E8603C';
  const hoodieShade = '#C94E2D';
  const denim = 'url(#av-denim)';
  const denimShade = '#24304D';
  const hair = 'url(#av-hair)';
  const hairFlat = '#2B1E1A';
  const rim = { stroke: '#FFD7A8', strokeOpacity: 0.55, strokeWidth: 2.2, fill: 'none', strokeLinecap: 'round' as const };

  return (
    <svg className={`avatar alive mood-${m}`} viewBox="0 0 200 400" role="img" aria-label={label}>
      <defs>
        {/* soft "clay" volume: light from the upper left, warm rim light from the right */}
        <radialGradient id="av-skin" cx="0.38" cy="0.32" r="0.8">
          <stop offset="0" stopColor="#E8B48C" />
          <stop offset="0.65" stopColor="#C98E6B" />
          <stop offset="1" stopColor="#A86C4C" />
        </radialGradient>
        <radialGradient id="av-hoodie" cx="0.35" cy="0.25" r="0.9">
          <stop offset="0" stopColor="#FF8A5E" />
          <stop offset="0.6" stopColor="#E8603C" />
          <stop offset="1" stopColor="#B9452A" />
        </radialGradient>
        <linearGradient id="av-denim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3D4E7A" />
          <stop offset="0.55" stopColor="#2E3A5C" />
          <stop offset="1" stopColor="#1F2942" />
        </linearGradient>
        <radialGradient id="av-hair" cx="0.4" cy="0.2" r="0.9">
          <stop offset="0" stopColor="#5A4036" />
          <stop offset="1" stopColor="#1E1512" />
        </radialGradient>
        <linearGradient id="av-shoe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#E4DED2" />
        </linearGradient>
        <radialGradient id="av-ground" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000" stopOpacity="0.35" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse className="shadow" cx="100" cy="388" rx="70" ry="11" fill="url(#av-ground)" />

      {/* mood particles */}
      <g className="fx fx-energetic">
        <path d="M20 96v-16l12-3v14" stroke="#E8603C" strokeWidth="2.8" fill="none" strokeLinecap="round" />
        <circle cx="17" cy="97" r="3.6" fill="#E8603C" />
        <circle cx="29" cy="92" r="3.6" fill="#E8603C" />
        <path d="M176 150v-14l10-2v12" stroke="#F2A65A" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <circle cx="173" cy="151" r="3.2" fill="#F2A65A" />
        <circle cx="183" cy="147" r="3.2" fill="#F2A65A" />
        <path d="M30 170l4 6 6-2-4 6 3 6-6-3-5 4 1-7-5-4 6-1z" fill="#F6C96B" />
      </g>
      <g className="fx fx-calm" fill="#FFFFFF" opacity="0.8">
        <circle cx="30" cy="120" r="3.4" />
        <circle cx="172" cy="96" r="2.8" />
        <circle cx="164" cy="176" r="2.2" />
        <circle cx="40" cy="200" r="2" />
      </g>
      <g className="fx fx-curious">
        <circle cx="168" cy="20" r="15" fill="#FFFFFF" stroke="#4D3F7A" strokeWidth="2" />
        <text x="160.5" y="29" fontSize="24" fontWeight="800" fill="#4D3F7A" fontFamily="system-ui, sans-serif">?</text>
      </g>

      <g className="body">
        {/* legs */}
        <g className="legs">
          <path d="M70 204 L99 204 L97 366 L75 366 Z" fill={denim} {...line} />
          <path d="M101 204 L130 204 L125 366 L103 366 Z" fill={denim} {...line} />
          <path d="M92 210 L95 362" stroke={denimShade} strokeWidth="5" opacity="0.7" />
          <path d="M106 210 L104 362" stroke={denimShade} strokeWidth="5" opacity="0.7" />
          <path d="M128 214 L124 360" {...rim} strokeOpacity={0.35} />
          <path d="M78 290 q8 4 16 0 M106 290 q8 4 16 0" stroke={denimShade} strokeWidth="2" fill="none" strokeLinecap="round" />
          <rect x="74" y="352" width="24" height="10" rx="3" fill={denimShade} />
          <rect x="102" y="352" width="24" height="10" rx="3" fill={denimShade} />
          {/* sneakers */}
          <path d="M60 372 C60 362 70 358 80 360 L97 362 C101 364 101 378 97 380 L62 380 C58 380 58 376 60 372 Z" fill="url(#av-shoe)" {...line} />
          <path d="M140 372 C140 362 130 358 120 360 L103 362 C99 364 99 378 103 380 L138 380 C142 380 142 376 140 372 Z" fill="url(#av-shoe)" {...line} />
          <rect x="58" y="378" width="42" height="6" rx="3" fill={ink} />
          <rect x="100" y="378" width="42" height="6" rx="3" fill={ink} />
          <path d="M70 368 L88 368 M112 368 L130 368" stroke="#0D5F5B" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* torso: hoodie with hood, drawstrings, kangaroo pocket, hem band */}
        <g className="torso">
          <path d="M66 114 C66 100 80 92 100 92 C120 92 134 100 134 114 L138 204 C138 210 134 214 130 214 L70 214 C66 214 62 210 62 204 Z" fill={hoodie} {...line} />
          <path d="M66 114 C66 104 70 98 76 96 L72 210 C66 210 62 208 62 204 Z" fill={hoodieShade} opacity="0.55" />
          <path d="M76 98 C80 86 120 86 124 98 C118 104 82 104 76 98 Z" fill={hoodieShade} />
          <path d="M90 98 L100 118 L110 98 Z" fill="#F6E3D6" />
          <path d="M94 104 L92 138 M106 104 L108 138" stroke="#F6E3D6" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="92" cy="140" r="2.4" fill="#F6E3D6" />
          <circle cx="108" cy="140" r="2.4" fill="#F6E3D6" />
          <path d="M76 166 L124 166 L130 194 L70 194 Z" fill={hoodieShade} opacity="0.75" />
          <path d="M80 170 L120 170" stroke={hoodieFlat} strokeWidth="1.6" opacity="0.6" />
          <rect x="62" y="198" width="76" height="16" rx="6" fill={hoodieShade} />
          <ellipse cx="82" cy="112" rx="12" ry="6" fill="#FFFFFF" opacity="0.18" />
          <path d="M134 116 L137 200" {...rim} />
        </g>

        {/* arms: sleeve, cuff, hand (mitten + thumb); left wrist has a watch */}
        <g className="arm arm-l">
          <path d="M70 112 C59 138 55 170 56 198" stroke={hoodieFlat} strokeWidth="22" strokeLinecap="round" fill="none" />
          <path d="M66 120 C58 144 55 170 56 196" stroke={hoodieShade} strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.5" />
          <rect x="45" y="196" width="22" height="10" rx="4" fill={hoodieShade} />
          <ellipse cx="56" cy="216" rx="10" ry="12" fill={skin} {...line} />
          <ellipse cx="64" cy="210" rx="4" ry="6" fill={skin} />
          <rect x="49" y="203" width="14" height="5" rx="2" fill="#0D5F5B" />
        </g>
        <g className="arm arm-r">
          <path d="M130 112 C141 138 145 170 144 198" stroke={hoodieFlat} strokeWidth="22" strokeLinecap="round" fill="none" />
          <path d="M134 120 C142 144 145 170 144 196" stroke={hoodieShade} strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.35" />
          <rect x="133" y="196" width="22" height="10" rx="4" fill={hoodieShade} />
          <ellipse cx="144" cy="216" rx="10" ry="12" fill={skin} {...line} />
          <ellipse cx="136" cy="210" rx="4" ry="6" fill={skin} />
        </g>

        {/* head */}
        <g className="head">
          <rect x="90" y="72" width="20" height="26" rx="8" fill={skin} />
          <rect x="90" y="78" width="20" height="8" fill={skinShade} opacity="0.6" />
          <ellipse cx="71" cy="50" rx="5.5" ry="8.5" fill={skin} {...line} />
          <ellipse cx="129" cy="50" rx="5.5" ry="8.5" fill={skin} {...line} />
          <path d="M72 46 C72 25 84 13 100 13 C116 13 128 25 128 46 C128 65 118 81 100 81 C82 81 72 65 72 46 Z" fill={skin} {...line} />
          {/* hair: volume on top, short sides */}
          <path d="M70 44 C65 21 82 5 103 7 C124 8 138 22 132 44 C128 34 120 28 110 30 C104 21 91 21 85 30 C79 30 73 36 70 44 Z" fill={hair} />
          <path d="M71 40 C72 46 73 50 74 52 L76 40 Z M129 40 C128 46 127 50 126 52 L124 40 Z" fill={hair} />
          <path d="M88 14 C98 9 114 11 122 20" stroke="#4A352E" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M80 22 C86 17 92 16 98 16" stroke="#4A352E" strokeWidth="1.8" fill="none" strokeLinecap="round" />

          <g className="brows" stroke={hairFlat} strokeWidth="3.2" strokeLinecap="round" fill="none">
            <path className="brow-l" d="M81 39 Q88 35 95 38" />
            <path className="brow-r" d="M105 38 Q112 35 119 39" />
          </g>
          <g className="eyes">
            <ellipse cx="88" cy="50" rx="6.6" ry="5.2" fill="#FFFFFF" />
            <ellipse cx="112" cy="50" rx="6.6" ry="5.2" fill="#FFFFFF" />
            <g className="pupils">
              <circle cx="88.5" cy="50.5" r="3.8" fill="#3B2A20" />
              <circle cx="112.5" cy="50.5" r="3.8" fill="#3B2A20" />
              <circle cx="88.5" cy="50.5" r="1.9" fill={ink} />
              <circle cx="112.5" cy="50.5" r="1.9" fill={ink} />
              <circle cx="90" cy="49" r="1.1" fill="#FFFFFF" />
              <circle cx="114" cy="49" r="1.1" fill="#FFFFFF" />
            </g>
            <path d="M81.5 48 Q88 43.5 94.5 48 M105.5 48 Q112 43.5 118.5 48" stroke={ink} strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <g className="lids" fill={skin}>
              <path d="M80.5 45 L95.5 45 L95.5 50.5 Q88 47.5 80.5 50.5 Z" />
              <path d="M104.5 45 L119.5 45 L119.5 50.5 Q112 47.5 104.5 50.5 Z" />
            </g>
          </g>
          <path d="M100 51 Q96.5 60 99 62.5 Q102 63.5 104 61.5" stroke={skinShade} strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <g className="mouth mouth-energetic">
            <path d="M90 67 Q100 80 110 67 Z" fill="#5A1F1A" />
            <path d="M93 72 Q100 77 107 72 Q100 74 93 72 Z" fill="#E8603C" />
            <path d="M91 67 L109 67" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
          </g>
          <path className="mouth mouth-calm" d="M92 68 Q100 73 108 68" stroke="#5A1F1A" strokeWidth="2.6" strokeLinecap="round" fill="none" />
          <ellipse className="mouth mouth-curious" cx="102" cy="69.5" rx="3.4" ry="4.2" fill="#5A1F1A" />
          <ellipse cx="90" cy="26" rx="10" ry="5" fill="#FFFFFF" opacity="0.2" />
          <path d="M126 40 C128 52 124 66 116 74" {...rim} />
          <path d="M112 12 C120 14 128 22 131 32" stroke="#FFFFFF" strokeOpacity="0.25" strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle className="cheek" cx="82" cy="61" r="5" fill="#E8603C" />
          <circle className="cheek" cx="118" cy="61" r="5" fill="#E8603C" />

          <g className="phones">
            <path d="M68 48 C64 0 136 0 132 48" stroke={ink} strokeWidth="6" fill="none" strokeLinecap="round" />
            <rect x="61" y="40" width="14" height="22" rx="7" fill="#0D5F5B" />
            <rect x="125" y="40" width="14" height="22" rx="7" fill="#0D5F5B" />
          </g>
        </g>
      </g>
    </svg>
  );
}
