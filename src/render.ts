// Offline renderer: @napi-rs/canvas -> raw RGBA -> ffmpeg.
//   bun src/render.ts video [--from s] [--to s] [--samples n] [--out out/film.mp4] [--crf 16]
//   bun src/render.ts stills --at 12.5,30,61 [--scale 0.5]
//   bun src/render.ts sheet [--from s] [--to s] [--n 24] [--cols 6] [--out out/sheet.png]
import { createCanvas, GlobalFonts, loadImage } from '@napi-rs/canvas';
import { readFileSync } from 'fs';
import { loadAssets, ASSETS } from './core/assets';
import { readdirSync, mkdirSync, writeFileSync } from 'fs';
import { spawn } from 'child_process';
import { setCanvasFactory } from './core/draw';
import { drawFrame } from './core/film';
import { DURATION, FPS, W, H } from './core/time';
import './film/index';

for (const f of readdirSync('assets/fonts')) if (f.endsWith('.ttf')) GlobalFonts.registerFromPath(`assets/fonts/${f}`);
setCanvasFactory((w, h) => createCanvas(w, h) as any);
await loadAssets({ image: (p) => loadImage(p), json: async (p) => JSON.parse(readFileSync(p, 'utf8')) }, ASSETS);

const args = process.argv.slice(2);
const mode = args[0] ?? 'sheet';
const opt = (k: string, d?: string) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1]! : d; };
mkdirSync('out', { recursive: true });

const canvas = createCanvas(W, H);
const g = canvas.getContext('2d') as any;

function renderAt(t: number) { drawFrame(g, t); }

if (mode === 'stills') {
  const at = (opt('at') ?? '0').split(',').map(Number);
  const scale = Number(opt('scale', '1'));
  for (const t of at) {
    renderAt(t);
    const out = createCanvas(Math.round(W * scale), Math.round(H * scale));
    out.getContext('2d').drawImage(canvas, 0, 0, out.width, out.height);
    const p = `out/still-${t.toFixed(2)}.png`;
    writeFileSync(p, out.toBuffer('image/png'));
    console.log(p);
  }
} else if (mode === 'sheet') {
  const from = Number(opt('from', '0')), to = Number(opt('to', String(DURATION)));
  const n = Number(opt('n', '24')), cols = Number(opt('cols', '6'));
  const at = opt('at')?.split(',').map(Number) ?? Array.from({ length: n }, (_, i) => from + ((to - from) * (i + 0.5)) / n);
  const tw = 480, th = 270, rows = Math.ceil(at.length / cols);
  const sheet = createCanvas(cols * tw, rows * (th + 22));
  const sg = sheet.getContext('2d');
  sg.fillStyle = '#222'; sg.fillRect(0, 0, sheet.width, sheet.height);
  at.forEach((t, i) => {
    renderAt(t);
    const x = (i % cols) * tw, y = Math.floor(i / cols) * (th + 22);
    sg.drawImage(canvas, x, y, tw, th);
    sg.fillStyle = '#ddd'; sg.font = '14px "Source Code Pro"';
    sg.fillText(`${t.toFixed(2)}s  bar ${(t / 2).toFixed(2)}`, x + 6, y + th + 16);
  });
  const p = opt('out', 'out/sheet.png')!;
  writeFileSync(p, sheet.toBuffer('image/png'));
  console.log(p);
} else if (mode === 'video') {
  const from = Number(opt('from', '0')), to = Number(opt('to', String(DURATION)));
  const samples = Number(opt('samples', '1'));
  const shutter = Number(opt('shutter', '0.5'));
  const out = opt('out', 'out/film.mp4')!;
  const crf = opt('crf', '16')!;
  const audio = opt('audio', 'out/music.wav')!;
  const ff = spawn('ffmpeg', [
    '-y', '-v', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${W}x${H}`, '-r', String(FPS), '-i', '-',
    '-ss', String(from), '-t', String(to - from), '-i', audio,
    '-map', '0:v', '-map', '1:a',
    '-c:v', 'libx264', '-preset', opt('preset', 'slow')!, '-crf', crf, '-pix_fmt', 'yuv420p', '-tune', 'animation',
    '-c:a', 'aac', '-b:a', '320k', '-movflags', '+faststart', '-shortest', out,
  ], { stdio: ['pipe', 'inherit', 'inherit'] });
  const f0 = Math.round(from * FPS), f1 = Math.round(to * FPS);
  const acc = samples > 1 ? new Float32Array(W * H * 4) : null;
  const buf = Buffer.alloc(W * H * 4);
  const t0 = performance.now();
  const write = (b: Buffer) => new Promise<void>((res) => { if (ff.stdin.write(b)) res(); else ff.stdin.once('drain', () => res()); });
  for (let f = f0; f < f1; f++) {
    if (!acc) {
      renderAt(f / FPS);
      const d = g.getImageData(0, 0, W, H).data as Uint8ClampedArray;
      buf.set(d);
    } else {
      acc.fill(0);
      for (let s = 0; s < samples; s++) {
        renderAt((f + ((s + 0.5) / samples - 0.5) * shutter) / FPS);
        const d = g.getImageData(0, 0, W, H).data as Uint8ClampedArray;
        for (let i = 0; i < d.length; i++) acc[i]! += d[i]!;
      }
      for (let i = 0; i < buf.length; i++) buf[i] = acc[i]! / samples;
    }
    await write(buf);
    if ((f - f0) % 120 === 0) {
      const el = (performance.now() - t0) / 1000, done = (f - f0 + 1) / (f1 - f0);
      console.log(`frame ${f}/${f1}  ${(done * 100).toFixed(1)}%  ${el.toFixed(0)}s elapsed, eta ${(el / done - el).toFixed(0)}s`);
    }
  }
  ff.stdin.end();
  await new Promise((r) => ff.on('close', r));
  console.log(`wrote ${out} in ${((performance.now() - t0) / 1000).toFixed(0)} s`);
}
