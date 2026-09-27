// Era-specific output widgets, as custom notebook cells.
import { F, font, clamp, inv, ease, type G } from '../core/draw';
import type { Cell, NbStyle, TextStyle } from './notebook';
import { drawText, drawCode, measureStyled, wrapLines } from './notebook';

const T = (g: G, s: string, x: number, y: number, fam: string, size: number, weight: number | string, color: string, align: CanvasTextAlign = 'left', italic = false) => {
  g.font = font(fam, size, weight, italic); g.fillStyle = color; g.textAlign = align; g.textBaseline = 'alphabetic';
  g.fillText(s, x, y); const w = g.measureText(s).width; g.textAlign = 'left'; return w;
};

/** A text cell that flips into its underlying Cell[...] expression (3.0 "Show Expression"). */
export function exprFlipCell(at: number, flipAt: number, s: string, nb: NbStyle): Cell {
  return {
    kind: 'custom', at, h: 44,
    draw: (g, x, y, w, bar) => {
      const u = ease.inOutCubic(inv(flipAt, flipAt + 0.15, bar));
      const sy = Math.abs(Math.cos(u * Math.PI));
      g.save();
      g.translate(0, y + 18);
      g.scale(1, Math.max(0.02, sy));
      if (u < 0.5) drawText(g, s, x - nb.left + 22, 5, nb.text, nb.aa);
      else {
        const cs = { ...nb.input, weight: 400 } as TextStyle;
        const str = `Cell["${s}", "Text"]`;
        const lines = wrapLines(g, str, cs, w + nb.left - 40);
        lines.forEach((ln, i) => drawText(g, ln, x - nb.left + 22, 5 + i * cs.size * 1.3, cs, nb.aa));
      }
      g.restore();
    },
  };
}

/** 6.0 Manipulate panel: grey rounded panel, slider with + button, ⊕ at top right. */
export function manipulateCell(at: number, h: number, param: (bar: number) => number, content: (g: G, x: number, y: number, w: number, h: number, v: number, bar: number) => void, label = 's'): Cell {
  return {
    kind: 'custom', at, h,
    draw: (g, x, y, w, bar) => {
      const v = param(bar);
      const pw = Math.min(w - 10, 560);
      g.save();
      g.fillStyle = '#F2F2F2'; g.strokeStyle = '#A6A6A6'; g.lineWidth = 1;
      g.beginPath(); g.roundRect(x, y, pw, h - 6, 5); g.fill(); g.stroke();
      // ⊕
      g.strokeStyle = '#8C8C8C'; g.beginPath(); g.arc(x + pw - 12, y + 11, 6, 0, 7); g.stroke();
      g.beginPath(); g.moveTo(x + pw - 15.5, y + 11); g.lineTo(x + pw - 8.5, y + 11); g.moveTo(x + pw - 12, y + 7.5); g.lineTo(x + pw - 12, y + 14.5); g.stroke();
      // control row
      const cy = y + 24;
      T(g, label, x + 14, cy + 4, F.arimo, 13, 400, '#000', 'left', true);
      const sx0 = x + 34, sx1 = x + pw - 50;
      g.fillStyle = '#FFFFFF'; g.strokeStyle = '#9A9A9A';
      g.beginPath(); g.roundRect(sx0, cy - 2, sx1 - sx0, 5, 2.5); g.fill(); g.stroke();
      const tx = sx0 + (sx1 - sx0) * v;
      const grd = g.createRadialGradient(tx - 2, cy - 3, 1, tx, cy, 9);
      grd.addColorStop(0, '#DDEBFF'); grd.addColorStop(0.5, '#5C8FE0'); grd.addColorStop(1, '#2B5CB8');
      g.fillStyle = grd; g.beginPath(); g.arc(tx, cy + 0.5, 8, 0, 7); g.fill();
      g.strokeStyle = '#1D3F80'; g.lineWidth = 0.8; g.stroke();
      g.fillStyle = '#F7F7F7'; g.strokeStyle = '#9A9A9A';
      g.beginPath(); g.roundRect(x + pw - 36, cy - 8, 16, 16, 2); g.fill(); g.stroke();
      T(g, '+', x + pw - 28, cy + 5, F.arimo, 13, 700, '#555', 'center');
      // content area
      const ax = x + 10, ay = y + 44, aw = pw - 20, ah = h - 60;
      g.fillStyle = '#FFF'; g.strokeStyle = '#C8C8C8';
      g.fillRect(ax, ay, aw, ah); g.strokeRect(ax + 0.5, ay + 0.5, aw - 1, ah - 1);
      g.beginPath(); g.rect(ax, ay, aw, ah); g.clip();
      content(g, ax, ay, aw, ah, v, bar);
      g.restore();
    },
  };
}

