'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { DICTS, LANG_COOKIE, LOCALES, type Locale } from '@/lib/i18n';

export function LangSwitch({ locale }: { locale: Locale }) {
  const router = useRouter();
  const set = (l: Locale) => {
    document.cookie = `${LANG_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  };
  return (
    <div className="lang" role="group" aria-label="Language / Dil / Язык">
      {LOCALES.map((l) => (
        <button key={l} type="button" aria-pressed={l === locale} onClick={() => set(l)} lang={l}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

const HomeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
  </svg>
);
const CompassIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="m15.5 8.5-2 5-5 2 2-5z" />
  </svg>
);

/** Only implemented destinations are shown (Saved/Profile arrive with sign-in, after spike S-AUTH). */
export function TabBar({ locale }: { locale: Locale }) {
  const path = usePathname();
  const t = DICTS[locale];
  const discover = path.startsWith('/discover') || path.startsWith('/e/');
  return (
    <nav className="pub-tabbar" aria-label="Menu">
      <Link href="/" aria-current={!discover ? 'page' : undefined}>
        <HomeIcon />
        {t.navWorld}
      </Link>
      <Link href="/discover" aria-current={discover ? 'page' : undefined}>
        <CompassIcon />
        {t.discover}
      </Link>
      <Link href="/studio">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="7" r="4" />
          <path d="M5 21c1-4 4-6 7-6s6 2 7 6" />
        </svg>
        {t.navStudio}
      </Link>
    </nav>
  );
}

export function TopNav({ locale }: { locale: Locale }) {
  const path = usePathname();
  const t = DICTS[locale];
  return (
    <nav className="pub-topnav" aria-label="Menu">
      <Link href="/" aria-current={path === '/' ? 'page' : undefined}>
        {t.navWorld}
      </Link>
      <Link href="/discover" aria-current={path.startsWith('/discover') ? 'page' : undefined}>
        {t.discover}
      </Link>
      <Link href="/studio">{t.navStudio}</Link>
    </nav>
  );
}
