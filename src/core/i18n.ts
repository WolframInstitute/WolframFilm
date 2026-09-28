// The film in other languages: FILM_LANG=ru|ja picks a dictionary keyed by the English text.
// Code, outputs and symbol names are never translated: the language's own words are the same everywhere.
import ru from '../i18n/ru.json';
import ja from '../i18n/ja.json';

export type Lang = 'en' | 'ru' | 'ja';
const env = typeof process !== 'undefined' ? process.env.FILM_LANG : (globalThis as any).FILM_LANG;
export const LANG: Lang = env === 'ru' || env === 'ja' ? env : 'en';
const DICT: Record<string, string> = LANG === 'ru' ? ru : LANG === 'ja' ? ja : {};
export const LOCALE = { en: 'en-US', ru: 'ru-RU', ja: 'ja-JP' }[LANG];

/** Missing keys fall back to English and are listed by `bun src/i18n-check.ts`. */
export const missing = new Set<string>();
export function tr(s: string, ...args: (string | number)[]): string {
  let r = LANG === 'en' ? s : DICT[s];
  if (r === undefined) { missing.add(s); r = s; }
  r = args.reduce<string>((a, v, i) => a.replaceAll(`{${i}}`, String(v)), r);
  // Russian plurals: {p:слово|слова|слов} agrees with the first argument
  return r.replace(/\{p:([^|}]*)\|([^|}]*)\|([^}]*)\}/g, (_, one, few, many) => {
    const n = Number(String(args[0]).replace(/\D/g, '')) % 100, d = n % 10;
    return n >= 11 && n <= 14 ? many : d === 1 ? one : d >= 2 && d <= 4 ? few : many;
  });
}
/** Numbers grouped the local way (6,801 · 6 801 · 6,801). */
export const num = (n: number) => n.toLocaleString(LOCALE);

const CJK = /[　-ヿ㐀-鿿＀-￯]/;
const CLOSE = /^[\s.,:;!?)、。，．・：；！？」』）】〕…]+$/, OPEN = /^[「『（【〔]+$/;
let seg: Intl.Segmenter | null = null;
/**
 * Split text into the units that wrap and animate one by one, each carrying its trailing space.
 * Spaced scripts split on spaces; Japanese splits into words (ICU), with punctuation kept on the
 * word before it and opening brackets on the word after, so no line starts with 、 or ends with 「.
 */
export function words(s: string): string[] {
  if (!CJK.test(s)) return s.split(' ').map((w, i, a) => (i < a.length - 1 ? w + ' ' : w));
  seg ??= new Intl.Segmenter('ja', { granularity: 'word' });
  const out: string[] = [];
  let open = '';
  for (const { segment: t } of seg.segment(s)) {
    if (CLOSE.test(t) && out.length) out[out.length - 1] += t;
    else if (OPEN.test(t)) open += t;
    else { out.push(open + t); open = ''; }
  }
  if (open) out.push(open);
  return out;
}
/** The word without its spacing and punctuation, for matching highlighted words. */
export const bare = (w: string) => w.replace(/[\s.,:;!?、。，．：；！？「」『』（）…]/g, '');
/** Is this word one of the highlighted ones? (Japanese highlights may span several ICU words.) */
export const isRed = (w: string, red?: string[]) => {
  const b = bare(w);
  return !!b && !!red?.some((r) => { const rb = bare(r); return rb === b || (CJK.test(rb) && rb.includes(b)); });
};
