// Spikey, dancing. Geometry from PolyhedronData (assets/wl/polyhedra.json); the era decides the form:
// 1.x a stellated icosahedron, 2–9 a spiked dodecahedron, 10+ the rhombic hexecontahedron.
import { clamp, inv, ease, mix, type G } from '../core/draw';
import { json } from '../core/assets';
import { kickPulse } from '../core/film';
import { BAR, S } from '../core/time';

type V3 = [number, number, number];
interface Poly { v: V3[]; f: number[][] }
const cache = new Map<string, { tris: V3[][]; spikeIdx: number[] }>();

const norm = (a: V3): V3 => { const l = Math.hypot(...a); return [a[0] / l, a[1] / l, a[2] / l]; };
const scale = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k];

/** Faces as polygons (each face a list of points); for "spiked" forms, each face is raised to a pyramid. */
function shape(kind: 'v1' | 'v2' | 'modern', spike: number): V3[][] {
  const P = json<Record<string, Poly>>('polyhedra.json');
  if (!P) return [];
  if (kind === 'modern') {
    const p = P.rhombicHexecontahedron!;
    const r = Math.max(...p.v.map((v) => Math.hypot(...v)));
    // push the 5-fold star tips out a little with the beat
    return p.f.map((f) => f.map((i) => { const v = p.v[i - 1]!; const d = Math.hypot(...v) / r; return scale(v, (1 + (d > 0.99 ? 0.25 * spike : 0)) / r); }));
  }
  const p = kind === 'v1' ? P.icosahedron! : P.dodecahedron!;
  const r = Math.max(...p.v.map((v) => Math.hypot(...v)));
  const out: V3[][] = [];
  const h = (kind === 'v1' ? 1.9 : 1.75) + 0.35 * spike;
  for (const f of p.f) {
    const pts = f.map((i) => scale(p.v[i - 1]!, 1 / r));
    const c: V3 = [0, 0, 0];
    for (const q of pts) { c[0] += q[0] / pts.length; c[1] += q[1] / pts.length; c[2] += q[2] / pts.length; }
    const apex = scale(norm(c), h * Math.hypot(...c) / 1);
    for (let k = 0; k < pts.length; k++) out.push([pts[k]!, pts[(k + 1) % pts.length]!, apex]);
  }
  return out;
}

export type SpikeyStyle = 'bit' | 'gray' | 'classic' | 'red';

/**
 * Draw Spikey at (cx, cy) with radius r. `bar` drives the dance: a hop and squash on every kick,
 * a sway that alternates each beat, a steady spin, spikes that pump.
 */
export function drawSpikey(g: G, bar: number, cx: number, cy: number, r: number, kind: 'v1' | 'v2' | 'modern', style: SpikeyStyle, dance = 1) {
  const kick = kickPulse(bar, 7) * dance;
  const beat = bar * 4;
  const sway = Math.sin(Math.PI * beat) * 0.22 * dance;
  const hop = -Math.abs(Math.sin(Math.PI * beat)) * r * 0.12 * dance;
  const faces = shape(kind, kick);
  if (!faces.length) return;
  const ay = bar * BAR * 0.9, ax = 0.45 + 0.15 * Math.sin(bar * 1.3);
  const [sy, cyy, sx, cxx] = [Math.sin(ay), Math.cos(ay), Math.sin(ax), Math.cos(ax)];
  const rot = (p: V3): V3 => {
    const x1 = p[0] * cyy + p[2] * sy, z1 = -p[0] * sy + p[2] * cyy;
    const y2 = p[1] * cxx - z1 * sx, z2 = p[1] * sx + z1 * cxx;
    return [x1, y2, z2];
  };
  const light = norm([-0.5, 0.7, 0.9]);
  const polys = faces.map((f) => {
    const q = f.map(rot);
    const a = q[0]!, b = q[1]!, c = q[2]!;
    const n = norm([(b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]), (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]), (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])]);
    const z = q.reduce((s, p) => s + p[2], 0) / q.length;
    return { q, n, z };
  }).filter((p) => p.n[2] > -0.05).sort((a, b) => a.z - b.z);
  g.save();
  g.translate(cx, cy + hop);
  g.rotate(sway);
  g.scale(1 + 0.08 * kick, 1 - 0.1 * kick);
  for (const p of polys) {
    const lam = clamp(0.25 + 0.75 * Math.max(0, p.n[0] * light[0] + p.n[1] * light[1] + p.n[2] * light[2]));
    let col: string;
    if (style === 'bit') col = lam > 0.66 ? '#FFFFFF' : lam > 0.4 ? '#8A8A8A' : '#000000';
    else if (style === 'gray') col = lam > 0.7 ? '#FFFFFF' : lam > 0.45 ? '#B8B8B8' : lam > 0.25 ? '#686868' : '#000000';
    else if (style === 'classic') col = mix(mix('#3C3C9A', '#F2B0C8', lam), '#FFFFFF', Math.pow(lam, 4) * 0.6);
    else col = mix(mix('#5A0600', '#DD1100', clamp(lam * 1.4)), '#FF9A80', Math.pow(lam, 6));
    g.fillStyle = col;
    g.strokeStyle = style === 'bit' || style === 'gray' ? '#000' : mix(col, '#000000', 0.35);
    g.lineWidth = style === 'bit' ? 1.2 : 0.8;
    g.beginPath();
    p.q.forEach((pt, i) => { const X = pt[0] * r, Y = -pt[1] * r; i ? g.lineTo(X, Y) : g.moveTo(X, Y); });
    g.closePath(); g.fill(); g.stroke();
  }
  g.restore();
}

