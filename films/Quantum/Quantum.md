---
Template: ComputationalEssay
Name: "ψ — The Quantum Century"
Author: Nikolay Murzin
Date: 2026
Description: "A film about a hundred years of quantum theory, computed and composed entirely in this notebook with WAnim"
Abstract: "In January 1926 Schrödinger wrote down the equation of a wave that no one had seen: the wave function. This notebook makes a short film about the century since -- the quanta of 1900, the atom's notes, the wave and its clicks, uncertainty, tunneling, entanglement, the world it built and the computers it is building -- in which every picture is solved, sampled or simulated here, and every note is physics too."
Keywords: [WAnim, quantum mechanics, wave function, Schrödinger equation, hydrogen, double slit, entanglement, Wigner function, film, music]
Sources: ["[WAnim](https://github.com/sw1sh/WAnim)", "[Wolfram Quantum Framework](https://resources.wolframcloud.com/PacletRepository/resources/Wolfram/QuantumFramework/)", "[International Year of Quantum Science and Technology](https://quantum2025.org/about-iyq-2025/)"]
Links: ["[What Is a Computational Essay?](https://writings.stephenwolfram.com/2017/11/what-is-a-computational-essay/)"]
---

## The Wave and the Click

Quantum theory has two faces.  The wave function ψ is continuous and smooth, and it evolves without surprises; but whenever anything looks, there is a click -- one dot, one outcome, at random, where the wave was bright.  This film is drawn the same way: its pictures are waves, its rhythm is clicks.

The film is made with WAnim, a film is an AnimatedGraphics, and the discrete quantum systems near the end come from the Wolfram Quantum Framework:

```wl
PacletInstall["WolframInstitute/WAnim"]; PacletInstall["Wolfram/QuantumFramework"];
Needs["WolframInstitute`WAnim`"]; Needs["Wolfram`QuantumFramework`"];
```

The film counts in bars of 120 BPM, two seconds each; these are its sections:

```wl
sections = <|"cold" -> {0, 4}, "planck" -> {4, 8}, "atoms" -> {8, 12}, "rules" -> {12, 16}, "psi" -> {16, 22}, "born" -> {22, 26},
    "uncertainty" -> {26, 30}, "walls" -> {30, 34}, "entangle" -> {34, 38}, "breakdown" -> {38, 40}, "built" -> {40, 48},
    "computing" -> {48, 54}, "decoherence" -> {54, 58}, "chaos" -> {58, 62}, "climax" -> {62, 74}, "outro" -> {74, 81}|>;
at[k_, o_ : 0] := sections[k][[1]] + o;
in[b_, {a_, z_}] := a <= b < z;
in[b_, k_String] := in[b, sections[k]];
inAny[b_, spans_List] := AnyTrue[spans, in[b, #] &];
end = at["outro"]; duration = 81;
```

## Paper and Dark

Before the wave equation the film is ink on paper, as physics was; from January 1926 it is light on dark, where ψ glows:

```wl
{paperC, inkC, boneC, red, blue} = RGBColor /@ {"#F4F1EA", "#0E0F11", "#EDE9E0", "#DD1100", "#58C4DD"};
dark[t_] := Which[t < 15.75, 0, t < 16.25, Easing["InOutCubic"][(t - 15.75) / 0.5], True, 1];
ground = Blend[{paperC, inkC}, dark[#]] &; fg = Blend[{inkC, boneC}, dark[#]] &; soft = Blend[{RGBColor["#6E6A62"], RGBColor["#8E8B84"]}, dark[#]] &;
serif[size_, italic_ : False] := CanvasFont["Source Serif 4", size, 400, italic];
sans[size_, weight_ : 600] := CanvasFont["Source Sans 3", size, weight];
```

A complex number is drawn as physicists draw it: its size as brightness, its phase as hue.  A wave along a line is a ribbon of thin columns, each as tall as |ψ| and coloured by its phase:

```wl
phaseColour[z_, a_ : 1] := Hue[Mod[Arg[z] / (2 Pi), 1], 0.78, 0.35 + 0.65 a];
waveRibbon[zs_List, {x0_, y0_, w_, h_}, scale_, opacity_ : 1] := With[{n = Length[zs]},
    CanvasOpacity[opacity, Table[With[{z = zs[[k]], xa = x0 + w (k - 1) / n, xb = x0 + w k / n},
        If[Abs[z] scale h < 0.5, Nothing, CanvasPolygon[{{xa, y0}, {xb + 0.6, y0}, {xb + 0.6, y0 - h Abs[z] scale}, {xa, y0 - h Abs[z] scale}}, phaseColour[z, Min[1, Abs[z] scale]]]]],
        {k, n}]]];
phaseImage[z_ ? MatrixQ, gamma_ : 0.6] := With[{a = Abs[z] / Max[Abs[z]]},
    ColorConvert[Image[Transpose[{Mod[Arg[z] / (2 Pi), 1], ConstantArray[0.8, Dimensions[z]], a^gamma}, {3, 1, 2}], ColorSpace -> "HSB"], "RGB"]];
```

A free particle, as Schrödinger's equation moves it: a Gaussian packet travelling and spreading, in closed form (ħ = m = 1):

```wl
packet[x_, t_, k_ : 4, a_ : 1, x0_ : 0] := (2 a / Pi)^(1/4) / Sqrt[1 + 2 I a t] Exp[(-a (x - x0)^2 + I k (x - x0) - I k^2 t / 2) / (1 + 2 I a t)];
xs = Subdivide[-6., 18., 360];
AnimatedGraphics[{Backdrop[Black], {0, 2} -> Function[t, waveRibbon[packet[xs, 1.6 t], {160, 760, 1600, 520}, 1, 1]]}, "Duration" -> 2]
```

## The Score

The harmony walks Am, F, Dm, E, and its roots are hydrogen's: the atom's four visible lines, Balmer's series, sound A, D, E and F when Hα is tuned to A.  The Rydberg formula gives their frequencies:

```wl
balmer = Table[1/4 - 1/m^2, {m, 3, 6}];
balmerNm = 1 / (1.0967758 10^7 balmer) 10^9
balmerPitch = N[57 + 12 Log2[balmer / First[balmer]]]
```

The four lines, in tune with the atom, are the chord the film keeps returning to; the progression rounds them to the scale:

```wl
chordAt[b_] := {{57, 60, 64}, {53, 57, 60}, {50, 53, 57}, {52, 56, 59}}[[Mod[Floor[b], 4] + 1]];
rootAt[b_] := {45, 41, 38, 40}[[Mod[Floor[b], 4] + 1]];
rnd[k_] := BlockRandom[SeedRandom[k]; RandomReal[]];
chordAt /@ Range[0, 3]
```

The clicks.  A qubit in an equal superposition, measured on every sixteenth note: the Wolfram Quantum Framework samples the outcomes, so the hats play where the qubit came out 1 -- the Born rule as a groove:

```wl
clicks = BlockRandom[SeedRandom[1926]; Normal[QuantumMeasurementOperator[][QuantumState["Plus"]]["SimulatedMeasurement", 16 duration]] /. QuditName[x_, ___] :> x];
clicks = Flatten[clicks /. {s_String :> ToExpression[s]}];
Take[clicks, 32]
```

Two particles in a Bell state, measured together: each outcome random, the pair always equal.  Kick and clap play on the same random sixteenths:

```wl
pairs = BlockRandom[SeedRandom[1935]; Normal[QuantumMeasurementOperator[{1, 2}][QuantumState["PhiPlus"]]["SimulatedMeasurement", 16 duration]] /. QuditName[x_, ___] :> x];
pairs = pairs /. {s_String :> Characters[s]} /. {d_String :> ToExpression[d]};
Take[pairs, 16]
```

A particle in a box has energies n²; n² mod 7, for n = 1 to 7, is 1, 4, 2, 2, 4, 1, 0 -- a palindrome, as the box's wave returns on itself.  The arpeggio walks the scale by it:

```wl
boxSteps = Mod[Range[7]^2, 7]
scale = {57, 59, 60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77, 79, 81};
```

The drums, the bass, the pad, the arpeggio and the atom's bells.  Four on the floor from 1926 on, out for the breakdown; hats on the qubit's clicks; the entangled pair from 1935; the bass on the root, pumping in the drops:

