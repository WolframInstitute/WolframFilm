// Operating-system chrome, one function per era. All coordinates are logical (era) pixels.
// Generic shapes and colours of each era only: no vendor logos, no Spikey.
import { F, font, makeCanvas, type G } from '../core/draw';
import type { Depth, Rect } from './screen';
import { LANG, tr } from '../core/i18n';

/** Menu titles as a localized system showed them; Japanese Windows appends the access key, as in ファイル(F). */
const JA_MENU = LANG === 'ja';
const winMenu = (m: string) => (LANG === 'ja' ? `${tr(m)}(${m[0]})` : tr(m));
/** Draw a Windows menu title with its access key underlined. */
function winMenuTitle(g: G, m: string, x: number, y: number, size: number, weight: number, underline = true) {
  const s = winMenu(m);
  const w = T(g, s, x, y, F.arimo, size, weight, '#000');
  if (underline) {
    const k = LANG === 'ja' ? s.length - 2 : 0;
    g.font = font(F.arimo, size, weight);
    g.fillStyle = '#000'; g.fillRect(x + g.measureText(s.slice(0, k)).width, y + 1.5, g.measureText(s[k]!).width, 1);
  }
  return w;
}

export type OSKind = 'mac1' | 'next' | 'win31' | 'win95' | 'mac9' | 'xp' | 'osx' | 'yosemite' | 'bigsur' | 'dark';
export const OS_SPEC: Record<OSKind, { pixel: number; depth: Depth }> = {
  mac1: { pixel: 2, depth: 'bit' },
  next: { pixel: 2, depth: 'gray4' },
  win31: { pixel: 2, depth: 'color' },
  win95: { pixel: 2, depth: 'color' },
  mac9: { pixel: 2, depth: 'color' },
  xp: { pixel: 1.7, depth: 'color' },
  osx: { pixel: 1.3, depth: 'full' },
  yosemite: { pixel: 1.35, depth: 'full' },
  bigsur: { pixel: 1.35, depth: 'full' },
  dark: { pixel: 1.35, depth: 'full' },
};

export interface ChromeOpts { title: string; bar: number; menus?: string[]; zoom?: string; status?: string; noDesk?: boolean }

const T = (g: G, s: string, x: number, y: number, fam: string, size: number, weight: number | string, color: string, align: CanvasTextAlign = 'left', italic = false) => {
  g.font = font(fam, size, weight, italic && !(LANG === 'ja' && /[\u3000-\u9fff]/.test(s))); g.fillStyle = color; g.textAlign = align; g.textBaseline = 'alphabetic';
  g.fillText(s, x, y);
  const w = g.measureText(s).width; g.textAlign = 'left'; return w;
};
const box = (g: G, x: number, y: number, w: number, h: number, fill: string, stroke?: string, lw = 1) => {
  g.fillStyle = fill; g.fillRect(x, y, w, h);
  if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.strokeRect(x + lw / 2, y + lw / 2, w - lw, h - lw); }
};
/** Windows-style 3D bevel. */
function bevel(g: G, x: number, y: number, w: number, h: number, face = '#C0C0C0', sunken = false, deep = true) {
  g.fillStyle = face; g.fillRect(x, y, w, h);
  const hi = sunken ? '#808080' : '#FFFFFF', lo = sunken ? '#FFFFFF' : '#808080', dk = sunken ? '#DFDFDF' : '#000000';
  g.fillStyle = hi; g.fillRect(x, y, w, 1); g.fillRect(x, y, 1, h);
  g.fillStyle = deep ? dk : lo; g.fillRect(x, y + h - 1, w, 1); g.fillRect(x + w - 1, y, 1, h);
  if (deep) { g.fillStyle = lo; g.fillRect(x + 1, y + h - 2, w - 2, 1); g.fillRect(x + w - 2, y + 1, 1, h - 2); }
}
const patCache = new Map<string, any>();
function checker(g: G, a: string, b: string) {
  const k = a + b;
  let c = patCache.get(k);
  if (!c) {
    c = makeCanvas(2, 2);
    const cg = c.getContext('2d');
    cg.fillStyle = a; cg.fillRect(0, 0, 2, 2);
    cg.fillStyle = b; cg.fillRect(0, 0, 1, 1); cg.fillRect(1, 1, 1, 1);
    patCache.set(k, c);
  }
  return g.createPattern(c, 'repeat')!;
}
function tri(g: G, x: number, y: number, s: number, dir: 'up' | 'down' | 'left' | 'right', color: string, fill = true) {
  g.beginPath();
  if (dir === 'up') { g.moveTo(x, y - s); g.lineTo(x + s, y + s * 0.6); g.lineTo(x - s, y + s * 0.6); }
  if (dir === 'down') { g.moveTo(x, y + s); g.lineTo(x + s, y - s * 0.6); g.lineTo(x - s, y - s * 0.6); }
  if (dir === 'left') { g.moveTo(x - s, y); g.lineTo(x + s * 0.6, y - s); g.lineTo(x + s * 0.6, y + s); }
  if (dir === 'right') { g.moveTo(x + s, y); g.lineTo(x - s * 0.6, y - s); g.lineTo(x - s * 0.6, y + s); }
  g.closePath();
  if (fill) { g.fillStyle = color; g.fill(); } else { g.strokeStyle = color; g.lineWidth = 1; g.stroke(); }
}

