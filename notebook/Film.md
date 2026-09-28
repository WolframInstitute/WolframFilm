---
Template: ComputationalEssay
Name: "In[1]:= The Life of a Language, Rebuilt in WolfAnim"
Author: Nikolay Murzin
Date: 2026
Description: "The code-rendered Wolfram Language history film, ported from TypeScript to a WolfAnim Timeline whose soundtrack and picture are driven by the same Tracks"
Abstract: "In[1]:= is a 2:48 film about the Wolfram Language told as a natural language gaining words, first rendered by a TypeScript canvas program. This notebook rebuilds its first sixteen bars in Wolfram Language on WolfAnim: every frame is a pure function of the bar, stacked in a Timeline; the era screens are drawn at their true resolution and thresholded to one bit; the soundtrack is a set of WolfAnim Tracks, and the Rule 30 melody Track that you hear is the same object the picture queries to draw the automaton tape beside Spikey. One structure, two renderers."
Keywords: [WolfAnim, Timeline, Track, Rule 30, animation, music, canvas, computational film]
Sources: ["[WolframFilm (TypeScript original)](https://github.com/WolframInstitute/WolframFilm)", "[WolfAnim](https://github.com/sw1sh/WolfAnim)"]
Links: ["[The director's cut](https://claude.ai/artifact/WtXWEDdZMxrMUgBEdiQi4X)", "[The film on the Wolfram Cloud](https://www.wolframcloud.com/obj/wolframinstitute/WolframFilm/In1.mp4)"]
---

## A Film as a Function of Time

The original *In[1]:=* is a TypeScript program: every frame is a pure function of the musical bar, drawn with a canvas and piped to a video encoder. That shape is exactly WolfAnim's: a `Timeline` stacks layers, each a function of time over a span, and renders them live, as stills or as a video. Its soundtrack is a WolfAnim `Track`, a pure function of time that returns note events. So the port is a translation, not a redesign: the canvas scenes become `Canvas*` calls, the score becomes Tracks.

This notebook rebuilds bars 0 to 16: the cold open, the SMP terminal, 1986, the name, and Mathematica 1.0 on a one-bit Macintosh.

WolfAnim supplies the generic machinery (Timeline, the Canvas drawing kit, RasterScreen, Easing, EventTrack, TrackPulse):

```wl
PacletDirectoryLoad[FileNameJoin[{$HomeDirectory, "src", "wolfram", "WolfAnim"}]];
Needs["WolfAnim`"]
```

The film's assets and lexicon live in the WolframFilm repository:

```wl
$FilmRoot = Quiet @ Check[ParentDirectory[NotebookDirectory[]], FileNameJoin[{$HomeDirectory, "src", "wolfram", "WolframFilm"}]]
```

## The Clock

The film runs at 120 BPM with one bar of four beats per WolfAnim cycle, so a cycle lasts two seconds:

```wl
$CyclesPerSecond = 1/2; $BAR = 2.; $BARS = 84; $W = 1920; $H = 1080;
```

Nothing hard-codes a bar except the section map; music and picture both read from it:

```wl
$S = <|"cold" -> {0, 4}, "smp" -> {4, 8}, "y1986" -> {8, 10}, "name" -> {10, 12}, "v1" -> {12, 16}, "next" -> {16, 18},
    "grammar" -> {18, 20}, "v2" -> {20, 22}, "v3" -> {22, 24}, "v4" -> {24, 26}, "v5" -> {26, 28}, "v6" -> {28, 32},
    "families" -> {32, 34}, "v7" -> {34, 35}, "v8" -> {35, 37}, "v9" -> {37, 38}, "breakdown" -> {38, 40}, "v10" -> {40, 46},
    "v11" -> {46, 47}, "repos" -> {47, 49}, "v12" -> {49, 51}, "v123" -> {51, 53}, "v132" -> {53, 55}, "llm" -> {55, 59},
    "v14" -> {59, 61}, "v15" -> {61, 67}, "agents" -> {67, 69}, "climax" -> {69, 77}, "outro" -> {77, 84}|>;
```

Two small readers of the map, plus the clamp-and-normalise every animation uses:

```wl
sec[k_] := $S[k][[1]]; inS[b_, k_String] := $S[k][[1]] <= b < $S[k][[2]]; inS[b_, {a_, c_}] := a <= b < c;
clamp[x_] := Clip[x, {0, 1}]; inv[a_, b_, x_] := clamp[(x - a) / (b - a)];
```

The palette, and a colour blend that accepts hex strings:

```wl
$P = <|"paper" -> "#F4F1EA", "ink" -> "#0E0F11", "red" -> "#DD1100", "redHot" -> "#FF3B1F", "bone" -> "#EDE9E0"|>;
col[c_String] := RGBColor[c]; col[c_] := c;
mix[a_, b_, u_] := Blend[{col[a], col[b]}, clamp[u]];
```

The picture lives on paper until the breakdown flips it to ink, and back for the outro:

```wl
darkness[bar_] := With[{b0 = sec["breakdown"], b1 = $S["breakdown"][[2]], o = sec["outro"]},
    Which[bar < b0, 0, bar < b1, 0.85 Easing["Smooth"][inv[b0 + 0.5, b1, bar]] + If[bar >= b1 - 0.05, 0.15, 0], bar < o, 1,
        True, 1 - Easing["Smooth"][inv[o + 0.5, o + 2, bar]]]];
ground[bar_] := mix[$P["paper"], $P["ink"], darkness[bar]];
```

A stable hash to [0, 1), the same function the TypeScript film uses, so random-looking placements match:

```wl
hash01[x_] := Module[{h = 2166136261},
    Do[h = Mod[BitXor[h, c] 16777619, 2^32], {c, ToCharacterCode[ToString[x]]}];
    h = BitXor[h, BitShiftRight[h, 13]]; h = Mod[h 1540483477, 2^32]; N[BitXor[h, BitShiftRight[h, 15]] / 2^32]];
```

The film's faces, by role:

```wl
$F = <|"sans" -> "Source Sans 3", "code" -> "Source Code Pro", "serif" -> "Source Serif 4", "term" -> "VT323",
    "courier" -> "Courier Prime", "arimo" -> "Arimo", "tinos" -> "Tinos"|>;
font[role_, size_, weight_ : 400, italic_ : False] := CanvasFont[$F[role], size, weight, italic];
```

## The Vocabulary

The lexicon comes from `WolframLanguageData` (up to 14.3) plus the New in 15.0 listing, 6801 words with their versions and usage frequencies:

```wl
$Words = <|"Name" -> #[[1]], "Ver" -> #[[2]], "Freq" -> N[#[[4]]], "Major" -> ToExpression[First @ StringSplit[#[[2]], "."]]|> & /@
    Import[FileNameJoin[{$FilmRoot, "src", "data", "lexicon.json"}], "RawJSON"]["words"];
