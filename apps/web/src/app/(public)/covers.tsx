/**
 * Original category cover illustrations (16:9) — the fallback image system when an event has no licensed photo
 * (ART_DIRECTION.md §Discovery). Each category has its own scene and light, never just an icon on a pastel tile.
 * `seed` varies details so neighbouring cards of the same category don't look identical.
 */
export function CoverArt({ category, seed = 0, title }: { category?: string; seed?: number; title?: string }) {
  const s = Math.abs(seed) % 3;
  const id = `cv-${category ?? 'x'}-${s}`;
  return (
    <svg className="cover" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" role="img" aria-label={title ?? ''}>
      {category === 'music' && <Music id={id} s={s} />}
      {category === 'exhibition_culture' && <Gallery id={id} s={s} />}
      {category === 'workshop_talk' && <Workshop id={id} s={s} />}
      {category === 'cinema' && <Cinema id={id} s={s} />}
      {category === 'community_free' && <Park id={id} s={s} />}
      {!['music', 'exhibition_culture', 'workshop_talk', 'cinema', 'community_free'].includes(category ?? '') && <City id={id} />}
      <rect width="320" height="180" fill={`url(#${id}-vig)`} />
      <defs>
        <radialGradient id={`${id}-vig`} cx="0.5" cy="0.45" r="0.75">
          <stop offset="0.6" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.45" />
        </radialGradient>
      </defs>
    </svg>
  );
}