// ======================================================================= 1988 · Macintosh System 6
function mac1(g: G, lw: number, lh: number, o: ChromeOpts): Rect {
  g.fillStyle = checker(g, '#FFFFFF', '#000000'); g.fillRect(0, 0, lw, lh);
  // menu bar
  box(g, 0, 0, lw, 19, '#FFF'); box(g, 0, 19, lw, 1, '#000');
  let x = 14;
  for (const m of o.menus ?? ['File', 'Edit', 'Cells', 'Search', 'Action', 'Styles', 'Windows']) x += T(g, tr(m), x, 14, F.arimo, 12, 700, '#000') + 14;
  // window
  const wx = 12, wy = 30, ww = lw - 26, wh = lh - 40;
  box(g, wx + 1, wy + 1, ww, wh, '#000');
  box(g, wx, wy, ww, wh, '#FFF', '#000');
  // title bar stripes
  for (let yy = wy + 4; yy <= wy + 14; yy += 2) box(g, wx + 2, yy, ww - 4, 1, '#000');
  box(g, wx, wy + 18, ww, 1, '#000');
  // close box
  box(g, wx + 7, wy + 3, 13, 13, '#FFF'); box(g, wx + 8, wy + 4, 11, 11, '#FFF', '#000');
  // zoom box
  box(g, wx + ww - 21, wy + 3, 13, 13, '#FFF'); box(g, wx + ww - 20, wy + 4, 11, 11, '#FFF', '#000'); box(g, wx + ww - 20, wy + 4, 7, 7, '#FFF', '#000');
  // title plate
  g.font = font(F.arimo, 12, 700);
  const tw = g.measureText(o.title).width;
  box(g, wx + ww / 2 - tw / 2 - 7, wy + 2, tw + 14, 15, '#FFF');
  T(g, o.title, wx + ww / 2, wy + 14, F.arimo, 12, 700, '#000', 'center');
  // scroll bars
  const sbx = wx + ww - 16, sby = wy + 18, sbh = wh - 18 - 15;
  box(g, sbx, sby, 16, sbh, '#FFF', '#000');
  g.fillStyle = checker(g, '#FFFFFF', '#000000'); g.fillRect(sbx + 1, sby + 16, 14, sbh - 32);
  box(g, sbx, sby, 16, 16, '#FFF', '#000'); tri(g, sbx + 8, sby + 8, 4, 'up', '#000', false);
  box(g, sbx, sby + sbh - 16, 16, 16, '#FFF', '#000'); tri(g, sbx + 8, sby + sbh - 8, 4, 'down', '#000', false);
  box(g, sbx, sby + sbh - 34, 16, 16, '#FFF', '#000');
  const hby = wy + wh - 16;
  box(g, wx, hby, ww - 15, 16, '#FFF', '#000');
  g.fillStyle = checker(g, '#FFFFFF', '#000000'); g.fillRect(wx + 17, hby + 1, ww - 49, 14);
  box(g, wx, hby, 16, 16, '#FFF', '#000'); tri(g, wx + 8, hby + 8, 4, 'left', '#000', false);
  box(g, wx + ww - 32, hby, 16, 16, '#FFF', '#000'); tri(g, wx + ww - 24, hby + 8, 4, 'right', '#000', false);
  box(g, wx + 17, hby, 16, 16, '#FFF', '#000');
  // grow box
  box(g, sbx, hby, 16, 16, '#FFF', '#000'); box(g, sbx + 3, hby + 3, 8, 8, '#FFF', '#000'); box(g, sbx + 6, hby + 6, 7, 7, '#FFF', '#000');
  return { x: wx + 1, y: wy + 19, w: ww - 17, h: wh - 19 - 16 };
}