/** Which Spikey for a given bar (by era). */
export function spikeyFor(bar: number): { kind: 'v1' | 'v2' | 'modern'; style: SpikeyStyle } {
  if (bar < S.next[0]) return { kind: 'v1', style: 'bit' };
  if (bar < S.v2[0]) return { kind: 'v1', style: 'gray' };
  if (bar < S.v6[0]) return { kind: 'v2', style: 'classic' };
  if (bar < S.v10[0]) return { kind: 'v2', style: 'red' };
  return { kind: 'modern', style: 'red' };
}

/** The mascot in the bottom-right corner, from 1.0 on; it bursts in on the drop. */
export function spikeyMascot(g: G, bar: number) {
  if (bar < S.v1[0] || bar >= S.climax[0]) return;
  if (bar >= S.families[0] && bar < S.families[1]) return;
  if (bar >= S.agents[0] - 0.1) return; // it's on stage in the agent scene
  const { kind, style } = spikeyFor(bar);
  const intro = ease.outBack(inv(S.v1[0], S.v1[0] + 0.3, bar), 2);
  const r = 46 * intro;
  if (r <= 0.5) return;
  drawSpikey(g, bar, 1790, 930, r, kind, style);
}
export { inv };

/** Spikey with a face and limbs. `raise` (0..1) lifts the right hand for a high five. */
export function cuteSpikey(g: G, bar: number, cx: number, cy: number, r: number, raise: number, blink = false) {
  g.save();
  // legs
  g.strokeStyle = '#8A0A00'; g.lineWidth = r * 0.09; g.lineCap = 'round';
  const step = Math.sin(bar * 4 * Math.PI) * r * 0.08;
  g.beginPath(); g.moveTo(cx - r * 0.25, cy + r * 0.6); g.lineTo(cx - r * 0.3, cy + r * 1.05 + step); g.stroke();
  g.beginPath(); g.moveTo(cx + r * 0.25, cy + r * 0.6); g.lineTo(cx + r * 0.3, cy + r * 1.05 - step); g.stroke();
  // arms (left relaxed, right lifts for the high five)
  g.beginPath(); g.moveTo(cx - r * 0.7, cy + r * 0.1); g.quadraticCurveTo(cx - r * 1.05, cy + r * 0.35, cx - r * 1.0, cy + r * 0.65); g.stroke();
  const hx = cx + r * (0.95 + 0.25 * raise), hy = cy + r * (0.5 - 1.25 * raise);
  g.beginPath(); g.moveTo(cx + r * 0.7, cy + r * 0.05); g.quadraticCurveTo(cx + r * 1.1, cy - r * 0.1 * raise, hx, hy); g.stroke();
  g.fillStyle = '#8A0A00'; g.beginPath(); g.arc(hx, hy, r * 0.11, 0, 7); g.fill();
  g.restore();
  drawSpikey(g, bar, cx, cy, r, 'modern', 'red', 0.6);
  // face
  g.save();
  const ey = cy - r * 0.08, ex = r * 0.28;
  for (const s of [-1, 1]) {
    g.fillStyle = '#FFFFFF'; g.beginPath();
    if (blink) g.ellipse(cx + s * ex, ey, r * 0.2, r * 0.03, 0, 0, 7); else g.ellipse(cx + s * ex, ey, r * 0.2, r * 0.23, 0, 0, 7);
    g.fill(); g.strokeStyle = '#3A0400'; g.lineWidth = r * 0.03; g.stroke();
    if (!blink) { g.fillStyle = '#111'; g.beginPath(); g.arc(cx + s * ex + r * 0.06, ey + r * 0.03, r * 0.1, 0, 7); g.fill(); g.fillStyle = '#FFF'; g.beginPath(); g.arc(cx + s * ex + r * 0.1, ey - r * 0.02, r * 0.035, 0, 7); g.fill(); }
  }
  g.strokeStyle = '#3A0400'; g.lineWidth = r * 0.05; g.lineCap = 'round';
  g.beginPath(); g.arc(cx, cy + r * 0.2, r * 0.2, 0.15 * Math.PI, 0.85 * Math.PI); g.stroke();
  g.fillStyle = 'rgba(255,120,120,0.55)';
  for (const s of [-1, 1]) { g.beginPath(); g.ellipse(cx + s * r * 0.5, cy + r * 0.2, r * 0.1, r * 0.06, 0, 0, 7); g.fill(); }
  g.restore();
}
