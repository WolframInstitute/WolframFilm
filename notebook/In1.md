---
Template: ComputationalEssay
Name: "In[1]:= The Life of a Language"
Author: Nikolay Murzin
Date: 2026
Description: "A film about the Wolfram Language told as a natural language gaining words, computed and composed entirely in this notebook with WAnim"
Abstract: "A language is its words. This notebook makes a film about the Wolfram Language told that way: its vocabulary growing from a few hundred words in 1988 to thousands today, watched through the notebooks it was typed into, each of its era. Everything is computed here. The vocabulary comes from WolframLanguageData, the notebook outputs are evaluated, the melody is the centre column of Rule 30, and the picture reads the same Tracks that sound. Each segment of the film is one WAnim creation tool, so the whole edit is a list a person could type live. Eighty-four bars, from SMP in 1979 through every era of the notebook, the repositories, chat notebooks and the music of 15.0, to an agent that writes the language and the whole vocabulary on one page."
Keywords: [WAnim, AnimatedGraphics, Track, Rule 30, WolframLanguageData, film, music, notebook history]
Sources: ["[WAnim](https://github.com/sw1sh/WAnim)", "[Summary of New Features in 15.0](https://reference.wolfram.com/language/guide/SummaryOfNewFeaturesIn150.html)", "[Stephen Wolfram's scrapbook](https://www.stephenwolfram.com/scrapbook/)", "[The Story of Spikey](https://writings.stephenwolfram.com/2018/12/the-story-of-spikey/)"]
Links: ["[What Is a Computational Essay?](https://writings.stephenwolfram.com/2017/11/what-is-a-computational-essay/)"]
---

## A Film Is a List

A film here is an AnimatedGraphics: Graphics with a time axis, a list of things each shown over its span of time. WAnim's creation tools make those things. A typed line, a terminal of 1979, a notebook of 1988 that types and evaluates on the clock, a card for a symbol, a dancing Spikey: each segment of the film is one call, placed in time. The soundtrack is a Track in the same list, a pattern that answers what plays when, and the picture can ask it the same question.

The creation tools, the canvas they draw on, and the pattern language, installed from the Wolfram Paclet Repository:

```wl
PacletInstall["WolframInstitute/WAnim"];
Needs["WolframInstitute`WAnim`"]
```

The film counts in bars of 120 BPM: one bar is one cycle of the score's Tracks, and every time below is a bar. The film, at the end, says how long a bar lasts: half a cycle a second.

## The Vocabulary

Every documented symbol, with the version that introduced it, how often it is used across code, documentation and notebooks, and whether it is named after a person:

```wl
lexicon = Cases[WolframLanguageData[All, {"Name", "VersionIntroduced", "Frequencies", "EponymousPeople"}],
    {n_String, v_, f_, e_} :> <|"Name" -> n, "Version" -> ToExpression[ToString[v]], "Frequency" -> Replace[f, {{"All" -> w_ ? NumericQ, ___} :> w, _ -> 10.^-9}], "Eponym" -> MatchQ[e, {__}]|>];
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
lexicon = Join[lexicon, <|"Name" -> #, "Version" -> 15., "Frequency" -> 10.^-9, "Eponym" -> False|> & /@ new15];
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

The harmony walks i, VI, III, VII in A minor, one chord a bar, and lifts a whole tone for the climax; the outro starts at bar 77:

```wl
lift[b_] := If[b >= at["climax"], 2, 0];
chordAt[b_] := {{57, 60, 64}, {57, 60, 65}, {55, 60, 64}, {55, 59, 62}}[[Mod[Floor[b], 4] + 1]] + lift[b];
rootAt[b_] := {45, 41, 48, 43}[[Mod[Floor[b], 4] + 1]] + lift[b];
end = at["outro"];
chordAt /@ Range[0, 3]
```

Players are never quite even: a velocity for each note, reproducible, drawn from its own seed:

```wl
rnd[k_] := BlockRandom[SeedRandom[k]; RandomReal[]];
```

The melody is written by Rule 30. The centre column of the automaton grown from one cell gives four bits per eighth note: three pick a degree of A minor pentatonic, the fourth decides whether it sounds; downbeats always sound, on the chord root, and are accented. It plays until the breakdown, from 11 to the chat notebooks, and fades through the outro, and it rests while the slider of 6.0 moves:

```wl
rule30 = CellularAutomaton[30, {{1}, 0}, {{0, 4000}, {0, 0}}][[All, 1]];
manip = at["v6", 2];
pluckOn[b_] := (b < at["breakdown"] || in[b, {at["v11"], at["llm"]}] || b >= end) && ! in[b, {manip, manip + 2}];
pluckNote[s_] := Which[! pluckOn[s / 8], Missing[], Mod[s, 8] == 0, chordAt[s / 8][[1]] + 12, rule30[[4 s + 4]] == 0, Missing[],
    True, {69, 72, 74, 76, 79, 81, 84, 86}[[4 rule30[[4 s + 1]] + 2 rule30[[4 s + 2]] + rule30[[4 s + 3]] + 1]] + lift[s / 8]];
pluckVelocity[s_] := If[Mod[s, 8] == 0, 0.9, 0.55 + 0.3 rnd[s]] If[s / 8 < 12, 1, 0.6] If[s / 8 >= end, Max[0, 1 - (s / 8 - end - 1) / 6], 1];
Take[rule30, 32]
```

The melody as a Track that computes itself: asked about any stretch of time, it reads the automaton:

```wl
melody = Track[Function[span, Table[With[{n = pluckNote[s]}, If[MissingQ[n], Nothing,
    <|"Value" -> n, "Velocity" -> pluckVelocity[s], "Whole" -> {s / 8, (s + 1) / 8}, "Part" -> {Max[span[[1]], s / 8], Min[span[[2]], (s + 1) / 8]}|>]],
    {s, Max[0, Floor[8 span[[1]]]], Ceiling[8 span[[2]]] - 1}]]];
