// The score, as data. Times are in bars (absolute, fractional); durations in bars.
// Everything the visuals sync to (kicks, crashes, the slider, the melody) comes from here.
import { BARS } from '../core/time';

export type Inst =
  | 'kick' | 'kickSoft' | 'clap' | 'hat' | 'ohat' | 'crash' | 'riser' | 'impact' | 'roll'
  | 'pluck' | 'pad' | 'bass' | 'stab' | 'lead' | 'bell' | 'voice' | 'arp' | 'tick' | 'blip';

export interface Ev { bar: number; dur: number; inst: Inst; note?: number; vel: number; p?: Record<string, number> }

// ---------------------------------------------------------------- harmony
// i–VI–III–VII in A minor; +2 semitones from the climax on.
const CHORDS = [
  { root: 45, tones: [57, 60, 64] }, // Am
  { root: 41, tones: [57, 60, 65] }, // F
  { root: 48, tones: [55, 60, 64] }, // C
  { root: 43, tones: [55, 59, 62] }, // G
];
export const LIFT_BAR = 60;
export const transposeAt = (bar: number) => (bar >= LIFT_BAR ? 2 : 0);
export const chordAt = (bar: number) => {
  const c = CHORDS[((Math.floor(bar) % 4) + 4) % 4]!;
  const k = transposeAt(bar);
  return { root: c.root + k, tones: c.tones.map((n) => n + k) };
};
const PENTA = [69, 72, 74, 76, 79, 81, 84, 86]; // A minor pentatonic, A4..D6

// ---------------------------------------------------------------- Rule 30
// Centre column of CellularAutomaton[30] from a single black cell.
export function rule30Column(n: number): number[] {
  const w = 2 * n + 3;
  let row = new Uint8Array(w);
  row[n + 1] = 1;
  const out: number[] = [];
  for (let t = 0; t < n; t++) {
    out.push(row[n + 1]!);
    const nx = new Uint8Array(w);
    for (let i = 1; i < w - 1; i++) {
      const l = row[i - 1]!, c = row[i]!, r = row[i + 1]!;
      nx[i] = l ^ (c | r); // rule 30
    }
    row = nx;
  }
  return out;
}
const R30 = rule30Column(4000);

// ---------------------------------------------------------------- melodies (beats, midi)
// The hook: 4 bars over Am F C G.
export const HOOK: [number, number, number][] = [
  // [beat within 4-bar phrase, length in beats, midi]
  [0, 1.5, 69], [1.5, 0.5, 72], [2, 1, 76], [3, 1, 74],
  [4, 1.5, 72], [5.5, 0.5, 69], [6, 1, 72], [7, 1, 77],
  [8, 1.5, 76], [9.5, 0.5, 74], [10, 1, 72], [11, 1, 67],
  [12, 1, 71], [13, 1, 74], [14, 1.5, 79], [15.5, 0.5, 76],
];
const HOOK_B: [number, number, number][] = [
  [0, 1.5, 76], [1.5, 0.5, 74], [2, 1, 76], [3, 1, 81],
  [4, 1.5, 77], [5.5, 0.5, 76], [6, 1, 72], [7, 1, 69],
  [8, 1, 67], [9, 1, 72], [10, 1, 76], [11, 1, 79],
  [12, 2, 79], [14, 1, 74], [15, 1, 71],
];
const VOICE: [number, number, number][] = [
  [0, 2, 76], [2, 1, 72], [3, 1, 74],
  [4, 3, 72], [7, 1, 69],
  [8, 2, 67], [10, 1, 72], [11, 1, 76],
  [12, 4, 74],
];

// ---------------------------------------------------------------- automation
/** The Manipulate slider in the 6.0 scene (bars 28–32), 0..1. Holds and snaps. */
export function slider(bar: number): number {
  const keys: [number, number][] = [
    [28, 0.15], [28.5, 0.15], [29, 0.9], [29.5, 0.9], [29.75, 0.35], [30.25, 0.35], [30.75, 1], [31.5, 1], [32, 0.6],
  ];
  if (bar <= keys[0]![0]) return keys[0]![1];
  for (let i = 1; i < keys.length; i++) {
    const [b1, v1] = keys[i]!, [b0, v0] = keys[i - 1]!;
    if (bar <= b1) {
      const u = (bar - b0) / (b1 - b0);
      const e = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
      return v0 + (v1 - v0) * e;
    }
  }
  return keys[keys.length - 1]![1];
}

