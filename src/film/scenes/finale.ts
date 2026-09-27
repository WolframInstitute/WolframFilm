// 60–68 climax over the full lexicon wall; 68–75 outro.
import type { Ctx } from '../../core/film';
import { kickPulse } from '../../core/film';
import { F, font, text, measure, clamp, inv, ease, mix, rgba, type G } from '../../core/draw';
import { W, H, S } from '../../core/time';
const C = S.climax[0], O = S.outro[0];
import { P, darkness } from '../palette';
import { drawWall } from '../wall';
import { RELEASES, TOTAL_WORDS, byName } from '../../core/lexicon';
import { renderScreen } from '../../ui/screen';
import { chrome } from '../../ui/chrome';
import { drawNotebook, NB } from '../../ui/notebook';

const YEARS: Record<string, number> = {
  v1: 1988.47, v2: 1991.04, v3: 1996.67, v4: 1999.38, v5: 2003.45, v6: 2007.33, v7: 2008.88, v8: 2010.87, v9: 2012.9,
  v10: 2014.52, v11: 2016.6, v12: 2019.29, v13: 2021.95, v133: 2023.49, v14: 2024.03, v15: 2026.46,
};

function panel(g: G, x: number, y: number, w: number, h: number, a: number) {
  g.save();
  g.globalAlpha = a;
  g.fillStyle = rgba(P.ink, 0.86);
  g.beginPath(); g.roundRect(x, y, w, h, 6); g.fill();
  g.restore();
}

/** A statement card: big line + optional small line, left-aligned in a dark panel. */
function statement(g: G, bar: number, at: number, until: number, big: string, small?: string, red?: string) {
  const u = ease.outExpo(inv(at, at + 0.2, bar));
  const out = ease.inCubic(inv(until - 0.15, until, bar));
  if (u <= 0 || out >= 1) return;
  const x = 110, y = 300;
  const fb = font(F.sans, 96, 800), fs = font(F.sans, 40, 400);
  const bw = measure(g, big, fb);
  const sw = small ? measure(g, small, fs) : 0;
  const w = Math.max(bw, sw) + 80, h = small ? 250 : 180;
  panel(g, x - 40, y - 120 - (1 - u) * 20, w, h, (1 - out) * u);
  g.save();
  g.globalAlpha = u * (1 - out);
  // big line, with one red token
  let cx = x;
  g.font = fb;
  for (const wd of big.split(' ')) {
    g.fillStyle = red && wd.replace(/[.,:]/g, '') === red ? P.redHot : P.bone;
    g.fillText(wd, cx, y - (1 - u) * 20);
    cx += g.measureText(wd + ' ').width;
  }
  if (small) text(g, small, x + 2, y + 70 - (1 - u) * 20, { font: fs, color: '#B9BBC2' });
  g.restore();
}

/** Which words the climax statements point at (drawn by the wall scene, inside its camera). */
export function climaxEmph(bar: number): { emph?: (n: string) => boolean; emphU: number } {
  if (bar >= C + 2 && bar < C + 4) return { emph: (n) => ['List', 'Rule', 'Times', 'Power', 'Set'].includes(n), emphU: ease.outCubic(inv(C + 2, C + 2.3, bar)) * (1 - inv(C + 3.8, C + 4, bar)) };
  if (bar >= C + 4 && bar < C + 6) return { emph: (n) => n.length >= 24, emphU: ease.outCubic(inv(C + 4.1, C + 4.4, bar)) * (1 - inv(C + 5.8, C + 6, bar)) };
  if (bar >= C + 6 && bar < C + 7) return { emph: (n) => n.endsWith('Q'), emphU: ease.outCubic(inv(C + 6, C + 6.3, bar)) * (1 - inv(C + 6.9, C + 7, bar)) };
  if (bar >= C + 7 && bar < C + 8) return { emph: (n) => EPONYMS.has(n), emphU: ease.outCubic(inv(C + 7, C + 7.2, bar)) * (1 - inv(C + 7.9, C + 8, bar)) };
  return { emphU: 0 };
}

