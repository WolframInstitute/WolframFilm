// The film's clock. Everything is expressed in bars; seconds are derived.
export const BPM = 120;
export const BEAT = 60 / BPM; // 0.5 s
export const BAR = 4 * BEAT; // 2 s
export const BARS = 83;
export const DURATION = BARS * BAR; // 166 s
export const FPS = 60;
export const W = 1920;
export const H = 1080;

export const barToSec = (bar: number) => bar * BAR;
export const secToBar = (t: number) => t / BAR;

/** The film's sections (bars). Music and picture both read from here; nothing else hard-codes a bar. */
export const S = {
  cold: [0, 4], smp: [4, 8], y1986: [8, 10], name: [10, 12], v1: [12, 16], next: [16, 18], grammar: [18, 20],
  v2: [20, 22], v3: [22, 24], v4: [24, 26], v5: [26, 28], v6: [28, 32], families: [32, 34], v7: [34, 35], v8: [35, 37],
  v9: [37, 38], breakdown: [38, 40], v10: [40, 46], v11: [46, 47], repos: [47, 49], v12: [49, 51], v123: [51, 52],
  v132: [52, 54], llm: [54, 58], v14: [58, 60], v15: [60, 66], agents: [66, 68], climax: [68, 76], outro: [76, 83],
} as const;
export type Section = keyof typeof S;
