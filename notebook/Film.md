---
Template: ComputationalEssay
Name: "In[1]:= The Life of a Language"
Author: Nikolay Murzin
Date: 2026
Description: "A film about the Wolfram Language told as a natural language gaining words, computed and composed entirely in this notebook with WAnim"
Abstract: "A language is its words. This notebook makes a film about the Wolfram Language told that way: its vocabulary growing from a few hundred words in 1988 to thousands today, watched through the notebooks it was typed into, each of its era. Everything is computed here. The vocabulary comes from WolframLanguageData, the notebook outputs are evaluated, the melody is the centre column of Rule 30, and the picture reads the same Tracks that sound. Each segment of the film is one WAnim creation tool, so the whole edit is a list a person could type live. These are its first forty bars: from 1979 to the day the language got its name."
Keywords: [WAnim, Timeline, Track, Rule 30, WolframLanguageData, film, music, notebook history]
Sources: ["[WAnim](https://github.com/sw1sh/WAnim)", "[Summary of New Features in 15.0](https://reference.wolfram.com/language/guide/SummaryOfNewFeaturesIn150.html)", "[Stephen Wolfram's scrapbook](https://www.stephenwolfram.com/scrapbook/)", "[The Story of Spikey](https://writings.stephenwolfram.com/2018/12/the-story-of-spikey/)"]
Links: ["[What Is a Computational Essay?](https://writings.stephenwolfram.com/2017/11/what-is-a-computational-essay/)"]
---

## A Film Is a List

A film here is a Timeline: a list of layers, each drawing its part of the picture at every moment it covers. WAnim's creation tools make those layers. A typed line, a terminal of 1979, a notebook of 1988 that types and evaluates on the clock, a card for a symbol, a dancing Spikey: each segment of the film is one call, placed in time. The soundtrack is a Track, a pattern that answers what plays when, and the picture can ask it the same question.

The creation tools, the canvas they draw on, and the pattern language:

```wl
Needs["WolframInstitute`WAnim`"]
```

The film counts in bars of 120 BPM: one bar is one cycle of the score's Tracks, and every time below is a bar. The timeline at the end says how long a bar lasts.

## The Vocabulary

Every documented symbol, with the version that introduced it and how often it is used across code, documentation and notebooks:

```wl
lexicon = Cases[WolframLanguageData[All, {"Name", "VersionIntroduced", "Frequencies"}],
    {n_String, v_, f_} :> <|"Name" -> n, "Version" -> ToExpression[ToString[v]], "Frequency" -> Replace[f, {{"All" -> w_ ? NumericQ, ___} :> w, _ -> 10.^-9}]|>];
Dataset[lexicon]
```

The most used words of all:

```wl
Dataset[TakeLargestBy[lexicon, #Frequency &, 12]]
```

The newest words are too new for that data. The guide to what 15.0 added links to them:

```wl
new15 = Intersection[Flatten @ StringCases[Import["https://reference.wolfram.com/language/guide/SummaryOfNewFeaturesIn150.html", "Hyperlinks"],
    "/language/ref/" ~~ n : (WordCharacter | "$") .. ~~ ".html" :> n], Complement[Names["System`*"], lexicon[[All, "Name"]]]]
