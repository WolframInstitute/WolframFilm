// Incremental, parallel film build.
//   bun src/build.ts [--out out/film.mp4] [--samples n] [--preset medium] [--jobs 14] [--enc-jobs 4]
// 1. hash: workers draw every frame of every section (no encoding) and hash the pixels.
// 2. encode: only sections whose pixel hash is not in out/cache are encoded (in parallel).
// 3. stitch: stream-copy concat of the section files + the soundtrack.
import { spawn } from 'child_process';
import { existsSync, mkdirSync, writeFileSync, statSync, readdirSync, readFileSync, copyFileSync } from 'fs';
import { cpus } from 'os';
import { S, FPS, BARS, BAR } from './core/time';

const args = process.argv.slice(2);
const opt = (k: string, d?: string) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1]! : d; };
const OUT = opt('out', 'out/film.mp4')!;
const SAMPLES = opt('samples', '1')!, PRESET = opt('preset', 'medium')!, CRF = opt('crf', '16')!;
const JOBS = Number(opt('jobs', String(Math.max(2, cpus().length - 2))));
const ENC_JOBS = Number(opt('enc-jobs', '4'));
const CACHE = 'out/cache';
mkdirSync(CACHE, { recursive: true });

// sections -> frame ranges (contiguous, covering the whole film)
const bounds = [...new Set([0, ...Object.values(S).flatMap(([a, b]) => [a, b]), BARS])].sort((a, b) => a - b);
const segs = bounds.slice(0, -1).map((b, i) => ({ name: `s${String(i).padStart(2, '0')}`, f0: Math.round(b * BAR * FPS), f1: Math.round(bounds[i + 1]! * BAR * FPS) }))
  .filter((s) => s.f1 > s.f0);

function run(cmd: string[], capture = false): Promise<string> {
  return new Promise((res, rej) => {
    const p = spawn(cmd[0]!, cmd.slice(1), { stdio: ['ignore', capture ? 'pipe' : 'inherit', 'inherit'] });
    let out = '';
    p.stdout?.on('data', (d) => (out += d));
    p.on('close', (c) => (c === 0 ? res(out) : rej(new Error(`${cmd.join(' ')} -> ${c}`))));
  });
}
async function pool<T>(items: T[], n: number, f: (t: T) => Promise<void>) {
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => { while (i < items.length) await f(items[i++]!); }));
}

// 0. nothing changed at all? (source, assets, soundtrack, options) -> reuse the last build outright
function fingerprint() {
  const files: string[] = [];
  const walk = (d: string) => { for (const f of readdirSync(d, { withFileTypes: true })) { const p = `${d}/${f.name}`; f.isDirectory() ? walk(p) : files.push(p); } };
  for (const d of ['src', 'assets']) walk(d);
  files.push('out/music.wav');
  const h = new Bun.CryptoHasher('sha256');
  for (const f of files.sort()) { const st = statSync(f); h.update(`${f}:${st.size}:${st.mtimeMs}\n`); }
  h.update(`${SAMPLES}|${PRESET}|${CRF}`);
  return h.digest('hex');
}
const FP = fingerprint(), FP_FILE = `${CACHE}/last.json`;
if (!args.includes('--force') && existsSync(FP_FILE)) {
  const last = JSON.parse(readFileSync(FP_FILE, 'utf8'));
  if (last.fp === FP && existsSync(last.out)) {
    if (last.out !== OUT) copyFileSync(last.out, OUT);
    console.log(`nothing changed since the last build · ${OUT}`);
    process.exit(0);
  }
}
const t0 = performance.now();
const secs = () => ((performance.now() - t0) / 1000).toFixed(0) + 's';
// 1. hash
const hashes = new Map<string, string>();
await pool(segs, JOBS, async (s) => {
  const out = await run(['bun', 'src/render.ts', 'hash', '--f0', String(s.f0), '--f1', String(s.f1), '--samples', SAMPLES], true);
  const h = JSON.parse(out.trim().split('\n').pop()!).hash as string;
  hashes.set(s.name, `${h}-${SAMPLES}-${PRESET}-${CRF}`);
});
const file = (s: { name: string; f0: number; f1: number }) => `${CACHE}/${s.name}-${s.f0}-${s.f1}-${hashes.get(s.name)}.mp4`;
const todo = segs.filter((s) => !existsSync(file(s)) || statSync(file(s)).size === 0);
console.log(`hashed ${segs.length} sections in ${secs()} · ${segs.length - todo.length} cached · ${todo.length} to encode`);
// 2. encode changed sections
await pool(todo, ENC_JOBS, async (s) => {
  await run(['bun', 'src/render.ts', 'segment', '--f0', String(s.f0), '--f1', String(s.f1), '--samples', SAMPLES, '--preset', PRESET, '--crf', CRF, '--threads', String(Math.max(2, Math.floor(cpus().length / ENC_JOBS))), '--out', file(s)]);
  console.log(`  encoded ${s.name} (${((s.f1 - s.f0) / FPS).toFixed(1)} s) at ${secs()}`);
});
// 3. stitch + soundtrack
const list = `${CACHE}/concat.txt`;
writeFileSync(list, segs.map((s) => `file '${file(s).replace(`${CACHE}/`, '')}'`).join('\n') + '\n');
await run(['ffmpeg', '-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-i', 'out/music.wav', '-map', '0:v', '-map', '1:a',
  '-c:v', 'copy', '-c:a', 'aac', '-b:a', '320k', '-movflags', '+faststart', '-shortest', OUT]);
writeFileSync(FP_FILE, JSON.stringify({ fp: FP, out: OUT }));
console.log(`wrote ${OUT} in ${secs()}`);
