// The film's clock. Everything is expressed in bars; seconds are derived.
export const BPM = 120;
export const BEAT = 60 / BPM; // 0.5 s
export const BAR = 4 * BEAT; // 2 s
export const BARS = 75;
export const DURATION = BARS * BAR; // 150 s
export const FPS = 60;
export const W = 1920;
export const H = 1080;

export const barToSec = (bar: number) => bar * BAR;
export const secToBar = (t: number) => t / BAR;
