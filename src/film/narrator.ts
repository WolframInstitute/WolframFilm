// The right-hand column: captions (the story) and dictionary entries (the evidence).
import { F, font, text, measure, clamp, inv, ease, mix, type G } from '../core/draw';
import { byName } from '../core/lexicon';
import usage from '../data/usage.json';
import usageRu from '../i18n/usage-ru.json';
import usageJa from '../i18n/usage-ja.json';
import { LANG, tr, words, isRed } from '../core/i18n';
import { img } from '../core/assets';
import { P, darkness } from './palette';

// usage lines: the documentation's own (Japanese from reference.wolfram.com/…/X.html.ja; Russian translated)
const USAGE = { ...(usage as Record<string, string>), ...(LANG === 'ru' ? usageRu : LANG === 'ja' ? usageJa : {}) } as Record<string, string>;

export const COL_X = 1250;
export const COL_W = 590;

/** Wrap text to a width; returns lines. */
export function wrap(g: G, s: string, f: string, w: number): string[] {
  const lines: string[] = [];
  let cur = '';
  g.save(); g.font = f;
  for (const wd of words(s.replace(/\s+/g, ' ').trim())) {
    const t = cur + wd;
    if (g.measureText(t.trimEnd()).width > w && cur) { lines.push(cur.trimEnd()); cur = wd; } else cur = t;
  }
  if (cur) lines.push(cur.trimEnd());
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
    for (const wd of words(ln)) {
      const a = ease.outExpo(inv(at + k * stagger, at + k * stagger + 0.2, bar));
      g.globalAlpha = a * (1 - leave);
      g.fillStyle = isRed(wd, o.redWords) ? P.red : col;
      g.fillText(wd, cx, y + li * size * 1.12 + (1 - a) * 22 - leave * 16);
      cx += g.measureText(wd).width; // words carry their own trailing space
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
  const pos = o.note ?? tr('symbol · since {0}, {1}', ver, year);
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

/** An archival photo or scan, pinned in the right column like a print, with a short caption. */
export function archive(g: G, bar: number, at: number, until: number, file: string, year: string, cap: string, o: { x?: number; y?: number; w?: number; h?: number; tilt?: number } = {}) {
  if (bar < at || bar >= until + 0.25) return;
  const im = img(file);
  if (!im) return;
  const x = o.x ?? COL_X, y = o.y ?? 150, maxW = o.w ?? COL_W, maxH = o.h ?? 420;
  const s = Math.min(maxW / im.width, maxH / im.height);
  const w = im.width * s, h = im.height * s;
  const u = ease.outBack(inv(at, at + 0.25, bar), 1.3), leave = ease.inCubic(inv(until, until + 0.25, bar));
  const dk = darkness(bar);
  g.save();
  g.globalAlpha = clamp(u) * (1 - leave);
  g.translate(x + w / 2, y + h / 2 + (1 - clamp(u)) * 40);
  g.rotate(((o.tilt ?? -1.5) * Math.PI) / 180 + (1 - clamp(u)) * 0.05);
  g.shadowColor = 'rgba(0,0,0,0.35)'; g.shadowBlur = 24; g.shadowOffsetY = 10;
  g.fillStyle = '#FBFAF6'; g.fillRect(-w / 2 - 12, -h / 2 - 12, w + 24, h + 58);
  g.shadowBlur = 0; g.shadowOffsetY = 0; g.shadowColor = 'transparent';
  g.drawImage(im, -w / 2, -h / 2, w, h);
  text(g, tr('FROM THE ARCHIVE · {0}', year), -w / 2, h / 2 + 22, { font: font(F.sans, 13, 700), color: P.red, tracking: 2 });
  text(g, cap, -w / 2, h / 2 + 40, { font: font(F.serif, 16, 400, true), color: '#3A3833' });
  g.restore();
  void dk;
}
