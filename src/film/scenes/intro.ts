// Bars 0–12: cold open, SMP terminal, 1986, the name.
import type { Ctx } from '../../core/film';
import { kickPulse } from '../../core/film';
import { F, font, text, measure, clamp, inv, ease, typed, rgba, mix, hash01, type G } from '../../core/draw';
import { W, H } from '../../core/time';
import { P } from '../palette';

const cursorOn = (bar: number) => Math.floor(bar * 4) % 2 === 0; // blink on 8ths

// ---------------------------------------------------------------- 0–4 cold open
export function coldOpen(c: Ctx) {
  const { g, bar } = c;
  g.fillStyle = '#050506'; g.fillRect(0, 0, W, H);
  const line = 'Every language starts with a few words.';
  const u = inv(0.5, 2.6, bar);
  const shown = typed(line, u);
  const f = font(F.code, 64, 400);
  const full = measure(g, line, f);
  const x = (W - full) / 2, y = H / 2 + 14;
  // collapse into the cursor at the end
  const k = ease.inExpo(inv(3.55, 4, bar));
  g.save();
  g.translate(x + full, y);
  g.scale(1 - k, 1 - k * 0.2);
  g.translate(-(x + full), -y);
  const w = text(g, shown, x, y, { font: f, color: '#E9E6DF' });
  // the last word lights up
  if (bar > 2.8) {
    const wx = x + measure(g, 'Every language starts with a few ', f);
    const a = ease.outCubic(inv(2.8, 3.1, bar));
    text(g, 'words', wx, y, { font: f, color: mix('#E9E6DF', P.redHot, a) });
  }
  g.restore();
  // cursor
  const cx = x + w * (1 - k) + 6;
  if (cursorOn(bar) || (u > 0 && u < 1)) {
    g.fillStyle = P.redHot;
    g.fillRect(cx, y - 52, 30, 64);
  }
}

// ---------------------------------------------------------------- 4–8 SMP, green phosphor
const SMP_LINES: { at: number; s: string; out?: boolean; dim?: boolean }[] = [
  { at: 4.1, s: '#I[1]::  Ex[(a + b)^3]' },
  { at: 4.6, s: '#O[1]:   a^3 + 3 a^2 b + 3 a b^2 + b^3', out: true },
  { at: 4.9, s: '#I[2]::  Plot[Sin[$x] Exp[-$x/8], {$x, 0, 20}]' },
];
/** A line-printer plot of sin(x) e^(-x/8), 0 ≤ x ≤ 20, drawn with characters. */
const ASCII_PLOT: string[] = (() => {
  const W = 56, Hh = 13, rows: string[][] = Array.from({ length: Hh }, () => Array(W).fill(' '));
  const mid = Math.floor(Hh / 2);
  for (let c = 0; c < W; c++) rows[mid]![c] = '-';
  for (let r = 0; r < Hh; r++) rows[r]![0] = '|';
  for (let c = 0; c < W; c++) {
    const x = (c / (W - 1)) * 20, y = Math.sin(x) * Math.exp(-x / 8);
    const r = Math.round(mid - y * mid);
    rows[Math.max(0, Math.min(Hh - 1, r))]![c] = '*';
  }
  return rows.map((r) => r.join(''));
})();
export function smp(c: Ctx) {
  const { g, bar } = c;
  // bezel
  g.fillStyle = '#0B0C0B'; g.fillRect(0, 0, W, H);
  const sx = 150, sy = 70, sw = W - 300, sh = H - 190;
  // power-on: vertical line opens to the full screen
  const on = ease.outExpo(inv(4, 4.18, bar));
  // power-off at the end: collapse to a line, then a dot
  const off1 = ease.inCubic(inv(7.72, 7.9, bar)), off2 = ease.inCubic(inv(7.9, 8, bar));
  const vs = on * (1 - off1 * 0.995);
  const hs = 1 - off2 * 0.998;
  g.save();
  g.translate(W / 2, sy + sh / 2);
  g.scale(hs, Math.max(0.002, vs));
  g.translate(-W / 2, -(sy + sh / 2));
  // screen
  const grd = g.createRadialGradient(W / 2, sy + sh / 2, 50, W / 2, sy + sh / 2, sw * 0.62);
  grd.addColorStop(0, '#0B1A0F'); grd.addColorStop(1, '#040805');
  g.fillStyle = grd;
  g.beginPath(); g.roundRect(sx, sy, sw, sh, 38); g.fill();
  g.save();
  g.beginPath(); g.roundRect(sx, sy, sw, sh, 38); g.clip();
  const phosphor = '#6BFF8E';
  const tf = font(F.term, 46, 400);
  let y = sy + 90;
  const x0 = sx + 90;
  g.shadowColor = rgba('#39FF6A', 0.85);
  g.shadowBlur = 16;
  for (const L of SMP_LINES) {
    if (bar < L.at) break;
    const u = L.out ? 1 : inv(L.at, L.at + 0.4, bar);
    text(g, typed(L.s, u), x0, y, { font: tf, color: L.out ? mix(phosphor, '#C9FFD6', 0.3) : phosphor });
    y += L.out ? 62 : 52;
  }
  // the plot, printed row by row
  const tfp = font(F.term, 30, 400);
  ASCII_PLOT.forEach((row, i) => {
    const at = 5.3 + i * 0.07;
    if (bar < at) return;
    text(g, row, x0 + 40, y + i * 26, { font: tfp, color: mix(phosphor, '#C9FFD6', 0.25) });
  });
  if (bar >= 5.3) y += ASCII_PLOT.length * 26 + 20;
  // caption, typed like program output
  const cap1 = 'NOVEMBER 1979. CALTECH.';
  const cap2 = 'A 20-YEAR-OLD PHYSICIST WRITES A LANGUAGE';
  const cap3 = 'FOR TALKING TO HIS COMPUTER: SMP.';
  const cy = sy + sh - 150;
  text(g, typed(cap1, inv(6.5, 6.8, bar)), x0, cy, { font: font(F.term, 44), color: '#B8FFC8' });
  text(g, typed(cap2, inv(6.8, 7.25, bar)), x0, cy + 52, { font: font(F.term, 58), color: '#E6FFEC' });
  text(g, typed(cap3, inv(7.2, 7.55, bar)), x0, cy + 110, { font: font(F.term, 58), color: '#E6FFEC' });
  g.shadowBlur = 0; g.shadowOffsetY = 0; g.shadowColor = 'transparent';
  // cursor
  if (cursorOn(bar)) { g.fillStyle = phosphor; g.fillRect(x0, y - 40, 26, 46); }
  // scanlines + flicker
  g.globalAlpha = 0.16;
  g.fillStyle = '#000';
  for (let yy = sy; yy < sy + sh; yy += 4) g.fillRect(sx, yy, sw, 2);
  g.globalAlpha = 0.05 + 0.03 * hash01(Math.floor(bar * 60));
  g.fillStyle = '#9CFFB4'; g.fillRect(sx, sy, sw, sh);
  g.restore();
  // glass highlight
  const hl = g.createLinearGradient(sx, sy, sx + sw * 0.4, sy + sh * 0.5);
  hl.addColorStop(0, 'rgba(255,255,255,0.07)'); hl.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = hl; g.beginPath(); g.roundRect(sx, sy, sw, sh, 38); g.fill();
  g.restore();
  // the dot after power-off
  if (bar > 7.9) {
    const a = 1 - inv(7.95, 8, bar);
    g.fillStyle = rgba('#DFFFE6', a);
    g.beginPath(); g.arc(W / 2, sy + sh / 2, 6, 0, Math.PI * 2); g.fill();
  }
}

