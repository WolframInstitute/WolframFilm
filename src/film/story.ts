// The eras: which OS and front end, what is typed and evaluated, and what the narrator says.
import type { G } from '../core/draw';
import { F, font, text, clamp, inv, ease, mix, rgba } from '../core/draw';
import { NB, type Cell, type NbStyle } from '../ui/notebook';
import type { OSKind } from '../ui/chrome';
import {
  exprFlipCell, manipulateCell, freeformCell, suggestionsCell, entityCell, chatInputCell, chatResponseCell,
  tabularCell, musicScoreCell, speakCell, summaryBoxCell, netIcon,
} from '../ui/widgets';
import { RELEASES } from '../core/lexicon';
import { HOOK, slider } from '../music/score';

export interface Era {
  from: number; to: number;
  os: OSKind; title: string; nb: NbStyle; cells: Cell[];
  menus?: string[]; zoom?: string;
  label: [string, string]; // era label: title, sub
  extras?: 'palette95' | 'chatbar15';
}

const v1Names = [...RELEASES[0]!.words].map((w) => w.name).sort((a, b) => a.replace('$', '').localeCompare(b.replace('$', '')));
const v1List = '{' + v1Names.slice(0, 72).join(', ') + ', ...}';

const inp = (at: number, n: number, text: string, type = 0.35): Cell => ({ kind: 'input', at, n, text, type });
const out = (at: number, n: number, text: string): Cell => ({ kind: 'output', at, n, text });

// the 15.0 score: the bell phrase heard in bars 54–60 (hook + first half of B)
const HOOK_B8: [number, number, number][] = [[0, 1.5, 76], [1.5, 0.5, 74], [2, 1, 76], [3, 1, 81], [4, 1.5, 77], [5.5, 0.5, 76], [6, 1, 72], [7, 1, 69]];
export const V15_NOTES: [number, number, number][] = [...HOOK.map(([b, l, m]) => [b, l, m] as [number, number, number]), ...HOOK_B8.map(([b, l, m]) => [b + 16, l, m] as [number, number, number])];
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const nn = (m: number) => `${NOTE_NAMES[m % 12]}${Math.floor(m / 12) - 1}`;
const frac = (beats: number) => { const n = beats * 2; return n === 8 ? '1' : n % 2 === 0 ? `${n / 2}/4` : `${n}/8`; };
const v15Code = 'MusicScore[{' + V15_NOTES.slice(0, 6).map(([, l, m]) => `MusicNote["${nn(m)}", ${frac(l)}]`).join(', ') + ', …}]';

const releaseRows = RELEASES.filter((r) => r.key !== 'v15').map((r) => [r.label, r.year.slice(0, 4), r.words.length] as (string | number)[]);

