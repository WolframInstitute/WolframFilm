// Notebook content: cells laid out top to bottom, typed and evaluated on the film's clock,
// styled per front-end era.
import { F, font, clamp, inv, ease, makeCanvas, hexRgb, type G } from '../core/draw';

export interface TextStyle { family: string; size: number; weight?: number; italic?: boolean; color: string }
export interface NbStyle {
  bg: string;
  input: TextStyle;
  output: TextStyle;
  text: TextStyle;
  title?: TextStyle;
  label?: TextStyle & { fmt: (kind: 'in' | 'out', n: number) => string };
  bracket: { color: string; width: number; kind: 'mac1' | 'classic' | 'modern' };
  syntax?: { builtin: string; user: string; string: string; local: string; op?: string };
  aa: boolean; // anti-aliased text?
  labelAbove?: boolean; // In/Out labels on their own line above the cell (1988–97)
  left: number; // left margin of cell contents (room for labels)
  gap: number;
}

export interface Cell {
  kind: 'input' | 'output' | 'text' | 'title' | 'custom';
  at: number; // bar when it starts to appear (typing starts for inputs)
  text?: string;
  n?: number;
  type?: number; // typing duration in bars (inputs)
  h?: number; // custom height
  draw?: (g: G, x: number, y: number, w: number, bar: number) => void;
  style?: Partial<TextStyle>;
}

// ---------------------------------------------------------------- text, optionally aliased
const aliasCache = new Map<string, any>();
export function drawText(g: G, s: string, x: number, y: number, st: TextStyle, aa: boolean, align: 'left' | 'center' | 'right' = 'left') {
  const f = font(st.family, st.size, st.weight ?? 400, st.italic);
  if (aa) {
    g.save(); g.font = f; g.fillStyle = st.color; g.textAlign = align; g.textBaseline = 'alphabetic';
    g.fillText(s, x, y); g.restore();
    return measureStyled(g, s, st);
  }
  const key = `${s}|${f}|${st.color}`;
  let c = aliasCache.get(key);
  if (!c) {
    const probe = makeCanvas(4, 4).getContext('2d') as G;
    probe.font = f;
    const w = Math.ceil(probe.measureText(s).width) + 3, h = Math.ceil(st.size * 1.6);
    c = makeCanvas(w, h);
    const cg = c.getContext('2d') as G;
    cg.font = f; cg.fillStyle = '#000'; cg.textBaseline = 'alphabetic';
    cg.fillText(s, 1, Math.round(st.size * 1.15));
    const id = cg.getImageData(0, 0, w, h);
    const [r, gg, b] = hexRgb(st.color);
    for (let i = 0; i < id.data.length; i += 4) {
      const a = id.data[i + 3]! > 70 ? 255 : 0;
      id.data[i] = r; id.data[i + 1] = gg; id.data[i + 2] = b; id.data[i + 3] = a;
    }
    cg.putImageData(id, 0, 0);
    aliasCache.set(key, c);
  }
  const w = c.width - 3;
  const dx = align === 'center' ? -w / 2 : align === 'right' ? -w : 0;
  g.drawImage(c, Math.round(x + dx - 1), Math.round(y - st.size * 1.15));
  return w;
}
export function measureStyled(g: G, s: string, st: TextStyle) {
  g.save(); g.font = font(st.family, st.size, st.weight ?? 400, st.italic);
  const w = g.measureText(s).width; g.restore(); return w;
}

// ---------------------------------------------------------------- syntax colouring
const BUILTIN = /^[A-Z$][A-Za-z0-9$]*$/;
export function tokens(s: string): { t: string; k: 'builtin' | 'user' | 'string' | 'op' | 'num' | 'local' }[] {
  const out: { t: string; k: any }[] = [];
  const re = /("[^"]*"?)|([A-Za-z$][A-Za-z0-9$`]*_?)|(\d+\.?\d*)|(\s+)|(.)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    if (m[1]) out.push({ t: m[1], k: 'string' });
    else if (m[2]) out.push({ t: m[2], k: m[2].endsWith('_') ? 'local' : BUILTIN.test(m[2]) ? 'builtin' : 'user' });
    else if (m[3]) out.push({ t: m[3], k: 'num' });
    else out.push({ t: m[4] ?? m[5]!, k: 'op' });
  }
  return out;
}
export function drawCode(g: G, s: string, x: number, y: number, st: TextStyle, nb: NbStyle) {
  if (!nb.syntax) return drawText(g, s, x, y, st, nb.aa);
  let cx = x;
  for (const tk of tokens(s)) {
    const col =
      tk.k === 'string' ? nb.syntax.string : tk.k === 'user' ? nb.syntax.user : tk.k === 'local' ? nb.syntax.local : tk.k === 'op' ? (nb.syntax.op ?? st.color) : st.color;
    cx += drawText(g, tk.t, cx, y, { ...st, color: col, italic: tk.k === 'local' ? true : st.italic }, nb.aa);
  }
  return cx - x;
}

