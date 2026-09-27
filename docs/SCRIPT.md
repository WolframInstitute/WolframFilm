# In[1]:= — the life of a language

A short film about **the Wolfram Language (Mathematica) as a language**: a computational language that grows the way a natural language does, word by word, as the interface between people and machines. The focus is not mathematics. It covers vocabulary, grammar, meaning and knowledge of the world, and finally machines that speak it too.

**Length** 2:30 (75 bars) · **Tempo** 120 BPM, so 1 bar = 2.000 s and 1 beat = 0.500 s · **Picture** 1920×1080, 60 fps · **Sound** a score composed in code, no narration

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

## Shot list (bar = 2 s)

| Bars | Time | Section | Music | Picture and on-screen text |
|---|---|---|---|---|
| 0–4 | 0:00 | **Cold open** | Rule 30 pluck melody alone | Black. A cursor blinks. Types: **"Every language starts with a few words."** |
| 4–8 | 0:08 | **1979–81 · SMP** | + pad | Green-phosphor terminal (VT323). SMP-style session lines type in. *"1979. A 20-year-old physicist writes a language for talking to his computer: SMP."* |
| 8–10 | 0:16 | **1986** | + soft kick | The terminal collapses to a point. White page, a lone cursor. *"1986. He starts again, with a language for everything."* |
| 10–12 | 0:20 | **The name** | riser | The word `Mathematica` types itself, letter by letter. *"Steve Jobs suggests the name."* |
| 12–16 | 0:24 | **June 23, 1988 · 1.0** | **DROP 1** | Mac System 6 window (1-bit, striped title bar). All **554** words burst out and settle into a lexicon grid, the most common word largest (`List`, `Rule`, `Times`, `Set`…). Counter **554**. *"Mathematica 1.0: 554 words."* |
| 16–18 | 0:32 | **NeXT** | | Chrome flips to NeXTSTEP greys. *"Bundled with every NeXT computer."* |
| 18–20 | 0:36 | **Grammar** | | `f[x]`: one form for everything. A string, a colour and a picture each unfold into `Head[args]` trees. *"One grammar for everything."* |
| 20–22 | 0:40 | **2.0 · 1991** | groove | Windows 3.1 chrome. +263. Headword **Module**. *"It learns to keep things local, and to talk to other programs."* |
| 22–24 | 0:44 | **3.0 · 1996** | | Windows 95 chrome. +543. The notebook turns inside out: its cells are `Cell[…]` expressions. *"The notebook itself is written in the language."* |
| 24–26 | 0:48 | **4.0 · 1999** | hats in 16ths | Mac OS 9 Platinum. +186. **Import / Export**: file icons flow in and out. *"It learns to read and write the world's formats."* |
| 26–28 | 0:52 | **5.1 · 2004** | | Aqua. `Red Blue Green Orange Yellow Gray…` drop in, each in its own colour. *"It learns the names of colours."* |
| 28–32 | 0:56 | **6.0 · 2007** | filter follows the slider | The 2007 redesign. +611. `CountryData`, `CityData`, `WordData`, `FinancialData`. A `Manipulate` slider drives the **music's filter**. *"It learns about the world, and it starts to answer back."* |
| 32–33 | 1:04 | **7 · 2008** | cuts every bar | +399. `Image`, `Speak`. *"It learns to see, and to speak."* |
| 33–34 | 1:06 | **8 · 2010** | | +638. A free-form input line (plain English) turns into code. *"It learns to understand English."* |
| 34–35 | 1:08 | **9 · 2012** | | +398. `Quantity[3.2, "Kilometers"]`, with the Suggestions Bar below. *"It learns units."* |
| 35–37 | 1:10 | **Breakdown** | pad, arpeggio, riser | The ground darkens. *"It isn't just for math anymore. It needs a name."* |
| 37–45 | 1:14 | **Wolfram Language · 2013–14** | **DROP 2** | Flip to ink. **The Wolfram Language.** Version 10 adds **1,022 words, the biggest release ever**, raining into a wall. Entity blobs: `Entity["Country", "France"]`. Headword **Entity**: *"a thing in the world, as an expression."* *"Free on every Raspberry Pi."* |
| 45–46 | 1:30 | **11 · 2016** | | +518. `NetTrain`, `Audio`. *"It learns to learn."* |
| 46–47 | 1:32 | **12 · 2019** | | +793. `SpeechRecognize`. *"It learns to listen."* |
| 47–48 | 1:34 | **13 · 2021** | | +328 |
| 48–52 | 1:36 | **13.3 · 2023** | a "voice" lead (formant synth) | A chat notebook. A human writes in English, and an LLM answers *in Wolfram Language*, which evaluates. `LLMFunction`, `ChatObject`. *"Now machines learn to speak it."* |
| 52–54 | 1:44 | **14.x · 2024–25** | filter down | `SemanticSearch`, `Tabular`; **14.3's dark mode** flips the window. |
| 54–60 | 1:48 | **15 · 2026** | melody spotlit | +108. **MusicNote**, `MusicChord`, `MusicScore`. The melody you hear appears as `MusicNote[…]` expressions and as a score. *"It learns music."* |
| 60–68 | 2:00 | **Climax** | biggest section, key lift | All 6,801 words as one wall, sized by real usage frequency. A growth curve draws across it, 1988 → 2026, one version per beat. Stats snap in: *words got longer: 8.1 → 15.4 letters*; *219 words ask questions: …Q*; *634 carry a person's name*. |
| 68–75 | 2:16 | **Outro** | final chord; Rule 30 melody returns | Back to a light, modern notebook. `In[1]:=` with a blinking cursor. *"6,801 words. Still growing."* Title: **The Wolfram Language · 1988–2026**. |

## Port notes (for the later WolfAnim/WL version)

- Every frame is a pure function of time `t`. Scenes draw only 2D primitives (paths, polygons, text, images and affine transforms), which map one-to-one onto WL `Graphics`.
- The score is data (`src/music/score.ts` → `out/score.json`): note events in bars and beats, per instrument. It maps directly onto `MusicNote`/`SoundNote` in v15.
- The timeline (`src/timeline.ts`) is bar-indexed and never uses raw seconds.
- The lexicon (`data/*.json`) was produced by `data/*.wls`, so the WL version can recompute it live.