/** 8.0 free-form input: orange "=" marker, plain-English query box, ↳ interpretation, generated code. */
export function freeformCell(at: number, query: string, interp: string, code: string, nb: NbStyle): Cell {
  return {
    kind: 'custom', at, h: 88,
    draw: (g, x, y, w, bar) => {
      const u = inv(at, at + 0.35, bar);
      const shown = query.slice(0, Math.floor(u * query.length));
      g.save();
      // marker
      g.fillStyle = '#F76504'; g.beginPath(); g.roundRect(x - 26, y + 4, 17, 17, 4); g.fill();
      T(g, '=', x - 17.5, y + 17.5, F.arimo, 15, 700, '#FFF', 'center');
      // query box
      g.fillStyle = '#FFF'; g.strokeStyle = '#CFCFCF'; g.lineWidth = 1;
      g.beginPath(); g.roundRect(x - 2, y + 1, Math.min(w - 20, 380), 25, 5); g.fill(); g.stroke();
      T(g, shown, x + 7, y + 19, F.arimo, 15, 700, '#222');
      const r = inv(at + 0.45, at + 0.6, bar);
      if (r > 0) {
        g.globalAlpha = r;
        g.strokeStyle = '#F76504'; g.lineWidth = 1.6;
        g.beginPath(); g.moveTo(x + 4, y + 33); g.lineTo(x + 4, y + 41); g.lineTo(x + 13, y + 41); g.stroke();
        g.beginPath(); g.moveTo(x + 10, y + 38); g.lineTo(x + 13.5, y + 41); g.lineTo(x + 10, y + 44); g.stroke();
        T(g, interp, x + 18, y + 45, F.arimo, 13, 400, '#F76504');
        drawCode(g, code, x + 2, y + 72, nb.input, nb);
      }
      g.restore();
    },
  };
}

/** 9.0 Suggestions Bar under an output. */
export function suggestionsCell(at: number, items: string[], hot = 1): Cell {
  return {
    kind: 'custom', at, h: 26,
    draw: (g, x, y, w, bar) => {
      const u = ease.outExpo(inv(at, at + 0.2, bar));
      g.save();
      g.globalAlpha = u;
      const bw = Math.min(w, 540) * u;
      g.fillStyle = '#F3F5F6'; g.fillRect(x - 8, y, bw, 22);
      g.fillStyle = '#D6DADC'; g.fillRect(x - 8, y, bw, 1); g.fillRect(x - 8, y + 21, bw, 1);
      let cx = x;
      items.forEach((it, i) => {
        const isHot = i === hot && Math.floor(bar * 4) % 2 === 0;
        const tw = T(g, it, cx, y + 15, F.arimo, 11.5, 400, isHot ? '#F86415' : '#444');
        g.strokeStyle = '#9A9A9A'; g.strokeRect(cx + tw + 4.5, y + 6.5, 9, 9);
        T(g, '▾', cx + tw + 9, y + 14.5, F.arimo, 9, 400, '#666', 'center');
        cx += tw + 22;
        g.fillStyle = '#D0D0D0'; g.fillRect(cx - 5, y + 4, 1, 14);
      });
      g.restore();
    },
  };
}