// ---------------------------------------------------------------- layout
export function cellHeight(c: Cell, nb: NbStyle, w: number, g: G): number {
  const lab = nb.labelAbove && nb.label && c.n !== undefined && (c.kind === 'input' || c.kind === 'output') ? nb.label.size * 1.5 : 0;
  if (c.kind === 'custom') return (c.h ?? 40) + lab;
  const st = styleOf(c, nb);
  const lines = wrapLines(g, c.text ?? '', st, w - nb.left - 30);
  return lines.length * st.size * 1.3 + 4 + lab;
}
function styleOf(c: Cell, nb: NbStyle): TextStyle {
  const base = c.kind === 'input' ? nb.input : c.kind === 'output' ? nb.output : c.kind === 'title' ? (nb.title ?? nb.text) : nb.text;
  return { ...base, ...(c.style ?? {}) };
}
export function wrapLines(g: G, s: string, st: TextStyle, w: number) {
  const out: string[] = [];
  for (const para of s.split('\n')) {
    const parts = para.split(/(?<=[ ,])/);
    let cur = '';
    for (const p of parts) {
      if (measureStyled(g, cur + p, st) > w && cur) { out.push(cur.trimEnd()); cur = p.trimStart(); } else cur += p;
    }
    out.push(cur);
  }
  return out;
}

/**
 * Draw cells into a content rect (logical units). Returns nothing; scrolls so that the newest
 * visible cell stays in view.
 */
export function drawNotebook(g: G, rect: { x: number; y: number; w: number; h: number }, nb: NbStyle, cells: Cell[], bar: number, scrollTo?: number) {
  g.save();
  g.beginPath(); g.rect(rect.x, rect.y, rect.w, rect.h); g.clip();
  g.fillStyle = nb.bg; g.fillRect(rect.x, rect.y, rect.w, rect.h);
  const vis = cells.filter((c) => bar >= c.at);
  const hs = vis.map((c) => cellHeight(c, nb, rect.w, g));
  // scroll: keep the bottom of content visible, gliding when a new cell arrives
  const scrollFor = (n: number) => Math.max(0, hs.slice(0, n).reduce((a, b) => a + b + nb.gap, nb.gap) - rect.h + nb.gap * 2);
  let scroll = scrollFor(vis.length);
  const last = vis[vis.length - 1];
  if (last && vis.length > 1) {
    const u = ease.outCubic(inv(last.at, last.at + 0.15, bar));
    scroll = scrollFor(vis.length - 1) + (scroll - scrollFor(vis.length - 1)) * u;
  }
  if (scrollTo !== undefined) scroll = scrollTo;
  let y = rect.y + nb.gap - scroll;
  vis.forEach((c, i) => {
    const h = hs[i]!;
    const x0 = rect.x + nb.left;
    const bracketY = y;
    const labAbove = nb.labelAbove && nb.label && c.n !== undefined && (c.kind === 'input' || c.kind === 'output');
    if (labAbove) {
      const lab = nb.label!.fmt(c.kind === 'input' ? 'in' : 'out', c.n!);
      drawText(g, lab, rect.x + 8, y + nb.label!.size * 1.1, nb.label!, nb.aa);
      y += nb.label!.size * 1.5;
    }
    const st = styleOf(c, nb);
    const bx = rect.x + rect.w - 14;
    // bracket
    bracket(g, bx, bracketY - 2, h + 2, nb, bar - c.at);
    if (c.kind === 'custom') c.draw!(g, x0, y, rect.w - nb.left - 30, bar);
    else {
      const lines = wrapLines(g, c.text ?? '', st, rect.w - nb.left - 30);
      let shown = lines;
      if (c.kind === 'input' && c.type) {
        const total = (c.text ?? '').length;
        let n = Math.floor(clamp((bar - c.at) / c.type) * total);
        shown = [];
        for (const ln of lines) { if (n <= 0) break; shown.push(ln.slice(0, n)); n -= ln.length; }
      }
      shown.forEach((ln, li) => {
        const yy = y + st.size * (1.05 + li * 1.3);
        if (c.kind === 'input') drawCode(g, ln, x0, yy, st, nb);
        else drawText(g, ln, x0, yy, st, nb.aa);
      });
      // caret while typing
      if (c.kind === 'input' && c.type && bar - c.at < c.type + 0.25 && Math.floor(bar * 8) % 2 === 0) {
        const last = shown[shown.length - 1] ?? '';
        const lx = x0 + measureStyled(g, last, st);
        g.fillStyle = st.color; g.fillRect(lx + 1, y + Math.max(0, shown.length - 1) * st.size * 1.3 + 2, Math.max(1, st.size / 12), st.size * 1.15);
      }
    }
    // labels
    if (!labAbove && nb.label && (c.kind === 'input' || c.kind === 'output' || c.kind === 'custom') && c.n !== undefined) {
      const lab = nb.label.fmt(c.kind === 'input' ? 'in' : 'out', c.n);
      drawText(g, lab, x0 - 6, y + (c.kind === 'custom' ? (c.h ?? 40) / 2 + 5 : st.size * 1.05), nb.label, nb.aa, 'right');
    }
    y = bracketY + h + nb.gap;
  });
  g.restore();
}

