import { cookies, headers } from 'next/headers';
import { isLocale, LANG_COOKIE, type Locale } from './i18n';

/** Locale from the user's explicit choice (cookie), then the browser, then Azerbaijani. */
export async function getLocale(): Promise<Locale> {
  const c = (await cookies()).get(LANG_COOKIE)?.value;
  if (isLocale(c)) return c;
  const accept = (await headers()).get('accept-language') ?? '';
  for (const part of accept.split(',')) {
    const tag = part.split(';')[0]?.trim().slice(0, 2).toLowerCase();
    if (isLocale(tag)) return tag;
  }
  return 'az';
}