melody["Query", 12, 13]
```

A Track shows itself as a live piano roll: click it to hear it. TrackShift brings bar 12 to the start, and TrackView says how many bars to show:

```wl
TrackView["PianoRoll", "Cycles" -> 2][TrackShift[-12][melody]]
```

The drums. Soft kicks under 1986, four on the floor from 1.0 to the outro, dropping out for the breakdown, a beat's silence before each drop, and half time into 15.0; claps on two and four, hats on the offbeat eighths with ghost sixteenths in the busier stretches, open hats in the drops:

```wl
gaps = {{at["breakdown"] - 1/4, at["breakdown", 2]}, {at["agents", 2] - 1/4, at["agents", 2]}}; half = {at["v15"], at["v15", 2]};
drums[b_] := 12 <= b < end && ! in[b, "breakdown"];
gap[x_] := AnyTrue[gaps, in[x, #] &];
softKicks = Track[Append[{#, 1/4, "bd", 0.8} & /@ Join[Range[8, 10.5, 1/2], {11}], {11.5, 1/4, "bd", 0.7}]];
kick = Track[Append[{#, 1/4, "bd"} & /@ Select[Range[12, end - 1/4, 1/4], drums[Floor[#]] && ! gap[#] && ! (in[#, half] && OddQ[4 #]) &], {end, 1/4, "bd"}]];
claps = Track[{#, 1/4, "cp", If[FractionalPart[#] == 1/4, 0.8, 0.85]} & /@ Select[Flatten[Table[b + {1/4, 3/4}, {b, 12, end - 1}]], drums[Floor[#]] && ! in[#, "v14"] && ! in[#, half] && ! gap[#] &]];
sixteenths[b_] := inAny[b, {{at["v4"], at["breakdown"]}, {at["v10"], at["llm"]}, "agents", "climax"}];
hats = Track[{#, 1/16, "hh", 0.75 + 0.2 rnd[16 #]} & /@ Select[Range[12, end - 1/16, 1/16], drums[Floor[#]] && ! in[#, "v14"] && ! gap[#] && Mod[16 #, 4] == 2 &]];
ghostHats = Track[{#, 1/16, "hh", If[Mod[16 #, 4] == 0, 0.35, 0.45] + 0.15 rnd[16 #]} & /@
    Select[Range[12, end - 1/16, 1/16], drums[Floor[#]] && ! in[#, "v14"] && ! gap[#] && Mod[16 #, 4] != 2 && sixteenths[Floor[#]] &]];
openHats = Track[{#, 1/8, "oh", 0.45} & /@ Select[Range[12, end - 1/16, 1/16], Mod[16 #, 4] == 2 && drums[Floor[#]] && ! gap[#] && inAny[Floor[#], {{at["v10"], at["v10", 6]}, "climax", "families"}] &]];
TrackView["Punchcard", "Cycles" -> 1][Track[TrackShift[-40] /@ {kick, claps, hats, ghostHats, openHats}]]
```

The band. A pad holds each chord, swelling in the breakdown, and a long chord ends it over a held bass; the bass pumps octaves on the offbeats in the drops and walks quarter roots elsewhere; stabs punch the drops and every beat of the plot montage:

```wl
drops = {{12, 18}, {at["v10"], at["v10", 6]}, "climax", "families"};
padVelocity[b_] := Which[b < 12, 0.55, in[b, "breakdown"], 0.8, in[b, "v14"], 0.7, True, 0.6];
pad = Track[Join[Flatten[Table[{b, 1, #, padVelocity[b]} & /@ chordAt[b], {b, 4, end - 1}], 1], {end, 5, #, 0.9} & /@ Append[chordAt[end], chordAt[end][[1]] + 12]]];
bass = Track[Table[With[{b = s / 8}, Which[! drums[Floor[b]] || gap[b], Nothing,
    inAny[Floor[b], drops], If[OddQ[s], {b, 1/8, rootAt[b] + If[Mod[s, 4] == 3, 12, 0], 0.9}, Nothing],
    EvenQ[s], {b, 1/8, rootAt[b], 0.8}, True, Nothing]], {s, 96, 8 end - 1}]];
longBass = Track[{{end, 5, rootAt[end], 0.9}}];
stabs = Track[Flatten[Table[Which[
    inAny[b, {{12, 18}, {at["v10"], at["v10", 6]}, "climax"}], Table[{b + p / 16, 1/16, n + 12, 0.5}, {p, {0, 3, 6, 10, 12}}, {n, chordAt[b]}],
    in[b, "families"], Table[{b + q / 4, 1/8, n + 12, 0.62}, {q, 0, 3}, {n, chordAt[b]}], True, {}], {b, 12, end - 1}], 2]];
TrackView["PianoRoll", "Cycles" -> 2][Track[TrackShift[-40] /@ {pad, bass, stabs}]]
```

The tunes. A four-bar hook and its answer, first played by the lead when the language gets its name, then by a bell for 15.0, then by both, a whole tone up, for the climax; a voice sings over the chat notebooks; arpeggios climb through the breakdown and into the climax:

```wl
hook = {{0, 1.5, 69}, {1.5, 0.5, 72}, {2, 1, 76}, {3, 1, 74}, {4, 1.5, 72}, {5.5, 0.5, 69}, {6, 1, 72}, {7, 1, 77},
    {8, 1.5, 76}, {9.5, 0.5, 74}, {10, 1, 72}, {11, 1, 67}, {12, 1, 71}, {13, 1, 74}, {14, 1.5, 79}, {15.5, 0.5, 76}};
answer = {{0, 1.5, 76}, {1.5, 0.5, 74}, {2, 1, 76}, {3, 1, 81}, {4, 1.5, 77}, {5.5, 0.5, 76}, {6, 1, 72}, {7, 1, 69},
    {8, 1, 67}, {9, 1, 72}, {10, 1, 76}, {11, 1, 79}, {12, 2, 79}, {14, 1, 74}, {15, 1, 71}};
voiceLine = {{0, 2, 76}, {2, 1, 72}, {3, 1, 74}, {4, 3, 72}, {7, 1, 69}, {8, 2, 67}, {10, 1, 72}, {11, 1, 76}, {12, 4, 74}};
phrase[start_, notes_, vel_, k_ : 0] := {start + #1 / 4, #2 / 4, #3 + k, vel} & @@@ notes;
lead = Track[Join[phrase[at["v10"], hook, 0.8], phrase[at["v10", 4], Take[answer, 8], 0.8], phrase[at["climax"], hook, 0.85, 2], phrase[at["climax", 4], answer, 0.85, 2]]];
bell = Track[Join[phrase[at["v15"], hook, 0.9], phrase[at["v15", 4], Take[answer, 8], 0.85], phrase[at["climax"], hook, 0.5, 14], phrase[at["climax", 4], answer, 0.5, 14]]];
voice = Track[phrase[at["llm"], voiceLine, 0.8]];
arps = Track[Flatten[Table[With[{c = chordAt[s / 16]}, {s / 16, 1/16, {c[[1]], c[[2]], c[[3]], c[[1]] + 12, c[[3]], c[[2]]}[[Mod[s, 6] + 1]] + 12, 0.4 + 0.5 (s / 16 - r[[1]]) / (r[[2]] - r[[1]])}],
    {r, {{at["breakdown"], at["breakdown", 1.75]}, {at["agents"], at["agents", 1.75]}}}, {s, 16 r[[1]], 16 r[[2]] - 1}], 1]];
TrackView["PianoRoll", "Cycles" -> 8][TrackShift[-40][lead]]
```

The seams between sections: crashes on every new era, risers and an accelerating snare roll into each drop, impacts on the drops:

```wl
crashes = Track[Join[{{12, 2, "cr", 1}}, {at[#], 2, "cr", 0.6} & /@ {"next", "grammar"}, {at[#], 2, "cr", 0.55} & /@ {"v2", "v3", "v4", "v5", "v6"}, {{manip, 2, "cr", 0.55}, {at["families"], 2, "cr", 0.9}},
    {at[#], 2, "cr", 0.45} & /@ {"v7", "v8", "v9"}, {{at["v10"], 2, "cr", 1}, {at["v10", 4], 2, "cr", 0.6}}, {at[#], 2, "cr", 0.5} & /@ {"v11", "repos", "v12", "v123", "v132"},
    {{at["llm"], 2, "cr", 0.7}, {at["v14"], 2, "cr", 0.4}, {at["v15"], 2, "cr", 0.6}, {at["v15", 4], 2, "cr", 0.4}, {at["climax"], 2, "cr", 1}},
    {at["climax", #], 2, "cr", 0.7} & /@ {2, 4, 6}, {{end, 2, "cr", 1}}]];
risers = Track[{{10, 2, 60, 1}, {at["breakdown"], 1.9, 60, 1.1}, {at["agents"], 1.8, 60, 1}}];
rolls = Track[{{11, 1, "sd", 0.8}, {at["breakdown", 1], 0.875, "sd", 1}, {at["agents", 1], 0.75, "sd", 0.9}}];
impacts = Track[{{12, 2, 60, 1}, {at["families"], 2, 60, 0.6}, {at["v10"], 2, 60, 1.1}, {at["climax"], 2, 60, 1.2}, {end, 2, 60, 1.1}}];
```

The 6.0 notebook's Manipulate slider, held and snapped on the beat, a fraction of its two bars in, out:

```wl
sliderAt[u_] := Module[{keys = {{0, 0.1}, {0.25, 0.1}, {0.5, 0.85}, {0.7, 0.85}, {0.9, 0.3}, {1.05, 0.3}, {1.25, 0.52}, {2, 0.52}}, i},
    i = Max[1, LengthWhile[keys, #[[1]] <= 2 u &]]; If[i >= Length[keys], keys[[-1, 2]],
    keys[[i, 2]] + (keys[[i + 1, 2]] - keys[[i, 2]]) Easing["InOutCubic"][(2 u - keys[[i, 1]]) / (keys[[i + 1, 1]] - keys[[i, 1]])]]];
Plot[sliderAt[u], {u, 0, 1}, PlotRange -> {0, 1}]
```

The music bus runs through a low-pass that the film opens and closes: dull before the drums, following that slider, sweeping up through the breakdown, breathing in 14.x, opening through the agent's build:

```wl
musicCutoff[b_] := Which[b < 4, 5000, in[b, {manip, manip + 2}], 260 60^sliderAt[(b - manip) / 2], in[b, "breakdown"], 700 24^(((b - at["breakdown"]) / 2)^2),
    in[b, "v14"], 900 + 400 Sin[(b - at["v14"]) Pi / 2], in[b, "agents"], 1200 14^((b - at["agents"]) / 2), True, 18000];
Plot[musicCutoff[b], {b, 0, 84}, ScalingFunctions -> "Log", PlotRange -> All, AxesLabel -> {"bar", "Hz"}]
```

The 2.0 notebook plays a sound; it is heard, sampled from the kernel, when its cell evaluates:

```wl
chirp = Audio[Play[Sin[1000 t (1 + t)] Sin[2 Pi t], {t, 0, 1.5}]]
```

Every part on its instrument, mixed: the music, bass and reverb duck under the kick, the sends go through a shared ping-pong delay and reverb, and the master is saturated, limited and faded:

```wl
score = Mixer["Sidechain" -> kick, "Cutoff" -> musicCutoff, "FadeOut" -> 5/4][Track[{Instrument["Pluck"][melody], Instrument["Pad"][pad], Instrument["Bass"][bass], Instrument["LongBass"][longBass],
    Instrument["Stab"][stabs], Instrument["Lead"][lead], Instrument["Bell"][bell], Instrument["Voice"][voice], Instrument["Arp"][arps],
    Instrument["SoftKick"][softKicks], Instrument["Kick"][kick], Instrument["Clap"][claps], Instrument["Hat"][hats], Instrument["Hat"][ghostHats], Instrument["OpenHat"][openHats],
    Instrument["Crash"][crashes], Instrument["Riser"][risers], Instrument["Roll"][rolls], Instrument["Impact"][impacts],
    Instrument["Gain" -> 0.14][Track[{{at["v2", 0.45], 1, chirp}}]]}]];
```

The whole soundtrack, a bar every two seconds (the typing heard in the film is added by the film itself, from what it types):

```wl
Audio[score, 84, "CyclesPerSecond" -> 1/2]
```

## Bars 0 to 4: The Thesis

Typed in the dark, its last word lit, then swallowed by the cursor:

```wl
coldOpen = {Backdrop[RGBColor["#050506"], {0, 4}],
    Typewriter["Every language starts with a few words.", {0.5, 4}, Position -> {960, 554}, "TypeTime" -> 2.1, "Highlight" -> "words", "HighlightTime" -> 2.8,
        "Exit" -> "Collapse", "ExitTime" -> 0.45]};
coldOpen[[2]][3.2, Background -> Black, ImageSize -> 480]
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
smp = TerminalSession[{{4.1, "#I[1]::  Ex[(a + b)^3]"}, {4.6, "#O[1]:   a^3 + 3 a^2 b + 3 a b^2 + b^3", "Output"},
    {4.9, "#I[2]::  Graph[Sin[1/x],x,0.02,0.2]"}, {5.2, "#O[2]:", "Output"}, {5.3, asciiPlot, "Print"},
    {6.5, "NOVEMBER 1979. CALTECH.", "Caption"}, {6.8, "A 20-YEAR-OLD PHYSICIST WRITES A LANGUAGE", "Caption"}, {7.2, "FOR TALKING TO HIS COMPUTER: SMP.", "Caption"}}, {4, 8}];
smp[7.6, ImageSize -> 480]
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
y1986 = {TitleCard["1986", {8.05, 10}, Position -> {160, 470}, Alignment -> Left, FontSize -> 220, FontColor -> red, "EnterTime" -> 0.35],
    Typewriter["He starts again, from nothing.", {8.35, 10}, Position -> {170, 580}, Alignment -> Left, "TypeTime" -> 0.55, "Cursor" -> None,
        FontFamily -> "Source Sans 3", FontSize -> 60, FontWeight -> 600, FontColor -> inkC],
    Typewriter["A language for everything.", {8.95, 10}, Position -> {170, 660}, Alignment -> Left, "TypeTime" -> 0.5, "Cursor" -> None,
        FontFamily -> "Source Sans 3", FontSize -> 60, FontWeight -> 300, FontColor -> inkC]};
```

The name, one letter per eighth note, then everything collapses into the drop:

```wl
name = {TitleCard["Mathematica", {10, 12}, "Enter" -> "Letters", "Cursor" -> True, Position -> {960, 580}, FontSize -> 170, FontColor -> inkC,
        "Exit" -> {"Collapse", {960, 520}}, "ExitTime" -> 0.4],
    TitleCard["The name? Steve Jobs suggested it.", {10.9, 12}, "Enter" -> "Fade", Position -> {960, 690}, FontSize -> 48, FontWeight -> 400, FontSlant -> Italic,
        FontColor -> RGBColor["#55524C"], "Exit" -> {"Collapse", {960, 520}}, "ExitTime" -> 0.4]};
AnimatedGraphics[{paper, y1986, name, prints}, "Duration" -> 12][11.3, ImageSize -> 480]
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
    "TypeTime" -> 0.2, "GraphicsSize" -> 250];
v1[14.9, ImageSize -> 480]
```

Behind the window, the whole vocabulary as a dictionary page; each release's words fly out of the latest output to their places, and the page darkens with the film. The wall is told the colour it sits on, so it can keep its settled words as one opaque picture:

```wl
arrivals = Association[Flatten[releases[[All, "Arrivals"]]]];
wallWords = {#["Name"], #["Frequency"], Lookup[arrivals, #["Name"], Infinity]} & /@ lexicon;
wallStyle = {"Origin" -> {583, 488}, "FlightCount" -> 80, Background -> ground,
    "Color" -> (Blend[{RGBColor["#B9B3A7"], RGBColor["#34363C"]}, dark[#]] &), "StrongColor" -> (Blend[{RGBColor["#2A2825"], boneC}, dark[#]] &)};
wall = WordWall[wallWords, {12, 84}, wallStyle];
```

The story on the right, in the ink of the moment: captions, and dictionary entries looked up live:

```wl
story[s_, span_, hl_ : None] := CaptionText[s, span, "Highlight" -> hl, FontColor -> fg];
entry[name_, span_, opts___] := DictionaryCard[name, span, opts, FontColor -> fg, "NoteColor" -> soft];
v1Story = {story["Its first vocabulary: " <> ToString[Length[releases[[1, "Words"]]]] <> " words.", {12.25, 13.85}, ToString[Length[releases[[1, "Words"]]]]],
    story["Words for pictures, too.", {14.1, 15.85}], entry["Names", {12.3, 13.25}], entry["Integrate", {13.3, 13.95}]}
```

The era, in the corner, for as long as it lasts:

```wl
eraLabel[{t0_, t1_}, name_, sub_] := {TitleCard[ToUpperCase[sub], {t0, t1}, Position -> {96, 76}, Alignment -> Left, FontSize -> 18, FontWeight -> 600, FontColor -> red, "Tracking" -> 3, "Enter" -> "Fade", "Exit" -> "Cut"],
    TitleCard[name, {t0, t1}, Position -> {96, 124}, Alignment -> Left, FontSize -> 46, FontColor -> fg, "Enter" -> "Fade", "Exit" -> "Cut"]};
eraLabel[{12, 16}, "Mathematica 1.0", "June 23, 1988 \[CenterDot] Macintosh"]
```

Spikey, dancing to the kick, as each version drew it: the stellated icosahedron of 1.0 on a one-bit Mac and a greyscale NeXT, the lilac hyperbolic dodecahedron of 2, then glass, rainbow, gold, the reds and oranges, the grey of 12 and the red Spikey of today. It changes on each release's bar. Beside it for as long as it dances, the melody's automaton, the centre column of Rule 30, runs into a read head, and the note under the head is asked of the melody Track itself:

```wl
spikeyVersion = Function[t, 1 + LengthWhile[{20, 22, 24, 26, 28, 34, 35, 37, 40.5, 46, 49, 53}, # <= t &]];
spikeyDisplay = Which[# < at["next"], "1Bit", # < at["v2"], "Gray", True, Automatic] &;
characters = {Spikey[{12, 66.9}, "Version" -> spikeyVersion, "Display" -> spikeyDisplay], AutomatonTape[30, melody, {12, 66.9}, "Ink" -> fg, "Exit" -> "Cut"]};
GraphicsRow[AnimatedGraphics[{Backdrop[paperC], characters}, "Duration" -> 40][#, ImageSize -> 300] & /@ {13.3, 17, 29}]
```

## Bars 16 to 20: NeXT, and One Grammar

The same window, now on a NeXT: four greys, the Spikey of 1.0 computed as a polyhedron, then the grammar under every expression:

```wl
next = NotebookSession[{{16.25, "In", "PolyhedronData[\"GreatStellatedDodecahedron\"]", 0.25}, {16.6, "Out", PolyhedronData["GreatStellatedDodecahedron"]},
    {18, "In", "FullForm[{x -> 1, f[y]}]", 0.4}, {18.6, "Out", FullForm[{x -> 1, f[y]}]}}, {16, 20},
    "Era" -> "NeXT1988", "Title" -> "Untitled-1.ma", "From" -> v1, "GraphicsSize" -> 190];
next[18.9, ImageSize -> 480]
```

That grammar, drawn: every expression is a head applied to arguments, all the way down:

```wl
grammar = TreeDiagram[Hold[{x -> 1, f[y]}], {18.7, 20}, Position -> {1540, 250}, FontColor -> fg];
grammar[19.6, ImageSize -> 480]
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

Mathematica 2.0 on Windows 3.1 plays a sound, drawing its waveform in a box as 2.0 did and colouring what has played, and plots a surface in colour:

```wl
soundEnvelope = With[{d = First[AudioData[Audio[Play[Sin[1000 t (1 + t)] Sin[2 Pi t], {t, 0, 1.5}]]]]}, MinMax /@ Partition[d, Floor[Length[d] / 150]]];
playing[u_] := Graphics[{MapIndexed[{If[#2[[1]] <= u Length[soundEnvelope], RGBColor[0, 0, 0.5], GrayLevel[0.6]], Rectangle[{#2[[1]] - 1, #1[[1]]}, {#2[[1]], #1[[2]]}]} &, soundEnvelope]},
    Frame -> True, FrameTicks -> None, FrameStyle -> Black, PlotRange -> {{0, Length[soundEnvelope]}, {-1.05, 1.05}}, AspectRatio -> 70 / 300, ImageSize -> 300];
v2 = NotebookSession[{{20, "In", "Play[Sin[1000 t (1 + t)] Sin[2 Pi t], {t, 0, 1.5}]", 0.3}, {20.4, "Out", playing, 0.75}, {20.45, "Out", "-Sound-"},
    {21.0, "In", "ParametricPlot3D[{u Cos[u] (4 + Cos[v + u]), u Sin[u] (4 + Cos[v + u]), u Sin[v + u]}, {u, 0, 4 Pi}, {v, 0, 2 Pi}]", 0.2},
    {21.3, "Out", ParametricPlot3D[{u Cos[u] (4 + Cos[v + u]), u Sin[u] (4 + Cos[v + u]), u Sin[v + u]}, {u, 0, 4 Pi}, {v, 0, 2 Pi}]}}, {20, 22},
    "Era" -> "Win1991", "Title" -> "Mathematica for Windows - [Untitled-1]", "From" -> next, "GraphicsSize" -> 250];
v2[21.8, ImageSize -> 480]
```

3.0 on Windows 95: the notebook is itself an expression, and mathematics is typed as it is written:

```wl
v3 = NotebookSession[{{22, "Title", "Notes on Language"}, {22.1, "Text", "Every language starts with a few words."},
    {22.5, "In", "NotebookRead[PreviousCell[]]", 0.2}, {22.8, "Out", ToString[Cell["Every language starts with a few words.", "Text"], InputForm]},
    {23.1, "In", HoldForm[Integrate[1/(x^3 - 1), x]]}, {23.45, "Out", Integrate[1/(x^3 - 1), x]}}, {22, 24},
    "Era" -> "Win1996", "Title" -> "Mathematica - [Untitled-1]", "From" -> v2];
v3[23.8, ImageSize -> 480]
```

4 on Mac OS 9 reads pictures and grows Rule 30, a row at a time:

```wl
ca = CellularAutomaton[30, {{1}, 0}, 80];
v4 = NotebookSession[{{24, "In", "ExampleData[{\"TestImage\", \"Mandrill\"}]", 0.15}, {24.25, "Out", ImageResize[ExampleData[{"TestImage", "Mandrill"}], 150]},
    {24.6, "In", "ArrayPlot[CellularAutomaton[30, {{1}, 0}, 80]]", 0.25},
    {24.9, "Out", u |-> ArrayPlot[Join[Take[ca, Max[1, Round[81 u]]], ConstantArray[0, {81 - Max[1, Round[81 u]], 161}]], ImageSize -> 420], 1}}, {24, 26},
    "Era" -> "Mac1999", "From" -> v3];
v4[25.5, ImageSize -> 480]
```

5.1 on Windows XP: string patterns, and the names of colours:

```wl
v5 = NotebookSession[{{26, "In", "StringCases[\"Every language starts with a few words.\", WordCharacter ..]", 0.25},
    {26.35, "Out", StringCases["Every language starts with a few words.", WordCharacter ..]},
    {26.75, "In", "Graphics[Table[{{Red, Orange, Yellow, Green, Cyan, Blue, Purple, Magenta, Pink, Brown}[[Mod[k, 10] + 1]], EdgeForm[White], Disk[(1 + k/24) {Cos[k Pi/5.2], Sin[k Pi/5.2]}, 0.25 + k/60]}, {k, 60, 0, -1}]]", 0.3},
    {27.1, "Out", Graphics[Table[{{Red, Orange, Yellow, Green, Cyan, Blue, Purple, Magenta, Pink, Brown}[[Mod[k, 10] + 1]], EdgeForm[White], Disk[(1 + k/24) {Cos[k Pi/5.2], Sin[k Pi/5.2]}, 0.25 + k/60]}, {k, 60, 0, -1}], ImageSize -> 250]}}, {26, 28},
    "Era" -> "WinXP2004", "Title" -> "Mathematica 5.1 - [Untitled-1]", "From" -> v4];
v5[27.6, ImageSize -> 480]
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

The slider of Manipulate (sliderAt, defined with the score, since the music's filter follows it too), then the surface turned by hand:

```wl
manipulate[u_] := With[{a0 = 0.5 + 2.5 sliderAt[u], turn = Max[0, 2 u - 1.3] 1.4},
    Manipulate[Plot3D[Sin[a x] Cos[y], {x, -3, 3}, {y, -3, 3}, ImageSize -> 260, ViewPoint -> {3.2 Cos[turn - 0.9], 3.2 Sin[turn - 0.9], 2}], {{a, a0, "a"}, 0.5, 3}]];
manipulate[0.3]
```

7 computes in parallel: four kernels share a Julia set, each filling its quarter:

```wl
julia = Compile[{{z, _Complex}}, Module[{w = z, k = 0}, While[Abs[w] < 2 && k < 60, w = w^2 + (-0.8 + 0.156 I); k++]; k]];
LaunchKernels[4];
juliaSet = ParallelTable[julia[x + I y], {y, 0.95, -0.95, -0.02}, {x, -1.6, 1.6, 0.02}];
CloseKernels[];
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
    {manip - 0.15, "In", "Manipulate[Plot3D[Sin[a x] Cos[y], {x, -3, 3}, {y, -3, 3}], {a, 0.5, 3}]", 0.15}, {manip, "Out", manipulate, 2},
    {34, "In", "ParallelTable[julia[x + I y], {y, 0.95, -0.95, -0.02}, {x, -1.6, 1.6, 0.02}]", 0.2}, {34.25, "Out", parallelFrame, 0.6},
    {35, "FreeForm", "countries in europe", "CountryData[\"Europe\"]", 0.3}, {35.5, "Out", Short[CommonName[europe], 1]},
    {36, "In", "Graph[UndirectedEdge @@@ borders, VertexLabels -> Automatic]", 0.2}, {36.25, "Out", bordersGrowing, 0.6},
    {37, "In", "UnitConvert[Quantity[5., \"Kilometers\"], \"Miles\"]", 0.25}, {37.35, "Out", UnitConvert[Quantity[5., "Kilometers"], "Miles"]}}, {28, 40},
    "Era" -> "MacOSX2007", "From" -> v5, "Hide" -> {sections["families"]}, "Dim" -> {38, 39.8}, "PushIn" -> 0.05];
GraphicsRow[v6[#, ImageSize -> 400] & /@ {31, 36.9}]
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
    TitleCard["Words come in families: \[Ellipsis]Plot", {32, 34}, "Highlight" -> "\[Ellipsis]Plot", Position -> {96, 150}, Alignment -> Left, FontSize -> 64, FontWeight -> 800, FontColor -> inkC, "Enter" -> "Fade", "Exit" -> "Cut"],
    TitleCard[ToString[Length[family]] <> " words in the \[Ellipsis]Plot and \[Ellipsis]Chart families.", {32, 34}, Position -> {98, 202}, Alignment -> Left, FontSize -> 30, FontWeight -> 400, FontColor -> RGBColor["#6B675F"], "Enter" -> "Fade", "Exit" -> "Cut"],
    TileGrid[Append[#, With[{v = versionOf[#[[1]]]}, If[IntegerQ[v], ToString[v] <> ".0", ToString[v]]]] & /@ tiles, sections["families"], "Exit" -> "Cut"]};
AnimatedGraphics[families, "Duration" -> 34][33.95, ImageSize -> 640]
```

## Bars 38 to 40: A Name

The music falls away and the page darkens:

```wl
breakdown = {Backdrop[ground, {38, 40}, Opacity -> (0.78 Easing["OutCubic"][(# - 38.05) / 0.25] &)],
    TitleCard["It isn\[CloseCurlyQuote]t only for math anymore.", {38.1, 39}, Position -> {960, 560}, FontSize -> 84, FontColor -> fg, "Enter" -> "Rise"],
    TitleCard["It needs a name.", {39, 39.97}, Position -> {960, 570}, FontSize -> 110, FontColor -> red, "Enter" -> "Rise", "ExitTime" -> 0.17]};
AnimatedGraphics[breakdown, "Duration" -> 40, Background -> paperC][39.5, ImageSize -> 480]
```

On the drop, the name, letter by letter:

```wl
wlTitle = {Backdrop[Function[t, Blend[{inkC, Transparent}, Easing["InExpo"][(t - 41.25) / 0.25]]], {40, 41.5}],
    TitleCard["THE", {40, 41.5}, Position -> {960, 420}, FontSize -> 58, FontWeight -> 300, FontColor -> boneC, "Tracking" -> 12, "Enter" -> "Fade", "EnterTime" -> 0.18],
    TitleCard["Wolfram Language", {40, 41.5}, Position -> {960, 600}, FontSize -> 168, FontWeight -> 800, FontColor -> boneC, "Highlight" -> "Wolfram",
        "Enter" -> "Letters", "Interval" -> 1/64, "Tracking" -> -3],
    TitleCard["November 13, 2013", {40.6, 41.5}, Position -> {960, 710}, FontFamily -> "Source Code Pro", FontSize -> 34, FontWeight -> 400, FontColor -> RGBColor["#9A9CA3"], "Enter" -> "Fade"]};
AnimatedGraphics[wlTitle, "Duration" -> 42][40.9, ImageSize -> 480]
```

## Bars 40 to 46: Version 10

The window comes back out of the name as Yosemite. It reads what you mean, draws the Earth, and knows the stars. The globe of July 2014, its night side, and great circles from Champaign to the world:

```wl
champaign = Entity["City", {"Champaign", "Illinois", "UnitedStates"}];
capitals = Entity["City", #] & /@ {{"Paris", "IleDeFrance", "France"}, {"Tokyo", "Tokyo", "Japan"}, {"SaoPaulo", "SaoPaulo", "Brazil"}, {"Moscow", "Moscow", "Russia"}, {"Sydney", "NewSouthWales", "Australia"}};
globe = GeoGraphics[{NightHemisphere[DateObject[{2014, 7, 9, 12}]], red, Thick, GeoPath[{champaign, #}, "GreatCircle"] & /@ capitals},
    GeoProjection -> "Orthographic", GeoCenter -> champaign, ImageSize -> 400]
```

Every star the eye can see, by temperature and brightness:

```wl
starPlot = ListPlot[StarData[EntityClass["Star", "NakedEyeStar"], {"EffectiveTemperature", "AbsoluteMagnitude"}],
    ScalingFunctions -> {"Reverse", "Reverse"}, PlotStyle -> PointSize[0.006], AxesLabel -> {"temperature", "magnitude"}, ImageSize -> 460]
```

And the language knows its own words: which symbols are related to which. Two steps out from Plot, drawn an edge at a time:

```wl
related = NestGraph[Map[CanonicalName, WolframLanguageData[#, "RelatedSymbols"]] &, "Plot", 2];
relatedGrowing[u_] := Graph[VertexList[related], Take[EdgeList[related], Max[1, Round[u EdgeCount[related]]]],
    VertexCoordinates -> Thread[VertexList[related] -> GraphEmbedding[related]], VertexLabels -> "Name", VertexLabelStyle -> Directive[7, GrayLevel[0.3]],
    VertexStyle -> red, EdgeStyle -> RGBColor["#6D82C7"], ImageSize -> {620, 380}];
relatedGrowing[1]
```

The window, bursting back after the title:

```wl
v10 = NotebookSession[{{40.5, "In", "Interpreter[\"Country\"][\"france\"]", 0.25}, {40.85, "Out", Interpreter["Country"]["france"]},
    {41.2, "In", "GeoGraphics[{NightHemisphere[DateObject[{2014, 7, 9, 12}]], GeoPath[{champaign, #}, \"GreatCircle\"] & /@ capitals}, GeoProjection -> \"Orthographic\"]", 0.3},
    {41.55, "Out", globe}, {43, "In", "Pluralize[\"mouse\"]", 0.15}, {43.2, "Out", Pluralize["mouse"]},
    {43.6, "In", "ListPlot[StarData[EntityClass[\"Star\", \"NakedEyeStar\"], {\"EffectiveTemperature\", \"AbsoluteMagnitude\"}]]", 0.25}, {43.9, "Out", starPlot},
    {44.85, "In", "NestGraph[WolframLanguageData[#, \"RelatedSymbols\"] &, \"Plot\", 2]", 0.2}, {45.1, "Out", relatedGrowing, 0.7}}, {40.4, 46},
    "Era" -> "Yosemite2014", "Title" -> "Untitled-1.nb", "EnterTime" -> 0.25];
v10[45.9, ImageSize -> 480]
```

## Bars 46 to 55: Version 11 to 13

Big Sur, and a notebook that keeps going. It sees (the picture is in the input), and it takes your words as entities of their own:

```wl
mandrill = ImageResize[ExampleData[{"TestImage", "Mandrill"}], 44];
seeInput = With[{img = mandrill}, HoldForm[NetModel["Wolfram ImageIdentify Net V1"][img]]];
wordStore = EntityStore["Word" -> <|"Entities" -> AssociationMap[<|"Label" -> #|> &, lexicon[[All, "Name"]]]|>];
registered = EntityRegister[wordStore]
```

From the repositories: every fireball the Data Repository knows, by the energy it radiated, and a bird that says anything:

```wl
fireballs = GeoBubbleChart[ResourceData["Fireballs and Bolides"][All, #Coordinates -> #TotalRadiatedEnergy &], ImageSize -> 470];
bird = ResourceFunction["BirdSay"]["Every language starts with a few words."];
{fireballs, bird}
```

Compiled code, a molecule turning, and a double pendulum simulated from its Modelica model; the pendulum is drawn from the positions of its two links:

```wl
compiled = FunctionCompile[Function[Typed[n, "MachineInteger"], Module[{s = 0., i = 1}, While[i <= n, s += Sin[N[i]]^2; i++]; s]]];
caffeine = MoleculePlot3D[Molecule["caffeine"], ImageSize -> 190];
turning3D[g_] := u |-> Show[g, ViewPoint -> {3 Cos[2 Pi u], 3 Sin[2 Pi u], 1}, SphericalRegion -> True];
pendulumData = SystemModelSimulate["Modelica.Mechanics.MultiBody.Examples.Elementary.DoublePendulum", 6];
links = pendulumData[{"boxBody1.frame_a.r_0[1]", "boxBody1.frame_a.r_0[2]", "boxBody1.frame_b.r_0[1]", "boxBody1.frame_b.r_0[2]", "boxBody2.frame_b.r_0[1]", "boxBody2.frame_b.r_0[2]"}];
reach = CoordinateBounds[Join[{{0, 0}}, Flatten[Table[Partition[Through[links[s]], 2], {s, 0, 6, 0.01}], 1]], Scaled[0.06]];
pendulum[u_] := With[{p = Partition[Through[links[6 u]], 2]},
    Graphics[{GrayLevel[0.8], Line[Table[Through[links[[5 ;; 6]][s]], {s, 0, 6 u, 0.02}]], GrayLevel[0.2], AbsoluteThickness[3], Line[p], red, Disk[#, 0.03] & /@ Rest[p]},
        PlotRange -> reach, ImageSize -> {Automatic, 200}]];
{compiled[10^6], pendulum[0.7]}
```

A priority queue, and code as a tree:

```wl
queue = CreateDataStructure["PriorityQueue"]; Scan[queue["Push", #] &, {3, 1, 4, 1, 5}];
tree = ExpressionTree[Unevaluated[Manipulate[Plot[Sin[a x], {x, 0, 2 Pi}], {a, 1, 5}]]];
{queue, tree}
```

Orion, and a quantum circuit from a framework one PacletInstall away; its summary opens into the circuit's diagram. The framework first:

```wl
PacletInstall["Wolfram/QuantumFramework"]; Needs["Wolfram`QuantumFramework`"]
```

```wl
orion = Entity["Star", #] & /@ {"Betelgeuse", "Rigel", "Bellatrix", "Mintaka", "Alnilam", "Alnitak", "Saiph", "Meissa"};
sky = AstroGraphics[{Yellow, PointSize[0.012], Point /@ orion}, AstroCenter -> Entity["Star", "Alnilam"], AstroRange -> Quantity[25, "AngularDegrees"],
    AstroReferenceFrame -> "Equatorial", AstroBackground -> AstroStyling[{"DarkSky", "ShowConstellations" -> {Entity["Constellation", "Orion"]}}], ImageSize -> 400];
qco = QuantumCircuitOperator[{"H", "CNOT" -> {1, 2}, "CNOT" -> {2, 3}}]; circuit = Show[qco["Diagram"], ImageSize -> 380];
{sky, circuit}
```

One window from 11 to 13.2:

```wl
v11 = NotebookSession[{{46, "In", seeInput}, {46.25, "Out", NetModel["Wolfram ImageIdentify Net V1"][ExampleData[{"TestImage", "Mandrill"}]]},
    {46.5, "In", "EntityRegister[EntityStore[\"Word\" -> <|\"Entities\" -> words|>]]", 0.15}, {46.7, "Out", registered},
    {47, "In", "GeoBubbleChart[ResourceData[\"Fireballs and Bolides\"][All, #Coordinates -> #TotalRadiatedEnergy &]]", 0.25}, {47.35, "Out", fireballs},
    {48.1, "In", "ResourceFunction[\"BirdSay\"][\"Every language starts with a few words.\"]", 0.25}, {48.4, "Out", bird},
    {49, "In", "cf = FunctionCompile[Function[Typed[n, \"MachineInteger\"], Module[{s = 0., i = 1}, While[i <= n, s += Sin[N[i]]^2; i++]; s]]]", 0.25}, {49.3, "Out", compiled},
    {49.7, "In", "MoleculePlot3D[Molecule[\"caffeine\"]]", 0.15}, {49.9, "Out", turning3D[caffeine], 1.6},
    {50.2, "In", "SystemModelSimulate[\"Modelica.Mechanics.MultiBody.Examples.Elementary.DoublePendulum\", 6]", 0.2}, {50.35, "Out", pendulum, 0.65},
    {51, "In", "pq = CreateDataStructure[\"PriorityQueue\"]; Scan[pq[\"Push\", #] &, {3, 1, 4, 1, 5}]; pq", 0.25}, {51.35, "Out", queue},
    {51.9, "In", "ExpressionTree[Unevaluated[Manipulate[Plot[Sin[a x], {x, 0, 2 Pi}], {a, 1, 5}]]]", 0.25}, {52.2, "Out", tree},
    {53, "In", "AstroGraphics[Point /@ orion, AstroCenter -> Entity[\"Star\", \"Alnilam\"], AstroBackground -> AstroStyling[{\"DarkSky\", \"ShowConstellations\" -> {Entity[\"Constellation\", \"Orion\"]}}]]", 0.25},
    {53.3, "Out", sky}, {54, "In", "PacletInstall[\"Wolfram/QuantumFramework\"]", 0.1}, {54.1, "Out", PacletObject["Wolfram/QuantumFramework"]},
    {54.3, "In", "QuantumCircuitOperator[{\"H\", \"CNOT\" -> {1, 2}, \"CNOT\" -> {2, 3}}]", 0.15}, {54.5, "Out", qco}, {54.8, "Replace", circuit}}, {46, 55},
    "Era" -> "BigSur2020", "Title" -> "Untitled-1.nb", "From" -> v10];
GraphicsRow[v11[#, ImageSize -> 400] & /@ {48.9, 50.9, 54.9}]
```

The repositories, as cards dealt down the right:

```wl
repoList = {{"Demonstrations Project", "2007", "interactive ideas, built with Manipulate"}, {"Wolfram Community", "2013", "where users share what they make"},
    {"Data Repository", "2017", "data that computes"}, {"Neural Net Repository", "2018", "trained nets, one NetModel call away"}, {"Function Repository", "2019", "anyone can add a function"}};
repos = {at["repos"], at["repos", 2.2]} -> Function[t, With[{leave = Tween[{at["repos", 1.95], at["repos", 2.2]}, "InCubic"][t]},
    MapIndexed[With[{u = Tween[{#2[[1]] - 1, #2[[1]] - 0.2} / 4 + at["repos"], "OutExpo"][t], x0 = 1250, y = 190 + 92 (#2[[1]] - 1)}, With[{x = x0 + 60 (1 - u)},
        If[u <= 0, {}, CanvasOpacity[u (1 - leave), {CanvasRectangle[{x, y, 590, 78}, Blend[{White, RGBColor["#1F2126"]}, dark[t]], "Radius" -> 6, Opacity -> 0.92],
            CanvasRectangle[{x, y, 6, 78}, red], CanvasText[#1[[1]], {x + 24, y + 34}, CanvasFont["Source Sans 3", 28, 700], fg[t]],
            CanvasText[#1[[2]], {x + 572, y + 34}, CanvasFont["Source Code Pro", 24, 600], red, Alignment -> Right],
            CanvasText[#1[[3]], {x + 24, y + 62}, CanvasFont["Source Sans 3", 20, 400], soft[t]]}]]]] &, repoList]]];
AnimatedGraphics[{Backdrop[paperC], repos}, "Duration" -> 50][48.5, ImageSize -> 480]
```

## Bars 55 to 67: Chat, Dark Mode, and Music

A chat notebook: a question in English, an answer in both languages, and the code run:

```wl
chat = NotebookSession[{{55, "ChatInput", "What are the ten most common words in Alice in Wonderland?", 0.55},
    {55.75, "ChatOutput", "You can count them with WordCounts:", {"Take[WordCounts[ExampleData[{\"Text\", \"AliceInWonderland\"}],", "  IgnoreCase -> True], 10]"}, "WordCounts"},
    {57, "In", "Take[WordCounts[ExampleData[{\"Text\", \"AliceInWonderland\"}], IgnoreCase -> True], 10]", 0.3},
    {57.4, "Out", Take[WordCounts[ExampleData[{"Text", "AliceInWonderland"}], IgnoreCase -> True], 10]}}, {55, 59},
    "Era" -> "BigSur2020", "Title" -> "Chat.nb", "From" -> v11];
chat[58.5, ImageSize -> 480]
```

The language keeps a record of itself. The releases, as a Tabular:

```wl
released = DateObject /@ {{1988, 6, 23}, {1991, 1, 15}, {1996, 9, 3}, {1999, 5, 19}, {2003, 6, 5}, {2007, 5, 1}, {2008, 11, 18}, {2010, 11, 15},
    {2012, 11, 28}, {2014, 7, 9}, {2016, 8, 8}, {2019, 4, 16}, {2021, 12, 13}, {2023, 6, 28}, {2024, 1, 9}, {2026, 6, 16}};
versions = Tabular[Table[<|"version" -> releases[[k, "Label"]], "released" -> released[[k]], "new words" -> Length[releases[[k, "Words"]]],
    "since previous" -> If[k == 1, Missing["NotApplicable"], Round[QuantityMagnitude[DateDifference[released[[k - 1]], released[[k]], "Month"]], 0.1]]|>, {k, Length[releases] - 1}]]
```

Its fastest-growing stretch, in words a month:

```wl
fastest = TakeLargestBy[TransformColumns[versions, "words per month" -> Function[Round[#["new words"] / #["since previous"], 0.1]]], "words per month", 3]
```

Dark mode arrives:

```wl
v14 = NotebookSession[{{59.1, "In", "Tabular[versions]", 0.15}, {59.35, "Out", versions},
    {59.95, "In", "TakeLargestBy[TransformColumns[versions, \"words per month\" -> Function[Round[#[\"new words\"]/#[\"since previous\"], 0.1]]], \"words per month\", 3]", 0.25},
    {60.3, "Out", fastest}}, {59, 61}, "Era" -> "Dark2024", "From" -> chat];
v14[60.9, ImageSize -> 480]
```

And 15.0 learns music. Asked in the chat bar for the melody we are hearing, it writes the bell's phrase as notes, the same notes the score plays, pitch names and lengths:

```wl
pitchName[m_] := {"C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"}[[Mod[m, 12] + 1]] <> ToString[Quotient[m, 12] - 1];
bellNotes = {pitchName[#3], Rationalize[#2 / 4]} & @@@ Join[hook, Take[answer, 8]];
bellScore = MusicScore[MusicNote @@@ bellNotes];
bellCode = "MusicScore[MusicNote @@@ " <> ToString[bellNotes, InputForm] <> "]"
```

As it plays, the score's playhead follows the bell, the way it moves when the score itself is played: its display, a front end panel, drawn with its position set to the second we are hearing:

```wl
scoreAt[score_, sec_] := With[{a = First[ToBoxes[score]], s = N[sec]}, Music`MusicGUI[a["head"], a["midi"], a["inputs"], a["duration"]] /.
    {HoldPattern[Music`MusicVisualizationDump`pos = 0.] :> (Music`MusicVisualizationDump`pos = s),
     HoldPattern[Music`MusicVisualizationDump`playState = "Stopped"] :> (Music`MusicVisualizationDump`playState = "Playing")}];
Magnify[scoreAt[bellScore, 5], 1.5]
```

The window, and then it flies away:

```wl
v15 = NotebookSession[{{62, "In", bellCode, 0.8},
    {62.8, "Out", u |-> Magnify[scoreAt[bellScore, 2 (62.8 + 4.2 u - at["v15"])], 1.5], 4.2}}, {61, 67},
    "Era" -> "BigSur2020", "Title" -> "Soundtrack.nb", "From" -> v14, "ChatBar" -> {61.1, "Write the melody we are hearing as a score", 0.75, 62},
    "Exit" -> "FlyAway", "ExitTime" -> 0.3];
GraphicsRow[v15[#, ImageSize -> 400] & /@ {61.7, 64}]
```

The story from 10 to 15, with prints of the Raspberry Pi, the first chat notebooks and the count of functions by version:

```wl
morePrints = Import /@ <|"pi" -> "https://content.wolfram.com/sites/43/2013/11/wolfram-language-and-mathematica-on-raspberry-pi-1.png",
    "chat" -> "https://content.wolfram.com/sites/43/2023/06/chatbook-hero-v3.png", "v14" -> "https://content.wolfram.com/sites/43/2024/01/sw010724buildingimg1.png"|>;
commas[n_] := ToString[NumberForm[n, DigitBlock -> 3]];
n10 = commas[Length[releases[[10, "Words"]]]];
perMonth = ToString[Max[Normal[fastest[All, "words per month"]]]];
modernStory = {story["Version 10 adds " <> n10 <> " words: the most ever.", {41, 42.8}, n10], story["The Earth, the stars, every country and language.", {42.95, 44.8}],
    story["It even knows about its own words.", {44.9, 45.85}, "own"], story["It learns to see.", {46.05, 46.45}], story["And it takes your words, too.", {46.5, 46.95}],
    story["Now anyone can add words.", {47, 48.9}, "anyone"], story["Compiled, it runs fast.", {49.05, 49.65}], story["Molecules, machines, whole systems.", {49.7, 50.9}],
    story["Data structures, built in.", {51.05, 51.85}], story["Code is an expression too: a tree.", {51.9, 52.9}], story["From the Earth to the stars.", {53.05, 53.95}, "stars"],
    story["Whole frameworks, one install away.", {54, 54.9}], story["Now machines learn to speak it.", {55.25, 56.9}, "machines"],
    story["Natural language for people. Computational language for both.", {57.1, 58.85}], story["It keeps a record of itself.", {59.2, 59.9}],
    story["Its fastest-growing stretch: " <> perMonth <> " new words a month.", {60, 60.85}, perMonth], story["Version 15: it learns music.", {61.25, 63.85}, "music"],
    story["The notes you are hearing, as expressions.", {64, 66.7}],
    entry["GeoGraphics", {41.2, 42.85}], entry["StarData", {43.6, 44.8}], entry["WolframLanguageData", {44.85, 45.85}], entry["NetModel", {46.05, 46.45}],
    entry["EntityStore", {46.5, 46.95}], entry["FunctionCompile", {49, 49.65}], entry["SystemModel", {50.2, 50.9}], entry["CreateDataStructure", {51.05, 51.85}],
    entry["ExpressionTree", {51.9, 52.9}], entry["AstroGraphics", {53.05, 53.95}], entry["PacletInstall", {54, 54.9}], entry["LLMFunction", {55.2, 56.95}],
    entry["MusicNote", {61.2, 66.7}, "Note" -> "symbol \[CenterDot] new in 15.0, 2026", "Usage" -> "MusicNote[p, d] returns a music note with the specified pitch p and duration d."],
    PhotoPrint[morePrints["pi"], "Free on every Raspberry Pi", {40.5, 41.35}, Position -> {1380, 740}, "Size" -> {380, 170}, "Tilt" -> 2, "Kicker" -> "From the archive \[CenterDot] 2013"],
    PhotoPrint[morePrints["chat"], "The 1988 notebook, and a 2023 chat notebook", {57, 58.85}, "Kicker" -> "From the archive \[CenterDot] 2023"],
    PhotoPrint[morePrints["v14"], "Built-in functions by version, 1 to 14", {59.1, 60.85}, Position -> {1250, 200}, "Tilt" -> -1, "Kicker" -> "From the archive \[CenterDot] 2024"]};
```

## Bars 67 to 69: Made by an Agent

The film goes dark for a terminal: an agent, asked for a film about the language, calls the language. The outputs of this notebook fly in beside it:

```wl
thumb[g_] := First[ConformImages[{RemoveAlphaChannel[Rasterize[g, "Image", ImageResolution -> 96, Background -> White], White]}, {360, 280}, "Fit", Padding -> White]];
agents = Module[{a0 = at["agents"], shown, lines, thumbs},
    shown[t_] := Tween[{a0 - 0.1, a0 + 0.1}, "OutExpo"][t] (1 - Tween[{a0 + 1.8, a0 + 2}, "InExpo"][t]);
    lines = {{0.05, "> make a short film about the Wolfram Language", "Prompt"},
        {0.3, "\[FilledCircle] Bash(wolframscript -code 'Length[WolframLanguageData[]]')", "Call"}, {0.45, "  \:2514  " <> commas[Length[lexicon]] <> " symbols \[CenterDot] names, versions, frequencies", "Result"},
        {0.6, "\[FilledCircle] Write(notebook/In1.md)", "Call"}, {0.75, "  \:2514  a film as a list of layers", "Result"},
        {0.9, "\[FilledCircle] Bash(wolframscript -file build.wls)", "Call"}, {1.05, "  \:2514  In1.nb", "Result"},
        {1.2, "\[FilledCircle] Bash(wolframscript -code 'film[\"Video\"]')", "Call"}, {1.35, "  \:2514  1920\[Times]1080 \[CenterDot] 60 fps \[CenterDot] the score and every key", "Result"}};
    thumbs = thumb /@ {Plot3D[Sin[x y], {x, 0, 3}, {y, 0, 3}], ArrayPlot[ca], europeMap, parallelFrame[1], bordersGrowing[1], globe, sky, caffeine, circuit};
    {Backdrop[Function[t, Blend[{Transparent, inkC}, shown[t]]], {a0 - 0.1, a0 + 2}],
     {a0 - 0.1, a0 + 2} -> Function[t, CanvasOpacity[shown[t], {
        MapIndexed[With[{i = #2[[1]] - 1, u = Tween[{a0 + 0.2 + 0.13 (#2[[1]] - 1), a0 + 0.55 + 0.13 (#2[[1]] - 1)}, "OutCubic"][t], j = BlockRandom[RandomReal[{-0.5, 0.5}, 3], RandomSeeding -> #2[[1]]]},
            With[{target = {1260 + 200 Mod[i, 3] + 40 j[[1]], 180 + 190 Floor[i / 3] + 30 j[[2]]}}, If[u <= 0, {},
                CanvasTransform[CanvasTranslate[{2120, target[[2]] + 200} + ({target[[1]], target[[2]]} - {2120, target[[2]] + 200}) u] . CanvasRotate[0.18 j[[3]] (1 - u / 2)],
                    {CanvasRectangle[{-4, -4, 188, 148}, White], CanvasImage[#1, {0, 0, 180, 140}]}]]]] &, thumbs],
        CanvasRectangle[{96, 170, 1060, 660}, RGBColor["#16181C"], "Radius" -> 12], CanvasRectangle[{96, 170, 1060, 660}, RGBColor["#2C3038"], "Radius" -> 12, "Stroke" -> 1.5],
        MapIndexed[CanvasDisk[{120 + 22 (#2[[1]] - 1), 192}, 7, RGBColor[#1]] &, {"#FF5F57", "#FEBC2E", "#28C840"}],
        CanvasText["claude \[LongDash] ~/src/wolfram/WolframFilm", {626, 198}, CanvasFont["Source Code Pro", 17], RGBColor["#8A8F98"], Alignment -> Center],
        Module[{y = 250}, Table[If[t < a0 + l[[1]], Nothing, {CanvasText[TypedText[l[[2]], (t - a0 - l[[1]]) / If[l[[3]] === "Prompt", 0.25, 0.1]], {132, y},
            CanvasFont["Source Code Pro", If[l[[3]] === "Prompt", 28, 24], If[l[[3]] === "Call", 600, 400]],
            RGBColor[Switch[l[[3]], "Prompt", "#EDE9E0", "Call", "#E8A26B", _, "#8FA3B8"]]], y += If[l[[3]] === "Result", 54, 40]}[[1]]], {l, lines}]]}]],
     TitleCard["WOLFRAM AS A TOOL FOR AI \[CenterDot] FEBRUARY 2026", {a0 + 0.2, a0 + 2}, Position -> {96, 110}, Alignment -> Left, FontSize -> 20, FontWeight -> 600, FontColor -> red,
        "Tracking" -> 3, "Enter" -> "Fade", "Exit" -> "Fade", "ExitTime" -> 0.2],
     TitleCard["AIs now call the language as a tool.", {a0 + 0.2, a0 + 2}, Position -> {96, 930}, Alignment -> Left, FontSize -> 60, FontWeight -> 800, FontColor -> boneC,
        "Enter" -> "Fade", "Exit" -> "Fade", "ExitTime" -> 0.2],
     TitleCard["This film was made that way.", {a0 + 1, a0 + 2}, Position -> {96, 1010}, Alignment -> Left, FontSize -> 44, FontWeight -> 400, FontColor -> RGBColor["#FF3B1F"],
        "Enter" -> "Fade", "Exit" -> "Fade", "ExitTime" -> 0.2]}];
AnimatedGraphics[agents, "Duration" -> 69][68.2, ImageSize -> 480]
```

Then Spikey hops to the middle, grows a face, and high-fives Claude, who pops up from below:

```wl
claudeMascot[{cx_, cy_}, px_, raise_, t_] := With[{rows = {"..XXXXXXX..", "..XOXXXOX..", "AAXXXXXXXAA", "..XXXXXXX..", "..X.X.X.X.."}},
    Table[With[{c = StringTake[rows[[r]], {k}]}, If[c === ".", Nothing,
        With[{d = Which[r == 5 && (k == 3 || k == 7) && OddQ[Floor[8 t]], {0, -0.25 px}, c === "A" && k <= 2, {-0.2 px raise, -2.4 px raise}, True, {0, 0}]},
            CanvasRectangle[{cx - 5.5 px + (k - 1) px + d[[1]], cy - 2.5 px + (r - 1) px + d[[2]], px + 0.5, px + 0.5}, If[c === "O", RGBColor["#1B1B1B"], RGBColor["#D97757"]]]]]],
        {r, 5}, {k, 11}]];
spark[{x_, y_}, u_] := If[0 < u < 1, {Table[CanvasLine[{{x, y} + (18 + 60 u) {Cos[a], Sin[a]}, {x, y} + (40 + 120 u) {Cos[a], Sin[a]}}, RGBColor[1, 0.925, 0.667], "Thickness" -> 5 (1 - u), Opacity -> 1 - u], {a, 0, 2 Pi - Pi / 6, Pi / 6}],
    CanvasDisk[{x, y}, 30 (1 - u) + 6, RGBColor[1, 0.957, 0.784], Opacity -> 0.95 (1 - u)]}, {}];
highFive = Module[{t0 = at["agents"], hit = at["agents", 1.25], su, lean, raise, spikeyAt, radius, claudeAt},
    su = Tween[{t0 + 0.15, t0 + 0.55}, "InOutCubic"];
    lean = Function[t, Tween[{hit - 0.25, hit}, "InOutCubic"][t] (1 - Tween[{hit + 0.1, hit + 0.35}, "InOutCubic"][t])];
    raise = Function[t, Tween[{hit - 0.3, hit - 0.05}, {"OutBack", 1.5}][t] (1 - Tween[{hit + 0.3, hit + 0.5}, "InCubic"][t])];
    spikeyAt = Function[t, {1790 - 370 su[t] + 30 lean[t], 930 - 70 su[t] - 120 Sin[Pi su[t]] - If[su[t] >= 1, 14 Abs[Sin[4 Pi (t - t0)]], 0]}];
    radius = Function[t, (50 + 10 su[t]) (1 - Tween[{t0 + 1.8, t0 + 2}, "InCubic"][t])];
    claudeAt = Function[t, {1740 - 30 lean[t], 1180 - 318 Tween[{t0 + 0.5, t0 + 0.75}, {"OutBack", 1.6}][t] - If[t > hit + 0.1, 18 Abs[Sin[8 Pi (t - hit)]], 0]}];
    {Spikey[{t0 + 0.15, t0 + 2}, Position -> spikeyAt, "Radius" -> radius, "Face" -> True, "Raise" -> raise, "Blink" -> (hit < # < hit + 0.06 &),
        "Version" -> 15, "Dance" -> 0.4, "Enter" -> "Cut"],
     {t0 + 0.5, t0 + 2} -> Function[t, CanvasOpacity[1 - Tween[{t0 + 1.8, t0 + 2}, "InCubic"][t], claudeMascot[claudeAt[t], 17, raise[t], t]]],
     {hit, hit + 0.35} -> Function[t, With[{s = spikeyAt[t], r = radius[t], c = claudeAt[t], k = raise[t]},
        spark[(s + r {0.95 + 0.25 k, 0.5 - 1.25 k} + c + 17 {-5 - 0.2 k, -0.5 - 2.4 k}) / 2, (t - hit) / 0.35]]]}];
AnimatedGraphics[{Backdrop[inkC], highFive}, "Duration" -> 69][at["agents", 1.3], ImageSize -> 480]
```

## Bars 69 to 77: The Whole Vocabulary

The numbers the finale states, all computed from the lexicon:

```wl
byFrequency = SortBy[lexicon, -#Frequency &];
questions = Select[byFrequency, StringEndsQ[#Name, "Q"] &][[All, "Name"]];
eponyms = Select[byFrequency, #Eponym &][[All, "Name"]];
longest = Take[SortBy[lexicon, {-StringLength[#Name] &, #Name &}], 6][[All, "Name"]];
averageLength = AssociationThread[releases[[All, "Label"]], N[Mean[StringLength /@ #Words[[All, "Name"]]]] & /@ releases];
<|"words" -> Length[lexicon], "most used" -> byFrequency[[1, "Name"]], "questions" -> Length[questions], "eponyms" -> Length[eponyms], "average letters" -> averageLength[[{1, -1}]]|>
```

The camera starts close on the most used word and pulls out to the whole page; then the words each statement is about stand out, the page dimming around them:

```wl
climaxAt = at["climax"];
focus = wall["Places"][byFrequency[[1, "Name"]]];
camera[t_] := Which[
    in[t, {climaxAt, climaxAt + 4}], With[{z = 1 + 3.2 (1 - Easing["InOutCubic"][(t - climaxAt) / 4])},
        CanvasTranslate[{960, 540}] . CanvasScale[z] . CanvasTranslate[-(focus + ({960, 540} - focus) (1 - (z - 1) / 3.2))]],
    t >= end, CanvasTranslate[{0, 300 Easing["InCubic"][Clip[(t - end) / 1.2]]}],
    True, None];
emphasisSpans = {{2, 4, MemberQ[{"List", "Rule", "Times", "Power", "Set"}, #] &}, {4, 6, StringLength[#] >= 24 &}, {6, 7, StringEndsQ[#, "Q"] &}, {7, 8, MemberQ[eponyms, #] &}};
emphasis[t_] := FirstCase[emphasisSpans, {a_, b_, test_} /; in[t, climaxAt + {a, b}] :>
    {test, Tween[climaxAt + {a, a + 0.3}, "OutCubic"][t] (1 - Tween[climaxAt + {b - 0.2, b}, "Linear"][t])}, None];
wall = WordWall[wallWords, {12, end + 2}, "Presence" -> (Clip[2 (# - climaxAt), {0, 1}] &), "Camera" -> camera, "Emphasis" -> emphasis, wallStyle];
GraphicsRow[AnimatedGraphics[{Backdrop[inkC], wall}, "Duration" -> 84][#, ImageSize -> 400] & /@ {climaxAt + 0.5, climaxAt + 2.5, climaxAt + 6.5}]
```

The words over time, a line through every release: ordinary graphics in their own coordinates, inset into a rectangle of the frame:

```wl
yearOf[d_] := 1986 + QuantityMagnitude[DateDifference[DateObject[{1986, 1, 1}], d, "Year"]];
growthPoints = MapThread[{1680 (yearOf[#1] - 1986) / 42, 780 #2 / Length[lexicon]} &, {released, Accumulate[Length[#Words] & /@ releases]}];
growthCurve = AnimatedGraphics[{climaxAt, climaxAt + 8} -> Function[t, Module[{fade = 1 - 0.81 Tween[climaxAt + {1.8, 2.2}, "InCubic"][t], u, path = {{0, 0}}, k = 1},
    While[k <= Length[growthPoints] && (u = Tween[climaxAt + {k - 2, k - 1} / 8, "OutCubic"][t]) > 0,
        AppendTo[path, path[[-1]] + (growthPoints[[k]] - path[[-1]]) u]; If[u < 1, Break[]]; k++];
    {Opacity[0.15 fade, RGBColor["#FF3B1F"]], AbsoluteThickness[26], Line[path], Opacity[0.3 fade, RGBColor["#FF3B1F"]], AbsoluteThickness[14], Line[path],
     Opacity[fade, RGBColor["#FF3B1F"]], AbsoluteThickness[6], Line[path],
     Table[With[{v = Tween[climaxAt + {k - 1, k - 0.36} / 8, {"OutBack", 3}][t]}, If[v <= 0, Nothing,
        {Opacity[fade, boneC], Disk[growthPoints[[k]], 7 v], Text[Style[releases[[k, "Label"]], 20, Bold, FontFamily -> "Source Code Pro"], growthPoints[[k]] + {0, 18}, {0, -1}]}]],
        {k, Length[growthPoints]}]}]], PlotRange -> {{0, 1680}, {0, 780}}, "Screen" -> {120, 180, 1680, 780}];
AnimatedGraphics[{Backdrop[inkC], growthCurve}, "Duration" -> 84][climaxAt + 1.9, ImageSize -> 480]
```

What it says, in panels on the left, and specimens of real words on the right:

```wl
statement[{t0_, t1_}, big_, small_, hl_ : None] := With[{w = 80 + Max[CanvasTextWidth[big, CanvasFont["Source Sans 3", 64, 800]], CanvasTextWidth[small, CanvasFont["Source Sans 3", 30]]]},
    {{t0, t1} -> Function[t, CanvasRectangle[{70, 180 - 20 (1 - Tween[{t0, t0 + 0.2}, "OutExpo"][t]), w, 250}, inkC, "Radius" -> 6,
        Opacity -> 0.86 Tween[{t0, t0 + 0.2}, "OutExpo"][t] (1 - Tween[{t1 - 0.15, t1}, "InCubic"][t])]],
     TitleCard[big, {t0, t1}, Position -> {110, 300}, Alignment -> Left, FontSize -> 64, FontWeight -> 800, FontColor -> boneC, "Highlight" -> hl, "HighlightColor" -> RGBColor["#FF3B1F"],
        "EnterTime" -> 0.2, "Exit" -> "Fade", "ExitTime" -> 0.15],
     TitleCard[small, {t0, t1}, Position -> {112, 370}, Alignment -> Left, FontSize -> 30, FontWeight -> 400, FontColor -> RGBColor["#B9BBC2"], "EnterTime" -> 0.2, "Exit" -> "Fade", "ExitTime" -> 0.15]}];
card[{t0_, t1_}, title_, body_] := {t0, t1} -> Function[t, With[{u = Tween[{t0 + 0.1, t0 + 0.35}, "OutExpo"][t], dy = 30 (1 - Tween[{t0 + 0.1, t0 + 0.35}, "OutExpo"][t])},
    CanvasOpacity[u (1 - Tween[{t1 - 0.15, t1}, "InCubic"][t]), {CanvasRectangle[{1250, 170 + dy, 590, 740}, inkC, "Radius" -> 8, Opacity -> 0.9],
        CanvasText[ToUpperCase[title], {1286, 226 + dy}, CanvasFont["Source Sans 3", 18, 600], red, "Tracking" -> 3], body[t, {1286, 270 + dy}]}]]];
wordColumns[names_, t0_] := Function[{t, xy}, MapIndexed[CanvasText[#1, xy + {290 Mod[#2[[1]] - 1, 2], 20 + 64 Floor[(#2[[1]] - 1) / 2]}, CanvasFont["Source Code Pro", 22, 600], boneC,
    Opacity -> Tween[{t0, t0 + 0.15} + (#2[[1]] - 1) / 40, "OutCubic"][t]] &, Take[names, UpTo[18]]]];
climax = With[{c = climaxAt, top = Take[byFrequency, 12], avg = Values[averageLength]}, {growthCurve,
    statement[c + {0.05, 1.95}, commas[Length[lexicon]] <> " words.", "There were " <> commas[Length[releases[[1, "Words"]]]] <> " in 1988."],
    statement[c + {2, 3.95}, "Its most common word: " <> top[[1, "Name"]] <> ".", "In English it\[CloseCurlyQuote]s \[OpenCurlyDoubleQuote]the\[CloseCurlyDoubleQuote].", top[[1, "Name"]]],
    statement[c + {4, 5.95}, "Its words grew longer.", "An average new word: " <> ToString[Round[avg[[1]], 0.1]] <> " letters in 1988, " <> ToString[Round[avg[[-1]], 0.1]] <> " in 2026."],
    statement[c + {6, 6.97}, ToString[Length[questions]] <> " words ask a question.", "EvenQ, PrimeQ, StringQ\[Ellipsis] the Q makes it a question.", ToString[Length[questions]]],
    statement[c + {7, 8}, ToString[Length[eponyms]] <> " carry a person\[CloseCurlyQuote]s name.", StringRiffle[Take[eponyms, 4], ", "] <> "\[Ellipsis]", ToString[Length[eponyms]]],
    card[c + {2, 4}, "Most used words", Function[{t, xy}, MapIndexed[With[{k = Tween[c + 2.15 + (#2[[1]] - 1) / 32 + {0, 0.3}, "OutCubic"][t], y = xy[[2]] + 50 (#2[[1]] - 1),
            w = 250 #1["Frequency"] / top[[1, "Frequency"]], hot = #2[[1]] == 1},
        {CanvasText[#1["Name"], {xy[[1]], y + 20}, CanvasFont["Source Code Pro", 22, 600], If[hot, RGBColor["#FF3B1F"], boneC]],
         CanvasRectangle[{xy[[1]] + 250, y + 4, w k, 20}, If[hot, RGBColor["#FF3B1F"], boneC], Opacity -> If[hot, 1, 0.5]],
         CanvasText[ToString[Round[100 #1["Frequency"], 0.1]] <> "%", {xy[[1]] + 258 + w k, y + 21}, CanvasFont["Source Code Pro", 17], RGBColor["#A9ABB2"], Opacity -> k]}] &, top]]],
    card[c + {4, 6}, "Longest words", Function[{t, xy}, {
        MapIndexed[With[{k = Tween[c + 4.15 + (#2[[1]] - 1) / 16 + {0, 0.25}, "OutCubic"][t], y = xy[[2]] + 16 + 44 (#2[[1]] - 1)},
            {CanvasText[#1, {xy[[1]], y}, CanvasFont["Source Code Pro", 17, 600], boneC, Opacity -> k],
             CanvasText[ToString[StringLength[#1]], {xy[[1]] + 510, y}, CanvasFont["Source Code Pro", 17], red, Alignment -> Right, Opacity -> k]}] &, longest],
        CanvasText["AVERAGE LETTERS PER NEW WORD, BY VERSION", xy + {0, 318}, CanvasFont["Source Sans 3", 15, 600], RGBColor["#A9ABB2"], "Tracking" -> 2],
        MapIndexed[With[{k = Tween[c + 4.5 + (#2[[1]] - 1) / 24 + {0, 0.3}, "OutCubic"][t], bw = 510 / Length[avg], i = #2[[1]] - 1, hot = MemberQ[{1, Length[avg]}, #2[[1]]]},
            {CanvasRectangle[{xy[[1]] + i bw + 3, xy[[2]] + 600 - 250 #1 / 18 k, bw - 6, 250 #1 / 18 k}, If[hot, RGBColor["#FF3B1F"], boneC], Opacity -> If[hot, 1, 0.45]],
             CanvasText[Keys[averageLength][[#2[[1]]]], {xy[[1]] + i bw + bw / 2, xy[[2]] + 624}, CanvasFont["Source Code Pro", 12], RGBColor["#A9ABB2"], Alignment -> Center],
             If[hot, CanvasText[ToString[Round[#1, 0.1]], {xy[[1]] + i bw + bw / 2, xy[[2]] + 590 - 250 #1 / 18}, CanvasFont["Source Code Pro", 16, 600], RGBColor["#FF3B1F"],
                Alignment -> Center, Opacity -> k], {}]}] &, avg]}]],
    card[c + {6, 7}, "Words that ask", wordColumns[questions, c + 6.1]],
    card[c + {7, 8}, "Words named after people", wordColumns[eponyms, c + 7.1]]}];
GraphicsRow[AnimatedGraphics[{Backdrop[inkC], climax}, "Duration" -> 84][#, ImageSize -> 400] & /@ (climaxAt + {0.9, 3, 5.5})]
```

## Bars 77 to 84: Still Growing

The page falls away and fades to paper, a fresh notebook deploys the film to the cloud, and the last lines are said; Spikey takes a bow and the film fades to black:

```wl
filmURL = "https://www.wolframcloud.com/obj/wolframinstitute/WolframFilm/In1.mp4";
outro = {Backdrop[ground, {end, end + 2}, Opacity -> Tween[{end, end + 1.2}, "InCubic"]],
    NotebookSession[{{end + 1.6, "In", "CopyFile[\"In1.mp4\", CloudObject[\"WolframFilm/In1.mp4\", Permissions -> \"Public\"]]", 0.6},
        {end + 2.4, "Out", CloudObject[filmURL]}}, {end + 1.4, 84}, "Era" -> "BigSur2020", "Title" -> "Deploy.nb", "Screen" -> {260, 110, 1400, 470}, "EnterTime" -> 0.35, "PushIn" -> 0, "Pulse" -> None],
    TitleCard[commas[Length[lexicon]] <> " words.", {end + 3.75, end + 6.9}, Position -> {960, 720}, FontSize -> 76, FontWeight -> 800, FontColor -> fg, "Enter" -> "Fade", "EnterTime" -> 0.25,
        "Exit" -> "Fade", "ExitTime" -> 0.6],
    TitleCard["Still growing.", {end + 4.25, end + 6.9}, Position -> {960, 810}, FontSize -> 76, FontWeight -> 300, FontColor -> red, "Enter" -> "Fade", "EnterTime" -> 0.25, "Exit" -> "Fade", "ExitTime" -> 0.6],
    TitleCard["THE WOLFRAM LANGUAGE  \[CenterDot]  1988 \[Dash] 2026", {end + 5, end + 6.9}, Position -> {960, 930}, FontSize -> 26, FontWeight -> 600, FontColor -> RGBColor["#8B877F"],
        "Tracking" -> 6, "Enter" -> "Fade", "EnterTime" -> 0.5, "Exit" -> "Fade", "ExitTime" -> 0.6],
    Spikey[{end + 4.5, 84}, Position -> {960, 980}, "Radius" -> 42, "Version" -> 15, "EnterTime" -> 0.4],
    Backdrop[Black, {end + 6.4, 84}, Opacity -> Tween[{end + 6.4, 84}, "Linear"]]};
AnimatedGraphics[{Backdrop[ground, {0, 84}], outro}, "Duration" -> 84][end + 5.8, ImageSize -> 480]
```

## The Film

The instruments across all of it: each era's label, the count of words, and the years, beating with the kick:

```wl
hud = {eraLabel[{12, 16}, "Mathematica 1.0", "June 23, 1988 \[CenterDot] Macintosh"], eraLabel[{16, 20}, "Mathematica 1.0", "1988 \[CenterDot] NeXT"],
    eraLabel[{20, 22}, "Mathematica 2.0", "January 1991 \[CenterDot] Windows 3.1"], eraLabel[{22, 24}, "Mathematica 3.0", "September 1996 \[CenterDot] Windows 95"],
    eraLabel[{24, 26}, "Mathematica 4", "1999 \[Dash] 2002 \[CenterDot] Mac OS 9"], eraLabel[{26, 28}, "Mathematica 5.1", "October 2004 \[CenterDot] Windows XP"],
    eraLabel[{28, 32}, "Mathematica 6.0", "May 2007 \[CenterDot] Mac OS X"], eraLabel[{34, 35}, "Mathematica 7", "November 2008 \[CenterDot] built-in parallel computing"],
    eraLabel[{35, 37}, "Mathematica 8", "November 2010"], eraLabel[{37, 40}, "Mathematica 9", "November 2012"],
    eraLabel[{40.4, 41}, "The Wolfram Language", "Named Nov 2013 \[CenterDot] free on every Raspberry Pi"], eraLabel[{41, 44.85}, "Version 10", "July 2014 \[CenterDot] " <> n10 <> " new words"],
    eraLabel[{44.85, 46}, "Version 10.2", "2015 \[CenterDot] the language describes itself"], eraLabel[{46, 47}, "Version 11", "August 2016"],
    eraLabel[{47, 49}, "The repositories", "Data 2017 \[CenterDot] Neural Nets 2018 \[CenterDot] Functions 2019"], eraLabel[{49, 50.2}, "Version 12", "April 2019"],
    eraLabel[{50.2, 51}, "Version 12", "April 2019 \[CenterDot] SystemModel since 11.3"], eraLabel[{51, 51.9}, "Version 12.1", "March 2020"], eraLabel[{51.9, 53}, "Version 12.3", "May 2021"],
    eraLabel[{53, 54}, "Version 13.2", "December 2022 \[CenterDot] astronomy"], eraLabel[{54, 55}, "Paclet Repository", "March 2023 \[CenterDot] whole frameworks"],
    eraLabel[{55, 59}, "Version 13.3", "June 2023 \[CenterDot] chat notebooks"], eraLabel[{59, 61}, "Version 14", "2024 \[Dash] 2025 \[CenterDot] dark mode arrives in 14.3"],
    eraLabel[{61, 67}, "Version 15", "June 16, 2026"],
    NumberCounter[wordCount, {12, end + 0.5}, "Label" -> "Words in the language", FontColor -> fg, "Exit" -> "Fade", "ExitTime" -> 0.5],
    YearRuler[{{4, 1979.85}, {8, 1981.45}, {8.5, 1986.8}, {12, 1988.47}, {16, 1988.9}, {20, 1991.04}, {22, 1996.67}, {24, 1999.38}, {25, 2002.}, {26, 2004.8},
        {28, 2007.33}, {34, 2008.88}, {35, 2010.87}, {37, 2012.9}, {38.5, 2013.87}, {40.5, 2014.52}, {44.85, 2015.5}, {46, 2016.6}, {47, 2017.3}, {47.75, 2018.45},
        {48.25, 2019.45}, {49, 2019.29}, {51, 2020.2}, {51.9, 2021.38}, {53, 2022.95}, {54, 2023.2}, {55, 2023.49}, {59, 2024.03}, {60, 2025.6}, {61, 2026.46},
        {67, 2026.6}, {77, 2026.75}}, {4, end + 0.5},
        "Marks" -> {{1988.47, "1.0"}, {1991.04, "2.0"}, {1996.67, "3.0"}, {1999.38, "4"}, {2003.5, "5"}, {2007.33, "6.0"}, {2008.88, "7"}, {2010.87, "8"}, {2012.9, "9"},
            {2014.52, "10"}, {2016.6, "11"}, {2019.29, "12"}, {2022.95, "13"}, {2024.03, "14"}, {2026.46, "15"}},
        FontColor -> fg, "Exit" -> "Fade", "ExitTime" -> 0.5]};
```

The edit: the segments stacked in time, a soft backdrop keeping the narration legible over the wall, the window through its eras, the score underneath, and the typing heard, key by key, from everything the film types:

```wl
column = {12, 67} -> Function[t, {CanvasGradient[{1190, 0, 100, 1080}, "Horizontal", ground[t], {{0, 0}, {1, 0.88}}],
    CanvasRectangle[{1290, 0, 630, 1080}, ground[t], Opacity -> 0.88], CanvasGradient[{0, 0, 1920, 170}, "Vertical", ground[t], {{0, 0.9}, {1, 0}}]}];
film = AnimatedGraphics[{coldOpen, smp, paper, y1986, name, wall, column, v1, next, v2, v3, v4, v5, v6, v10, v11, chat, v14, v15, prints, characters, grammar,
    v1Story, nextStory, midStory, lateStory, modernStory, repos, families, breakdown, wlTitle, agents, highFive, climax, outro, hud, score},
    "CyclesPerSecond" -> 1/2, "Foley" -> True, BaseStyle -> {"Pulse" -> kick}]
```

Eighteen moments of it:

```wl
GraphicsGrid[Partition[film[#, ImageSize -> 400] & /@ {3.2, 7.6, 11.3, 13.3, 17, 19.6, 21.8, 23.8, 30.8, 33.6, 36.9, 40.9,
    45.9, 50.9, 58.5, 64, 68.3, 81.8}, 3], ImageSize -> 1200]
```

Render it, frames in parallel, to a file beside this notebook, and store it in the cloud, public, the way the video player's Store in Cloud (Public) does: a CloudObject copy, which the Video then plays from:

```wl
Export["In1.mp4", film];
video = Video[CopyFile["In1.mp4", CloudObject["WolframFilm/In1.mp4", Permissions -> "Public"], OverwriteTarget -> True]]
```

## References

[1] [WAnim](https://github.com/sw1sh/WAnim), the paclet the film is made with

[2] The Wolfram Language's vocabulary: [WolframLanguageData](https://reference.wolfram.com/language/ref/WolframLanguageData.html)

[3] [Summary of New Features in 15.0](https://reference.wolfram.com/language/guide/SummaryOfNewFeaturesIn150.html)

[4] [Stephen Wolfram's scrapbook](https://www.stephenwolfram.com/scrapbook/)

[5] S. Wolfram, ["The Story of Spikey"](https://writings.stephenwolfram.com/2018/12/the-story-of-spikey/) (2018)

[6] S. Wolfram, ["What Is a Computational Essay?"](https://writings.stephenwolfram.com/2017/11/what-is-a-computational-essay/) (2017)