/** 10+ Entity blob: orange border, cream fill, grey type label. */
export function entityBlob(g: G, x: number, y: number, name: string, type: string, scale = 1) {
  g.save();
  g.translate(x, y); g.scale(scale, scale);
  g.font = font(F.sans, 16, 600);
  const nw = g.measureText(name).width;
  g.font = font(F.sans, 14, 400);
  const tw = g.measureText(`(${type})`).width;
  const w = nw + tw + 20;
  g.fillStyle = '#FDFBF3'; g.strokeStyle = '#F4821D'; g.lineWidth = 1.3;
  g.beginPath(); g.roundRect(0, 0, w, 26, 4); g.fill(); g.stroke();
  T(g, name, 8, 18, F.sans, 16, 600, '#222');
  T(g, `(${type})`, 12 + nw, 18, F.sans, 14, 400, '#8A8A8A');
  g.restore();
  return w * scale;
}
export function entityCell(at: number, items: [string, string][]): Cell {
  return {
    kind: 'custom', at, h: 34,
    draw: (g, x, y, w, bar) => {
      let cx = x;
      items.forEach(([n, t], i) => {
        const u = ease.outBack(inv(at + i * 0.0625, at + i * 0.0625 + 0.15, bar), 2);
        if (u <= 0) return;
        g.save(); g.globalAlpha = clamp(u);
        const bw = entityBlob(g, cx, y + 4 + (1 - u) * 8, n, t);
        g.restore();
        cx += bw + 10;
      });
    },
  };
}

/** 13.3 chat input cell. */
export function chatInputCell(at: number, s: string, type = 0.5): Cell {
  return {
    kind: 'custom', at, h: 46,
    draw: (g, x, y, w, bar) => {
      const shown = s.slice(0, Math.floor(clamp((bar - at) / type) * s.length));
      // speech bubble icon
      bubble(g, x - 48, y + 9, '#7DD2FF', '#4992B9');
      g.fillStyle = '#FFF'; g.strokeStyle = '#A3C9F1'; g.lineWidth = 2;
      g.beginPath(); g.roundRect(x, y + 1, w - 8, 38, 2); g.fill(); g.stroke();
      T(g, shown, x + 14, y + 26, F.sans, 18, 400, '#080808');
      if (shown.length < s.length || Math.floor(bar * 8) % 2 === 0) {
        g.font = font(F.sans, 18, 400);
        g.fillStyle = '#080808'; g.fillRect(x + 15 + g.measureText(shown).width, y + 11, 1.5, 20);
      }
    },
  };
}
export function bubble(g: G, x: number, y: number, fill: string, stroke: string) {
  g.save();
  g.fillStyle = fill; g.strokeStyle = stroke; g.lineWidth = 1.2;
  g.beginPath(); g.roundRect(x, y, 22, 16, 3); g.moveTo(x + 5, y + 16); g.lineTo(x + 5, y + 22); g.lineTo(x + 11, y + 16);
  g.fill(); g.stroke();
  g.restore();
}

