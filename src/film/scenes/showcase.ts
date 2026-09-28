// Set pieces that step outside the window: the …Plot family, the repositories, the agent.
import type { Ctx } from '../../core/film';
import { kickPulse } from '../../core/film';
import { F, font, text, measure, clamp, inv, ease, mix, rgba, hash01, type G } from '../../core/draw';
import { W, H, S } from '../../core/time';
const F0 = S.families[0], R0 = S.repos[0], A0 = S.agents[0];
import { P, darkness } from '../palette';
import { drawAsset, img } from '../../core/assets';
import { drawRotating } from '../../ui/widgets';
import { WORDS, byName } from '../../core/lexicon';
import { COL_X, COL_W, wrap } from '../narrator';
import { cuteSpikey } from '../spikey';
import { tr, num } from '../../core/i18n';

// ---------------------------------------------------------------- 32–34: words come in families
const FAMILY = WORDS.filter((w) => /(Plot|Plot3D|Chart|Chart3D)$/.test(w.name)).sort((a, b) => parseFloat(a.ver) - parseFloat(b.ver) || a.name.localeCompare(b.name));
const TILES = ['ContourPlot', 'DensityPlot', 'StreamPlot', 'PolarPlot', 'ParametricPlot3D', 'SphericalPlot3D', 'RegionPlot3D', 'ComplexPlot3D'];
const ROT: Record<string, string> = { ParametricPlot3D: 'fam_knot', SphericalPlot3D: 'fam_spherical', RegionPlot3D: 'fam_region3d', ComplexPlot3D: 'fam_complex' };
export const TILE_FILE: Record<string, string> = {
  ContourPlot: 'fam_contour.png', DensityPlot: 'fam_density.png', StreamPlot: 'fam_stream.png', PolarPlot: 'fam_polar.png',
  ParametricPlot3D: 'fam_knot.png', SphericalPlot3D: 'fam_spherical.png', RegionPlot3D: 'fam_region3d.png', ComplexPlot3D: 'fam_complex.png',
};

export function families(c: Ctx) {
  const { g, bar } = c;
  const col = mix(P.ink, P.bone, darkness(bar));
  g.fillStyle = mix(P.paper, P.ink, darkness(bar)); g.fillRect(0, 0, W, H);
  // background: every …Plot / …Chart word, scrolling up in columns
  g.save();
  const scroll = (bar - F0) * 260;
  g.font = font(F.code, 17, 400);
  const colsX = [60, 400, 740, 1080, 1420, 1760];
  FAMILY.forEach((w, i) => {
    const cx = colsX[i % colsX.length]!, cy = 1150 + Math.floor(i / colsX.length) * 30 - scroll;
    if (cy < -20 || cy > H + 20) return;
    g.fillStyle = rgba(col, 0.1 + 0.06 * hash01(w.name));
    g.fillText(w.name, cx, cy);
  });
  g.restore();
  // title
  const tu = ease.outExpo(inv(F0, F0 + 0.15, bar));
  g.save();
  g.globalAlpha = tu;
  const f = font(F.sans, 64, 800);
  const x = 96, y = 150;
  const w1 = text(g, tr('Words come in families: '), x, y, { font: f, color: col });
  text(g, '…Plot', x + w1, y, { font: f, color: P.red });
  text(g, tr('{0} words in the …Plot and …Chart families.', FAMILY.length), x + 2, y + 52, { font: font(F.sans, 30, 400), color: mix('#6B675F', '#9A9CA3', darkness(bar)) });
  g.restore();
  // tiles: one per beat
  const tw = 400, th = 330, gx = 96, gy = 250, gap = 36;
  TILES.forEach((name, i) => {
    const at = F0 + i / 4;
    const u = ease.outBack(inv(at, at + 0.12, bar), 1.6);
    if (u <= 0) return;
    const cx = gx + (i % 4) * (tw + gap), cy = gy + Math.floor(i / 4) * (th + 60);
    const p = i === Math.floor((bar - F0) * 4) ? kickPulse(bar, 10) : 0;
    g.save();
    g.translate(cx + tw / 2, cy + th / 2); g.scale(u * (1 + 0.03 * p), u * (1 + 0.03 * p)); g.translate(-(cx + tw / 2), -(cy + th / 2));
    g.fillStyle = '#FFFFFF';
    g.shadowColor = 'rgba(0,0,0,0.18)'; g.shadowBlur = 24; g.shadowOffsetY = 8;
    g.beginPath(); g.roundRect(cx, cy, tw, th, 8); g.fill();
    g.shadowBlur = 0; g.shadowOffsetY = 0; g.shadowColor = 'transparent';
    const rot = ROT[name];
    if (rot) drawRotating(g, rot, cx + 10, cy + 10, tw - 20, th - 20, (bar - at) * 1.3, i === Math.min(7, Math.floor((bar - F0) * 4)));
    else drawAsset(g, TILE_FILE[name]!, cx + 10, cy + 10, tw - 20, th - 20);
    g.restore();
    const wv = byName.get(name);
    text(g, name, cx + 4, cy + th + 34, { font: font(F.code, 24, 600), color: col, alpha: clamp(u) });
    if (wv) text(g, wv.ver.includes('.') ? wv.ver : `${wv.ver}.0`, cx + tw - 4, cy + th + 34, { font: font(F.code, 20, 400), color: P.red, align: 'right', alpha: clamp(u) });
  });
}

