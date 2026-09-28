// bun src/directors.ts > artifact/data.json — the director's-commentary data for the player page.
// Everything except the commentary text is pulled from the film's own source.
import { readFileSync } from 'node:fs';
import { S, BAR, type Section } from './core/time';
import { CAPTIONS, ENTRIES, LABELS, PRINTS } from './film/story';
import { WORDS } from './core/lexicon';
import archive from '../assets/archive/manifest.json';

const T = (bar: number) => +(bar * BAR).toFixed(2);
const DOC = (s: string) => `https://reference.wolfram.com/language/ref/${s.replace('$', '$')}.html`;
const SW = 'https://writings.stephenwolfram.com';
const known = new Set(WORDS.map((w) => w.name));

// ------------------------------------------------------------------ commentary (the only hand-written part)
const NOTES: Partial<Record<Section, { title: string; notes: string[]; refs?: [string, string][] }>> = {
  cold: { title: 'Cold open', notes: [
    'The whole film is built on one idea: the Wolfram Language told as a natural language, gaining words. So it opens on the thesis, typed.',
    'The melody under it is Rule 30: the centre column of CellularAutomaton[30] picks notes from an A-minor pentatonic scale. The same melody returns alone at the very end.',
  ] },
  smp: { title: 'SMP, 1979–81', notes: [
    'SMP started in November 1979 at Caltech; Wolfram was 20. The session uses SMP’s real prompt format, #I[n]:: for input and #O[n]: for output.',
    'Graph[Sin[1/x],x,0.02,0.2] is the example from the SMP Reference Manual §10.2, and the character plot follows the manual’s style: stars joined into vertical runs, tick values written into the underscore axis.',
    'The pinned print is the real SMP manual cover from July 1981.',
  ], refs: [['There Was a Time before Mathematica (2013)', `${SW}/2013/06/there-was-a-time-before-mathematica/`]] },
  y1986: { title: '1986', notes: [
    'The first Mathematica code was written in October 1986. The scan is the C evaluator printout, dated November 27, 1986.',
  ] },
  name: { title: 'The name', notes: [
    'Steve Jobs suggested “Mathematica”. The scan beside it is the August 1987 list of “some perhaps possible product names”, which includes Omega and Polymath.',
    'The whole frame collapses into the drop on bar 12.',
  ], refs: [['Steve Jobs: A Few Memories (2011)', `${SW}/2011/10/steve-jobs-a-few-memories/`]] },
  v1: { title: 'Mathematica 1.0, June 23, 1988', notes: [
    'The window is Mac System 6, rendered at half resolution and thresholded to one bit. Only pictures are dithered, so text stays crisp. The menus are the 1.0 menus: File, Edit, Cells, Search, Action, Styles, Windows.',
    'Labels sit above cells in italics, input is bold Courier, graphics print -SurfaceGraphics-: all 1988 conventions. Integrate’s answer is shown in 1.0’s two-dimensional character layout, because typeset output only arrived in 3.0.',
    'The counter starts at 554: the documented words introduced in 1.0, from WolframLanguageData. Every one of them flies onto the wall behind the window.',
  ], refs: [['We’ve Come a Long Way in 30 Years (2018)', `${SW}/2018/06/weve-come-a-long-way-in-30-years-but-you-havent-seen-anything-yet/`]] },
  next: { title: 'NeXT, 1988', notes: [
    'Mathematica shipped with every NeXT computer. The window uses NeXTSTEP’s four greys, the vertical menu and the scroller on the left.',
    'Spikey is born here: <<Polyhedra.m, then Show[Graphics3D[Stellate[Icosahedron[]]]], exactly as in the archive scan. Today’s Stellate returned a plain icosahedron, so the stellation was rebuilt the way the 1.0 package did it, with each apex at twice the face centroid.',
  ], refs: [['The Story of Spikey (2018)', `${SW}/2018/12/the-story-of-spikey/`]] },
  grammar: { title: 'One grammar', notes: [
    'FullForm shows the single grammar under everything: List and Rule, which also turn out to be the two most-used words in the language.',
  ] },
  v2: { title: 'Mathematica 2.0, January 1991', notes: [
    'Version 2 gave the language sound. The waveform is drawn from the kernel’s own samples of Play[Sin[1000 t (1 + t)] Sin[2 Pi t], {t, 0, 1.5}], and that exact sound is mixed into the soundtrack at the moment the cell evaluates.',
    'Windows 3.1 chrome, pure-blue cell brackets and the “Bytes Free” status bar come from real 2.x screenshots.',
  ] },
  v3: { title: 'Mathematica 3.0, September 1996', notes: [
    'In 3.0 notebooks themselves became expressions: the text cell flips to its Cell[…] form. The BasicInput palette also debuted here, and the typeset sum is entered from it.',
  ] },
  v4: { title: 'Mathematica 4, 1999–2002', notes: [
    'Before 6.0, graphics did not display themselves; Show rendered them, and every picture printed -Graphics- under it.',
    'CellularAutomaton arrived in 4.2 (2002), and ArrayPlot only in 5.1, so the CA is drawn as a Raster, grown row by row from the real 161×321 array.',
  ] },
  v5: { title: 'Mathematica 5.1, 2004', notes: [
    'String patterns (StringCases, WordCharacter) and the named colours (Red, Orange, …) are both 5.1, so the rosette’s code uses only 5.1-era functions: no Opacity (6.0) and no AngleVector (10.1).',
  ] },
  v6: { title: 'Mathematica 6.0, May 2007', notes: [
    'Curated data (WordData, CountryData), TuringMachine and Manipulate are all 6.0. The Europe map is drawn from CountryData polygons, not GeoGraphics, which is 10.0.',
    'The Manipulate slider also drives the soundtrack: its value sets the music’s low-pass filter. When the slider settles at a = 1.8, the mouse rotates the surface, because 6.0 is when 3D graphics became rotatable by mouse.',
  ] },
  families: { title: 'Words come in families', notes: [
    'Eight real …Plot outputs, one per beat, with every …Plot and …Chart word scrolling behind. The 3D tiles rotate under the cursor using 24 kernel-rendered viewpoints each.',
  ] },
  v7: { title: 'Mathematica 7, November 2008', notes: [
    'Built-in parallel computing: the Julia set was computed with ParallelTable across 16 kernels, and each colour stripe marks the rows one kernel actually computed ($KernelID).',
  ] },
  v8: { title: 'Mathematica 8, November 2010', notes: [
    'Free-form input turned plain English into code. Graph arrived in 8.0; the network is Europe’s borders from CountryData, laid out by longitude and latitude.',
  ] },
  v9: { title: 'Mathematica 9, November 2012', notes: [
    'Units (Quantity, UnitConvert) and the Suggestions Bar, which appears under the output as it did in 9.',
  ] },
  breakdown: { title: 'It needs a name', notes: [
    'The breakdown before the second drop. The paper world turns to ink here.',
  ] },
  v10: { title: 'The Wolfram Language, 2013–14', notes: [
    'Named in November 2013 and free on every Raspberry Pi. Version 10 added 1,022 words, the largest single release.',
    'The globe’s night side is computed for 9 July 2014 at 12:00 UTC, the 10.0 release date, with great circles from Champaign. The star plot is StarData for the naked-eye stars.',
    'The last graph is the language describing itself: 186 words linked by WolframLanguageData’s RelatedSymbols. That function is 10.2, so the era label changes to 10.2 for it.',
  ], refs: [['Launching Mathematica 10 (2014)', `${SW}/2014/07/launching-mathematica-10-with-700-new-functions-and-a-crazy-amount-of-rd/`]] },
  v11: { title: 'Version 11, 2016', notes: [
    'A real net from the Neural Net Repository identifies the Mandrill test image. EntityStore (11) lets anyone add their own entities to the language.',
  ] },
  repos: { title: 'The repositories', notes: [
    'The fireball map is ResourceData from the Data Repository (2017); the big bubble is Chelyabinsk. BirdSay is fetched live from the Function Repository (2019).',
  ], refs: [
    ['Launching the Wolfram Data Repository (2017)', `${SW}/2017/04/launching-the-wolfram-data-repository-data-publishing-that-really-works/`],
    ['The Wolfram Function Repository (2019)', `${SW}/2019/06/the-wolfram-function-repository-launching-an-open-platform-for-extending-the-wolfram-language/`],
  ] },
  v12: { title: 'Version 12, 2019', notes: [
    'The FunctionCompile race was measured on the machine that rendered the film: 2.01 s evaluated vs 14.8 ms compiled, the same result both ways.',
    'The double pendulum is a real SystemModelSimulate of the Modelica MultiBody example (SystemModel is 11.3), animated from the simulated positions.',
  ] },
  v123: { title: 'Versions 12.1 and 12.3', notes: [
    'CreateDataStructure (12.1) and ExpressionTree (12.3). Unevaluated keeps Manipulate unevaluated without adding a Hold node to the tree.',
  ] },
  v132: { title: 'Version 13.2 and the Paclet Repository', notes: [
    'AstroGraphics (13.2): Orion on a black sky. Then the Quantum Framework installs from the Paclet Repository; its circuit shows as a summary box, and ⌘⇧T converts the cell to TraditionalForm, the diagram.',
  ] },
  llm: { title: 'Version 13.3, chat notebooks, 2023', notes: [
    'A chat cell, an LLM answering in Wolfram Language, and the code evaluated. The word counts are the kernel’s real WordCounts for Alice in Wonderland.',
  ], refs: [['Introducing Chat Notebooks (2023)', `${SW}/2023/06/introducing-chat-notebooks-integrating-llms-into-the-notebook-paradigm/`]] },
  v14: { title: 'Version 14, 2024–25', notes: [
    'Dark mode arrived in 14.3. The Tabular is real and typed: dates, integers, a characters-unit quantity, months, Entity chips. TransformColumns derives words per month, with the unit carried through automatically.',
  ] },
  v15: { title: 'Version 15, June 16, 2026', notes: [
    'The melody you hear here is the one on screen: the MusicScore cell lists the bell notes playing at that moment, and the piano roll’s playhead follows the music.',
  ], refs: [['Launching Version 15 (2026)', `${SW}/2026/06/launching-version-15-of-wolfram-language-mathematica-built-in-useful-ai-lots-of-new-core-functionality/`]] },
  agents: { title: 'AIs call it as a tool, 2026', notes: [
    'The terminal lines are the real commands used to make this film: the lexicon from WolframLanguageData, the globe and astronomy renders, the extra assets, and the renderer.',
    'Spikey meets the Claude Code mascot for a high five on the snare.',
  ], refs: [['Wolfram tech as a Foundation Tool for LLMs (Feb 2026)', `${SW}/2026/02/making-wolfram-tech-available-as-a-foundation-tool-for-llm-systems/`]] },
  climax: { title: 'The whole language', notes: [
    'All 6,801 words, alphabetical like a dictionary and sized by how often they are actually used. Specimen cards show real data: usage shares, the longest names, …Q question words, and eponyms.',
    'The key lifts a whole step here, the only modulation in the score.',
  ] },
  outro: { title: 'Still growing', notes: [
    'The film publishes itself: CopyFile to a public CloudObject, the exact call that put the MP4 on the Wolfram Cloud.',
  ] },
};