/** 13.3 assistant response: pale pane, prose with linked function names, a code block. */
export function chatResponseCell(at: number, prose: string, link: string, code: string[], nb: NbStyle): Cell {
  const h = 64 + code.length * 24 + 16;
  return {
    kind: 'custom', at, h,
    draw: (g, x, y, w, bar) => {
      const u = ease.outCubic(inv(at, at + 0.2, bar));
      g.save();
      g.globalAlpha = u;
      bubble(g, x - 48, y + 9, '#E6E8EE', '#9AA0AC');
      g.fillStyle = '#F3F4F8'; g.strokeStyle = '#DADDE4'; g.lineWidth = 1;
      g.beginPath(); g.roundRect(x, y, w - 8, h - 8, 3); g.fill(); g.stroke();
      T(g, '⋮', x + w - 22, y + 20, F.arimo, 14, 700, '#888');
      // prose, revealed word by word ("streaming")
      const words = prose.split(' ');
      const n = Math.floor(clamp((bar - at) / 0.45) * words.length);
      let cx = x + 16;
      const py = y + 28;
      for (let i = 0; i < n; i++) {
        const wd = words[i]!;
        const isLink = wd.replace(/[.,:]/g, '') === link;
        cx += T(g, wd + ' ', cx, py, F.sans, 17.5, 400, isLink ? '#35569C' : '#111');
      }
      // code block
      const c = clamp((bar - at - 0.45) / 0.35);
      if (c > 0) {
        const bx = x + 16, by = y + 42, bw = w - 48, bh = code.length * 24 + 14;
        g.fillStyle = '#FFF'; g.strokeStyle = '#E0E0E0';
        g.beginPath(); g.rect(bx, by, bw, bh); g.fill(); g.stroke();
        const total = code.join('\n').length;
        let left = Math.floor(c * total);
        code.forEach((ln, i) => {
          if (left <= 0) return;
          drawCode(g, ln.slice(0, left), bx + 14, by + 25 + i * 24, { ...nb.input, size: 15 }, nb);
          left -= ln.length + 1;
        });
      }
      g.restore();
    },
  };
}

/** 14.2 Tabular output (simple banded table). */
export function tabularCell(at: number, cols: string[], rows: (string | number)[][], dark: boolean): Cell {
  const rh = 24;
  return {
    kind: 'custom', at, h: (rows.length + 1) * rh + 12,
    draw: (g, x, y, w, bar) => {
      const cw = [70, 80, 110, 120];
      const tw = cw.reduce((a, b) => a + b, 0);
      g.save();
      g.fillStyle = dark ? '#2B2B2B' : '#F1F1F1'; g.fillRect(x, y, tw, rh);
      let cx = x;
      cols.forEach((c, i) => { T(g, c, cx + 8, y + 16, F.sans, 14, 600, dark ? '#CFCFCF' : '#333'); cx += cw[i]!; });
      rows.forEach((r, ri) => {
        const u = inv(at + ri * 0.04, at + ri * 0.04 + 0.12, bar);
        if (u <= 0) return;
        const yy = y + rh * (ri + 1);
        g.globalAlpha = u;
        g.fillStyle = dark ? (ri % 2 ? '#222' : '#262626') : ri % 2 ? '#FFF' : '#FAFAFA';
        g.fillRect(x, yy, tw, rh);
        let cx2 = x;
        r.forEach((v, i) => {
          const s = typeof v === 'number' ? v.toLocaleString('en-US') : v;
          T(g, s, cx2 + cw[i]! - 10, yy + 16, F.code, 13.5, 400, dark ? '#E6E6E6' : '#222', 'right');
          cx2 += cw[i]!;
        });
        g.globalAlpha = 1;
      });
      g.strokeStyle = dark ? '#3A3A3A' : '#DDD'; g.strokeRect(x + 0.5, y + 0.5, tw, rh * (rows.length + 1));
      g.restore();
    },
  };
}

/**
 * 15.0 MusicScore output: piano roll with play/stop/speaker column and a duration footer.
 * `notes` are [startBeat, lenBeats, midi]; the playhead follows `beatNow` (null = stopped).
 */
