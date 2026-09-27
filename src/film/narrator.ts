// The right-hand column: captions (the story) and dictionary entries (the evidence).
import { F, font, text, measure, clamp, inv, ease, mix, type G } from '../core/draw';
import { byName } from '../core/lexicon';
import usage from '../data/usage.json';
import { P, darkness } from './palette';

const USAGE = usage as Record<string, string>;

export const COL_X = 1250;
export const COL_W = 590;

/** Wrap text to a width; returns lines. */
export function wrap(g: G, s: string, f: string, w: number): string[] {
  const words = s.split(/\s+/);
  const lines: string[] = [];
  let cur = '';
  g.save(); g.font = f;
  for (const wd of words) {
    const t = cur ? cur + ' ' + wd : wd;
    if (g.measureText(t).width > w && cur) { lines.push(cur); cur = wd; } else cur = t;
  }
  if (cur) lines.push(cur);
  g.restore();
  return lines;
}

/**
 * A caption that arrives word by word on 16ths starting at `at`, holds, and leaves at `until`.
 * Big type; the last line can be emphasised in red.
 */
export function caption(g: G, bar: number, at: number, until: number, s: string, o: { x?: number; y?: number; w?: number; size?: number; weight?: number; color?: string; stagger?: number; redWords?: string[] } = {}) {
  if (bar < at || bar >= until + 0.25) return 0;
  const x = o.x ?? COL_X, y = o.y ?? 640, w = o.w ?? COL_W, size = o.size ?? 52, weight = o.weight ?? 600;
  const f = font(F.sans, size, weight);
  const lines = wrap(g, s, f, w);
  const dk = darkness(bar);
  const col = o.color ?? mix(P.ink, P.bone, dk);
  const stagger = o.stagger ?? 1 / 16;
  const leave = ease.inCubic(inv(until, until + 0.25, bar));
  let k = 0;
  g.save();
  g.font = f;
  lines.forEach((ln, li) => {
    let cx = x;
    for (const wd of ln.split(' ')) {
      const a = ease.outExpo(inv(at + k * stagger, at + k * stagger + 0.2, bar));
      const red = o.redWords?.some((r) => wd.replace(/[.,:!?]/g, '') === r);
      g.globalAlpha = a * (1 - leave);
      g.fillStyle = red ? P.red : col;
      g.fillText(wd, cx, y + li * size * 1.12 + (1 - a) * 22 - leave * 16);
      cx += g.measureText(wd + ' ').width;
      k++;
    }
  });
  g.restore();
  return lines.length * size * 1.12;
}

/**
 * Dictionary entry for a word of the language: headword, "part of speech" line with the version
 * that coined it, and its real usage line from the documentation.
 */
export function entry(g: G, bar: number, at: number, until: number, name: string, o: { x?: number; y?: number; w?: number; note?: string; usage?: string } = {}) {
  if (bar < at || bar >= until + 0.25) return;
  const x = o.x ?? COL_X, y = o.y ?? 250, w = o.w ?? COL_W;
  const word = byName.get(name);
  const dk = darkness(bar);
  const col = mix(P.ink, P.bone, dk);
  const soft = mix('#6B675F', '#9A9CA3', dk);
  const u = ease.outExpo(inv(at, at + 0.3, bar));
  const leave = ease.inCubic(inv(until, until + 0.25, bar));
  g.save();
  g.globalAlpha = u * (1 - leave);
  const dy = (1 - u) * 26;
  // rule
  g.fillStyle = P.red;
  g.fillRect(x, y - 70 + dy, 64 * u, 5);
  // headword
  const hf = font(F.sans, 70, 700);
  let hs = 70;
  while (measure(g, name, font(F.sans, hs, 700)) > w && hs > 30) hs -= 2;
  text(g, name, x, y + dy, { font: font(F.sans, hs, 700), color: col });
  // pos line
  const ver = word ? (word.ver.includes('.') ? word.ver : `${word.ver}.0`) : '';
  const year = word?.date.slice(0, 4) ?? '';
  const pos = o.note ?? `symbol · since ${ver}, ${year}`;
  text(g, pos, x + 2, y + 46 + dy, { font: font(F.serif, 30, 400, true), color: soft });
  // definition (real usage text, first sentence)
  let def = o.usage ?? USAGE[name] ?? '';
  def = def.replace(//g, '→').replace(/\s+/g, ' ').trim();
  const df = font(F.serif, 30, 400);
  const lines = wrap(g, def, df, w).slice(0, 5);
  const lu = inv(at + 0.15, at + 0.6, bar);
  lines.forEach((ln, i) => {
    const a = clamp(lu * lines.length - i);
    text(g, ln, x + 2, y + 110 + i * 42 + dy, { font: df, color: col, alpha: a });
  });
  g.restore();
  void hf;
}