Length[$Words]
```

Each release stages its new words on one bar, most-used first:

```wl
pick[f_] := SortBy[Select[$Words, f], {-#["Freq"] &, #["Name"] &}];
$Releases = MapThread[<|"Key" -> #1, "Label" -> #2, "Bar" -> #3, "Words" -> pick[#4]|> &, Transpose @ {
    {"v1", "1.0", sec["v1"], #["Major"] == 1 &}, {"v2", "2.0", sec["v2"], #["Major"] == 2 &}, {"v3", "3.0", sec["v3"], #["Major"] == 3 &},
    {"v4", "4", sec["v4"], #["Major"] == 4 &}, {"v5", "5", sec["v5"], #["Major"] == 5 &}, {"v6", "6.0", sec["v6"], #["Major"] == 6 &}}];
Length /@ $Releases[[All, "Words"]]
```

The word counter counts each release up over about one bar:

```wl
wordCountAt[bar_] := Total @ Map[If[bar < #["Bar"], 0, Round[Length[#["Words"]] (1 - (1 - Min[1, (bar - #["Bar"]) / 0.9])^3)]] &, $Releases];
wordCountAt /@ {12, 12.3, 13}
```

## The Lexicon Wall

Behind the window, every word of the language is laid out alphabetically like a dictionary, sized by how often it is actually used:

```wl
wordSize[w_, k_] := k (1 + 11 clamp[(Log10[Max[w["Freq"], 10^-9]] + 7.2) / 6.8]^3.1);
$WallFace = font["sans", 1, 600];
```

Justified dictionary lines at a base size k, returning the placed words and the height they need:

```wl
wallLayout[k_] := Module[{out = {}, line = {}, x = 36, y = 30, maxW = $W - 72, flush},
    flush[justify_] := If[line =!= {}, With[{lh = 1.02 Max[line[[All, "Size"]]], gaps = Length[line] - 1},
        With[{gap = If[justify && gaps > 0, (maxW - Total[line[[All, "Width"]]]) / gaps, 0.9 k]}, Module[{cx = 36},
            out = Join[out, (With[{p = <|#, "X" -> cx, "Y" -> y + 0.8 lh|>}, cx += #["Width"] + gap; p] &) /@ line]]];
        y += lh; line = {}; x = 36]];
    Do[With[{size = wordSize[w, k]}, With[{width = size CanvasTextWidth[w["Name"], $WallFace]},
        If[x + width > 36 + maxW && line =!= {}, flush[True]];
        AppendTo[line, <|"Name" -> w["Name"], "Size" -> size, "Width" -> width, "Appear" -> Infinity|>]; x += width + 0.9 k]],
        {w, SortBy[$Words, {ToLowerCase[StringDelete[#["Name"], "$"]] &, #["Name"] &}]}];
    flush[False]; {out, y + 30}];
```

The largest base size that fits one frame, and each word's arrival on its release bar, most-used first, on sixteenths:

```wl
$Wall = Module[{lo = 2., hi = 12., placed},
    Do[With[{m = (lo + hi) / 2}, If[wallLayout[m][[2]] > $H, hi = m, lo = m]], {18}];
    placed = Association[#["Name"] -> # & /@ First[wallLayout[lo]]];
    Do[MapIndexed[If[KeyExistsQ[placed, #1["Name"]], placed[#1["Name"], "Appear"] =
        r["Bar"] + Round[24 ((#2[[1]] - 1) / Max[1, Length[r["Words"]] - 1])^0.6] / 16.] &, r["Words"]], {r, $Releases}];
    Values[placed]];
Length[$Wall]
```

A word pops in, flashes red and settles to the wall's grey:

```wl
drawWord[p_, age_, presence_, dk_] := Module[{pop = Easing["OutBack", 2.2][inv[0, 0.18, age]], heat = If[age === Infinity, 0, Exp[-1.6 age]], base, s},
    base = If[presence > 0.5, mix["#2A2825", "#D8D4CB", dk], mix["#B9B3A7", "#3A3D44", dk]];
    s = p["Size"] (0.6 + 0.4 pop) (1 + 0.25 heat);
    CanvasText[p["Name"], {p["X"] + p["Width"] (1 - s / p["Size"]) / 2, p["Y"]}, font["sans", Round[4 s] / 4., 600],
        If[heat > 0.02, mix[base, $P["red"], heat], base], Opacity -> clamp[(0.18 + 0.82 presence) pop + 0.9 heat]]];
```

Settled words are rasterized once per half bar; only the words still arriving are drawn as text each frame:

```wl
wallLayer[cutoff_, dk_, presence_] := wallLayer[cutoff, dk, presence] = Rasterize[
    Graphics[CanvasBlock[{$W, $H}, drawWord[#, Infinity, presence, dk] & /@ Select[$Wall, #["Appear"] <= cutoff &]],
        PlotRange -> {{0, $W}, {0, $H}}, ImageSize -> $W, PlotRangePadding -> None, ImagePadding -> None], "Image", Background -> None];
drawWall[bar_, presence_] := With[{dk = Round[darkness[bar], 0.001], cutoff = Floor[2 (bar - 4)] / 2.},
    {If[AnyTrue[$Wall, #["Appear"] <= cutoff &], CanvasImage[wallLayer[cutoff, dk, presence], {0, 0, $W, $H}], {}],
     drawWord[#, bar - #["Appear"], presence, dk] & /@ Select[$Wall, cutoff < #["Appear"] <= bar &]}];
```

When a release lands, its words pop out of the latest output and fly to their places:

```wl
$WallByName = Association[#["Name"] -> # & /@ $Wall];
drawFlight[bar_, {fx_, fy_}, r_, max_ : 80] := Table[With[{p = $WallByName[w["Name"]]}, With[{u = inv[p["Appear"] - 0.35, p["Appear"], bar]},
    If[u <= 0 || u >= 1, Nothing, With[{e = Easing["InOutCubic"][u]},
        CanvasText[p["Name"], {fx + (p["X"] - fx) e, fy + (p["Y"] - fy) e - (120 + 200 hash01[p["Name"]]) Sin[Pi e]},
            font["sans", 14 + (p["Size"] - 14) e, 700], $P["red"], Opacity -> 0.95 Sin[Pi Min[1, 1.2 u]]]]]]], {w, Take[r["Words"], UpTo[max]]}];
```

## The Score as Tracks

The harmony is i-VI-III-VII in A minor, one chord per bar:

```wl
$Chords = {{57, 60, 64}, {57, 60, 65}, {55, 60, 64}, {55, 59, 62}}; $Roots = {45, 41, 48, 43};
chordAt[bar_] := $Chords[[Mod[Floor[bar], 4] + 1]]; rootAt[bar_] := $Roots[[Mod[Floor[bar], 4] + 1]];
```

The melody's source is the centre column of Rule 30 grown from a single cell, kept with six neighbours on each side for the tape:

```wl
$R30Rows = CellularAutomaton[30, {{1}, 0}, {{0, 32 $BARS + 63}, {-6, 6}}];
$R30 = $R30Rows[[All, 7]]; Take[$R30, 16]
```

Four bits per eighth note: three choose a degree of A minor pentatonic, the fourth gates it; downbeats always sound, on the chord root:

```wl
$Penta = {69, 72, 74, 76, 79, 81, 84, 86};
pluckOn[b_] := (b < sec["breakdown"] || inS[b, {sec["v11"], sec["llm"]}] || b >= sec["outro"]) && ! inS[b, {sec["v6"] + 2, sec["v6"] + 4}];
pluckNote[s_] := Which[! pluckOn[s / 8], Missing[], Mod[s, 8] == 0, chordAt[s / 8][[1]] + 12, $R30[[4 s + 4]] == 0, Missing[],
    True, $Penta[[4 $R30[[4 s + 1]] + 2 $R30[[4 s + 2]] + $R30[[4 s + 3]] + 1]]];
```

The pluck line is a genuine query Track: ask it about any span and it computes the notes from the automaton:

```wl
$Rule30Track = Track[Function[span, Table[With[{n = pluckNote[s]}, If[MissingQ[n], Nothing,
    <|"Value" -> n, "Whole" -> {s / 8, (s + 1) / 8}, "Part" -> {Max[span[[1]], s / 8], Min[span[[2]], (s + 1) / 8]}|>]],
    {s, Max[0, Floor[8 span[[1]]]], Min[8 $BARS - 1, Ceiling[8 span[[2]]] - 1]}]], <|"Source" -> "Rule 30 centre column"|>];
#["Value"] & /@ $Rule30Track["Query", 0, 1]
```

The other parts are written out note by note as `EventTrack`s, {onset, duration, value} in bars:

```wl
kickBar[b_] := 12 <= b < sec["outro"] && ! inS[b, "breakdown"];
$Parts = <|
    "pad" -> Flatten[Table[{b, 1, #} & /@ chordAt[b], {b, 4, sec["outro"] - 1}], 1],
    "kick" -> Join[{{8, 1/4, "bd"}, {8.5, 1/4, "bd"}, {9, 1/4, "bd"}, {9.5, 1/4, "bd"}, {10, 1/4, "bd"}, {10.5, 1/4, "bd"}, {11, 1/4, "bd"}, {11.5, 1/4, "bd"}},
        Flatten[Table[If[kickBar[b], {b + q / 4, 1/4, "bd"}, Nothing], {b, 12, sec["outro"] - 1}, {q, 0, 3}], 1]],
    "clap" -> Flatten[Table[If[kickBar[b], {{b + 1/4, 1/4, "cp"}, {b + 3/4, 1/4, "cp"}}, Nothing], {b, 12, sec["outro"] - 1}], 1],
    "hat" -> Table[If[kickBar[Floor[s / 16]] && Mod[s, 4] == 2, {s / 16, 1/16, "hh"}, Nothing], {s, 12 16, 16 sec["outro"] - 1}],
    "bass" -> Table[If[kickBar[Floor[s / 8]] && OddQ[s], {s / 8, 1/8, rootAt[s / 8] + If[Mod[s, 4] == 3, 12, 0]}, Nothing], {s, 96, 8 sec["outro"] - 1}],
    "crash" -> ({#, 2, "cr"} & /@ {12, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 35, 37, 40, 44, 46, 47, 49, 51, 53, 55, 59, 61, 65, 69, 77}),
    "roll" -> Table[{11 + i / 16, 1/16, "sd"}, {i, 0, 13}]|>;
Length /@ $Parts
```

The mix: WolfAnim oscillators for the pitched parts, its drum samples for the rest:

```wl
LoadSamples[FileNameJoin[{ParentDirectory[PacletObject["WolfAnim"]["Location"]], "assets", "samples"}]];
$Score = Track[{Gain[0.3][Synth["Triangle"][$Rule30Track]], Gain[0.19][Synth["Supersaw"][EventTrack[$Parts["pad"]]]],
    Gain[0.28][Synth["Sawtooth"][EventTrack[$Parts["bass"]]]], Gain[0.5][EventTrack[$Parts["kick"]]], Gain[0.28][EventTrack[$Parts["clap"]]],
    Gain[0.17][EventTrack[$Parts["hat"]]], Gain[0.19][EventTrack[$Parts["crash"]]], Gain[0.22][EventTrack[$Parts["roll"]]]}];
```

The first sixteen bars, rendered to audio:

```wl
Audio[$Score, 16]
```

The picture locks to the sound through the same Tracks: kicks make Spikey hop and the window punch:

```wl
$KickTrack = EventTrack[$Parts["kick"]];
kickPulse[bar_, decay_ : 9] := TrackPulse[$KickTrack, decay][bar];
kickPulse /@ {12, 12.05, 12.24}
```

## The Cold Open

The thesis, typed; the last word lights up, then everything collapses into the cursor:

```wl
cursorOn[bar_] := EvenQ[Floor[4 bar]];
coldOpen[bar_] := Module[{line = "Every language starts with a few words.", f = font["code", 64], u = inv[0.5, 2.6, bar], k, full, x, y = $H / 2 + 14},
    full = CanvasTextWidth[line, f]; x = ($W - full) / 2; k = Easing["InExpo"][inv[3.55, 4, bar]];
    {CanvasRectangle[{0, 0, $W, $H}, "#050506"],
     CanvasTransform[CanvasTranslate[{x + full, y}] . CanvasScale[{1 - k, 1 - 0.2 k}] . CanvasTranslate[{-x - full, -y}], {
        CanvasText[TypedText[line, u], {x, y}, f, "#E9E6DF"],
        If[bar > 2.8, CanvasText["words", {x + CanvasTextWidth["Every language starts with a few ", f], y}, f,
            mix["#E9E6DF", $P["redHot"], Easing["OutCubic"][inv[2.8, 3.1, bar]]]], {}]}],
     If[cursorOn[bar] || 0 < u < 1, CanvasRectangle[{x + CanvasTextWidth[TypedText[line, u], f] (1 - k) + 6, y - 52, 30, 64}, $P["redHot"]], {}]}];
```

A frame of the cold open, drawn on its own canvas:

```wl
frame[f_, bar_] := Graphics[CanvasBlock[{$W, $H}, f[bar]], PlotRange -> {{0, $W}, {0, $H}}, ImageSize -> 640, PlotRangePadding -> None, ImagePadding -> None];
frame[coldOpen, 3.2]
```

## SMP, 1979

The SMP session uses its real prompt format, and the plot is the Reference Manual's own example, printed the way SMP printed plots:

```wl
$SMPLines = {{4.1, "#I[1]::  Ex[(a + b)^3]", False}, {4.6, "#O[1]:   a^3 + 3 a^2 b + 3 a b^2 + b^3", True},
    {4.9, "#I[2]::  Graph[Sin[1/x],x,0.02,0.2]", False}, {5.2, "#O[2]:", True}};
```

Stars joined into vertical runs, a bar axis with 0.5 marks, tick values written into an underscore axis:

```wl
$ASCIIPlot = Module[{w = 66, half = 7, rows, rowOf, colOf, prev = None},
    rows = ConstantArray[" ", {2 half + 1, w}]; rowOf[y_] := Clip[Round[half - y half], {0, 2 half}]; colOf[x_] := Round[(x - 0.02) / 0.18 (w - 1)];
    rows[[half + 1]] = ConstantArray["_", w];
    Do[MapIndexed[(rows[[half + 1, colOf[xl[[1]]] + #2[[1]]]] = #1) &, Characters[xl[[2]]]], {xl, {{0.0625, "0.0625"}, {0.125, "0.125"}, {0.1875, "0.1875"}}}];
    rows[[half + 1, 1]] = "0"; Do[If[r != half, rows[[r + 1, 1]] = "|"], {r, 0, 2 half}];
    rows[[rowOf[0.5] + 1, 1 ;; 3]] = Characters["0.5"]; rows[[rowOf[-0.5] + 1, 1 ;; 4]] = Characters["-0.5"];
    Do[With[{r = rowOf[Sin[1 / (0.02 + 0.18 c / (w - 1))]]}, Do[If[MemberQ[{" ", "_"}, rows[[kk + 1, c + 1]]], rows[[kk + 1, c + 1]] = "*"],
        {kk, If[prev === None, r, Min[prev, r]], If[prev === None, r, Max[prev, r]]}]; prev = r], {c, 1, w - 1}];
    StringJoin /@ rows];
Column[$ASCIIPlot, BaseStyle -> {FontFamily -> "Courier", 8}]
```

Phosphor glow, drawn as faint lighter copies around the text:

```wl
glow[s_, p_, f_, c_] := {CanvasOpacity[0.18, Table[CanvasText[s, p + d, f, "#39FF6A"], {d, {{-2, 0}, {2, 0}, {0, -2}, {0, 2}}}]], CanvasText[s, p, f, c]};
```

The terminal powers on, types the session, prints the plot row by row and the caption, then collapses to a line and a dot:

```wl
smp[bar_] := Module[{sx = 150, sy = 70, sw = $W - 300, sh = $H - 190, x0 = 240, y = 160, ph = "#6BFF8E", on, off1, off2},
    on = Easing["OutExpo"][inv[4, 4.18, bar]]; off1 = Easing["InCubic"][inv[7.72, 7.9, bar]]; off2 = Easing["InCubic"][inv[7.9, 8, bar]];
    {CanvasRectangle[{0, 0, $W, $H}, "#0B0C0B"],
     CanvasTransform[CanvasTranslate[{$W / 2, sy + sh / 2}] . CanvasScale[{1 - 0.998 off2, Max[0.002, on (1 - 0.995 off1)]}] . CanvasTranslate[{-$W / 2, -sy - sh / 2}], {
        CanvasRectangle[{sx, sy, sw, sh}, "#081309", "Radius" -> 38],
        Table[If[bar < l[[1]], Nothing, {glow[TypedText[l[[2]], If[l[[3]], 1, inv[l[[1]], l[[1]] + 0.4, bar]]], {x0, y}, font["term", 46],
            If[l[[3]], mix[ph, "#C9FFD6", 0.3], ph]], y += If[l[[3]], 62, 52]}[[1]]], {l, $SMPLines}],
        MapIndexed[If[bar < 5.3 + 0.05 (#2[[1]] - 1), Nothing, CanvasText[#1, {x0 + 40, y + 21 (#2[[1]] - 1)}, font["term", 27], mix[ph, "#C9FFD6", 0.25]]] &, $ASCIIPlot],
        glow[TypedText["NOVEMBER 1979. CALTECH.", inv[6.5, 6.8, bar]], {x0, sy + sh - 150}, font["term", 44], "#B8FFC8"],
        glow[TypedText["A 20-YEAR-OLD PHYSICIST WRITES A LANGUAGE", inv[6.8, 7.25, bar]], {x0, sy + sh - 98}, font["term", 58], "#E6FFEC"],
        glow[TypedText["FOR TALKING TO HIS COMPUTER: SMP.", inv[7.2, 7.55, bar]], {x0, sy + sh - 40}, font["term", 58], "#E6FFEC"],
        If[cursorOn[bar] && bar < 5.3, CanvasRectangle[{x0, y - 40, 26, 46}, ph], {}],
        Table[CanvasRectangle[{sx + 20, yy, sw - 40, 2}, Black, Opacity -> 0.16], {yy, sy + 8, sy + sh - 10, 4}],
        CanvasRectangle[{sx, sy, sw, sh}, "#9CFFB4", "Radius" -> 38, Opacity -> 0.05 + 0.03 hash01[Floor[60 bar]]]}],
     If[bar > 7.9, CanvasDisk[{$W / 2, sy + sh / 2}, 6, "#DFFFE6", Opacity -> 1 - inv[7.95, 8, bar]], {}]}];
frame[smp, 7.6]
```

## 1986, and the Name

He starts again from nothing, and the name arrives one letter per eighth note:

```wl
y1986[bar_] := With[{yu = Easing["OutExpo"][inv[8.05, 8.4, bar]], out = Easing["InExpo"][inv[9.75, 10, bar]]}, {
    CanvasRectangle[{0, 0, $W, $H}, mix["#050506", $P["paper"], Easing["OutCubic"][inv[8, 8.4, bar]]]],
    If[bar < 10, CanvasOpacity[yu (1 - out), {
        CanvasText["1986", {160, 470 - 40 (1 - yu)}, font["sans", 220, 700], $P["red"]],
        CanvasText[TypedText["He starts again, from nothing.", inv[8.35, 8.9, bar]], {170, 580}, font["sans", 60, 600], $P["ink"]],
        CanvasText[TypedText["A language for everything.", inv[8.95, 9.45, bar]], {170, 660}, font["sans", 60, 300], $P["ink"]]}], {}],
    If[bar >= 9.9, nameScene[bar], {}]}];
```

Each letter pops up on its eighth; the whole frame collapses into the drop on bar 12:

```wl
nameScene[bar_] := Module[{word = "Mathematica", f = font["sans", 170, 700], n, x, y = $H / 2 + 40, cx},
    x = ($W - CanvasTextWidth[word, f, -2]) / 2; n = Clip[Floor[8 (bar - 10)] + 1, {0, 11}]; cx = x;
    CanvasTransform[CanvasScale[1 - 0.92 Easing["InExpo"][inv[11.6, 12, bar]], {$W / 2, y - 60}], {
        Table[With[{ch = StringTake[word, {i}], age = bar - 10 - (i - 1) / 8}, {CanvasTransform[
            CanvasTranslate[{cx, y}] . CanvasScale[{1, Easing["OutBack", 2][inv[0, 0.12, age]]}] . CanvasTranslate[{-cx, -y}],
            CanvasText[ch, {cx, y}, f, If[i == n && age < 0.1, $P["red"], $P["ink"]]]], cx += CanvasTextWidth[ch, f] - 2}[[1]]], {i, n}],
        If[n < 11 || EvenQ[Floor[4 bar]], CanvasRectangle[{cx + 8, y - 125, 10, 150}, $P["red"]], {}],
        CanvasText["The name? Steve Jobs suggested it.", {$W / 2, y + 110}, font["sans", 48, 400, True], "#55524C",
            Alignment -> Center, Opacity -> Easing["OutCubic"][inv[10.9, 11.2, bar]]]}]];
frame[y1986, 11.3]
```

## Mathematica 1.0 on a One-Bit Macintosh

The window is drawn at half resolution in the era's own pixels and thresholded to one bit by WolfAnim's `CanvasScreen`. Grey on a one-bit display is a 50% checker:

```wl
checkerImage[w_, h_] := checkerImage[w, h] = ColorConvert[Image[Table[Boole[EvenQ[i + j]], {i, h}, {j, w}], "Bit"], "RGB"];
checker[{x_, y_, w_, h_}] := CanvasImage[checkerImage[Round[w], Round[h]], {x, y, w, h}];
box[r_, fill_, stroke_ : None] := {CanvasRectangle[r, fill], If[stroke === None, {}, CanvasRectangle[r + {0.5, 0.5, -1, -1}, stroke, "Stroke" -> 1]]};
tri[{x_, y_}, s_, dir_] := CanvasPolygon[Switch[dir, "up", {{x, y - s}, {x + s, y + 0.6 s}, {x - s, y + 0.6 s}},
    "down", {{x, y + s}, {x + s, y - 0.6 s}, {x - s, y - 0.6 s}}, "left", {{x - s, y}, {x + 0.6 s, y - s}, {x + 0.6 s, y + s}},
    _, {{x + s, y}, {x - 0.6 s, y - s}, {x - 0.6 s, y + s}}], Black, "Stroke" -> 1];
```

System 6 chrome: the checker desktop, the 1.0 menus, a striped title bar, scroll bars and the grow box:

```wl
mac1Chrome[lw_, lh_, title_] := Module[{x = 14, wx = 12, wy = 30, ww = lw - 26, wh = lh - 40, sbx, sby, sbh, hby, tw, mf = font["arimo", 12, 700]},
    sbx = wx + ww - 16; sby = wy + 18; sbh = wh - 33; hby = wy + wh - 16; tw = CanvasTextWidth[title, mf];
    {checker[{0, 0, lw, lh}], box[{0, 0, lw, 19}, White], box[{0, 19, lw, 1}, Black],
     Table[{CanvasText[m, {x, 14}, mf, Black], x += CanvasTextWidth[m, mf] + 14}[[1]], {m, {"File", "Edit", "Cells", "Search", "Action", "Styles", "Windows"}}],
     box[{wx + 1, wy + 1, ww, wh}, Black], box[{wx, wy, ww, wh}, White, Black], Table[box[{wx + 2, yy, ww - 4, 1}, Black], {yy, wy + 4, wy + 14, 2}],
     box[{wx, wy + 18, ww, 1}, Black], box[{wx + 8, wy + 4, 11, 11}, White, Black], box[{wx + ww - 20, wy + 4, 11, 11}, White, Black],
     box[{wx + ww - 20, wy + 4, 7, 7}, White, Black], box[{wx + ww / 2 - tw / 2 - 7, wy + 2, tw + 14, 15}, White],
     CanvasText[title, {wx + ww / 2, wy + 14}, mf, Black, Alignment -> Center],
     box[{sbx, sby, 16, sbh}, White, Black], checker[{sbx + 1, sby + 16, 14, sbh - 32}], box[{sbx, sby, 16, 16}, White, Black], tri[{sbx + 8, sby + 8}, 4, "up"],
     box[{sbx, sby + sbh - 16, 16, 16}, White, Black], tri[{sbx + 8, sby + sbh - 8}, 4, "down"], box[{sbx, sby + sbh - 34, 16, 16}, White, Black],
     box[{wx, hby, ww - 15, 16}, White, Black], checker[{wx + 17, hby + 1, ww - 49, 14}], box[{wx, hby, 16, 16}, White, Black], tri[{wx + 8, hby + 8}, 4, "left"],
     box[{wx + ww - 32, hby, 16, 16}, White, Black], tri[{wx + ww - 24, hby + 8}, 4, "right"], box[{wx + 17, hby, 16, 16}, White, Black],
     box[{sbx, hby, 16, 16}, White, Black], box[{sbx + 3, hby + 3, 8, 8}, White, Black], box[{sbx + 6, hby + 6, 7, 7}, White, Black]}];
```

The 1.0 notebook style: labels above cells in italics, bold Courier input and output, thin black brackets:

```wl
$NB1 = <|"left" -> 22, "gap" -> 6, "code" -> font["courier", 13, 700], "label" -> font["arimo", 10.5, 400, True]|>;
cellLabel[c_] := If[c["kind"] === "input", "In[" <> ToString[c["n"]] <> "]:=", "Out[" <> ToString[c["n"]] <> "]="];
cellHeight[c_, w_] := If[c["kind"] === "custom", c["h"], 13 1.3 Length[CanvasWrap[c["text"], $NB1["code"], w - 52, "Break" -> "Code"]] + 4] +
    If[KeyExistsQ[c, "n"], 1.5 10.5, 0];
```

One cell: its label, its bracket growing in, and its text, typed on the clock with a caret for inputs:

```wl
drawCell[c_, {x0_, y_}, w_, h_, bar_] := Module[{f = $NB1["code"], lines, shown, yy = y},
    {If[KeyExistsQ[c, "n"], {CanvasText[cellLabel[c], {x0 - 14, y + 11.5}, $NB1["label"], Black], yy += 15.75}[[1]], {}],
     CanvasLine[With[{hh = h Easing["OutExpo"][clamp[(bar - c["at"]) / 0.12]], bx = x0 + w + 16}, {{bx - 4, y - 2}, {bx, y - 2}, {bx, y - 2 + hh}, {bx - 4, y - 2 + hh}}], Black],
     If[c["kind"] === "custom", c["draw"][{x0, yy}, bar],
        lines = CanvasWrap[c["text"], f, w, "Break" -> "Code"];
        shown = If[c["kind"] =!= "input", lines, Module[{n = Floor[clamp[(bar - c["at"]) / c["type"]] StringLength[c["text"]]]},
            Reap[Do[If[n > 0, Sow[StringTake[ln, Min[n, StringLength[ln]]]]; n -= StringLength[ln]], {ln, lines}]][[2]] /. {} -> {{}} // First]];
        {MapIndexed[CanvasText[#1, {x0, yy + 13 (1.05 + 1.3 (#2[[1]] - 1))}, f, Black] &, shown],
         If[c["kind"] === "input" && bar - c["at"] < c["type"] + 0.25 && EvenQ[Floor[8 bar]],
            CanvasRectangle[{x0 + CanvasTextWidth[Last[shown, ""], f] + 1, yy + 1.3 13 Max[0, Length[shown] - 1] + 2, 1.1, 15}, Black], {}]}]}];
```

The notebook: visible cells top to bottom, scrolled so the newest stays in view, gliding when one arrives:

```wl
drawNotebook[{rx_, ry_, rw_, rh_}, cells_, bar_] := Module[{vis = Select[cells, bar >= #["at"] &], hs, scrollFor, scroll, y},
    hs = cellHeight[#, rw] & /@ vis;
    scrollFor[n_] := Max[0, Total[Take[hs, n]] + 6 (n + 3) - rh];
    scroll = If[Length[vis] < 2, scrollFor[Length[vis]], scrollFor[Length[vis] - 1] +
        (scrollFor[Length[vis]] - scrollFor[Length[vis] - 1]) Easing["OutCubic"][inv[vis[[-1]]["at"], vis[[-1]]["at"] + 0.15, bar]]];
    y = ry + 6 - scroll;
    CanvasClip[{rx, ry, rw, rh}, {CanvasRectangle[{rx, ry, rw, rh}, White],
        MapThread[{drawCell[#1, {rx + 22, y}, rw - 52, #2, bar], y += #2 + 6}[[1]] &, {vis, hs}]}]];
```

The Mathematica 1.0 session: `Names`, `Integrate` with its two-dimensional character output, and a dithered `Plot3D`:

```wl
inp[at_, n_, s_, type_] := <|"kind" -> "input", "at" -> at, "n" -> n, "text" -> s, "type" -> type|>;
out[at_, n_, s_] := <|"kind" -> "output", "at" -> at, "n" -> n, "text" -> s|>;
$V1Plot = OrderedDither[Import[FileNameJoin[{$FilmRoot, "assets", "wl", "v1_plot3d.png"}]], {250, 200}];
plotCell[at_] := <|"kind" -> "custom", "at" -> at, "h" -> 206, "draw" -> Function[{p, bar}, CanvasImage[$V1Plot, {p[[1]], p[[2]], 250, 200},
    Opacity -> Easing["OutCubic"][inv[at, at + 0.12, bar]]]]|>;
$V1Cells = {inp[12, 1, "Names[\"*\"]", 0.2],
    out[12.5, 1, "{" <> StringRiffle[Take[SortBy[$Releases[[1, "Words"]][[All, "Name"]], StringDelete[#, "$"] &], 72], ", "] <> ", ...}"],
    inp[13.3, 2, "Integrate[1/(x^3 - 1), x]", 0.2],
    out[13.6, 2, "         1 + 2 x\n  ArcTan[-------]                              2\n         Sqrt[3]     Log[1 - x]   Log[1 + x + x ]\n-(---------------) + ---------- - ---------------\n      Sqrt[3]            3               6"],
    inp[14.05, 3, "Plot3D[Sin[x y], {x, 0, 3}, {y, 0, 3}]", 0.3], plotCell[14.45], out[14.6, 3, "-SurfaceGraphics-"]};
```

The window bursts out of the collapsed name, punches on every kick and pushes in slowly across the era:

```wl
$Screen = {88, 176, 1100, 780};
drawWindow[bar_] := Module[{s, c = {88 + 550, 176 + 390}},
    s = If[bar < 12.25, 0.08 + 0.92 Easing["OutBack", 1.4][inv[12, 12.22, bar]], 1] (1 + 0.006 kickPulse[bar, 12]) (1 + 0.03 Easing["InOutCubic"][inv[12, 16, bar]]);
    CanvasTransform[CanvasScale[s, c], {
        Table[CanvasRectangle[$Screen + {-k, 18 - k / 2, 2 k, k}, Black, Opacity -> 0.04], {k, {2, 6, 12, 20, 30}}],
        CanvasScreen[$Screen, Function[{lw, lh}, {mac1Chrome[lw, lh, "Untitled-1"], drawNotebook[{13, 49, lw - 43, lh - 75}, $V1Cells, Min[bar, 16 - 0.001]]}],
            "Pixel" -> 2, "Depth" -> "Bit"],
        CanvasRectangle[$Screen + {-0.5, -0.5, 1, 1}, Black, "Stroke" -> 1, Opacity -> 0.25]}]];
frame[drawWindow, 13.3]
```

## The Narrator, the Archive and the HUD

The right column tells the story and shows the evidence: captions, dictionary entries with the real usage lines, and prints from the archive:

```wl
$ColX = 1250; $ColW = 590;
$Captions = {<|"at" -> 12.25, "until" -> 13.85, "text" -> "Its first vocabulary: 554 words.", "red" -> {"554"}|>,
    <|"at" -> 14.1, "until" -> 15.85, "text" -> "Words for pictures, too.", "red" -> {}|>};
$Entries = {<|"at" -> 12.3, "until" -> 13.25, "name" -> "Names"|>, <|"at" -> 13.3, "until" -> 13.95, "name" -> "Integrate"|>};
$Usage = Import[FileNameJoin[{$FilmRoot, "src", "data", "usage.json"}], "RawJSON"];
```

A caption arrives word by word on sixteenths, holds, and leaves; highlighted words are red:

```wl
caption[bar_, c_] := Module[{f = font["sans", 52, 600], k = 0, leave = Easing["InCubic"][inv[c["until"], c["until"] + 0.25, bar]]},
    If[bar < c["at"] || bar >= c["until"] + 0.25, {}, MapIndexed[Function[{ln, li}, Module[{cx = $ColX}, Table[
        With[{a = Easing["OutExpo"][inv[c["at"] + k / 16, c["at"] + k / 16 + 0.2, bar]]}, k++;
            {CanvasText[wd, {cx, 720 + 58.24 (li[[1]] - 1) + 22 (1 - a) - 16 leave}, f,
                If[MemberQ[c["red"], StringDelete[wd, "." | "," | ":"]], $P["red"], mix[$P["ink"], $P["bone"], darkness[bar]]], Opacity -> a (1 - leave)],
             cx += CanvasTextWidth[wd <> " ", f]}[[1]]], {wd, StringSplit[ln]}]]], CanvasWrap[c["text"], f, $ColW]]]];
```

A dictionary entry: the headword, its part of speech with the version that coined it, and its usage line:

```wl
entry[bar_, e_] := Module[{x = $ColX, y = 330, u = Easing["OutExpo"][inv[e["at"], e["at"] + 0.3, bar]], dy, lines, df = font["serif", 30]},
    dy = 26 (1 - u); lines = Take[CanvasWrap[StringTrim @ Lookup[$Usage, e["name"], ""], df, $ColW], UpTo[5]];
    If[bar < e["at"] || bar >= e["until"] + 0.25, {}, CanvasOpacity[u (1 - Easing["InCubic"][inv[e["until"], e["until"] + 0.25, bar]]), {
        CanvasRectangle[{x, y - 70 + dy, 64 u, 5}, $P["red"]], CanvasText[e["name"], {x, y + dy}, font["sans", 70, 700], $P["ink"]],
        CanvasText["symbol \[CenterDot] since 1.0, 1988", {x + 2, y + 46 + dy}, font["serif", 30, 400, True], "#6B675F"],
        MapIndexed[CanvasText[#1, {x + 2, y + 110 + 42 (#2[[1]] - 1) + dy}, df, $P["ink"],
            Opacity -> clamp[Length[lines] inv[e["at"] + 0.15, e["at"] + 0.6, bar] - #2[[1]] + 1]] &, lines]}]]];
```

Photos and scans from Stephen Wolfram's archive, pinned like prints with a short caption:

```wl
$Prints = {<|"at" -> 6, "until" -> 7.7, "file" -> "smp-manual-1.jpg", "year" -> "1981", "cap" -> "The SMP manual, Caltech, July 1981", "box" -> {1330, 120, 380, 480, 3}|>,
    <|"at" -> 8.3, "until" -> 9.8, "file" -> "first-code-1986-1.jpg", "year" -> "1986", "cap" -> "The first Mathematica code: the evaluator, Nov 27, 1986", "box" -> {1080, 170, 720, 560, -2}|>,
    <|"at" -> 10.25, "until" -> 11.6, "file" -> "product-names-1987-1.jpg", "year" -> "1987", "cap" -> "Some perhaps possible product names, Aug 1987", "box" -> {1370, 650, 440, 270, 2}|>,
    <|"at" -> 14.1, "until" -> 15.85, "file" -> "v1-box-1.png", "year" -> "1988", "cap" -> "Mathematica 1.0 for the Macintosh", "box" -> {$ColX, 150, $ColW, 420, -1.5}|>};
print[file_] := print[file] = Import[FileNameJoin[{$FilmRoot, "assets", "archive", file}]];
archive[bar_, p_] := Module[{im = print[p["file"]], x, y, bw, bh, tilt, w, h, u},
    {x, y, bw, bh, tilt} = p["box"]; {w, h} = ImageDimensions[im] Min[bw / ImageDimensions[im][[1]], bh / ImageDimensions[im][[2]]];
    u = clamp @ Easing["OutBack", 1.3][inv[p["at"], p["at"] + 0.25, bar]];
    If[bar < p["at"] || bar >= p["until"] + 0.25, {}, CanvasOpacity[u (1 - Easing["InCubic"][inv[p["until"], p["until"] + 0.25, bar]]),
        CanvasTransform[CanvasTranslate[{x + w / 2, y + h / 2 + 40 (1 - u)}] . CanvasRotate[tilt Degree + 0.05 (1 - u)], {
            CanvasRectangle[{-w / 2 - 12, -h / 2 - 2, w + 24, h + 58}, Black, Opacity -> 0.12], CanvasRectangle[{-w / 2 - 12, -h / 2 - 12, w + 24, h + 58}, "#FBFAF6"],
            CanvasImage[im, {-w / 2, -h / 2, w, h}],
            CanvasText["FROM THE ARCHIVE \[CenterDot] " <> p["year"], {-w / 2, h / 2 + 22}, font["sans", 13, 700], $P["red"], "Tracking" -> 2],
            CanvasText[p["cap"], {-w / 2, h / 2 + 40}, font["serif", 16, 400, True], "#3A3833"]}]]]];
```

The HUD: the era label, the count of words in the language, and the year ruler with a tick per release:

```wl
eraLabel[bar_] := If[bar < 12, {}, CanvasOpacity[Easing["OutExpo"][inv[12, 12.3, bar]], {
    CanvasText["JUNE 23, 1988 \[CenterDot] MACINTOSH", {96, 76}, font["sans", 18, 600], $P["red"], "Tracking" -> 3],
    CanvasText["Mathematica 1.0", {96, 124}, font["sans", 46, 700], "#1B1B1B"]}]];
counter[bar_] := CanvasOpacity[clamp[inv[12, 12.3, bar]], {
    CanvasText[ToString @ NumberForm[wordCountAt[bar], DigitBlock -> 3], {$W - 96, 118}, font["sans", 88, 700],
        If[12 <= bar < 12.9, mix["#1B1B1B", $P["red"], 0.85], "#1B1B1B"], Alignment -> Right],
    CanvasText["WORDS IN THE LANGUAGE", {$W - 96, 152}, font["sans", 17, 600], "#7C776E", Alignment -> Right, "Tracking" -> 3]}];
$YearKeys = {{4, 1979.85}, {8, 1981.45}, {8.5, 1986.8}, {12, 1988.47}, {16, 1988.9}};
markerYear[bar_] := Fold[If[bar < #2[[1]], #1, #1 + (#2[[2]] - #1) Easing["OutExpo"][inv[#2[[1]], #2[[1]] + 0.4, bar]]] &, 1979.85, $YearKeys];
ruler[bar_] := Module[{X = 96 + (# - 1978) / 49 ($W - 192) &, y = $H - 54, my = markerYear[bar]}, CanvasOpacity[clamp[inv[4, 4.5, bar]], {
    CanvasLine[{{96, y}, {$W - 96, y}}, "#9A958C", "Thickness" -> 1.5],
    Table[{CanvasLine[{{X[yr], y - 6}, {X[yr], y + 6}}, "#9A958C", "Thickness" -> 1.5], CanvasText[ToString[yr], {X[yr], y + 26}, font["code", 15], "#9A958C", Alignment -> Center]}, {yr, 1980, 2025, 5}],
    CanvasLine[{{X[1979.85], y}, {X[my], y}}, $P["red"], "Thickness" -> 3],
    If[my >= 1988.47, {CanvasDisk[{X[1988.47], y}, 4.5, $P["red"]], CanvasText["1.0", {X[1988.47], y - 14}, font["code", 14, 600], "#1B1B1B", Alignment -> Center, Opacity -> 0.85]}, {}],
    CanvasDisk[{X[my], y}, 8 + 3 kickPulse[bar, 10], $P["red"]]}]];
```

The narrator column stays legible over the wall behind a soft backdrop:

```wl
backdrop[bar_] := {CanvasGradient[{$ColX - 60, 0, 100, $H}, "Horizontal", ground[bar], {{0, 0}, {1, 0.88}}],
    CanvasRectangle[{$ColX + 40, 0, $W - $ColX - 40, $H}, ground[bar], Opacity -> 0.88], CanvasGradient[{0, 0, $W, 170}, "Vertical", ground[bar], {{0, 0.9}, {1, 0}}]};
```

## Spikey and the Rule 30 Tape

Spikey's 1.0 form is a stellated icosahedron: each face raised to a pyramid:

```wl
$Ico = Import[FileNameJoin[{$FilmRoot, "assets", "wl", "polyhedra.json"}], "RawJSON"]["icosahedron"];
spikeyFaces[spike_] := With[{v = N[$Ico["v"]] / Max[Norm /@ N[$Ico["v"]]]}, Flatten[Table[With[{pts = v[[f]], c = Mean[v[[f]]]},
    Table[{pts[[k]], pts[[Mod[k, 3] + 1]], (1.9 + 0.35 spike) Norm[c] Normalize[c]}, {k, 3}]], {f, $Ico["f"]}], 1]];
```

It spins, sways each beat, hops and squashes on every kick, and is shaded in three one-bit tones:

```wl
spikey[bar_, {cx_, cy_}, r_] := Module[{kick = kickPulse[bar, 7], ay = 1.8 bar, ax = 0.45 + 0.15 Sin[1.3 bar], rot, light = Normalize[{-0.5, 0.7, 0.9}]},
    rot[{x_, y_, z_}] := With[{x1 = x Cos[ay] + z Sin[ay], z1 = z Cos[ay] - x Sin[ay]}, {x1, y Cos[ax] - z1 Sin[ax], y Sin[ax] + z1 Cos[ax]}];
    CanvasTransform[CanvasTranslate[{cx, cy - 0.12 r Abs[Sin[4 Pi bar]]}] . CanvasRotate[0.22 Sin[4 Pi bar]] . CanvasScale[{1 + 0.08 kick, 1 - 0.1 kick}],
        Map[With[{lam = clamp[0.25 + 0.75 Max[0, #[[2]] . light]], pts = {r #[[1]], -r #[[2]]} & /@ #[[1]]},
            {CanvasPolygon[pts, Which[lam > 0.66, White, lam > 0.4, GrayLevel[0.54], True, Black]], CanvasPolygon[pts, Black, "Stroke" -> 1.2]}] &,
            SortBy[Select[{#, Normalize[Cross[#[[2]] - #[[1]], #[[3]] - #[[1]]]]} & /@ Map[rot, spikeyFaces[kick], {2}], #[[2, 3]] > -0.05 &], Mean[#[[1, All, 3]]] &]]]];
spikeyMascot[bar_] := If[bar < 12, {}, With[{r = 46 Easing["OutBack", 2][inv[12, 12.3, bar]]}, If[r > 0.5, spikey[bar, {1790, 930}, r], {}]]];
```

The tape is the automaton turned on its side and fed into Spikey: each slice is one row of `CellularAutomaton[30]`, the centre row is the column the pluck Track reads, four cells per eighth note. The note under the read head is asked of `$Rule30Track` itself:

```wl
tape[bar_] := Module[{c = 8, head = 1712, top = 930 - 52, tNow = 32 bar, s = Floor[8 bar], ev, vis},
    vis = clamp[inv[12, 12.25, bar]] (1 - clamp[inv[15.75, 16, bar]]);
    ev = $Rule30Track["Onsets", s / 8, (s + 1) / 8];
    If[vis <= 0, {}, CanvasOpacity[vis, {
        Table[With[{x = head - (t - tNow) c - c, row = $R30Rows[[t + 1]], a = clamp[(head - (t - tNow) c - c - head + 400) / 90]}, {
            Table[If[k == 7 || row[[k]] == 0, Nothing, CanvasRectangle[{x + 1, top + (k - 1) c + 1, 6, 6}, $P["ink"], Opacity -> 0.13 a (1 - Abs[k - 7] / 8)]], {k, 13}],
            With[{on = Floor[t / 4] == s && ev =!= {}}, Which[
                Mod[t, 4] == 3, CanvasDisk[{x + 4, top + 52}, If[row[[7]] == 1, 2.8, 1.6], If[row[[7]] == 1, $P["red"], $P["ink"]], Opacity -> If[row[[7]] == 1, 0.85, 0.12] a],
                row[[7]] == 1, CanvasRectangle[{x + 0.5, top + 48.5, 7, 7}, If[on, $P["redHot"], $P["red"]], Opacity -> a],
                True, CanvasRectangle[{x + 1.5, top + 49.5, 5, 5}, $P["ink"], "Stroke" -> 1, Opacity -> 0.22 a]]]}], {t, Floor[tNow], Floor[tNow] + 50}],
        If[ev =!= {}, CanvasText[{"C", "C\[Sharp]", "D", "D\[Sharp]", "E", "F", "F\[Sharp]", "G", "G\[Sharp]", "A", "A\[Sharp]", "B"}[[Mod[ev[[1, "Value"]], 12] + 1]] <>
            ToString[Floor[ev[[1, "Value"]] / 12] - 1], {head - 16, top - 8}, font["code", 15, 600], $P["redHot"], Alignment -> Center, Opacity -> 1 - 0.6 FractionalPart[8 bar]], {}],
        CanvasRectangle[{head, top - 2, 1.5, 108}, $P["red"], Opacity -> 0.45],
        CanvasText["RULE 30 \[CenterDot] CENTRE COLUMN", {head - 396, top - 8}, font["sans", 11, 600], "#8B877F", "Tracking" -> 2, Opacity -> 0.9]}]]];
frame[{tape[#], spikeyMascot[#]} &, 13.3]
```

## The Timeline

The edit is a stack of layers over spans, scenes first and overlays after, in the TypeScript film's order; the soundtrack is the score Track:

```wl
film = Timeline[{
    Function[bar, CanvasRectangle[{0, 0, $W, $H}, ground[bar]]],
    {0, 4} -> coldOpen, {4, 8} -> smp, {8, 12} -> y1986,
    {12, 84} -> Function[bar, drawWall[bar, 0]], {12, 69} -> backdrop,
    {12, 13.8} -> Function[bar, drawFlight[bar, {88 + 495, 176 + 312}, $Releases[[1]]]],
    {12, 16} -> drawWindow,
    Function[bar, archive[bar, #] & /@ $Prints], tape, spikeyMascot,
    {12, 16} -> Function[bar, {caption[bar, #] & /@ $Captions, entry[bar, #] & /@ $Entries}], eraLabel,
    Function[bar, If[bar < 12, {}, counter[bar]]], ruler},
  "Duration" -> 16, "SecondsPerUnit" -> $BAR, "FrameRate" -> 60, "Soundtrack" -> $Score]
```

Six moments from the first sixteen bars:

```wl
GraphicsGrid[Partition[Show[film["Graphics", #], ImageSize -> 400] & /@ {3.2, 7.6, 9.3, 11.3, 13.3, 15.2}, 2], ImageSize -> 820]
```

## Watching and Rendering

Live, the soundtrack is the master clock: the picture follows the audio stream's true position; click to play, drag to scrub:

```wl
#| eval: false
film["Dynamic", ImageSize -> 960]
```

The video renders its frames in parallel and muxes the soundtrack with ffmpeg:

```wl
#| eval: false
film["Video", FileNameJoin[{$FilmRoot, "out", "film-wl.mp4"}]]
```

## What the Port Does Not Do Yet

These sixteen bars exercise every mechanism the rest of the film needs: layers, era screens at their own resolution, text laid out exactly as a canvas does, the lexicon wall, and a score whose Tracks also drive the picture. What remains is breadth. The other 68 bars and their eras are not here yet: NeXT's four greys, the Windows and Mac OS chrome, dark mode, the finale. The soundtrack uses WolfAnim's oscillators and samples, not the original's synthesized instruments and foley. The phosphor glow and the window shadow are cheap approximations of a canvas blur. And the Russian and Japanese cuts of the original would need the same translation layer here.

## References

[1] The TypeScript original and its director's cut: https://github.com/WolframInstitute/WolframFilm

[2] WolfAnim: https://github.com/sw1sh/WolfAnim

[3] S. Wolfram, "What Is a Computational Essay?" (2017): https://writings.stephenwolfram.com/2017/11/what-is-a-computational-essay/

[4] Wolfram Language documentation, `CellularAutomaton`: https://reference.wolfram.com/language/ref/CellularAutomaton.html
