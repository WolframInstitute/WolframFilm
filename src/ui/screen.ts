// Low-resolution era rendering: draw at the era's resolution, quantise like its display,
// then upscale with nearest-neighbour so pixels read as pixels.
import { makeCanvas, type G } from '../core/draw';

export type Depth = 'bit' | 'gray4' | 'color' | 'full';
export interface Rect { x: number; y: number; w: number; h: number }

const cache = new Map<string, { c: any; g: G }>();
// ordered dither (4x4 Bayer), biased so thin text strokes survive
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => 0.18 + 0.72 * ((v + 0.5) / 16));
function offscreen(w: number, h: number) {
  const k = `${w}x${h}`;
  let o = cache.get(k);
  if (!o) { const c = makeCanvas(w, h); o = { c, g: c.getContext('2d') as G }; cache.set(k, o); }
  return o;
}

/**
 * Render `draw` into rect R at 1/pixel resolution with the given colour depth.
 * `draw` receives a context whose units are logical (era) pixels and the logical size.
 */
export function renderScreen(g: G, R: Rect, pixel: number, depth: Depth, draw: (sg: G, lw: number, lh: number) => void) {
  if (depth === 'full') {
    // vector eras: draw directly, magnified by `pixel` (crisp at any zoom)
    g.save(); g.translate(R.x, R.y);
    g.beginPath(); g.rect(0, 0, R.w, R.h); g.clip();
    g.scale(pixel, pixel);
    draw(g, R.w / pixel, R.h / pixel);
    g.restore();
    return;
  }
  const lw = Math.round(R.w / pixel), lh = Math.round(R.h / pixel);
  const { c, g: sg } = offscreen(lw, lh);
  sg.save();
  sg.setTransform(1, 0, 0, 1, 0, 0);
  sg.clearRect(0, 0, lw, lh);
  sg.imageSmoothingEnabled = true;
  draw(sg, lw, lh);
  sg.restore();
  if (depth === 'bit' || depth === 'gray4') {
    const id = sg.getImageData(0, 0, lw, lh);
    const d = id.data;
    for (let i = 0; i < d.length; i += 4) {
      const L = 0.299 * d[i]! + 0.587 * d[i + 1]! + 0.114 * d[i + 2]!;
      let v: number;
      if (depth === 'bit') { const px = (i >> 2) % lw, py = Math.floor((i >> 2) / lw); v = L < 255 * BAYER[(py & 3) * 4 + (px & 3)]! ? 0 : 255; }
      else v = L < 52 ? 0 : L < 144 ? 104 : L < 220 ? 184 : 255; // NeXT MegaPixel greys
      d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255;
    }
    sg.putImageData(id, 0, 0);
  }
  g.save();
  g.imageSmoothingEnabled = !Number.isInteger(pixel);
  g.drawImage(c, R.x, R.y, R.w, R.h);
  g.restore();
}
