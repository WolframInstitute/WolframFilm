// Drawing kit shared by every scene. Works on both browser and @napi-rs/canvas contexts.
export type G = CanvasRenderingContext2D;

// ------------------------------------------------------------------ platform
type MakeCanvas = (w: number, h: number) => { getContext(k: '2d'): any; width: number; height: number };
let makeCanvasImpl: MakeCanvas | null = null;
export const setCanvasFactory = (f: MakeCanvas) => { makeCanvasImpl = f; };
export const makeCanvas = (w: number, h: number) => makeCanvasImpl!(w, h);

// ------------------------------------------------------------------ math
export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
export const inv = (a: number, b: number, x: number) => clamp((x - a) / (b - a));
export const smooth = (u: number) => u * u * (3 - 2 * u);

export const ease = {
  linear: (u: number) => clamp(u),
  outCubic: (u: number) => 1 - Math.pow(1 - clamp(u), 3),
  inCubic: (u: number) => Math.pow(clamp(u), 3),
  inOutCubic: (u: number) => { u = clamp(u); return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; },
  outExpo: (u: number) => { u = clamp(u); return u >= 1 ? 1 : 1 - Math.pow(2, -10 * u); },
  inExpo: (u: number) => { u = clamp(u); return u <= 0 ? 0 : Math.pow(2, 10 * u - 10); },
  inOutExpo: (u: number) => {
    u = clamp(u);
    if (u <= 0) return 0; if (u >= 1) return 1;
    return u < 0.5 ? Math.pow(2, 20 * u - 10) / 2 : (2 - Math.pow(2, -20 * u + 10)) / 2;
  },
  outBack: (u: number, s = 1.7) => { u = clamp(u) - 1; return 1 + (s + 1) * u * u * u + s * u * u; },
  outElastic: (u: number) => {
    u = clamp(u);
    if (u === 0 || u === 1) return u;
    return Math.pow(2, -10 * u) * Math.sin((u * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1;
  },
};

export function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
/** Stable hash of a string or number to [0,1). */
export function hash01(x: string | number) {
  let h = 2166136261;
  const s = String(x);
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  h ^= h >>> 13; h = Math.imul(h, 0x5bd1e995); h ^= h >>> 15;
  return (h >>> 0) / 4294967296;
}

// ------------------------------------------------------------------ fonts
export const F = {
  sans: '"Source Sans 3"',
  code: '"Source Code Pro"',
  serif: '"Source Serif 4"',
  hand: '"Caveat"',
  term: '"VT323"',
  courier: '"Courier Prime"',
  arimo: '"Arimo"',
  tinos: '"Tinos"',
};
export const font = (family: string, size: number, weight: number | string = 400, italic = false) =>
  `${italic ? 'italic ' : ''}${weight} ${size}px ${family}`;

// ------------------------------------------------------------------ shapes & text
export function rrect(g: G, x: number, y: number, w: number, h: number, r: number) {
  r = Math.min(r, w / 2, h / 2);
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

export interface TextOpts { font: string; color?: string; align?: CanvasTextAlign; base?: CanvasTextBaseline; tracking?: number; alpha?: number }
/** Text with optional tracking (px between glyphs). Returns the advance width. */
export function text(g: G, s: string, x: number, y: number, o: TextOpts): number {
  g.save();
  g.font = o.font;
  g.fillStyle = o.color ?? '#000';
  g.textBaseline = o.base ?? 'alphabetic';
  if (o.alpha !== undefined) g.globalAlpha *= o.alpha;
  const tr = o.tracking ?? 0;
  let w: number;
  if (!tr) {
    g.textAlign = o.align ?? 'left';
    g.fillText(s, x, y);
    w = g.measureText(s).width;
  } else {
    w = measure(g, s, o.font, tr);
    let cx = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x;
    g.textAlign = 'left';
    for (const ch of s) { g.fillText(ch, cx, y); cx += g.measureText(ch).width + tr; }
  }
  g.restore();
  return w;
}
export function measure(g: G, s: string, f: string, tracking = 0) {
  g.save(); g.font = f;
  let w = g.measureText(s).width;
  if (tracking) w += tracking * Math.max(0, [...s].length - 1);
  g.restore();
  return w;
}

/**
 * Bitmap-style text for 1-bit era UIs: rendered small without anti-aliasing thresholds,
 * then scaled up with nearest-neighbour so pixels read as pixels.
 */
const pixCache = new Map<string, any>();
export function pixelText(g: G, s: string, x: number, y: number, px: number, scale: number, color: string, family = F.arimo, weight = 700, align: 'left' | 'center' = 'left') {
  const key = `${s}|${px}|${color}|${family}|${weight}`;
  let c = pixCache.get(key);
  if (!c) {
    const probe = makeCanvas(4, 4).getContext('2d');
    probe.font = font(family, px, weight);
    const w = Math.ceil(probe.measureText(s).width) + 4, h = Math.ceil(px * 1.5);
    c = makeCanvas(w, h);
    const cg = c.getContext('2d');
    cg.font = font(family, px, weight);
    cg.fillStyle = '#000';
    cg.textBaseline = 'alphabetic';
    cg.fillText(s, 2, Math.round(px * 1.12));
    // threshold to 1-bit
    const id = cg.getImageData(0, 0, w, h);
    const d = id.data;
    const [r, gg, b] = hexRgb(color);
    for (let i = 0; i < d.length; i += 4) {
      const a = d[i + 3] > 110 ? 255 : 0;
      d[i] = r; d[i + 1] = gg; d[i + 2] = b; d[i + 3] = a;
    }
    cg.putImageData(id, 0, 0);
    pixCache.set(key, c);
  }
  g.save();
  g.imageSmoothingEnabled = false;
  const dx = align === 'center' ? x - (c.width * scale) / 2 : x;
  g.drawImage(c, Math.round(dx), Math.round(y - px * 1.12 * scale), c.width * scale, c.height * scale);
  g.restore();
  return c.width * scale;
}

export function hexRgb(h: string): [number, number, number] {
  h = h.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
export const rgba = (h: string, a: number) => { const [r, g, b] = hexRgb(h); return `rgba(${r},${g},${b},${a})`; };
export function mix(a: string, b: string, u: number) {
  const A = hexRgb(a), B = hexRgb(b);
  const c = A.map((v, i) => Math.round(v + (B[i]! - v) * clamp(u)));
  return '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');
}

/** 50% checker dither fill, the 1-bit way to draw grey. */
export function ditherRect(g: G, x: number, y: number, w: number, h: number, px: number, color = '#000') {
  g.save(); g.fillStyle = color;
  for (let yy = 0; yy < h; yy += px) for (let xx = ((yy / px) % 2) * px; xx < w; xx += 2 * px) g.fillRect(x + xx, y + yy, px, px);
  g.restore();
}

/** Type-on: the first n characters of s, where n grows with u. */
export const typed = (s: string, u: number) => s.slice(0, Math.floor(clamp(u) * s.length + 1e-6));