// ---------------------------------------------------------------- 46–48: the repositories
const REPOS: [string, string, string][] = ([
  ['Demonstrations Project', '2007', 'interactive ideas, built with Manipulate'],
  ['Wolfram Community', '2013', 'where users share what they make'],
  ['Data Repository', '2017', 'data that computes'],
  ['Neural Net Repository', '2018', 'trained nets, one NetModel call away'],
  ['Function Repository', '2019', 'anyone can add a function'],
] as [string, string, string][]).map(([n, y, l]) => [tr(n), y, tr(l)]);
export function repoCards(c: Ctx) {
  const { g, bar } = c;
  if (bar < R0 || bar >= R0 + 2.2) return;
  const col = mix(P.ink, P.bone, darkness(bar));
  const soft = mix('#6B675F', '#9A9CA3', darkness(bar));
  const leave = ease.inCubic(inv(R0 + 1.95, R0 + 2.2, bar));
  REPOS.forEach(([name, year, line], i) => {
    const at = R0 + i / 4;
    const u = ease.outExpo(inv(at, at + 0.2, bar));
    if (u <= 0) return;
    const x = COL_X + (1 - u) * 60, y = 190 + i * 92;
    g.save();
    g.globalAlpha = u * (1 - leave);
    g.fillStyle = rgba(mix('#FFFFFF', '#1F2126', darkness(bar)), 0.92);
    g.beginPath(); g.roundRect(x, y, COL_W, 78, 6); g.fill();
    g.fillStyle = P.red; g.fillRect(x, y, 6, 78);
    text(g, name, x + 24, y + 34, { font: font(F.sans, 28, 700), color: col });
    text(g, year, x + COL_W - 18, y + 34, { font: font(F.code, 24, 600), color: P.red, align: 'right' });
    text(g, line, x + 24, y + 62, { font: font(F.sans, 20, 400), color: soft });
    g.restore();
  });
}

// ---------------------------------------------------------------- 64–66: made by an agent
const AGENT_LINES: { at: number; s: string; kind: 'prompt' | 'call' | 'result' }[] = [
  { at: A0 + 0.05, s: tr('> make a short film about the Wolfram Language'), kind: 'prompt' },
  { at: A0 + 0.3, s: '● Bash(wolframscript -file data/lexicon.wls)', kind: 'call' },
  { at: A0 + 0.45, s: tr('  └  {0} symbols · names, versions, usage, frequencies', num(6693)), kind: 'result' },
  { at: A0 + 0.6, s: '● Bash(wolframscript -file data/assets/a5.wls)', kind: 'call' },
  { at: A0 + 0.75, s: '  └  assets/wl/v10_globe.png', kind: 'result' },
  { at: A0 + 0.9, s: '● Bash(wolframscript -file data/assets/a7.wls)', kind: 'call' },
  { at: A0 + 1.05, s: '  └  assets/wl/v13_astro.png', kind: 'result' },
  { at: A0 + 1.2, s: '● Bash(wolframscript -file data/assets2/extra.wls)', kind: 'call' },
  { at: A0 + 1.35, s: '  └  x_parallel.png · x_quantum_circuit.png · x_fireballs.png', kind: 'result' },
  { at: A0 + 1.5, s: '● Bash(bun src/render.ts video)', kind: 'call' },
  { at: A0 + 1.65, s: tr('  └  {0} frames · 1920×1080 · 60 fps', num(9960)), kind: 'result' },
];
const THUMBS = ['v1_plot3d.png', 'v2_surface.png', 'v5_colors.png', 'v6_europe.png', 'x_parallel.png', 'v10_globe.png', 'v13_astro.png', 'v12_molecule.png', 'x_quantum_trad.png'];