```wl
drums[b_] := 16 <= b < end && ! in[b, "breakdown"];
drops = {{16, 22}, {40, 48}, {62, 74}};
kick = Track[Append[{#, 1/4, "bd"} & /@ Select[Range[16, end - 1/4, 1/4], drums[Floor[#]] &], {end, 1/4, "bd"}]];
coldKicks = Track[{#, 1/4, "bd", 0.75} & /@ Range[12, 15.5, 1]];
hats = Track[{#, 1/16, "hh", 0.45 + 0.35 rnd[16 #]} & /@ Select[Range[8, end - 1/16, 1/16], (drums[Floor[#]] || in[#, {8, 16}]) && clicks[[16 # + 1]] == 1 &]];
openHats = Track[{#, 1/8, "oh", 0.4} & /@ Select[Range[16, end - 1/16, 1/16], Mod[16 #, 4] == 2 && drums[Floor[#]] && inAny[Floor[#], drops] &]];
claps = Track[{#, 1/4, "cp", 0.8} & /@ Select[Flatten[Table[b + {1/4, 3/4}, {b, 16, end - 1}]], drums[Floor[#]] &]];
pairKick = Track[{#, 1/16, "bd", 0.55} & /@ Select[Range[at["entangle"], end - 1/16, 1/16], drums[Floor[#]] && pairs[[16 # + 1, 1]] == 1 && Mod[16 #, 4] != 0 &]];
pairClap = Track[{#, 1/16, "cp", 0.4} & /@ Select[Range[at["entangle"], end - 1/16, 1/16], drums[Floor[#]] && pairs[[16 # + 1, 2]] == 1 && Mod[16 #, 4] != 0 &]];
bass = Track[Table[With[{b = s / 8}, Which[! drums[Floor[b]], Nothing,
    inAny[Floor[b], drops], If[OddQ[s], {b, 1/8, rootAt[b] + If[Mod[s, 4] == 3, 12, 0], 0.9}, Nothing],
    EvenQ[s], {b, 1/8, rootAt[b], 0.8}, True, Nothing]], {s, 8 16, 8 end - 1}]];
pad = Track[Join[Flatten[Table[{b, 1, #, If[b < 16, 0.5, 0.6]} & /@ chordAt[b], {b, 4, end - 1}], 1], {end, 6, #, 0.85} & /@ Append[chordAt[0], 69]]];
arps = Track[Flatten[Table[With[{deg = boxSteps[[Mod[s, 7] + 1]]}, {s / 16, 1/16, scale[[deg + 1 + 2 Mod[Floor[s / 16], 4]]], 0.35 + 0.25 rnd[s]}],
    {s, 16 at["built"], 16 at["computing"] - 1}], 0]];
atomBells = Track[Join[
    Table[{at["atoms"] + k / 2, 2.5, balmerPitch[[k + 1]] + 12, 0.8}, {k, 0, 3}],
    Table[{at["atoms", 2] + k / 4, 1/4, balmerPitch[[Mod[k, 4] + 1]] + 24, 0.5}, {k, 0, 7}],
    Table[{end + k / 2, 3, balmerPitch[[k + 1]] + 12, 0.7}, {k, 0, 3}]]];
TrackView["Punchcard", "Cycles" -> 1][Track[TrackShift[-34] /@ {kick, hats, pairKick, pairClap}]]
```

The tunes: a hook for the wave function's drop, answered in the climax; the seams: crashes on the sections, risers into the drops:

```wl
hook = {{0, 2, 69}, {2, 1, 72}, {3, 1, 76}, {4, 2, 74}, {6, 2, 72}, {8, 2, 77}, {10, 1, 76}, {11, 1, 74}, {12, 3, 76}, {15, 1, 68}};
phrase[start_, notes_, vel_, k_ : 0] := {start + #1 / 4, #2 / 4, #3 + k, vel} & @@@ notes;
lead = Track[Join[phrase[at["psi", 2], hook, 0.75], phrase[at["climax"], hook, 0.8], phrase[at["climax", 4], hook, 0.8, 5], phrase[at["climax", 8], hook, 0.85, 7]]];
crashes = Track[Join[{{16, 2, "cr", 1}, {40, 2, "cr", 1}, {62, 2, "cr", 1}, {end, 2, "cr", 0.9}}, {at[#], 2, "cr", 0.5} & /@ {"born", "uncertainty", "walls", "entangle", "computing", "decoherence", "chaos"}]];
risers = Track[{{14, 2, 60, 1}, {at["breakdown"], 1.9, 60, 1.1}, {60, 2, 60, 1}}];
rolls = Track[{{15, 1, "sd", 0.8}, {at["breakdown", 1], 0.875, "sd", 1}, {61, 1, "sd", 0.9}}];
impacts = Track[{{16, 2, 60, 1.1}, {40, 2, 60, 1}, {62, 2, 60, 1.2}, {end, 2, 60, 1}}];
```

The music runs through a low-pass that opens with the century: muffled before 1926, opening on the wave equation, closing for the breakdown, and drying out -- losing its reverb -- as the cat decoheres (the mix itself is at the end, with every part):

```wl
musicCutoff[b_] := Which[b < 4, 900, b < 16, 900 + 2600 (b - 4) / 12, in[b, "breakdown"], 600 30^(((b - at["breakdown"]) / 2)^2), True, 18000];
Plot[musicCutoff[b], {b, 0, 81}, ScalingFunctions -> "Log", PlotRange -> All, AxesLabel -> {"bar", "Hz"}]
```


## Bars 0 to 4: One at a Time

Two slits, and particles sent through them one at a time.  Each lands somewhere at random; together they draw the interference of a wave that went through both.  The pattern, and six thousand landing places sampled from it:

```wl
slitIntensity[x_] := Cos[2.6 x]^2 Sinc[0.55 x]^2;
landing = BlockRandom[SeedRandom[1989]; With[{grid = Subdivide[-7., 7., 4000]},
    Transpose[{RandomChoice[slitIntensity /@ grid -> grid, 6000] + RandomReal[{-0.002, 0.002}, 6000], RandomReal[{-1, 1}, 6000] + RandomVariate[NormalDistribution[0, 0.12], 6000]}]]];
Histogram[landing[[All, 1]], 120, Axes -> False, ImageSize -> 400]
```

The first two dozen arrive on sixteenth notes, one click each; then they rain:

```wl
arrival[k_] := If[k <= 24, 0.5 + (k - 1) / 16, 2 + 1.75 ((k - 24) / 5976)^(1/2.2)];
screenRect = {260, 300, 1400, 480};
dotAt[{x_, y_}] := {screenRect[[1]] + screenRect[[3]] (x + 7) / 14, screenRect[[2]] + screenRect[[4]] / 2 + 200 y};
coldOpen = {Backdrop[RGBColor["#050506"], {0, 4}],
    {0, 4} -> Function[t, With[{n = LengthWhile[Range[6000], arrival[#] <= t &]},
        {CanvasRectangle[screenRect, RGBColor[0.1, 0.11, 0.13], "Radius" -> 6],
         Table[CanvasDisk[dotAt[landing[[k]]], If[k <= 24, 4, 1.7], Blend[{White, RGBColor["#9FE6FF"]}, Clip[(t - arrival[k]) 4, {0, 1}]],
            Opacity -> If[k <= 24, 1, 0.75]], {k, n}]}]],
    TitleCard["One particle at a time.", {0.6, 3.85}, Position -> {960, 900}, FontSize -> 54, FontColor -> boneC, "Enter" -> "Fade", "Exit" -> "Fade"]};
clicksCold = Track[Table[{arrival[k], 1/16, "hh", 0.9}, {k, 24}]];
AnimatedGraphics[coldOpen, "Duration" -> 4][3.9, ImageSize -> 480]
```

## Labels and the Ruler

Each moment is labelled like a page of history -- the year and place in red capitals, the idea in large type -- and a ruler of years runs along the bottom:

```wl
eraLabel[{t0_, t1_}, name_, sub_] := {TitleCard[ToUpperCase[sub], {t0, t1}, Position -> {96, 76}, Alignment -> Left, FontSize -> 18, FontWeight -> 600, FontColor -> red, "Tracking" -> 3, "Enter" -> "Fade", "Exit" -> "Cut"],
    TitleCard[name, {t0, t1}, Position -> {96, 124}, Alignment -> Left, FontSize -> 46, FontColor -> fg, "Enter" -> "Fade", "Exit" -> "Cut"]};
say[text_, span_, pos_ : {1250, 300}, hl_ : None, size_ : 52] := CaptionText[text, span, Position -> pos, FontSize -> size, "Highlight" -> hl, FontColor -> fg];
formula[text_, span_, pos_, size_ : 96, colour_ : fg] := TitleCard[text, span, Position -> pos, FontSize -> size, FontWeight -> 400, FontFamily -> "Source Serif 4", FontSlant -> "Italic", FontColor -> colour, "Enter" -> "Fade", "Exit" -> "Fade"];
```

## Bars 4 to 8: 1900, the Quantum

