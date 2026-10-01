# In[1]:= — the life of a language

A 2:48 code-rendered short film about the Wolfram Language / Mathematica as a *language*:
its vocabulary growing from 554 words (1988) to 6,801 (2026), told inside one notebook window
whose chrome and front-end style change era by era (Mac System 6 → NeXTSTEP → Windows 3.1 →
Windows 95 → Mac OS 9 → Windows XP → Mac OS X → flat → modern → dark mode → 15's AI chatbar).

Everything is code: the film is a Wolfram Language computational essay, every frame drawn by
[WAnim](https://github.com/sw1sh/WAnim) and the soundtrack a `Track` it renders. No generative image/video/music models.

## Watch

- **Director's cut** (player, chapters, synced commentary, every snippet runnable, English · Русский · 日本語): https://claude.ai/artifact/7DnTACiGrt9hpVJW6bxxJo
- English: https://www.wolframcloud.com/obj/wolframinstitute/WolframFilm/In1-en.mp4
- Русский: https://www.wolframcloud.com/obj/wolframinstitute/WolframFilm/In1-ru.mp4
- 日本語: https://www.wolframcloud.com/obj/wolframinstitute/WolframFilm/In1-ja.mp4
- Notebook (the film as a Wolfram Language essay, WAnim): https://www.wolframcloud.com/obj/wolframinstitute/WolframFilm/In1.nb, its render: https://www.wolframcloud.com/obj/wolframinstitute/WolframFilm/In1.mp4
- Source: https://github.com/WolframInstitute/WolframFilm

Made with Claude Opus 5.5 in Claude Code, following the September 2026 trend of films rendered entirely by model-written code:
[deedydas' history-of-Google video](https://x.com/deedydas/status/2103965547780345859) and
[mexicat/pdoom-video](https://github.com/mexicat/pdoom-video) ("I'm Upping My P(doom)").

- Script and shot list, with every date and claim sourced: `docs/SCRIPT.md`
- UI references per era: `docs/UI-ERAS.md`

## Build

```sh
wolframscript -f scripts/build.wls In1       # (from the repository root) In1.md -> In1.nb, renders In1.mp4, publishes
wolframscript -f scripts/publish.wls In1     # publish the built notebook again
```

`In1.md` is self-contained: nothing is read from disk. The vocabulary comes from `WolframLanguageData` plus the 15.0
new-features guide, the notebook outputs are evaluated, the archive prints are imported from their public URLs, and
every segment is one WAnim creation tool (`Typewriter`, `Terminal`, `Title`, `NotebookSession`, `WordWall`, `Caption`,
`DictionaryCard`, `PhotoPrint`, `Counter`, `YearRuler`, `Spikey`, `AutomatonTape`) in one `AnimatedGraphics` whose
soundtrack is a `Track` -- the Rule 30 melody is also what the automaton tape reads.  In the notebook,
`film["Dynamic"]` plays it live (the audio is the master clock) and `film["Video"]` renders it.

The fonts must be installed for the front end to see them: Source Sans 3, Source Serif 4, Source Code Pro, Arimo,
Courier Prime and VT323, all from [Google Fonts](https://fonts.google.com).

## The first cut

The film was first made in TypeScript (Canvas2D through Skia, a small synth), in English, Russian and Japanese, with
a director's cut page; those are the `In1-en`, `In1-ru` and `In1-ja` videos above and the director's cut.  That code
lives in the repository's history: `git checkout 06cd606 -- src assets data artifact` (and `bun install`) brings it back.

## Credits & sources

- Window outputs are computed by the Wolfram Language 15.0 kernel, SystemModeler for the double pendulum, the Wolfram Data Repository ("Fireballs and Bolides") and Function Repository (`BirdSay`), the Quantum Framework paclet.
- Archive prints (imported by the notebook from their public URLs, listed below): Stephen Wolfram's [scrapbook](https://www.stephenwolfram.com/scrapbook/), the [Mathematica Scrapbook](https://www.wolfram.com/mathematica/scrapbook/), and posts on [writings.stephenwolfram.com](https://writings.stephenwolfram.com).
- `next-cube-1.jpg`: NeXTcube at CERN, photo by Geni, [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:NeXTcube_first_webserver.JPG), [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) (credited on screen).
- Facts: `docs/SCRIPT.md` lists every date/claim with its source.
- Dictionary entries: usage lines from the [Wolfram Language documentation](https://reference.wolfram.com/language/) (Japanese cut: the [Japanese documentation](https://reference.wolfram.com/language/index.html.ja)); the lexicon from [`WolframLanguageData`](https://reference.wolfram.com/language/ref/WolframLanguageData.html).

### Further reading (cited in the director's commentary)

- [There Was a Time before Mathematica (2013)](https://writings.stephenwolfram.com/2013/06/there-was-a-time-before-mathematica/)
- [Steve Jobs: A Few Memories (2011)](https://writings.stephenwolfram.com/2011/10/steve-jobs-a-few-memories/)
- [We’ve Come a Long Way in 30 Years (2018)](https://writings.stephenwolfram.com/2018/06/weve-come-a-long-way-in-30-years-but-you-havent-seen-anything-yet/)
- [The Story of Spikey (2018)](https://writings.stephenwolfram.com/2018/12/the-story-of-spikey/)
- [Launching Mathematica 10 (2014)](https://writings.stephenwolfram.com/2014/07/launching-mathematica-10-with-700-new-functions-and-a-crazy-amount-of-rd/)
- [Launching the Wolfram Data Repository (2017)](https://writings.stephenwolfram.com/2017/04/launching-the-wolfram-data-repository-data-publishing-that-really-works/)
- [The Wolfram Function Repository (2019)](https://writings.stephenwolfram.com/2019/06/the-wolfram-function-repository-launching-an-open-platform-for-extending-the-wolfram-language/)
- [Introducing Chat Notebooks (2023)](https://writings.stephenwolfram.com/2023/06/introducing-chat-notebooks-integrating-llms-into-the-notebook-paradigm/)
- [Launching Version 15 (2026)](https://writings.stephenwolfram.com/2026/06/launching-version-15-of-wolfram-language-mathematica-built-in-useful-ai-lots-of-new-core-functionality/)
- [Wolfram tech as a Foundation Tool for LLMs (Feb 2026)](https://writings.stephenwolfram.com/2026/02/making-wolfram-tech-available-as-a-foundation-tool-for-llm-systems/)

### Archive image sources

<details><summary>35 sources for the 40 archive images</summary>

- `smp-manual-1.jpg` (1981): SMP manual cover, version one, Caltech, July 1981 — https://www.stephenwolfram.com/scrapbook/1981-mathematicas-immediate-ancestor/
- `smp-summary-handwritten-1.png` (1980): Handwritten SMP language summary on yellow legal paper — https://writings.stephenwolfram.com/2013/06/there-was-a-time-before-mathematica/
- `smp-ad-1.png` (1983): 'Algebra will never be the same again' SMP ad — https://www.wolfram.com/mathematica/scrapbook/1983/12/01/smp-ad-thumb/
- `design-sketch-1986-1.jpg` (1986): Handwritten sketch of early Mathematica operator syntax — https://www.wolfram.com/mathematica/scrapbook/1986/02/01/prewri_inventingthelanguage-2/
- `design-notes-1986-1.jpg` (1986): Typed design notes, Nov 24 1986: pure functions, Map — https://www.wolfram.com/mathematica/scrapbook/1986/02/02/prewri_firstweeks-2/
- `design-notes-handwritten-1.png` (1986): Early Mathematica handwritten design notes — https://writings.stephenwolfram.com/2016/04/my-life-in-technology-as-told-at-the-computer-history-museum/
- `first-code-1986-1.jpg` (1986): First Mathematica C code: evaluator, Nov 27 1986 — https://www.wolfram.com/mathematica/scrapbook/1986/04/03/1987_mathematicafirstcode-2/
- `early-program-1987-1.png` (1987): Early Mathematica package: ContinuedFractions.pm, June 1987 — https://www.stephenwolfram.com/scrapbook/1987-mathematica-is-alive-programs-in-mathematica-before-it-was-mathematica/
- `product-names-1987-1.jpg` (1987): 'Some perhaps possible product names' list, Aug 1987 — https://www.stephenwolfram.com/scrapbook/1987-omega-polymath-technique-and-finally-mathematica/
- `frontend-1987-1.jpg` (1987): Early Mathematica notebook front end on Macintosh — https://www.wolfram.com/mathematica/scrapbook/1987/02/08/1987_frontend-2/
- `v1-box-1.png` (1988): Mathematica for the Macintosh 1.0 box and floppy — https://www.stephenwolfram.com/scrapbook/june-23-1988-mathematica-version-1/
- `v1-book-1.jpg` (1988): First Mathematica book, Addison-Wesley, 1988 — https://www.stephenwolfram.com/scrapbook/june-23-1988-the-mathematica-book-is-published/
- `v1-press-release-1.jpg` (1988): June 23 1988 press release introducing Mathematica — https://www.stephenwolfram.com/scrapbook/june-23-1988-mathematica-arrives/
- `v1-launch-speakers-1.jpg` (1988): Corporate speakers list, Mathematica announcement, June 23 1988 — https://www.wolfram.com/mathematica/scrapbook/1988/03/06/1988_announcementevent-2/
- `v1-startup-screen-1.png` (1988): Mathematica for Macintosh 1988 startup screen — https://writings.stephenwolfram.com/2018/06/weve-come-a-long-way-in-30-years-but-you-havent-seen-anything-yet/
- `v1-press-clipping-1.jpg` (1988): 'It's hot, it's sexy, it's... calculus?' press clipping — https://www.stephenwolfram.com/scrapbook/june-24-1988-the-day-after-mathematica-is-a-hit/
- `v1-apple-poster-1989-1.jpg` (1989): Apple poster: Einstein, 'Macintosh + Mathematica = infinity' — https://www.stephenwolfram.com/scrapbook/1989-apple-and-albert-promote-mathematica/
- `next-license-1.jpg` (1987): NeXT-Wolfram Mathematica software license agreement, Nov 1987 — https://www.wolfram.com/mathematica/scrapbook/1987/02/11/1987_nextsignson-2/
- `next-display-1.jpg` (1988): Mathematica running on a NeXT computer display — https://www.stephenwolfram.com/scrapbook/1988-mathematica-is-bundled-on-every-next-computer/
- `next-cube-1.jpg` (1990): NeXTcube at CERN, Tim Berners-Lee's first web server — https://commons.wikimedia.org/wiki/File:NeXTcube_first_webserver.JPG
- `next-jobs-card-1.jpg` (1987): Steve Jobs' NeXT, Inc. business card — https://writings.stephenwolfram.com/2011/10/steve-jobs-a-few-memories/
- `v2-box-book-1.png` (1991): Mathematica 2.0 box and The Mathematica Book, 2nd edition — https://www.stephenwolfram.com/scrapbook/1991-mathematica-2-is-released/
- `books-1995-1.jpg` (1995): Shelf of Mathematica books from many publishers — https://www.stephenwolfram.com/scrapbook/1995-lots-and-lots-of-mathematica-books/
- `v3-book-1.jpg` (1996): The Mathematica Book, Third Edition, Mathematica Version 3 — https://www.stephenwolfram.com/scrapbook/1996-mathematica-3-is-released/
- `v3-typeset-1.jpg` (1996): Mathematica 3.0 typeset integral output — https://www.wolfram.com/mathematica/scrapbook/1996/07/10/1996_typeset-2/
- `v6-reinvented-1.jpg` (2007): 'Mathematica Reinvented' version 6 launch graphic — https://www.stephenwolfram.com/scrapbook/may-1-2007-a-revolution-in-mathematica/
- `v6-box-1.jpg` (2007): Wolfram Mathematica 6 product box — https://www.wolfram.com/mathematica/scrapbook/2007/11/03/2007_mathematica6box-2/
- `demonstrations-2007-1.png` (2007): Wolfram Demonstrations Project site and first Demonstration — https://www.stephenwolfram.com/scrapbook/2007-creating-the-very-first-demonstration-for-the-wolfram-demonstrations-project/
- `wl2013-something-big-1.png` (2013): 'Something Very Big Is Coming' teaser graphic — https://writings.stephenwolfram.com/2013/11/something-very-big-is-coming-our-most-important-technology-project-yet/
- `wl2013-raspberry-pi-1.png` (2013): Wolfram Language & Mathematica free on every Raspberry Pi — https://writings.stephenwolfram.com/2013/11/putting-the-wolfram-language-and-mathematica-on-every-raspberry-pi/
- `wl2014-sxsw-1.jpg` (2014): Wolfram Language debut at SXSW, from the stage — https://www.stephenwolfram.com/scrapbook/2013-wolfram-language-makes-its-debut-at-sxsw/
- `chat-notebooks-2023-1.png` (2023): Chat Notebooks: 1988 Mac notebook to 2023 LLM chat — https://writings.stephenwolfram.com/2023/06/introducing-chat-notebooks-integrating-llms-into-the-notebook-paradigm/
- `v14-functions-1.png` (2024): Wolfram Language 14: built-in functions by version — https://writings.stephenwolfram.com/2024/01/the-story-continues-announcing-version-14-of-wolfram-language-and-mathematica/
- `v15-launch-1.png` (2026): Version 15 launch post table of contents — https://www.wolfram.com/mathematica/scrapbook/2026/06/16/june-16-2026-mathematica-15-released/
- `spikey-versions-1.png` (2018): Mathematica Spikeys by version, 1988 to 2019 — https://writings.stephenwolfram.com/2018/12/the-story-of-spikey/

</details>