/** Low-pass cutoff (Hz) of the music bus (not drums). */
export function musicCutoff(bar: number): number {
  if (bar < 4) return 5000;
  if (bar >= 28 && bar < 32) return 220 * Math.pow(70, slider(bar));
  if (bar >= 35 && bar < 37) return 700 * Math.pow(24, Math.pow((bar - 35) / 2, 2));
  if (bar >= 52 && bar < 54) return 900 + 400 * Math.sin((bar - 52) * Math.PI * 0.5);
  return 18000;
}

// ---------------------------------------------------------------- arrangement
export const SECTIONS = {
  intro: [0, 4], smp: [4, 8], y1986: [8, 10], name: [10, 12], v1: [12, 16], next: [16, 18], grammar: [18, 20],
  v2: [20, 22], v3: [22, 24], v4: [24, 26], v5: [26, 28], v6: [28, 32], v7: [32, 33], v8: [33, 34], v9: [34, 35],
  breakdown: [35, 37], wl: [37, 45], v11: [45, 46], v12: [46, 47], v13: [47, 48], llm: [48, 52], v14: [52, 54],
  v15: [54, 60], climax: [60, 68], outro: [68, 75],
} as const;

function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildScore(): Ev[] {
  const ev: Ev[] = [];
  const r = rng(30);
  const add = (bar: number, dur: number, inst: Inst, vel = 1, note?: number, p?: Record<string, number>) =>
    ev.push({ bar, dur, inst, vel, note, p });
  const inRange = (b: number, a: number, z: number) => b >= a && b < z;

  // --- Rule 30 pluck melody: 8th notes, three bits pick a pentatonic degree, one bit gates
  const pluckOn = (b: number) => b < 37 || inRange(b, 45, 48) || b >= 68;
  for (let s = 0; s < BARS * 8; s++) {
    const bar = s / 8;
    if (!pluckOn(bar)) continue;
    if (inRange(bar, 35, 37) || inRange(bar, 56, 60)) continue;
    const gate = R30[s * 4 + 3]!;
    const onBeat = s % 8 === 0;
    if (!gate && !onBeat) continue;
    let deg = R30[s * 4]! * 4 + R30[s * 4 + 1]! * 2 + R30[s * 4 + 2]!;
    const k = transposeAt(bar);
    let note = PENTA[deg]! + k;
    if (onBeat) note = chordAt(bar).tones[0]! + 12; // anchor each bar on the chord
    const outroFade = bar >= 68 ? Math.max(0, 1 - (bar - 69) / 6) : 1;
    const vel = (onBeat ? 0.9 : 0.55 + 0.3 * r()) * (bar < 12 ? 1 : 0.6) * outroFade;
    if (vel > 0.02) add(bar, 1 / 8, 'pluck', vel, note);
  }

  // --- Pads: one chord per bar
  for (let b = 4; b < 68; b++) {
    if (inRange(b, 8, 10) && false) continue;
    const vel = b < 12 ? 0.55 : inRange(b, 35, 37) ? 0.8 : inRange(b, 52, 54) ? 0.7 : 0.6;
    for (const n of chordAt(b).tones) add(b, 1, 'pad', vel, n);
  }
  // final chord
  for (const n of [...chordAt(68).tones, chordAt(68).tones[0]! + 12]) add(68, 4, 'pad', 0.9, n);
  add(68, 4, 'bass', 0.9, chordAt(68).root, { long: 1 });

  // --- Kicks
  const kickBars = (b: number) =>
    inRange(b, 12, 35) || inRange(b, 37, 52) || inRange(b, 52, 54) || inRange(b, 54, 60) || inRange(b, 60, 68);
  for (let b = 8; b < 11; b++) for (const q of [0, 2]) add(b + q / 4, 0.25, 'kickSoft', 0.8);
  add(11, 0.25, 'kickSoft', 0.8); add(11.5, 0.25, 'kickSoft', 0.7);
  for (let b = 12; b < 68; b++) {
    if (!kickBars(b)) continue;
    for (let q = 0; q < 4; q++) {
      const bar = b + q / 4;
      if (inRange(bar, 58.75, 60)) continue; // gap into the climax
      if (inRange(bar, 54, 56) && q % 2 === 1) continue; // half-time into v15
      add(bar, 0.25, 'kick', 1);
    }
  }
  add(68, 0.25, 'kick', 1);

  // --- Claps on 2 and 4
  for (let b = 12; b < 68; b++) {
    if (!kickBars(b) || inRange(b, 52, 54) || inRange(b, 54, 56)) continue;
    add(b + 0.25, 0.25, 'clap', 0.8); add(b + 0.75, 0.25, 'clap', 0.85);
  }

  // --- Hats
  for (let s = 12 * 16; s < 68 * 16; s++) {
    const bar = s / 16;
    const b = Math.floor(bar);
    if (!kickBars(b) || inRange(b, 52, 54)) continue;
    if (inRange(bar, 58.75, 60)) continue;
    const sixteenths = inRange(b, 24, 35) || inRange(b, 37, 48) || inRange(b, 60, 68);
    const i = s % 4;
    if (i === 2) add(bar, 1 / 16, 'hat', 0.75 + 0.2 * r());
    else if (sixteenths) add(bar, 1 / 16, 'hat', (i === 0 ? 0.35 : 0.45) + 0.15 * r());
    if (i === 2 && (inRange(b, 37, 45) || inRange(b, 60, 68))) add(bar, 1 / 8, 'ohat', 0.45);
  }

  // --- Bass: offbeat octave pump in the drops, quarter roots elsewhere
  for (let s = 12 * 8; s < 68 * 8; s++) {
    const bar = s / 8, b = Math.floor(bar);
    if (!kickBars(b) || inRange(bar, 58.75, 60)) continue;
    const root = chordAt(b).root;
    const drop = inRange(b, 12, 20) || inRange(b, 37, 45) || inRange(b, 60, 68);
    if (drop) { if (s % 2 === 1) add(bar, 1 / 8, 'bass', 0.9, root + (s % 4 === 3 ? 12 : 0)); }
    else if (s % 2 === 0) add(bar, 1 / 8, 'bass', 0.8, root);
  }

  // --- Stabs: chord hits on the drop rhythm (dotted pattern)
  const stabPattern = [0, 3, 6, 10, 12]; // 16th positions within a bar
  for (let b = 12; b < 68; b++) {
    const on = inRange(b, 12, 18) || inRange(b, 37, 45) || inRange(b, 60, 68);
    if (!on) continue;
    for (const p of stabPattern) for (const n of chordAt(b).tones) add(b + p / 16, 1 / 16, 'stab', 0.5, n + 12);
  }

  // --- Lead hook (supersaw) in drop 2 and the climax; bell in v15 (shown on screen)
  const phrase = (start: number, mel: [number, number, number][], inst: Inst, vel: number, k = 0) => {
    for (const [beat, len, n] of mel) add(start + beat / 4, len / 4, inst, vel, n + k);
  };
  phrase(37, HOOK, 'lead', 0.8); phrase(41, HOOK_B, 'lead', 0.8);
  phrase(54, HOOK, 'bell', 0.9); phrase(58, HOOK_B.slice(0, 8), 'bell', 0.85);
  phrase(60, HOOK, 'lead', 0.85, 2); phrase(64, HOOK_B, 'lead', 0.85, 2);
  phrase(60, HOOK, 'bell', 0.5, 14); phrase(64, HOOK_B, 'bell', 0.5, 14);
  phrase(48, VOICE, 'voice', 0.8);

  // --- Arp in the breakdown (16ths over the chord)
  for (let s = 35 * 16; s < 37 * 16 - 4; s++) {
    const bar = s / 16, c = chordAt(bar).tones;
    const seq = [c[0]!, c[1]!, c[2]!, c[0]! + 12, c[2]!, c[1]!];
    add(bar, 1 / 16, 'arp', 0.4 + 0.5 * ((s - 35 * 16) / 32), seq[s % seq.length]! + 12);
  }

  // --- Transitions
  const crash = (b: number, v = 1) => add(b, 2, 'crash', v);
  const riser = (b0: number, b1: number, v = 1) => add(b0, b1 - b0, 'riser', v);
  const roll = (b0: number, b1: number, v = 1) => add(b0, b1 - b0, 'roll', v);
  const impact = (b: number, v = 1) => add(b, 2, 'impact', v);
  riser(10, 12); roll(11, 12, 0.8); impact(12); crash(12);
  crash(16, 0.7); crash(18, 0.5);
  for (const b of [20, 22, 24, 26]) crash(b, 0.55);
  crash(28, 0.8);
  for (const b of [32, 33, 34]) crash(b, 0.45);
  riser(35, 37, 1.1); roll(36, 36.875, 1); impact(37, 1.1); crash(37, 1);
  crash(41, 0.6);
  for (const b of [45, 46, 47]) crash(b, 0.5);
  crash(48, 0.7); crash(52, 0.4); crash(54, 0.6);
  riser(58, 59.75, 1); roll(59, 59.75, 0.9); impact(60, 1.2); crash(60, 1);
  for (const b of [62, 64, 66]) crash(b, 0.7);
  impact(68, 1.1); crash(68, 1);

  ev.sort((a, b) => a.bar - b.bar);
  return ev;
}

export const SCORE = buildScore();
export const kickBarsList = SCORE.filter((e) => e.inst === 'kick' || e.inst === 'kickSoft').map((e) => e.bar);