// ======================================================================= 1989 · NeXTSTEP
function next(g: G, lw: number, lh: number, o: ChromeOpts): Rect {
  box(g, 0, 0, lw, lh, '#686868');
  // vertical menu
  const mx = 6, my = 6, mw = 104;
  const items = ['Info', 'Notebook', 'Edit', 'Format', 'Cell', 'Graph', 'Action', 'Windows', 'Print', 'Services', 'Hide', 'Quit'].map((m) => tr(m));
  box(g, mx, my, mw, 17, '#000');
  T(g, 'Mathematica', mx + mw / 2, my + 13, F.arimo, 11, 700, '#FFF', 'center');
  items.forEach((it, i) => {
    const y = my + 17 + i * 17;
    bevel(g, mx, y, mw, 17, '#B8B8B8', false, false);
    T(g, it, mx + 6, y + 12.5, F.arimo, 11, 400, '#000');
    if (i < 10) tri(g, mx + mw - 9, y + 8.5, 3, 'right', '#000');
    else T(g, i === 10 ? 'h' : 'q', mx + mw - 10, y + 12.5, F.arimo, 11, 400, '#000', 'center');
  });
  // dock (generic tiles)
  for (let i = 0; i < 6; i++) {
    const tx = lw - 50, ty = 4 + i * 50;
    bevel(g, tx, ty, 48, 48, '#B8B8B8', false, true);
    g.fillStyle = ['#000', '#686868', '#FFF', '#000', '#686868', '#FFF'][i]!;
    if (i % 3 === 0) { g.beginPath(); g.arc(tx + 24, ty + 24, 13, 0, Math.PI * 2); g.fill(); }
    else if (i % 3 === 1) g.fillRect(tx + 12, ty + 14, 24, 20);
    else { g.fillRect(tx + 14, ty + 10, 20, 28); box(g, tx + 14, ty + 10, 20, 28, '#FFF', '#000'); }
  }
  // window
  const wx = 122, wy = 12, ww = lw - 186, wh = lh - 22;
  box(g, wx, wy, ww, wh, '#B8B8B8', '#000');
  box(g, wx, wy, ww, 19, '#000');
  bevel(g, wx + 3, wy + 3, 13, 13, '#B8B8B8', false, false);
  bevel(g, wx + ww - 16, wy + 3, 13, 13, '#B8B8B8', false, false);
  g.strokeStyle = '#000'; g.lineWidth = 1.2;
  g.beginPath(); g.moveTo(wx + ww - 13, wy + 6); g.lineTo(wx + ww - 6, wy + 13); g.moveTo(wx + ww - 6, wy + 6); g.lineTo(wx + ww - 13, wy + 13); g.stroke();
  T(g, o.title, wx + ww / 2, wy + 14, F.arimo, 12, 700, '#FFF', 'center');
  // toolbar: style popup + alignment buttons
  box(g, wx + 1, wy + 19, ww - 2, 20, '#B8B8B8');
  bevel(g, wx + 24, wy + 22, 70, 15, '#B8B8B8', false, false);
  T(g, 'Input', wx + 30, wy + 33, F.arimo, 10, 400, '#000');
  for (let i = 0; i < 3; i++) bevel(g, wx + 102 + i * 18, wy + 22, 15, 15, '#B8B8B8', false, false);
  // scroller on the LEFT
  const sx = wx + 1, sy = wy + 40, sh = wh - 40 - 9;
  box(g, sx, sy, 17, sh, '#686868');
  bevel(g, sx + 1, sy + 2, 15, 40, '#B8B8B8', false, false);
  bevel(g, sx + 1, sy + sh - 34, 15, 16, '#B8B8B8', false, false); tri(g, sx + 8.5, sy + sh - 26, 3.5, 'up', '#000');
  bevel(g, sx + 1, sy + sh - 17, 15, 16, '#B8B8B8', false, false); tri(g, sx + 8.5, sy + sh - 9, 3.5, 'down', '#000');
  // resize bar
  box(g, wx + 1, wy + wh - 9, ww - 2, 8, '#B8B8B8');
  box(g, wx + 24, wy + wh - 9, 1, 8, '#686868'); box(g, wx + ww - 25, wy + wh - 9, 1, 8, '#686868');
  T(g, o.zoom ?? '100%', wx + 32, wy + wh - 1.5, F.arimo, 8, 400, '#000');
  return { x: wx + 19, y: wy + 40, w: ww - 20, h: wh - 40 - 10 };
}

// ======================================================================= 1991 · Windows 3.1
function win31(g: G, lw: number, lh: number, o: ChromeOpts): Rect {
  box(g, 0, 0, lw, lh, '#C0C0C0');
  // frame
  box(g, 0, 0, lw, lh, '#C0C0C0', '#000');
  const tx = 4, ty = 4, tw = lw - 8;
  box(g, tx, ty, tw, 18, '#000080');
  T(g, o.title, lw / 2, ty + 13.5, F.arimo, 11, 700, '#FFF', 'center');
  bevel(g, tx, ty, 18, 18, '#C0C0C0', false, false);
  box(g, tx + 4, ty + 8, 10, 3, '#FFF', '#000');
  bevel(g, tx + tw - 36, ty, 18, 18, '#C0C0C0'); tri(g, tx + tw - 27, ty + 9, 3.5, 'down', '#000');
  bevel(g, tx + tw - 18, ty, 18, 18, '#C0C0C0'); tri(g, tx + tw - 9, ty + 9, 3.5, 'up', '#000');
  // menu bar
  const my = ty + 18;
  box(g, tx, my, tw, 18, '#FFF'); box(g, tx, my + 18, tw, 1, '#000');
  let x = tx + 8;
  for (const m of o.menus ?? ['File', 'Edit', 'Cell', 'Graph', 'Action', 'Style', 'Options', 'Window', 'Help']) x += winMenuTitle(g, m, x, my + 13, JA_MENU ? 10 : 11, 700) + (JA_MENU ? 6 : 13);
  // ruler
  const ry = my + 19;
  box(g, tx, ry, tw, 13, '#FFF'); box(g, tx, ry + 13, tw, 1, '#000');
  for (let i = 0; i * 12 < tw - 20; i++) {
    const xx = tx + 10 + i * 12;
    box(g, xx, ry + (i % 8 === 0 ? 3 : i % 4 === 0 ? 6 : 9), 1, i % 8 === 0 ? 10 : i % 4 === 0 ? 7 : 4, '#000');
    if (i % 8 === 0 && i > 0) T(g, String(i / 8), xx + 2, ry + 9, F.arimo, 7, 400, '#000');
  }
  // toolbar
  const by = ry + 14;
  box(g, tx, by, tw, 24, '#C0C0C0'); box(g, tx, by + 24, tw, 1, '#000');
  box(g, tx + 6, by + 4, 96, 16, '#FFF', '#000');
  T(g, 'Input', tx + 10, by + 15.5, F.arimo, 10, 400, '#000');
  bevel(g, tx + 86, by + 5, 15, 14, '#C0C0C0', false, false); tri(g, tx + 93.5, by + 12, 2.5, 'down', '#000');
  const icons = 12;
  for (let i = 0; i < icons; i++) {
    const bx = tx + 116 + i * 22 + (i >= 3 ? 8 : 0) + (i >= 7 ? 8 : 0);
    bevel(g, bx, by + 3, 20, 18, '#C0C0C0', false, true);
    g.fillStyle = ['#000080', '#800000', '#008000', '#000', '#808000', '#008080'][i % 6]!;
    if (i % 3 === 0) g.fillRect(bx + 6, by + 7, 8, 8);
    else if (i % 3 === 1) { g.beginPath(); g.arc(bx + 10, by + 12, 4, 0, 7); g.fill(); }
    else { g.fillRect(bx + 5, by + 8, 10, 2); g.fillRect(bx + 5, by + 12, 10, 2); }
  }
  // status bar
  const sy = lh - 22;
  box(g, tx, sy, tw, 18, '#C0C0C0');
  bevel(g, tx + 3, sy + 2, tw * 0.62, 14, '#C0C0C0', true, false);
  bevel(g, tx + tw * 0.62 + 7, sy + 2, tw * 0.38 - 10, 14, '#C0C0C0', true, false);
  T(g, o.status ?? 'Ready', tx + 7, sy + 12.5, F.arimo, 10, 400, '#000');
  T(g, '211833K Bytes Free', tx + tw * 0.62 + 11, sy + 12.5, F.arimo, 10, 400, '#000');
  // vertical scroll bar
  const vx = tx + tw - 17, vy = by + 25, vh = sy - vy - 1;
  box(g, vx, vy, 17, vh, '#E0E0E0', '#000');
  bevel(g, vx, vy, 17, 17); tri(g, vx + 8.5, vy + 8.5, 3.5, 'up', '#000');
  bevel(g, vx, vy + vh - 17, 17, 17); tri(g, vx + 8.5, vy + vh - 8.5, 3.5, 'down', '#000');
  bevel(g, vx, vy + 18, 17, 17);
  box(g, tx, vy, tw - 17, vh, '#FFF');
  return { x: tx, y: vy, w: tw - 17, h: vh };
}

