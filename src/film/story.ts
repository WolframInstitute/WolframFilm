// The eras: which OS and front end, what is typed and evaluated, and what the narrator says.
// Every time is relative to a section of the film (S in core/time.ts), so sections can move freely.
import type { G } from '../core/draw';
import { F, font, text, clamp, inv, ease, mix, rgba } from '../core/draw';
import { S, type Section } from '../core/time';
import { NB, type Cell, type NbStyle } from '../ui/notebook';
import type { OSKind } from '../ui/chrome';
import {
  exprFlipCell, manipulateCell, freeformCell, suggestionsCell, entityCell, chatInputCell, chatResponseCell,
  tabularCell, musicScoreCell, summaryBoxCell, netIcon, dsIcon, imageCell, arrayGrowCell,
  parallelCell, graphGrowCell, pendulumCell, compileCell,
} from '../ui/widgets';
import { RELEASES } from '../core/lexicon';
import { HOOK, slider, MANIP } from '../music/score';
import { drawAsset } from '../core/assets';
import { CODE } from './codes';

export interface Era {
  from: number; to: number;
  os: OSKind; title: string; nb: NbStyle; cells: Cell[];
  menus?: string[]; zoom?: string;
  extras?: 'palette95' | 'chatbar15';
}

/** Bar `o` into section `k`. */
export const at = (k: Section, o = 0) => S[k][0] + o;

const v1Names = [...RELEASES[0]!.words].map((w) => w.name).sort((a, b) => a.replace('$', '').localeCompare(b.replace('$', '')));
const v1List = '{' + v1Names.slice(0, 72).join(', ') + ', ...}';

const inp = (t: number, n: number, text: string, type = 0.35): Cell => ({ kind: 'input', at: t, n, text, type });
const out = (t: number, n: number, text: string): Cell => ({ kind: 'output', at: t, n, text });

// the 15.0 score: the bell phrase heard in the 15.0 section (hook + first half of B)
const HOOK_B8: [number, number, number][] = [[0, 1.5, 76], [1.5, 0.5, 74], [2, 1, 76], [3, 1, 81], [4, 1.5, 77], [5.5, 0.5, 76], [6, 1, 72], [7, 1, 69]];
export const V15_NOTES: [number, number, number][] = [...HOOK.map(([b, l, m]) => [b, l, m] as [number, number, number]), ...HOOK_B8.map(([b, l, m]) => [b + 16, l, m] as [number, number, number])];
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const nn = (m: number) => `${NOTE_NAMES[m % 12]}${Math.floor(m / 12) - 1}`;
const frac = (beats: number) => { const n = beats * 2; return n === 8 ? '1' : n % 2 === 0 ? `${n / 2}/4` : `${n}/8`; };
const v15Code = 'MusicScore[{' + V15_NOTES.slice(0, 6).map(([, l, m]) => `MusicNote["${nn(m)}", ${frac(l)}]`).join(', ') + ', …}]';

const releaseRows = RELEASES.filter((r) => r.key !== 'v15').map((r) => [r.label, r.year.slice(0, 4), r.words.length] as (string | number)[]);

