/**
 * Stylised Baku waterfront behind the companion (generic silhouettes, no real-building replicas).
 * Colours come from CSS variables set by the time-of-day class on `.world` (tod-morning | tod-day | tod-evening | tod-night).
 */
export type TimeOfDay = 'morning' | 'day' | 'evening' | 'night';

export function timeOfDay(now = new Date()): TimeOfDay {
  const h = Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Baku', hour: '2-digit', hour12: false }).format(now)) % 24;
  if (h >= 6 && h < 11) return 'morning';
  if (h >= 11 && h < 17) return 'day';
  if (h >= 17 && h < 21) return 'evening';
  return 'night';
}

const v = (name: string) => ({ fill: `var(${name})` });

export function BakuScene() {
  const windows: Array<[number, number]> = [
    [34, 336], [44, 350], [96, 320], [104, 340], [150, 352], [208, 330], [216, 350], [262, 300], [272, 326], [300, 280], [306, 312], [330, 300],
  ];
  return (
    <svg className="scene" viewBox="0 0 360 580" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--sky-top)' }} />
          <stop offset="1" style={{ stopColor: 'var(--sky-bot)' }} />
        </linearGradient>
        <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--sea-a)' }} />
          <stop offset="1" style={{ stopColor: 'var(--sea-b)' }} />
        </linearGradient>
        <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--sky-bot)' }} stopOpacity="0" />
          <stop offset="1" style={{ stopColor: 'var(--sky-bot)' }} stopOpacity="0.85" />
        </linearGradient>
        <radialGradient id="sunglow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFE3A8" stopOpacity="0.9" />
          <stop offset="1" stopColor="#FFE3A8" stopOpacity="0" />
        </radialGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect width="360" height="420" fill="url(#sky)" />
      <circle className="sunhalo" cx="250" cy="300" r="120" fill="url(#sunglow)" />
      <g className="stars" fill="#FFFFFF">
        {[[30, 40], [80, 90], [140, 30], [200, 70], [250, 24], [320, 60], [300, 120], [60, 150], [180, 140]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={x! % 3 === 0 ? 1.6 : 1.1} />
        ))}
      </g>
      <circle className="sun sun-morning" cx="70" cy="250" r="26" fill="#F6C96B" />
      <circle className="sun sun-day" cx="300" cy="90" r="24" fill="#FFF3C4" />
      <circle className="sun sun-evening" cx="250" cy="300" r="34" fill="#F2A65A" />
      <g className="sun sun-night">
        <circle cx="290" cy="80" r="18" fill="#F4EBD0" />
        <circle cx="298" cy="74" r="16" style={{ fill: 'var(--sky-top)' }} />
      </g>
      <g className="clouds" fill="#FFFFFF">
        <ellipse cx="80" cy="110" rx="34" ry="10" />
        <ellipse cx="100" cy="102" rx="20" ry="10" />
        <ellipse cx="250" cy="170" rx="30" ry="8" />
      </g>
      {/* far skyline: old round tower + blocks + three flame-like towers */}
      <g {...v('--city-far')}>
        <rect x="18" y="320" width="34" height="90" rx="4" />
        <path d="M60 410 L60 330 Q72 300 84 330 L84 410 Z" />
        <rect x="90" y="300" width="26" height="110" rx="3" />
        <rect x="120" y="336" width="40" height="74" rx="3" />
        <rect x="164" y="318" width="22" height="92" rx="3" />
        <rect x="196" y="326" width="30" height="84" rx="3" />
        <path d="M250 410 C248 340 258 290 270 262 C282 290 290 340 288 410 Z" />
        <path d="M286 410 C285 330 294 270 306 236 C318 270 326 330 324 410 Z" />
        <path d="M322 410 C321 346 330 300 340 278 C350 300 356 346 354 410 Z" />
      </g>
      <g className="lights" fill="#F6C96B">
        {windows.map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="4" height="5" rx="1" />
        ))}
      </g>
      {/* haze between far and mid layers (atmospheric depth) */}
      <rect y="250" width="360" height="160" fill="url(#haze)" />
      {/* mid layer: closer buildings with warm windows */}
      <g {...v('--city-mid')}>
        <rect x="-4" y="342" width="58" height="70" rx="3" />
        <rect x="58" y="356" width="40" height="56" rx="3" />
        <rect x="262" y="350" width="44" height="62" rx="3" />
        <rect x="310" y="334" width="54" height="78" rx="3" />
      </g>
      <g className="lights lights-mid" fill="#FFC86B" filter="url(#glow)">
        {[[8, 352], [22, 352], [36, 352], [8, 370], [36, 370], [22, 388], [66, 366], [82, 366], [74, 384], [270, 360], [286, 360], [278, 378], [318, 344], [334, 344], [350, 344], [318, 362], [342, 380]].map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="8" height="9" rx="1.5" />
        ))}
      </g>
      {/* blossom tree (left) */}
      <g className="tree">
        <rect x="104" y="372" width="5" height="40" rx="2" fill="#5B4034" />
        <circle cx="106" cy="360" r="17" fill="#E59BB8" />
        <circle cx="94" cy="368" r="12" fill="#D987A8" />
        <circle cx="118" cy="368" r="12" fill="#EDB0C6" />
        <circle cx="106" cy="348" r="10" fill="#F2C2D3" />
      </g>
      {/* near city line */}
      <path d="M0 412 L0 388 L30 388 L30 380 L70 380 L70 394 L120 394 L120 384 L180 384 L180 392 L240 392 L240 382 L300 382 L300 390 L360 390 L360 412 Z" {...v('--city-near')} />
      {/* Caspian */}
      <rect y="408" width="360" height="44" fill="url(#sea)" />
      <path d="M20 422 q10 -4 20 0 t20 0 M120 432 q10 -4 20 0 t20 0 M230 420 q10 -4 20 0 t20 0 M300 440 q10 -4 20 0" stroke="#FFFFFF" strokeOpacity="0.45" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      {/* promenade */}
      <rect y="450" width="360" height="130" {...v('--ground')} />
      <rect y="450" width="360" height="6" {...v('--ground-edge')} />
      {/* people strolling along the boulevard (decorative) */}
      <g className="walkers">
        <g className="walker w1"><circle cx="0" cy="-30" r="4" fill="#3A3F4D" /><rect x="-4" y="-26" width="8" height="16" rx="3" fill="#0D5F5B" /><rect x="-3" y="-10" width="2.5" height="11" fill="#2B2F3B" /><rect x="0.5" y="-10" width="2.5" height="11" fill="#2B2F3B" /></g>
        <g className="walker w2"><circle cx="0" cy="-30" r="4" fill="#3A3F4D" /><rect x="-4" y="-26" width="8" height="16" rx="3" fill="#E59BB8" /><rect x="-3" y="-10" width="2.5" height="11" fill="#2B2F3B" /><rect x="0.5" y="-10" width="2.5" height="11" fill="#2B2F3B" /></g>
        <g className="walker w3"><circle cx="0" cy="-30" r="4" fill="#3A3F4D" /><rect x="-4" y="-26" width="8" height="16" rx="3" fill="#F2A65A" /><rect x="-3" y="-10" width="2.5" height="11" fill="#2B2F3B" /><rect x="0.5" y="-10" width="2.5" height="11" fill="#2B2F3B" /><circle cx="12" cy="-4" r="4" fill="#8A5A3C" /></g>
      </g>
      <path d="M0 500 L360 500 M0 545 L360 545 M60 456 L40 580 M140 456 L130 580 M220 456 L230 580 M300 456 L320 580" style={{ stroke: 'var(--ground-line)' }} strokeWidth="1.4" />
    </svg>
  );
}

/** Salaam logo: a greeting bubble with a sun inside (hello + the city's light). */
export function Logo({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="18" fill="#0D5F5B" />
      <path d="M14 30 C14 20 22 14 32 14 C42 14 50 20 50 30 C50 40 42 46 32 46 L24 46 L16 52 L18 43 C15.5 40 14 35.5 14 30 Z" fill="#FBF7F2" />
      <circle cx="38" cy="26" r="6" fill="#E8603C" />
      <path d="M22 34 Q32 40 42 34" stroke="#0D5F5B" strokeWidth="3.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
