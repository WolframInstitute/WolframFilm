// The language's vocabulary, from WolframLanguageData (≤14.3) + the New in 15.0 listing.
import raw from '../data/lexicon.json';

export interface Word { name: string; ver: string; major: number; date: string; freq: number; eponym: boolean }
export const WORDS: Word[] = (raw as { words: [string, string, string, number, number][] }).words.map(([name, ver, date, freq, ep]) => ({
  name, ver, date, freq, major: parseInt(ver, 10), eponym: ep === 1,
}));

/** A version "release" as the film stages it: which words arrive, and on which bar. */
export interface Release { key: string; label: string; year: string; bar: number; words: Word[] }
const pick = (f: (w: Word) => boolean) =>
  WORDS.filter(f).sort((a, b) => b.freq - a.freq || a.name.localeCompare(b.name));

const minor = (w: Word) => parseFloat(w.ver);
export const RELEASES: Release[] = [
  { key: 'v1', label: '1.0', year: '1988', bar: 12, words: pick((w) => w.major === 1) },
  { key: 'v2', label: '2.0', year: '1991', bar: 20, words: pick((w) => w.major === 2) },
  { key: 'v3', label: '3.0', year: '1996', bar: 22, words: pick((w) => w.major === 3) },
  { key: 'v4', label: '4.0', year: '1999', bar: 24, words: pick((w) => w.major === 4) },
  { key: 'v5', label: '5', year: '2003–04', bar: 26, words: pick((w) => w.major === 5) },
  { key: 'v6', label: '6.0', year: '2007', bar: 28, words: pick((w) => w.major === 6) },
  { key: 'v7', label: '7', year: '2008', bar: 32, words: pick((w) => w.major === 7) },
  { key: 'v8', label: '8', year: '2010', bar: 33, words: pick((w) => w.major === 8) },
  { key: 'v9', label: '9', year: '2012', bar: 34, words: pick((w) => w.major === 9) },
  { key: 'v10', label: '10', year: '2014', bar: 37, words: pick((w) => w.major === 10) },
  { key: 'v11', label: '11', year: '2016', bar: 45, words: pick((w) => w.major === 11) },
  { key: 'v12', label: '12', year: '2019', bar: 46, words: pick((w) => w.major === 12) },
  { key: 'v13', label: '13', year: '2021', bar: 47, words: pick((w) => w.major === 13 && minor(w) < 13.3) },
  { key: 'v133', label: '13.3', year: '2023', bar: 48, words: pick((w) => minor(w) === 13.3) },
  { key: 'v14', label: '14', year: '2024–25', bar: 52, words: pick((w) => w.major === 14) },
  { key: 'v15', label: '15', year: '2026', bar: 54, words: pick((w) => w.major === 15) },
];
export const TOTAL_WORDS = WORDS.length;

/** Word count shown by the HUD at a given bar (counts up over ~1 bar after each release). */
export function wordCountAt(bar: number): number {
  let n = 0;
  for (const r of RELEASES) {
    if (bar < r.bar) break;
    const u = Math.min(1, (bar - r.bar) / 0.9);
    const e = 1 - Math.pow(1 - u, 3);
    n += Math.round(r.words.length * e);
  }
  return n;
}
export const releaseAt = (bar: number) => [...RELEASES].reverse().find((r) => bar >= r.bar);
export const byName = new Map(WORDS.map((w) => [w.name, w]));