export const ERAS: Era[] = [
  {
    from: at('v1'), to: S.v1[1], os: 'mac1', title: 'Untitled-1', nb: NB.mac1,
    cells: [
      inp(at('v1'), 1, 'Names["*"]', 0.2), out(at('v1', 0.5), 1, v1List),
      inp(at('v1', 2), 2, 'Plot3D[Sin[x y], {x, 0, 3}, {y, 0, 3}]', 0.3),
      imageCell(at('v1', 2.45), 'v1_plot3d.png', 250, 200), out(at('v1', 2.6), 2, '-SurfaceGraphics-'),
    ],
  },
  {
    from: at('next'), to: S.grammar[1], os: 'next', title: 'Untitled-1.ma  —', nb: NB.next,
    cells: [
      inp(at('next'), 2, 'Characters["NeXT"]', 0.25), out(at('next', 0.5), 2, '{N, e, X, T}'),
      inp(at('grammar'), 3, 'FullForm[{x -> 1, f[y]}]', 0.4), out(at('grammar', 0.6), 3, 'List[Rule[x, 1], f[y]]'),
    ],
  },
  {
    from: at('v2'), to: S.v2[1], os: 'win31', title: 'Mathematica for Windows - [Untitled-1]', nb: NB.win31,
    cells: [
      inp(at('v2'), 1, 'Module[{word = "language"}, StringReverse[word]]', 0.4), out(at('v2', 0.5), 1, 'egaugnal'),
      inp(at('v2', 0.75), 2, CODE.v2_surface, 0.3), imageCell(at('v2', 1.1), 'v2_surface.png', 250, 190),
    ],
  },
  {
    from: at('v3'), to: S.v3[1], os: 'win95', title: 'Mathematica - [Untitled-1]', nb: NB.v3, extras: 'palette95',
    cells: [
      { kind: 'title', at: at('v3'), text: 'Notes on Language' },
      exprFlipCell(at('v3', 0.1), at('v3', 1), 'Every language starts with a few words.', NB.v3),
    ],
  },
  {
    from: at('v4'), to: S.v4[1], os: 'mac9', title: 'Untitled-1', nb: NB.v4,
    cells: [
      inp(at('v4'), 1, 'words = Import["survey.csv"]', 0.2),
      out(at('v4', 0.3), 1, '{{"word", "language"}, {"hello", "English"}, {"bonjour", "French"}, ...}'),
      inp(at('v4', 0.6), 2, CODE.v4_rule30, 0.25),
      arrayGrowCell(at('v4', 0.9), 'v4_rule30.json', 1.0, 420, 210, ['#FFFFFF', '#1A1A2E'], 2),
    ],
  },
  {
    from: at('v5'), to: S.v5[1], os: 'xp', title: 'Mathematica 5.1 - [Untitled-1]', nb: NB.v4,
    cells: [
      inp(at('v5'), 1, '{Red, Green, Blue, Orange, Purple}', 0.25),
      out(at('v5', 0.35), 1, '{RGBColor[1, 0, 0], RGBColor[0, 1, 0], RGBColor[0, 0, 1], RGBColor[1, 0.5, 0], RGBColor[0.5, 0, 0.5]}'),
      inp(at('v5', 0.75), 2, CODE.v5_colors, 0.3), imageCell(at('v5', 1.1), 'v5_colors.png', 250, 250, 2),
    ],
  },
  {
    from: at('v6'), to: S.breakdown[0], os: 'osx', title: 'Untitled-1', nb: NB.v6,
    cells: [
      inp(at('v6'), 1, 'WordData["language", "Definitions"]', 0.2),
      out(at('v6', 0.3), 1, '{{language, Noun, Faculty} -> the mental faculty or power of vocal communication, ...}'),
      inp(at('v6', 0.5), 2, CODE.v6_europe, 0.2), imageCell(at('v6', 0.75), 'v6_europe.png', 330, 250, 2),
      inp(at('v6', 1.3), 3, CODE.v7_turing, 0.2),
      arrayGrowCell(at('v6', 1.5), 'v7_turing.json', 0.45, 520, 150, ['#FFFFFF', '#E0701A', '#2D4A8A'], 3, { transpose: true }),
      inp(MANIP - 0.15, 4, 'Manipulate[Plot3D[Sin[a x] Cos[y], {x, -3, 3}, {y, -3, 3}], {a, 0.5, 3}]', 0.15),
      manipulateCell(MANIP, 290, slider, (g, x, y, w, h, v) => {
        drawAsset(g, `v6_manip_${String(Math.round(v * 15)).padStart(2, '0')}.png`, x + 4, y + 4, w - 8, h - 8);
      }, 'a'),
      // 7 · 2008: parallel computing
      inp(at('v7'), 5, CODE.x_parallel, 0.2), parallelCell(at('v7', 0.25), 460, 290, 5),
      // 8 · 2010: plain English in, code out; and Graph
      freeformCell(at('v8'), 'countries in europe', 'CountryData', 'CountryData["Europe"]', NB.v6),
      out(at('v8', 0.5), 6, '{Albania, Andorra, Austria, Belarus, Belgium, Bosnia and Herzegovina, Bulgaria, Croatia, ...}'),
      inp(at('v8', 1), 7, CODE.v8_graph, 0.2), graphGrowCell(at('v8', 1.25), 'v8_europe_graph.json', 0.6, 520, 330, { vertex: '#DD1100', edge: '#6D82C7', label: '#333' }, 7),
      // 9 · 2012: units, and the Suggestions Bar
      inp(at('v9'), 8, 'UnitConvert[Quantity[5., "Kilometers"], "Miles"]', 0.25), out(at('v9', 0.35), 8, '3.10686 mi'),
      suggestionsCell(at('v9', 0.5), ['convert to feet', 'exact form', 'more...']),
    ],
  },
  {
    from: at('v10'), to: S.v10[1], os: 'yosemite', title: 'Untitled-1.nb', nb: NB.modern,
    cells: [
      inp(at('v10', 0.5), 1, 'Interpreter["Country"]["france"]', 0.25),
      entityCell(at('v10', 0.85), [['France', 'country']]),
      inp(at('v10', 1.2), 2, CODE.v10_globe, 0.3), imageCell(at('v10', 1.55), 'v10_globe.png', 400, 400, 2),
      inp(at('v10', 3), 3, 'WordTranslation["language", "French"]', 0.2), out(at('v10', 3.25), 3, '{langue, langage}'),
      inp(at('v10', 3.6), 4, CODE.v10_stars, 0.25), imageCell(at('v10', 3.9), 'v10_stars.png', 460, 300, 4),
      inp(at('v10', 4.9), 5, 'CountryData["Europe"][[;; 4]]', 0.2),
      entityCell(at('v10', 5.2), [['Albania', 'country'], ['Andorra', 'country'], ['Austria', 'country'], ['Belarus', 'country']]),
    ],
  },
  {
    from: at('v11'), to: S.llm[0], os: 'bigsur', title: 'Untitled-1.nb', nb: NB.v13,
    cells: [
      inp(at('v11'), 1, 'NetTrain[net, examples]', 0.15), { ...summaryBoxCell(at('v11', 0.2), 'NetChain', [['Input', 'image'], ['Output', 'class']], netIcon), n: 1 },
      inp(at('v11', 0.5), 11, 'EntityRegister[EntityStore["Word" -> <|"Entities" -> words|>]]', 0.15), out(at('v11', 0.7), 11, '{Word}'),
      inp(at('repos'), 2, CODE.x_fireballs, 0.25), imageCell(at('repos', 0.35), 'x_fireballs.png', 470, 250, 2),
      inp(at('repos', 1.1), 3, 'ResourceFunction["BirdSay"]["Every language starts with a few words."]', 0.25),
      imageCell(at('repos', 1.4), 'v11_birdsay.png', 360, 225, 3),
      inp(at('v12'), 4, CODE.x_compile, 0.25), compileCell(at('v12', 0.3), 460, 4),
      inp(at('v12', 0.7), 5, CODE.v12_molecule, 0.15), imageCell(at('v12', 0.9), 'v12_molecule.png', 280, 230, 5),
      inp(at('v12', 1.2), 6, CODE.v12_system, 0.2), pendulumCell(at('v12', 1.35), 0.65, 380, 260, 6),
      inp(at('v123'), 12, 'pq = CreateDataStructure["PriorityQueue"]; Scan[pq["Push", #] &, {3, 1, 4, 1, 5}]; pq', 0.25),
      { ...summaryBoxCell(at('v123', 0.35), 'DataStructure', [['Type', 'PriorityQueue'], ['Length', '5']], dsIcon), n: 12 },
      inp(at('v123', 0.9), 7, CODE.x_tree, 0.25), imageCell(at('v123', 1.2), 'x_tree.png', 420, 280, 7),
      inp(at('v132'), 8, CODE.v13_astro, 0.25), imageCell(at('v132', 0.3), 'v13_astro.png', 520, 350, 8),
      inp(at('v132', 1), 9, 'PacletInstall["Wolfram/QuantumFramework"]', 0.15),
      inp(at('v132', 1.2), 10, CODE.x_quantum, 0.2), imageCell(at('v132', 1.45), 'x_quantum_circuit.png', 360, 210, 10),
    ],
  },
  {
    from: at('llm'), to: S.llm[1], os: 'bigsur', title: 'Chat.nb', nb: NB.v13,
    cells: [
      chatInputCell(at('llm'), 'What are the ten most common words in Alice in Wonderland?', 0.55),
      chatResponseCell(at('llm', 0.75), 'You can count them with WordCounts:', 'WordCounts', ['Take[WordCounts[ExampleData[{"Text", "AliceInWonderland"}],', '  IgnoreCase -> True], 10]'], NB.v13),
      inp(at('llm', 2), 1, 'Take[WordCounts[ExampleData[{"Text", "AliceInWonderland"}], IgnoreCase -> True], 10]', 0.3),
      out(at('llm', 2.4), 1, '<|the -> 630, and -> 338, a -> 277, to -> 249, she -> 239, of -> 198, it -> 171, was -> 167, in -> 162, alice -> 161|>'),
    ],
  },
  {
    from: at('v14'), to: S.v14[1], os: 'dark', title: 'Untitled-1.nb', nb: NB.dark,
    cells: [
      inp(at('v14', 0.1), 1, 'Tabular[releases]', 0.2),
      tabularCell(at('v14', 0.4), ['version', 'year', 'new words'], releaseRows.slice(0, 15), true),
    ],
  },
  {
    from: at('v15'), to: S.v15[1], os: 'bigsur', title: 'Soundtrack.nb', nb: NB.v13, extras: 'chatbar15',
    cells: [
      inp(at('v15', 1), 1, v15Code, 0.35),
      musicScoreCell(at('v15', 1.4), V15_NOTES, 24, (bar) => (bar >= S.v15[0] && bar < S.v15[1] ? (bar - S.v15[0]) * 4 : null), 6),
    ],
  },
];