function bracket(g: G, x: number, y: number, h: number, nb: NbStyle, age: number) {
  const b = nb.bracket;
  g.save();
  g.strokeStyle = b.color; g.fillStyle = b.color; g.lineWidth = b.width;
  const grow = ease.outExpo(clamp(age / 0.12));
  const hh = h * grow;
  g.beginPath();
  if (b.kind === 'mac1') {
    g.moveTo(x - 4, y); g.lineTo(x, y); g.lineTo(x, y + hh); g.lineTo(x - 4, y + hh);
  } else if (b.kind === 'classic') {
    g.moveTo(x - 5, y); g.lineTo(x, y); g.lineTo(x, y + hh); g.lineTo(x - 5, y + hh);
  } else {
    g.moveTo(x - 6, y + 1); g.lineTo(x, y + 1); g.lineTo(x, y + hh - 1); g.lineTo(x - 6, y + hh - 1);
  }
  g.stroke();
  g.restore();
}

// ---------------------------------------------------------------- era styles
const courier = F.courier, arimo = F.arimo, sans = F.sans, code = F.code;
const L = (k: string, n: number) => (k === 'in' ? `In[${n}]:=` : `Out[${n}]=`);
export const NB = {
  // 1.0, Macintosh: bold Courier input, plain output, italic labels above, thin black brackets
  mac1: {
    bg: '#FFFFFF', aa: true, left: 22, gap: 6, labelAbove: true,
    input: { family: courier, size: 12, weight: 700, color: '#000' },
    output: { family: courier, size: 12, weight: 400, color: '#000' },
    text: { family: F.tinos, size: 13, color: '#000' },
    label: { family: arimo, size: 9, italic: true, color: '#000', fmt: L },
    bracket: { color: '#000', width: 1, kind: 'mac1' },
  } satisfies NbStyle,
  next: {
    bg: '#FFFFFF', aa: true, left: 22, gap: 6, labelAbove: true,
    input: { family: courier, size: 12, weight: 700, color: '#000' },
    output: { family: courier, size: 12, weight: 400, color: '#000' },
    text: { family: F.tinos, size: 13, color: '#000' },
    label: { family: arimo, size: 9, italic: true, color: '#000', fmt: L },
    bracket: { color: '#000', width: 1, kind: 'mac1' },
  } satisfies NbStyle,
  // 2.x on Windows 3.1: pure blue brackets
  win31: {
    bg: '#FFFFFF', aa: false, left: 22, gap: 6, labelAbove: true,
    input: { family: courier, size: 12, weight: 700, color: '#000' },
    output: { family: courier, size: 12, weight: 400, color: '#000' },
    text: { family: arimo, size: 12, color: '#000' },
    label: { family: arimo, size: 10, italic: true, color: '#000', fmt: L },
    bracket: { color: '#0000FF', width: 1, kind: 'classic' },
  } satisfies NbStyle,
  // 3.0 (1996): labels still above, navy; navy brackets
  v3: {
    bg: '#FFFFFF', aa: false, left: 22, gap: 7, labelAbove: true,
    input: { family: courier, size: 12, weight: 700, color: '#000' },
    output: { family: courier, size: 12, weight: 400, color: '#000' },
    text: { family: F.tinos, size: 13, color: '#000' },
    title: { family: F.tinos, size: 22, weight: 400, color: '#000' },
    label: { family: arimo, size: 10, italic: true, color: '#1B1A46', fmt: L },
    bracket: { color: '#1B1A46', width: 1, kind: 'classic' },
  } satisfies NbStyle,
  // 4.x/5.x: labels move LEFT onto the same line; periwinkle brackets
  v4: {
    bg: '#FFFFFF', aa: true, left: 62, gap: 8,
    input: { family: courier, size: 12.5, weight: 700, color: '#000' },
    output: { family: courier, size: 12.5, weight: 400, color: '#000' },
    text: { family: F.tinos, size: 13, color: '#000' },
    label: { family: arimo, size: 9, color: '#4F4E80', fmt: L },
    bracket: { color: '#605F99', width: 1, kind: 'classic' },
  } satisfies NbStyle,
  // 6.0–9 (2007–12): syntax colouring (user blue, locals green italic), tiny blue labels, blue brackets
  v6: {
    bg: '#FFFFFF', aa: true, left: 74, gap: 12,
    input: { family: courier, size: 15, weight: 700, color: '#000' },
    output: { family: courier, size: 15, weight: 400, color: '#000' },
    text: { family: F.tinos, size: 16, color: '#000' },
    label: { family: arimo, size: 10.5, color: '#3638AF', fmt: L },
    bracket: { color: '#6D82C7', width: 1.2, kind: 'modern' },
    syntax: { builtin: '#000', user: '#0000FF', string: '#555555', local: '#438958' },
  } satisfies NbStyle,
  // 10–13: #FCFCFC page, steel-blue labels, light grey brackets
  modern: {
    bg: '#FCFCFC', aa: true, left: 90, gap: 16,
    input: { family: courier, size: 17, weight: 700, color: '#000' },
    output: { family: courier, size: 17, weight: 400, color: '#000' },
    text: { family: sans, size: 19, color: '#1A1A1A' },
    title: { family: sans, size: 34, weight: 600, color: '#C8321E' },
    label: { family: sans, size: 12.5, color: '#6F97B8', fmt: L },
    bracket: { color: '#BEC2C5', width: 1.2, kind: 'modern' },
    syntax: { builtin: '#000', user: '#0C30C4', string: '#666666', local: '#438958' },
  } satisfies NbStyle,
  // 13.3 chat era: labels #3B6E92
  v13: {
    bg: '#FFFFFF', aa: true, left: 90, gap: 16,
    input: { family: code, size: 16.5, weight: 700, color: '#000' },
    output: { family: code, size: 16.5, weight: 400, color: '#000' },
    text: { family: sans, size: 19, color: '#080808' },
    title: { family: sans, size: 34, weight: 600, color: '#C8321E' },
    label: { family: sans, size: 12.5, color: '#3B6E92', fmt: L },
    bracket: { color: '#BEC2C5', width: 1.2, kind: 'modern' },
    syntax: { builtin: '#000', user: '#0C30C4', string: '#666666', local: '#3C8A8A' },
  } satisfies NbStyle,
  // 14.3 dark mode
  dark: {
    bg: '#1B1B1B', aa: true, left: 90, gap: 16,
    input: { family: code, size: 16.5, weight: 700, color: '#EDEDED' },
    output: { family: code, size: 16.5, weight: 400, color: '#E2E2E2' },
    text: { family: sans, size: 19, color: '#E5E5E5' },
    title: { family: sans, size: 34, weight: 600, color: '#F79268' },
    label: { family: sans, size: 12.5, color: '#A1A1A1', fmt: L },
    bracket: { color: '#5A5A5A', width: 1.2, kind: 'modern' },
    syntax: { builtin: '#EDEDED', user: '#8FB0FF', string: '#BDBDBD', local: '#90D4E9' },
  } satisfies NbStyle,
} as const;

export { inv };
