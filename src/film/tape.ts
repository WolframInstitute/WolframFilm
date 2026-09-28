// The Rule 30 tape: the automaton that writes the pluck melody, turned on its side and fed into Spikey.
// Each vertical slice is one row of CellularAutomaton[30] (centre ± HALF cells); time runs rightwards, and
// the centre row is the column the score reads, four cells per eighth note (three pitch bits, one gate bit).
// Spikey's edge is the read head: a group reaches it exactly when its note sounds.
import { F, font, text, clamp, inv, ease, mix, rgba, type G } from '../core/draw';
import { S, BARS } from '../core/time';
import { SCORE, pluckOn } from '../music/score';
import { tr } from '../core/i18n';
import { P, darkness } from './palette';

const HALF = 6, CELL = 8, PER_BAR = 32; // 4 cells per eighth note
const HEAD = 1790 - 78, CY = 930, LEN = 50 * CELL; // Spikey sits at (1790, 930), radius 46

// the automaton itself, same rule and start as the score's rule30Column
const N = BARS * PER_BAR + 64;
const ROWS: Uint8Array[] = (() => {
  const w = 2 * N + 3, c = N + 1;
  let row = new Uint8Array(w);
  row[c] = 1;
  const out: Uint8Array[] = [];
  for (let t = 0; t < N; t++) {
    out.push(row.slice(c - HALF, c + HALF + 1));
    const nx = new Uint8Array(w);
    for (let i = 1; i < w - 1; i++) nx[i] = row[i - 1]! ^ (row[i]! | row[i + 1]!);
    row = nx;
  }
  return out;
})();

// the notes the pluck actually played, by eighth
const NOTES = new Map<number, number>(SCORE.filter((e) => e.inst === 'pluck').map((e) => [Math.round(e.bar * 8), e.note!]));
const NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
const noteName = (m: number) => `${NAMES[m % 12]}${Math.floor(m / 12) - 1}`;

// shown while the Rule 30 line plays and Spikey is in its corner
const spikeyThere = (b: number) => b >= S.v1[0] && b < S.climax[0] && !(b >= S.families[0] && b < S.families[1]) && b < S.agents[0] - 0.1;
const SPANS: [number, number][] = (() => {
  const out: [number, number][] = [];
  let a: number | null = null;
  for (let k = 0; k <= BARS * 32; k++) {
    const b = k / 32, on = pluckOn(b) && spikeyThere(b);
    if (on && a === null) a = b;
    if (!on && a !== null) { out.push([a, b]); a = null; }
  }
  return out;
})();
const visible = (bar: number) => Math.max(0, ...SPANS.map(([a, b]) => ease.outCubic(inv(a, a + 0.25, bar)) * (1 - ease.inCubic(inv(b - 0.25, b, bar)))));

export function drawTape(g: G, bar: number) {
  const vis = visible(bar);
  if (vis <= 0) return;
  const dk = darkness(bar);
  const ink = mix(P.ink, P.bone, dk);
  const tNow = bar * PER_BAR;
  const top = CY - (HALF + 0.5) * CELL;
  g.save();
  g.globalAlpha = vis;
  // slices from the read head back into the future
  for (let t = Math.floor(tNow); t < tNow + LEN / CELL + 1 && t < N; t++) {
    const xr = HEAD - (t - tNow) * CELL, x = xr - CELL;
    if (xr <= HEAD - LEN) break;
    const fadeL = clamp((x - (HEAD - LEN)) / 90), fadeR = clamp((HEAD + CELL - xr) / CELL); // soft ends
    const a = fadeL * fadeR;
    if (a <= 0) continue;
    const row = ROWS[t]!;
    for (let k = 0; k <= 2 * HALF; k++) {
      if (k === HALF || !row[k]) continue;
      g.fillStyle = rgba(ink, 0.13 * a * (1 - Math.abs(k - HALF) / (HALF + 2)));
      g.fillRect(x + 1, top + k * CELL + 1, CELL - 2, CELL - 2);
    }
    // the centre column: pitch bits as squares, the gate bit (4th of each group) as a dot
    const bit = row[HALF]!, gate = t % 4 === 3, cy = top + HALF * CELL;
    const sounding = Math.floor(t / 4) === Math.floor(tNow / 4) && NOTES.has(Math.floor(t / 4));
    g.fillStyle = bit ? rgba(sounding ? P.redHot : P.red, (sounding ? 1 : 0.85) * a) : rgba(ink, 0.12 * a);
    if (gate) { g.beginPath(); g.arc(x + CELL / 2, cy + CELL / 2, bit ? 2.8 : 1.6, 0, 7); g.fill(); }
    else if (bit) g.fillRect(x + 0.5, cy + 0.5, CELL - 1, CELL - 1);
    else { g.strokeStyle = rgba(ink, 0.22 * a); g.lineWidth = 1; g.strokeRect(x + 1.5, cy + 1.5, CELL - 3, CELL - 3); }
  }
  // the group being read: bracket and the note it became
  const s = Math.floor(bar * 8), note = NOTES.get(s);
  if (note !== undefined) {
    const u = (bar * 8) % 1, glow = 1 - ease.outCubic(u);
    const xr = HEAD - (s * 4 - tNow) * CELL, x = xr - 4 * CELL, cy = top + HALF * CELL;
    g.strokeStyle = rgba(P.redHot, 0.35 + 0.55 * glow); g.lineWidth = 1.5;
    g.strokeRect(Math.max(x, HEAD - 4 * CELL) - 1.5, cy - 2.5, Math.min(xr, HEAD) - Math.max(x, HEAD - 4 * CELL) + 3, CELL + 5);
    text(g, noteName(note), HEAD - 2 * CELL, top - 8, { font: font(F.code, 15, 600), color: P.redHot, align: 'center', alpha: 0.4 + 0.6 * glow });
  }
  // read head
  g.fillStyle = rgba(P.red, 0.45); g.fillRect(HEAD, top - 2, 1.5, (2 * HALF + 1) * CELL + 4);
  // label
  text(g, tr('RULE 30 · CENTRE COLUMN'), HEAD - LEN + 4, top - 8, { font: font(F.sans, 11, 600), color: mix('#8B877F', '#7E8088', dk), tracking: 2, alpha: 0.9 });
  g.restore();
}