// ---------------------------------------------------------------- 8–12 1986 + the name
export function y1986(c: Ctx) {
  const { g, bar } = c;
  const fade = ease.outCubic(inv(8, 8.4, bar));
  g.fillStyle = mix('#050506', P.paper, fade); g.fillRect(0, 0, W, H);
  const col = P.ink;
  // big year
  const yu = ease.outExpo(inv(8.05, 8.4, bar));
  const nameU = inv(10, 12, bar);
  const out = ease.inExpo(inv(9.75, 10, bar));
  if (bar < 10) {
    g.save();
    g.globalAlpha = yu * (1 - out);
    text(g, '1986', 160, 470 - (1 - yu) * 40, { font: font(F.sans, 220, 700), color: P.red });
    text(g, typed('He starts again, from nothing.', inv(8.35, 8.9, bar)), 170, 580, { font: font(F.sans, 60, 600), color: col });
    text(g, typed('A language for everything.', inv(8.95, 9.45, bar)), 170, 660, { font: font(F.sans, 60, 300), color: col });
    g.restore();
  }
  if (bar >= 9.9) nameScene(g, bar);
}

function nameScene(g: G, bar: number) {
  const word = 'Mathematica';
  const f = font(F.sans, 170, 700);
  const full = measure(g, word, f, -2);
  const x = (W - full) / 2, y = H / 2 + 40;
  // letters on 8ths from bar 10.
  const n = clamp(Math.floor((bar - 10) * 8) + 1, 0, word.length);
  const squeeze = ease.inExpo(inv(11.6, 12, bar)); // everything collapses into the drop
  g.save();
  g.translate(W / 2, y - 60);
  g.scale(1 - squeeze * 0.92, 1 - squeeze * 0.92);
  g.translate(-W / 2, -(y - 60));
  let cx = x;
  g.font = f;
  for (let i = 0; i < n; i++) {
    const ch = word[i]!;
    const age = bar - (10 + i / 8);
    const pop = ease.outBack(inv(0, 0.12, age), 2);
    g.save();
    g.translate(cx, y);
    g.scale(1, pop);
    g.fillStyle = i === n - 1 && age < 0.1 ? P.red : P.ink;
    g.fillText(ch, 0, 0);
    g.restore();
    cx += g.measureText(ch).width - 2;
  }
  if (n < word.length || Math.floor(bar * 4) % 2 === 0) { g.fillStyle = P.red; g.fillRect(cx + 8, y - 125, 10, 150); }
  // attribution line
  const a = ease.outCubic(inv(10.9, 11.2, bar));
  g.globalAlpha = a;
  text(g, 'The name? Steve Jobs suggested it.', W / 2, y + 110, { font: font(F.sans, 48, 400, true), color: '#55524C', align: 'center' });
  g.restore();
}
