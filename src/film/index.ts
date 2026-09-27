import { setScenes, setOverlays } from '../core/film';
import { W, H } from '../core/time';
import { clamp, inv, ease, rgba, mix, type G } from '../core/draw';
import { ground, darkness, P } from './palette';
import { drawWall, drawFlight, wall } from './wall';
const wallFocus = () => { const p = wall().find((p) => p.w.name === 'List')!; return { x: p.x + p.width / 2, y: p.y - p.size * 0.3 }; };
import { drawRuler, drawCounter, drawEraLabel } from './hud';
import { coldOpen, smp, y1986 } from './scenes/intro';
import { drawWindow, FLIGHT_FROM } from './window';
import { caption, entry, COL_X } from './narrator';
import { CAPTIONS, ENTRIES, LABELS } from './story';
import { RELEASES } from '../core/lexicon';
import { grammarTree, breakdownText, wlTitle } from './scenes/beats';
import { climax, outro, climaxEmph } from './scenes/finale';

const narratorOn = (bar: number) => bar >= 12 && bar < 60;

setScenes([
  { id: 'ground', from: 0, to: 75, draw: (c) => { c.g.fillStyle = ground(c.bar); c.g.fillRect(0, 0, W, H); } },
  { id: 'cold', from: 0, to: 4, draw: coldOpen },
  { id: 'smp', from: 4, to: 8, draw: smp },
  { id: '1986', from: 8, to: 12, draw: y1986 },
  {
    id: 'wall', from: 12, to: 70, draw: (c) => {
      const g = c.g;
      if (c.bar >= 60 && c.bar < 68) {
        // start close on the most-used words, pull out to the whole lexicon
        const f = wallFocus();
        const z = 1 + 3.2 * (1 - ease.inOutCubic(inv(60.0, 64.0, c.bar)));
        g.translate(W / 2, H / 2); g.scale(z, z);
        g.translate(-(f.x + (W / 2 - f.x) * (1 - (z - 1) / 3.2)), -(f.y + (H / 2 - f.y) * (1 - (z - 1) / 3.2)));
      }
      drawWall(g, c.bar, c.bar >= 60 ? clamp(inv(60, 60.5, c.bar)) : 0);
      const { emph, emphU } = climaxEmph(c.bar);
      if (emph && emphU > 0) {
        g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
        g.fillStyle = rgba(P.ink, 0.6 * emphU); g.fillRect(0, 0, W, H);
        g.restore();
        drawWall(g, c.bar, 1, { emph, emphU: 1, only: true, fade: emphU });
      }
    },
  },
  {
    id: 'backdrop', from: 12, to: 60, draw: (c) => {
      // keep the narrator column legible over the wall
      const g = c.g, col = ground(c.bar);
      const grd = g.createLinearGradient(COL_X - 60, 0, COL_X + 40, 0);
      grd.addColorStop(0, rgba(col, 0)); grd.addColorStop(1, rgba(col, 0.88));
      g.fillStyle = grd; g.fillRect(COL_X - 60, 0, W - COL_X + 60, H);
      const top = g.createLinearGradient(0, 0, 0, 170);
      top.addColorStop(0, rgba(col, 0.9)); top.addColorStop(1, rgba(col, 0));
      g.fillStyle = top; g.fillRect(0, 0, W, 170);
    },
  },
  { id: 'flights', from: 12, to: 60, draw: (c) => { for (const r of RELEASES) if (c.bar >= r.bar - 0.4 && c.bar < r.bar + 1.8) drawFlight(c.g, c.bar, FLIGHT_FROM, r.key, 80); } },
  { id: 'window', from: 12, to: 60.1, draw: (c) => drawWindow(c.g, c.bar) },
  { id: 'grammar', from: 18, to: 20, draw: grammarTree },
  { id: 'breakdown', from: 35, to: 37, draw: breakdownText },
  { id: 'wltitle', from: 37, to: 39, draw: wlTitle },
  { id: 'climax', from: 60, to: 68, draw: climax },
  { id: 'outro', from: 68, to: 75, draw: outro },
]);

setOverlays([
  (g, bar) => {
    if (!narratorOn(bar)) return;
    for (const c of CAPTIONS) caption(g, bar, c.at, c.until, c.text, { redWords: c.red, y: c.y ?? 720, size: c.size });
    for (const e of ENTRIES) entry(g, bar, e.at, e.until, e.name, { note: e.note, usage: e.usage, y: 330 });
  },
  (g, bar) => {
    if (bar < 12 || bar >= 60) return;
    const l = [...LABELS].reverse().find((l) => bar >= l.at);
    if (l) drawEraLabel(g, bar, l.title, l.sub, l.at, 1);
  },
  (g, bar) => drawCounter(g, bar, clamp(inv(12, 12.3, bar)) * (1 - clamp(inv(68, 68.5, bar)))),
  (g, bar) => drawRuler(g, bar, clamp(inv(4, 4.5, bar)) * (1 - clamp(inv(68, 68.5, bar)))),
]);
export { ease, mix, darkness, P };
export type { G };
