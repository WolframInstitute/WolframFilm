// Small offline DSP kit: oscillators, filters, envelopes, reverb, delay. Deterministic.
export const SR = 48000;

export class Stereo {
  L: Float32Array; R: Float32Array;
  constructor(public n: number) { this.L = new Float32Array(n); this.R = new Float32Array(n); }
}

export const mtof = (m: number) => 440 * Math.pow(2, (m - 69) / 12);
export const dbToGain = (db: number) => Math.pow(10, db / 20);

export function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** PolyBLEP band-limited sawtooth. */
export class Saw {
  ph: number; constructor(phase = 0) { this.ph = phase; }
  next(inc: number) {
    let t = this.ph; this.ph += inc; if (this.ph >= 1) this.ph -= 1;
    let v = 2 * t - 1;
    if (t < inc) { const x = t / inc; v -= x + x - x * x - 1; }
    else if (t > 1 - inc) { const x = (t - 1) / inc; v -= x * x + x + x + 1; }
    return v;
  }
}

/** TPT state-variable filter (Zavalishin). */
export class SVF {
  ic1 = 0; ic2 = 0; g = 0; k = 1; a1 = 0; a2 = 0; a3 = 0;
  lp = 0; bp = 0; hp = 0;
  set(fc: number, q = 0.707) {
    fc = Math.min(Math.max(fc, 10), SR * 0.45);
    this.g = Math.tan((Math.PI * fc) / SR); this.k = 1 / q;
    this.a1 = 1 / (1 + this.g * (this.g + this.k)); this.a2 = this.g * this.a1; this.a3 = this.g * this.a2;
    return this;
  }
  run(v0: number) {
    const v3 = v0 - this.ic2;
    const v1 = this.a1 * this.ic1 + this.a2 * v3;
    const v2 = this.ic2 + this.a2 * this.ic1 + this.a3 * v3;
    this.ic1 = 2 * v1 - this.ic1; this.ic2 = 2 * v2 - this.ic2;
    this.lp = v2; this.bp = v1; this.hp = v0 - this.k * v1 - v2;
    return v2;
  }
}

/** Classic ADSR evaluated at time t (s) for a note held for `hold` seconds. */
export function adsr(t: number, hold: number, a: number, d: number, s: number, r: number) {
  let v: number;
  const env = (tt: number) => (tt < a ? tt / a : tt < a + d ? 1 - (1 - s) * ((tt - a) / d) : s);
  if (t < hold) v = env(t);
  else { const rel = t - hold; v = env(hold) * Math.max(0, 1 - rel / r); v *= v > 0 ? 1 : 0; }
  return v;
}

// ------------------------------------------------------------------ Freeverb
class Comb {
  buf: Float32Array; i = 0; store = 0;
  constructor(n: number, public fb: number, public damp: number) { this.buf = new Float32Array(n); }
  run(x: number) {
    const y = this.buf[this.i]!;
    this.store = y * (1 - this.damp) + this.store * this.damp;
    this.buf[this.i] = x + this.store * this.fb;
    if (++this.i >= this.buf.length) this.i = 0;
    return y;
  }
}
class Allpass {
  buf: Float32Array; i = 0;
  constructor(n: number) { this.buf = new Float32Array(n); }
  run(x: number) {
    const b = this.buf[this.i]!;
    this.buf[this.i] = x + b * 0.5;
    if (++this.i >= this.buf.length) this.i = 0;
    return b - x;
  }
}
export function freeverb(src: Stereo, room = 0.86, damp = 0.35, wet = 1, predelay = 0.02): Stereo {
  const scale = SR / 44100;
  const combs = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617];
  const aps = [556, 441, 341, 225];
  const spread = 23;
  const mk = (off: number) => ({
    c: combs.map((n) => new Comb(Math.round((n + off) * scale), room, damp)),
    a: aps.map((n) => new Allpass(Math.round((n + off) * scale))),
  });
  const L = mk(0), R = mk(spread);
  const out = new Stereo(src.n);
  const pd = Math.round(predelay * SR);
  for (let i = 0; i < src.n; i++) {
    const j = i - pd;
    const x = j >= 0 ? (src.L[j]! + src.R[j]!) * 0.015 : 0;
    let l = 0, r = 0;
    for (const c of L.c) l += c.run(x);
    for (const c of R.c) r += c.run(x);
    for (const a of L.a) l = a.run(l);
    for (const a of R.a) r = a.run(r);
    out.L[i] = l * wet; out.R[i] = r * wet;
  }
  return out;
}

/** Ping-pong delay with a low-passed feedback path. */
export function pingpong(src: Stereo, time: number, fb = 0.45, lpHz = 3500): Stereo {
  const n = Math.round(time * SR);
  const bl = new Float32Array(n), br = new Float32Array(n);
  const fl = new SVF().set(lpHz), fr = new SVF().set(lpHz);
  const out = new Stereo(src.n);
  let i = 0;
  for (let s = 0; s < src.n; s++) {
    const dl = bl[i]!, dr = br[i]!;
    const inp = (src.L[s]! + src.R[s]!) * 0.5;
    bl[i] = inp + fl.run(dr) * fb;
    br[i] = fr.run(dl) * fb;
    out.L[s] = dl; out.R[s] = dr;
    if (++i >= n) i = 0;
  }
  return out;
}

export function mixInto(dst: Stereo, src: Stereo, g = 1) {
  for (let i = 0; i < dst.n; i++) { dst.L[i]! += src.L[i]! * g; dst.R[i]! += src.R[i]! * g; }
}

/** Lookahead brickwall-ish limiter with smooth release. */
export function limit(buf: Stereo, ceiling = 0.89, lookahead = 0.005, release = 0.12) {
  const la = Math.round(lookahead * SR);
  const n = buf.n;
  const need = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const p = Math.max(Math.abs(buf.L[i]!), Math.abs(buf.R[i]!));
    need[i] = p > ceiling ? ceiling / p : 1;
  }
  // min over the lookahead window (running, simple O(n·la) is fine for la ~ 240)
  const gmin = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let m = 1;
    const end = Math.min(n - 1, i + la);
    for (let j = i; j <= end; j++) if (need[j]! < m) m = need[j]!;
    gmin[i] = m;
  }
  const rel = Math.exp(-1 / (release * SR));
  let g = 1;
  for (let i = 0; i < n; i++) {
    const target = gmin[i]!;
    g = target < g ? target : target + (g - target) * rel;
    buf.L[i]! *= g; buf.R[i]! *= g;
  }
}

export function writeWav(path: string, buf: Stereo) {
  const n = buf.n, bytes = n * 2 * 3;
  const out = Buffer.alloc(44 + bytes);
  out.write('RIFF', 0); out.writeUInt32LE(36 + bytes, 4); out.write('WAVE', 8);
  out.write('fmt ', 12); out.writeUInt32LE(16, 16); out.writeUInt16LE(1, 20); out.writeUInt16LE(2, 22);
  out.writeUInt32LE(SR, 24); out.writeUInt32LE(SR * 6, 28); out.writeUInt16LE(6, 32); out.writeUInt16LE(24, 34);
  out.write('data', 36); out.writeUInt32LE(bytes, 40);
  let o = 44;
  const dither = rng(7);
  for (let i = 0; i < n; i++) for (const ch of [buf.L, buf.R]) {
    let v = Math.round(Math.max(-1, Math.min(1, ch[i]!)) * 8388607 + (dither() - dither()));
    v = Math.max(-8388608, Math.min(8388607, v));
    out.writeIntLE(v, o, 3); o += 3;
  }
  require('fs').writeFileSync(path, out);
}