export function musicScoreCell(at: number, notes: [number, number, number][], totalBeats: number, beatNow: (bar: number) => number | null, measures: number): Cell {
  const H = 190;
  return {
    kind: 'custom', at, h: H,
    draw: (g, x, y, w, bar) => {
      const u = ease.outCubic(inv(at, at + 0.2, bar));
      const pw = Math.min(w - 10, 640);
      g.save();
      g.globalAlpha = u;
      g.fillStyle = '#FFF'; g.strokeStyle = '#D9D9D9'; g.lineWidth = 1;
      g.beginPath(); g.roundRect(x, y, pw, H - 10, 6); g.fill(); g.stroke();
      // controls
      const b = (cy: number, kind: 'play' | 'stop') => {
        g.strokeStyle = '#3980C6'; g.lineWidth = 1.6; g.beginPath(); g.arc(x + 25, cy, 11, 0, 7); g.stroke();
        g.fillStyle = '#3980C6';
        if (kind === 'play') { g.beginPath(); g.moveTo(x + 21, cy - 6); g.lineTo(x + 31, cy); g.lineTo(x + 21, cy + 6); g.fill(); }
        else g.fillRect(x + 20.5, cy - 4.5, 9, 9);
      };
      b(y + 24, 'play'); b(y + 54, 'stop');
      g.fillStyle = '#8A8A8A'; g.fillRect(x + 18, y + 80, 5, 8); g.beginPath(); g.moveTo(x + 23, y + 80); g.lineTo(x + 30, y + 75); g.lineTo(x + 30, y + 93); g.lineTo(x + 23, y + 88); g.fill();
      g.fillStyle = '#E4E4E4'; g.fillRect(x + 50, y + 6, 1, H - 60);
      // roll
      const rx = x + 60, ry = y + 12, rw = pw - 76, rh = H - 76;
      const lo = Math.min(...notes.map((n) => n[2])) - 1, hi = Math.max(...notes.map((n) => n[2])) + 1;
      const now = beatNow(bar);
      notes.forEach(([s, l, m]) => {
        const nx = rx + (s / totalBeats) * rw, nw = Math.max(3, (l / totalBeats) * rw - 3);
        const ny = ry + rh - ((m - lo) / (hi - lo)) * rh;
        const active = now !== null && now >= s && now < s + l;
        g.fillStyle = active ? '#E0701A' : '#F2A024';
        g.fillRect(nx, ny - (active ? 3 : 2), nw, active ? 6 : 4);
      });
      const px = rx + ((now ?? 0) / totalBeats) * rw;
      g.fillStyle = '#333'; g.fillRect(px, ry - 4, 1.2, rh + 8);
      // footer
      g.fillStyle = '#F5F5F5'; g.beginPath(); g.roundRect(x + 1, y + H - 58, pw - 2, 47, [0, 0, 6, 6]); g.fill();
      T(g, `Duration: ${measures} measures`, x + 16, y + H - 38, F.sans, 14, 400, '#6B6B6B');
      T(g, 'Time Signature: 4/4', x + 16, y + H - 19, F.sans, 14, 400, '#6B6B6B');
      g.restore();
    },
  };
}

/** 15.0 AI Assistant chatbar, docked at the bottom of the notebook. */
export function chatbar(g: G, x: number, y: number, w: number, textShown: string, placeholder: boolean, bar: number) {
  g.save();
  g.fillStyle = '#FFF'; g.strokeStyle = '#76C3EB'; g.lineWidth = 1.5;
  g.beginPath(); g.roundRect(x, y, w - 40, 40, 10); g.fill(); g.stroke();
  g.strokeStyle = '#3F9BD5'; g.lineWidth = 1.3;
  g.beginPath(); g.roundRect(x + 12, y + 12, 18, 13, 3); g.moveTo(x + 16, y + 25); g.lineTo(x + 16, y + 30); g.lineTo(x + 21, y + 25); g.stroke();
  T(g, placeholder ? 'What would you like to do?' : textShown, x + 40, y + 26, F.sans, 16, 400, placeholder ? '#9A9A9A' : '#111');
  if (!placeholder && Math.floor(bar * 8) % 2 === 0) {
    g.font = font(F.sans, 16, 400); g.fillStyle = '#111';
    g.fillRect(x + 41 + g.measureText(textShown).width, y + 11, 1.4, 18);
  }
  T(g, '→', x + w - 62, y + 27, F.arimo, 18, 700, '#007DCA', 'center');
  T(g, '✕', x + w - 22, y + 16, F.arimo, 11, 400, '#8A8A8A', 'center');
  T(g, '…', x + w - 22, y + 34, F.arimo, 12, 700, '#8A8A8A', 'center');
  g.restore();
}

