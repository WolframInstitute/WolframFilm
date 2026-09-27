// Short set pieces: the grammar tree, the breakdown lines, the Wolfram Language title card.
import type { Ctx } from '../../core/film';
import { kickPulse } from '../../core/film';
import { F, font, text, measure, clamp, inv, ease, mix, rgba } from '../../core/draw';
import { W, H } from '../../core/time';
import { P, darkness } from '../palette';
import { COL_X } from '../narrator';

// ---------------------------------------------------------------- 18–20: f[x] as a tree
export function grammarTree(c: Ctx) {
  const { g, bar } = c;
  const col = mix(P.ink, P.bone, darkness(bar));
  type N = { s: string; x: number; y: number; kids: N[]; at: number; head?: boolean };
  const x0 = COL_X + 40, y0 = 250;
  const tree: N = {
    s: 'List', x: x0 + 250, y: y0, at: 18.7, head: true, kids: [
      { s: 'Rule', x: x0 + 110, y: y0 + 130, at: 18.95, head: true, kids: [
        { s: 'x', x: x0 + 40, y: y0 + 260, at: 19.2, kids: [] },
        { s: '1', x: x0 + 180, y: y0 + 260, at: 19.25, kids: [] },
      ] },
      { s: 'f', x: x0 + 390, y: y0 + 130, at: 19.0, head: true, kids: [
        { s: 'y', x: x0 + 390, y: y0 + 260, at: 19.3, kids: [] },
      ] },
    ],
  };
  const leave = ease.inCubic(inv(19.85, 20, bar));
  g.save();
  g.globalAlpha = 1 - leave;
  const draw = (n: N, parent?: N) => {
    const u = ease.outBack(inv(n.at, n.at + 0.15, bar), 2);
    if (u <= 0) return;
    if (parent) {
      g.strokeStyle = rgba(col, 0.5); g.lineWidth = 2;
      const e = ease.outCubic(inv(n.at - 0.05, n.at + 0.1, bar));
      g.beginPath(); g.moveTo(parent.x, parent.y + 18); g.lineTo(parent.x + (n.x - parent.x) * e, parent.y + 18 + (n.y - 34 - parent.y - 18) * e); g.stroke();
    }
    g.save(); g.translate(n.x, n.y); g.scale(u, u);
    text(g, n.s, 0, 0, { font: font(F.code, n.head ? 40 : 38, n.head ? 600 : 400), color: n.head ? P.red : col, align: 'center' });
    g.restore();
    n.kids.forEach((k) => draw(k, n));
  };
  draw(tree);
  g.restore();
}

// ---------------------------------------------------------------- 35–37: breakdown lines
export function breakdownText(c: Ctx) {
  const { g, bar } = c;
  const col = mix(P.ink, P.bone, darkness(bar));
  const a1 = ease.outExpo(inv(35.1, 35.4, bar)) * (1 - ease.inCubic(inv(35.85, 36, bar)));
  const a2 = ease.outExpo(inv(36.0, 36.25, bar)) * (1 - ease.inExpo(inv(36.8, 36.97, bar)));
  g.fillStyle = rgba(mix(P.paper, P.ink, darkness(bar)), 0.78 * ease.outCubic(inv(35.05, 35.3, bar)));
  g.fillRect(0, 0, W, H);
  g.save();
  g.globalAlpha = a1;
  text(g, 'It isn’t only for math anymore.', W / 2, H / 2 + 20, { font: font(F.sans, 84, 700), color: col, align: 'center' });
  g.globalAlpha = a2;
  const s = 1 + 0.08 * ease.inOutCubic(inv(36, 36.9, bar));
  g.translate(W / 2, H / 2); g.scale(s, s);
  text(g, 'It needs a name.', 0, 30, { font: font(F.sans, 110, 700), color: P.red, align: 'center' });
  g.restore();
}

// ---------------------------------------------------------------- 37–39: the name
export function wlTitle(c: Ctx) {
  const { g, bar } = c;
  if (bar >= 38.5) return;
  const p = kickPulse(bar, 8);
  const inU = ease.outExpo(inv(37, 37.18, bar));
  const out = ease.inExpo(inv(38.25, 38.5, bar));
  g.save();
  g.fillStyle = P.ink; g.globalAlpha = 1 - out; g.fillRect(0, 0, W, H);
  g.translate(W / 2, H / 2);
  const s = (0.86 + 0.14 * inU) * (1 + 0.012 * p) * (1 + 0.4 * out);
  g.scale(s, s);
  const f1 = font(F.sans, 58, 300), f2 = font(F.sans, 168, 800);
  text(g, 'The', 0, -120, { font: f1, color: P.bone, align: 'center', tracking: 12, alpha: inU });
  const word = 'Wolfram Language';
  const full = measure(g, word, f2, -3);
  let x = -full / 2;
  g.font = f2;
  for (let i = 0; i < word.length; i++) {
    const ch = word[i]!;
    const a = ease.outExpo(inv(37 + i / 64, 37 + i / 64 + 0.12, bar));
    g.globalAlpha = a * (1 - out);
    g.fillStyle = i < 7 ? P.red : P.bone;
    g.fillText(ch, x, 60 + (1 - a) * 30);
    x += g.measureText(ch).width - 3;
  }
  g.globalAlpha = ease.outCubic(inv(37.6, 37.9, bar)) * (1 - out);
  text(g, 'November 13, 2013', 0, 170, { font: font(F.code, 34, 400), color: '#9A9CA3', align: 'center' });
  g.restore();
}
export { clamp, measure };