export const ERAS: Era[] = [
  {
    from: 12, to: 16, os: 'mac1', title: 'Untitled-1', nb: NB.mac1,
    label: ['Mathematica 1.0', 'June 23, 1988 · Macintosh'],
    cells: [inp(12.0, 1, 'Names["*"]', 0.2), out(12.5, 1, v1List)],
  },
  {
    from: 16, to: 20, os: 'next', title: 'Untitled-1.ma  —', nb: NB.next,
    label: ['Mathematica 1.0', '1988 · NeXT'],
    cells: [
      inp(16.0, 2, 'Characters["NeXT"]', 0.25), out(16.5, 2, '{N, e, X, T}'),
      inp(18.0, 3, 'FullForm[{x -> 1, f[y]}]', 0.4), { kind: 'output', at: 18.6, n: 3, text: 'List[Rule[x, 1], f[y]]' },
    ],
  },
  {
    from: 20, to: 22, os: 'win31', title: 'Mathematica for Windows - [Untitled-1]', nb: NB.win31,
    label: ['Mathematica 2.0', 'January 1991 · Windows 3.1'],
    cells: [inp(20.0, 1, 'Module[{word = "language"}, StringReverse[word]]', 0.5), out(20.75, 1, 'egaugnal')],
  },
  {
    from: 22, to: 24, os: 'win95', title: 'Mathematica - [Untitled-1]', nb: NB.v3,
    label: ['Mathematica 3.0', 'September 1996 · Windows 95'], extras: 'palette95',
    cells: [
      { kind: 'title', at: 22.0, text: 'Notes on Language' },
      exprFlipCell(22.1, 23.0, 'Every language starts with a few words.', NB.v3),
    ],
  },
  {
    from: 24, to: 26, os: 'mac9', title: 'Untitled-1', nb: NB.v4,
    label: ['Mathematica 4.0', 'May 1999 · Mac OS 9'],
    cells: [
      inp(24.0, 1, 'words = Import["survey.csv"]', 0.3),
      out(24.45, 1, '{{"word", "language"}, {"hello", "English"}, {"bonjour", "French"}, {"hola", "Spanish"}}'),
      inp(25.0, 2, 'Export["survey.xls", words]', 0.3), out(25.45, 2, 'survey.xls'),
    ],
  },
  {
    from: 26, to: 28, os: 'xp', title: 'Mathematica 5.1 - [Untitled-1]', nb: NB.v4,
    label: ['Mathematica 5.1', 'October 2004 · Windows XP'],
    cells: [
      inp(26.0, 1, '{Red, Green, Blue, Orange, Purple}', 0.35),
      out(26.5, 1, '{RGBColor[1, 0, 0], RGBColor[0, 1, 0], RGBColor[0, 0, 1], RGBColor[1, 0.5, 0], RGBColor[0.5, 0, 0.5]}'),
    ],
  },
  {
    from: 28, to: 35, os: 'osx', title: 'Untitled-1', nb: NB.v6,
    label: ['Mathematica 6.0', 'May 2007 · Mac OS X'],
    cells: [
      inp(28.0, 1, 'WordData["language", "Definitions"]', 0.35),
      out(28.5, 1, '{{language, Noun, Faculty} -> the mental faculty or power of vocal communication, {language, Noun, Communication} -> a systematic means of communicating by the use of sounds or conventional symbols, ...}'),
      inp(29.75, 2, 'Manipulate[Style["language", s], {s, 12, 72}]', 0.2),
      manipulateCell(30.0, 150, slider, (g, x, y, w, h, v) => {
        const s = 12 + 60 * v;
        g.font = font(F.courier, s, 400); g.fillStyle = '#000'; g.textAlign = 'center'; g.textBaseline = 'middle';
        g.fillText('language', x + w / 2, y + h / 2 + 2); g.textAlign = 'left'; g.textBaseline = 'alphabetic';
      }),
      inp(32.0, 3, 'Speak["Now I can speak."]', 0.2), speakCell(32.3, 'Now I can speak.'),
      freeformCell(33.0, 'countries in europe', 'CountryData', 'CountryData["Europe"]', NB.v6),
      out(33.6, 4, '{Albania, Andorra, Austria, Belarus, Belgium, Bosnia and Herzegovina, Bulgaria, Croatia, ...}'),
      inp(34.0, 5, 'UnitConvert[Quantity[5., "Kilometers"], "Miles"]', 0.3), out(34.4, 5, '3.10686 mi'),
      suggestionsCell(34.55, ['convert to feet', 'exact form', 'more...']),
    ],
  },
  {
    from: 37, to: 45, os: 'yosemite', title: 'Untitled-1.nb', nb: NB.modern,
    label: ['The Wolfram Language', 'Named Nov 2013 · Version 10, July 2014'],
    cells: [
      inp(38.5, 1, 'Interpreter["Country"]["france"]', 0.3),
      entityCell(38.95, [['France', 'country']]),
      inp(39.5, 2, 'WordTranslation["language", "French"]', 0.3), out(39.95, 2, '{langue, langage}'),
      inp(40.5, 3, 'Pluralize["mouse"]', 0.2), out(40.8, 3, 'mice'),
      inp(41.5, 4, 'CountryData["Europe"][[;; 4]]', 0.25),
      entityCell(41.9, [['Albania', 'country'], ['Andorra', 'country'], ['Austria', 'country'], ['Belarus', 'country']]),
      inp(43.0, 5, 'Entity["Language", "French"]', 0.25),
      entityCell(43.35, [['French', 'language']]),
    ],
  },
  {
    from: 45, to: 52, os: 'bigsur', title: 'Untitled-1.nb', nb: NB.v13,
    label: ['Version 11', 'August 2016'],
    cells: [
      inp(45.0, 1, 'NetTrain[net, examples]', 0.2), { ...summaryBoxCell(45.35, 'NetChain', [['Input', 'image'], ['Output', 'class']], netIcon), n: 1 },
      inp(46.0, 2, 'SpeechRecognize[recording]', 0.2), out(46.35, 2, 'every language starts with a few words'),
      chatInputCell(48.0, 'What are the ten most common words in Alice in Wonderland?', 0.55),
      chatResponseCell(48.75, 'You can count them with WordCounts:', 'WordCounts', ['Take[WordCounts[ExampleData[{"Text", "AliceInWonderland"}],', '  IgnoreCase -> True], 10]'], NB.v13),
      inp(50.0, 3, 'Take[WordCounts[ExampleData[{"Text", "AliceInWonderland"}], IgnoreCase -> True], 10]', 0.3),
      out(50.4, 3, '<|the -> 630, and -> 338, a -> 277, to -> 249, she -> 239, of -> 198, it -> 171, was -> 167, in -> 162, alice -> 161|>'),
    ],
  },
  {
    from: 52, to: 54, os: 'dark', title: 'Untitled-1.nb', nb: NB.dark,
    label: ['Version 14', '2024 – 2025 · dark mode arrives in 14.3'],
    cells: [
      inp(52.1, 1, 'Tabular[releases]', 0.2),
      tabularCell(52.4, ['version', 'year', 'new words'], releaseRows.slice(0, 15), true),
    ],
  },
  {
    from: 54, to: 60, os: 'bigsur', title: 'Soundtrack.nb', nb: NB.v13,
    label: ['Version 15', 'June 16, 2026'], extras: 'chatbar15',
    cells: [
      inp(55.0, 1, v15Code, 0.35),
      musicScoreCell(55.4, V15_NOTES, 24, (bar) => (bar >= 54 && bar < 60 ? (bar - 54) * 4 : null), 6),
    ],
  },
];