// ======================================================================= 1996 · Windows 95
function win95(g: G, lw: number, lh: number, o: ChromeOpts): Rect {
  box(g, 0, 0, lw, lh, '#008080');
  // taskbar
  const tb = lh - 26;
  box(g, 0, tb, lw, 26, '#C0C0C0'); box(g, 0, tb, lw, 1, '#DFDFDF'); box(g, 0, tb + 1, lw, 1, '#FFF');
  bevel(g, 3, tb + 4, 56, 19, '#C0C0C0');
  T(g, tr('Start'), 31, tb + 18, F.arimo, 11, 700, '#000', 'center');
  bevel(g, 64, tb + 4, 150, 19, '#C0C0C0', true, false);
  T(g, 'Mathematica', 72, tb + 18, F.arimo, 11, 700, '#000');
  bevel(g, lw - 66, tb + 4, 63, 19, '#C0C0C0', true, false);
  T(g, tr('10:23 AM'), lw - 34, tb + 17.5, F.arimo, 10, 400, '#000', 'center');
  // window
  const wx = 6, wy = 6, ww = lw - 12 - 0, wh = tb - 12;
  bevel(g, wx, wy, ww, wh, '#C0C0C0');
  box(g, wx + 3, wy + 3, ww - 6, 18, '#000080');
  // generic document icon
  box(g, wx + 6, wy + 5, 11, 14, '#FFF', '#000'); box(g, wx + 8, wy + 9, 7, 1, '#000080'); box(g, wx + 8, wy + 12, 7, 1, '#000080');
  T(g, o.title, wx + 22, wy + 16.5, F.arimo, 11, 700, '#FFF');
  for (let i = 0; i < 3; i++) {
    const bx = wx + ww - 5 - 16 * (3 - i) - (i === 2 ? -2 : 0);
    bevel(g, bx, wy + 5, 16, 14);
    g.fillStyle = '#000';
    if (i === 0) g.fillRect(bx + 4, wy + 14, 6, 2);
    if (i === 1) { g.strokeStyle = '#000'; g.lineWidth = 1; g.strokeRect(bx + 3.5, wy + 7.5, 8, 7); g.fillRect(bx + 3, wy + 7, 9, 2); }
    if (i === 2) { g.strokeStyle = '#000'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(bx + 4, wy + 8); g.lineTo(bx + 11, wy + 15); g.moveTo(bx + 11, wy + 8); g.lineTo(bx + 4, wy + 15); g.stroke(); }
  }
  // menu bar
  let x = wx + 10;
  const my = wy + 22;
  for (const m of o.menus ?? ['File', 'Edit', 'Cell', 'Format', 'Input', 'Kernel', 'Find', 'Window', 'Help']) x += winMenuTitle(g, m, x, my + 13, JA_MENU ? 10 : 11, 400) + (JA_MENU ? 7 : 14);
  // client area (sunken)
  const cx = wx + 4, cy = my + 19, cw = ww - 8, ch = wh - (cy - wy) - 4;
  bevel(g, cx, cy, cw, ch, '#FFF', true, true);
  // scroll bar
  const vx = cx + cw - 18, vy = cy + 2, vh = ch - 4;
  g.fillStyle = checker(g, '#C0C0C0', '#FFFFFF'); g.fillRect(vx, vy, 16, vh);
  bevel(g, vx, vy, 16, 16); tri(g, vx + 8, vy + 8, 3, 'up', '#000');
  bevel(g, vx, vy + vh - 16, 16, 16); tri(g, vx + 8, vy + vh - 8, 3, 'down', '#000');
  bevel(g, vx, vy + 17, 16, 30);
  return { x: cx + 2, y: cy + 2, w: cw - 21, h: ch - 4 };
}

