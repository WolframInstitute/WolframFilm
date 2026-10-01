# In[1]:= — the life of a language

A short film about **the Wolfram Language (Mathematica) as a language**: a computational language that grows the way a natural language does, word by word, as the interface between people and machines. The focus is not mathematics. It covers vocabulary, grammar, meaning and knowledge of the world, and finally machines that speak it too.

**Length** 2:42 (81 bars) · **Tempo** 120 BPM, so 1 bar = 2.000 s and 1 beat = 0.500 s · **Picture** 1920×1080, 60 fps · **Sound** a score composed in code, no narration

## The idea

**One notebook window lives through 47 years.** Its chrome re-skins at every era: SMP terminal → Mac System 6 → NeXTSTEP → Windows 3.1 → Windows 95 → Mac OS 9 → Aqua → the 2007 redesign → the flat 2014 look → chat notebooks → the 2025 dark mode → 2026. Inside it, the language is **learning words**. Each version is a *dictionary entry*: the year, the new words (real names, straight from `WolframLanguageData`), a signature word set as a dictionary headword, and a line about what the language learned to *say*.

The HUD is a lexicon: a running **word count** (554 → 6,801) in the corner and a year ruler along the bottom. Words spill out of the window as they're coined, and by the climax they fill the frame.

**Every number on screen is computed from the language's own data.** Sources: `WolframLanguageData[All, {"Name", "FullVersionIntroduced", "Frequencies", "PlaintextUsage", …}]` from a 15.0 kernel (6,693 symbols up to 14.3), plus the official New in 15.0 listing (108 symbols).

## The facts the film stands on (verified)

| Fact | Value | Source |
|---|---|---|
| SMP started | Nov 1979, at Caltech; Wolfram was 20 | "There Was a Time before Mathematica" (2013) |
| SMP v1 | June 1981 | same |
| First Mathematica code | Oct 1986 | same, plus the Scrapbook |
| Name | Suggested by Steve Jobs | "Steve Jobs: A Few Memories" (2011) |
| 1.0 | June 23, 1988: **554 words**; notebooks from day one; bundled on NeXT | lexicon; 2018 "30 years" post |
| 2.0 | Jan 1991: +263 (`Module`, `With`, MathLink) | lexicon; Quick Revision History (QRH) |
| 3.0 | Sep 1996: +543; notebooks are expressions (`Cell`, `Notebook`, `RowBox`); typeset input | lexicon; QRH |
| 4.0 | May 1999: +186; `Import`, `Export` | lexicon; QRH |
| 5.x | 2003–04: +103; 5.1 (Oct 2004) names the colours `Red`, `Blue`, `Green`… | lexicon |
| 6.0 | May 2007: +611; `Manipulate`, `Dynamic`, `CountryData`, `CityData`, `WordData`, `FinancialData` | lexicon |
| 7 | Nov 2008: +399; `Image`, `Speak` | lexicon |
| 8 | Nov 2010: +638; free-form natural-language input, `WolframAlpha[]`, `TextRecognize` | lexicon; QRH |
| 9 | Nov 2012: +398; `Quantity`, units; Suggestions Bar | lexicon; QRH |
| Wolfram Language | named Nov 13, 2013; free on every Raspberry Pi from Nov 21, 2013 | Wolfram's blog posts |
| 10 | Jul 9, 2014: **+1,022, the largest release**; `Entity`, `Association`, `Interpreter`, `LanguageData`, `Classify` | lexicon |
| 11 | Aug 2016: +518; `NetTrain`, `Audio` | lexicon |
| 12 | Apr 2019: +793; `SpeechRecognize`, `ImageCases`, `ResourceFunction` | lexicon |
| 13 | Dec 2021 | lexicon |
| 13.3 | Jun 28, 2023: `LLMFunction`, `ChatObject`, `LLMSynthesize`; Chat Notebooks | lexicon; QRH |
| 14.x | 2024–25: `SemanticSearch` (14.1), `Tabular` (14.2), dark mode (14.3) | lexicon; QRH |
| 15.0 | Jun 16, 2026: +108; `MusicNote`, `MusicChord`, `MusicScore`…; AI Assistant | New in 15.0 listing |
| Word length | the average new word grew from **8.1 letters (1.0) to 15.4 (15.0)** | lexicon |
| Most used words | `List`, `Rule`, `Times`, `Power`, `Set`: the language's "the, of, and" | `Frequencies` |
| Question words | **219** words end in `Q` (`EvenQ`, `StringQ`…); the suffix makes a question | lexicon |
| Eponyms | **634** words carry a person's name | `EponymousPeople` |

## Look

- **The window is the protagonist.** Each skin is faithful to its era's OS and front end: fonts, bevels, title bars, cell brackets, In/Out labels, and the default look of outputs (`-Graphics-` before 3.0; pastel `Plot3D` lighting; the 2007 syntax colouring; the 2014 flat style; Entity blobs; chat cells; dark mode). References are in `refs/UI-ERAS.md`. Chrome is generic (shapes and colours of the era), with no Apple, NeXT, Microsoft or OpenAI logos.
- **Outside the window**: a warm paper ground `#F4F1EA` until 2013, then deep ink `#0E0F11`. Wolfram red `#DD1100` is the only accent colour outside the window.
- **Type**: Source Sans 3 for captions and dictionary headwords (with Source Serif 4 italic for the "pronunciation/part-of-speech" line), Source Code Pro for words-as-code, VT323 for the 1981 terminal.
- **Motion**: holds and snaps. Words arrive on 16th notes, cuts and chrome flips land on downbeats, and the window never floats aimlessly.