function Music({ id, s }: { id: string; s: number }) {
  const hue = ['#E8603C', '#C2445E', '#F2A65A'][s]!;
  return (
    <>
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#140C22" />
          <stop offset="1" stopColor="#2B1236" />
        </linearGradient>
        <linearGradient id={`${id}-beam`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={hue} stopOpacity="0.85" />
          <stop offset="1" stopColor={hue} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill={`url(#${id}-bg)`} />
      {[60, 160, 260].map((x, i) => (
        <path key={x} d={`M${x} 0 L${x - 70 + i * 10} 150 L${x + 70 - i * 10} 150 Z`} fill={`url(#${id}-beam)`} opacity={0.55} />
      ))}
      <rect y="132" width="320" height="48" fill="#0B0712" />
      <rect x="40" y="120" width="240" height="14" rx="3" fill="#1E1428" />
      {/* performers */}
      <g fill="#0B0712">
        <circle cx="120" cy="86" r="8" />
        <path d="M108 122 C108 100 132 100 132 122 Z" />
        <circle cx="168" cy="82" r="8.5" />
        <path d="M155 122 C155 98 181 98 181 122 Z" />
        <rect x="186" y="96" width="5" height="26" />
        <circle cx="210" cy="88" r="8" />
        <path d="M198 122 C198 102 222 102 222 122 Z" />
      </g>
      {/* crowd */}
      <g fill="#05030A">
        {Array.from({ length: 16 }, (_, i) => (
          <circle key={i} cx={10 + i * 20 + (i % 2) * 6} cy={160 + (i % 3) * 4} r={11 + (i % 2) * 2} />
        ))}
      </g>
      {[30, 90, 230, 290].map((x, i) => (
        <circle key={x} cx={x} cy={30 + i * 8} r="2" fill="#FFF3C4" opacity="0.8" />
      ))}
    </>
  );
}

function Gallery({ id, s }: { id: string; s: number }) {
  const art = [
    ['#0D5F5B', '#F2A65A', '#E8603C'],
    ['#2E4FA3', '#F6C96B', '#8E5BA8'],
    ['#3F6A4E', '#E59BB8', '#C98E6B'],
  ][s]!;
  return (
    <>
      <defs>
        <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#EDE6DC" />
          <stop offset="1" stopColor="#D6CBBC" />
        </linearGradient>
        <radialGradient id={`${id}-spot`} cx="0.5" cy="0" r="0.8">
          <stop offset="0" stopColor="#FFF6E2" stopOpacity="0.95" />
          <stop offset="1" stopColor="#FFF6E2" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="180" fill={`url(#${id}-wall)`} />
      <rect y="140" width="320" height="40" fill="#B9A58E" />
      <rect y="140" width="320" height="3" fill="#A28E77" />
      {[[40, 50, 70, 60], [130, 34, 80, 92], [232, 56, 56, 56]].map(([x, y, w, h], i) => (
        <g key={i}>
          <ellipse cx={x! + w! / 2} cy={y! - 4} rx={w! * 0.9} ry={70} fill={`url(#${id}-spot)`} />
          <rect x={x! - 4} y={y! - 4} width={w! + 8} height={h! + 8} fill="#3A2A20" />
          <rect x={x} y={y} width={w} height={h} fill="#F7F1E7" />
          <circle cx={x! + w! * 0.35} cy={y! + h! * 0.4} r={Math.min(w!, h!) * 0.22} fill={art[i]} />
          <rect x={x! + w! * 0.15} y={y! + h! * 0.62} width={w! * 0.7} height={h! * 0.18} fill={art[(i + 1) % 3]} opacity="0.85" />
        </g>
      ))}
      {/* a visitor */}
      <g fill="#2B2F3B">
        <circle cx="198" cy="104" r="7" />
        <path d="M189 142 L191 114 C192 108 204 108 205 114 L207 142 Z" />
      </g>
    </>
  );
}

function Workshop({ id, s }: { id: string; s: number }) {
  const clay = ['#C98E6B', '#B4472A', '#D8B48A'][s]!;
  return (
    <>
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3A2A4F" />
          <stop offset="1" stopColor="#6B4E7A" />
        </linearGradient>
        <radialGradient id={`${id}-lamp`} cx="0.5" cy="0.3" r="0.6">
          <stop offset="0" stopColor="#FFD9A0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#FFD9A0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="180" fill={`url(#${id}-bg)`} />
      <ellipse cx="160" cy="70" rx="150" ry="90" fill={`url(#${id}-lamp)`} />
      <path d="M150 0 L150 26 M136 26 L164 26 L172 40 L128 40 Z" stroke="#1B1A1F" strokeWidth="3" fill="#1B1A1F" />
      {/* table */}
      <path d="M0 120 L320 120 L320 180 L0 180 Z" fill="#8A5A3C" />
      <path d="M0 120 L320 120 L320 128 L0 128 Z" fill="#A86C4C" />
      {/* pottery */}
      <ellipse cx="110" cy="118" rx="34" ry="6" fill="#5B4034" />
      <path d={`M94 116 C88 92 96 78 110 76 C124 78 132 92 126 116 Z`} fill={clay} />
      <ellipse cx="110" cy="77" rx="9" ry="3" fill="#7A4B33" />
      <path d="M198 118 C196 104 206 96 220 96 C234 96 244 104 242 118 Z" fill="#E9DFD2" />
      <path d="M262 118 L262 92 L288 92 L288 118 Z" fill="#0D5F5B" />
      <rect x="258" y="88" width="34" height="5" rx="2" fill="#0A4A47" />
      {/* hands */}
      <g fill="#C98E6B">
        <ellipse cx="78" cy="102" rx="12" ry="8" transform="rotate(-25 78 102)" />
        <ellipse cx="142" cy="102" rx="12" ry="8" transform="rotate(25 142 102)" />
      </g>
    </>
  );
}

function Cinema({ id, s }: { id: string; s: number }) {
  const scr = [
    ['#2E4FA3', '#F2A65A'],
    ['#0D5F5B', '#E8603C'],
    ['#8E5BA8', '#F6C96B'],
  ][s]!;
  return (
    <>
      <defs>
        <linearGradient id={`${id}-scr`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={scr[0]} />
          <stop offset="1" stopColor={scr[1]} />
        </linearGradient>
        <linearGradient id={`${id}-glow`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={scr[1]} stopOpacity="0.35" />
          <stop offset="1" stopColor={scr[1]} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill="#0A0A10" />
      <rect x="40" y="16" width="240" height="96" rx="4" fill={`url(#${id}-scr)`} />
      <path d="M60 112 L260 112 L320 180 L0 180 Z" fill={`url(#${id}-glow)`} />
      <path d="M70 86 C110 50 150 92 190 60 C220 40 250 70 270 62 L270 108 L50 108 Z" fill="#000" opacity="0.18" />
      {/* seats */}
      {[0, 1, 2].map((row) => (
        <g key={row} fill={row === 2 ? '#1A0E14' : '#2A1420'}>
          {Array.from({ length: 9 + row }, (_, i) => (
            <rect key={i} x={6 + i * (320 / (9 + row)) + row * 4} y={128 + row * 18} width={320 / (9 + row) - 8} height="20" rx="6" />
          ))}
        </g>
      ))}
      <g fill="#0A0A10">
        <circle cx="118" cy="130" r="9" />
        <circle cx="140" cy="132" r="8" />
      </g>
    </>
  );
}

function Park({ id, s }: { id: string; s: number }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={['#BFE3EE', '#F9D9B9', '#CFE9F2'][s]} />
          <stop offset="1" stopColor="#EAF6F3" />
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill={`url(#${id}-sky)`} />
      <circle cx="262" cy="38" r="16" fill="#FFF3C4" />
      <path d="M0 120 C60 100 120 112 180 104 C240 96 290 108 320 102 L320 180 L0 180 Z" fill="#8FC57A" />
      <path d="M0 140 C80 126 160 138 320 128 L320 180 L0 180 Z" fill="#6FAE5E" />
      <path d="M90 180 C120 150 150 140 190 132" stroke="#E9DFC6" strokeWidth="12" fill="none" strokeLinecap="round" />
      {[[40, 96, 26], [74, 88, 20], [240, 92, 24], [280, 98, 18]].map(([x, y, r], i) => (
        <g key={i}>
          <rect x={x! - 2.5} y={y} width="5" height={r! + 6} fill="#5B4034" />
          <circle cx={x} cy={y} r={r} fill={i % 2 ? '#3F7D45' : '#4F8F4F'} />
          <circle cx={x! - r! * 0.35} cy={y! - r! * 0.3} r={r! * 0.45} fill="#6BAA5E" opacity="0.7" />
        </g>
      ))}
      {/* people together */}
      {[[150, 0], [168, 1], [186, 2]].map(([x, i]) => (
        <g key={x} fill={['#0D5F5B', '#E8603C', '#F2A65A'][i!]}>
          <circle cx={x} cy={108} r="6" fill="#3A2A20" />
          <rect x={x! - 6} y={114} width="12" height="18" rx="5" />
        </g>
      ))}
    </>
  );
}

function City({ id }: { id: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E7896A" />
          <stop offset="1" stopColor="#F8DAB9" />
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill={`url(#${id}-sky)`} />
      <g fill="#8E5E5F">
        <rect x="20" y="90" width="40" height="90" />
        <rect x="70" y="70" width="30" height="110" />
        <path d="M220 180 C218 110 230 70 244 50 C258 70 268 110 266 180 Z" />
        <path d="M262 180 C261 116 272 80 284 62 C296 80 306 116 304 180 Z" />
      </g>
      <rect y="150" width="320" height="30" fill="#3F7186" />
    </>
  );
}