/** The 3.0 BasicInput palette: a narrow floating window of symbol buttons. */
export function palette95(g: G, x: number, y: number, bar: number) {
  const syms = ['π', 'e', 'i', '∞', '°', '×', '÷', '→', '≠', '≤', '≥', '∈', '¬', '∧', '∨', 'α', 'β', 'γ', 'δ', 'ε', 'θ', 'λ', 'μ', 'σ', 'φ', 'ω', 'Γ', 'Δ', 'Σ', 'Ω'];
  const cols = 5, bw = 17, rows = Math.ceil(syms.length / cols);
  const w = cols * bw + 8, h = rows * bw + 26;
  bevel(g, x, y, w, h, '#C0C0C0');
  box(g, x + 3, y + 3, w - 6, 14, '#000080');
  T(g, 'BasicInput', x + 6, y + 13.5, F.arimo, 9, 700, '#FFF');
  bevel(g, x + w - 15, y + 4, 11, 11); g.strokeStyle = '#000'; g.lineWidth = 1;
  g.beginPath(); g.moveTo(x + w - 13, y + 6); g.lineTo(x + w - 7, y + 12); g.moveTo(x + w - 7, y + 6); g.lineTo(x + w - 13, y + 12); g.stroke();
  syms.forEach((s, i) => {
    const bx = x + 4 + (i % cols) * bw, by = y + 20 + Math.floor(i / cols) * bw;
    const lit = Math.floor(bar * 8) % syms.length === i;
    bevel(g, bx, by, bw - 1, bw - 1, lit ? '#DFDFDF' : '#C0C0C0', lit, true);
    T(g, s, bx + (bw - 1) / 2, by + 12, F.tinos, 11, 400, '#000', 'center');
  });
}

// ======================================================================= 1999 · Mac OS 9 Platinum
function mac9(g: G, lw: number, lh: number, o: ChromeOpts): Rect {
  const grd = g.createLinearGradient(0, 0, 0, lh);
  grd.addColorStop(0, '#5C5CA8'); grd.addColorStop(1, '#3E3E86');
  g.fillStyle = grd; g.fillRect(0, 0, lw, lh);
  // menu bar
  const mg = g.createLinearGradient(0, 0, 0, 20);
  mg.addColorStop(0, '#F2F2F2'); mg.addColorStop(1, '#D6D6D6');
  g.fillStyle = mg; g.fillRect(0, 0, lw, 20); box(g, 0, 20, lw, 1, '#777');
  let x = 16;
  for (const m of o.menus ?? ['File', 'Edit', 'Cell', 'Format', 'Input', 'Kernel', 'Find', 'Window', 'Help']) x += T(g, tr(m), x, 14.5, F.arimo, 12, 700, '#000') + 16;
  T(g, tr('10:23 AM'), lw - 12, 14.5, F.arimo, 12, 700, '#000', 'right');
  // window
  const wx = 14, wy = 32, ww = lw - 30, wh = lh - 44;
  box(g, wx + 3, wy + 3, ww, wh, 'rgba(0,0,0,0.35)');
  box(g, wx, wy, ww, wh, '#DDDDDD', '#555');
  box(g, wx + 1, wy + 1, ww - 2, 1, '#FFF'); box(g, wx + 1, wy + 1, 1, wh - 2, '#FFF');
  // title bar stripes
  for (let yy = wy + 5; yy < wy + 18; yy += 2) { box(g, wx + 24, yy, ww - 48, 1, '#9C9C9C'); box(g, wx + 24, yy + 1, ww - 48, 1, '#FFFFFF'); }
  g.font = font(F.arimo, 12, 700);
  const tw = g.measureText(o.title).width;
  box(g, wx + ww / 2 - tw / 2 - 8, wy + 3, tw + 16, 17, '#DDDDDD');
  T(g, o.title, wx + ww / 2, wy + 15.5, F.arimo, 12, 700, '#000', 'center');
  const btn = (bx: number) => { box(g, bx, wy + 5, 12, 12, '#EEE', '#555'); box(g, bx + 1, wy + 6, 10, 1, '#FFF'); };
  btn(wx + 7); btn(wx + ww - 19); btn(wx + ww - 35);
  box(g, wx + ww - 32, wy + 9, 6, 1, '#555');
  // client
  const cx = wx + 5, cy = wy + 22, cw = ww - 10, ch = wh - 27;
  box(g, cx, cy, cw, ch, '#FFF', '#777');
  // scroll bar
  const vx = cx + cw - 16, vh = ch - 15;
  box(g, vx, cy, 16, vh, '#E4E4E4', '#777');
  box(g, vx + 2, cy + 18, 12, 38, '#A6A6D8', '#55557A');
  for (let i = 0; i < 4; i++) box(g, vx + 4, cy + 31 + i * 3, 8, 1, '#E0E0FF');
  box(g, vx, cy + vh - 30, 16, 15, '#EEE', '#777'); tri(g, vx + 8, cy + vh - 22.5, 3, 'up', '#000');
  box(g, vx, cy + vh - 15, 16, 15, '#EEE', '#777'); tri(g, vx + 8, cy + vh - 7.5, 3, 'down', '#000');
  // bottom bar with zoom popup
  const hy = cy + ch - 15;
  box(g, cx, hy, cw, 15, '#E4E4E4', '#777');
  box(g, cx + 1, hy + 1, 44, 13, '#F4F4F4', '#999');
  T(g, o.zoom ?? '100%', cx + 6, hy + 11, F.arimo, 10, 400, '#000');
  tri(g, cx + 38, hy + 7.5, 2.5, 'down', '#000');
  return { x: cx + 1, y: cy + 1, w: cw - 18, h: ch - 17 };
}