## Shot list (bar = 2 s) — v3 structure, 81 bars / 2:42

Every window output below is **computed by the Wolfram Language** (local 15.0 kernel via `wolframscript`, scripts in `data/assets/`), not drawn to look like it.

| Bars | Time | Section | Picture (window output · narrator) |
|---|---|---|---|
| 0–4 | 0:00 | Cold open | "Every language starts with a few words." |
| 4–8 | 0:08 | SMP 1979–81 | green-phosphor session `#I[1]:: Ex[(a + b)^3]` |
| 8–12 | 0:16 | 1986 · the name | "He starts again…" · `Mathematica` typed · Jobs suggested the name |
| 12–16 | 0:24 | **1.0** Mac, 1-bit (DROP) | `Names["*"]` → the first 554 words · `Plot3D` dithered + `-SurfaceGraphics-` |
| 16–20 | 0:32 | NeXT (4 greys) · grammar | `Characters["NeXT"]` · `FullForm[{x -> 1, f[y]}]` → tree |
| 20–22 | 0:40 | **2.0** Windows 3.1 | `StringReverse` · pastel `ParametricPlot3D` |
| 22–24 | 0:44 | **3.0** Windows 95 | text cell flips to `Cell[…]` · BasicInput palette |
| 24–26 | 0:48 | **4 / 4.2** Mac OS 9 | `Import` · `CellularAutomaton[30]` grows row by row |
| 26–28 | 0:52 | **5.1** Windows XP | named colours → `RGBColor[…]` · a colourful named-colour graphic |
| 28–32 | 0:56 | **6.0** Mac OS X | `WordData` · Europe from `CountryData` · `TuringMachine` · `Manipulate[Plot3D…]` drives the music's filter |
| 32–34 | 1:04 | **…Plot families** | 8 real plots, one per beat; every *Plot/*Chart word scrolls behind |
| 34–37 | 1:08 | 7 · 8 · 9 | `Speak` · free-form English · units + Suggestions Bar |
| 37–39 | 1:14 | Breakdown | "It isn't only for math anymore. It needs a name." |
| 39–45 | 1:18 | **The Wolfram Language · 10** (DROP 2) | title card · `Interpreter` → Entity · night-side globe (`GeoGraphics`) · `WordTranslation` · entities |
| 45–48 | 1:30 | **11** · repositories | `NetTrain` · `ResourceFunction["BirdSay"]` · cards: Demonstrations 2007, Community 2013, Data 2017, Neural Net 2018, Function 2019 · "Now anyone can add words." |
| 48–49.5 | 1:36 | **12** | `MoleculePlot3D` · `SystemModel` |
| 49.5–52 | 1:39 | **13.2** astronomy | `AstroGraphics` · "From the Earth to the stars." |
| 52–56 | 1:44 | **13.3** chat | chat cell → LLM answers in code → evaluates (Alice word counts) |
| 56–58 | 1:52 | **14.x** dark mode | `Tabular` of the language's own releases |
| 58–64 | 1:56 | **15** | AI chatbar → `MusicScore` of the melody you hear |
| 64–66 | 2:08 | **2026 · agents** | a terminal: an AI calling the language (the real calls used to make this film) |
| 66–74 | 2:12 | Climax | the whole lexicon wall, growth curve, statements (most common word, longer words, …Q, eponyms) |
| 74–81 | 2:28 | Outro | fresh notebook `In[1]:=` · "6,801 words. Still growing." |

Additional verified facts for v3: CellularAutomaton 4.2 (2002); TuringMachine 6.0 (2007); Data Repository Apr 2017; Neural Net Repository Jun 2018; Function Repository Jun 2019 (ResourceFunction 12.0); Paclet Repository Mar 2023; Prompt Repository Jun 2023; Demonstrations May 2007; Community Jul 2013; SystemModel 11.3 (2018; 3D animation is a System Modeler product feature); GeoGraphics 10.0; AstroGraphics 13.2; FindSolarEclipse 15.0; Wolfram Foundation Tool (MCP) Feb 23, 2026.

## Port notes (for the later WolfAnim/WL version)

- Every frame is a pure function of time `t`. Scenes draw only 2D primitives (paths, polygons, text, images and affine transforms), which map one-to-one onto WL `Graphics`.
- The score is data (`src/music/score.ts` → `out/score.json`): note events in bars and beats, per instrument. It maps directly onto `MusicNote`/`SoundNote` in v15.
- The timeline (`src/timeline.ts`) is bar-indexed and never uses raw seconds.
- The lexicon (`data/*.json`) was produced by `data/*.wls`, so the WL version can recompute it live.