// ---------------------------------------------------------------- narration (right column)
export interface Line { at: number; until: number; text: string; red?: string[]; size?: number; y?: number }
const L = (k: Section, a: number, u: number, text: string, red?: string[]): Line => ({ at: at(k, a), until: at(k, u), text, red });
export const CAPTIONS: Line[] = [
  L('v1', 0.25, 1.85, 'Its first vocabulary: 554 words.', ['554']),
  L('v1', 2.1, 3.85, 'Words for pictures, too.'),
  L('next', 0.25, 1.8, 'Bundled with every NeXT computer.'),
  L('grammar', 0.2, 1.85, 'One grammar for everything.', ['grammar']),
  L('v2', 0.2, 1.85, 'It learns to play with words, and to draw in colour.'),
  L('v3', 0.3, 1.85, 'The notebook itself is written in the language.'),
  L('v4', 0.15, 1.85, 'It learns to read other formats, and to grow patterns.'),
  L('v5', 0.2, 1.85, 'It learns the names of colours.', ['colours']),
  L('v6', 0.2, 1.25, 'It learns about the world.'),
  L('v6', 1.3, 1.9, 'And about computation itself.'),
  L('v6', 2.05, 3.85, 'And it starts to answer back.'),
  L('v7', 0.05, 0.9, 'It learns to work in parallel.', ['parallel']),
  L('v8', 0.05, 0.95, 'It learns to understand English.'),
  L('v8', 1.05, 1.9, 'It learns graphs: countries, linked by their borders.'),
  L('v9', 0.05, 0.9, 'It learns units.'),
  L('v10', 1.0, 2.8, 'Version 10 adds 1,022 words: the most ever.', ['1,022']),
  L('v10', 2.95, 4.8, 'The Earth, the stars, every country and language.'),
  L('v10', 4.9, 5.85, 'Words for things in the world.'),
  L('v11', 0.05, 0.45, 'It learns to learn.'),
  L('v11', 0.5, 0.95, 'And it takes your words, too.'),
  L('repos', 0.0, 1.9, 'Now anyone can add words.', ['anyone']),
  L('v12', 0.05, 0.65, 'Compiled, it runs fast.'),
  L('v12', 0.7, 1.9, 'Molecules, machines, whole systems.'),
  L('v123', 0.05, 0.85, 'Data structures, built in.'),
  L('v123', 0.9, 1.9, 'Code is an expression too: a tree.'),
  L('v132', 0.05, 0.95, 'From the Earth to the stars.', ['stars']),
  L('v132', 1.0, 1.9, 'Whole frameworks, one install away.'),
  L('llm', 0.25, 1.9, 'Now machines learn to speak it.', ['machines']),
  L('llm', 2.1, 3.85, 'Natural language for people. Computational language for both.'),
  L('v14', 0.2, 1.85, 'It keeps a record of itself.'),
  L('v15', 0.25, 2.85, 'Version 15: it learns music.', ['music']),
  L('v15', 3.0, 5.7, 'The notes you are hearing, as expressions.'),
];
export interface Entry { at: number; until: number; name: string; note?: string; usage?: string }
const E = (k: Section, a: number, u: number, name: string, extra: Partial<Entry> = {}): Entry => ({ at: at(k, a), until: at(k, u), name, ...extra });
export const ENTRIES: Entry[] = [
  E('v1', 0.3, 1.85, 'Names', { note: 'symbol · since 1.0, 1988' }),
  E('v1', 2.1, 3.85, 'Plot3D'),
  E('v2', 0.2, 1.85, 'StringReverse'),
  E('v3', 0.2, 1.85, 'Cell'),
  E('v4', 0.1, 1.85, 'CellularAutomaton'),
  E('v5', 0.2, 1.85, 'Red'),
  E('v6', 0.2, 1.25, 'CountryData'),
  E('v6', 1.3, 1.9, 'TuringMachine'),
  E('v6', 2.0, 3.85, 'Manipulate'),
  E('v7', 0.05, 0.9, 'ParallelTable'),
  E('v8', 1.05, 1.9, 'Graph'),
  E('v10', 1.2, 2.85, 'GeoGraphics'),
  E('v10', 3.6, 4.8, 'StarData'),
  E('v10', 4.9, 5.85, 'Entity'),
  E('v12', 0.0, 0.65, 'FunctionCompile'),
  E('v12', 1.2, 1.9, 'SystemModel'),
  E('v11', 0.5, 0.95, 'EntityStore'),
  E('v123', 0.05, 0.85, 'CreateDataStructure'),
  E('v123', 0.9, 1.9, 'ExpressionTree'),
  E('v132', 0.05, 0.95, 'AstroGraphics'),
  E('v132', 1.0, 1.9, 'PacletInstall'),
  E('llm', 0.2, 3.85, 'LLMFunction'),
  E('v14', 0.1, 1.85, 'Tabular'),
  E('v15', 0.2, 5.7, 'MusicNote', { note: 'symbol · new in 15.0, 2026', usage: 'MusicNote[p, d] returns a music note with the specified pitch p and duration d.' }),
];

