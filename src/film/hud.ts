import { S } from '../core/time';
// Persistent overlays: the word counter, the era label, the year ruler.
import { F, font, text, clamp, inv, ease, mix, rgba, type G } from '../core/draw';
import { wordCountAt, RELEASES } from '../core/lexicon';
import { W, H } from '../core/time';
import { P, darkness } from './palette';
import { kickPulse } from '../core/film';

// bar -> calendar year (piecewise, snapping on release downbeats)
const YEAR_KEYS: [number, number][] = [
  [S.smp[0], 1979.85], [S.smp[1], 1981.45], [S.y1986[0] + 0.5, 1986.8], [S.v1[0], 1988.47], [S.next[0], 1988.9],
  [S.v2[0], 1991.04], [S.v3[0], 1996.67], [S.v4[0], 1999.38], [S.v4[0] + 1, 2002.0], [S.v5[0], 2004.8], [S.v6[0], 2007.33],
  [S.v7[0], 2008.88], [S.v8[0], 2010.87], [S.v9[0], 2012.9], [S.breakdown[0] + 0.5, 2013.87], [S.v10[0] + 0.5, 2014.52], [S.v10[0] + 4.85, 2015.5],
  [S.v11[0], 2016.6], [S.repos[0], 2017.3], [S.repos[0] + 0.75, 2018.45], [S.repos[0] + 1.25, 2019.45], [S.v12[0], 2019.29],
  [S.v123[0], 2020.2], [S.v123[0] + 0.9, 2021.38], [S.v132[0], 2022.95], [S.v132[0] + 1, 2023.2], [S.llm[0], 2023.49], [S.v14[0], 2024.03],
  [S.v14[0] + 1, 2025.6], [S.v15[0], 2026.46], [S.agents[0], 2026.6], [S.outro[0], 2026.75],
];
/** Year shown by the ruler marker: jumps to each key's year on its bar with an expo ease. */
export function markerYear(bar: number) {
  let prev = YEAR_KEYS[0]![1];
  for (const [b, y] of YEAR_KEYS) {
    if (bar < b) break;
    const u = ease.outExpo(inv(b, b + 0.4, bar));
    prev = prev + (y - prev) * u;
    if (u >= 1) prev = y;
  }
  return prev;
}

const Y0 = 1978, Y1 = 2027;
export function drawRuler(g: G, bar: number, alpha = 1) {
  if (alpha <= 0) return;
  const dk = darkness(bar);
  const col = mix('#1B1B1B', '#E8E4DA', dk);
  const soft = mix('#9A958C', '#5E6068', dk);
  const x0 = 96, x1 = W - 96, y = H - 54;
  const X = (yr: number) => x0 + ((yr - Y0) / (Y1 - Y0)) * (x1 - x0);
  g.save();
  g.globalAlpha = alpha;
  g.strokeStyle = soft; g.lineWidth = 1.5;
  g.beginPath(); g.moveTo(x0, y); g.lineTo(x1, y); g.stroke();
  for (let yr = 1980; yr <= 2025; yr += 5) {
    g.beginPath(); g.moveTo(X(yr), y - 6); g.lineTo(X(yr), y + 6); g.stroke();
    text(g, String(yr), X(yr), y + 26, { font: font(F.code, 15, 400), color: soft, align: 'center' });
  }
  const my = markerYear(bar);
  // filled progress
  g.strokeStyle = P.red; g.lineWidth = 3;
  g.beginPath(); g.moveTo(X(1979.85), y); g.lineTo(X(my), y); g.stroke();
  // release ticks
  const releaseYears: [number, string][] = [[1988.47, '1.0'], [1991.04, '2'], [1996.67, '3'], [1999.38, '4'], [2004.8, '5'], [2007.33, '6'], [2008.88, '7'], [2010.87, '8'], [2012.9, '9'], [2014.52, '10'], [2016.6, '11'], [2019.29, '12'], [2022.95, '13'], [2023.49, ''], [2024.03, '14'], [2026.46, '15']];
  for (const [yr, lab] of releaseYears) {
    if (yr > my + 0.01) continue;
    g.fillStyle = P.red;
    g.beginPath(); g.arc(X(yr), y, 4.5, 0, Math.PI * 2); g.fill();
    text(g, lab, X(yr), y - 14, { font: font(F.code, 14, 600), color: col, align: 'center', alpha: 0.85 });
  }
  // marker
  const p = kickPulse(bar, 10);
  g.fillStyle = P.red;
  g.beginPath(); g.arc(X(my), y, 8 + 3 * p, 0, Math.PI * 2); g.fill();
  g.restore();
}

export function drawCounter(g: G, bar: number, alpha = 1) {
  if (alpha <= 0) return;
  const dk = darkness(bar);
  const col = mix('#1B1B1B', '#EDE9E0', dk);
  const soft = mix('#7C776E', '#80828A', dk);
  const n = wordCountAt(bar);
  // flash when the count is moving
  const moving = RELEASES.some((r) => bar >= r.bar && bar < r.bar + 0.9);
  g.save();
  g.globalAlpha = alpha;
  const x = W - 96, y = 118;
  text(g, n.toLocaleString('en-US'), x, y, { font: font(F.sans, 88, 700), color: moving ? mix(col, P.red, 0.85) : col, align: 'right' });
  text(g, 'WORDS IN THE LANGUAGE', x, y + 34, { font: font(F.sans, 17, 600), color: soft, align: 'right', tracking: 3 });
  g.restore();
}

/** Era label, top-left: e.g. "Mathematica 1.0" / "June 23, 1988". */
export function drawEraLabel(g: G, bar: number, title: string, sub: string, since: number, alpha = 1) {
  const dk = darkness(bar);
  const col = mix('#1B1B1B', '#EDE9E0', dk);
  const soft = mix('#7C776E', '#8A8C93', dk);
  const u = ease.outExpo(inv(since, since + 0.3, bar));
  g.save();
  g.globalAlpha = alpha * u;
  const dy = (1 - u) * -18;
  text(g, sub.toUpperCase(), 96, 76 + dy, { font: font(F.sans, 18, 600), color: P.red, tracking: 3 });
  text(g, title, 96, 124 + dy, { font: font(F.sans, 46, 700), color: col });
  g.restore();
}
export { rgba, clamp };