export function agents(c: Ctx) {
  const { g, bar } = c;
  const inU = ease.outExpo(inv(A0 + -0.1, A0 + 0.1, bar));
  const out = ease.inExpo(inv(A0 + 1.8, A0 + 2, bar));
  g.save();
  g.globalAlpha = inU;
  g.fillStyle = P.ink; g.fillRect(0, 0, W, H);
  // thumbnails of computed outputs, flying in
  THUMBS.forEach((t, i) => {
    const at = A0 + 0.2 + i * 0.13;
    const u = ease.outCubic(inv(at, at + 0.35, bar));
    if (u <= 0 || !img(t)) return;
    const tx = 1260 + (i % 3) * 200 + (hash01(t) - 0.5) * 40, ty = 180 + Math.floor(i / 3) * 190 + (hash01(t + 'y') - 0.5) * 30;
    const sx = W + 200, sy = ty + 200;
    g.save();
    g.globalAlpha = inU * u * (1 - out);
    g.translate(sx + (tx - sx) * u, sy + (ty - sy) * u);
    g.rotate((hash01(t + 'r') - 0.5) * 0.18 * (1 - u * 0.5));
    g.fillStyle = '#FFF'; g.fillRect(-4, -4, 188, 148);
    drawAsset(g, t, 0, 0, 180, 140);
    g.restore();
  });
  // terminal
  const x = 96, y = 170, w = 1060, h = 660;
  g.save();
  g.globalAlpha = inU * (1 - out);
  g.fillStyle = '#16181C'; g.strokeStyle = '#2C3038'; g.lineWidth = 1.5;
  g.beginPath(); g.roundRect(x, y, w, h, 12); g.fill(); g.stroke();
  ['#FF5F57', '#FEBC2E', '#28C840'].forEach((cl, i) => { g.fillStyle = cl; g.beginPath(); g.arc(x + 24 + i * 22, y + 22, 7, 0, 7); g.fill(); });
  text(g, 'claude — ~/src/wolfram/WolframFilm', x + w / 2, y + 28, { font: font(F.code, 17, 400), color: '#8A8F98', align: 'center' });
  let ly = y + 80;
  for (const L of AGENT_LINES) {
    if (bar < L.at) break;
    const u = clamp((bar - L.at) / (L.kind === 'prompt' ? 0.25 : 0.1));
    const s = L.s.slice(0, Math.floor(u * L.s.length));
    const color = L.kind === 'prompt' ? '#EDE9E0' : L.kind === 'call' ? '#E8A26B' : '#8FA3B8';
    text(g, s, x + 36, ly, { font: font(F.code, L.kind === 'prompt' ? 28 : 24, L.kind === 'call' ? 600 : 400), color });
    ly += L.kind === 'result' ? 54 : 40;
  }
  g.restore();
  // captions
  const cu = ease.outExpo(inv(A0 + 0.2, A0 + 0.45, bar));
  text(g, tr('WOLFRAM AS A TOOL FOR AI · FEBRUARY 2026'), 96, 110, { font: font(F.sans, 20, 600), color: P.red, tracking: 3, alpha: cu * (1 - out) });
  const f = font(F.sans, 60, 800);
  const lines1 = wrap(g, tr('AIs now call the language as a tool.'), f, 1700);
  lines1.forEach((ln, i) => text(g, ln, 96, 930 + i * 64, { font: f, color: P.bone, alpha: cu * (1 - out) }));
  const u2 = ease.outExpo(inv(A0 + 1, A0 + 1.25, bar));
  text(g, tr('This film was made that way.'), 96, 1010, { font: font(F.sans, 44, 400), color: P.redHot, alpha: u2 * (1 - out) });
  g.restore();
  highFive(g, bar);
  void measure;
}

