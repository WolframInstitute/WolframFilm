---
Template: ComputationalEssay
Name: "In[1]:= The Life of a Language"
Author: Nikolay Murzin
Date: 2026
Description: "A film about the Wolfram Language told as a natural language gaining words, computed and composed entirely in this notebook with WAnim"
Abstract: "A language is its words. This notebook makes a film about the Wolfram Language told that way: its vocabulary growing from a few hundred words in 1988 to thousands today, watched through the notebooks it was typed into, each of its era. Everything is computed here. The vocabulary comes from WolframLanguageData, the notebook outputs are evaluated, the melody is the centre column of Rule 30, and the picture reads the same melody Track that sounds. Each segment of the film is one WAnim creation tool, so the whole edit is a list a person could type live. These are its first sixteen bars."
Keywords: [WAnim, Timeline, Track, Rule 30, WolframLanguageData, film, music, notebook history]
Sources: ["[WAnim](https://github.com/sw1sh/WolfAnim)", "[Summary of New Features in 15.0](https://reference.wolfram.com/language/guide/SummaryOfNewFeaturesIn150.html)", "[Stephen Wolfram's scrapbook](https://www.stephenwolfram.com/scrapbook/)"]
Links: ["[What Is a Computational Essay?](https://writings.stephenwolfram.com/2017/11/what-is-a-computational-essay/)"]
---

## A Film Is a List

A film here is a Timeline: a list of layers, each drawing its part of the picture at every moment it covers. WAnim's creation tools make those layers. A typed line, a terminal of 1979, a notebook of 1988 that types and evaluates on the clock, a card for a symbol, a dancing Spikey: each segment of the film is one call, placed in time. The soundtrack is a Track, a pattern that answers what plays when, and the picture can ask it the same question.

The creation tools, the canvas they draw on, and the pattern language:

```wl
Needs["WolframInstitute`WAnim`"]
```

The film counts in bars of 120 BPM. A bar is one Track cycle and lasts two seconds:

```wl
$CyclesPerSecond = 1/2;
```

## The Vocabulary

Every documented symbol, with the version that introduced it and how often it is used across code, documentation and notebooks:

```wl
lexicon = Cases[WolframLanguageData[All, {"Name", "VersionIntroduced", "Frequencies"}],
    {n_String, v_, f_} :> <|"Name" -> n, "Version" -> ToExpression[ToString[v]], "Frequency" -> Replace[f, {{"All" -> w_ ? NumericQ, ___} :> w, _ -> 10.^-9}]|>];
Length[lexicon]
```

The newest words are too new for that data. The guide to what 15.0 added links to them:

```wl
new15 = Intersection[Flatten @ StringCases[Import["https://reference.wolfram.com/language/guide/SummaryOfNewFeaturesIn150.html", "Hyperlinks"],
    "/language/ref/" ~~ n : (WordCharacter | "$") .. ~~ ".html" :> n], Complement[Names["System`*"], lexicon[[All, "Name"]]]];
