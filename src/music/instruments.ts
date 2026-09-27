// Instruments: each renders one note event into stereo buffers (dry + sends).
import { SR, Saw, SVF, Stereo, adsr, mtof, rng } from './dsp';
import type { Ev } from './score';
import { BAR } from '../core/time';

export interface Buses { drums: Stereo; music: Stereo; bass: Stereo; verb: Stereo; delay: Stereo }

const noise = rng(1234);
const nz = () => noise() * 2 - 1;

function put(b: Stereo, i: number, v: number, pan = 0) {
  if (i < 0 || i >= b.n) return;
  const a = (pan + 1) * Math.PI * 0.25; // equal power
  b.L[i]! += v * Math.cos(a); b.R[i]! += v * Math.sin(a);
}
function put2(b: Stereo, i: number, l: number, r: number) {
  if (i < 0 || i >= b.n) return;
  b.L[i]! += l; b.R[i]! += r;
}

export function render(e: Ev, B: Buses) {
  const t0 = Math.round(e.bar * BAR * SR);
  const hold = e.dur * BAR;
  const f = e.note !== undefined ? mtof(e.note) : 0;
  const v = e.vel;
  switch (e.inst) {
    case 'kick':
    case 'kickSoft': {
      const soft = e.inst === 'kickSoft';
      const len = Math.round((soft ? 0.35 : 0.5) * SR);
      let ph = 0;
      const lp = new SVF().set(soft ? 900 : 4000);
      for (let i = 0; i < len; i++) {
        const t = i / SR;
        const freq = 44 + (soft ? 90 : 170) * Math.exp(-t * 28);
        ph += freq / SR;
        let x = Math.sin(2 * Math.PI * ph) * Math.exp(-t * (soft ? 9 : 6.5));
        x = Math.tanh(x * 1.6);
        if (!soft && i < 0.004 * SR) x += nz() * 0.35 * (1 - i / (0.004 * SR));
        x = lp.run(x);
        put(B.drums, t0 + i, x * v * (soft ? 0.55 : 0.95));
      }
      break;
    }
    case 'clap': {
      const len = Math.round(0.35 * SR);
      const bp = new SVF().set(1300, 1.2), hp = new SVF().set(600);
      for (let i = 0; i < len; i++) {
        const t = i / SR;
        let env = 0;
        for (const k of [0, 0.011, 0.022]) if (t >= k) env = Math.max(env, Math.exp(-(t - k) * 180));
        if (t >= 0.03) env = Math.max(env, 0.6 * Math.exp(-(t - 0.03) * 16));
        bp.run(nz()); hp.run(bp.bp);
        const x = hp.hp * env * v * 0.9;
        put2(B.drums, t0 + i, x, x * 0.95);
        put(B.verb, t0 + i, x * 0.35);
      }
      break;
    }
    case 'hat':
    case 'ohat': {
      const open = e.inst === 'ohat';
      const len = Math.round((open ? 0.3 : 0.06) * SR);
      const hp = new SVF().set(open ? 7000 : 8500, 0.9);
      const pan = open ? 0.25 : -0.2;
      for (let i = 0; i < len; i++) {
        const t = i / SR;
        hp.run(nz());
        const x = hp.hp * Math.exp(-t * (open ? 11 : 70)) * v * (open ? 0.28 : 0.3);
        put(B.drums, t0 + i, x, pan);
      }
      break;
    }
    case 'crash': {
      const len = Math.round(2.6 * SR);
      const hpL = new SVF().set(3500), hpR = new SVF().set(3600);
      for (let i = 0; i < len; i++) {
        const t = i / SR;
        const env = Math.exp(-t * 1.6) * (1 - Math.exp(-t * 400));
        hpL.run(nz()); hpR.run(nz());
        put2(B.drums, t0 + i, hpL.hp * env * v * 0.22, hpR.hp * env * v * 0.22);
        put(B.verb, t0 + i, (hpL.hp + hpR.hp) * env * v * 0.05);
      }
      break;
    }
    case 'riser': {
      const len = Math.round(hold * SR);
      const bpL = new SVF(), bpR = new SVF();
      for (let i = 0; i < len; i++) {
        const u = i / len;
        const fc = 250 * Math.pow(40, u);
        if (i % 32 === 0) { bpL.set(fc, 2.5); bpR.set(fc * 1.03, 2.5); }
        bpL.run(nz()); bpR.run(nz());
        const env = Math.pow(u, 2.2) * v * 0.55;
        put2(B.drums, t0 + i, bpL.bp * env, bpR.bp * env);
        put(B.verb, t0 + i, (bpL.bp + bpR.bp) * env * 0.3);
      }
      break;
    }
    case 'roll': {
      // accelerating snare roll with crescendo
      const dur = hold;
      let t = 0, k = 0;
      while (t < dur) {
        const u = t / dur;
        const step = BAR / (u < 0.5 ? 8 : u < 0.75 ? 16 : 32);
        snare(B, t0 + Math.round(t * SR), v * (0.25 + 0.75 * u * u));
        t += step; k++;
      }
      break;
    }
    case 'impact': {
      const len = Math.round(2.2 * SR);
      let ph = 0;
      const lp = new SVF().set(300);
      for (let i = 0; i < len; i++) {
        const t = i / SR;
        const freq = 30 + 60 * Math.exp(-t * 3);
        ph += freq / SR;
        const sub = Math.sin(2 * Math.PI * ph) * Math.exp(-t * 1.8);
        const boom = lp.run(nz()) * Math.exp(-t * 5) * 1.5;
        const x = Math.tanh((sub + boom) * 1.3) * v * 0.7;
        put(B.drums, t0 + i, x);
        put(B.verb, t0 + i, boom * v * 0.25);
      }
      break;
    }
    case 'tick': {
      // a key press: short bright click with a little body
      const len = Math.round(0.03 * SR);
      const hp = new SVF().set(2800, 0.8);
      const pan = -0.25 + 0.5 * ((e.bar * 977) % 1);
      for (let i = 0; i < len; i++) {
        const t = i / SR;
        hp.run(nz());
        const x = (hp.hp * Math.exp(-t * 420) + Math.sin(2 * Math.PI * 1900 * t) * Math.exp(-t * 300) * 0.3) * v * 0.22;
        put(B.drums, t0 + i, x, pan);
      }
      break;
    }
    case 'blip': {
      const len = Math.round(0.12 * SR);
      for (let i = 0; i < len; i++) {
        const t = i / SR;
        const x = Math.sin(2 * Math.PI * (f || 1568) * t) * Math.exp(-t * 38) * v * 0.12;
        put(B.music, t0 + i, x, 0.15);
        put(B.verb, t0 + i, x * 0.4);
      }
      break;
    }
    case 'pluck':
    case 'arp': {
      const arp = e.inst === 'arp';
      const len = Math.round((arp ? 0.35 : 0.9) * SR);
      const o1 = new Saw(0), o2 = new Saw(0.37);
      const lp = new SVF();
      const pan = arp ? Math.sin(e.bar * 37) * 0.6 : Math.sin(e.bar * 13.7) * 0.35;
      for (let i = 0; i < len; i++) {
        const t = i / SR;
        if (i % 16 === 0) lp.set(350 + 5200 * Math.exp(-t * (arp ? 18 : 11)), 1.1);
        const x = (o1.next(f / SR) * 0.6 + o2.next((f * 1.004) / SR) * 0.4);
        const y = lp.run(x) * Math.exp(-t * (arp ? 9 : 4.2)) * Math.min(1, t * 400) * v * 0.32;
        put(B.music, t0 + i, y, pan);
        put(B.verb, t0 + i, y * 0.45);
        put(B.delay, t0 + i, y * (arp ? 0.35 : 0.55));
      }
      break;
    }
    case 'pad': {
      const rel = 0.9;
      const len = Math.round((hold + rel) * SR);
      const voices = 5;
      const osc = Array.from({ length: voices }, (_, k) => new Saw((k * 0.237) % 1));
      const det = [-0.11, -0.05, 0, 0.05, 0.11];
      const lpL = new SVF().set(2200, 0.6), lpR = new SVF().set(2200, 0.6);
      for (let i = 0; i < len; i++) {
        const t = i / SR;
        const env = adsr(t, hold, 0.35, 0.5, 0.8, rel);
        let l = 0, r = 0;
        for (let k = 0; k < voices; k++) {
          const s = osc[k]!.next((f * Math.pow(2, det[k]! / 12)) / SR);
          const p = (k / (voices - 1)) * 2 - 1;
          l += s * (1 - p) * 0.5; r += s * (1 + p) * 0.5;
        }
        const g = env * v * 0.075;
        const yl = lpL.run(l) * g, yr = lpR.run(r) * g;
        put2(B.music, t0 + i, yl, yr);
        put2(B.verb, t0 + i, yl * 0.6, yr * 0.6);
      }
      break;
    }
    case 'bass': {
      const long = e.p?.long === 1;
      const len = Math.round((hold + (long ? 1.2 : 0.05)) * SR);
      const o = new Saw();
      let ph = 0;
      const lp = new SVF();
      for (let i = 0; i < len; i++) {
        const t = i / SR;
        if (i % 16 === 0) lp.set(long ? 400 : 180 + 1400 * Math.exp(-t * 22), 1.2);
        ph += f / SR;
        const sub = Math.sin(2 * Math.PI * ph);
        const env = long ? adsr(t, hold, 0.01, 0.3, 0.8, 1.2) : adsr(t, hold, 0.003, 0.08, 0.7, 0.04);
        const y = (lp.run(o.next(f / SR)) * 0.55 + sub * 0.6) * env * v * 0.42;
        put(B.bass, t0 + i, Math.tanh(y * 1.5) / 1.5);
      }
      break;
    }
    case 'stab':
    case 'lead': {
      const lead = e.inst === 'lead';
      const rel = lead ? 0.25 : 0.12;
      const len = Math.round((hold + rel) * SR);
      const voices = 7;
      const det = [-0.19, -0.12, -0.05, 0, 0.05, 0.12, 0.19];
      const osc = Array.from({ length: voices }, (_, k) => new Saw((k * 0.1713) % 1));
      const lpL = new SVF(), lpR = new SVF();
      for (let i = 0; i < len; i++) {
        const t = i / SR;
        if (i % 16 === 0) {
          const fc = lead ? 2600 + 5000 * Math.exp(-t * 6) : 1200 + 6000 * Math.exp(-t * 25);
          lpL.set(fc, 0.8); lpR.set(fc, 0.8);
        }
        const vib = lead ? 1 + 0.004 * Math.sin(2 * Math.PI * 5.5 * t) * Math.min(1, t * 3) : 1;
        let l = 0, r = 0;
        for (let k = 0; k < voices; k++) {
          const s = osc[k]!.next((f * vib * Math.pow(2, det[k]! / 12)) / SR);
          const p = (k / (voices - 1)) * 2 - 1;
          l += s * (1 - p * 0.9) * 0.5; r += s * (1 + p * 0.9) * 0.5;
        }
        const env = lead ? adsr(t, hold, 0.008, 0.2, 0.75, rel) : adsr(t, hold, 0.002, 0.06, 0.4, rel);
        const g = env * v * (lead ? 0.085 : 0.05);
        const yl = lpL.run(l) * g, yr = lpR.run(r) * g;
        put2(B.music, t0 + i, yl, yr);
        put2(B.verb, t0 + i, yl * 0.35, yr * 0.35);
        if (lead) put2(B.delay, t0 + i, yl * 0.35, yr * 0.35);
      }
      break;
    }
    case 'bell': {
      // 2-op FM electric bell
      const len = Math.round((hold + 1.6) * SR);
      let pc = 0, pm = 0;
      for (let i = 0; i < len; i++) {
        const t = i / SR;
        pm += (f * 3.5) / SR; pc += f / SR;
        const idx = 2.2 * Math.exp(-t * 5);
        const x = Math.sin(2 * Math.PI * pc + idx * Math.sin(2 * Math.PI * pm));
        let pm2 = Math.sin(2 * Math.PI * pc * 2.0) * 0.25 * Math.exp(-t * 3);
        const env = Math.exp(-t * (t < hold ? 1.6 : 4)) * Math.min(1, t * 800);
        const y = (x + pm2) * env * v * 0.16;
        put(B.music, t0 + i, y, 0.1);
        put(B.verb, t0 + i, y * 0.5);
        put(B.delay, t0 + i, y * 0.45);
      }
      break;
    }
    case 'voice': {
      // formant "voice": a machine singing vowels
      const rel = 0.3;
      const len = Math.round((hold + rel) * SR);
      const o = new Saw();
      const F = [new SVF(), new SVF(), new SVF()];
      const vowels = [[800, 1150, 2900], [400, 1700, 2600], [350, 2000, 2800], [450, 800, 2830], [325, 700, 2530]];
      const vi = Math.floor(e.bar * 4) % vowels.length;
      const va = vowels[vi]!, vb = vowels[(vi + 1) % vowels.length]!;
      const gains = [1, 0.5, 0.25];
      for (let i = 0; i < len; i++) {
        const t = i / SR;
        const u = Math.min(1, t / Math.max(0.2, hold));
        if (i % 32 === 0) for (let k = 0; k < 3; k++) F[k]!.set(va[k]! + (vb[k]! - va[k]!) * u, 9);
        const vib = 1 + 0.006 * Math.sin(2 * Math.PI * 5.2 * t) * Math.min(1, t * 2);
        const src = o.next((f * vib) / SR) + nz() * 0.04;
        let y = 0;
        for (let k = 0; k < 3; k++) { F[k]!.run(src); y += F[k]!.bp * F[k]!.k * gains[k]!; }
        const env = adsr(t, hold, 0.06, 0.2, 0.85, rel);
        y *= env * v * 0.9;
        put(B.music, t0 + i, y, -0.1);
        put(B.verb, t0 + i, y * 0.55);
        put(B.delay, t0 + i, y * 0.4);
      }
      break;
    }
  }
}

function snare(B: Buses, i0: number, v: number) {
  const len = Math.round(0.16 * SR);
  const bp = new SVF().set(2500, 0.8);
  let ph = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    ph += 190 / SR;
    const tone = Math.sin(2 * Math.PI * ph) * Math.exp(-t * 30) * 0.5;
    bp.run(nz());
    const x = (bp.bp * Math.exp(-t * 22) + tone) * v * 0.35;
    put(B.drums, i0 + i, x, 0.05);
    put(B.verb, i0 + i, x * 0.3);
  }
}