/** Era-label schedule (top left). */
const LB = (k: Section, o: number, title: string, sub: string) => ({ at: at(k, o), title, sub });
export const LABELS: { at: number; title: string; sub: string }[] = [
  LB('v1', 0, 'Mathematica 1.0', 'June 23, 1988 · Macintosh'),
  LB('next', 0, 'Mathematica 1.0', '1988 · NeXT'),
  LB('v2', 0, 'Mathematica 2.0', 'January 1991 · Windows 3.1'),
  LB('v3', 0, 'Mathematica 3.0', 'September 1996 · Windows 95'),
  LB('v4', 0, 'Mathematica 4', '1999 – 2002 · Mac OS 9'),
  LB('v5', 0, 'Mathematica 5.1', 'October 2004 · Windows XP'),
  LB('v6', 0, 'Mathematica 6.0', 'May 2007 · Mac OS X'),
  LB('v7', 0, 'Mathematica 7', 'November 2008 · built-in parallel computing'),
  LB('v8', 0, 'Mathematica 8', 'November 2010'),
  LB('v9', 0, 'Mathematica 9', 'November 2012'),
  LB('v10', 0.4, 'The Wolfram Language', 'Named Nov 2013 · free on every Raspberry Pi'),
  LB('v10', 1, 'Version 10', 'July 2014 · 1,022 new words'),
  LB('v11', 0, 'Version 11', 'August 2016'),
  LB('repos', 0, 'The repositories', 'Data 2017 · Neural Nets 2018 · Functions 2019'),
  LB('v12', 0, 'Version 12', 'April 2019'),
  LB('v123', 0, 'Version 12.1', 'March 2020'),
  LB('v123', 0.9, 'Version 12.3', 'May 2021'),
  LB('v132', 0, 'Version 13.2', 'December 2022 · astronomy'),
  LB('v132', 1, 'Paclet Repository', 'March 2023 · whole frameworks'),
  LB('llm', 0, 'Version 13.3', 'June 2023 · chat notebooks'),
  LB('v14', 0, 'Version 14', '2024 – 2025 · dark mode arrives in 14.3'),
  LB('v15', 0, 'Version 15', 'June 16, 2026'),
];

export { text, clamp, inv, ease, mix, rgba, F, font };
export type { G };