/** Speaker + waveform next to Speak[...] (7). */
export function speakCell(at: number, s: string): Cell {
  return {
    kind: 'custom', at, h: 36,
    draw: (g, x, y, w, bar) => {
      const u = inv(at, at + 0.8, bar);
      if (u <= 0) return;
      g.save();
      g.fillStyle = '#555'; g.fillRect(x, y + 12, 6, 10); g.beginPath(); g.moveTo(x + 6, y + 12); g.lineTo(x + 14, y + 5); g.lineTo(x + 14, y + 29); g.lineTo(x + 6, y + 22); g.fill();
      g.strokeStyle = '#6468AB'; g.lineWidth = 1.5;
      g.beginPath();
      for (let i = 0; i < 240; i++) {
        const t = i / 240;
        if (t > u) break;
        const env = Math.sin(Math.PI * t) * (0.4 + 0.6 * Math.abs(Math.sin(t * 23)));
        const yy = y + 17 + Math.sin(i * 1.7 + bar * 30) * 11 * env;
        i === 0 ? g.moveTo(x + 24 + i, yy) : g.lineTo(x + 24 + i, yy);
      }
      g.stroke();
      g.restore();
      void s;
    },
  };
}
export { measureStyled };

/** Summary box (10+): grey rounded panel, ⊞ expander, a small icon, label: value lines. */
export function summaryBoxCell(at: number, head: string, rows: [string, string][], icon: (g: G, x: number, y: number) => void): Cell {
  const h = 22 + rows.length * 20 + 8;
  return {
    kind: 'custom', at, h: h + 4,
    draw: (g, x, y, w, bar) => {
      const u = ease.outCubic(inv(at, at + 0.15, bar));
      g.save(); g.globalAlpha = u;
      g.font = font(F.sans, 15, 400);
      const bw = 64 + Math.max(...rows.map(([k, v]) => g.measureText(`${k}: ${v}`).width)) + 30;
      const hw = T(g, head, x, y + h / 2 + 5, F.code, 16.5, 400, '#000');
      T(g, '[', x + hw, y + h / 2 + 5, F.code, 16.5, 400, '#000');
      const bx = x + hw + 12;
      g.fillStyle = '#F5F5F5'; g.strokeStyle = '#D0D0D0'; g.lineWidth = 1;
      g.beginPath(); g.roundRect(bx, y + 2, bw, h, 4); g.fill(); g.stroke();
      g.strokeStyle = '#9A9A9A'; g.strokeRect(bx + 7.5, y + 9.5, 9, 9);
      g.beginPath(); g.moveTo(bx + 10, y + 14); g.lineTo(bx + 14, y + 14); g.moveTo(bx + 12, y + 12); g.lineTo(bx + 12, y + 16); g.stroke();
      icon(g, bx + 24, y + 8);
      rows.forEach(([k, v], i) => {
        const tw = T(g, `${k}: `, bx + 64, y + 22 + i * 20, F.sans, 15, 400, '#8A8A8A');
        T(g, v, bx + 64 + tw, y + 22 + i * 20, F.sans, 15, 400, '#222');
      });
      T(g, ']', bx + bw + 3, y + h / 2 + 5, F.code, 16.5, 400, '#000');
      g.restore();
    },
  };
}
export const netIcon = (g: G, x: number, y: number) => {
  const cols = ['#E4B87D', '#9EC1E0', '#9EC1E0', '#B7D59B', '#E49B9B'];
  cols.forEach((c, i) => { g.fillStyle = c; g.fillRect(x + i * 6.5, y + 4 + (i % 2) * 3, 5, 26 - (i % 2) * 6); });
};