export function climax(c: Ctx) {
  const { g, bar } = c;
  // growth curve across the frame
  const X = (yr: number) => 120 + ((yr - 1986) / (2028 - 1986)) * (W - 240);
  const Y = (n: number) => H - 120 - (n / TOTAL_WORDS) * (H - 300);
  let cum = 0;
  const pts = RELEASES.map((r) => { cum += r.words.length; return { x: X(YEARS[r.key]!), y: Y(cum), label: r.label, n: cum, at: C + RELEASES.indexOf(r) / 8 }; });
  g.save();
  const fadeCurve = 1 - ease.inCubic(inv(C + 1.8, C + 2.2, bar)) * 0.81;
  g.globalAlpha = fadeCurve;
  g.lineWidth = 6; g.strokeStyle = P.redHot; g.lineJoin = 'round';
  g.shadowColor = rgba(P.red, 0.6); g.shadowBlur = 18;
  g.beginPath();
  g.moveTo(X(1986), Y(0));
  let last = { x: X(1986), y: Y(0) };
  for (const p of pts) {
    const u = ease.outCubic(inv(p.at - 1 / 8, p.at, bar));
    if (u <= 0) break;
    const x = last.x + (p.x - last.x) * u, y = last.y + (p.y - last.y) * u;
    g.lineTo(x, y);
    last = { x: p.x, y: p.y };
    if (u < 1) break;
  }
  g.stroke();
  g.shadowBlur = 0;
  for (const p of pts) {
    const u = ease.outBack(inv(p.at, p.at + 0.08, bar), 3);
    if (u <= 0) continue;
    g.fillStyle = P.bone;
    g.beginPath(); g.arc(p.x, p.y, 7 * u, 0, 7); g.fill();
    text(g, p.label, p.x, p.y - 18, { font: font(F.code, 20, 600), color: P.bone, align: 'center', alpha: clamp(u) });
  }
  g.restore();
  // statements
  statement(g, bar, C + 0.05, C + 1.95, `${TOTAL_WORDS.toLocaleString('en-US')} words.`, 'There were 554 in 1988.', undefined);
  statement(g, bar, C + 2, C + 3.95, 'Its most common word: List.', 'In English it’s “the”.', 'List');
  statement(g, bar, C + 4, C + 5.95, 'Its words grew longer.', 'An average new word: 8.1 letters in 1988, 15.4 in 2026.');
  statement(g, bar, C + 6, C + 6.97, '219 words ask a question.', 'EvenQ, PrimeQ, StringQ… the Q makes it a question.', '219');
  statement(g, bar, C + 7, C + 8, '634 carry a person’s name.', 'Fourier, Bessel, Gauss, Euler…', '634');
}

const EPONYMS = new Set([...byName.values()].filter((w) => w.eponym).map((w) => w.name));

// ---------------------------------------------------------------- outro
export function outro(c: Ctx) {
  const { g, bar } = c;
  // the wall falls away
  const fall = ease.inCubic(inv(O, O + 1.2, bar));
  if (fall < 1) {
    g.save();
    g.translate(0, fall * 300);
    drawWall(g, O, 1, { fade: 1 - fall });
    g.restore();
  }
  // a fresh notebook
  const u = ease.outBack(inv(O + 1.4, O + 1.75, bar), 1.3);
  if (u > 0) {
    const w = 1240, h = 360;
    const R = { x: (W - w) / 2, y: 190, w, h };
    g.save();
    const s = 0.9 + 0.1 * u;
    g.translate(W / 2, R.y + h / 2); g.scale(s, s); g.translate(-W / 2, -(R.y + h / 2));
    g.globalAlpha = clamp(u);
    g.shadowColor = 'rgba(0,0,0,0.25)'; g.shadowBlur = 40; g.shadowOffsetY = 16;
    g.fillStyle = '#FFF'; g.beginPath(); g.roundRect(R.x, R.y, R.w, R.h, 11); g.fill();
    g.shadowBlur = 0;
    renderScreen(g, R, 1.6, 'full', (sg, lw, lh) => {
      sg.fillStyle = '#FFF'; sg.fillRect(0, 0, lw, lh);
      const tb = 28;
      sg.fillStyle = '#F6F6F6'; sg.fillRect(0, 0, lw, tb); sg.fillStyle = '#E2E2E2'; sg.fillRect(0, tb, lw, 1);
      ['#FF6159', '#FFBD2E', '#28C941'].forEach((cl, i) => { sg.fillStyle = cl; sg.beginPath(); sg.arc(20 + i * 20, tb / 2, 6.5, 0, 7); sg.fill(); });
      text(sg, 'Untitled-2.nb', lw / 2, 19, { font: font(F.arimo, 13, 700), color: '#333', align: 'center' });
      drawNotebook(sg, { x: 0, y: tb + 1, w: lw, h: lh - tb - 1 }, NB.v13, [{ kind: 'input', at: O + 1.6, n: 1, text: '', type: 0 }], bar);
      // blinking caret
      if (Math.floor(bar * 4) % 2 === 0) { sg.fillStyle = '#000'; sg.fillRect(NB.v13.left + 2, tb + 20, 2, 20); }
    });
    g.restore();
  }
  // lines
  const col = mix(P.ink, P.bone, darkness(bar));
  const a1 = ease.outExpo(inv(O + 2.25, O + 2.5, bar));
  text(g, `${TOTAL_WORDS.toLocaleString('en-US')} words.`, W / 2, 700, { font: font(F.sans, 76, 800), color: col, align: 'center', alpha: a1 * (1 - inv(O + 6.3, O + 6.9, bar)) });
  const a2 = ease.outExpo(inv(O + 3, O + 3.25, bar));
  text(g, 'Still growing.', W / 2, 790, { font: font(F.sans, 76, 300), color: P.red, align: 'center', alpha: a2 * (1 - inv(O + 6.3, O + 6.9, bar)) });
  const a3 = ease.outCubic(inv(O + 4.25, O + 4.75, bar));
  text(g, 'THE WOLFRAM LANGUAGE  ·  1988 – 2026', W / 2, 930, { font: font(F.sans, 26, 600), color: '#8B877F', align: 'center', tracking: 6, alpha: a3 * (1 - inv(O + 6.3, O + 6.9, bar)) });
  // fade to black
  const f = inv(O + 6.4, O + 7, bar);
  if (f > 0) { g.fillStyle = rgba('#000000', f); g.fillRect(0, 0, W, H); }
  void kickPulse;
}
