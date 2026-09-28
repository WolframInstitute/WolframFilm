// bun src/music/render-audio.ts  ->  out/music.wav, out/score.json
import { mkdirSync, writeFileSync, readFileSync } from 'fs';
import { SR, Stereo, SVF, freeverb, pingpong, mixInto, limit, writeWav } from './dsp';
import { render, type Buses } from './instruments';
import { SCORE, musicCutoff, type Ev } from './score';
import { ERAS } from '../film/story';
import { S as SEC } from '../core/time';
const DEPLOY_TYPING = [{ at: SEC.outro[0] + 1.6, type: 0.6, text: 'CopyFile["out/film.mp4", CloudObject["WolframFilm/In1.mp4", Permissions -> "Public"]]' }];
import { BAR, BEAT, DURATION } from '../core/time';

const t0 = performance.now();
const N = Math.round(DURATION * SR);
const B: Buses = { drums: new Stereo(N), music: new Stereo(N), bass: new Stereo(N), verb: new Stereo(N), delay: new Stereo(N) };
// foley from the picture: key clicks for typed input, a blip when a cell evaluates
const foley: Ev[] = [];
const typing = (at: number, dur: number, chars: number) => {
  let last = -1;
  for (let k = 0; k < chars; k++) {
    const b = Math.round((at + (k / chars) * dur) * 64) / 64;
    if (b - last < 1 / 40) continue;
    last = b;
    foley.push({ bar: b, dur: 0.01, inst: 'tick', vel: 0.55 + 0.45 * ((k * 0.618) % 1) });
  }
};
typing(0.5, 2.1, 39); // cold open
for (const [a, n] of [[4.1, 22], [4.9, 36]] as const) typing(a, 0.4, n); // SMP
typing(6.5, 0.3, 23); typing(6.8, 0.45, 41); typing(7.2, 0.35, 33);
for (const c of DEPLOY_TYPING) { typing(c.at, c.type, c.text.length); foley.push({ bar: c.at + c.type + 1 / 16, dur: 0.01, inst: 'tick', vel: 1 }); }
for (const e of ERAS) for (const c of e.cells) {
  if (c.kind === 'input' && c.type && c.text) { typing(c.at, c.type, c.text.length); foley.push({ bar: c.at + c.type + 1 / 16, dur: 0.01, inst: 'tick', vel: 1 }); }
  if (c.kind === 'output' || (c.kind === 'custom' && c.n !== undefined)) foley.push({ bar: c.at, dur: 0.05, inst: 'blip', vel: 1, note: 91 });
}
for (const e of [...SCORE, ...foley]) render(e, B);
// the 2.0 cell's Play[Sin[1000 t (1 + t)] Sin[2 Pi t], {t, 0, 1.5}]: the kernel's own samples, heard when the cell evaluates
{
  const wav = readFileSync('assets/wl/x_play.wav');
  let off = 12, fmt: any = null, data: Buffer | null = null;
  while (off + 8 <= wav.length) {
    const id = wav.toString('ascii', off, off + 4), size = wav.readUInt32LE(off + 4);
    if (id === 'fmt ') fmt = { ch: wav.readUInt16LE(off + 10), rate: wav.readUInt32LE(off + 12), bits: wav.readUInt16LE(off + 22) };
    if (id === 'data') data = wav.subarray(off + 8, off + 8 + size);
    off += 8 + size + (size & 1);
  }
  if (fmt && data && fmt.bits === 16) {
    const n = data.length / 2 / fmt.ch, i0 = Math.round((SEC.v2[0] + 0.45) * BAR * SR);
    for (let i = 0; i < n; i++) {
      const v = (data.readInt16LE(i * 2 * fmt.ch) / 32768) * 0.14 * Math.min(1, i / 400, (n - i) / 2000);
      const j = i0 + Math.round((i * SR) / fmt.rate);
      if (j < N) { B.music.L[j]! += v; B.music.R[j]! += v; }
    }
  } else console.warn('x_play.wav: unexpected format', fmt);
}
console.log(`notes: ${SCORE.length}  (${((performance.now() - t0) / 1000).toFixed(1)} s)`);

// sidechain envelope from the kicks
const kicks = SCORE.filter((e) => e.inst === 'kick').map((e) => e.bar * BAR);
const duck = new Float32Array(N).fill(1);
for (const k of kicks) {
  const i0 = Math.round(k * SR), len = Math.round(0.28 * SR);
  for (let i = 0; i < len && i0 + i < N; i++) {
    const t = i / SR;
    const g = 1 - Math.exp(-Math.pow(t / 0.09, 2) * 0) * Math.exp(-t / 0.085);
    duck[i0 + i] = Math.min(duck[i0 + i]!, Math.max(0, g));
  }
}
const applyDuck = (b: Stereo, depth: number) => {
  for (let i = 0; i < N; i++) { const g = 1 - depth * (1 - duck[i]!); b.L[i]! *= g; b.R[i]! *= g; }
};

// automated low-pass on the music bus
{
  const fl = new SVF(), fr = new SVF();
  for (let i = 0; i < N; i++) {
    if (i % 32 === 0) { const fc = musicCutoff(i / SR / BAR); fl.set(fc, 0.9); fr.set(fc, 0.9); }
    B.music.L[i] = fl.run(B.music.L[i]!); B.music.R[i] = fr.run(B.music.R[i]!);
  }
}
applyDuck(B.music, 0.55);
applyDuck(B.bass, 0.8);

const del = pingpong(B.delay, BEAT * 0.75, 0.42, 3200);
mixInto(B.verb, del, 0.25);
const verb = freeverb(B.verb, 0.88, 0.3, 1, 0.025);
applyDuck(verb, 0.35);

const mix = new Stereo(N);
mixInto(mix, B.drums, 1);
mixInto(mix, B.music, 1);
mixInto(mix, B.bass, 1);
mixInto(mix, del, 0.45);
mixInto(mix, verb, 0.9);

// master: DC/rumble high-pass, soft saturation, limiter, tail fade
{
  const hl = new SVF().set(28), hr = new SVF().set(28);
  for (let i = 0; i < N; i++) {
    hl.run(mix.L[i]!); hr.run(mix.R[i]!);
    mix.L[i] = hl.hp; mix.R[i] = hr.hp;
  }
  // makeup gain from the 99.5th percentile of |x| (robust to isolated peaks)
  const mags = new Float32Array(N);
  for (let i = 0; i < N; i++) mags[i] = Math.max(Math.abs(mix.L[i]!), Math.abs(mix.R[i]!));
  mags.sort();
  const pre = 1.0 / Math.max(mags[Math.floor(N * 0.995)]!, 1e-6);
  const drive = 1.4;
  for (let i = 0; i < N; i++) {
    mix.L[i] = Math.tanh(mix.L[i]! * pre * drive) / drive;
    mix.R[i] = Math.tanh(mix.R[i]! * pre * drive) / drive;
  }
  limit(mix, 0.891);
  const fadeStart = DURATION - 2.5;
  for (let i = Math.round(fadeStart * SR); i < N; i++) {
    const u = (i / SR - fadeStart) / 2.5;
    const g = Math.cos(u * Math.PI * 0.5);
    mix.L[i]! *= g; mix.R[i]! *= g;
  }
}

mkdirSync('out', { recursive: true });
writeWav('out/music.wav', mix);
writeFileSync('out/score.json', JSON.stringify(SCORE));
console.log(`done in ${((performance.now() - t0) / 1000).toFixed(1)} s`);