lexicon = Join[lexicon, <|"Name" -> #, "Version" -> 15., "Frequency" -> 10.^-9|> & /@ new15];
{Length[new15], Length[lexicon]}
```

The film is cut into sections, in bars; music and picture both read from this map:

```wl
sections = <|"cold" -> {0, 4}, "smp" -> {4, 8}, "y1986" -> {8, 10}, "name" -> {10, 12}, "v1" -> {12, 16}, "v2" -> {20, 22}, "v3" -> {22, 24},
    "v4" -> {24, 26}, "v5" -> {26, 28}, "v6" -> {28, 32}, "breakdown" -> {38, 40}, "v11" -> {46, 47}, "llm" -> {55, 59}, "climax" -> {69, 77}, "outro" -> {77, 84}|>;
```

Each version's words arrive on its first bar, the most used first, spread over a bar and a half on sixteenths:

```wl
releases = Table[With[{ws = SortBy[Select[lexicon, Floor[#["Version"]] == r[[1]] &], -#["Frequency"] &]},
    <|"Version" -> r[[1]], "Bar" -> r[[2]], "Words" -> ws, "Arrivals" -> MapIndexed[#1["Name"] -> r[[2]] + Round[24 ((#2[[1]] - 1) / Max[1, Length[ws] - 1])^0.6] / 16. &, ws]|>],
    {r, {{1, 12}, {2, 20}, {3, 22}, {4, 24}, {5, 26}, {6, 28}}}];
Length /@ releases[[All, "Words"]]
```

The number of words in the language at any moment, each release counting up over a bar:

```wl
wordCount[bar_] := Total[If[bar < #["Bar"], 0, Round[Length[#["Words"]] (1 - (1 - Min[1, (bar - #["Bar"]) / 0.9])^3)]] & /@ releases];
wordCount /@ {12, 12.3, 16}
```

## The Score

The harmony walks i, VI, III, VII in A minor, one chord a bar:

```wl
chords = {{57, 60, 64}, {57, 60, 65}, {55, 60, 64}, {55, 59, 62}}; roots = {45, 41, 48, 43};
chordAt[bar_] := chords[[Mod[Floor[bar], 4] + 1]]; rootAt[bar_] := roots[[Mod[Floor[bar], 4] + 1]];
```

The melody is written by Rule 30. The centre column of the automaton grown from one cell gives four bits per eighth note: three pick a degree of A minor pentatonic, the fourth decides whether it sounds; downbeats always sound, on the chord root:

```wl
rule30 = CellularAutomaton[30, {{1}, 0}, {{0, 4000}, {0, 0}}][[All, 1]];
pluckNote[s_] := Which[s >= 8 sections["breakdown"][[1]], Missing[], Mod[s, 8] == 0, chordAt[s / 8][[1]] + 12, rule30[[4 s + 4]] == 0, Missing[],
    True, {69, 72, 74, 76, 79, 81, 84, 86}[[4 rule30[[4 s + 1]] + 2 rule30[[4 s + 2]] + rule30[[4 s + 3]] + 1]]];
```

The melody as a Track that computes itself: asked about any stretch of time, it reads the automaton:

```wl
melody = Track[Function[span, Table[With[{n = pluckNote[s]}, If[MissingQ[n], Nothing,
    <|"Value" -> n, "Whole" -> {s / 8, (s + 1) / 8}, "Part" -> {Max[span[[1]], s / 8], Min[span[[2]], (s + 1) / 8]}|>]], {s, Max[0, Floor[8 span[[1]]]], Ceiling[8 span[[2]]] - 1}]]];
#["Value"] & /@ melody["Query", 0, 1]
```

The rest of the band, written out note by note:

```wl
drums[bar_] := 12 <= bar < sections["outro"][[1]] && ! (sections["breakdown"][[1]] <= bar < sections["breakdown"][[2]]);
kick = EventTrack[Join[Table[{b, 1/4, "bd"}, {b, 8, 11.5, 1/2}], Flatten[Table[If[drums[b], {b + q / 4, 1/4, "bd"}, Nothing], {b, 12, 76}, {q, 0, 3}], 1]]];
band = {Synth["Supersaw"][EventTrack[Flatten[Table[{b, 1, #} & /@ chordAt[b], {b, 4, 76}], 1]]],
    Synth["Sawtooth"][EventTrack[Table[If[drums[s / 8] && OddQ[s], {s / 8, 1/8, rootAt[s / 8] + If[Mod[s, 4] == 3, 12, 0]}, Nothing], {s, 96, 615}]]],
    EventTrack[Flatten[Table[If[drums[b], {{b + 1/4, 1/4, "cp"}, {b + 3/4, 1/4, "cp"}}, Nothing], {b, 12, 76}], 1]],
    EventTrack[Table[If[drums[s / 16] && Mod[s, 4] == 2, {s / 16, 1/16, "hh"}, Nothing], {s, 192, 1231}]],
    EventTrack[{#, 2, "cr"} & /@ {12, 16, 18, 20, 22, 24, 26, 28}], EventTrack[Table[{11 + i / 16, 1/16, "sd"}, {i, 0, 13}]]};
```

The mix, drums from WAnim's own kit:

```wl
score = Track[{Gain[0.3][Synth["Triangle"][melody]], Gain[0.19][band[[1]]], Gain[0.28][band[[2]]], Gain[0.5][kick],
    Gain[0.28][band[[3]]], Gain[0.17][band[[4]]], Gain[0.19][band[[5]]], Gain[0.22][band[[6]]]}];
```

The first sixteen bars:

```wl
Audio[score, 16]
```

## Bars 0 to 4: The Thesis

Typed in the dark, its last word lit, then swallowed by the cursor:

```wl
coldOpen = {Backdrop[RGBColor["#050506"], {0, 4}],
    Typewriter["Every language starts with a few words.", {0.5, 4}, Position -> {960, 554}, "TypingTime" -> 2.1, "Highlight" -> "words", "HighlightTime" -> 2.8,
        "Exit" -> "Collapse", "ExitTime" -> 0.45]};
coldOpen[[2]]["Graphics", 3.2, Background -> Black, ImageSize -> 480]
```

## Bars 4 to 8: SMP, 1979

The session prints its plot the way SMP printed plots: stars joined into vertical runs, tick values written into the axis. The rows are computed:

```wl
asciiPlot = Module[{w = 66, h = 7, rows, row, col, prev = None},
    rows = ConstantArray[" ", {2 h + 1, w}]; row[y_] := Clip[Round[h - y h], {0, 2 h}]; col[x_] := Round[(x - 0.02) / 0.18 (w - 1)];
    rows[[h + 1]] = ConstantArray["_", w];
    Do[MapIndexed[(rows[[h + 1, col[m[[1]]] + #2[[1]]]] = #1) &, Characters[m[[2]]]], {m, {{0.0625, "0.0625"}, {0.125, "0.125"}, {0.1875, "0.1875"}}}];
    rows[[All, 1]] = "|"; rows[[h + 1, 1]] = "0"; rows[[row[0.5] + 1, 1 ;; 3]] = Characters["0.5"]; rows[[row[-0.5] + 1, 1 ;; 4]] = Characters["-0.5"];
    Do[With[{r = row[Sin[1 / (0.02 + 0.18 c / (w - 1))]]}, Do[If[MemberQ[{" ", "_"}, rows[[k + 1, c + 1]]], rows[[k + 1, c + 1]] = "*"],
        {k, If[prev === None, r, Min[prev, r]], If[prev === None, r, Max[prev, r]]}]; prev = r], {c, 1, w - 1}];
    StringJoin /@ rows];
Column[asciiPlot, BaseStyle -> {FontFamily -> "Courier", 8}]
```

The terminal powers on, types the session, prints the plot and the caption, and powers off:

```wl
smp = Terminal[{{4.1, "#I[1]::  Ex[(a + b)^3]"}, {4.6, "#O[1]:   a^3 + 3 a^2 b + 3 a b^2 + b^3", "Output"},
    {4.9, "#I[2]::  Graph[Sin[1/x],x,0.02,0.2]"}, {5.2, "#O[2]:", "Output"}, {5.3, asciiPlot, "Print"},
    {6.5, "NOVEMBER 1979. CALTECH.", "Caption"}, {6.8, "A 20-YEAR-OLD PHYSICIST WRITES A LANGUAGE", "Caption"}, {7.2, "FOR TALKING TO HIS COMPUTER: SMP.", "Caption"}}, {4, 8}];
smp["Graphics", 7.6, ImageSize -> 480]
```

## Bars 8 to 12: 1986, and a Name

Prints from Stephen Wolfram's scrapbook, pinned beside the story:

```wl
scrapbook = Import /@ <|"smp" -> "https://content.wolfram.com/sw-scrapbook/2019/08/1981_smp2_big-1.jpg",
    "code" -> "https://content.wolfram.com/sites/11/1987_MathematicaFirstCode_image1-700x575.jpg",
    "names" -> "https://content.wolfram.com/sw-scrapbook/2019/08/possiblenames.jpg", "v1" -> "https://content.wolfram.com/sw-scrapbook/2019/08/1988_version1_2.png"|>;
prints = {PhotoPrint[scrapbook["smp"], "The SMP manual, Caltech, July 1981", {6, 7.7}, Position -> {1330, 120}, "Size" -> {380, 480}, "Tilt" -> 3, "Kicker" -> "From the archive \[CenterDot] 1981"],
    PhotoPrint[scrapbook["code"], "The first Mathematica code: the evaluator, Nov 27, 1986", {8.3, 9.8}, Position -> {1080, 170}, "Size" -> {720, 560}, "Tilt" -> -2, "Kicker" -> "From the archive \[CenterDot] 1986"],
    PhotoPrint[scrapbook["names"], "Some perhaps possible product names, Aug 1987", {10.25, 11.6}, Position -> {1370, 650}, "Size" -> {440, 270}, "Tilt" -> 2, "Kicker" -> "From the archive \[CenterDot] 1987"],
    PhotoPrint[scrapbook["v1"], "Mathematica 1.0 for the Macintosh", {14.1, 15.85}, "Kicker" -> "From the archive \[CenterDot] 1988"]};
```

The screen turns to paper; he starts again:

```wl
ink = RGBColor["#0E0F11"]; red = RGBColor["#DD1100"];
paper = Backdrop[Blend[{RGBColor["#050506"], RGBColor["#F4F1EA"]}, Easing["OutCubic"][(# - 8) / 0.4]] &, {8, 84}];
y1986 = {Title["1986", {8.05, 10}, Position -> {160, 470}, Alignment -> Left, FontSize -> 220, FontColor -> red, "EnterTime" -> 0.35],
    Typewriter["He starts again, from nothing.", {8.35, 10}, Position -> {170, 580}, Alignment -> Left, "TypingTime" -> 0.55, "Cursor" -> None,
        FontFamily -> "Source Sans 3", FontSize -> 60, FontWeight -> 600, FontColor -> ink],
    Typewriter["A language for everything.", {8.95, 10}, Position -> {170, 660}, Alignment -> Left, "TypingTime" -> 0.5, "Cursor" -> None,
        FontFamily -> "Source Sans 3", FontSize -> 60, FontWeight -> 300, FontColor -> ink]};
```

The name, one letter per eighth note, then everything collapses into the drop:

```wl
name = {Title["Mathematica", {10, 12}, "Enter" -> "Letters", "Cursor" -> True, Position -> {960, 580}, FontSize -> 170, FontColor -> ink,
        "Exit" -> "Collapse", "ExitTime" -> 0.4, "CollapsePoint" -> {960, 520}],
    Title["The name? Steve Jobs suggested it.", {10.9, 12}, "Enter" -> "Fade", Position -> {960, 690}, FontSize -> 48, FontWeight -> 400, FontSlant -> Italic,
        FontColor -> RGBColor["#55524C"], "Exit" -> "Collapse", "ExitTime" -> 0.4, "CollapsePoint" -> {960, 520}]};
Timeline[{paper, y1986, name, prints}, "Duration" -> 12]["Graphics", 11.3, ImageSize -> 480]
```

## Bars 12 to 16: Mathematica 1.0

Its first vocabulary, as Names listed it in 1988:

```wl
v1Names = "{" <> StringRiffle[Take[SortBy[releases[[1, "Words"]][[All, "Name"]], StringDelete[#, "$"] &], 72], ", "] <> ", ...}";
StringTake[v1Names, 80]
```

A Macintosh in 1988, at half resolution and one bit, typing and evaluating on the clock; the integral and the surface are computed now:

```wl
session = NotebookSession[{{12, "In", "Names[\"*\"]"}, {12.5, "Out", v1Names},
    {13.3, "In", "Integrate[1/(x^3 - 1), x]"}, {13.6, "Out", ToString[Integrate[1/(x^3 - 1), x], OutputForm]},
    {14.05, "In", "Plot3D[Sin[x y], {x, 0, 3}, {y, 0, 3}]"}, {14.45, "Out", Plot3D[Sin[x y], {x, 0, 3}, {y, 0, 3}]}}, {12, 16}, "TypeTime" -> 0.2, "Pulse" -> kick];
session["Graphics", 14.9, ImageSize -> 480]
```

Behind the window, the whole vocabulary as a dictionary page; each release's words fly out of the latest output to their places:

```wl
arrivals = Association[Flatten[releases[[All, "Arrivals"]]]];
wall = WordWall[{#["Name"], #["Frequency"], Lookup[arrivals, #["Name"], Infinity]} & /@ lexicon, {12, 84}, "From" -> {583, 488}, "FlightCount" -> 80];
```

The story on the right: captions, and dictionary entries looked up live:

```wl
narrator = {Caption["Its first vocabulary: " <> ToString[Length[releases[[1, "Words"]]]] <> " words.", {12.25, 13.85}, "Highlight" -> ToString[Length[releases[[1, "Words"]]]], FontColor -> ink],
    Caption["Words for pictures, too.", {14.1, 15.85}, FontColor -> ink],
    DictionaryCard["Names", {12.3, 13.25}], DictionaryCard["Integrate", {13.3, 13.95}]};
```

The instruments: the era, the count of words, the years, all beating with the kick:

```wl
hud = {Title["JUNE 23, 1988 \[CenterDot] MACINTOSH", {12, 16}, Position -> {96, 76}, Alignment -> Left, FontSize -> 18, FontWeight -> 600, FontColor -> red, "Tracking" -> 3, "Enter" -> "Fade", "Exit" -> "Cut"],
    Title["Mathematica 1.0", {12, 16}, Position -> {96, 124}, Alignment -> Left, FontSize -> 46, FontColor -> ink, "Enter" -> "Fade", "Exit" -> "Cut"],
    Counter[wordCount, {12, 84}, "Label" -> "Words in the language"],
    YearRuler[{{4, 1979.85}, {8, 1981.45}, {8.5, 1986.8}, {12, 1988.47}}, {4, 84}, "Marks" -> {{1988.47, "1.0"}}, "Pulse" -> kick]};
```

Spikey, in its first form and first display, dancing to the kick; beside it the melody's automaton runs into a read head, and the note under the head is asked of the melody Track itself:

```wl
characters = {Spikey[{12, 69}, "Form" -> "Stellated", "Style" -> "1Bit", "Pulse" -> kick], AutomatonTape[30, melody, {12, 16}, "Exit" -> "Cut"]};
Timeline[{Backdrop[RGBColor["#F4F1EA"]], characters}, "Duration" -> 16]["Graphics", 13.3, ImageSize -> 480]
```

## The Film

The edit: the segments stacked in time, a soft backdrop keeping the narration legible over the wall, the score underneath:

```wl
column = {12, 69} -> Function[t, {CanvasGradient[{1190, 0, 100, 1080}, "Horizontal", RGBColor["#F4F1EA"], {{0, 0}, {1, 0.88}}],
    CanvasRectangle[{1290, 0, 630, 1080}, RGBColor["#F4F1EA"], Opacity -> 0.88], CanvasGradient[{0, 0, 1920, 170}, "Vertical", RGBColor["#F4F1EA"], {{0, 0.9}, {1, 0}}]}];
film = Timeline[{coldOpen, smp, paper, y1986, name, wall, column, session, prints, characters, narrator, hud}, "Duration" -> 16, "SecondsPerUnit" -> 2, "Soundtrack" -> score]
```

Six moments of it:

```wl
GraphicsGrid[Partition[film["Graphics", #, ImageSize -> 400] & /@ {3.2, 7.6, 9.3, 11.3, 13.3, 15.2}, 2], ImageSize -> 820]
```

Watch it, with the audio as the clock; click to play, drag to scrub:

```wl
#| eval: false
film["Dynamic"]
```

Render it, frames in parallel, as a Video:

```wl
#| eval: false
film["Video"]
```

## What Comes Next

These sixteen bars use every mechanism the rest needs: segments as tools, era screens at their own resolution and depth, a vocabulary computed from the language itself, and a score whose Tracks also move the picture. The remaining bars are more eras of the same notebook: NeXT's four greys, Windows and the Mac OS through dark mode, the chat notebooks, and a finale where the whole vocabulary fills the frame. Each needs a new entry in `$NotebookEras` rather than new machinery. The soundtrack is synthesized from oscillators and WAnim's kit; richer instruments are a matter of more voices.

## References

[1] WAnim: https://github.com/sw1sh/WolfAnim

[2] The Wolfram Language's vocabulary: `WolframLanguageData`, https://reference.wolfram.com/language/ref/WolframLanguageData.html

[3] Summary of New Features in 15.0: https://reference.wolfram.com/language/guide/SummaryOfNewFeaturesIn150.html

[4] Stephen Wolfram's scrapbook: https://www.stephenwolfram.com/scrapbook/

[5] S. Wolfram, "What Is a Computational Essay?" (2017): https://writings.stephenwolfram.com/2017/11/what-is-a-computational-essay/