// ======================================================================= 2004 · Windows XP
function xp(g: G, lw: number, lh: number, o: ChromeOpts): Rect {
  // generic sky-and-hill wallpaper
  const sky = g.createLinearGradient(0, 0, 0, lh);
  sky.addColorStop(0, '#2F6FD6'); sky.addColorStop(0.55, '#8CC0F2'); sky.addColorStop(1, '#BFE0FA');
  g.fillStyle = sky; g.fillRect(0, 0, lw, lh);
  g.fillStyle = '#4E9A2F';
  g.beginPath(); g.moveTo(0, lh * 0.72); g.bezierCurveTo(lw * 0.3, lh * 0.52, lw * 0.6, lh * 0.62, lw, lh * 0.7); g.lineTo(lw, lh); g.lineTo(0, lh); g.fill();
  // taskbar
  const tb = lh - 28;
  const tg = g.createLinearGradient(0, tb, 0, lh);
  tg.addColorStop(0, '#3F8CF3'); tg.addColorStop(0.15, '#245EDB'); tg.addColorStop(1, '#1941A5');
  g.fillStyle = tg; g.fillRect(0, tb, lw, 28);
  const sg = g.createLinearGradient(0, tb, 0, lh);
  sg.addColorStop(0, '#5EB55A'); sg.addColorStop(1, '#2E8B2A');
  g.fillStyle = sg; g.beginPath(); g.moveTo(0, tb); g.lineTo(88, tb); g.quadraticCurveTo(100, tb, 100, tb + 14); g.quadraticCurveTo(100, lh, 88, lh); g.lineTo(0, lh); g.fill();
  T(g, tr('start'), 30, tb + 19.5, F.arimo, 16, 700, '#FFF', 'left', true);
  box(g, lw - 80, tb, 80, 28, '#0F8CE8');
  T(g, tr('10:23 AM'), lw - 40, tb + 18, F.arimo, 11, 400, '#FFF', 'center');
  // window
  const wx = 10, wy = 8, ww = lw - 20, wh = tb - 16;
  const tbh = 26;
  const frame = g.createLinearGradient(0, wy, 0, wy + tbh);
  frame.addColorStop(0, '#0A5FE8'); frame.addColorStop(0.1, '#3D95FF'); frame.addColorStop(0.3, '#0B5BE6'); frame.addColorStop(1, '#0450D8');
  g.fillStyle = '#0450D8';
  g.beginPath(); g.roundRect(wx, wy, ww, wh, [8, 8, 0, 0]); g.fill();
  g.fillStyle = frame; g.beginPath(); g.roundRect(wx, wy, ww, tbh, [8, 8, 0, 0]); g.fill();
  box(g, wx + 9, wy + 6, 13, 15, '#FFF', '#2B4E86');
  box(g, wx + 11, wy + 10, 9, 1, '#2B4E86'); box(g, wx + 11, wy + 13, 9, 1, '#2B4E86');
  g.save(); g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowOffsetX = 1; g.shadowOffsetY = 1;
  T(g, o.title, wx + 28, wy + 18, F.arimo, 12, 700, '#FFF');
  g.restore();
  const xb = (bx: number, red: boolean) => {
    g.fillStyle = red ? '#E0512B' : '#2B78F0'; g.beginPath(); g.roundRect(bx, wy + 4, 19, 19, 3); g.fill();
    g.strokeStyle = '#FFF'; g.lineWidth = 1; g.beginPath(); g.roundRect(bx + 0.5, wy + 4.5, 18, 18, 3); g.stroke();
  };
  xb(wx + ww - 25, true); xb(wx + ww - 47, false); xb(wx + ww - 69, false);
  g.strokeStyle = '#FFF'; g.lineWidth = 2;
  g.beginPath(); g.moveTo(wx + ww - 20, wy + 9); g.lineTo(wx + ww - 11, wy + 18); g.moveTo(wx + ww - 11, wy + 9); g.lineTo(wx + ww - 20, wy + 18); g.stroke();
  g.strokeRect(wx + ww - 42, wy + 9, 9, 8); g.fillStyle = '#FFF'; g.fillRect(wx + ww - 64, wy + 16, 8, 2);
  // menu bar
  const my = wy + tbh;
  box(g, wx + 4, my, ww - 8, 20, '#ECE9D8');
  let x = wx + 12;
  for (const m of o.menus ?? ['File', 'Edit', 'Cell', 'Format', 'Input', 'Kernel', 'Find', 'Window', 'Help']) x += winMenuTitle(g, m, x, my + 14, 11.5, 400, false) + 14;
  const cx = wx + 4, cy = my + 20, cw = ww - 8, ch = wh - tbh - 24;
  box(g, cx, cy, cw, ch, '#FFF', '#7F9DB9');
  // scrollbar
  const vx = cx + cw - 17;
  box(g, vx, cy + 1, 16, ch - 18, '#F4F3EE');
  const thumb = g.createLinearGradient(vx, 0, vx + 16, 0);
  thumb.addColorStop(0, '#C8D6FB'); thumb.addColorStop(1, '#A9C0F5');
  g.fillStyle = thumb; g.beginPath(); g.roundRect(vx + 1, cy + 20, 14, 46, 3); g.fill();
  g.fillStyle = '#C3D3FD'; g.beginPath(); g.roundRect(vx + 1, cy + 2, 14, 16, 3); g.fill(); tri(g, vx + 8, cy + 10, 3, 'up', '#4D6185');
  g.beginPath(); g.fillStyle = '#C3D3FD'; g.roundRect(vx + 1, cy + ch - 35, 14, 16, 3); g.fill(); tri(g, vx + 8, cy + ch - 27, 3, 'down', '#4D6185');
  // bottom bar: zoom field
  const hy = cy + ch - 17;
  box(g, cx + 1, hy, cw - 2, 16, '#F4F3EE');
  box(g, cx + 3, hy + 2, 42, 12, '#FFF', '#7F9DB9');
  T(g, o.zoom ?? '100%', cx + 7, hy + 11.5, F.arimo, 10, 400, '#000');
  return { x: cx + 1, y: cy + 1, w: cw - 19, h: ch - 19 };
}

