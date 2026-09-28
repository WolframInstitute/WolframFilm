// The lexicon wall: every word of the language, alphabetical like a dictionary, sized by
// how often it is actually used. Each word appears in place on the bar its version shipped.
import { F, font, makeCanvas, clamp, inv, ease, mix, rgba, hash01, type G } from '../core/draw';
import { WORDS, RELEASES, type Word } from '../core/lexicon';
import { W, H } from '../core/time';
import { P, darkness } from './palette';

export interface Placed { w: Word; x: number; y: number; size: number; width: number; appear: number }

const MARGIN_X = 36, MARGIN_Y = 30;
let placed: Placed[] | null = null;

const sizeOf = (w: Word, k: number) => {
  const s = clamp((Math.log10(Math.max(w.freq, 1e-9)) + 7.2) / 6.8);
  return k * (1 + 11 * Math.pow(s, 3.1));
};

function layout(k: number, g: G) {
  const words = [...WORDS].sort((a, b) => a.name.replace('$', '').localeCompare(b.name.replace('$', ''), 'en', { sensitivity: 'base' }));
  const out: Placed[] = [];
  let line: Placed[] = [];
  let x = MARGIN_X, y = MARGIN_Y;
  const maxW = W - 2 * MARGIN_X;
  const flush = (justify: boolean) => {
    if (!line.length) return;
    const lh = Math.max(...line.map((p) => p.size)) * 1.02;
    const used = line.reduce((s, p) => s + p.width, 0);
    const gaps = line.length - 1;
    const gap = justify && gaps > 0 ? (maxW - used) / gaps : k * 0.9;
    let cx = MARGIN_X;
    for (const p of line) { p.x = cx; p.y = y + lh * 0.8; cx += p.width + gap; }
    out.push(...line);
    y += lh;
    line = []; x = MARGIN_X;
  };
  for (const w of words) {
    const size = sizeOf(w, k);
    g.font = font(F.sans, size, 600);
    const width = g.measureText(w.name).width;
    const minGap = k * 0.9;
    if (x + width > MARGIN_X + maxW && line.length) flush(true);
    line.push({ w, x: 0, y: 0, size, width, appear: 0 });
    x += width + minGap;
  }
  flush(false);
  return { out, height: y + MARGIN_Y };
}

export function wall(): Placed[] {
  if (placed) return placed;
  const g = makeCanvas(8, 8).getContext('2d') as G;
  // fit the whole lexicon into one frame
  let lo = 2, hi = 12;
  for (let i = 0; i < 18; i++) { const m = (lo + hi) / 2; if (layout(m, g).height > H) hi = m; else lo = m; }
  const { out } = layout(lo, g);
  // appearance times: each release's words arrive over ~1.5 bars, most-used first, on 16ths
  for (const r of RELEASES) {
    const n = r.words.length;
    const rank = new Map(r.words.map((w, i) => [w.name, i]));
    for (const p of out) {
      const i = rank.get(p.w.name);
      if (i === undefined) continue;
      const d = 1.5 * Math.pow(i / Math.max(1, n - 1), 0.6);
      p.appear = r.bar + Math.round(d * 16) / 16;
    }
  }
  placed = out;
  return out;
}

/**
 * Draw the wall. `presence` 0..1 scales how visible the settled words are (a faint texture behind
 * the window, or the full wall at the climax). New words flash red, then settle.
 */
type WallOpts = { dimBefore?: number; emph?: (name: string) => boolean; emphU?: number; fade?: number; only?: boolean };

function drawWord(g: G, p: Placed, age: number, presence: number, dk: number, opts: WallOpts, st: { font: string }) {
  const settled = mix('#B9B3A7', '#3A3D44', dk);
  const settledStrong = mix('#2A2825', '#D8D4CB', dk);
  const pop = ease.outBack(inv(0, 0.18, age), 2.2);
  const heat = Number.isFinite(age) ? Math.exp(-age * 1.6) : 0;
  const baseA = 0.18 + 0.82 * presence;
  let a = baseA * pop;
  if (opts.dimBefore !== undefined && p.appear < opts.dimBefore) a *= 0.55;
  let col = heat > 0.02 ? mix(presence > 0.5 ? settledStrong : settled, P.red, heat) : presence > 0.5 ? settledStrong : settled;
  if (opts.emph && (opts.emphU ?? 0) > 0) {
    const on = opts.emph(p.w.name);
    const eu = opts.emphU!;
    if (on) { col = mix(col, P.redHot, eu); a = a + (1 - a) * eu; }
    else a *= 1 - 0.7 * eu;
  }
  if (opts.fade !== undefined) a *= opts.fade;
  const s = p.size * (0.6 + 0.4 * pop) * (1 + 0.25 * heat);
  const f = font(F.sans, Math.round(s * 4) / 4, 600);
  if (f !== st.font) { g.font = f; st.font = f; }
  g.globalAlpha = clamp(a + heat * 0.9);
  g.fillStyle = col;
  const dx = (p.width * (1 - s / p.size)) / 2;
  g.fillText(p.w.name, p.x + dx, p.y);
}