// ---------------------------------------------------------------- the high five
const CLAUDE = '#D97757';
/** The Claude Code mascot as pixel art (after the terminal banner). `raise` lifts its right arm. */
function claudeMascot(g: G, cx: number, cy: number, px: number, raise: number, bar: number) {
  const body = [
    '..XXXXXXX..',
    '..XOXXXOX..',
    'AAXXXXXXXAA',
    '..XXXXXXX..',
    '..X.X.X.X..',
  ];
  const w = body[0]!.length * px, h = body.length * px;
  const x0 = cx - w / 2, y0 = cy - h / 2;
  const legStep = Math.floor(bar * 8) % 2;
  body.forEach((row, r) => {
    [...row].forEach((c, k) => {
      if (c === '.') return;
      let dy = 0, dx = 0;
      if (r === 4 && (k === 2 || k === 6) && legStep) dy = -px * 0.25;
      if (c === 'A' && k <= 1) { dy = -px * 2.4 * raise; dx = -px * 0.2 * raise; } // the arm facing Spikey goes up
      g.fillStyle = c === 'O' ? '#1B1B1B' : CLAUDE;
      g.fillRect(x0 + k * px + dx, y0 + r * px + dy, px + 0.5, px + 0.5);
    });
  });
}
function spark(g: G, x: number, y: number, u: number) {
  if (u <= 0 || u >= 1) return;
  g.save();
  g.strokeStyle = `rgba(255,236,170,${1 - u})`; g.lineWidth = 5 * (1 - u); g.lineCap = 'round';
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2, r0 = 18 + 60 * u, r1 = 40 + 120 * u;
    g.beginPath(); g.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0); g.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1); g.stroke();
  }
  g.fillStyle = `rgba(255,244,200,${0.95 * (1 - u)})`; g.beginPath(); g.arc(x, y, 30 * (1 - u) + 6, 0, 7); g.fill();
  g.restore();
}
export function highFive(g: G, bar: number) {
  const T0 = A0, HIT = A0 + 1.25;
  if (bar < T0 + 0.15 || bar >= A0 + 2) return;
  const out = ease.inCubic(inv(A0 + 1.8, A0 + 2, bar));
  g.save(); g.globalAlpha = 1 - out;
  // Spikey: hops from its corner to centre stage, sprouting a face
  const su = ease.inOutCubic(inv(T0 + 0.15, T0 + 0.55, bar));
  const hop = Math.sin(Math.PI * su) * 120 + Math.abs(Math.sin(Math.PI * (bar - T0) * 4)) * 14 * (su >= 1 ? 1 : 0);
  const lean = ease.inOutCubic(inv(HIT - 0.25, HIT, bar)) * (1 - ease.inOutCubic(inv(HIT + 0.1, HIT + 0.35, bar)));
  const sx = 1790 + (1420 - 1790) * su + 30 * lean, sy = 930 + (860 - 930) * su - hop;
  const raise = ease.outBack(inv(HIT - 0.3, HIT - 0.05, bar), 1.5) * (1 - ease.inCubic(inv(HIT + 0.3, HIT + 0.5, bar)));
  const sr = 50 + 10 * su;
  cuteSpikey(g, bar, sx, sy, sr, raise, bar > HIT && bar < HIT + 0.06);
  const sh = { x: sx + sr * (0.95 + 0.25 * raise), y: sy + sr * (0.5 - 1.25 * raise) };
  // Claude: pops up from below
  const cu = ease.outBack(inv(T0 + 0.5, T0 + 0.75, bar), 1.6);
  const celebrate = bar > HIT + 0.1 ? Math.abs(Math.sin(Math.PI * (bar - HIT) * 8)) * 18 : 0;
  const px = 17, ccx = 1740 - 30 * lean, ccy = 1180 - (1180 - 862) * cu - celebrate;
  claudeMascot(g, ccx, ccy, px, raise, bar);
  // the slap, where the hands meet
  const ch = { x: ccx - 5.5 * px - 0.2 * px * raise + px * 0.5, y: ccy - 2.5 * px + 2 * px - 2.4 * px * raise };
  spark(g, (sh.x + ch.x) / 2, (sh.y + ch.y) / 2, inv(HIT, HIT + 0.35, bar));
  g.restore();
}