```

They join the vocabulary as version 15:

```wl
lexicon = Join[lexicon, <|"Name" -> #, "Version" -> 15., "Frequency" -> 10.^-9|> & /@ new15];
Counts[Floor[lexicon[[All, "Version"]]]]
```

The film is cut into sections, in bars; music and picture both read from this map:

```wl
sections = <|"cold" -> {0, 4}, "smp" -> {4, 8}, "y1986" -> {8, 10}, "name" -> {10, 12}, "v1" -> {12, 16}, "next" -> {16, 18}, "grammar" -> {18, 20},
    "v2" -> {20, 22}, "v3" -> {22, 24}, "v4" -> {24, 26}, "v5" -> {26, 28}, "v6" -> {28, 32}, "families" -> {32, 34}, "v7" -> {34, 35}, "v8" -> {35, 37},
    "v9" -> {37, 38}, "breakdown" -> {38, 40}, "v10" -> {40, 46}, "v11" -> {46, 47}, "repos" -> {47, 49}, "v12" -> {49, 51}, "v123" -> {51, 53},
    "v132" -> {53, 55}, "llm" -> {55, 59}, "v14" -> {59, 61}, "v15" -> {61, 67}, "agents" -> {67, 69}, "climax" -> {69, 77}, "outro" -> {77, 84}|>;
at[k_, o_ : 0] := sections[k][[1]] + o;
in[b_, {a_, z_}] := a <= b < z;
in[b_, k_String] := in[b, sections[k]];
inAny[b_, spans_List] := AnyTrue[spans, in[b, #] &];
```

Each release's words arrive on its bar, the most used first, spread over a bar and a half on sixteenths:

```wl
releases = Table[With[{ws = SortBy[Select[lexicon, r[[2]] <= #["Version"] < r[[3]] &], -#["Frequency"] &]},
    <|"Label" -> r[[1]], "Bar" -> r[[4]], "Words" -> ws, "Arrivals" -> MapIndexed[#1["Name"] -> r[[4]] + Round[24 ((#2[[1]] - 1) / Max[1, Length[ws] - 1])^0.6] / 16. &, ws]|>],
    {r, {{"1.0", 1, 2, 12}, {"2.0", 2, 3, 20}, {"3.0", 3, 4, 22}, {"4", 4, 5, 24}, {"5", 5, 6, 26}, {"6.0", 6, 7, 28}, {"7", 7, 8, 34}, {"8", 8, 9, 35}, {"9", 9, 10, 37},
        {"10", 10, 11, 40.5}, {"11", 11, 12, 46}, {"12", 12, 13, 49}, {"13", 13, 13.3, 53}, {"13.3", 13.3, 14, 55}, {"14", 14, 15, 59}, {"15", 15, 16, 61}}}];
Dataset[releases][All, {"Label", "Bar", "Words" -> (Take[#[[All, "Name"]], UpTo[8]] &)}]
```

The number of words in the language at any moment, each release counting up over a bar:

```wl
wordCount[bar_] := Total[If[bar < #["Bar"], 0, Round[Length[#["Words"]] (1 - (1 - Min[1, (bar - #["Bar"]) / 0.9])^3)]] & /@ releases];
Plot[wordCount[b], {b, 0, 84}, PlotRange -> All, AxesLabel -> {"bar", "words"}, Exclusions -> None]
```

## Paper and Ink

The film is ink on paper until the language gets its name, when it turns to light on dark, and back for the end:

```wl
dark[t_] := Which[t < 38, 0, t < 40, 0.85 Easing["Smooth"][(t - 38.5) / 1.5] + If[t >= 39.95, 0.15, 0], t < 77, 1, True, 1 - Easing["Smooth"][(t - 77.5) / 1.5]];
{paperC, inkC, boneC, red} = RGBColor /@ {"#F4F1EA", "#0E0F11", "#EDE9E0", "#DD1100"};
ground = Blend[{paperC, inkC}, dark[#]] &; fg = Blend[{inkC, boneC}, dark[#]] &; soft = Blend[{RGBColor["#6E6A62"], RGBColor["#8E8B84"]}, dark[#]] &;
Plot[dark[t], {t, 30, 84}, PlotRange -> {0, 1}, AxesLabel -> {"bar", "dark"}]
```

## The Score

The harmony walks i, VI, III, VII in A minor, one chord a bar, and lifts a whole tone for the climax:

```wl
lift[b_] := If[b >= at["climax"], 2, 0];
chordAt[b_] := {{57, 60, 64}, {57, 60, 65}, {55, 60, 64}, {55, 59, 62}}[[Mod[Floor[b], 4] + 1]] + lift[b];
rootAt[b_] := {45, 41, 48, 43}[[Mod[Floor[b], 4] + 1]] + lift[b];
chordAt /@ Range[0, 3]
```

The melody is written by Rule 30. The centre column of the automaton grown from one cell gives four bits per eighth note: three pick a degree of A minor pentatonic, the fourth decides whether it sounds; downbeats always sound, on the chord root. It plays until the breakdown, from 11 to the chat notebooks, and in the outro, and it rests while the slider of 6.0 moves:

```wl
rule30 = CellularAutomaton[30, {{1}, 0}, {{0, 4000}, {0, 0}}][[All, 1]];
manip = at["v6", 2];
pluckOn[b_] := (b < at["breakdown"] || in[b, {at["v11"], at["llm"]}] || b >= at["outro"]) && ! in[b, {manip, manip + 2}];
pluckNote[s_] := Which[! pluckOn[s / 8], Missing[], Mod[s, 8] == 0, chordAt[s / 8][[1]] + 12, rule30[[4 s + 4]] == 0, Missing[],
    True, {69, 72, 74, 76, 79, 81, 84, 86}[[4 rule30[[4 s + 1]] + 2 rule30[[4 s + 2]] + rule30[[4 s + 3]] + 1]] + lift[s / 8]];
Take[rule30, 32]
```

The melody as a Track that computes itself: asked about any stretch of time, it reads the automaton:

```wl
melody = Track[Function[span, Table[With[{n = pluckNote[s]}, If[MissingQ[n], Nothing,
    <|"Value" -> n, "Whole" -> {s / 8, (s + 1) / 8}, "Part" -> {Max[span[[1]], s / 8], Min[span[[2]], (s + 1) / 8]}|>]], {s, Max[0, Floor[8 span[[1]]]], Ceiling[8 span[[2]]] - 1}]]];
melody["Query", 12, 13]
```

A score is easiest to read as a roll: each note a bar from its onset to its end, at its pitch, or on its drum's row; several tracks share one roll:

```wl
noteRoll[tracks_, {a_, b_}] := With[{ev = Join @@ (#["Query", a, b] & /@ Flatten[{tracks}])}, With[{rows = Union[Select[ev[[All, "Value"]], StringQ]]},
    Graphics[{RGBColor["#DD1100"], With[{y = Replace[#Value, s_String :> First[FirstPosition[rows, s]]]}, Rectangle[{#Whole[[1]], y - 0.4}, {#Whole[[2]] - 0.01, y + 0.4}]] & /@ ev},
        AspectRatio -> 1/4, ImageSize -> 600, Frame -> True, FrameTicks -> {Automatic, If[rows === {}, Automatic, Transpose[{Range[Length[rows]], rows}]]}]]];
noteRoll[melody, {12, 14}]
```

The drums. Soft kicks under 1986, four on the floor from 1.0 to the outro, dropping out for the breakdown, a beat's silence before each drop, and half time into 15.0:

```wl
end = at["outro"]; gaps = {{at["breakdown"] - 1/4, at["breakdown", 2]}, {at["agents", 2] - 1/4, at["agents", 2]}}; half = {at["v15"], at["v15", 2]};
drums[b_] := 12 <= b < end && ! in[b, "breakdown"];
gap[x_] := AnyTrue[gaps, in[x, #] &];
kick = EventTrack[Join[{#, 1/4, "bd"} & /@ Join[Range[8, 10.5, 1/2], {11, 11.5}],
    {#, 1/4, "bd"} & /@ Select[Range[12, end - 1/4, 1/4], drums[Floor[#]] && ! gap[#] && ! (in[#, half] && OddQ[4 #]) &], {{end, 1/4, "bd"}}]];
claps = EventTrack[{#, 1/4, "cp"} & /@ Select[Flatten[Table[b + {1/4, 3/4}, {b, 12, end - 1}]], drums[Floor[#]] && ! in[#, "v14"] && ! in[#, half] && ! gap[#] &]];
sixteenths[b_] := inAny[b, {{at["v4"], at["breakdown"]}, {at["v10"], at["llm"]}, "agents", "climax"}];
hats = EventTrack[{#, 1/16, "hh"} & /@ Select[Range[12, end - 1/16, 1/16], drums[Floor[#]] && ! in[#, "v14"] && ! gap[#] && Mod[16 #, 4] == 2 &]];
ghostHats = EventTrack[{#, 1/16, "hh"} & /@ Select[Range[12, end - 1/16, 1/16], drums[Floor[#]] && ! in[#, "v14"] && ! gap[#] && Mod[16 #, 4] != 2 && sixteenths[#] &]];
openHats = EventTrack[{#, 1/8, "oh"} & /@ Select[Range[12, end - 1/16, 1/16], Mod[16 #, 4] == 2 && ! gap[#] && inAny[#, {{at["v10"], at["v10", 6]}, "climax", "families"}] &]];
noteRoll[{kick, claps, hats, ghostHats, openHats}, {40, 41}]
```

The band. A pad holds each chord; the bass pumps octaves on the offbeats in the drops and walks quarter roots elsewhere; stabs punch the drops and every beat of the plot montage:

```wl
drops = {{12, 18}, {at["v10"], at["v10", 6]}, "climax", "families"};
pad = EventTrack[Join[Flatten[Table[{b, 1, #} & /@ chordAt[b], {b, 4, end - 1}], 1], {end, 5, #} & /@ Append[chordAt[end], chordAt[end][[1]] + 12]]];
bass = EventTrack[Append[Table[With[{b = s / 8}, Which[! drums[Floor[b]] || gap[b], Nothing,
    inAny[b, drops], If[OddQ[s], {b, 1/8, rootAt[b] + If[Mod[s, 4] == 3, 12, 0]}, Nothing],
    EvenQ[s], {b, 1/8, rootAt[b]}, True, Nothing]], {s, 96, 8 end - 1}], {end, 5, rootAt[end]}]];
stabs = EventTrack[Flatten[Table[Which[
    inAny[b, {{12, 18}, {at["v10"], at["v10", 6]}, "climax"}], Table[{b + p / 16, 1/16, n + 12}, {p, {0, 3, 6, 10, 12}}, {n, chordAt[b]}],
    in[b, "families"], Table[{b + q / 4, 1/8, n + 12}, {q, 0, 3}, {n, chordAt[b]}], True, {}], {b, 12, end - 1}], 2]];
noteRoll[{pad, bass, stabs}, {40, 42}]
```

The tunes. A four-bar hook and its answer, first played by the lead when the language gets its name, then by a bell for 15.0, then by both, a whole tone up, for the climax; a voice sings over the chat notebooks:

```wl
hook = {{0, 1.5, 69}, {1.5, 0.5, 72}, {2, 1, 76}, {3, 1, 74}, {4, 1.5, 72}, {5.5, 0.5, 69}, {6, 1, 72}, {7, 1, 77},
    {8, 1.5, 76}, {9.5, 0.5, 74}, {10, 1, 72}, {11, 1, 67}, {12, 1, 71}, {13, 1, 74}, {14, 1.5, 79}, {15.5, 0.5, 76}};
answer = {{0, 1.5, 76}, {1.5, 0.5, 74}, {2, 1, 76}, {3, 1, 81}, {4, 1.5, 77}, {5.5, 0.5, 76}, {6, 1, 72}, {7, 1, 69},
    {8, 1, 67}, {9, 1, 72}, {10, 1, 76}, {11, 1, 79}, {12, 2, 79}, {14, 1, 74}, {15, 1, 71}};
voiceLine = {{0, 2, 76}, {2, 1, 72}, {3, 1, 74}, {4, 3, 72}, {7, 1, 69}, {8, 2, 67}, {10, 1, 72}, {11, 1, 76}, {12, 4, 74}};
phrase[start_, notes_, k_ : 0] := {start + #1 / 4, #2 / 4, #3 + k} & @@@ notes;
lead = EventTrack[Join[phrase[at["v10"], hook], phrase[at["v10", 4], Take[answer, 8]], phrase[at["climax"], hook, 2], phrase[at["climax", 4], answer, 2]]];
bell = EventTrack[Join[phrase[at["v15"], hook], phrase[at["v15", 4], Take[answer, 8]], phrase[at["climax"], hook, 14], phrase[at["climax", 4], answer, 14]]];
voice = EventTrack[phrase[at["llm"], voiceLine]];
arps = EventTrack[Flatten[Table[With[{c = chordAt[s / 16]}, {s / 16, 1/16, {c[[1]], c[[2]], c[[3]], c[[1]] + 12, c[[3]], c[[2]]}[[Mod[s, 6] + 1]] + 12}],
    {r, {{at["breakdown"], at["breakdown", 1.75]}, {at["agents"], at["agents", 1.75]}}}, {s, 16 r[[1]], 16 r[[2]] - 1}], 1]];
noteRoll[lead, {40, 48}]
```

The seams between sections: crashes on every new era, risers and a snare roll into each drop, impacts on the drops:

```wl
crashes = EventTrack[{#, 2, "cr"} & /@ Join[{12}, at /@ {"next", "grammar", "v2", "v3", "v4", "v5", "v6", "families", "v7", "v8", "v9", "v10", "v11", "repos", "v12", "v123", "v132", "llm", "v14", "v15", "climax", "outro"},
    {manip, at["v10", 4], at["v15", 4]}, at["climax"] + {2, 4, 6}]];
risers = EventTrack[{{10, 2, 60}, {at["breakdown"], 1.9, 60}, {at["agents"], 1.8, 60}}];
impacts = EventTrack[{#, 2, 60} & /@ {12, at["families"], at["v10"], at["climax"], end}];
roll = EventTrack[Flatten[Table[{s / 16, 1/16, "sd"}, {r, {{11, 12}, {at["breakdown", 1], at["breakdown", 1.875]}, {at["agents", 1], at["agents", 1.75]}}}, {s, 16 r[[1]], 16 r[[2]] - 1}], 1]];
```

The mix, drums from WAnim's own kit:

```wl
score = Track[{Gain[0.3][Synth["Pluck"][melody]], Gain[0.16][Synth["Supersaw"][pad]], Gain[0.3][Synth["Sawtooth"][bass]], Gain[0.12][Synth["Supersaw"][stabs]],
    Gain[0.22][Synth["Sawtooth"][lead]], Gain[0.3][Synth["Bell"][bell]], Gain[0.2][Synth["Triangle"][voice]], Gain[0.16][Synth["Pluck"][arps]],
    Gain[0.5][kick], Gain[0.28][claps], Gain[0.17][hats], Gain[0.08][ghostHats], Gain[0.1][openHats],
    Gain[0.2][crashes], Gain[0.2][Synth["Riser"][risers]], Gain[0.35][Synth["Impact"][impacts]], Gain[0.2][roll]}];
```

The whole soundtrack, a bar every two seconds:

```wl
Audio[score, 84, "CyclesPerSecond" -> 1/2]
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
paper = Backdrop[If[# < 8.4, Blend[{RGBColor["#050506"], paperC}, Easing["OutCubic"][(# - 8) / 0.4]], ground[#]] &, {8, 84}];
y1986 = {Title["1986", {8.05, 10}, Position -> {160, 470}, Alignment -> Left, FontSize -> 220, FontColor -> red, "EnterTime" -> 0.35],
    Typewriter["He starts again, from nothing.", {8.35, 10}, Position -> {170, 580}, Alignment -> Left, "TypingTime" -> 0.55, "Cursor" -> None,
        FontFamily -> "Source Sans 3", FontSize -> 60, FontWeight -> 600, FontColor -> inkC],
    Typewriter["A language for everything.", {8.95, 10}, Position -> {170, 660}, Alignment -> Left, "TypingTime" -> 0.5, "Cursor" -> None,
        FontFamily -> "Source Sans 3", FontSize -> 60, FontWeight -> 300, FontColor -> inkC]};
```

The name, one letter per eighth note, then everything collapses into the drop:

```wl
name = {Title["Mathematica", {10, 12}, "Enter" -> "Letters", "Cursor" -> True, Position -> {960, 580}, FontSize -> 170, FontColor -> inkC,
        "Exit" -> "Collapse", "ExitTime" -> 0.4, "CollapsePoint" -> {960, 520}],
    Title["The name? Steve Jobs suggested it.", {10.9, 12}, "Enter" -> "Fade", Position -> {960, 690}, FontSize -> 48, FontWeight -> 400, FontSlant -> Italic,
        FontColor -> RGBColor["#55524C"], "Exit" -> "Collapse", "ExitTime" -> 0.4, "CollapsePoint" -> {960, 520}]};
Timeline[{paper, y1986, name, prints}, "Duration" -> 12]["Graphics", 11.3, ImageSize -> 480]
```

## Bars 12 to 16: Mathematica 1.0

Its first vocabulary, as Names listed it in 1988:

```wl
v1Names = "{" <> StringRiffle[Take[SortBy[releases[[1, "Words"]][[All, "Name"]], StringDelete[#, "$"] &], 72], ", "] <> ", ...}"
```

A Macintosh in 1988, at half resolution and one bit, typing and evaluating on the clock; the integral and the surface are computed now, and the surface comes with the line 1.0 printed under every picture:

```wl
v1 = NotebookSession[{{12, "In", "Names[\"*\"]"}, {12.5, "Out", v1Names},
    {13.3, "In", "Integrate[1/(x^3 - 1), x]"}, {13.6, "Out", ToString[Integrate[1/(x^3 - 1), x], OutputForm]},
    {14.05, "In", "Plot3D[Sin[x y], {x, 0, 3}, {y, 0, 3}]"}, {14.45, "Out", Plot3D[Sin[x y], {x, 0, 3}, {y, 0, 3}]}}, {12, 16},
    "TypeTime" -> 0.2, "GraphicsSize" -> 250, "Pulse" -> kick];
v1["Graphics", 14.9, ImageSize -> 480]
```

Behind the window, the whole vocabulary as a dictionary page; each release's words fly out of the latest output to their places, and the page darkens with the film. The wall is told the colour it sits on, so it can keep its settled words as one opaque picture:

```wl
arrivals = Association[Flatten[releases[[All, "Arrivals"]]]];
wall = WordWall[{#["Name"], #["Frequency"], Lookup[arrivals, #["Name"], Infinity]} & /@ lexicon, {12, 84}, "From" -> {583, 488}, "FlightCount" -> 80, Background -> ground,
    "Color" -> (Blend[{RGBColor["#B9B3A7"], RGBColor["#34363C"]}, dark[#]] &), "StrongColor" -> (Blend[{RGBColor["#2A2825"], boneC}, dark[#]] &)];
```

The story on the right, in the ink of the moment: captions, and dictionary entries looked up live:

```wl
story[s_, span_, hl_ : None] := Caption[s, span, "Highlight" -> hl, FontColor -> fg];
entry[name_, span_, opts___] := DictionaryCard[name, span, opts, FontColor -> fg, "NoteColor" -> soft];
v1Story = {story["Its first vocabulary: " <> ToString[Length[releases[[1, "Words"]]]] <> " words.", {12.25, 13.85}, ToString[Length[releases[[1, "Words"]]]]],
    story["Words for pictures, too.", {14.1, 15.85}], entry["Names", {12.3, 13.25}], entry["Integrate", {13.3, 13.95}]}
```

The era, in the corner, for as long as it lasts:

```wl
eraLabel[{t0_, t1_}, name_, sub_] := {Title[ToUpperCase[sub], {t0, t1}, Position -> {96, 76}, Alignment -> Left, FontSize -> 18, FontWeight -> 600, FontColor -> red, "Tracking" -> 3, "Enter" -> "Fade", "Exit" -> "Cut"],
    Title[name, {t0, t1}, Position -> {96, 124}, Alignment -> Left, FontSize -> 46, FontColor -> fg, "Enter" -> "Fade", "Exit" -> "Cut"]};
eraLabel[{12, 16}, "Mathematica 1.0", "June 23, 1988 \[CenterDot] Macintosh"]
```

Spikey, in its first form and first display, dancing to the kick; it takes each era's form and display as they come. Beside it, the melody's automaton runs into a read head, and the note under the head is asked of the melody Track itself:

```wl
spikeyForm = Which[# < at["v2"], "Stellated", # < at["v10"], "Spiked", True, "Hexecontahedron"] &;
spikeyStyle = Which[# < at["next"], "1Bit", # < at["v2"], "Gray", # < at["v6"], "Classic", True, "Red"] &;
characters = {Spikey[{12, 69}, "Form" -> spikeyForm, "Style" -> spikeyStyle, "Pulse" -> kick], AutomatonTape[30, melody, {12, 16}, "Exit" -> "Cut"]};
GraphicsRow[Timeline[{Backdrop[paperC], characters}, "Duration" -> 40]["Graphics", #, ImageSize -> 300] & /@ {13.3, 17, 29}]
```

## Bars 16 to 20: NeXT, and One Grammar

The same window, now on a NeXT: four greys, the Spikey of 1.0 computed as a polyhedron, then the grammar under every expression:

```wl
next = NotebookSession[{{16.25, "In", "PolyhedronData[\"GreatStellatedDodecahedron\"]", 0.25}, {16.6, "Out", PolyhedronData["GreatStellatedDodecahedron"]},
    {18, "In", "FullForm[{x -> 1, f[y]}]", 0.4}, {18.6, "Out", FullForm[{x -> 1, f[y]}]}}, {16, 20},
    "Era" -> "NeXT1988", "Title" -> "Untitled-1.ma", "Enter" -> "Wipe", "EnterTime" -> 0.1, "From" -> v1, "GraphicsSize" -> 190, "Pulse" -> kick];
next["Graphics", 18.9, ImageSize -> 480]
```

That grammar, drawn: every expression is a head applied to arguments, all the way down:

```wl
grammar = TreeDiagram[Hold[{x -> 1, f[y]}], {18.7, 20}, Position -> {1540, 250}, FontColor -> fg];
grammar["Graphics", 19.6, ImageSize -> 480]
```

Photographs of the machine it shipped on:

```wl
archive = Import /@ <|"next" -> "https://content.wolfram.com/sw-scrapbook/2019/08/1988_bundled-1.jpg",
    "cube" -> "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/NeXTcube_first_webserver.JPG/1280px-NeXTcube_first_webserver.JPG",
    "v2" -> "https://content.wolfram.com/sw-scrapbook/2019/08/1991_mathematica2-1.png", "v3" -> "https://content.wolfram.com/sw-scrapbook/2019/08/1996_mathematica3-1.jpg",
    "spikeys" -> "https://content.wolfram.com/sites/43/2018/12/mathematica-spikeys-by-version.png"|>;
nextStory = {story["Bundled with every NeXT computer. And Spikey is born.", {16.25, 17.8}, "Spikey"], story["One grammar for everything.", {18.2, 19.85}, "grammar"],
    PhotoPrint[archive["next"], "Mathematica on a NeXT computer", {16.1, 17.}, "Kicker" -> "From the archive \[CenterDot] 1988"],
    PhotoPrint[archive["cube"], "A NeXTcube at CERN \[CenterDot] photo: Geni, CC BY-SA 4.0", {17., 17.9}, "Tilt" -> 1.5, "Kicker" -> "From the archive \[CenterDot] 1990"]};
```

## Bars 20 to 28: Windows, and the Mac Again

Mathematica 2.0 on Windows 3.1 plays a sound, drawing its waveform as 2.0 did, and plots a surface in colour:

```wl
chirp = Rasterize[Plot[Sin[1000 t (1 + t)] Sin[2 Pi t], {t, 0, 1.5}, PlotPoints -> 600, Axes -> False, AspectRatio -> 1/5, ImageSize -> 300, PlotStyle -> Black], ImageResolution -> 144];
v2 = NotebookSession[{{20, "In", "Play[Sin[1000 t (1 + t)] Sin[2 Pi t], {t, 0, 1.5}]", 0.3}, {20.4, "Out", chirp}, {20.45, "Out", "-Sound-"},
    {21.0, "In", "ParametricPlot3D[{u Cos[u] (4 + Cos[v + u]), u Sin[u] (4 + Cos[v + u]), u Sin[v + u]}, {u, 0, 4 Pi}, {v, 0, 2 Pi}]", 0.2},
    {21.3, "Out", ParametricPlot3D[{u Cos[u] (4 + Cos[v + u]), u Sin[u] (4 + Cos[v + u]), u Sin[v + u]}, {u, 0, 4 Pi}, {v, 0, 2 Pi}]}}, {20, 22},
    "Era" -> "Win1991", "Title" -> "Mathematica for Windows - [Untitled-1]", "Enter" -> "Wipe", "EnterTime" -> 0.1, "From" -> next, "GraphicsSize" -> 250, "Pulse" -> kick];
v2["Graphics", 21.8, ImageSize -> 480]
```

3.0 on Windows 95: the notebook is itself an expression, and mathematics is typed as it is written:

```wl
v3 = NotebookSession[{{22, "Title", "Notes on Language"}, {22.1, "Text", "Every language starts with a few words."},
    {22.5, "In", "NotebookRead[PreviousCell[]]", 0.2}, {22.8, "Out", ToString[Cell["Every language starts with a few words.", "Text"], InputForm]},
    {23.1, "In", HoldForm[Integrate[1/(x^3 - 1), x]]}, {23.45, "Out", Integrate[1/(x^3 - 1), x]}}, {22, 24},
    "Era" -> "Win1996", "Title" -> "Mathematica - [Untitled-1]", "Enter" -> "Wipe", "EnterTime" -> 0.1, "From" -> v2, "Pulse" -> kick];
v3["Graphics", 23.8, ImageSize -> 480]
```

4 on Mac OS 9 reads pictures and grows Rule 30, a row at a time:

```wl
ca = CellularAutomaton[30, {{1}, 0}, 80];
v4 = NotebookSession[{{24, "In", "ExampleData[{\"TestImage\", \"Mandrill\"}]", 0.15}, {24.25, "Out", ImageResize[ExampleData[{"TestImage", "Mandrill"}], 150]},
    {24.6, "In", "ArrayPlot[CellularAutomaton[30, {{1}, 0}, 80]]", 0.25},
    {24.9, "Out", u |-> ArrayPlot[Join[Take[ca, Max[1, Round[81 u]]], ConstantArray[0, {81 - Max[1, Round[81 u]], 161}]], ImageSize -> 420], 1}}, {24, 26},
    "Era" -> "Mac1999", "Enter" -> "Wipe", "EnterTime" -> 0.1, "From" -> v3, "Pulse" -> kick];
v4["Graphics", 25.5, ImageSize -> 480]
```

5.1 on Windows XP: string patterns, and the names of colours:

```wl
v5 = NotebookSession[{{26, "In", "StringCases[\"Every language starts with a few words.\", WordCharacter ..]", 0.25},
    {26.35, "Out", StringCases["Every language starts with a few words.", WordCharacter ..]},
    {26.75, "In", "Graphics[Table[{{Red, Orange, Yellow, Green, Cyan, Blue, Purple, Magenta, Pink, Brown}[[Mod[k, 10] + 1]], EdgeForm[White], Disk[(1 + k/24) {Cos[k Pi/5.2], Sin[k Pi/5.2]}, 0.25 + k/60]}, {k, 60, 0, -1}]]", 0.3},
    {27.1, "Out", Graphics[Table[{{Red, Orange, Yellow, Green, Cyan, Blue, Purple, Magenta, Pink, Brown}[[Mod[k, 10] + 1]], EdgeForm[White], Disk[(1 + k/24) {Cos[k Pi/5.2], Sin[k Pi/5.2]}, 0.25 + k/60]}, {k, 60, 0, -1}], ImageSize -> 250]}}, {26, 28},
    "Era" -> "WinXP2004", "Title" -> "Mathematica 5.1 - [Untitled-1]", "Enter" -> "Wipe", "EnterTime" -> 0.1, "From" -> v4, "Pulse" -> kick];
v5["Graphics", 27.6, ImageSize -> 480]
```

The story of these eras:

```wl
midStory = {story["It learns to make sound, and to draw in colour.", {20.2, 21.85}, "sound"], story["The notebook itself is written in the language.", {22.3, 23.}],
    story["And math is typed the way it is written.", {23.1, 23.85}], story["It learns to read other formats, and to grow patterns.", {24.15, 25.85}],
    story["It learns string patterns, and the names of colours.", {26.2, 27.85}, "patterns,"],
    entry["Play", {20.2, 20.95}], entry["Cell", {22.2, 22.95}], entry["CellularAutomaton", {24.1, 25.85}], entry["StringCases", {26.2, 26.95}],
    PhotoPrint[archive["v2"], "Mathematica 2.0 and The Mathematica Book", {21., 21.85}, "Kicker" -> "From the archive \[CenterDot] 1991"],
    PhotoPrint[archive["v3"], "The Mathematica Book, third edition", {23., 23.85}, "Tilt" -> 1.5, "Kicker" -> "From the archive \[CenterDot] 1996"],
    PhotoPrint[archive["spikeys"], "Spikey, version by version", {27., 27.85}, "Kicker" -> "From the archive \[CenterDot] 1988 \[Dash] 2019"]};
```

## Bars 28 to 40: 6.0 to 9

6.0 on Mac OS X colours its syntax and learns about the world: words, countries, and computation itself. A Turing machine runs, a row per step:

```wl
tm = Transpose[TuringMachine[{596440, 2, 3}, {1, {{}, 0}}, 240][[All, 2]]];
europeMap = GeoRegionValuePlot[CountryData["Europe"] -> "Population", ColorFunction -> "SunsetColors", ImageSize -> 330]
```

The slider of Manipulate, held and snapped on the beat, then the surface turned by hand:

```wl
sliderAt[u_] := Module[{keys = {{0, 0.1}, {0.25, 0.1}, {0.5, 0.85}, {0.7, 0.85}, {0.9, 0.3}, {1.05, 0.3}, {1.25, 0.52}, {2, 0.52}}, i},
    i = LengthWhile[keys, #[[1]] <= 2 u &]; If[i >= Length[keys], keys[[-1, 2]],
    keys[[i, 2]] + (keys[[i + 1, 2]] - keys[[i, 2]]) Easing["InOutCubic"][(2 u - keys[[i, 1]]) / (keys[[i + 1, 1]] - keys[[i, 1]])]]];
manipulate[u_] := With[{a0 = 0.5 + 2.5 sliderAt[u], turn = Max[0, 2 u - 1.3] 1.4},
    Manipulate[Plot3D[Sin[a x] Cos[y], {x, -3, 3}, {y, -3, 3}, ImageSize -> 260, ViewPoint -> {3.2 Cos[turn - 0.9], 3.2 Sin[turn - 0.9], 2}], {{a, a0}, 0.5, 3}]];
manipulate[0.3]
```

7 computes in parallel: four kernels share a Julia set, each filling its quarter:

```wl
julia = Compile[{{z, _Complex}}, Module[{w = z, k = 0}, While[Abs[w] < 2 && k < 60, w = w^2 + (-0.8 + 0.156 I); k++]; k]];
juliaSet = ParallelTable[julia[x + I y], {y, 0.95, -0.95, -0.02}, {x, -1.6, 1.6, 0.02}];
juliaColors = Map[List @@ ColorData["SunsetColors"][#/60] &, juliaSet, {2}];
parallelFrame[u_] := With[{band = Ceiling[Length[juliaSet] / 4]}, Image[MapIndexed[If[Mod[#2[[1]] - 1, band] < u band, #1, ConstantArray[{0.93, 0.93, 0.93}, Length[#1]]] &, juliaColors], ImageSize -> 460]];
parallelFrame[0.6]
```

8 reads English and draws the graph of Europe's borders, an edge at a time:

```wl
europe = CountryData["Europe"]; names = AssociationThread[europe, CommonName[europe]];
borders = DeleteDuplicatesBy[Flatten[MapThread[Thread[UndirectedEdge[names[#1], Lookup[names, Intersection[Replace[#2, _Missing -> {}], europe]]]] &,
    {europe, EntityValue[europe, "BorderingCountries"]}]], Sort];
coords = AssociationThread[VertexList[Graph[borders]], GraphEmbedding[Graph[borders]]];
bordersGrowing[u_] := Graph[Keys[coords], Take[borders, Max[1, Round[u Length[borders]]]], VertexCoordinates -> Normal[coords], VertexLabels -> "Name",
    VertexLabelStyle -> Directive[7, GrayLevel[0.2]], VertexStyle -> red, EdgeStyle -> RGBColor["#6D82C7"], ImageSize -> {520, 330}];
bordersGrowing[1]
```

One window from 6.0 to 9, gone for the montage of plots and dimmed in the breakdown:

```wl
v6 = NotebookSession[{{28, "In", "WordData[\"language\", \"Definitions\"]", 0.2}, {28.3, "Out", Short[WordData["language", "Definitions"], 1]},
    {28.5, "In", "GeoRegionValuePlot[CountryData[\"Europe\"] -> \"Population\", ColorFunction -> \"SunsetColors\"]", 0.2}, {28.75, "Out", europeMap},
    {29.3, "In", "ArrayPlot[Transpose[TuringMachine[{596440, 2, 3}, {1, {{}, 0}}, 240][[All, 2]]]]", 0.2},
    {29.5, "Out", u |-> ArrayPlot[PadRight[tm[[All, ;; Max[1, Round[241 u]]]], Dimensions[tm]], ImageSize -> 520, ColorRules -> {0 -> White, 1 -> RGBColor["#E0701A"], 2 -> RGBColor["#2D4A8A"]}], 0.45},
    {manip - 0.15, "In", "Manipulate[Plot3D[Sin[a x] Cos[y], {x, -3, 3}, {y, -3, 3}], {a, 0.5, 3}]", 0.15}, {manip, "Out", manipulate, 2, 48},
    {34, "In", "ParallelTable[julia[x + I y], {y, 0.95, -0.95, -0.02}, {x, -1.6, 1.6, 0.02}]", 0.2}, {34.25, "Out", parallelFrame, 0.6},
    {35, "In", "= countries in europe", 0.3}, {35.5, "Out", Short[CommonName[europe], 1]},
    {36, "In", "Graph[UndirectedEdge @@@ borders, VertexLabels -> Automatic]", 0.2}, {36.25, "Out", bordersGrowing, 0.6},
    {37, "In", "UnitConvert[Quantity[5., \"Kilometers\"], \"Miles\"]", 0.25}, {37.35, "Out", UnitConvert[Quantity[5., "Kilometers"], "Miles"]}}, {28, 40},
    "Era" -> "MacOSX2007", "Enter" -> "Wipe", "EnterTime" -> 0.1, "From" -> v5, "Hide" -> {sections["families"]}, "Dim" -> {38, 39.8}, "PushIn" -> 0.05, "Pulse" -> kick];
GraphicsRow[v6["Graphics", #, ImageSize -> 400] & /@ {31, 36.9}]
```

What the narrator says over them, and the entries it looks up:

```wl
lateStory = {story["It learns about the world.", {28.2, 29.25}], story["And about computation itself.", {29.3, 29.9}], story["And it starts to answer back.", {30.05, 31.85}],
    story["It learns to work in parallel.", {34.05, 34.9}, "parallel"], story["It learns to understand English.", {35.05, 35.95}],
    story["It learns graphs: countries, linked by their borders.", {36.05, 36.9}], story["It learns units.", {37.05, 37.9}],
    entry["CountryData", {28.2, 29.25}], entry["TuringMachine", {29.3, 29.9}], entry["Manipulate", {30., 31.85}], entry["ParallelTable", {34.05, 34.9}], entry["Graph", {35.05, 35.9}]};
```

## Bars 32 to 34: Words Come in Families

A family of words, rolling past; eight of them dealt out on the beat, the three-dimensional ones turning:

```wl
family = SortBy[Select[lexicon, StringMatchQ[#Name, __ ~~ ("Plot" | "Plot3D" | "Chart" | "Chart3D")] &], {#Version &, #Name &}][[All, "Name"]];
turning[g_] := u |-> Show[g, ViewPoint -> {3 Cos[2 Pi u], 3 Sin[2 Pi u], 1.6}, SphericalRegion -> True, Boxed -> False, Axes -> False];
tiles = {{"ContourPlot", ContourPlot[Sin[x y], {x, 0, 3}, {y, 0, 3}]}, {"DensityPlot", DensityPlot[Sin[x] Cos[y], {x, -3, 3}, {y, -3, 3}, ColorFunction -> "SunsetColors"]},
    {"StreamPlot", StreamPlot[{-1 - x^2 + y, 1 + x - y^2}, {x, -3, 3}, {y, -3, 3}]}, {"PolarPlot", PolarPlot[Sin[5 t / 3], {t, 0, 6 Pi}]},
    {"ParametricPlot3D", turning[ParametricPlot3D[{Cos[t] (3 + Cos[3 t / 2]), Sin[t] (3 + Cos[3 t / 2]), Sin[3 t / 2]}, {t, 0, 4 Pi}, PlotStyle -> Tube[0.3]]]},
    {"SphericalPlot3D", turning[SphericalPlot3D[1 + Sin[5 t] Sin[4 p] / 3, {t, 0, Pi}, {p, 0, 2 Pi}, Mesh -> None]]},
    {"RegionPlot3D", turning[RegionPlot3D[x^2 + y^2 + z^2 < 1 && x y z < 0.05, {x, -1, 1}, {y, -1, 1}, {z, -1, 1}, Mesh -> None]]},
    {"ComplexPlot3D", turning[ComplexPlot3D[(z^2 + 1) / (z^2 - 1), {z, -2 - 2 I, 2 + 2 I}]]}};
versionOf = AssociationThread[lexicon[[All, "Name"]], lexicon[[All, "Version"]]];
families = {Backdrop[paperC, sections["families"]], WordScroll[family, sections["families"]],
    Title["Words come in families: \[Ellipsis]Plot", {32, 34}, "Highlight" -> "\[Ellipsis]Plot", Position -> {96, 150}, Alignment -> Left, FontSize -> 64, FontWeight -> 800, FontColor -> inkC, "Enter" -> "Fade", "Exit" -> "Cut"],
    Title[ToString[Length[family]] <> " words in the \[Ellipsis]Plot and \[Ellipsis]Chart families.", {32, 34}, Position -> {98, 202}, Alignment -> Left, FontSize -> 30, FontWeight -> 400, FontColor -> RGBColor["#6B675F"], "Enter" -> "Fade", "Exit" -> "Cut"],
    TileGrid[Append[#, With[{v = versionOf[#[[1]]]}, If[IntegerQ[v], ToString[v] <> ".0", ToString[v]]]] & /@ tiles, sections["families"], "Pulse" -> kick, "Exit" -> "Cut"]};
Timeline[families, "Duration" -> 34]["Graphics", 33.95, ImageSize -> 640]
```

## Bars 38 to 40: A Name

The music falls away and the page darkens:

```wl
breakdown = {{38, 40} -> Function[t, CanvasRectangle[{0, 0, 1920, 1080}, ground[t], Opacity -> 0.78 Easing["OutCubic"][(t - 38.05) / 0.25]]],
    Title["It isn\[CloseCurlyQuote]t only for math anymore.", {38.1, 39}, Position -> {960, 560}, FontSize -> 84, FontColor -> fg, "Enter" -> "Rise"],
    Title["It needs a name.", {39, 39.97}, Position -> {960, 570}, FontSize -> 110, FontColor -> red, "Enter" -> "Rise", "ExitTime" -> 0.17]};
Timeline[breakdown, "Duration" -> 40, Background -> paperC]["Graphics", 39.5, ImageSize -> 480]
```

On the drop, the name, letter by letter:

```wl
wlTitle = {Backdrop[Function[t, Blend[{inkC, Transparent}, Easing["InExpo"][(t - 41.25) / 0.25]]], {40, 41.5}],
    Title["THE", {40, 41.5}, Position -> {960, 420}, FontSize -> 58, FontWeight -> 300, FontColor -> boneC, "Tracking" -> 12, "Enter" -> "Fade", "EnterTime" -> 0.18],
    Title["Wolfram Language", {40, 41.5}, Position -> {960, 600}, FontSize -> 168, FontWeight -> 800, FontColor -> boneC, "Highlight" -> "Wolfram",
        "Enter" -> "Letters", "LetterInterval" -> 1/64, "Tracking" -> -3],
    Title["November 13, 2013", {40.6, 41.5}, Position -> {960, 710}, FontFamily -> "Source Code Pro", FontSize -> 34, FontWeight -> 400, FontColor -> RGBColor["#9A9CA3"], "Enter" -> "Fade"]};
Timeline[wlTitle, "Duration" -> 42]["Graphics", 40.9, ImageSize -> 480]
```

## The Film

The instruments across all of it: each era's label, the count of words, and the years, beating with the kick:

```wl
hud = {eraLabel[{12, 16}, "Mathematica 1.0", "June 23, 1988 \[CenterDot] Macintosh"], eraLabel[{16, 20}, "Mathematica 1.0", "1988 \[CenterDot] NeXT"],
    eraLabel[{20, 22}, "Mathematica 2.0", "January 1991 \[CenterDot] Windows 3.1"], eraLabel[{22, 24}, "Mathematica 3.0", "September 1996 \[CenterDot] Windows 95"],
    eraLabel[{24, 26}, "Mathematica 4", "1999 \[Dash] 2002 \[CenterDot] Mac OS 9"], eraLabel[{26, 28}, "Mathematica 5.1", "October 2004 \[CenterDot] Windows XP"],
    eraLabel[{28, 32}, "Mathematica 6.0", "May 2007 \[CenterDot] Mac OS X"], eraLabel[{34, 35}, "Mathematica 7", "November 2008 \[CenterDot] built-in parallel computing"],
    eraLabel[{35, 37}, "Mathematica 8", "November 2010"], eraLabel[{37, 40}, "Mathematica 9", "November 2012"],
    Counter[wordCount, {12, 84}, "Label" -> "Words in the language", FontColor -> fg],
    YearRuler[{{4, 1979.85}, {8, 1981.45}, {8.5, 1986.8}, {12, 1988.47}, {16, 1988.9}, {20, 1991.04}, {22, 1996.67}, {24, 1999.38}, {25, 2002.}, {26, 2004.8},
        {28, 2007.33}, {34, 2008.88}, {35, 2010.87}, {37, 2012.9}, {38.5, 2013.87}}, {4, 84},
        "Marks" -> {{1988.47, "1.0"}, {1991.04, "2.0"}, {1996.67, "3.0"}, {1999.38, "4"}, {2003.5, "5"}, {2007.33, "6.0"}, {2008.88, "7"}, {2010.87, "8"}, {2012.9, "9"}},
        "Pulse" -> kick, FontColor -> fg]};
```

The edit: the segments stacked in time, a soft backdrop keeping the narration legible over the wall, the window through its eras, the score underneath:

```wl
column = {12, 69} -> Function[t, {CanvasGradient[{1190, 0, 100, 1080}, "Horizontal", ground[t], {{0, 0}, {1, 0.88}}],
    CanvasRectangle[{1290, 0, 630, 1080}, ground[t], Opacity -> 0.88], CanvasGradient[{0, 0, 1920, 170}, "Vertical", ground[t], {{0, 0.9}, {1, 0}}]}];
film = Timeline[{coldOpen, smp, paper, y1986, name, wall, column, v1, next, v2, v3, v4, v5, v6, prints, characters, grammar,
    v1Story, nextStory, midStory, lateStory, families, breakdown, wlTitle, hud}, "Duration" -> 41.5, "SecondsPerUnit" -> 2, "Soundtrack" -> score]
```

Twelve moments of it:

```wl
GraphicsGrid[Partition[film["Graphics", #, ImageSize -> 400] & /@ {3.2, 7.6, 11.3, 13.3, 17, 19.6, 21.8, 23.8, 30.8, 33.6, 36.9, 40.9}, 3], ImageSize -> 1200]
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

These forty bars reach the language's name. The rest is the same notebook in the eras after it (Yosemite, Big Sur, the chat notebooks, dark mode, and the music of 15.0), the repositories anyone can add words to, an agent that writes the language, and a finale where the whole vocabulary fills the frame. The score above already runs to the end.

## References

[1] WAnim: https://github.com/sw1sh/WAnim

[2] The Wolfram Language's vocabulary: `WolframLanguageData`, https://reference.wolfram.com/language/ref/WolframLanguageData.html

[3] Summary of New Features in 15.0: https://reference.wolfram.com/language/guide/SummaryOfNewFeaturesIn150.html

[4] Stephen Wolfram's scrapbook: https://www.stephenwolfram.com/scrapbook/

[5] S. Wolfram, "The Story of Spikey" (2018): https://writings.stephenwolfram.com/2018/12/the-story-of-spikey/

[6] S. Wolfram, "What Is a Computational Essay?" (2017): https://writings.stephenwolfram.com/2017/11/what-is-a-computational-essay/