A glowing body's light, by wavelength.  Classical physics predicts the Rayleigh-Jeans curve, which runs to infinity at short wavelengths -- the ultraviolet catastrophe; Planck's law, with its quantum of action, bends down.  The two agree where the wavelength is long (λ in nm, *c*₂ = *hc*/*k*):

```wl
c2 = 1.4388 10^7;
planck[l_, T_] := 1 / (l^5 (Exp[c2 / (l T)] - 1));
rayleigh[l_, T_] := T / (c2 l^4);
LogLogPlot[{planck[l, 5000], rayleigh[l, 5000]}, {l, 100, 5000}, PlotLegends -> {"Planck", "Rayleigh-Jeans"}]
```

Drawn on a sheet: the classical curve first, escaping the frame, then Planck's, over the visible spectrum; beside it a body heating up, its colour the black body's:

```wl
plotRect = {170, 250, 1000, 560};
curvePoints[f_, T_] := With[{peak = planck[2.898 10^6 / T, T]}, Table[{plotRect[[1]] + plotRect[[3]] (l - 100) / 2400, plotRect[[2]] + plotRect[[4]] (1 - 0.85 f[l, T] / peak)}, {l, 100, 2500, 6}]];
planckScene = {Backdrop[ground, {4, 81}],
    {4, 8} -> Function[t, With[{T = 5000, u1 = Clip[(t - 4.4) / 0.9, {0, 1}], u2 = Clip[(t - 5.4) / 1.1, {0, 1}]}, {
        CanvasLine[{{plotRect[[1]], plotRect[[2]] + plotRect[[4]]}, {plotRect[[1]] + plotRect[[3]], plotRect[[2]] + plotRect[[4]]}}, fg[t], "Thickness" -> 2],
        CanvasLine[{{plotRect[[1]], plotRect[[2]]}, {plotRect[[1]], plotRect[[2]] + plotRect[[4]]}}, fg[t], "Thickness" -> 2],
        Table[CanvasRectangle[{plotRect[[1]] + plotRect[[3]] (l - 100) / 2400, plotRect[[2]] + plotRect[[4]] + 8, plotRect[[3]] 5 / 2400 + 0.5, 22}, ColorData["VisibleSpectrum"][l]], {l, 380, 750, 5}],
        CanvasText["wavelength", {plotRect[[1]] + plotRect[[3]] - 150, plotRect[[2]] + plotRect[[4]] + 64}, sans[24, 400], soft[t]],
        CanvasClip[plotRect, {
            CanvasLine[Take[curvePoints[rayleigh, T], Max[2, Round[u1 Length[curvePoints[rayleigh, T]]]]], soft[t], "Thickness" -> 4],
            If[u2 > 0, CanvasLine[Take[curvePoints[planck, T], Max[2, Round[u2 401]]], red, "Thickness" -> 6], {}]}],
        If[u1 > 0.4, CanvasText["classical: infinite", {plotRect[[1]] + 40, plotRect[[2]] + 40}, sans[30], soft[t]], {}],
        If[u2 > 0.5, CanvasText["Planck, 1900", {plotRect[[1]] + 330, plotRect[[2]] + 120}, sans[34], red], {}],
        With[{TT = 1500 + 4500 Clip[(t - 4) / 3.5, {0, 1}]}, {
            CanvasDisk[{1500, 760}, 120, ColorData["BlackBodySpectrum"][TT], Opacity -> 0.25], CanvasDisk[{1500, 760}, 80, ColorData["BlackBodySpectrum"][TT]],
            CanvasText[ToString[Round[TT, 100]] <> " K", {1440, 930}, sans[30], soft[t]]}]}]],
    formula["E = h\[Nu]", {4.8, 8}, {1500, 470}, 150],
    eraLabel[{4, 8}, "The quantum", "1900 \[CenterDot] Max Planck \[CenterDot] Berlin"]};
AnimatedGraphics[planckScene, "Duration" -> 8][7.5, ImageSize -> 480]
```

## Bars 8 to 12: 1913, the Atom's Notes

Hydrogen glows at four visible wavelengths and no others.  Bohr's atom explains them: the electron keeps to orbits of radius ∝ *n*², and each line is a fall from an outer orbit to the second.  The lines appear as they sound, the atom's chord:

```wl
nmColour[l_] := ColorData["VisibleSpectrum"][l];
stripRect = {170, 720, 1580, 120};
lineX[l_] := stripRect[[1]] + stripRect[[3]] (l - 380) / 340;
bohrCentre = {470, 400}; orbitR[n_] := 9 n^2;
fallAt[k_] := at["atoms"] + k / 2;
atomScene = {
    {8, 12} -> Function[t, {
        CanvasRectangle[stripRect, RGBColor[0.07, 0.07, 0.08], "Radius" -> 4],
        Table[CanvasRectangle[{lineX[l], stripRect[[2]], stripRect[[3]] 3 / 340 + 0.5, stripRect[[4]]}, nmColour[l], Opacity -> 0.13], {l, 380, 720, 3}],
        Table[With[{l = balmerNm[[k + 1]], u = Clip[(t - fallAt[k]) / 0.12, {0, 1}]}, If[u > 0, {
            CanvasRectangle[{lineX[l] - 4, stripRect[[2]], 8, stripRect[[4]]}, nmColour[l], Opacity -> u],
            CanvasRectangle[{lineX[l] - 14, stripRect[[2]], 28, stripRect[[4]]}, nmColour[l], Opacity -> 0.25 u],
            CanvasText["H" <> {"\[Alpha]", "\[Beta]", "\[Gamma]", "\[Delta]"}[[k + 1]] <> "  " <> ToString[Round[l]] <> " nm", {lineX[l] - 50, stripRect[[2]] + stripRect[[4]] + 46 + If[k == 3, 34, 0]}, sans[26], fg[t], Opacity -> u]}, {}]], {k, 0, 3}],
        Table[CanvasDisk[bohrCentre, orbitR[n], soft[t], "Stroke" -> 1.5, Opacity -> 0.6], {n, 1, 6}],
        CanvasDisk[bohrCentre, 9, red],
        (* the electron falls from orbit k + 3 to orbit 2 at each line's moment *)
        With[{k = Clip[Floor[2 (t - 8)], {0, 3}]}, With[{u = Clip[(t - fallAt[k]) / 0.35, {0, 1}], m = k + 3},
            With[{r = orbitR[m] + (orbitR[2] - orbitR[m]) Easing["InOutCubic"][u], ang = 5 t}, {
                CanvasDisk[bohrCentre + r {Cos[ang], Sin[ang]}, 9, fg[t]],
                If[0 < u < 1, CanvasLine[Table[bohrCentre + (r + 40 + 260 u + s) {Cos[ang], Sin[ang]} + 8 Sin[s / 6] {-Sin[ang], Cos[ang]}, {s, 0, 120, 4}], nmColour[balmerNm[[k + 1]]], "Thickness" -> 4], {}]}]]]}],
    formula["1/\[Lambda] = R (1/2² \[Minus] 1/n²)", {8.5, 12}, {1350, 380}, 72],
    say["Atoms only sing certain notes.", {9.5, 12}, {1100, 520}, "notes"],
    eraLabel[{8, 12}, "The atom\[CloseCurlyQuote]s notes", "1913 \[CenterDot] Niels Bohr \[CenterDot] Copenhagen"]};
AnimatedGraphics[{Backdrop[paperC], atomScene}, "Duration" -> 12][11.5, ImageSize -> 480]
```

## Bars 12 to 16: Strange Rules

Silver atoms through a magnet split into exactly two beams -- up or down, nothing between (Stern and Gerlach, 1922).  The classical expectation, a smear, is drawn faintly behind:

```wl
sgAtoms = BlockRandom[SeedRandom[1922]; Table[{12 + RandomReal[{0, 1.3}], RandomChoice[{-1, 1}], RandomVariate[NormalDistribution[0, 14]]}, {160}]];
sgPath[{start_, side_, jitter_}, t_] := With[{u = (t - start) / 0.45}, Which[u < 0, None, u <= 1,
    With[{x = 300 + 1200 u}, {x, 540 + jitter + If[x < 820, 0, side 120 ((x - 820) / 680)^2]}], True, {1500 - Abs[jitter] / 3, 540 + jitter + side 120}]];
sgScene = {
    {12, 14} -> Function[t, {
        CanvasRectangle[{1500, 340, 14, 400}, fg[t]],
        CanvasRectangle[{1514, 420, 40, 240}, soft[t], Opacity -> 0.18],
        CanvasPolygon[{{820, 470}, {1020, 470}, {980, 520}, {860, 520}}, soft[t]], CanvasRectangle[{820, 570, 200, 60}, soft[t]],
        CanvasText["N", {905, 505}, sans[28], paperC], CanvasText["S", {908, 612}, sans[28], paperC],
        CanvasDisk[{290, 540}, 16, fg[t]],
        Table[With[{p = sgPath[a, t]}, If[p === None, {}, CanvasDisk[p, 5, If[a[[2]] > 0, red, blue]]]], {a, sgAtoms}]}],
    say["Up or down. Nothing between.", {12.3, 14}, {1050, 830}, "Nothing"],
    eraLabel[{12, 14}, "Two answers", "1922 \[CenterDot] Stern and Gerlach \[CenterDot] Frankfurt"]};
AnimatedGraphics[{Backdrop[paperC], sgScene}, "Duration" -> 14][13.6, ImageSize -> 480]
```

Then de Broglie's matter waves, a particle that is also a wave, λ = *h*/*p*; and Heisenberg's matrices.  On Helgoland in June 1925 he found that position and momentum must be arrays that do not commute.  Truncated to the first rows of the harmonic oscillator, *X P* − *P X* is *i* down the diagonal (ħ = 1):

```wl
nmax = 6;
aOp = SparseArray[{i_, j_} /; j == i + 1 :> Sqrt[i], {nmax, nmax}];
X = (aOp + Transpose[aOp]) / Sqrt[2]; P = I (Transpose[aOp] - aOp) / Sqrt[2];
(X . P - P . X)[[;; 4, ;; 4]] // MatrixForm
```

```wl
decimal[x_] := If[Round[x] == x, ToString[Round[x]], TextString[Round[x, 0.01]]];
showNumber[z_] := With[{re = Re[N[z]], im = Im[N[z]]}, Which[Abs[re] < 0.005 && Abs[im] < 0.005, "0", Abs[im] < 0.005, decimal[re], Abs[re] < 0.005, If[Abs[im - 1] < 0.005, "i", decimal[im] <> "i"], True, decimal[re] <> "+" <> decimal[im] <> "i"]];
heisenbergScene = {
    {14, 15} -> Function[t, {waveRibbon[packet[xs, 2 (t - 14), 6, 1.5, -2], {200, 640, 1500, 300}, 1.2, Clip[(t - 14) 6, {0, 1}]],
        CanvasDisk[{560 + 1300 (t - 14) / 1, 640 - 210}, 10, fg[t], Opacity -> Clip[1 - 6 (t - 14), {0, 1}]]}],
    formula["\[Lambda] = h / p", {14, 15}, {960, 330}, 110],
    eraLabel[{14, 15}, "Matter is a wave", "1924 \[CenterDot] Louis de Broglie \[CenterDot] Paris"],
    {15, 16} -> Function[t, With[{u = Clip[(t - 15) 3, {0, 1}]}, {
        CanvasText["X P", {170, 350}, serif[56, True], fg[t]], CanvasText["P X", {820, 350}, serif[56, True], fg[t]],
        CanvasOpacity[u, {Table[CanvasText[showNumber[(X . P)[[i, j]]], {170 + 150 (j - 1), 440 + 60 (i - 1)}, CanvasFont["Source Code Pro", 30, 400], fg[t]], {i, 4}, {j, 4}],
            Table[CanvasText[showNumber[(P . X)[[i, j]]], {820 + 150 (j - 1), 440 + 60 (i - 1)}, CanvasFont["Source Code Pro", 30, 400], fg[t]], {i, 4}, {j, 4}]}]}]],
    formula["pq \[Minus] qp = h/2\[Pi]i", {15.3, 16}, {1520, 520}, 84, red],
    eraLabel[{15, 16}, "What does not commute", "June 1925 \[CenterDot] Werner Heisenberg \[CenterDot] Helgoland"]};
AnimatedGraphics[{Backdrop[paperC], heisenbergScene}, "Duration" -> 16][15.8, ImageSize -> 480]
```

## Bars 16 to 22: 1926, ψ

The equation, as Schrödinger first printed it in *Annalen der Physik* -- received 27 January 1926, a hundred years ago:

```wl
schrodinger = {formula["\[CapitalDelta]\[Psi] + (8\[Pi]²m / h²) (E \[Minus] V) \[Psi] = 0", {16.1, 17.4}, {960, 470}, 104, boneC],
    TitleCard["Annalen der Physik \[CenterDot] received 27 January 1926", {16.4, 17.4}, Position -> {960, 600}, FontSize -> 30, FontWeight -> 400, FontColor -> RGBColor["#8E8B84"], "Enter" -> "Fade", "Exit" -> "Fade"],
    TitleCard["100 years", {16.25, 17.35}, Position -> {960, 820}, FontSize -> 64, FontWeight -> 700, FontColor -> red, "Tracking" -> 6, "Enter" -> "Rise", "Exit" -> "Fade"],
    eraLabel[{16, 22}, "\[Psi]", "1926 \[CenterDot] Erwin Schr\[ODoubleDot]dinger \[CenterDot] Z\[UDoubleDot]rich"]};
```

ψ itself: a packet of possibility, travelling and spreading as the equation says -- its phase turning through the colours as it goes:

```wl
psiScene = {{17.4, 19} -> Function[t, With[{u = t - 17.4}, {
        CanvasLine[{{160, 760}, {1760, 760}}, RGBColor[0.3, 0.3, 0.32], "Thickness" -> 2],
        waveRibbon[packet[xs, 2.2 u, 4, 1], {160, 760, 1600, 520}, 1, Clip[4 u, {0, 1}]]}]],
    say["A wave of possibility.", {17.6, 19}, {1180, 240}, "possibility"]};
AnimatedGraphics[{Backdrop[inkC], psiScene}, "Duration" -> 19][18.5, ImageSize -> 480]
```

Bound, it can only stand: the harmonic oscillator's standing waves, each on its energy, each turning its phase at its own frequency, *E* = (*n* + ½)ħω.  These are the bass's even steps:

```wl
oscillator[n_, x_] := 1 / Sqrt[2^n n! Sqrt[Pi]] HermiteH[n, x] Exp[-x^2 / 2];
oxs = Subdivide[-5., 5., 220];
oscillatorScene = {{19, 20.5} -> Function[t, With[{u = t - 19}, {
        CanvasLine[Table[{960 + 120 x, 900 - 120 x^2 / 2 0.95}, {x, -4.2, 4.2, 0.1}], RGBColor[0.4, 0.4, 0.42], "Thickness" -> 3],
        Table[With[{lvl = 900 - 120 (n + 1/2) 0.95}, {CanvasLine[{{360, lvl}, {1560, lvl}}, RGBColor[0.25, 0.25, 0.27], "Thickness" -> 1],
            waveRibbon[oscillator[n, oxs] Exp[-I (n + 1/2) 9 u], {360, lvl, 1200, 100}, 1.4, Clip[6 u - n / 2, {0, 1}]]}], {n, 0, 5}]}]],
    say["Bound, it can only stand.", {19.2, 20.5}, {1250, 170}, "stand"]};
AnimatedGraphics[{Backdrop[inkC], oscillatorScene}, "Duration" -> 21][20.2, ImageSize -> 480]
```

And in the atom, its standing waves are the orbitals.  A slice through each (*n*, *l*, *m*) of hydrogen, phase as colour -- the two signs of a real orbital are red and cyan:

```wl
hydrogen[n_, l_, m_, x_, z_] := With[{r = Sqrt[x^2 + z^2] + 10^-9}, (2 r / n)^l Exp[-r / n] LaguerreL[n - l - 1, 2 l + 1, 2 r / n] Re[SphericalHarmonicY[l, m, ArcCos[z / r], 0]]];
orbitalList = {{1, 0, 0}, {2, 0, 0}, {2, 1, 0}, {3, 1, 0}, {3, 2, 0}, {3, 2, 1}, {4, 2, 0}, {4, 3, 0}, {4, 3, 1}, {4, 3, 2}, {5, 3, 1}, {5, 4, 2}};
orbitalName[{n_, l_, m_}] := ToString[n] <> {"s", "p", "d", "f", "g"}[[l + 1]] <> If[l > 0, " m=" <> ToString[m], ""];
orbitalImage[{n_, l_, m_}, px_ : 260] := With[{ext = 2.2 n^2 + 4}, phaseImage[N @ Table[hydrogen[n, l, m, x, z] + 0. I, {z, ext, -ext, -2 ext / (px - 1)}, {x, -ext, ext, 2 ext / (px - 1)}], 0.5]];
orbitals = orbitalImage /@ orbitalList;
GraphicsGrid[Partition[orbitals, 6], ImageSize -> 900]
```

```wl
orbitalScene = {{20.5, 22} -> Function[t, Table[With[{u = Clip[(t - 20.5 - (k - 1) / 16) 6, {0, 1}], col = Mod[k - 1, 6], row = Quotient[k - 1, 6]}, If[u <= 0, {},
        {CanvasImage[orbitals[[k]], {210 + 255 col, 250 + 300 row, 240, 240}, Opacity -> u],
         CanvasText[orbitalName[orbitalList[[k]]], {215 + 255 col, 520 + 300 row}, sans[24, 400], RGBColor["#8E8B84"], Opacity -> u]}]], {k, Length[orbitals]}]],
    say["In the atom, the waves are orbitals.", {20.6, 22}, {1250, 900}, "orbitals", 44]};
AnimatedGraphics[{Backdrop[inkC], orbitalScene}, "Duration" -> 22][21.9, ImageSize -> 480]
```

## Bars 22 to 26: 1926, Born

Max Born, June 1926: |ψ|² is a probability.  Where the wave is bright, the click is likely.  Four thousand electrons measured in one orbital, each landing at random where |ψ|² says, building its picture dot by dot:

```wl
bornOrbital = {4, 3, 1}; bornPx = 400; bornExt = 2.2 4^2 + 4;
bornDensity = N @ Table[hydrogen[4, 3, 1, x, z]^2, {z, bornExt, -bornExt, -2 bornExt / (bornPx - 1)}, {x, -bornExt, bornExt, 2 bornExt / (bornPx - 1)}];
bornDots = BlockRandom[SeedRandom[1926]; With[{cells = RandomChoice[Flatten[bornDensity] -> Range[bornPx^2], 4000]},
    ({Mod[# - 1, bornPx], Quotient[# - 1, bornPx]} + RandomReal[{0, 1}, 2]) & /@ cells]];
bornArrival[k_] := at["born"] + 0.25 + 3.5 (k / 4000)^0.7;
bornScene = {{22, 26} -> Function[t, With[{n = LengthWhile[Range[4000], bornArrival[#] <= t &]}, {
        CanvasImage[orbitals[[9]], {200, 160, 780, 780}, Opacity -> 0.1],
        Table[CanvasDisk[{200, 160} + 780 bornDots[[k]] / bornPx, 2.2, RGBColor["#9FE6FF"], Opacity -> 0.8], {k, n}]}]],
    formula["P = |\[Psi]|²", {22.2, 26}, {1450, 380}, 120, boneC],
    say["The wave says where the click is likely.", {22.6, 26}, {1180, 560}, "click"],
    eraLabel[{22, 26}, "Chance", "June 1926 \[CenterDot] Max Born \[CenterDot] G\[ODoubleDot]ttingen"]};
AnimatedGraphics[{Backdrop[inkC], bornScene}, "Duration" -> 26][25.5, ImageSize -> 480]
```

## Bars 26 to 30: 1927, Uncertainty

A packet squeezed in position spreads in momentum: the two are Fourier transforms of each other, and their widths can never both be small, Δ*x* Δ*p* ≥ ħ/2:

```wl
pxs = Subdivide[-6., 6., 240];
squeeze[t_] := 0.35 + 0.28 (1 + Sin[Pi (t - at["uncertainty"])]);
uncertaintyScene = {{26, 28.6} -> Function[t, With[{s = squeeze[t]}, {
        CanvasText["position", {250, 330}, sans[30], RGBColor["#8E8B84"]], CanvasText["momentum", {1030, 330}, sans[30], RGBColor["#8E8B84"]],
        CanvasLine[{{200, 760}, {860, 760}}, RGBColor[0.3, 0.3, 0.32], "Thickness" -> 2], CanvasLine[{{980, 760}, {1640, 760}}, RGBColor[0.3, 0.3, 0.32], "Thickness" -> 2],
        waveRibbon[Exp[-pxs^2 / (4 s^2) + 3 I pxs] / Sqrt[s], {200, 760, 660, 330}, 0.75, 1],
        waveRibbon[Exp[-pxs^2 s^2 - 0.5 I pxs] Sqrt[s] 1.4, {980, 760, 660, 330}, 0.75, 1]}]],
    formula["\[CapitalDelta]x \[CapitalDelta]p \[GreaterEqual] \[HBar]/2", {26.2, 28.6}, {1500, 470}, 96, boneC],
    say["Pin it down here, and it spreads there.", {26.4, 28.6}, {1180, 860}, "spreads"],
    eraLabel[{26, 28.6}, "Uncertainty", "1927 \[CenterDot] Werner Heisenberg \[CenterDot] Copenhagen"]};
AnimatedGraphics[{Backdrop[inkC], uncertaintyScene}, "Duration" -> 29][27.4, ImageSize -> 480]
```

## Bars 30 to 34: 1928, Through Walls

A packet runs at a barrier higher than its energy.  Classically it bounces; quantum mechanically part of it leaks through -- Gamow's explanation of alpha decay.  Schrödinger's equation, solved step by step by the split-step Fourier method:

```wl
tunnel = Module[{n = 1024, xg = Subdivide[-40., 60., 1023], dx, kg, V, psi, dt = 0.02, frames = {}},
    dx = xg[[2]] - xg[[1]]; kg = 2. Pi Join[Range[0, n / 2 - 1], Range[-n / 2, -1]] / (n dx);
    V = If[0 <= # <= 1.2, 2.4, 0.] & /@ xg;
    psi = packet[xg, 0, 2, 0.035, -16];
    Do[If[Mod[step, 8] == 0, AppendTo[frames, psi]];
        psi = Exp[-I V dt / 2] psi; psi = InverseFourier[Exp[-I kg^2 dt / 2] Fourier[psi]]; psi = Exp[-I V dt / 2] psi, {step, 0, 1039}];
    <|"x" -> xg, "V" -> V, "Frames" -> frames|>];
Length[tunnel["Frames"]]
```

```wl
tunnelView = {150, 700}; barrierX = 120 + 1680 (Position[tunnel["x"], _?(# >= 0 &), 1, 1][[1, 1]] - tunnelView[[1]]) / (tunnelView[[2]] - tunnelView[[1]]);
tunnelScene = {{30, 32.6} -> Function[t, With[{f = tunnel["Frames"][[Clip[Round[1 + 129 (t - 30) / 2.6], {1, 130}]]]}, {
        CanvasLine[{{120, 780}, {1800, 780}}, RGBColor[0.3, 0.3, 0.32], "Thickness" -> 2],
        CanvasRectangle[{barrierX, 780 - 300, 1680 1.2 / ((tunnelView[[2]] - tunnelView[[1]]) 100 / 1023), 300}, RGBColor[0.55, 0.55, 0.58], Opacity -> 0.55],
        waveRibbon[f[[tunnelView[[1]] ;; tunnelView[[2]]]], {120, 780, 1680, 500}, 1.05, 1]}]],
    say["Through a wall it cannot climb.", {30.3, 32.6}, {1180, 250}, "cannot"],
    eraLabel[{30, 32.6}, "Tunneling", "1928 \[CenterDot] George Gamow"]};
AnimatedGraphics[{Backdrop[inkC], tunnelScene}, "Duration" -> 33][31.9, ImageSize -> 480]
```

Dirac's equation, the same year, made the electron relativistic -- and demanded a mirror image of it, of opposite charge: antimatter, found in 1932 as tracks curling the wrong way in a magnetic field:

```wl
spiral[sign_, t_] := Table[{960, 620} + sign {240, 0} + 240 Exp[-0.11 th] {-sign Cos[th], -Sin[th]}, {th, 0, 6 Pi Min[1, t], 0.03}];
diracScene = {{32.6, 34} -> Function[t, With[{u = 3 (t - 32.6)}, {
        CanvasLine[{{960, 1000}, {960, 620}}, RGBColor[0.5, 0.5, 0.5], "Thickness" -> 2, Opacity -> 0.6],
        CanvasLine[spiral[1, Max[0.05, u]], blue, "Thickness" -> 4], CanvasLine[spiral[-1, Max[0.05, u]], red, "Thickness" -> 4],
        CanvasText["e\[Minus]", {1480, 640}, sans[44], blue, Opacity -> Clip[u - 1, {0, 1}]], CanvasText["e+", {400, 640}, sans[44], red, Opacity -> Clip[u - 1, {0, 1}]]}]],
    formula["(i\[Gamma]\[Mu]\[PartialD]\[Mu] \[Minus] m) \[Psi] = 0", {32.7, 34}, {960, 230}, 96, boneC],
    say["Every particle has a mirror.", {32.9, 34}, {1250, 860}, "mirror"],
    eraLabel[{32.6, 34}, "Antimatter", "1928 \[CenterDot] Paul Dirac \[CenterDot] Cambridge"]};
AnimatedGraphics[{Backdrop[inkC], diracScene}, "Duration" -> 34][33.8, ImageSize -> 480]
```

## Bars 34 to 38: 1935, Entanglement

Einstein, Podolsky and Rosen asked whether quantum mechanics could be complete.  Schrödinger answered with a cat in a box, alive and dead at once, and a name for what binds two systems into one: *Verschränkung*, entanglement.  The cat as a Wigner function -- quasi-probability over position and momentum -- with two blobs, alive and dead, and between them fringes going negative, which no classical probability can do:

```wl
wigner[x_, p_, a_, fringe_] := (Exp[-(x - a)^2 - p^2] + Exp[-(x + a)^2 - p^2] + 2 fringe Exp[-x^2 - p^2] Cos[2 a p]) / (2 Pi (1 + fringe Exp[-a^2]));
wignerColour = Function[{x, p, w}, Blend[{{-0.12, red}, {-0.02, RGBColor[0.55, 0.12, 0.08]}, {0, RGBColor[0.2, 0.22, 0.26]}, {0.12, blue}, {0.3, White}}, w]];
wignerFrame[fringe_, angle_] := Rasterize[Plot3D[wigner[x, p, 2.2, fringe], {x, -4.5, 4.5}, {p, -3, 3}, PlotRange -> {-0.16, 0.34}, BoxRatios -> {1.5, 1, 0.75}, Mesh -> None, PlotPoints -> 80,
    ColorFunction -> wignerColour, ColorFunctionScaling -> False, Boxed -> False, Axes -> False, Lighting -> "Neutral", ViewPoint -> {1.7 Cos[angle], 1.7 Sin[angle], 1.0},
    SphericalRegion -> True, Background -> None, ImageSize -> 1100], "Image", Background -> None];
catFrames = Table[wignerFrame[1, -1.2 + 0.5 k / 23], {k, 0, 23}];
decoherenceFrames = Table[wignerFrame[Exp[-3 k / 23] (1 - k / 23)^0.3, -0.7 + 0.5 k / 23], {k, 0, 23}];
First[catFrames]
```

```wl
detector[{x_, y_}, on_, label_] := {CanvasDisk[{x, y}, 70, RGBColor[0.18, 0.18, 0.2]], CanvasDisk[{x, y}, 54, If[on, red, blue]],
    CanvasText[If[on, "1", "0"], {x - 12, y + 16}, sans[44, 700], inkC],
    If[on, CanvasDisk[{x, y}, 110, red, Opacity -> 0.18], {}], CanvasText[label, {x - 12, y + 130}, sans[34], RGBColor["#8E8B84"]]};
entangleScene = {
    {34, 35.3} -> Function[t, {CanvasOpacity[Clip[3 (t - 34), {0, 1}], {
        CanvasText["Can Quantum-Mechanical Description of Physical", {300, 420}, serif[54], boneC],
        CanvasText["Reality Be Considered Complete?", {300, 490}, serif[54], boneC],
        CanvasText["A. Einstein, B. Podolsky and N. Rosen \[CenterDot] Physical Review \[CenterDot] 15 May 1935", {300, 580}, serif[30, True], RGBColor["#8E8B84"]]}]}],
    {35.3, 37} -> Function[t, CanvasImage[catFrames[[Clip[1 + Floor[23 (t - 35.3) / 1.7], {1, 24}]]], {160, 130, 1100, 825}]],
    say["Alive and dead, at once.", {35.4, 37}, {1250, 420}, "at once"],
    TitleCard["negative: no classical probability", {35.8, 37}, Position -> {1250, 620}, Alignment -> Left, FontSize -> 30, FontWeight -> 400, FontColor -> red, "Enter" -> "Fade", "Exit" -> "Cut"],
    {37, 38} -> Function[t, With[{k = Floor[16 t] + 1}, {
        CanvasLine[{{560, 540}, {1360, 540}}, RGBColor[0.3, 0.3, 0.32], "Thickness" -> 2], CanvasDisk[{960, 540}, 10, boneC],
        detector[{420, 540}, pairs[[k, 1]] == 1, "A"], detector[{1500, 540}, pairs[[k, 2]] == 1, "B"]}]],
    say["Far apart. Always agreeing.", {37.05, 38}, {700, 820}, "Always"],
    eraLabel[{34, 38}, "Entanglement", "1935 \[CenterDot] Einstein, Podolsky, Rosen \[CenterDot] Schr\[ODoubleDot]dinger"]};
AnimatedGraphics[{Backdrop[inkC], entangleScene}, "Duration" -> 38][36.4, ImageSize -> 480]
```

## Bars 38 to 40: Every Path at Once

Feynman, 1948: a particle goes from A to B along every path at once, each contributing an arrow turned by its action.  Far from the classical path the arrows spin and cancel; near it they agree.  Their sum, arrow after arrow, is Cornu's spiral, winding into the answer:

```wl
paths = BlockRandom[SeedRandom[1948]; Table[With[{w = Accumulate[RandomVariate[NormalDistribution[0, 1], 80]]}, With[{bridge = w - Range[80] / 80 Last[w]}, (k / 40.) bridge / Max[Abs[bridge]]]], {k, 1, 40}]];
pathAction[y_] := Total[Differences[y]^2] 600;
cornu = Table[{FresnelC[s], FresnelS[s]}, {s, -3.5, 3.5, 0.01}];
pathScene = {{38, 40} -> Function[t, With[{u = Clip[(t - 38.05) / 1.2, {0, 1}]}, {
        Table[With[{y = paths[[k]]}, CanvasLine[Table[{200 + 900 (j - 1) / 79, 540 + 150 y[[j]] Sin[Pi (j - 1) / 79]^0.5}, {j, 80}], Hue[Mod[pathAction[y], 1], 0.8, 0.9], "Thickness" -> 2,
            Opacity -> 0.5 Clip[3 u - k / 40, {0, 1}]]], {k, 40}],
        CanvasLine[{{200, 540}, {1100, 540}}, boneC, "Thickness" -> 5, Opacity -> u],
        CanvasDisk[{200, 540}, 12, boneC], CanvasDisk[{1100, 540}, 12, boneC], CanvasText["A", {180, 610}, sans[36], boneC], CanvasText["B", {1085, 610}, sans[36], boneC],
        CanvasLine[{1500, 520} + 300 # - {150, 150} & /@ Take[cornu, Max[2, Round[u Length[cornu]]]], red, "Thickness" -> 3]}]],
    TitleCard["\[OpenCurlyDoubleQuote]I think I can safely say that nobody understands quantum mechanics.\[CloseCurlyDoubleQuote]", {38.9, 40}, Position -> {960, 900}, FontSize -> 40, FontWeight -> 400, FontFamily -> "Source Serif 4", FontSlant -> "Italic", FontColor -> boneC, "Enter" -> "Fade", "Exit" -> "Cut"],
    TitleCard["Richard Feynman, 1964", {39.2, 40}, Position -> {960, 970}, FontSize -> 26, FontWeight -> 400, FontColor -> RGBColor["#8E8B84"], "Enter" -> "Fade", "Exit" -> "Cut"],
    eraLabel[{38, 40}, "Every path at once", "1948 \[CenterDot] Richard Feynman"]};
AnimatedGraphics[{Backdrop[inkC], pathScene}, "Duration" -> 40][39.6, ImageSize -> 480]
```

## Bars 40 to 48: The World It Built

One bar each for what quantum mechanics became.  Electrons in a crystal can only have energies in bands -- the Kronig-Penney model -- and the gaps between them are why a transistor switches:

```wl
kpBand[e_] := With[{al = Sqrt[2 e]}, Cos[al] + 3 Sin[al] / al];
bandPoints = Select[Table[{e, kpBand[e]}, {e, 0.05, 60, 0.03}], Abs[#[[2]]] <= 1 &];
bandScene[{t0_, t1_}] := {t0, t1} -> Function[t, With[{u = Clip[(t - t0) / 0.6, {0, 1}]}, {
    CanvasLine[{{560, 160}, {560, 960}}, RGBColor[0.3, 0.3, 0.32], "Thickness" -> 2], CanvasLine[{{560, 960}, {1360, 960}}, RGBColor[0.3, 0.3, 0.32], "Thickness" -> 2],
    Table[With[{k = ArcCos[p[[2]]], y = 960 - 780 p[[1]] / 60}, If[960 - y < 780 u, {CanvasDisk[{960 + 380 k / Pi, y}, 3, blue], CanvasDisk[{960 - 380 k / Pi, y}, 3, blue]}, {}]], {p, bandPoints}],
    CanvasText["energy", {580, 190}, sans[28], RGBColor["#8E8B84"]], CanvasText["gap", {1380, 960 - 780 9 / 60}, sans[30], red, Opacity -> u]}]];
```

Laser light: many waves, their phases at random, add to noise; in step, they add up -- coherence:

```wl
laserPhases = BlockRandom[SeedRandom[1960]; RandomReal[{0, 2 Pi}, 12]];
laserScene[{t0_, t1_}] := {t0, t1} -> Function[t, With[{u = Easing["InOutCubic"][Clip[(t - t0 - 0.2) / 0.6, {0, 1}]]}, {
    Table[CanvasLine[Table[{200 + x 60, 380 + 14 j + 26 Sin[x + (1 - u) laserPhases[[j]] - 6 t]}, {x, 0, 25, 0.15}], Hue[0, 0.7, 0.9], "Thickness" -> 2, Opacity -> 0.45], {j, 12}],
    CanvasLine[Table[{200 + x 60, 800 + 8 Total[Sin[x + (1 - u) laserPhases - 6 t]]}, {x, 0, 25, 0.08}], red, "Thickness" -> 5]}]];
```

Bell's inequality: any world of hidden, local facts keeps a certain sum of correlations at or under 2; quantum mechanics reaches 2√2, and experiments since Aspect's (1982) agree with it.  For a Bell state measured along the optimal directions:

```wl
pauli = PauliMatrix /@ {1, 3};
along[th_] := Cos[th] pauli[[2]] + Sin[th] pauli[[1]];
bell = Normal[QuantumState["PhiPlus"]["StateVector"]];
corr[a_, b_] := Re[Conjugate[bell] . KroneckerProduct[along[a], along[b]] . bell];
chsh = corr[0, Pi / 4] + corr[0, -Pi / 4] + corr[Pi / 2, Pi / 4] - corr[Pi / 2, -Pi / 4]
```

```wl
bellScene[{t0_, t1_}] := {t0, t1} -> Function[t, With[{v = 2 Sqrt[2] Easing["OutCubic"][Clip[(t - t0 - 0.15) / 0.7, {0, 1}]]}, {
    CanvasRectangle[{360, 500, 1200, 60}, RGBColor[0.18, 0.18, 0.2], "Radius" -> 30],
    CanvasRectangle[{360, 500, 1200 v / 3, 60}, If[v > 2, red, blue], "Radius" -> 30],
    CanvasLine[{{360 + 1200 2 / 3, 460}, {360 + 1200 2 / 3, 600}}, boneC, "Thickness" -> 4],
    CanvasText["classical limit 2", {360 + 800 - 120, 440}, sans[30], RGBColor["#8E8B84"]],
    CanvasText[If[v > 2.8, "2\[Sqrt]2 = 2.83", TextString[Round[v, 0.01]]], {360 + 1200 v / 3 - 60, 660}, sans[44], boneC]}]];
```

Hofstadter's butterfly: an electron on a lattice in a magnetic field.  For each flux *p*/*q* through a cell, Harper's equation has *q* energies; plotted against the flux they make a fractal:

```wl
butterfly = Flatten[Table[If[CoprimeQ[p, q], With[{al = p / q}, {al, #} & /@ Eigenvalues[N @ SparseArray[{{i_, i_} :> 2 Cos[2 Pi al i], {i_, j_} /; Abs[i - j] == 1 || Abs[i - j] == q - 1 :> 1.}, {q, q}]]], Nothing],
    {q, 1, 48}, {p, 0, q}], 2];
butterflyImage = Rasterize[Graphics[{RGBColor["#9FE6FF"], PointSize[0.0016], Point[butterfly]}, PlotRange -> {{0, 1}, {-4, 4}}, AspectRatio -> 0.75, Background -> Black, ImageSize -> 1000], "Image"];
butterflyImage
```

```wl
butterflyScene[{t0_, t1_}] := {t0, t1} -> Function[t, With[{u = Clip[(t - t0) / 0.7, {0, 1}]},
    CanvasClip[{460, 160, 1000 u, 760}, CanvasImage[butterflyImage, {460, 160, 1000, 750}]]]];
```

The quantum Hall effect: a sheet of electrons in a strong field conducts in exact steps of *e*²/*h*, flat to parts in a billion:

```wl
hall[b_] := Total[Table[0.5 (1 + Tanh[18 (1 / b - k - 0.5)]), {k, 1, 6}]];
hallScene[{t0_, t1_}] := {t0, t1} -> Function[t, With[{u = Clip[(t - t0) / 0.75, {0, 1}]}, {
    CanvasLine[Table[{360 + 1200 (b - 0.12) / 1.0, 900 - 110 hall[b]}, {b, 0.12, 0.12 + u, 0.002}], blue, "Thickness" -> 5],
    CanvasLine[Table[{360 + 1200 (b - 0.12) / 1.0, 960 - 60 Total[Table[Exp[-(18 (1 / b - k - 0.5))^2], {k, 1, 6}]]}, {b, 0.12, 0.12 + u, 0.002}], red, "Thickness" -> 3],
    CanvasText["h/e\.b2 \[Times] 1/n", {380, 200}, serif[44, True], boneC], CanvasText["magnetic field", {1300, 1010}, sans[28], RGBColor["#8E8B84"]]}]];
```

A Bose-Einstein condensate: cooled to billionths of a degree, thousands of atoms fall into one wave -- a spike rising out of the thermal cloud:

```wl
becScene[{t0_, t1_}] := {t0, t1} -> Function[t, With[{u = Clip[(t - t0) / 0.8, {0, 1}]}, With[{w = 1 - 0.5 u, c = 6 u^2}, {
    CanvasPolygon[Join[{{360, 900}}, Table[{960 + 600 v / 3, 900 - 500 ((1 - 0.6 u) Exp[-v^2 / (2 w^2)] + c Exp[-v^2 / 0.012] / 7)}, {v, -3, 3, 0.01}], {{1560, 900}}], blue, Opacity -> 0.85],
    CanvasText["velocity", {1450, 960}, sans[28], RGBColor["#8E8B84"]]}]]];
```

Spins precessing in a magnetic field ring like bells, and the ring tells where they are -- nuclear magnetic resonance, and from it MRI:

```wl
mriScene[{t0_, t1_}] := {t0, t1} -> Function[t, With[{u = t - t0}, {
    CanvasDisk[{560, 540}, 230, RGBColor[0.3, 0.3, 0.32], "Stroke" -> 2],
    Table[With[{ph = 9 u + 2 Pi j / 6}, CanvasLine[{{560, 540} + {(60 + 30 j) Cos[ph], 0.35 (60 + 30 j) Sin[ph] - 140}, {560, 540}}, Hue[j / 6, 0.7, 0.95], "Thickness" -> 4]], {j, 6}],
    CanvasLine[Table[{900 + 700 s, 540 - 200 Cos[40 s] Exp[-3 s]}, {s, 0, Min[1, u], 0.002}], red, "Thickness" -> 3]}]];
```

A particle in a box, starting as a narrow packet, weaves a carpet of interference over time -- position across, time down -- and at the revival time 4/π returns exactly to where it began.  A quarter of that time:

```wl
carpet = Module[{nmax = 60, x = Subdivide[0., 1., 499], c, modes, T = 4 / Pi},
    (* the packet's coefficients in the box's modes, in closed form for a narrow Gaussian *)
    c = Table[Sqrt[2] 0.02 Sqrt[2 Pi] Sin[n Pi 0.3] Exp[-(n Pi 0.02)^2 / 2], {n, nmax}];
    modes = Table[Sqrt[2] Sin[n Pi x], {n, nmax}];
    (* a quarter of the revival time, finely enough that the fastest mode never skips a turn *)
    Image[Rescale[Table[Abs[(c Exp[-I Range[nmax]^2 Pi^2 t / 2]) . modes]^2, {t, 0, T / 4, T / 6399}]]^0.45]];
carpetImage = Colorize[carpet, ColorFunction -> (Blend[{Black, RGBColor["#1d4e8f"], RGBColor["#9FE6FF"], White}, #] &)]
```

```wl
carpetScene[{t0_, t1_}] := {t0, t1} -> Function[t, With[{u = Clip[(t - t0) / 0.9, {0, 1}]},
    CanvasClip[{560, 140, 800, 800 u}, CanvasImage[carpetImage, {560, 140, 800, 800}]]]];
```

```wl
built = {bandScene[{40, 41}], laserScene[{41, 42}], bellScene[{42, 43}], butterflyScene[{43, 44}], hallScene[{44, 45}], becScene[{45, 46}], mriScene[{46, 47}], carpetScene[{47, 48}],
    eraLabel[{40, 41}, "Bands", "1947 \[CenterDot] the transistor"], eraLabel[{41, 42}, "Light in step", "1960 \[CenterDot] the laser"],
    eraLabel[{42, 43}, "No local world", "1964 \[CenterDot] John Bell \[CenterDot] 1982 \[CenterDot] Alain Aspect"], eraLabel[{43, 44}, "A fractal spectrum", "1976 \[CenterDot] Douglas Hofstadter"],
    eraLabel[{44, 45}, "Exact steps", "1980 \[CenterDot] Klaus von Klitzing"], eraLabel[{45, 46}, "One wave of atoms", "1995 \[CenterDot] Bose-Einstein condensate"],
    eraLabel[{46, 47}, "Spins that ring", "1946 \[CenterDot] NMR \[CenterDot] 1973 \[CenterDot] MRI"], eraLabel[{47, 48}, "The quantum carpet", "a particle in a box"]};
```

## Bars 48 to 54: Computing with ψ

Feynman again, in 1981: to simulate nature, you need a computer that is itself quantum:

```wl
blochSphere[{cx_, cy_}, r_, th_, ph_, colour_] := {CanvasDisk[{cx, cy}, r, RGBColor[0.3, 0.3, 0.32], "Stroke" -> 2],
    CanvasLine[Table[{cx + r Cos[s], cy + 0.3 r Sin[s]}, {s, 0, 2 Pi, 0.1}], RGBColor[0.3, 0.3, 0.32], "Thickness" -> 1.5],
    CanvasLine[{{cx, cy}, {cx + r Sin[th] Cos[ph], cy - r Cos[th] + 0.3 r Sin[th] Sin[ph]}}, colour, "Thickness" -> 6],
    CanvasDisk[{cx + r Sin[th] Cos[ph], cy - r Cos[th] + 0.3 r Sin[th] Sin[ph]}, 10, colour]};
grover[k_] := With[{th = ArcSin[1 / 4.]}, With[{p = Sin[(2 k + 1) th]^2}, ReplacePart[ConstantArray[(1 - p) / 15, 16], 11 -> p]]];
computingScene = {
    CaptionText["\[OpenCurlyDoubleQuote]Nature isn\[CloseCurlyQuote]t classical, dammit, and if you want to make a simulation of nature, you\[CloseCurlyQuote]d better make it quantum mechanical.\[CloseCurlyDoubleQuote]",
        {48, 50}, Position -> {260, 380}, FontSize -> 60, "Width" -> 1400, FontColor -> boneC, "Highlight" -> "quantum"],
    TitleCard["Richard Feynman, 1981", {49.2, 50}, Position -> {960, 760}, FontSize -> 28, FontWeight -> 400, FontColor -> RGBColor["#8E8B84"], "Enter" -> "Fade", "Exit" -> "Cut"],
    {50, 51.5} -> Function[t, Table[blochSphere[{360 + 400 j, 560}, 150, Pi (0.5 + 0.45 Sin[3 t + j]), 4 t + j, Hue[j / 4, 0.7, 0.95]], {j, 0, 3}]],
    say["Qubits: waves you can program.", {50.1, 51.5}, {1100, 880}, "program"],
    {51.5, 54} -> Function[t, With[{k = Clip[Floor[(t - 51.5) / 0.6], {0, 3}], u = Clip[FractionalPart[(t - 51.5) / 0.6] / 0.5, {0, 1}]}, With[{p = (1 - u) grover[Max[0, k - 1]] + u grover[k]},
        Table[CanvasRectangle[{360 + 75 (j - 1), 900 - 700 p[[j]], 60, 700 p[[j]]}, If[j == 11, red, blue]], {j, 16}]]]],
    say["Grover, 1996: a search that interferes its way to the answer.", {51.6, 54}, {1280, 200}, "answer", 40],
    eraLabel[{48, 54}, "Computing with \[Psi]", "1981 \[CenterDot] Feynman \[CenterDot] 1994 \[CenterDot] Shor \[CenterDot] 1996 \[CenterDot] Grover"]};
AnimatedGraphics[{Backdrop[inkC], computingScene}, "Duration" -> 54][53.5, ImageSize -> 480]
```

## Bars 54 to 58: Decoherence

The cat again.  Touching the world -- air, light, anything that keeps a record -- the fringes fade, and what is left is a classical either-or: the quantum becomes the everyday:

```wl
decoherenceScene = {{54, 58} -> Function[t, CanvasImage[decoherenceFrames[[Clip[1 + Floor[23 (t - 54) / 3.4], {1, 24}]]], {160, 130, 1100, 825}]],
    say["Touch the world, and the fringes fade.", {54.3, 58}, {1250, 420}, "fade"],
    eraLabel[{54, 58}, "Decoherence", "1970 \[CenterDot] H. Dieter Zeh \[CenterDot] 1981 \[CenterDot] Wojciech Zurek"]};
```

## Bars 58 to 62: Chaos and Its Scars

A billiard shaped like a stadium makes a ball's motion chaotic.  Its quantum standing waves, solved as eigenfunctions of the Laplacian, are mostly speckle -- yet some are scarred along the classical orbits, as Heller found in 1984:

```wl
stadium = RegionUnion[Rectangle[{-1, -1}, {1, 1}], Disk[{-1, 0}, 1], Disk[{1, 0}, 1]];
{stadiumValues, stadiumModes} = NDEigensystem[{-Laplacian[u[x, y], {x, y}], DirichletCondition[u[x, y] == 0, True]}, u[x, y], {x, y} \[Element] stadium, 140,
    Method -> {"PDEDiscretization" -> {"FiniteElement", "MeshOptions" -> {"MaxCellMeasure" -> 0.0004}}}];
stadiumInside = RegionMember[stadium];
stadiumImage[k_] := With[{f = Head[stadiumModes[[k]]], grid = Table[{xx, yy}, {yy, 1, -1, -0.008}, {xx, -2, 2, 0.008}]},
    With[{pts = Flatten[grid, 1]}, Image[Rescale[Partition[Quiet[MapThread[If[#2, #1^2, 0.] &, {f @@ Transpose[pts], stadiumInside[pts]}]], Length[First[grid]]]]^0.5]]];
scarPicks = {98, 112, 127, 139};
scars = Colorize[stadiumImage[#], ColorFunction -> (Blend[{Black, RGBColor["#1d4e8f"], RGBColor["#9FE6FF"], White}, #] &)] & /@ scarPicks;
GraphicsRow[scars, ImageSize -> 1200]
```

```wl
chaosScene = {{58, 62} -> Function[t, With[{k = Clip[1 + Floor[(t - 58) / 1], {1, 4}]}, {CanvasImage[scars[[k]], {360, 240, 1200, 600}]}]],
    say["Chaos, and inside it, the memory of an orbit.", {58.3, 62}, {1250, 920}, "memory", 42],
    eraLabel[{58, 62}, "Scars", "1984 \[CenterDot] Eric Heller"]};
```

## Bars 62 to 74: The Quantum Century

Everything at once: the century's pictures dealt out on the beat, around the screen from the beginning, its fringes now dense and bright:

```wl
wall = {orbitals[[3]], orbitals[[8]], carpetImage, butterflyImage, catFrames[[12]], scars[[2]], orbitals[[11]], orbitals[[6]]};
climaxScene = {{62, 74} -> Function[t, {
        Table[With[{u = Clip[(t - 62 - (j - 1) / 2) 4, {0, 1}], pos = {{60, 60}, {520, 60}, {980, 60}, {1440, 60}, {60, 700}, {520, 700}, {980, 700}, {1440, 700}}[[j]]},
            If[u > 0, CanvasImage[wall[[j]], {pos[[1]], pos[[2]], 420, 320}, Opacity -> 0.85 u], {}]], {j, Length[wall]}],
        With[{n = Min[6000, Round[6000 Clip[(t - 63) / 6, {0, 1}]]]}, {CanvasRectangle[{260, 400, 1400, 280}, RGBColor[0.06, 0.06, 0.07], Opacity -> 0.9],
            Table[CanvasDisk[{260 + 1400 (landing[[k, 1]] + 7) / 14, 540 + 120 landing[[k, 2]]}, 1.6, RGBColor["#9FE6FF"], Opacity -> 0.8], {k, n}]}]}],
    TitleCard["A hundred years of \[Psi].", {68, 74}, Position -> {960, 1010}, FontSize -> 52, FontColor -> boneC, "Enter" -> "Fade", "Exit" -> "Fade"]};
```

## Bars 74 to 81: Outro

ψ alone, drifting:

```wl
outroScene = {{74, 81} -> Function[t, With[{u = t - 74}, {waveRibbon[packet[xs, 0.8 u, 3, 0.7, 2], {160, 700, 1600, 420}, 1, Clip[1 - (u - 5.5) / 1.2, {0, 1}]]}]],
    TitleCard["1926 \[Dash] 2026", {74.4, 80.3}, Position -> {960, 300}, FontSize -> 90, FontColor -> boneC, "Enter" -> "Rise", "Exit" -> "Fade"],
    TitleCard["Nobody understands it.", {75.5, 80.3}, Position -> {960, 860}, FontSize -> 50, FontColor -> RGBColor["#8E8B84"], "Enter" -> "Fade", "Exit" -> "Fade"],
    TitleCard["Everything runs on it.", {77, 80.3}, Position -> {960, 940}, FontSize -> 50, FontColor -> red, "Enter" -> "Fade", "Exit" -> "Fade"]};
```

## The Ruler of Years

```wl
hud = YearRuler[{{4, 1900}, {8, 1913}, {12, 1922}, {14, 1924}, {15, 1925}, {16, 1926}, {22, 1926.5}, {26, 1927}, {30, 1928}, {34, 1935}, {38, 1948},
        {40, 1947}, {41, 1960}, {42, 1964}, {43, 1976}, {44, 1980}, {45, 1995}, {46, 1973}, {47, 1990}, {48, 1981}, {51.5, 1996}, {54, 2000}, {58, 1984}, {62, 2026}, {74, 2026}}, {4, end},
    "Marks" -> {{1900, "1900"}, {1926, "1926"}, {1950, "1950"}, {1975, "1975"}, {2000, "2000"}, {2026, "2026"}}, FontColor -> fg, "Exit" -> "Fade", "ExitTime" -> 0.5];
```

## The Mix

Every part on its instrument, mixed: the music ducks under the kick, runs through the century's low-pass, and fades at the end:

```wl
score = Mixer["Sidechain" -> kick, "Cutoff" -> musicCutoff, "FadeOut" -> 5/4][Track[{Instrument["Pad"][pad], Instrument["Bass"][bass],
    Instrument["Arp"][arps], Instrument["Bell"][atomBells], Instrument["Lead"][lead],
    Instrument["SoftKick"][coldKicks], Instrument["Hat"][clicksCold], Instrument["Kick"][kick], Instrument["Clap"][claps], Instrument["Hat"][hats], Instrument["OpenHat"][openHats],
    Instrument["Kick"][pairKick], Instrument["Clap"][pairClap],
    Instrument["Crash"][crashes], Instrument["Riser"][risers], Instrument["Roll"][rolls], Instrument["Impact"][impacts]}]];
```

## The Film

The edit: the sections stacked in time over their grounds, the ruler of years beneath, and the score:

```wl
film = AnimatedGraphics[{coldOpen, planckScene, atomScene, sgScene, heisenbergScene, Backdrop[ground, {16, 81}], schrodinger, psiScene, oscillatorScene, orbitalScene, bornScene,
    uncertaintyScene, tunnelScene, diracScene, entangleScene, pathScene, built, computingScene, decoherenceScene, chaosScene, climaxScene, outroScene, hud, score},
    "Duration" -> duration, "CyclesPerSecond" -> 1/2, BaseStyle -> {"Pulse" -> kick}]
```

Render it, frames in parallel, and store it in the cloud, public:

```wl
Export["Quantum.mp4", film];
video = Video[CopyFile["Quantum.mp4", CloudObject["WolframFilm/Quantum.mp4", Permissions -> "Public"], OverwriteTarget -> True]]
```
