// bun src/snippets.ts > docs/SNIPPETS.md — every piece of code/text typed on screen, in film order.
import { ERAS } from './film/story';
import { S, BAR } from './core/time';

const sec = (bar: number) => Object.entries(S).filter(([, r]) => bar >= r[0] && bar < r[1]).map(([k]) => k).pop() ?? '?';
const tc = (bar: number) => { const t = bar * BAR; return `${Math.floor(t / 60)}:${(t % 60).toFixed(1).padStart(4, '0')}`; };
const out: string[] = ['# On-screen code snippets', '', 'Every input typed in the film, in order. Edit the code blocks and hand the file back; the `id` tells me where each lives.', ''];
let n = 0;
const block = (id: string, bar: number, era: string, kind: string, code: string, note = '') => {
  out.push(`### ${++n}. \`${id}\` · ${tc(bar)} · ${sec(bar)} · ${era} · ${kind}${note ? ' · ' + note : ''}`, '', '```wl', code, '```', '');
};
// SMP (src/film/scenes/intro.ts)
block('smp-1', 4.1, 'SMP 1981', 'input', 'Ex[(a + b)^3]', 'shown as #I[1]::');
block('smp-1-out', 4.6, 'SMP 1981', 'output', 'a^3 + 3 a^2 b + 3 a b^2 + b^3', 'shown as #O[1]:');
block('smp-2', 4.9, 'SMP 1981', 'input', 'Graph[Sin[1/x],x,0.02,0.2]', 'from the SMP Reference Manual §10.2; followed by its ASCII plot');
for (const e of ERAS) {
  e.cells.forEach((c, i) => {
    const id = `${e.os}@${e.from}#${i}`;
    if (c.kind === 'input' && c.text) block(id, c.at, e.title, `In[${c.n}]`, c.text);
    else if (c.kind === 'output' && c.text) block(id, c.at, e.title, `Out[${c.n}]`, c.text);
    else if (c.kind === 'title' || c.kind === 'text') block(id, c.at, e.title, c.kind, c.text ?? '');
  });
}
// custom cells whose text lives in the widget arguments (story.ts)
out.push('## Text inside custom cells (story.ts)', '',
  '- 3.0 text cell / `Cell[...]` flip: `Every language starts with a few words.`',
  '- 8 free-form input: `countries in europe` → interpretation `CountryData` → `CountryData["Europe"]`',
  '- 9 Suggestions Bar: `convert to feet` · `exact form` · `more...`',
  '- 11 NetTrain summary box: `NetChain` · Input: image · Output: class',
  '- 12.1 DataStructure summary box: Type: PriorityQueue · Length: 5',
  '- 13.3 chat input: `What are the ten most common words in Alice in Wonderland?`',
  '- 13.3 chat response: `You can count them with WordCounts:` + code `Take[WordCounts[ExampleData[{"Text", "AliceInWonderland"}], IgnoreCase -> True], 10]`',
  '- 15 AI chatbar request: `Write the melody we are hearing as a score`',
  '- 2026 agent terminal (scenes/showcase.ts): `make a short film about the Wolfram Language`, then the wolframscript / bun calls',
  '');
console.log(out.join('\n'));