// Settled words (arrived more than SETTLE bars ago) live in a bitmap, rebuilt at most every half bar.
const SETTLE = 4;
const layer: { key: string; c: any } = { key: '', c: null };

/**
 * Draw the wall. `presence` 0..1 scales how visible the settled words are (a faint texture behind
 * the window, or the full wall at the climax). New words flash red, then settle.
 */
export function drawWall(g: G, bar: number, presence: number, opts: WallOpts = {}) {
  const ws = wall();
  const dk = darkness(bar);
  const tr = g.getTransform();
  const cacheable = !opts.only && !opts.emph && opts.fade === undefined && opts.dimBefore === undefined
    && Math.abs(tr.a - 1) < 1e-6 && Math.abs(tr.d - 1) < 1e-6 && tr.b === 0 && tr.c === 0;
  g.save();
  g.textBaseline = 'alphabetic';
  const st = { font: '' };
  if (!cacheable) {
    for (const p of ws) {
      if (bar < p.appear) continue;
      if (opts.only && !opts.emph!(p.w.name)) continue;
      drawWord(g, p, bar - p.appear, presence, dk, opts, st);
    }
    g.restore();
    return;
  }
  const cutoff = Math.floor((bar - SETTLE) * 2) / 2;
  const key = `${cutoff}|${dk.toFixed(4)}|${presence.toFixed(4)}`;
  if (layer.key !== key) {
    layer.c ??= makeCanvas(W, H);
    const lg = layer.c.getContext('2d') as G;
    lg.setTransform(1, 0, 0, 1, 0, 0);
    lg.clearRect(0, 0, W, H);
    lg.textBaseline = 'alphabetic';
    const lst = { font: '' };
    for (const p of ws) if (p.appear <= cutoff) drawWord(lg, p, Infinity, presence, dk, {}, lst);
    layer.key = key;
  }
  g.drawImage(layer.c, 0, 0);
  for (const p of ws) {
    if (p.appear <= cutoff || bar < p.appear) continue;
    drawWord(g, p, bar - p.appear, presence, dk, opts, st);
  }
  g.restore();
}

/** Words that pop out of a point (e.g. an output cell) and fly to their place on the wall. */
export function drawFlight(g: G, bar: number, from: { x: number; y: number }, releaseKey: string, max = 90) {
  const r = RELEASES.find((r) => r.key === releaseKey)!;
  const ws = wall();
  const byName = new Map(ws.map((p) => [p.w.name, p]));
  g.save();
  for (let i = 0; i < Math.min(max, r.words.length); i++) {
    const p = byName.get(r.words[i]!.name);
    if (!p) continue;
    const t0 = p.appear - 0.35;
    const u = inv(t0, p.appear, bar);
    if (u <= 0 || u >= 1) continue;
    const e = ease.inOutCubic(u);
    const arcH = -120 - 200 * hash01(p.w.name);
    const x = from.x + (p.x - from.x) * e;
    const y = from.y + (p.y - from.y) * e + arcH * Math.sin(Math.PI * e);
    const s = 14 + (p.size - 14) * e;
    g.globalAlpha = Math.sin(Math.PI * Math.min(1, u * 1.2)) * 0.95;
    g.fillStyle = COLOR_WORDS[p.w.name] ?? P.red;
    g.font = font(F.sans, s, 700);
    g.fillText(p.w.name, x, y);
  }
  g.restore();
}
const COLOR_WORDS: Record<string, string> = {
  Red: '#FF0000', Green: '#00B000', Blue: '#0000FF', Orange: '#FF8000', Purple: '#800080', Yellow: '#E6C800', Gray: '#808080',
  Black: '#000000', White: '#FFFFFF', Brown: '#996633', Cyan: '#00C8C8', Magenta: '#FF00FF', Pink: '#FF8080',
  LightBlue: '#8CC8FF', LightGray: '#BFBFBF', LightRed: '#FF8C8C', LightGreen: '#8CFF8C', LightYellow: '#FFFF8C',
};
export { rgba };