// ======================================================================= 2007–2012 · Mac OS X
function traffic(g: G, x: number, y: number, r: number, flat: boolean) {
  const cols = [['#FF6159', '#E2463F'], ['#FFBD2E', '#E1A116'], ['#28C941', '#12AC28']];
  cols.forEach(([a, b], i) => {
    const cx = x + i * (r * 2 + r * 0.85), cy = y;
    if (flat) { g.fillStyle = a!; g.beginPath(); g.arc(cx, cy, r, 0, 7); g.fill(); g.strokeStyle = b!; g.lineWidth = 0.8; g.stroke(); return; }
    const gr = g.createRadialGradient(cx, cy + r * 0.4, r * 0.1, cx, cy, r);
    gr.addColorStop(0, a!); gr.addColorStop(1, b!);
    g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, r, 0, 7); g.fill();
    g.strokeStyle = 'rgba(0,0,0,0.35)'; g.lineWidth = 0.8; g.stroke();
    const hl = g.createLinearGradient(0, cy - r, 0, cy);
    hl.addColorStop(0, 'rgba(255,255,255,0.9)'); hl.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = hl; g.beginPath(); g.ellipse(cx, cy - r * 0.45, r * 0.62, r * 0.42, 0, 0, 7); g.fill();
  });
}
function macMenubar(g: G, lw: number, menus: string[], dark = false, h = 22) {
  g.fillStyle = dark ? 'rgba(30,30,32,0.85)' : 'rgba(250,250,250,0.92)'; g.fillRect(0, 0, lw, h);
  g.fillStyle = dark ? '#000' : 'rgba(0,0,0,0.18)'; g.fillRect(0, h, lw, 1);
  let x = 20;
  const gap = LANG === 'ru' ? 12 : 19; // Russian titles are longer; keep Help clear of the clock
  menus.forEach((m, i) => { x += T(g, tr(m), x, h * 0.7, F.arimo, 13, i === 0 ? 700 : 400, dark ? '#EEE' : '#111') + gap; });
  T(g, tr('Mon 10:23 AM'), lw - 16, h * 0.7, F.arimo, 13, 400, dark ? '#EEE' : '#111', 'right');
}
function osx(g: G, lw: number, lh: number, o: ChromeOpts, style: 'osx' | 'yosemite' | 'bigsur' | 'dark'): Rect {
  const dark = style === 'dark';
  // generic wallpapers
  const wp = g.createLinearGradient(0, 0, lw, lh);
  if (style === 'osx') { wp.addColorStop(0, '#1B1745'); wp.addColorStop(0.5, '#5A2A8C'); wp.addColorStop(1, '#1E4F9A'); }
  else if (style === 'yosemite') { wp.addColorStop(0, '#E9A56A'); wp.addColorStop(0.5, '#7C6FA0'); wp.addColorStop(1, '#2F4F7D'); }
  else if (style === 'bigsur') { wp.addColorStop(0, '#F4A77B'); wp.addColorStop(0.45, '#C45E8E'); wp.addColorStop(1, '#2C4F9E'); }
  else { wp.addColorStop(0, '#1D2436'); wp.addColorStop(0.5, '#312043'); wp.addColorStop(1, '#0E2440'); }
  g.fillStyle = wp; g.fillRect(0, 0, lw, lh);
  if (style === 'osx') {
    // an aurora sweep
    g.save(); g.globalAlpha = 0.35; g.strokeStyle = '#B9A7FF'; g.lineWidth = 60;
    g.beginPath(); g.moveTo(-50, lh * 0.8); g.bezierCurveTo(lw * 0.3, lh * 0.2, lw * 0.6, lh * 0.9, lw + 50, lh * 0.25); g.stroke(); g.restore();
  }
  const mbh = style === 'osx' ? 22 : 24;
  macMenubar(g, lw, o.menus ?? ['Mathematica', 'File', 'Edit', 'Insert', 'Format', 'Cell', 'Graphics', 'Evaluation', 'Palettes', 'Window', 'Help'], dark, mbh);
  const wx = 34, wy = mbh + 18, ww = lw - 68, wh = lh - mbh - 34;
  const rad = style === 'osx' ? 5 : style === 'yosemite' ? 5 : 11;
  const tbh = style === 'osx' ? 23 : 28;
  g.save();
  g.shadowColor = 'rgba(0,0,0,0.45)'; g.shadowBlur = 30; g.shadowOffsetY = 12;
  g.fillStyle = dark ? '#1B1B1B' : '#FFF';
  g.beginPath(); g.roundRect(wx, wy, ww, wh, rad); g.fill();
  g.restore();
  g.save();
  g.beginPath(); g.roundRect(wx, wy, ww, wh, rad); g.clip();
  const tg = g.createLinearGradient(0, wy, 0, wy + tbh);
  if (style === 'osx') { tg.addColorStop(0, '#E9E9E9'); tg.addColorStop(1, '#BDBDBD'); }
  else if (style === 'yosemite') { tg.addColorStop(0, '#EDEDED'); tg.addColorStop(1, '#D9D9D9'); }
  else if (style === 'bigsur') { tg.addColorStop(0, '#F6F6F6'); tg.addColorStop(1, '#EFEFEF'); }
  else { tg.addColorStop(0, '#2E2E2E'); tg.addColorStop(1, '#282828'); }
  g.fillStyle = tg; g.fillRect(wx, wy, ww, tbh);
  g.fillStyle = dark ? '#111' : style === 'osx' ? '#8C8C8C' : '#CFCFCF'; g.fillRect(wx, wy + tbh, ww, 1);
  traffic(g, wx + 20, wy + tbh / 2, style === 'osx' ? 6.5 : 6.5, style !== 'osx');
  T(g, o.title, wx + ww / 2, wy + tbh / 2 + 5, F.arimo, 13, style === 'bigsur' || dark ? 700 : 400, dark ? '#DDD' : '#333', 'center');
  if (style !== 'osx') T(g, (o.zoom ?? '100%') + ' ⌄', wx + ww - 16, wy + tbh / 2 + 5, F.arimo, 12, 400, dark ? '#AAA' : '#777', 'right');
  let cy = wy + tbh + 1;
  if (dark) {
    // 14.3 notebook toolbar
    const th = 38;
    g.fillStyle = '#262626'; g.fillRect(wx, cy, ww, th);
    const groups = ['Evaluation', 'Assistance', 'Cell Style', 'Cells', 'Code', 'Insert', 'Notebook'];
    let gx = wx + 14;
    groups.forEach((gname, i) => {
      T(g, tr(gname), gx, cy + 12, F.arimo, 9, 400, '#9A9A9A');
      const n = gname === 'Cell Style' ? 0 : i === 0 ? 3 : 3;
      if (gname === 'Cell Style') { g.fillStyle = '#383838'; g.beginPath(); g.roundRect(gx, cy + 16, 96, 17, 3); g.fill(); T(g, tr('+ Insert Cell...'), gx + 6, cy + 28.5, F.arimo, 10, 400, '#DDD'); gx += 110; return; }
      for (let k = 0; k < n; k++) {
        g.fillStyle = i === 0 && k === 0 ? '#E0482F' : '#9C9C9C';
        g.beginPath(); g.roundRect(gx + k * 22, cy + 18, 14, 13, 2); i === 0 && k === 0 ? g.fill() : (g.strokeStyle = '#9C9C9C', g.lineWidth = 1.2, g.stroke());
      }
      gx += n * 22 + 22;
    });
    g.fillStyle = '#111'; g.fillRect(wx, cy + th, ww, 1);
    cy += th + 1;
  }
  const content = { x: wx, y: cy, w: ww - 14, h: wy + wh - cy - (style === 'osx' ? 16 : 0) };
  // scroll bar
  g.fillStyle = dark ? '#2A2A2A' : style === 'osx' ? '#EEE' : '#FAFAFA';
  g.fillRect(wx + ww - 14, cy, 14, content.h);
  g.fillStyle = style === 'osx' ? '#7BA7E1' : dark ? '#5A5A5A' : '#C1C1C1';
  g.beginPath(); g.roundRect(wx + ww - 11, cy + 8, 8, 60, 4); g.fill();
  if (style === 'osx') {
    g.fillStyle = '#E4E4E4'; g.fillRect(wx, wy + wh - 16, ww, 16);
    g.fillStyle = '#AAA'; g.fillRect(wx, wy + wh - 16, ww, 1);
    T(g, o.zoom ?? '100%', wx + 8, wy + wh - 4, F.arimo, 10, 400, '#333');
  }
  g.restore();
  return content;
}

export function chrome(os: OSKind, g: G, lw: number, lh: number, o: ChromeOpts): Rect {
  switch (os) {
    case 'mac1': return mac1(g, lw, lh, o);
    case 'next': return next(g, lw, lh, o);
    case 'win31': return win31(g, lw, lh, o);
    case 'win95': return win95(g, lw, lh, o);
    case 'mac9': return mac9(g, lw, lh, o);
    case 'xp': return xp(g, lw, lh, o);
    case 'osx': return osx(g, lw, lh, o, 'osx');
    case 'yosemite': return osx(g, lw, lh, o, 'yosemite');
    case 'bigsur': return osx(g, lw, lh, o, 'bigsur');
    case 'dark': return osx(g, lw, lh, o, 'dark');
  }
}