// ------------------------------------------------------------------ extraction
const inSec = (k: Section, bar: number) => bar >= S[k][0] && bar < S[k][1];
const symbolsIn = (code: string) => [...new Set((code.match(/\$?[A-Z][A-Za-z0-9]*/g) ?? []).filter((w) => known.has(w)))];

// Only code that runs as-is in a fresh 15.0 kernel, in order (later cells reuse `versions`, `julia`, `cf`, `pq`).
// Verified by evaluating every entry: no messages, no $Failed.
const RUNNABLE: { sec: Section; at: number; label: string; code: string }[] = JSON.parse(readFileSync('data/runnable.json', 'utf8'));

const sections = (Object.keys(S) as Section[]).map((k) => {
  const [b0, b1] = S[k];
  const n = NOTES[k] ?? { title: k, notes: [] };
  const snippets: { t: number; code: string; label: string }[] = [];
  for (const x of RUNNABLE) if (x.sec === k) snippets.push({ t: T(S[k][0] + x.at), code: x.code, label: x.label });
  snippets.sort((a, b) => a.t - b.t);
  const syms = new Set<string>();
  for (const s of snippets) for (const w of symbolsIn(s.code)) syms.add(w);
  for (const e of ENTRIES) if (inSec(k, e.at)) syms.add(e.name);
  const label = [...LABELS].reverse().find((l) => l.at >= b0 && l.at < b1);
  return {
    key: k, title: n.title, t0: T(b0), t1: T(b1),
    era: label ? `${label.title} · ${label.sub}` : '',
    captions: CAPTIONS.filter((c) => inSec(k, c.at)).map((c) => c.text),
    notes: n.notes,
    snippets,
    docs: [...syms].sort().map((s) => ({ name: s, url: DOC(s) })),
    sources: [
      ...(n.refs ?? []).map(([label, url]) => ({ label, url })),
      ...PRINTS.filter((p) => inSec(k, p.at)).map((p) => {
        const f = p.file.replace('../archive/', '');
        const m = (archive as any[]).find((a) => a.file === f);
        return { label: `Archive: ${p.cap} (${p.year})`, url: m?.source ?? '' };
      }),
    ],
  };
});
console.log(JSON.stringify({ duration: T(S.outro[1]), sections }));
