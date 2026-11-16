const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';

/**
 * Coarse geohash, computed in the browser. Precision 5 ≈ 4.9 × 4.9 km cell (D-28):
 * the exact coordinates never leave the device.
 */
export function coarseGeohash(lat: number, lng: number, precision = 5): string {
  let latR: [number, number] = [-90, 90];
  let lngR: [number, number] = [-180, 180];
  let hash = '';
  let bit = 0;
  let ch = 0;
  let even = true;
  while (hash.length < precision) {
    const r = even ? lngR : latR;
    const v = even ? lng : lat;
    const mid = (r[0] + r[1]) / 2;
    if (v >= mid) {
      ch = (ch << 1) | 1;
      r[0] = mid;
    } else {
      ch = ch << 1;
      r[1] = mid;
    }
    if (even) lngR = r;
    else latR = r;
    even = !even;
    if (++bit === 5) {
      hash += BASE32[ch];
      bit = 0;
      ch = 0;
    }
  }
  return hash;
}
