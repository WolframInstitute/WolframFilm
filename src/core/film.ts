// The edit. A scene is a pure function of time; the film draws whichever scenes cover t.
import type { G } from './draw';
import { BAR, W, H } from './time';
import { SCORE } from '../music/score';

export interface Ctx {
  g: G;
  t: number; // seconds
  bar: number; // absolute bar
  lb: number; // bar relative to the scene start
  u: number; // 0..1 across the scene
  len: number; // scene length in bars
}
export interface Scene { id: string; from: number; to: number; draw: (c: Ctx) => void }

const kickBars = SCORE.filter((e) => e.inst === 'kick' || e.inst === 'kickSoft').map((e) => e.bar);
const crashBars = SCORE.filter((e) => e.inst === 'crash' || e.inst === 'impact').map((e) => e.bar);
/** Seconds since the last event in a sorted bar list (Infinity if none). */
function since(list: number[], bar: number) {
  let lo = 0, hi = list.length - 1, best = -1;
  while (lo <= hi) { const m = (lo + hi) >> 1; if (list[m]! <= bar + 1e-9) { best = m; lo = m + 1; } else hi = m - 1; }
  return best < 0 ? Infinity : (bar - list[best]!) * BAR;
}
/** 1 on a kick, decaying. */
export const kickPulse = (bar: number, decay = 9) => Math.exp(-since(kickBars, bar) * decay);
export const crashPulse = (bar: number, decay = 3) => Math.exp(-since(crashBars, bar) * decay);

let scenes: Scene[] = [];
let overlays: ((g: G, bar: number, t: number) => void)[] = [];
export const setScenes = (s: Scene[]) => { scenes = s; };
export const setOverlays = (o: typeof overlays) => { overlays = o; };

export function drawFrame(g: G, t: number) {
  const bar = t / BAR;
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.globalAlpha = 1;
  g.globalCompositeOperation = 'source-over';
  g.fillStyle = '#000';
  g.fillRect(0, 0, W, H);
  for (const s of scenes) {
    if (bar < s.from || bar >= s.to) continue;
    const len = s.to - s.from;
    g.save();
    s.draw({ g, t, bar, lb: bar - s.from, u: (bar - s.from) / len, len });
    g.restore();
  }
  for (const o of overlays) { g.save(); o(g, bar, t); g.restore(); }
  g.restore();
}
