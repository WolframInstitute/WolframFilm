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
```

## Layout

- `src/core/` — clock (120 BPM, bar = 2 s), drawing kit, lexicon, scene runner
- `src/music/` — `score.ts` (the music as data), `dsp.ts`, `instruments.ts`, `render-audio.ts` (+ foley from the story)
- `src/ui/` — era rendering: `screen.ts` (low-res/1-bit/4-grey upscaling), `chrome.ts` (OS chrome), `notebook.ts` (cells, era styles), `widgets.ts` (Manipulate, free-form, Suggestions Bar, Entity, chat, Tabular, MusicScore, chatbar)
- `src/film/` — `story.ts` (eras, cells, captions, dictionary entries), `window.ts`, `wall.ts` (the lexicon wall), `hud.ts`, `narrator.ts`, `scenes/`

## Port notes (WolfAnim / WL)

Scenes use only paths, text, images and affine transforms (→ `Graphics`); the score is note events
in bars (→ `MusicNote`/`SoundNote`); the timeline is bar-indexed; the lexicon comes from
`WolframLanguageData`, so the WL version can compute it live.
