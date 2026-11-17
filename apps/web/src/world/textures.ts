import * as THREE from 'three';

export type TimeOfDay = 'morning' | 'day' | 'evening' | 'night';

/** Deterministic pseudo-random so the skyline is the same on every render. */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const SKY: Record<TimeOfDay, [string, string, string]> = {
  morning: ['#F7C9A6', '#F9E3CC', '#CFE9E6'],
  day: ['#86C4E4', '#BFE1F0', '#E6F4F2'],
  evening: ['#3D3B6B', '#D9785A', '#F6C08A'],
  night: ['#0B1428', '#16264A', '#2A3E66'],
};

/**
 * The view through the window: a painted Baku skyline over the Caspian (generic silhouettes — three flame-like
 * towers, an old round tower, mid-rise blocks), lit windows in the evening/night. Generated on a canvas so it
 * follows the time of day without shipping images.
 */
export function windowViewTexture(tod: TimeOfDay): THREE.CanvasTexture {
  const w = 1024;
  const h = 640;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d')!;
  const [top, mid, bot] = SKY[tod];
  const sky = g.createLinearGradient(0, 0, 0, h * 0.72);
  sky.addColorStop(0, top);
  sky.addColorStop(0.6, mid);
  sky.addColorStop(1, bot);
  g.fillStyle = sky;
  g.fillRect(0, 0, w, h);

  // sun / moon
  if (tod === 'night') {
    g.fillStyle = '#F4EBD0';
    g.beginPath();
    g.arc(800, 120, 34, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = top;
    g.beginPath();
    g.arc(816, 108, 30, 0, Math.PI * 2);
    g.fill();
    const r = rng(7);
    g.fillStyle = 'rgba(255,255,255,0.85)';
    for (let i = 0; i < 70; i++) g.fillRect(r() * w, r() * h * 0.45, 1.6, 1.6);
  } else {
    const sx = tod === 'morning' ? 180 : tod === 'day' ? 760 : 640;
    const sy = tod === 'day' ? 110 : tod === 'morning' ? 300 : 360;
    const halo = g.createRadialGradient(sx, sy, 10, sx, sy, 220);
    halo.addColorStop(0, tod === 'evening' ? 'rgba(255,190,120,0.9)' : 'rgba(255,245,210,0.85)');
    halo.addColorStop(1, 'rgba(255,240,200,0)');
    g.fillStyle = halo;
    g.fillRect(0, 0, w, h);
    g.fillStyle = tod === 'evening' ? '#FFB36B' : '#FFF6DA';
    g.beginPath();
    g.arc(sx, sy, tod === 'evening' ? 46 : 34, 0, Math.PI * 2);
    g.fill();
  }

  const dark = tod === 'night' || tod === 'evening';
  const far = { morning: '#B9D6D3', day: '#AFCFD6', evening: '#7A4E66', night: '#1A2747' }[tod];
  const near = { morning: '#8FB9B4', day: '#86AFB8', evening: '#4E3352', night: '#111A33' }[tod];
  const lit = tod === 'night' ? 0.55 : tod === 'evening' ? 0.4 : 0.0;
  const r = rng(42);
  const horizon = h * 0.7;

  const windows = (x: number, y: number, bw: number, bh: number) => {
    if (!lit) return;
    for (let yy = y + 10; yy < horizon - 8; yy += 14)
      for (let xx = x + 6; xx < x + bw - 6; xx += 11) {
        if (r() < lit) {
          g.fillStyle = r() < 0.8 ? '#FFC874' : '#FFE9B8';
          g.fillRect(xx, yy, 5, 7);
        }
      }
  };

  // far skyline
  g.fillStyle = far;
  for (let x = -20; x < w; ) {
    const bw = 40 + r() * 60;
    const bh = 60 + r() * 120;
    g.fillRect(x, horizon - bh, bw, bh);
    x += bw + 4;
  }
  // three flame-like towers (generic silhouette, right side)
  const flame = (cx: number, base: number, ht: number, wd: number) => {
    g.beginPath();
    g.moveTo(cx - wd, base);
    g.bezierCurveTo(cx - wd, base - ht * 0.5, cx - wd * 0.3, base - ht * 0.9, cx, base - ht);
    g.bezierCurveTo(cx + wd * 0.4, base - ht * 0.85, cx + wd, base - ht * 0.45, cx + wd, base);
    g.closePath();
    g.fill();
  };
  g.fillStyle = near;
  flame(700, horizon, 330, 46);
  flame(790, horizon, 390, 52);
  flame(880, horizon, 300, 44);
  if (lit) {
    g.fillStyle = 'rgba(255,170,90,0.35)';
    flame(790, horizon, 380, 40);
  }
  // round old tower + mid-rise blocks (left)
  g.fillStyle = near;
  g.fillRect(120, horizon - 150, 70, 150);
  g.beginPath();
  g.ellipse(155, horizon - 150, 35, 10, 0, 0, Math.PI * 2);
  g.fill();
  const blocks: Array<[number, number, number]> = [
    [10, 90, 170], [210, 80, 200], [300, 110, 140], [420, 70, 230], [500, 120, 160], [960, 70, 180],
  ];
  for (const [x, bw, bh] of blocks) {
    g.fillStyle = near;
    g.fillRect(x, horizon - bh, bw, bh);
    windows(x, horizon - bh, bw, bh);
  }
  // Caspian
  const sea = g.createLinearGradient(0, horizon, 0, h);
  sea.addColorStop(0, dark ? '#1C3550' : '#5FB0B8');
  sea.addColorStop(1, dark ? '#0E1F33' : '#3E8E9C');
  g.fillStyle = sea;
  g.fillRect(0, horizon, w, h - horizon);
  g.strokeStyle = dark ? 'rgba(255,200,120,0.35)' : 'rgba(255,255,255,0.45)';
  g.lineWidth = 2;
  for (let i = 0; i < 26; i++) {
    const y = horizon + 10 + r() * (h - horizon - 14);
    const x = r() * w;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + 20 + r() * 40, y);
    g.stroke();
  }
  // boulevard line
  g.fillStyle = dark ? '#2A2D3E' : '#D9CDB8';
  g.fillRect(0, horizon - 4, w, 5);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Warm oak plank floor, generated (no image download). */
export function planksTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 1024;
  const g = c.getContext('2d')!;
  const r = rng(3);
  const rows = 14;
  const rh = 1024 / rows;
  for (let i = 0; i < rows; i++) {
    let x = -r() * 300;
    while (x < 1024) {
      const len = 260 + r() * 300;
      const tone = 0.88 + r() * 0.12;
      g.fillStyle = `rgb(${Math.round(196 * tone)},${Math.round(148 * tone)},${Math.round(104 * tone)})`;
      g.fillRect(x, i * rh, len, rh);
      g.strokeStyle = 'rgba(80,50,30,0.12)';
      for (let k = 0; k < 5; k++) {
        g.beginPath();
        const yy = i * rh + 6 + r() * (rh - 12);
        g.moveTo(x + 10, yy);
        g.bezierCurveTo(x + len * 0.3, yy + 3, x + len * 0.6, yy - 3, x + len - 10, yy);
        g.stroke();
      }
      g.fillStyle = 'rgba(70,40,20,0.35)';
      g.fillRect(x, i * rh, 2, rh);
      x += len;
    }
    g.fillStyle = 'rgba(70,40,20,0.28)';
    g.fillRect(0, i * rh, 1024, 2);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  return tex;
}
