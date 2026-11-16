/** Minimal geohash decoder (centre point). Used only for the request-scoped approximate area. */
const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';

export function decodeGeohash(hash: string): { lat: number; lng: number } | null {
  if (!/^[0-9b-hjkmnp-z]{1,12}$/.test(hash)) return null;
  let even = true;
  const lat: [number, number] = [-90, 90];
  const lng: [number, number] = [-180, 180];
  for (const ch of hash) {
    const bits = BASE32.indexOf(ch);
    for (let mask = 16; mask > 0; mask >>= 1) {
      const range = even ? lng : lat;
      const mid = (range[0] + range[1]) / 2;
      if (bits & mask) range[0] = mid;
      else range[1] = mid;
      even = !even;
    }
  }
  return { lat: (lat[0] + lat[1]) / 2, lng: (lng[0] + lng[1]) / 2 };
}

export function encodeGeohash(lat: number, lng: number, precision = 6): string {
  let even = true;
  let bit = 0;
  let ch = 0;
  let out = '';
  const latR: [number, number] = [-90, 90];
  const lngR: [number, number] = [-180, 180];
  while (out.length < precision) {
    const range = even ? lngR : latR;
    const value = even ? lng : lat;
    const mid = (range[0] + range[1]) / 2;
    if (value >= mid) {
      ch |= 16 >> bit;
      range[0] = mid;
    } else range[1] = mid;
    even = !even;
    if (bit < 4) bit++;
    else {
      out += BASE32[ch];
      bit = 0;
      ch = 0;
    }
  }
  return out;
}
