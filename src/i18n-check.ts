// bun src/i18n-check.ts  ->  every tr() key in the source, and which ones ru.json / ja.json lack.
import { readdirSync, readFileSync } from 'fs';
import ru from './i18n/ru.json';
import ja from './i18n/ja.json';

const keys = new Set<string>();
const walk = (d: string) => { for (const f of readdirSync(d, { withFileTypes: true })) { const p = `${d}/${f.name}`; if (f.isDirectory()) walk(p); else if (p.endsWith('.ts')) scan(readFileSync(p, 'utf8'), p); } };
function scan(s: string, p: string) {
  for (const m of s.matchAll(/\btr\(\s*'((?:[^'\\]|\\.)*)'/g)) keys.add(m[1]!.replace(/\\'/g, "'"));
  // strings passed through tr() indirectly: captions, labels, entries, prints, repos, menus
  if (p.endsWith('story.ts')) {
    for (const m of s.matchAll(/\b(?:L|LB)\('\w+', [\d.]+, (?:[\d.]+, )?'((?:[^'\\]|\\.)*)'(?:, '((?:[^'\\]|\\.)*)')?(?:, \[([^\]]*)\])?/g)) {
      keys.add(m[1]!); if (m[2]) keys.add(m[2]);
      for (const r of (m[3] ?? '').matchAll(/'([^']*[a-z][^']*)'/gi)) keys.add(r[1]!);
    }
    for (const m of s.matchAll(/note: '([^']*)'|usage: '([^']*)'/g)) keys.add((m[1] ?? m[2])!);
    for (const m of s.matchAll(/\bA\('\w+', [\d.]+, [\d.]+, '[^']*', '[^']*', '((?:[^'\\]|\\.)*)'/g)) keys.add(m[1]!);
  }
  if (p.endsWith('showcase.ts')) for (const m of s.matchAll(/\['([^']*)', '\d{4}', '([^']*)'\]/g)) { keys.add(m[1]!); keys.add(m[2]!); }
  if (p.endsWith('chrome.ts')) for (const m of s.matchAll(/\[('[A-Z][^\]]*)\]/g)) for (const w of m[1]!.matchAll(/'([A-Z][A-Za-z ]*)'/g)) keys.add(w[1]!);
}
walk('src');
const ignore = new Set(['Mathematica']);
const all = [...keys].filter((k) => !ignore.has(k)).sort();
if (process.argv[2] === '--keys') { console.log(JSON.stringify(all, null, 1)); process.exit(0); }
for (const [name, d] of [['ru', ru], ['ja', ja]] as const) {
  const miss = all.filter((k) => !(k in d));
  const extra = Object.keys(d).filter((k) => !keys.has(k));
  console.log(`${name}: ${all.length - miss.length}/${all.length} translated${miss.length ? '\n  missing: ' + miss.map((m) => JSON.stringify(m)).join('\n           ') : ''}${extra.length ? '\n  unused: ' + extra.join(' | ') : ''}`);
}
