// The score, as data. Times are in bars (absolute, fractional); durations in bars.
// Everything the visuals sync to (kicks, crashes, the slider, the melody) comes from here.
import { BARS, S } from '../core/time';

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
export const LIFT_BAR = S.climax[0];
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
/** The Manipulate slider in the 6.0 scene (its last two bars), 0..1. Holds and snaps. */
export const MANIP = S.v6[0] + 2;
export function slider(bar: number): number {
  const m = MANIP;
  const keys: [number, number][] = [
    [m, 0.1], [m + 0.25, 0.1], [m + 0.5, 0.85], [m + 0.7, 0.85], [m + 0.9, 0.3], [m + 1.05, 0.3], [m + 1.25, 0.52], [m + 2, 0.52],
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

const inR = (b: number, r: readonly [number, number]) => b >= r[0] && b < r[1];
const anyR = (b: number, ...rs: (readonly [number, number])[]) => rs.some((r) => inR(b, r));

/** Low-pass cutoff (Hz) of the music bus (not drums). */
export function musicCutoff(bar: number): number {
  if (bar < 4) return 5000;
  if (inR(bar, [MANIP, MANIP + 2])) return 260 * Math.pow(60, slider(bar));
  const [b0] = S.breakdown, [k0] = S.v14, [a0] = S.agents;
  if (inR(bar, S.breakdown)) return 700 * Math.pow(24, Math.pow((bar - b0) / 2, 2));
  if (inR(bar, S.v14)) return 900 + 400 * Math.sin((bar - k0) * Math.PI * 0.5);
  if (inR(bar, S.agents)) return 1200 * Math.pow(14, (bar - a0) / 2);
  return 18000;
}

// ---------------------------------------------------------------- arrangement
export const SECTIONS = S;

function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Where the Rule 30 pluck line plays: until the breakdown, 11.0 to the chat era, and the outro; never under the slider. */
export const pluckOn = (b: number) => (b < S.breakdown[0] || anyR(b, [S.v11[0], S.llm[0]], [S.outro[0], BARS])) && !anyR(b, [MANIP, MANIP + 2]);

export function buildScore(): Ev[] {
  const ev: Ev[] = [];
  const r = rng(30);
  const add = (bar: number, dur: number, inst: Inst, vel = 1, note?: number, p?: Record<string, number>) =>
    ev.push({ bar, dur, inst, vel, note, p });
  const W0 = S.v10[0], C0 = S.climax[0], END = S.outro[0], BD = S.breakdown, AG = S.agents;
  const DROP1 = [S.v1[0], S.v1[0] + 8] as const, DROP2 = [W0, W0 + 6] as const, CLIMAX = S.climax;
  const GAPS: (readonly [number, number])[] = [[BD[0] - 0.25, BD[1]], [AG[1] - 0.25, AG[1]]]; // silence before the drops
  const HALF = [S.v15[0], S.v15[0] + 2] as const;

  // --- Rule 30 pluck melody: 8th notes, three bits pick a pentatonic degree, one bit gates
  for (let s = 0; s < BARS * 8; s++) {
    const bar = s / 8;
    if (!pluckOn(bar)) continue;
    const gate = R30[s * 4 + 3]!;
    const onBeat = s % 8 === 0;
    if (!gate && !onBeat) continue;
    const deg = R30[s * 4]! * 4 + R30[s * 4 + 1]! * 2 + R30[s * 4 + 2]!;
    let note = PENTA[deg]! + transposeAt(bar);
    if (onBeat) note = chordAt(bar).tones[0]! + 12;
    const outroFade = bar >= END ? Math.max(0, 1 - (bar - END - 1) / 6) : 1;
    const vel = (onBeat ? 0.9 : 0.55 + 0.3 * r()) * (bar < 12 ? 1 : 0.6) * outroFade;
    if (vel > 0.02) add(bar, 1 / 8, 'pluck', vel, note);
  }

  // --- Pads: one chord per bar; final chord at the end
  for (let b = 4; b < END; b++) {
    const vel = b < 12 ? 0.55 : inR(b, BD) ? 0.8 : inR(b, S.v14) ? 0.7 : 0.6;
    for (const n of chordAt(b).tones) add(b, 1, 'pad', vel, n);
  }
  for (const n of [...chordAt(END).tones, chordAt(END).tones[0]! + 12]) add(END, 5, 'pad', 0.9, n);
  add(END, 5, 'bass', 0.9, chordAt(END).root, { long: 1 });

  // --- Kicks
  const kickBars = (b: number) => b >= 12 && b < END && !inR(b, BD);
  for (let b = 8; b < 11; b++) for (const q of [0, 2]) add(b + q / 4, 0.25, 'kickSoft', 0.8);
  add(11, 0.25, 'kickSoft', 0.8); add(11.5, 0.25, 'kickSoft', 0.7);
  for (let b = 12; b < END; b++) {
    if (!kickBars(b)) continue;
    for (let q = 0; q < 4; q++) {
      const bar = b + q / 4;
      if (anyR(bar, ...GAPS)) continue;
      if (inR(bar, HALF) && q % 2 === 1) continue; // half-time into v15
      add(bar, 0.25, 'kick', 1);
    }
  }
  add(END, 0.25, 'kick', 1);

  // --- Claps on 2 and 4
  for (let b = 12; b < END; b++) {
    if (!kickBars(b) || anyR(b, S.v14, HALF) || anyR(b + 0.25, ...GAPS)) continue;
    add(b + 0.25, 0.25, 'clap', 0.8); add(b + 0.75, 0.25, 'clap', 0.85);
  }

  // --- Hats
  for (let s = 12 * 16; s < END * 16; s++) {
    const bar = s / 16, b = Math.floor(bar);
    if (!kickBars(b) || inR(b, S.v14) || anyR(bar, ...GAPS)) continue;
    const sixteenths = anyR(b, [S.v4[0], BD[0]], [W0, S.llm[0]], AG, CLIMAX);
    const i = s % 4;
    if (i === 2) add(bar, 1 / 16, 'hat', 0.75 + 0.2 * r());
    else if (sixteenths) add(bar, 1 / 16, 'hat', (i === 0 ? 0.35 : 0.45) + 0.15 * r());
    if (i === 2 && anyR(b, DROP2, CLIMAX, S.families)) add(bar, 1 / 8, 'ohat', 0.45);
  }

  // --- Bass: offbeat octave pump in the drops, quarter roots elsewhere
  for (let s = 12 * 8; s < END * 8; s++) {
    const bar = s / 8, b = Math.floor(bar);
    if (!kickBars(b) || anyR(bar, ...GAPS)) continue;
    const root = chordAt(b).root;
    if (anyR(b, DROP1, DROP2, CLIMAX, S.families)) { if (s % 2 === 1) add(bar, 1 / 8, 'bass', 0.9, root + (s % 4 === 3 ? 12 : 0)); }
    else if (s % 2 === 0) add(bar, 1 / 8, 'bass', 0.8, root);
  }

  // --- Stabs: dotted chord hits in the drops; a hit on every beat through the *Plot montage
  const stabPattern = [0, 3, 6, 10, 12];
  for (let b = 12; b < END; b++) {
    if (anyR(b, [DROP1[0], DROP1[0] + 6], DROP2, CLIMAX)) for (const p of stabPattern) for (const n of chordAt(b).tones) add(b + p / 16, 1 / 16, 'stab', 0.5, n + 12);
    if (inR(b, S.families)) for (let q = 0; q < 4; q++) for (const n of chordAt(b).tones) add(b + q / 4, 1 / 8, 'stab', 0.62, n + 12);
  }

  // --- Melodies
  const phrase = (start: number, mel: [number, number, number][], inst: Inst, vel: number, k = 0) => {
    for (const [beat, len, n] of mel) add(start + beat / 4, len / 4, inst, vel, n + k);
  };
  phrase(W0, HOOK, 'lead', 0.8); phrase(W0 + 4, HOOK_B.slice(0, 8), 'lead', 0.8);
  phrase(S.v15[0], HOOK, 'bell', 0.9); phrase(S.v15[0] + 4, HOOK_B.slice(0, 8), 'bell', 0.85);
  phrase(C0, HOOK, 'lead', 0.85, 2); phrase(C0 + 4, HOOK_B, 'lead', 0.85, 2);
  phrase(C0, HOOK, 'bell', 0.5, 14); phrase(C0 + 4, HOOK_B, 'bell', 0.5, 14);
  phrase(S.llm[0], VOICE, 'voice', 0.8);

  // --- Arps: the breakdown and the build into the climax
  for (const [a, z] of [[BD[0], BD[1] - 0.25], [AG[0], AG[1] - 0.25]] as const) {
    for (let s = a * 16; s < z * 16; s++) {
      const bar = s / 16, c = chordAt(bar).tones;
      const seq = [c[0]!, c[1]!, c[2]!, c[0]! + 12, c[2]!, c[1]!];
      add(bar, 1 / 16, 'arp', 0.4 + 0.5 * ((bar - a) / (z - a)), seq[s % seq.length]! + 12);
    }
  }

  // --- Transitions
  const crash = (b: number, v = 1) => add(b, 2, 'crash', v);
  const riser = (b0: number, b1: number, v = 1) => add(b0, b1 - b0, 'riser', v);
  const roll = (b0: number, b1: number, v = 1) => add(b0, b1 - b0, 'roll', v);
  const impact = (b: number, v = 1) => add(b, 2, 'impact', v);
  riser(10, 12); roll(11, 12, 0.8); impact(12); crash(12);
  for (const k of ['next', 'grammar'] as const) crash(S[k][0], 0.6);
  for (const k of ['v2', 'v3', 'v4', 'v5', 'v6'] as const) crash(S[k][0], 0.55);
  crash(MANIP, 0.55);
  crash(S.families[0], 0.9); impact(S.families[0], 0.6);
  for (const k of ['v7', 'v8', 'v9'] as const) crash(S[k][0], 0.45);
  riser(BD[0], BD[1] - 0.1, 1.1); roll(BD[1] - 1, BD[1] - 0.125, 1); impact(W0, 1.1); crash(W0, 1);
  crash(W0 + 4, 0.6);
  for (const k of ['v11', 'repos', 'v12', 'v123', 'v132'] as const) crash(S[k][0], 0.5);
  crash(S.llm[0], 0.7); crash(S.v14[0], 0.4); crash(S.v15[0], 0.6); crash(S.v15[0] + 4, 0.4);
  riser(AG[0], AG[1] - 0.2, 1); roll(AG[1] - 1, AG[1] - 0.25, 0.9); impact(C0, 1.2); crash(C0, 1);
  for (const d of [2, 4, 6]) crash(C0 + d, 0.7);
  impact(END, 1.1); crash(END, 1);

  ev.sort((a, b) => a.bar - b.bar);
  return ev;
}

export const SCORE = buildScore();
export const kickBarsList = SCORE.filter((e) => e.inst === 'kick' || e.inst === 'kickSoft').map((e) => e.bar);
