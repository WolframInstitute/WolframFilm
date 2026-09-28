# In[1]:= — the life of a language

A 2:30 code-rendered short film about the Wolfram Language / Mathematica as a *language*:
its vocabulary growing from 554 words (1988) to 6,801 (2026), told inside one notebook window
whose chrome and front-end style change era by era (Mac System 6 → NeXTSTEP → Windows 3.1 →
Windows 95 → Mac OS 9 → Windows XP → Mac OS X → flat → modern → dark mode → 15's AI chatbar).

Everything is code: every frame is a pure function of time drawn with Canvas2D, and the
soundtrack is a symbolic score rendered by a small synth. No generative image/video/music models.

- Script and shot list: `docs/SCRIPT.md`
- UI references per era: `refs/UI-ERAS.md` (+ `refs/ui/`, reference only)
- Lexicon data: `data/*.wls` (run with `wolframscript -file`) → `src/data/lexicon.json`

## Run

```sh
bun install
bun run music                         # out/music.wav (+ out/score.json)
bun run preview                       # http://localhost:5173  (space, ←/→, ,/. ; ?t=60)
bun src/render.ts sheet --n 24        # contact sheet -> out/sheet.png
bun src/render.ts stills --at 26,50   # stills at seconds
bun src/render.ts video --out out/film.mp4 [--from s --to s] [--samples 4]
bun run build                         # incremental: out/film.mp4 + out/player/ (fMP4 segments)
```

## Languages

English, Russian and Japanese cuts: `FILM_LANG=ru|ja` in front of any command above (`bun run build:ru`, `build:ja`,
`build:all`; stills land in `out/still-ru-*.png`). Run `scripts/fetch-fonts.sh` once for the Noto CJK, DotGothic16,
Klee One and Cousine fallbacks.

- `src/core/i18n.ts` — `tr()` (dictionary keyed by the English text, Russian plurals as `{p:слово|слова|слов}`),
  `words()` (Japanese word units via `Intl.Segmenter`, with punctuation kept on the right side), locale numbers
- `src/i18n/{ru,ja}.json` — every on-screen string; `bun src/i18n-check.ts` lists what is missing
- `src/i18n/usage-{ru,ja}.json` — dictionary-entry usage lines: Japanese quoted from reference.wolfram.com (`.html.ja`), Russian translated
- `src/i18n/directors-{ru,ja}.json` — the director's commentary; `artifact/build.sh` inlines all three languages into the page

Code, outputs and symbol names are never translated. Menus follow the localized systems (Japanese Windows shows
`ファイル(F)`), the climax says the most common Russian word is «и» and the Japanese one の, and each cut deploys itself
to its own `In1[-ru|-ja].mp4` (`wolframscript -file data/deploy.wls ru`). The encode cache is keyed by pixel hash,
so rebuilding a language after an edit only re-encodes the sections that changed.

## Layout

- `src/core/` — clock (120 BPM, bar = 2 s), drawing kit, lexicon, scene runner
- `src/music/` — `score.ts` (the music as data), `dsp.ts`, `instruments.ts`, `render-audio.ts` (+ foley from the story)
- `src/ui/` — era rendering: `screen.ts` (low-res/1-bit/4-grey upscaling), `chrome.ts` (OS chrome), `notebook.ts` (cells, era styles), `widgets.ts` (Manipulate, free-form, Suggestions Bar, Entity, chat, Tabular, MusicScore, chatbar)
- `src/film/` — `story.ts` (eras, cells, captions, dictionary entries), `window.ts`, `wall.ts` (the lexicon wall), `hud.ts`, `narrator.ts`, `scenes/`

## Port notes (WolfAnim / WL)

Scenes use only paths, text, images and affine transforms (→ `Graphics`); the score is note events
in bars (→ `MusicNote`/`SoundNote`); the timeline is bar-indexed; the lexicon comes from
`WolframLanguageData`, so the WL version can compute it live.

## Credits & sources

- Window outputs are computed by the Wolfram Language 15.0 kernel (`data/assets/*.wls`, `data/assets2/*.wls`), SystemModeler for the double pendulum, the Wolfram Data Repository ("Fireballs and Bolides") and Function Repository (`BirdSay`), the Quantum Framework paclet.
- Archive prints (`assets/archive/`, see its `manifest.json` for per-image source URLs): Stephen Wolfram's scrapbook (stephenwolfram.com/scrapbook), the Mathematica Scrapbook (wolfram.com/mathematica/scrapbook), and posts on writings.stephenwolfram.com.
- `next-cube-1.jpg`: NeXTcube at CERN, photo by Geni, Wikimedia Commons, CC BY-SA 4.0 (credited on screen).
- Facts: docs/SCRIPT.md lists every date/claim with its source.