// ---------------------------------------------------------------- narration (right column)
export interface Line { at: number; until: number; text: string; red?: string[]; size?: number; y?: number }
export const CAPTIONS: Line[] = [
  { at: 12.25, until: 15.8, text: 'Its first vocabulary: 554 words.', red: ['554'] },
  { at: 16.25, until: 17.8, text: 'Bundled with every NeXT computer.' },
  { at: 18.2, until: 19.85, text: 'One grammar for everything.', red: ['grammar'] },
  { at: 20.3, until: 21.85, text: 'It learns to play with words.' },
  { at: 22.3, until: 23.85, text: 'The notebook itself is written in the language.' },
  { at: 24.3, until: 25.85, text: 'It learns to read and write other formats.' },
  { at: 26.3, until: 27.85, text: 'It learns the names of colours.' },
  { at: 28.3, until: 29.85, text: 'It learns about the world.' },
  { at: 30.1, until: 31.85, text: 'And it starts to answer back.' },
  { at: 32.05, until: 32.9, text: 'It learns to speak.' },
  { at: 33.05, until: 33.9, text: 'It learns to understand English.' },
  { at: 34.05, until: 34.9, text: 'It learns units.' },
  { at: 39.0, until: 41.85, text: 'Version 10 adds 1,022 words: the most ever.', red: ['1,022'] },
  { at: 42.0, until: 44.85, text: 'Words for things in the world: countries, cities, languages.' },
  { at: 45.05, until: 45.9, text: 'It learns to learn.' },
  { at: 46.05, until: 46.9, text: 'It learns to listen.' },
  { at: 47.05, until: 47.9, text: 'It keeps growing.' },
  { at: 48.25, until: 49.9, text: 'Now machines learn to speak it.', red: ['machines'] },
  { at: 50.1, until: 51.85, text: 'Natural language for people. Computational language for both.' },
  { at: 52.2, until: 53.85, text: 'It keeps a record of itself.' },
  { at: 54.25, until: 56.85, text: 'Version 15: it learns music.', red: ['music'] },
  { at: 57.0, until: 59.7, text: 'The notes you are hearing, as expressions.' },
];
export interface Entry { at: number; until: number; name: string; note?: string; usage?: string }
export const ENTRIES: Entry[] = [
  { at: 12.3, until: 15.8, name: 'Names', note: 'symbol · since 1.0, 1988' },
  { at: 20.2, until: 21.85, name: 'StringReverse' },
  { at: 22.2, until: 23.85, name: 'Cell' },
  { at: 24.2, until: 25.85, name: 'Import' },
  { at: 26.2, until: 27.85, name: 'Red' },
  { at: 28.2, until: 29.85, name: 'WordData' },
  { at: 30.0, until: 31.85, name: 'Manipulate' },
  { at: 42.0, until: 44.85, name: 'Entity' },
  { at: 48.2, until: 51.85, name: 'LLMFunction' },
  { at: 52.1, until: 53.85, name: 'Tabular' },
  { at: 54.2, until: 59.7, name: 'MusicNote', note: 'symbol · new in 15.0, 2026', usage: 'MusicNote[p, d] returns a music note with the specified pitch p and duration d.' },
];

/** Era-label schedule (top left). */
export const LABELS: { at: number; title: string; sub: string }[] = [
  { at: 12, title: 'Mathematica 1.0', sub: 'June 23, 1988 · Macintosh' },
  { at: 16, title: 'Mathematica 1.0', sub: '1988 · NeXT' },
  { at: 20, title: 'Mathematica 2.0', sub: 'January 1991 · Windows 3.1' },
  { at: 22, title: 'Mathematica 3.0', sub: 'September 1996 · Windows 95' },
  { at: 24, title: 'Mathematica 4.0', sub: 'May 1999 · Mac OS 9' },
  { at: 26, title: 'Mathematica 5.1', sub: 'October 2004 · Windows XP' },
  { at: 28, title: 'Mathematica 6.0', sub: 'May 2007 · Mac OS X' },
  { at: 32, title: 'Mathematica 7', sub: 'November 2008' },
  { at: 33, title: 'Mathematica 8', sub: 'November 2010' },
  { at: 34, title: 'Mathematica 9', sub: 'November 2012' },
  { at: 38.4, title: 'The Wolfram Language', sub: 'Named November 2013 · free on every Raspberry Pi' },
  { at: 40.5, title: 'Version 10', sub: 'July 2014 · 1,022 new words' },
  { at: 45, title: 'Version 11', sub: 'August 2016' },
  { at: 46, title: 'Version 12', sub: 'April 2019' },
  { at: 47, title: 'Version 13', sub: 'December 2021' },
  { at: 48, title: 'Version 13.3', sub: 'June 2023 · chat notebooks' },
  { at: 52, title: 'Version 14', sub: '2024 – 2025 · dark mode arrives in 14.3' },
  { at: 54, title: 'Version 15', sub: 'June 16, 2026' },
];

export { text, clamp, inv, ease, mix, rgba };
export type { G };
