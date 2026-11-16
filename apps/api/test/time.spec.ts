import { lensWindow, localToUtc } from '../src/common/time';
import { decodeGeohash, encodeGeohash } from '../src/common/geohash';
import { resolveLocalized } from '@salaam/domain';

describe('Baku time windows (Asia/Baku, UTC+4, no DST)', () => {
  it('converts local time to UTC', () => {
    expect(localToUtc('2026-11-20', '19:30').toISOString()).toBe('2026-11-20T15:30:00.000Z');
  });

  it('tonight starts at 17:00 local, or now if later, and ends 04:00 next day', () => {
    const morning = new Date('2026-11-17T06:00:00Z'); // 10:00 local
    const w = lensWindow('tonight', morning);
    expect(w.from.toISOString()).toBe('2026-11-17T13:00:00.000Z');
    expect(w.to.toISOString()).toBe('2026-11-18T00:00:00.000Z');
    const late = new Date('2026-11-17T18:00:00Z'); // 22:00 local
    expect(lensWindow('tonight', late).from.toISOString()).toBe(late.toISOString());
  });

  it('weekend is Friday 17:00 → Monday 00:00 local', () => {
    const tue = new Date('2026-11-17T08:00:00Z');
    const w = lensWindow('weekend', tue);
    expect(w.from.toISOString()).toBe('2026-11-20T13:00:00.000Z');
    expect(w.to.toISOString()).toBe('2026-11-22T20:00:00.000Z');
  });

  it('now is a 3-hour window', () => {
    const t = new Date('2026-11-17T08:00:00Z');
    const w = lensWindow('now', t);
    expect(w.to.getTime() - w.from.getTime()).toBe(3 * 3600_000);
  });
});

describe('geohash', () => {
  it('round-trips within cell precision', () => {
    const gh = encodeGeohash(40.3667, 49.8352, 6);
    const p = decodeGeohash(gh)!;
    expect(Math.abs(p.lat - 40.3667)).toBeLessThan(0.01);
    expect(Math.abs(p.lng - 49.8352)).toBeLessThan(0.01);
    expect(decodeGeohash('a!')).toBeNull();
  });
});

describe('localized text fallback', () => {
  it('requested → original → az → ru → en', () => {
    expect(resolveLocalized({ ru: 'Привет', en: 'Hi' }, 'az', 'ru')).toMatchObject({ value: 'Привет', locale: 'ru' });
    expect(resolveLocalized({ az: 'Salam', en: 'Hi' }, 'en', 'az')).toMatchObject({ value: 'Hi', locale: 'en' });
    expect(resolveLocalized({ en: 'Hi' }, 'az', 'ru')).toMatchObject({ value: 'Hi', locale: 'en' });
  });
});
