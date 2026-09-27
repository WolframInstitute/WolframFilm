// The protagonist: one notebook window living through the eras.
import { clamp, inv, ease, rgba, mix, type G } from '../core/draw';
import { kickPulse } from '../core/film';
import { renderScreen, type Rect } from '../ui/screen';
import { chrome, OS_SPEC, palette95 } from '../ui/chrome';
import { drawNotebook } from '../ui/notebook';
import { chatbar } from '../ui/widgets';
import { ERAS, type Era } from './story';
import { P, darkness } from './palette';

export const SCREEN: Rect = { x: 88, y: 176, w: 1100, h: 780 };

function eraAt(bar: number): Era | undefined {
  // the breakdown (35–37) holds the last pre-WL era, frozen
  if (bar >= 35 && bar < 37) return ERAS.find((e) => e.from === 28);
  return ERAS.find((e) => bar >= e.from && bar < e.to);
}

function drawEra(g: G, e: Era, bar: number, R: Rect) {
  const spec = OS_SPEC[e.os];
  const localBar = Math.min(bar, e.to - 1e-3);
  renderScreen(g, R, spec.pixel, spec.depth, (sg, lw, lh) => {
    const c = chrome(e.os, sg, lw, lh, { title: e.title, bar: localBar, menus: e.menus, zoom: e.zoom });
    const pad = e.os === 'mac1' || e.os === 'next' || e.os === 'win31' || e.os === 'win95' ? 0 : 0;
    let content = { x: c.x + pad, y: c.y + pad, w: c.w - pad * 2, h: c.h - pad * 2 };
    if (e.extras === 'chatbar15') content = { ...content, h: content.h - 64 };
    drawNotebook(sg, content, e.nb, e.cells, localBar);
    if (e.extras === 'palette95') palette95(sg, lw - 118, 60, localBar);
    if (e.extras === 'chatbar15') {
      const req = 'Write the melody we are hearing as a score';
      const u = clamp(inv(54.1, 54.85, localBar));
      const sent = localBar >= 55;
      sg.fillStyle = '#FFF'; sg.fillRect(c.x, c.y + c.h - 64, c.w, 64);
      chatbar(sg, c.x + 24, c.y + c.h - 54, c.w - 30, req.slice(0, Math.floor(u * req.length)), u <= 0 || sent, localBar);
    }
  });
}

/**
 * Draw the screen for the current bar. Transitions: at each era's first bar the new chrome
 * wipes in from the top behind a bright scanline; a kick punches the scale slightly.
 */
export function drawWindow(g: G, bar: number) {
  const e = eraAt(bar);
  if (!e) return;
  let R = { ...SCREEN };
  g.save();
  // entrance at 12 (out of the collapsed name) and at 37 (the WL drop)
  const enter = (b0: number) => ease.outBack(inv(b0, b0 + 0.22, bar), 1.4);
  let s = 1;
  if (bar < 12.25) s = 0.08 + 0.92 * enter(12);
  if (bar >= 37 && bar < 38.4) { g.restore(); return; }
  if (bar >= 38.4 && bar < 38.65) s = 0.08 + 0.92 * enter(38.4);
  // breakdown: shrink back and dim
  let dim = 0;
  if (bar >= 35 && bar < 37) { const u = ease.inOutCubic(inv(35, 36.8, bar)); s *= 1 - 0.14 * u; dim = 0.65 * u; }
  // climax: the window flies away
  if (bar >= 59.75) { const u = ease.inExpo(inv(59.75, 60.05, bar)); s *= 1 + 0.9 * u; g.globalAlpha = 1 - u; }
  s *= 1 + 0.006 * kickPulse(bar, 12);
  // a slow push-in across each era
  s *= 1 + 0.03 * ease.inOutCubic(inv(e.from, e.to, Math.min(bar, 35)));
  const cx = R.x + R.w / 2, cy = R.y + R.h / 2;
  g.translate(cx, cy); g.scale(s, s); g.translate(-cx, -cy);
  // shadow
  g.save();
  g.shadowColor = rgba('#000000', 0.28 + 0.2 * darkness(bar));
  g.shadowBlur = 40; g.shadowOffsetY = 18;
  g.fillStyle = '#000'; g.fillRect(R.x, R.y, R.w, R.h);
  g.restore();
  // wipe from the previous era
  const prev = ERAS[ERAS.indexOf(e) - 1];
  const wipe = inv(e.from, e.from + 0.1, bar);
  if (prev && wipe < 1 && e.from !== 37) {
    drawEra(g, prev, e.from - 1e-3, R);
    const yCut = R.y + R.h * ease.outCubic(wipe);
    g.save(); g.beginPath(); g.rect(R.x, R.y, R.w, yCut - R.y); g.clip();
    drawEra(g, e, bar, R);
    g.restore();
    g.fillStyle = rgba('#FFFFFF', 0.9 * (1 - wipe));
    g.fillRect(R.x, yCut - 3, R.w, 6);
  } else drawEra(g, e, bar, R);
  if (dim > 0) { g.fillStyle = rgba('#000000', dim); g.fillRect(R.x, R.y, R.w, R.h); }
  // thin frame
  g.strokeStyle = rgba(mix('#000000', '#FFFFFF', darkness(bar)), 0.25); g.lineWidth = 1;
  g.strokeRect(R.x - 0.5, R.y - 0.5, R.w + 1, R.h + 1);
  g.restore();
}

/** Where words fly out from (film coordinates), e.g. the latest output. */
export const FLIGHT_FROM = { x: SCREEN.x + SCREEN.w * 0.45, y: SCREEN.y + SCREEN.h * 0.4 };
export { P };
