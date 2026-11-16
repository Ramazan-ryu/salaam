import { createHash } from 'node:crypto';
import { LOCALES, type Locale, type LocalizedText } from '@salaam/domain';

/** Lower-case and join all locale variants for trigram matching. */
export function normalizeLocalized(text: LocalizedText): string {
  return [text.az, text.ru, text.en]
    .filter(Boolean)
    .map((s) => s!.toLocaleLowerCase('az').normalize('NFC').replace(/\s+/g, ' ').trim())
    .join(' | ');
}

export function firstLocale(text: LocalizedText): Locale {
  return LOCALES.find((l) => Boolean(text[l])) ?? 'az';
}

export function stableHash(value: unknown): string {
  return createHash('sha256').update(stableStringify(value)).digest('hex');
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([, v]) => v !== undefined)
    .sort(([a], [b]) => a.localeCompare(b));
  return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${stableStringify(v)}`).join(',')}}`;
}

export function parseAcceptLanguage(header: string | undefined): Locale {
  if (!header) return 'az';
  for (const part of header.split(',')) {
    const tag = part.split(';')[0]?.trim().slice(0, 2).toLowerCase();
    if (tag && (LOCALES as readonly string[]).includes(tag)) return tag as Locale;
  }
  return 'az';
}
