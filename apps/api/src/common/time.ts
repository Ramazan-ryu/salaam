/**
 * Time helpers for Asia/Baku (docs: all times displayed in Asia/Baku).
 * Uses Intl so that any future offset change in tz data is respected.
 */
export const CITY_TZ = 'Asia/Baku';

export function offsetMinutes(date: Date, tz = CITY_TZ): number {
  const part = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'longOffset' })
    .formatToParts(date)
    .find((p) => p.type === 'timeZoneName')?.value;
  const m = part ? /GMT(?:([+-])(\d{2}):?(\d{2})?)?/.exec(part) : null;
  if (!m || !m[1]) return 0;
  const sign = m[1] === '-' ? -1 : 1;
  return sign * (Number(m[2]) * 60 + Number(m[3] ?? '0'));
}

export interface LocalParts {
  date: string; // YYYY-MM-DD
  weekday: number; // 0 = Sunday … 6 = Saturday
  hour: number;
  minute: number;
}

export function localParts(date: Date, tz = CITY_TZ): LocalParts {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return {
    date: `${get('year')}-${get('month')}-${get('day')}`,
    weekday: weekdays.indexOf(get('weekday')),
    hour: Number(get('hour')),
    minute: Number(get('minute')),
  };
}

/** Convert a local wall-clock date/time in the city timezone to a UTC instant. */
export function localToUtc(date: string, time = '00:00', tz = CITY_TZ): Date {
  const guess = new Date(`${date}T${time}:00Z`);
  const off1 = offsetMinutes(guess, tz);
  let result = new Date(guess.getTime() - off1 * 60_000);
  const off2 = offsetMinutes(result, tz);
  if (off2 !== off1) result = new Date(guess.getTime() - off2 * 60_000);
  return result;
}

export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export type Lens = 'now' | 'tonight' | 'weekend' | 'date';

/** Time window for discovery lenses (docs/PRODUCT_REQUIREMENTS_DOCUMENT.md FR-040). */
export function lensWindow(lens: Lens, now: Date, date?: string): { from: Date; to: Date } {
  const local = localParts(now);
  switch (lens) {
    case 'now':
      return { from: now, to: new Date(now.getTime() + 3 * 3600_000) };
    case 'tonight': {
      const evening = localToUtc(local.date, '17:00');
      return {
        from: now > evening ? now : evening,
        to: localToUtc(addDays(local.date, 1), '04:00'),
      };
    }
    case 'weekend': {
      // Friday 17:00 → Monday 00:00 of the current or upcoming weekend.
      const daysToFriday = local.weekday === 0 ? -2 : local.weekday === 6 ? -1 : 5 - local.weekday;
      const friday = addDays(local.date, daysToFriday);
      const start = localToUtc(friday, '17:00');
      return { from: now > start ? now : start, to: localToUtc(addDays(friday, 3), '00:00') };
    }
    case 'date': {
      if (!date) throw new Error('date is required for the date lens');
      return { from: localToUtc(date, '00:00'), to: localToUtc(addDays(date, 1), '00:00') };
    }
  }
}
