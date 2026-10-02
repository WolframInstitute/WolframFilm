---
Template: ComputationalEssay
Name: "ψ — The Quantum Century"
Author: Nikolay Murzin
Date: 2026
Description: "A short documentary about a hundred years of quantum theory, told in the voices of the people who made it, over real experiments and computed pictures, made entirely in this notebook with WAnim"
Abstract: "In January 1926 Schrödinger wrote down the equation of a wave no one had seen. This notebook makes a five-minute documentary about the century since, narrated only by recordings of the physicists themselves -- Planck, Bohr, de Broglie, Heisenberg, Dirac, Schrödinger, Born, Bell, Aspect, Feynman, Zeilinger -- over film of real experiments and pictures computed here: the blackbody curve, hydrogen's orbitals, a wave packet tunnelling through a wall, the Wigner function of Schrödinger's cat."
Keywords: [WAnim, documentary, quantum mechanics, wave function, Schrödinger equation, archival film, hydrogen, entanglement]
Sources: ["[WAnim](https://github.com/sw1sh/WAnim)", "[The film's clips and their sources](https://github.com/WolframInstitute/WolframFilm/blob/main/films/Quantum/docs/CLIPS.md)", "[The facts, checked](https://github.com/WolframInstitute/WolframFilm/blob/main/films/Quantum/docs/SOURCES.md)"]
Links: ["[What Is a Computational Essay?](https://writings.stephenwolfram.com/2017/11/what-is-a-computational-essay/)"]
---

## A Film Told by Its Physicists

This documentary has no narrator.  Its story is told by the people who made quantum theory, in recordings from 1942 to 2022: a film portrait of Max Planck, Niels Bohr's last lecture, Louis de Broglie on French television, Werner Heisenberg in a Canadian interview, Erwin Schrödinger and Max Born on German radio, John Bell and Alain Aspect on film, Richard Feynman's Messenger lectures, Anton Zeilinger's Nobel lecture.  Between their words the pictures are real experiments -- electrons arriving one by one, glowing steel, ultraviolet light discharging a zinc plate, electron diffraction rings, cloud-chamber tracks, a quantum processor -- and computed ones, the physics they describe solved in this notebook.

The film is made with WAnim; its archival clips play with ArchiveClip, which puts a film's picture in the frame and its voice in the soundtrack, the music ducked beneath:

```wl
PacletInstall["WolframInstitute/WAnim"]; PacletInstall["Wolfram/QuantumFramework"];
Needs["WolframInstitute`WAnim`"]; Needs["Wolfram`QuantumFramework`"];
```

The clips are cut from their sources (listed, with their rights, in the film's CLIPS.md) and kept beside the film in the cloud:

```wl
archive[name_String] := "https://www.wolframcloud.com/obj/wolframinstitute/WolframFilm/Quantum/archive/" <> name;
image[name_String] := Import[archive[name]];
```

Time in this film is in seconds.

## The Look

Light on dark, as a documentary is; Wolfram red for the year and the speaker's name; Manim blue and phase colour for the physics:

```wl
{inkC, boneC, red, blue, grey} = RGBColor /@ {"#0B0C0E", "#EDE9E0", "#DD1100", "#58C4DD", "#8E8B84"};
sans[size_, weight_ : 600] := CanvasFont["Source Sans 3", size, weight];
serif[size_, italic_ : False] := CanvasFont["Source Serif 4", size, 400, italic];
```

Every voice is an ArchiveClip filling the frame, shown only while the film looks at its speaker -- "Show" -- and subtitled while it speaks; above its subtitles a tag always says who is speaking, where and when, since the film's chapters are about one time and the voices often remember it from another.  Footage is the same, silent, its moment stretched or squeezed onto its span, with a caption saying what it shows.  Every picture dissolves into the next over 0.6 seconds:

```wl
fade = 0.6;
voice[name_, t0_, {in_, out_}, show_, credit_, subs_, strap_ : True, crop_ : None] := ArchiveClip[archive[name <> ".mp4"], {t0, t0 + out - in}, "From" -> in, "To" -> out,
    "Style" -> "Full", "Show" -> Replace[show, None -> {}], "Credit" -> credit, "LowerThird" -> strap, "Subtitle" -> subs, "Zoom" -> 0.03, "Duck" -> 0.15, "Fade" -> fade, "Crop" -> crop];
footage[name_, {t0_, t1_}, {in_, out_}, caption_, zoom_ : 0.04] := With[{r = (out - in) / (t1 - t0)},
    ArchiveClip[archive[name <> ".mp4"], {t0 - fade / 2, t1 + fade / 2}, "From" -> Max[0, in - r fade / 2], "To" -> out + r fade / 2, "Style" -> "Full",
        "Sound" -> False, "Zoom" -> zoom, "Fade" -> fade, "Caption" -> caption, "Enter" -> "Cut", "Exit" -> "Cut"]];
```

A still photograph or a page is shown the same way, pushing in slowly; a computed shot is a function of time on the dark ground, captioned too; each chapter names its time and its subject in the top corner:

```wl
dissolve[{t0_, t1_}][t_] := Clip[Min[(t - t0 + fade / 2) / fade, (t1 + fade / 2 - t) / fade], {0, 1}];
captionBox[""] := {};
captionBox[c_] := With[{f = sans[24, 400]}, With[{w = CanvasTextWidth[c, f]},
    {CanvasRectangle[{1920 - w - 116, 66, w + 40, 44}, Black, Opacity -> 0.45, "Radius" -> 4], CanvasText[c, {1920 - w - 96, 96}, f, RGBColor["#D8D4CC"]]}]];
still[img_, {t0_, t1_}, caption_, zoom_ : 0.06] := {t0 - fade / 2, t1 + fade / 2} -> Function[t, With[{d = ImageDimensions[img], z = 1 + zoom (t - t0) / (t1 - t0)},
    With[{s = z Min[1920 / d[[1]], 1080 / d[[2]]]}, CanvasOpacity[dissolve[{t0, t1}][t], {CanvasRectangle[{0, 0, 1920, 1080}, inkC],
        CanvasClip[{0, 0, 1920, 1080}, CanvasImage[img, {960 - s d[[1]] / 2, 540 - s d[[2]] / 2, s d[[1]], s d[[2]]}]], captionBox[caption]}]]]];
shot[{t0_, t1_}, f_, caption_] := {t0 - fade / 2, t1 + fade / 2} -> Function[t, CanvasOpacity[dissolve[{t0, t1}][t], {CanvasRectangle[{0, 0, 1920, 1080}, inkC], f[t], captionBox[caption]}]];
chapter[{t0_, t1_}, y_, what_] := {TitleCard[y, {t0, t1}, Position -> {96, 96}, Alignment -> Left, FontSize -> 44, FontWeight -> 700, FontColor -> red, "Enter" -> "Fade", "Exit" -> "Fade"],
    TitleCard[what, {t0, t1}, Position -> {96, 142}, Alignment -> Left, FontSize -> 28, FontWeight -> 400, FontColor -> boneC, "Enter" -> "Fade", "Exit" -> "Fade"]};
```

## The Wave, Computed

A complex number drawn as physicists draw it -- its size as brightness, its phase as hue -- and a wave along a line as a ribbon of thin columns:

```wl
phaseColour[z_, a_ : 1] := Hue[Mod[Arg[z] / (2 Pi), 1], 0.78, 0.35 + 0.65 a];
waveRibbon[zs_List, {x0_, y0_, w_, h_}, scale_, opacity_ : 1] := With[{n = Length[zs]},
    CanvasOpacity[opacity, Table[With[{z = zs[[k]], xa = x0 + w (k - 1) / n, xb = x0 + w k / n},
        If[Abs[z] scale h < 0.5, Nothing, CanvasPolygon[{{xa, y0}, {xb + 0.6, y0}, {xb + 0.6, y0 - h Abs[z] scale}, {xa, y0 - h Abs[z] scale}}, phaseColour[z, Min[1, Abs[z] scale]]]]],
        {k, n}]]];
phaseImage[z_ ? MatrixQ, gamma_ : 0.6] := With[{a = Abs[z] / Max[Abs[z]]},
    ColorConvert[Image[Transpose[{Mod[Arg[z] / (2 Pi), 1], ConstantArray[0.8, Dimensions[z]], a^gamma}, {3, 1, 2}], ColorSpace -> "HSB"], "RGB"]];
```

A free particle as Schrödinger's equation moves it: a Gaussian packet travelling and spreading, in closed form (ħ = m = 1):

```wl
packet[x_, t_, k_ : 4, a_ : 1, x0_ : 0] := (2 a / Pi)^(1/4) / Sqrt[1 + 2 I a t] Exp[(-a (x - x0)^2 + I k (x - x0) - I k^2 t / 2) / (1 + 2 I a t)];
xs = Subdivide[-6., 18., 360];
AnimatedGraphics[{Backdrop[inkC], {0, 2} -> Function[t, waveRibbon[packet[xs, t], {160, 760, 1600, 520}, 1]]}, "Duration" -> 2][1, ImageSize -> 480]
```

## 0:00 — Clicks

Electrons sent through two slits one at a time, filmed as they land (Bach, Pope, Liou and Batelaan, 2013): each arrives in one place, at random, and together they draw the interference of a wave.  Beside them, the same experiment computed: six thousand landing places sampled from the two-slit pattern:

```wl
slitIntensity[x_] := Cos[2.6 x]^2 Sinc[0.55 x]^2;
landing = BlockRandom[SeedRandom[1989]; With[{grid = Subdivide[-7., 7., 4000]},
    Transpose[{RandomChoice[slitIntensity /@ grid -> grid, 6000] + RandomReal[{-0.002, 0.002}, 6000], RandomReal[{-1, 1}, 6000] + RandomVariate[NormalDistribution[0, 0.12], 6000]}]]];
screenDots[n_, {x0_, y0_, w_, h_}, r_ : 1.7] := Table[CanvasDisk[{x0 + w (landing[[k, 1]] + 7) / 14, y0 + h / 2 + 0.45 h landing[[k, 2]]}, r, RGBColor["#9FE6FF"], Opacity -> 0.8], {k, Min[n, 6000]}];
Histogram[landing[[All, 1]], 120, Axes -> False, ImageSize -> 400]
```

Feynman, in 1964, on what a detector hears: clicks.

```wl
coldOpen = {footage["f-electrons", {0, 13.6}, {0, 72}, "Electrons through two slits, one at a time \[CenterDot] Bach et al., 2013", 0.08],
    voice["v-feynman-clicks", 2, {0.2, 11.2}, {{4.6, 7.6}}, {"Richard Feynman", "lecture at Cornell, 1964"},
        {{0, 11, "\[Ellipsis]are clicks.  Click, click, click, click\[Ellipsis]  Lumps.  Absolutely lumps."}}],
    shot[{13.6, 18.5}, Function[t, {screenDots[Round[6000 Clip[(t - 13.6) / 3, {0, 1}]^0.6], {260, 300, 1400, 480}, 1.7]}], "Computed: 6,000 electrons sampled from the two-slit pattern"],
    TitleCard["\[Psi]", {14.2, 18.4}, Position -> {960, 880}, FontSize -> 120, FontWeight -> 400, FontFamily -> "Source Serif 4", FontSlant -> "Italic", FontColor -> boneC, "Enter" -> "Fade", "Exit" -> "Fade"],
    TitleCard["THE QUANTUM CENTURY", {14.6, 18.4}, Position -> {960, 990}, FontSize -> 30, FontWeight -> 600, FontColor -> red, "Tracking" -> 8, "Enter" -> "Fade", "Exit" -> "Fade"]};
```

## 0:18 — 1900: Planck

Planck, in a film portrait made for his 85th year, remembers the hypothesis he did not want: radiation made of quanta of definite size.  Bohr, in 1962, at his last lecture, dates the change to it.  The picture: steel heating in a forge, and the law Planck found for its glow beside the classical one, which runs to infinity:

```wl
c2 = 1.4388 10^7;
planck[l_, T_] := 1 / (l^5 (Exp[c2 / (l T)] - 1));
rayleigh[l_, T_] := T / (c2 l^4);
plotRect = {260, 240, 1100, 600};
curvePoints[f_, T_] := With[{peak = planck[2.898 10^6 / T, T]}, Table[{plotRect[[1]] + plotRect[[3]] (l - 100) / 2400, plotRect[[2]] + plotRect[[4]] (1 - 0.85 f[l, T] / peak)}, {l, 100, 2500, 6}]];
blackbody[t0_][t_] := With[{T = 5000, u1 = Clip[(t - t0 - 0.3) / 1.4, {0, 1}], u2 = Clip[(t - t0 - 2) / 2, {0, 1}], TT = 1800 + 4200 Clip[(t - t0) / 6, {0, 1}]}, {
    CanvasLine[{{plotRect[[1]], plotRect[[2]] + plotRect[[4]]}, {plotRect[[1]] + plotRect[[3]], plotRect[[2]] + plotRect[[4]]}}, grey, "Thickness" -> 2],
    Table[CanvasRectangle[{plotRect[[1]] + plotRect[[3]] (l - 100) / 2400, plotRect[[2]] + plotRect[[4]] + 8, plotRect[[3]] 5 / 2400 + 0.5, 20}, ColorData["VisibleSpectrum"][l]], {l, 380, 750, 5}],
    CanvasClip[plotRect, {CanvasLine[Take[curvePoints[rayleigh, T], Max[2, Round[u1 401]]], grey, "Thickness" -> 4],
        If[u2 > 0, CanvasLine[Take[curvePoints[planck, T], Max[2, Round[u2 401]]], red, "Thickness" -> 6], {}]}],
    If[u1 > 0.5, CanvasText["classical physics: infinite", {plotRect[[1]] + 60, plotRect[[2]] + 50}, sans[30, 400], grey], {}],
    If[u2 > 0.5, CanvasText["Planck, 1900", {plotRect[[1]] + 330, plotRect[[2]] + 130}, sans[34], red], {}],
    CanvasDisk[{1560, 540}, 150, ColorData["BlackBodySpectrum"][TT], Opacity -> 0.22], CanvasDisk[{1560, 540}, 100, ColorData["BlackBodySpectrum"][TT]],
    CanvasText[ToString[Round[TT, 100]] <> " K", {1505, 720}, sans[30, 400], grey]}];
planckPart = {footage["f-forge", {22.5, 27}, {2, 10}, "Steel glowing in a forge: hotter is whiter"],
    shot[{27, 44}, blackbody[27], "Computed: the glow of a hot body \[Dash] Planck\[CloseCurlyQuote]s law against classical physics"],
    voice["v-planck", 18.5, {10, 23}, {{18.5, 22.5}}, {"Max Planck", "film portrait, 1942"},
        {{0, 10, "At first I accepted this hypothesis only reluctantly, because it contradicted every idea of classical atomism."}, {10, 13, "But there was no other way."}}],
    footage["f-forge", {44, 50.4}, {16, 26}, "Steel glowing in a forge"],
    (* the Lindau film is a slideshow with captions burned in: Bohr's close-up, its caption cropped away *)
    voice["v-bohr-planck", 31.5, {0.5, 21.9}, {{50.4, 52.9}}, {"Niels Bohr", "lecture at Lindau, 1962"},
        {{0, 21.4, "The great change came with the discovery of the universal quantum of action, in the first year of this century, by Planck."}}, True, {0.1, 0.1, 0, 0.3}],
    chapter[{18.5, 52.9}, "1900", "Planck: energy comes in quanta"]};
```

## 0:53 — 1905 to 1913: Light Quanta, and the Atom

Bohr again: Einstein explained the photoelectric effect by a transfer of a light quantum.  The 1961 film of the Physical Science Study Committee shows it: ultraviolet light discharging a zinc plate, its electroscope's leaf falling:

```wl
photoPart = {footage["f-photoelectric", {56, 63}, {60, 67}, "PSSC film, 1961: a charged zinc plate and its electroscope", 0.03], footage["f-photoelectric", {63, 70}, {100, 107}, "Ultraviolet light knocks electrons out: the leaf falls", 0.03],
    voice["v-bohr-einstein", 52.9, {0.5, 17.6}, {{52.9, 56}}, {"Niels Bohr", "lecture at Lindau, 1962"},
        {{0, 17.1, "Einstein tried to explain the individual photoeffect by assuming that we had to do with a transfer of a light quantum."}}, True, {0.1, 0.1, 0, 0.24}],
    chapter[{52.9, 70}, "1905", "Einstein: light comes in quanta"]};
```

Hydrogen glows at four visible wavelengths and no others.  Bohr's atom of 1913 explained them: the electron keeps to orbits of radius ∝ n², and each line is a fall to the second.  The Rydberg formula gives them, and the music, for a moment, plays them -- the atom's own chord, Hα tuned to A:

```wl
balmer = Table[1/4 - 1/m^2, {m, 3, 6}];
balmerNm = 1 / (1.0967758 10^7 balmer) 10^9
balmerPitch = N[57 + 12 Log2[balmer / First[balmer]]]
```

```wl
stripRect = {160, 760, 1600, 120}; lineX[l_] := stripRect[[1]] + stripRect[[3]] (l - 380) / 340;
bohrCentre = {960, 400}; orbitR[n_] := 9 n^2; fallAt[k_] := 74 + k / 2;
atomShot = shot[{74, 80}, Function[t, {
    CanvasRectangle[stripRect, RGBColor[0.07, 0.07, 0.08], "Radius" -> 4],
    Table[CanvasRectangle[{lineX[l], stripRect[[2]], stripRect[[3]] 3 / 340 + 0.5, stripRect[[4]]}, ColorData["VisibleSpectrum"][l], Opacity -> 0.13], {l, 380, 720, 3}],
    Table[With[{l = balmerNm[[k + 1]], u = Clip[(t - fallAt[k]) / 0.12, {0, 1}]}, If[u > 0, {
        CanvasRectangle[{lineX[l] - 4, stripRect[[2]], 8, stripRect[[4]]}, ColorData["VisibleSpectrum"][l], Opacity -> u],
        CanvasRectangle[{lineX[l] - 14, stripRect[[2]], 28, stripRect[[4]]}, ColorData["VisibleSpectrum"][l], Opacity -> 0.25 u],
        CanvasText["H" <> {"\[Alpha]", "\[Beta]", "\[Gamma]", "\[Delta]"}[[k + 1]] <> "  " <> ToString[Round[l]] <> " nm", {lineX[l] - 50, stripRect[[2]] + stripRect[[4]] + 46 + If[k == 3, 34, 0]}, sans[26, 400], boneC, Opacity -> u]}, {}]], {k, 0, 3}],
    Table[CanvasDisk[bohrCentre, orbitR[n], grey, "Stroke" -> 1.5, Opacity -> 0.5], {n, 1, 6}], CanvasDisk[bohrCentre, 9, red],
    With[{k = Clip[Floor[2 (t - 74)], {0, 3}]}, With[{u = Clip[(t - fallAt[k]) / 0.35, {0, 1}], m = k + 3},
        With[{r = orbitR[m] + (orbitR[2] - orbitR[m]) Easing["InOutCubic"][u], ang = 5 t}, {CanvasDisk[bohrCentre + r {Cos[ang], Sin[ang]}, 9, boneC],
            If[0 < u < 1, CanvasLine[Table[bohrCentre + (r + 40 + 260 u + s) {Cos[ang], Sin[ang]} + 8 Sin[s / 6] {-Sin[ang], Cos[ang]}, {s, 0, 120, 4}],
                ColorData["VisibleSpectrum"][balmerNm[[k + 1]]], "Thickness" -> 4], {}]}]]]}], "Computed: hydrogen\[CloseCurlyQuote]s four visible lines, falls between Bohr\[CloseCurlyQuote]s orbits"];
atomPart = {footage["f-spectra", {70, 74}, {30, 34}, "Glowing gases through a diffraction grating: each element its own lines"], atomShot, chapter[{70, 80}, "1913", "Bohr: the atom has steps"]};
```

## 1:20 — 1924 to 1927: Matter Is a Wave

De Broglie, on French television in 1967: the idea that every particle is accompanied by a wave.  Lester Germer, in the same PSSC series, at the apparatus where he and Davisson saw electrons diffract like waves in 1927, and the rings electrons make through a crystal:

```wl
deBrogliePart = {footage["f-germer", {83.5, 87}, {10, 13.5}, "PSSC film, 1961: Lester Germer at his electron-diffraction apparatus"], footage["f-rings", {87, 90.3}, {60, 63.3}, "Electrons through a crystal: rings, as a wave makes"],
    voice["v-debroglie", 80, {6, 16.3}, {{80, 83.5}}, {"Louis de Broglie", "French television, 1967"},
        {{0, 4.5, "After all these studies, I had the idea that one had to extend"}, {4.5, 10.3, "to all material particles, electrons in particular, the idea that the particle is accompanied by a wave."}}],
    chapter[{80, 90.3}, "1924 \[Dash] 1927", "de Broglie: matter is a wave"]};
```

## 1:30 — 1925: Helgoland

Heisenberg, in English, half a century later: hay fever sent him to an island in June 1925, and there he found quantum mechanics -- position and momentum as arrays that do not commute.  Truncated to the first rows of the harmonic oscillator, *X P* − *P X* is *i* down the diagonal (ħ = 1):

```wl
nmax = 6; aOp = Normal @ SparseArray[{i_, j_} /; j == i + 1 :> Sqrt[i], {nmax, nmax}];
X = (aOp + Transpose[aOp]) / Sqrt[2]; P = I (Transpose[aOp] - aOp) / Sqrt[2];
(X . P - P . X)[[;; 4, ;; 4]] // MatrixForm
```

```wl
typeset[e_, size_ : 40, colour_ : boneC] := Rasterize[Style[TraditionalForm[e], size, colour, FontFamily -> "Source Serif 4"], "Image", Background -> None, ImageResolution -> 144];
xp = typeset[MatrixForm[FullSimplify[(X . P)[[;; 4, ;; 4]]]], 54]; px = typeset[MatrixForm[FullSimplify[(P . X)[[;; 4, ;; 4]]]], 54];
commutator = {typeset[Style["X P \[Minus] P X  =", Italic], 64], typeset[MatrixForm[FullSimplify[(X . P - P . X)[[;; 4, ;; 4]]]], 64], typeset[Style["=  i \[DoubleStruckOne]", Italic], 64, red]};
placeImage[img_, {cx_, cy_}, a_ : 1] := With[{d = ImageDimensions[img] / 2}, CanvasImage[img, {cx - d[[1]] / 2, cy - d[[2]] / 2, d[[1]], d[[2]]}, Opacity -> a]];
matrixShot[t0_] := Function[t, With[{u = Clip[(t - t0) 1.5, {0, 1}] Clip[(t0 + 3.4 - t) 2, {0, 1}], v = Clip[(t - t0 - 3.6) 1.5, {0, 1}]}, {
    CanvasText["X P", {440, 250}, serif[72, True], boneC, Opacity -> u], CanvasText["P X", {1380, 250}, serif[72, True], boneC, Opacity -> u],
    placeImage[xp, {500, 560}, u], placeImage[px, {1420, 560}, u],
    placeImage[commutator[[1]], {640, 540}, v], placeImage[commutator[[2]], {1000, 540}, v], placeImage[commutator[[3]], {1320, 540}, v],
    CanvasText["position and momentum do not commute", {960 - 330, 860}, sans[40, 400], red, Opacity -> v]}]];
commutator
xp
helgolandPart = {still[image["helgoland.jpg"], {94.5, 101}, "Helgoland around 1900 \[CenterDot] Library of Congress"], still[image["heisenberg1926.jpg"], {101, 105}, "Heisenberg in 1926 \[CenterDot] photo: Friedrich Hund"], shot[{105, 111.8}, matrixShot[105], "Computed: position X and momentum P as Heisenberg\[CloseCurlyQuote]s matrices"],
    (* the interview's own title names him *)
    voice["v-heisenberg-helgoland", 90.3, {9.9, 31.4}, {{90.3, 94.5}}, {"Werner Heisenberg", "CBC interview, early 1970s"},
        {{0, 6.6, "It just so happened that I became a little bit ill,"}, {6.6, 12, "so I had to spend a holiday on an island, in order to be free from hay fever,"},
         {12, 16, "and there I had very good time to think about the questions."}, {16, 21.5, "It was there that I really came to this scheme of quantum mechanics."}}, False],
    chapter[{90.3, 111.8}, "1925", "Heisenberg: quantities that do not commute"]};
```

Dirac, at Lindau in 1976, on reading Heisenberg's paper:

```wl
diracPart = {voice["v-dirac", 111.8, {0.36, 13.6}, All, {"Paul Dirac", "lecture at Lindau, 1976"},
        {{0, 10.4, "Well, it was quite a revelation to me when this discovery of Heisenberg was set up,"}, {10.4, 13.3, "and it showed how wrong I was previously."}}],
    chapter[{111.8, 125}, "1925", "Heisenberg\[CloseCurlyQuote]s mechanics reaches Cambridge"]};
```

## 2:05 — 1926: ψ

The music rises.  The first page of Schrödinger's paper, received by the Annalen der Physik on 27 January 1926 -- a hundred years ago -- and ψ: a packet of possibility, travelling and spreading as his equation says; bound, it can only stand, the harmonic oscillator's standing waves, each turning its phase at its own frequency:

```wl
oscillator[n_, x_] := 1 / Sqrt[2^n n! Sqrt[Pi]] HermiteH[n, x] Exp[-x^2 / 2];
oxs = Subdivide[-5., 5., 220];
psiPart = {still[image["schrodinger1926.jpg"], {125, 129.5}, "Annalen der Physik \[CenterDot] received 27 January 1926", 0.12],
    TitleCard["100 years", {125.6, 129.4}, Position -> {1500, 900}, FontSize -> 64, FontWeight -> 700, FontColor -> red, "Tracking" -> 6, "Enter" -> "Rise", "Exit" -> "Fade"],
    shot[{129.5, 134.5}, Function[t, {CanvasLine[{{160, 760}, {1760, 760}}, RGBColor[0.3, 0.3, 0.32], "Thickness" -> 2],
        waveRibbon[packet[xs, 0.9 (t - 129.5), 4, 1], {160, 760, 1600, 520}, 1, Clip[2 (t - 129.5), {0, 1}]]}], "Computed: \[Psi] of a free particle \[Dash] height its size, colour its phase"],
    shot[{134.5, 140}, Function[t, With[{u = t - 134.5}, {
        CanvasLine[Table[{960 + 120 x, 940 - 120 x^2 / 2 0.95}, {x, -4.2, 4.2, 0.1}], RGBColor[0.4, 0.4, 0.42], "Thickness" -> 3],
        Table[With[{lvl = 940 - 120 (n + 1/2) 0.95}, {CanvasLine[{{360, lvl}, {1560, lvl}}, RGBColor[0.25, 0.25, 0.27], "Thickness" -> 1],
            waveRibbon[oscillator[n, oxs] Exp[-I (n + 1/2) 4 u], {360, lvl, 1200, 100}, 1.4, Clip[2 u - n / 3, {0, 1}]]}], {n, 0, 5}]}]], "Computed: the standing waves of a bound particle, one per energy"],
    chapter[{125, 140}, "1926", "Schr\[ODoubleDot]dinger: the wave equation"]};
```

Schrödinger, on radio in 1952: everything, absolutely everything, is at once particle and field.  In the atom its standing waves are the orbitals -- a slice through each of hydrogen's, phase as colour:

```wl
hydrogen[n_, l_, m_, x_, z_] := With[{r = Sqrt[x^2 + z^2] + 10^-9}, (2 r / n)^l Exp[-r / n] LaguerreL[n - l - 1, 2 l + 1, 2 r / n] Re[SphericalHarmonicY[l, m, ArcCos[z / r], 0]]];
orbitalList = {{1, 0, 0}, {2, 0, 0}, {2, 1, 0}, {3, 1, 0}, {3, 2, 0}, {3, 2, 1}, {4, 2, 0}, {4, 3, 0}, {4, 3, 1}, {4, 3, 2}, {5, 3, 1}, {5, 4, 2}};
orbitalName[{n_, l_, m_}] := ToString[n] <> {"s", "p", "d", "f", "g"}[[l + 1]] <> If[l > 0, " m=" <> ToString[m], ""];
orbitalImage[{n_, l_, m_}, px_ : 520] := With[{ext = 2.2 n^2 + 4}, phaseImage[N @ Table[hydrogen[n, l, m, x, z] + 0. I, {z, ext, -ext, -2 ext / (px - 1)}, {x, -ext, ext, 2 ext / (px - 1)}], 0.5]];
orbitals = orbitalImage /@ orbitalList;
GraphicsGrid[Partition[orbitals, 6], ImageSize -> 900]
```

```wl
orbitalShot[t0_] := Function[t, Table[With[{u = Clip[(t - t0 - (k - 1) / 4) 3, {0, 1}], col = Mod[k - 1, 6], row = Quotient[k - 1, 6]}, If[u <= 0, {},
    {CanvasImage[orbitals[[k]], {170 + 270 col, 190 + 330 row, 260, 260}, Opacity -> u],
     CanvasText[orbitalName[orbitalList[[k]]], {175 + 270 col, 480 + 330 row}, sans[24, 400], grey, Opacity -> u]}]], {k, Length[orbitals]}]];
schrodingerPart = {shot[{144, 152.8}, orbitalShot[144], "Computed: hydrogen\[CloseCurlyQuote]s orbitals, slices through \[Psi]"],
    voice["v-schrodinger", 140, {0, 12.8}, {{140, 144}}, {"Erwin Schr\[ODoubleDot]dinger", "radio talk, 1952"},
        {{0, 12.8, "The view now secured is rather that everything, absolutely everything, is at once particle and field."}}]};
```

## 2:33 — Born: Chance

Max Born, interviewed on the day of his Nobel Prize in 1954: today we can predict only with what probability this or that will happen.  |ψ|² is that probability -- an idea he first put in a footnote, added in proof.  Five thousand electrons measured in one orbital, each landing where |ψ|² is bright:

```wl
bornPx = 400; bornExt = 2.2 4^2 + 4;
bornDensity = N @ Table[hydrogen[4, 3, 1, x, z]^2, {z, bornExt, -bornExt, -2 bornExt / (bornPx - 1)}, {x, -bornExt, bornExt, 2 bornExt / (bornPx - 1)}];
bornDots = BlockRandom[SeedRandom[1926]; With[{cells = RandomChoice[Flatten[bornDensity] -> Range[bornPx^2], 5000]},
    ({Mod[# - 1, bornPx], Quotient[# - 1, bornPx]} + RandomReal[{0, 1}, 2]) & /@ cells]];
bornShot[t0_, t1_] := Function[t, With[{n = Round[5000 Clip[(t - t0) / (t1 - t0), {0, 1}]^0.8]}, {
    CanvasImage[orbitals[[9]], {560, 140, 800, 800}, Opacity -> 0.12],
    Table[CanvasDisk[{560, 140} + 800 bornDots[[k]] / bornPx, 2.3, RGBColor["#9FE6FF"], Opacity -> 0.8], {k, n}]}]];
bornFootnote = ImageTake[image["born1926-p865.jpg"], {1830, 2130}, {110, 1370}];
bornPart = {shot[{156.5, 166.8}, bornShot[156.5, 177.8], "Computed: electrons measured in one orbital, landing where |\[Psi]|\.b2 is bright"], still[bornFootnote, {166.8, 172}, "Born\[CloseCurlyQuote]s 1926 footnote: the probability is the square of the wave \[CenterDot] Z. Phys. 37", 0.05], shot[{172, 177.8}, bornShot[156.5, 177.8], "Computed: each dot a measurement"],
    voice["v-born-probability", 152.8, {0, 14}, {{152.8, 156.5}}, {"Max Born", "radio interview, 1954"},
        {{0, 8, "Today, in an atomic experiment, we can predict with what probability this or that will happen."}, {8, 14, "But with complete certainty we can say what will happen only in very few cases."}}],
    voice["v-born-dice", 166.8, {0, 11}, None, {"Max Born", "talk at Lindau, 1965"},
        {{0, 7, "He believed in fixed laws, not in a statistical description of nature."}, {7, 11, "\[OpenCurlyDoubleQuote]God does not play dice,\[CloseCurlyDoubleQuote] said Einstein."}}],
    chapter[{152.8, 177.8}, "1926", "Born: the wave gives probabilities"]};
```

## 2:58 — 1927: Uncertainty

Heisenberg at Lindau in 1953: position or velocity, sharp -- never both.  A packet squeezed in position spreads in momentum; the two are Fourier transforms of each other:

```wl
pxs = Subdivide[-6., 6., 240];
uncertaintyShot = shot[{183, 199.2}, Function[t, With[{s = 0.35 + 0.28 (1 + Sin[0.8 (t - 183)])}, {
    CanvasText["position", {300, 300}, sans[32, 400], grey], CanvasText["momentum", {1080, 300}, sans[32, 400], grey],
    CanvasLine[{{250, 800}, {910, 800}}, RGBColor[0.3, 0.3, 0.32], "Thickness" -> 2], CanvasLine[{{1030, 800}, {1690, 800}}, RGBColor[0.3, 0.3, 0.32], "Thickness" -> 2],
    waveRibbon[Exp[-pxs^2 / (4 s^2) + 3 I pxs] / Sqrt[s], {250, 800, 660, 380}, 0.75, 1],
    waveRibbon[Exp[-pxs^2 s^2 - 0.5 I pxs] Sqrt[s] 1.4, {1030, 800, 660, 380}, 0.75, 1]}]], "Computed: one packet, in position and in momentum \[Dash] narrow in one, wide in the other"];
uncertaintyPart = {uncertaintyShot,
    voice["v-heisenberg-uncertainty", 177.8, {0, 21.4}, {{177.8, 183}}, {"Werner Heisenberg", "lecture at Lindau, 1953"},
        {{0, 8.9, "In quantum theory it turned out that one cannot know, for a particle,"}, {8.9, 13.9, "its position and velocity both exactly at once."},
         {13.9, 18.5, "Either you can fix the position very sharply, and then the velocity is very indeterminate,"}, {18.5, 21.4, "or the velocity sharply, and then the position is known very inaccurately."}}],
    chapter[{177.8, 199.2}, "1927", "Heisenberg: the uncertainty principle"]};
```

## 3:19 — Through Walls

No voice: the music, alpha particles streaking through a cloud chamber, and why they get out of the nucleus at all.  A packet runs at a barrier higher than its energy; part of it leaks through -- tunnelling, Gamow's explanation of alpha decay in 1928 -- solved here step by step by the split-step Fourier method:

```wl
tunnel = Module[{n = 1024, xg = Subdivide[-40., 60., 1023], dx, kg, V, psi, dt = 0.02, frames = {}},
    dx = xg[[2]] - xg[[1]]; kg = 2. Pi Join[Range[0, n / 2 - 1], Range[-n / 2, -1]] / (n dx);
    V = If[0 <= # <= 1.2, 2.4, 0.] & /@ xg;
    psi = packet[xg, 0, 2, 0.035, -16];
    Do[If[Mod[step, 8] == 0, AppendTo[frames, psi]];
        psi = Exp[-I V dt / 2] psi; psi = InverseFourier[Exp[-I kg^2 dt / 2] Fourier[psi]]; psi = Exp[-I V dt / 2] psi, {step, 0, 1039}];
    <|"x" -> xg, "Frames" -> frames|>];
tunnelView = {150, 700}; barrierX = 120 + 1680 (First[FirstPosition[tunnel["x"], _ ? (# >= 0 &)]] - tunnelView[[1]]) / (tunnelView[[2]] - tunnelView[[1]]);
tunnelShot = shot[{203.5, 207.5}, Function[t, With[{f = tunnel["Frames"][[Clip[Round[1 + 129 (t - 203.5) / 4], {1, 130}]]]}, {
    CanvasLine[{{120, 780}, {1800, 780}}, RGBColor[0.3, 0.3, 0.32], "Thickness" -> 2],
    CanvasRectangle[{barrierX, 480, 1680 1.2 / ((tunnelView[[2]] - tunnelView[[1]]) 100 / 1023), 300}, RGBColor[0.55, 0.55, 0.58], Opacity -> 0.55],
    waveRibbon[f[[tunnelView[[1]] ;; tunnelView[[2]]]], {120, 780, 1680, 500}, 1.05, 1]}]], "Computed: a wave packet meets a wall higher than its energy, and partly passes"];
wallsPart = {footage["f-alpha", {199.2, 203.5}, {6, 10.3}, "Alpha particles tunnelling out of nuclei, tracked in a cloud chamber"], tunnelShot, footage["f-cosmic", {207.5, 211}, {20, 23.5}, "Cosmic rays in a cloud chamber"],
    chapter[{199.2, 211}, "1928", "Gamow: particles tunnel through walls"]};
```

## 3:31 — 1935 to 1982: Entanglement

John Bell, on BBC television in 1986, with his socks: correlations are no puzzle if the socks are there before you look -- but a mystery if looking at one makes the other blue.  The picture: a real source of entangled photon pairs, a cone of down-converted light; Schrödinger's cat as a Wigner function, alive and dead at once, its fringes between them going negative:

```wl
wigner[x_, p_, a_, fringe_] := (Exp[-(x - a)^2 - p^2] + Exp[-(x + a)^2 - p^2] + 2 fringe Exp[-x^2 - p^2] Cos[2 a p]) / (2 Pi (1 + fringe Exp[-a^2]));
wignerColour = Function[{x, p, w}, Blend[{{-0.12, red}, {-0.02, RGBColor[0.55, 0.12, 0.08]}, {0, RGBColor[0.2, 0.22, 0.26]}, {0.12, blue}, {0.3, White}}, w]];
wignerFrame[fringe_, angle_] := Rasterize[Plot3D[wigner[x, p, 2.2, fringe], {x, -4.5, 4.5}, {p, -3, 3}, PlotRange -> {-0.16, 0.34}, BoxRatios -> {1.5, 1, 0.75}, Mesh -> None, PlotPoints -> 80,
    ColorFunction -> wignerColour, ColorFunctionScaling -> False, Boxed -> False, Axes -> False, Lighting -> "Neutral", ViewPoint -> {1.7 Cos[angle], 1.7 Sin[angle], 1.0},
    SphericalRegion -> True, Background -> None, ImageSize -> 1300], "Image", Background -> None];
catFrames = Table[wignerFrame[1, -1.2 + 0.6 k / 29], {k, 0, 29}];
First[catFrames]
```

Then Alain Aspect, in 1985, three years after his experiment: Bell's inequalities violated, so the photon's polarisation was not there before it was measured.  The bound any local world keeps, 2, and what quantum mechanics reaches, 2√2, computed for a Bell state measured along the optimal directions:

```wl
pauli = PauliMatrix /@ {1, 3};
along[th_] := Cos[th] pauli[[2]] + Sin[th] pauli[[1]];
bell = Normal[QuantumState["PhiPlus"]["StateVector"]];
corr[a_, b_] := Re[Conjugate[bell] . KroneckerProduct[along[a], along[b]] . bell];
chsh = corr[0, Pi / 4] + corr[0, -Pi / 4] + corr[Pi / 2, Pi / 4] - corr[Pi / 2, -Pi / 4]
```

```wl
bellShot = shot[{228, 234}, Function[t, With[{v = chsh Easing["OutCubic"][Clip[(t - 228.3) / 2.5, {0, 1}]]}, {
    CanvasRectangle[{360, 500, 1200, 64}, RGBColor[0.18, 0.18, 0.2], "Radius" -> 32], CanvasRectangle[{360, 500, 1200 v / 3, 64}, If[v > 2, red, blue], "Radius" -> 32],
    CanvasLine[{{360 + 1200 2 / 3, 460}, {360 + 1200 2 / 3, 604}}, boneC, "Thickness" -> 4],
    CanvasText["any local world: at most 2", {360 + 800 - 170, 440}, sans[32, 400], grey],
    CanvasText[If[v > 2.8, "quantum: 2\[Sqrt]2 = 2.83", TextString[Round[v, 0.01]]], {360 + 1200 v / 3 - 160, 670}, sans[46], boneC]}]], "Computed: Bell\[CloseCurlyQuote]s test for an entangled pair (CHSH)"];
entanglePart = {footage["f-spdc", {215, 219}, {0, 4}, "A laser making entangled photon pairs: the cone of down-converted light"], shot[{219, 224.1}, Function[t, CanvasImage[catFrames[[Clip[1 + Floor[29 (t - 219) / 5.1], {1, 30}]]], {310, 60, 1300, 975}]], "Computed: Schr\[ODoubleDot]dinger\[CloseCurlyQuote]s cat \[Dash] two states at once, and their interference"],
    voice["v-bell-socks", 211, {0.4, 13.5}, {{211, 215}}, {"John Bell", "BBC television, 1986"},
        {{0, 6.8, "So correlations like that are not a puzzle, provided you admit the socks are really there before you look at them."},
         {6.8, 13.1, "It's a mystery if looking at one sock makes the other one blue at the same time."}}],
    bellShot, footage["f-spdc", {234, 240.9}, {1.2, 8}, "Entangled photon pairs"],
    voice["v-aspect", 224.1, {0, 16.8}, {{224.1, 228}}, {"Alain Aspect", "documentary film, 1985"},
        {{0, 6, "And we have found experimental results violating Bell's inequalities."}, {6, 16.8, "So we are compelled to reject the idea that the polarisation of the photon was already existing just after the emission."}}],
    chapter[{211, 240.9}, "1935 \[Dash] 1982", "Entanglement: from Einstein\[CloseCurlyQuote]s doubt to Bell\[CloseCurlyQuote]s test"]};
```

## 4:01 — Nobody Understands

Feynman, 1964.  And while he warns against asking how it can be like that, his own picture of it: a particle goes from A to B along every path at once, each an arrow turned by its action; far from the classical path they spin and cancel, near it they agree:

```wl
paths = BlockRandom[SeedRandom[1948]; Table[With[{w = Accumulate[RandomVariate[NormalDistribution[0, 1], 80]]}, With[{bridge = w - Range[80] / 80 Last[w]}, (k / 40.) bridge / Max[Abs[bridge]]]], {k, 1, 40}]];
pathAction[y_] := Total[Differences[y]^2] 600;
cornu = Table[{FresnelC[s], FresnelS[s]}, {s, -3.5, 3.5, 0.01}];
pathShot = shot[{249, 257.5}, Function[t, With[{u = Clip[(t - 249.2) / 4, {0, 1}]}, {
    Table[With[{y = paths[[k]]}, CanvasLine[Table[{260 + 1000 (j - 1) / 79, 480 + 170 y[[j]] Sin[Pi (j - 1) / 79]^0.5}, {j, 80}], Hue[Mod[pathAction[y], 1], 0.8, 0.9], "Thickness" -> 2,
        Opacity -> 0.5 Clip[3 u - k / 40, {0, 1}]]], {k, 40}],
    CanvasLine[{{260, 480}, {1260, 480}}, boneC, "Thickness" -> 5, Opacity -> u],
    CanvasDisk[{260, 480}, 12, boneC], CanvasDisk[{1260, 480}, 12, boneC], CanvasText["A", {240, 550}, sans[36], boneC], CanvasText["B", {1245, 550}, sans[36], boneC],
    CanvasLine[{1560, 480} + 280 # - {140, 140} & /@ Take[cornu, Max[2, Round[u Length[cornu]]]], red, "Thickness" -> 3]}]], "Computed: every path from A to B, and their arrows summing to one"];
feynmanPart = {voice["v-feynman-nobody", 240.9, {0, 4.9}, All, {"Richard Feynman", "lecture at Cornell, 1964"},
        {{0, 4.9, "On the other hand, I think I can safely say that nobody understands quantum mechanics."}}],
    pathShot, voice["v-feynman-drain", 245.8, {0, 11.7}, {{245.8, 249}}, {"Richard Feynman", "lecture at Cornell, 1964"},
        {{0, 4.5, "Don't keep saying to yourself, if you can possibly avoid it, \[OpenCurlyDoubleQuote]But how can it be like that?\[CloseCurlyDoubleQuote]"},
         {4.5, 9.8, "Because you'll get down the drain, into a blind alley from which nobody has yet escaped."}, {9.8, 11.7, "Nobody knows how it can be like that."}}],
    chapter[{240.9, 257.5}, "1948", "Feynman: every path at once"]};
```

## 4:17 — The World It Built

What it became: laser light (a US Information Agency film), the magnetic resonance of spins in a living body, and atoms cooled until they share one wave (NASA's Cold Atom Lab):

```wl
builtPart = {footage["f-laser", {261, 266}, {64, 69}, "US Information Agency film: laser light"], footage["f-mri", {266, 273.4}, {0, 7.4}, "Real-time MRI of a child speaking: the spins of the body\[CloseCurlyQuote]s protons"],
    voice["v-nasa-bec", 257.5, {0.4, 16.3}, {{257.5, 261}}, {"Jim Kohel", "NASA Cold Atom Lab, 2018"},
        {{0, 5.4, "These wispy clouds of atoms behave in very strange ways."}, {5.4, 9.4, "They're no longer distinguishable as individual particles."},
         {9.4, 15.9, "You really have to describe it more like atoms acting collectively, as a wave."}}],
    chapter[{257.5, 273.4}, "1960 \[Dash] 1995", "What it built: lasers, MRI, atoms in one wave"]};
```

## 4:33 — Computing with ψ

In May 1981 Feynman gave the talk that started quantum computing; no recording of it is known, only the paper.  Then the people who built the field: John Preskill on why it matters, Peter Shor on the algorithm that made it urgent, David Wineland on the ions he controls one by one, John Martinis, Hartmut Neven and Google's team on the first machines to beat a supercomputer, and Julian Kelly on Willow, in 2024.  The pictures: IBM's and Google's machines, and what they compute -- qubits on Bloch spheres, the quantum Fourier transform at the heart of Shor's algorithm, drawn by the Wolfram Quantum Framework, and Grover's search, amplitude flowing onto the answer:

```wl
feynmanQuote = shot[{273.4, 280.4}, Function[t, With[{u = Clip[(t - 273.6) 1.2, {0, 1}]}, {
    CanvasText["\[OpenCurlyDoubleQuote]Nature isn\[CloseCurlyQuote]t classical, dammit,", {260, 400}, serif[66, True], boneC, Opacity -> u],
    CanvasText["and if you want to make a simulation of nature,", {260, 490}, serif[66, True], boneC, Opacity -> u],
    CanvasText["you\[CloseCurlyQuote]d better make it quantum mechanical.\[CloseCurlyDoubleQuote]", {260, 580}, serif[66, True], red, Opacity -> Clip[(t - 274.6) 1.2, {0, 1}]],
    CanvasText["Richard Feynman, \[OpenCurlyDoubleQuote]Simulating Physics with Computers\[CloseCurlyDoubleQuote], MIT, May 1981", {262, 690}, sans[30, 400], grey, Opacity -> u]}]],
    "Written: no recording of this talk is known"];
qft = Rasterize[QuantumCircuitOperator["Fourier", 4]["Diagram"], "Image", ImageResolution -> 216, Background -> White];
qftShot = shot[{297, 306.3}, Function[t, With[{d = ImageDimensions[qft], u = Clip[(t - 297) 1.5, {0, 1}]}, With[{s = Min[1500 / d[[1]], 640 / d[[2]]]}, {
    CanvasRectangle[{960 - s d[[1]] / 2 - 30, 520 - s d[[2]] / 2 - 30, s d[[1]] + 60, s d[[2]] + 60}, White, "Radius" -> 12, Opacity -> u],
    CanvasImage[qft, {960 - s d[[1]] / 2, 520 - s d[[2]] / 2, s d[[1]], s d[[2]]}, Opacity -> u]}]]],
    "Computed: the quantum Fourier transform on four qubits, at the heart of Shor\[CloseCurlyQuote]s algorithm (Wolfram Quantum Framework)"];
blochSphere[{cx_, cy_}, r_, th_, ph_, colour_] := {CanvasDisk[{cx, cy}, r, RGBColor[0.3, 0.3, 0.32], "Stroke" -> 2],
    CanvasLine[Table[{cx + r Cos[s], cy + 0.3 r Sin[s]}, {s, 0, 2 Pi, 0.1}], RGBColor[0.3, 0.3, 0.32], "Thickness" -> 1.5],
    CanvasLine[{{cx, cy}, {cx + r Sin[th] Cos[ph], cy - r Cos[th] + 0.3 r Sin[th] Sin[ph]}}, colour, "Thickness" -> 6],
    CanvasDisk[{cx + r Sin[th] Cos[ph], cy - r Cos[th] + 0.3 r Sin[th] Sin[ph]}, 10, colour]};
blochShot = shot[{322.5, 327.5}, Function[t, Table[blochSphere[{360 + 400 j, 540}, 160, Pi (0.5 + 0.45 Sin[0.9 t + j]), 1.2 t + j, Hue[j / 4, 0.7, 0.95]], {j, 0, 3}]],
    "Computed: four qubits, each a point on a sphere \[Dash] zero at the top, one at the bottom, anything between"];
grover[k_] := With[{th = ArcSin[1 / 4.]}, With[{p = Sin[(2 k + 1) th]^2}, ReplacePart[ConstantArray[(1 - p) / 15, 16], 11 -> p]]];
groverShot = shot[{358, 366.3}, Function[t, With[{k = Clip[Floor[(t - 358) / 2], {0, 3}], u = Clip[FractionalPart[(t - 358) / 2] / 0.6, {0, 1}]}, With[{p = (1 - u) grover[Max[0, k - 1]] + u grover[k]},
    {Table[CanvasRectangle[{420 + 70 (j - 1), 900 - 640 p[[j]], 56, 640 p[[j]]}, If[j == 11, red, blue]], {j, 16}],
     CanvasText["step " <> ToString[k], {420, 960}, sans[30, 400], grey]}]]], "Computed: Grover\[CloseCurlyQuote]s search over 16 answers \[Dash] each step pours amplitude onto the right one"];
computingPart = {feynmanQuote,
    footage["f-ibm-system-two", {284, 293.3}, {60, 69.3}, "IBM Quantum System Two, 2023 \[CenterDot] IBM Research"],
    voice["v-preskill", 280.4, {8.04, 20.9}, {{280.4, 284}}, {"John Preskill", "Caltech, 2016"},
        {{0, 5.2, "To a physicist, what's really important about quantum computing is that we think, though we don't know this for sure,"},
         {5.2, 12.9, "that a quantum computer would be able to efficiently simulate any process that occurs in nature."}}],
    qftShot, voice["v-shor", 293.3, {4.3, 17.3}, {{293.3, 297}}, {"Peter Shor", "interview, 2020"},
        {{0, 8.4, "What I did was, I looked at Dan Simon's algorithm and figured out how to take some of the techniques from it, and add some more,"},
         {8.4, 13, "and show how to factor large numbers into primes on a quantum computer."}}],
    voice["v-wineland", 306.3, {0, 13}, All, {"David Wineland", "NIST, after his 2012 Nobel Prize"},
        {{0, 13, "With this idea of superposition, we can put our atoms or ions in these states where they're simultaneously both a zero and a one."}}],
    blochShot, voice["v-martinis", 319.3, {0, 8.2}, {{319.3, 322.5}}, {"John Martinis", "Google, 2019"},
        {{0, 8.2, "The classical bit stores information as a zero or one, and a quantum bit can be both zero and one at the same time."}}],
    footage["f-sycamore", {330, 340.7}, {56, 66.7}, "Google\[CloseCurlyQuote]s Sycamore and its dilution refrigerator, 2019 \[CenterDot] Google Quantum AI (CC BY)"],
    voice["v-google-promise", 327.5, {0, 13.2}, {{327.5, 330}}, {"Google Quantum AI", "Demonstrating Quantum Supremacy, 2019"},
        {{0, 13.2, "The tantalizing promise of quantum computers is that they can do certain tasks exponentially faster than classical machines."}}],
    voice["v-neven", 340.7, {0, 6}, All, {"Hartmut Neven", "Google, 2019"},
        {{0, 6, "The nice thing about quantum supremacy is that it is a very well-defined engineering milestone."}}],
    footage["f-willow", {350, 358}, {30, 38}, "Willow, Google\[CloseCurlyQuote]s 105-qubit chip, 2024"], groverShot,
    voice["v-willow", 346.7, {10.2, 29.9}, {{346.7, 350}}, {"Julian Kelly", "Google Quantum AI, 2024"},
        {{0, 5.4, "By our best estimates, a calculation that takes Willow under five minutes"}, {5.4, 11.1, "would take the fastest supercomputer ten to the twenty-five years."},
         {11.1, 15.9, "That's a one with twenty-five zeros following it,"}, {15.9, 19.7, "or a timescale way longer than the age of the universe."}}],
    footage["f-ibm-system-two", {366.3, 372}, {80, 85.7}, "IBM Quantum System Two \[CenterDot] IBM Research"],
    chapter[{273.4, 372}, "1981 \[Dash] 2026", "Computing with \[Psi]"]};
```

## 6:12 — Nobody Knows

Anton Zeilinger, in his Nobel lecture of 2022, on the two slits: the fringes arise only if nothing at all can say which way the particle went -- not even God.  The screen from the beginning, completing:

```wl
zeilingerPart = {footage["f-electrons", {380.5, 386.4}, {48, 72}, "The electrons from the beginning, the pattern complete \[CenterDot] Bach et al., 2013", 0.05],
    voice["v-zeilinger", 372, {0, 14.4}, {{376.5, 380.5}}, {"Anton Zeilinger", "Nobel lecture, 2022"},
        {{0, 7.4, "The fringes back there only arise if you can say nothing about which path they went."}, {7.4, 14.4, "They themselves don't know it, nobody in the universe knows it, and I say even God doesn't know it."}}],
    footage["f-electrons", {372, 376.5}, {20, 40}, "Electrons through two slits \[CenterDot] Bach et al., 2013", 0.05],
    chapter[{372, 386.4}, "2022", "Nobel Prize to Aspect, Clauser and Zeilinger, for entanglement"]};
```

## 6:26 — Outro

ψ alone, drifting; the century; the credits:

```wl
credits = {"Voices", "Max Planck (film portrait, 1942) \[CenterDot] Niels Bohr (Lindau Nobel Laureate Meetings, 1962)",
    "Louis de Broglie (INA, 1967) \[CenterDot] Werner Heisenberg (CBC, early 1970s; Lindau, 1953) \[CenterDot] Paul Dirac (Lindau, 1976)",
    "Erwin Schr\[ODoubleDot]dinger (SWR, 1952) \[CenterDot] Max Born (rbb, 1954; BR, 1965) \[CenterDot] John Bell (BBC / Open University, 1986)",
    "Alain Aspect (Jorlunde Film, 1985) \[CenterDot] Richard Feynman (BBC / Cornell Messenger Lectures, 1964)",
    "Jim Kohel (NASA) \[CenterDot] John Martinis (Google, CC BY) \[CenterDot] Anton Zeilinger (Nobel Prize Outreach, 2022)", "",
    "Footage", "Bach, Pope, Liou, Batelaan 2013 (CC BY) \[CenterDot] PSSC films, 1961\[Dash]62 \[CenterDot] Wikimedia Commons contributors (CC BY / BY-SA)",
    "US Information Agency \[CenterDot] NASA \[CenterDot] IBM Research \[CenterDot] Google Quantum AI \[CenterDot] Denys Bondar \[CenterDot] Hirsch, Frahm, Sorge et al.",
    "Library of Congress \[CenterDot] Friedrich Hund \[CenterDot] Internet Archive", "",
    "Short quotations of copyrighted recordings, for a non-commercial educational film", "Computed and composed in Wolfram Language with WAnim"};
creditFont[s_] := If[MemberQ[{"Voices", "Footage"}, s], sans[34], sans[26, 400]];
outroPart = {shot[{386.4, 402.4}, Function[t, waveRibbon[packet[xs, 0.35 (t - 386.4), 3, 0.7, 2], {160, 640, 1600, 400}, 1, Clip[1 - (t - 392.4) / 1.2, {0, 1}]]], ""],
    TitleCard["1926 \[Dash] 2026", {386.9, 392.7}, Position -> {960, 300}, FontSize -> 96, FontColor -> boneC, "Enter" -> "Rise", "Exit" -> "Fade"],
    {392.9, 402.4} -> Function[t, With[{y0 = 1100 - 150 (t - 392.9)}, CanvasOpacity[Clip[(t - 392.9) 3, {0, 1}] Clip[(402.4 - t) 2, {0, 1}],
        MapIndexed[If[#1 === "", {}, CanvasText[#1, {960 - CanvasTextWidth[#1, creditFont[#1]] / 2, y0 + 52 #2[[1]]}, creditFont[#1],
            If[MemberQ[{"Voices", "Footage"}, #1], red, boneC]]] &, credits]]]]};
```

## The Score

The music sits beneath the voices -- ducked under each -- and comes forward three times: hydrogen's chord, the wave equation, the end.  Its harmony walks Am, F, Dm, E, a chord every four seconds:

```wl
chordAt[s_] := {{57, 60, 64}, {53, 57, 60}, {50, 53, 57}, {52, 56, 59}}[[Mod[Floor[s / 4], 4] + 1]];
rootAt[s_] := {45, 41, 38, 40}[[Mod[Floor[s / 4], 4] + 1]];
rises = {{70, 80}, {125, 140}, {199.2, 211}, {273.4, 280.4}, {386.4, 402.4}};
rising[s_] := AnyTrue[rises, #[[1]] <= s < #[[2]] &];
pad = Track[Flatten[Table[{s, 4, #, If[rising[s], 0.75, 0.42]} & /@ chordAt[s], {s, 16, 398, 4}], 1]];
bass = Track[Table[{s, 2, rootAt[s], If[rising[s], 0.85, 0.5]}, {s, 18, 400, 2}]];
pulse = Track[{#, 1/4, "bd", 0.7} & /@ Join[Range[125, 139.5, 1], Range[199.2, 210.5, 1], Range[386.4, 393.4, 1]]];
hats = Track[{#, 1/8, "hh", 0.35} & /@ Join[Range[125.5, 139.5, 0.5], Range[199.7, 210.7, 0.5]]];
clicks = Track[{#, 1/16, "hh", 0.8} & /@ BlockRandom[SeedRandom[1964]; Sort[RandomReal[{0.2, 13.4}, 40]]]];
hook = {{0, 2, 69}, {2, 1, 72}, {3, 1, 76}, {4, 2, 74}, {6, 2, 72}, {8, 2, 77}, {10, 1, 76}, {11, 1, 74}, {12, 3, 76}};
lead = Track[Join[{129.5 + #1 / 2, #2 / 2, #3, 0.7} & @@@ hook, {387.4 + #1 / 2, #2 / 2, #3, 0.6} & @@@ hook]];
atomBells = Track[Join[Table[{74 + k / 2, 3, balmerPitch[[k + 1]] + 12, 0.85}, {k, 0, 3}], Table[{394.4 + k / 2, 4, balmerPitch[[k + 1]] + 12, 0.6}, {k, 0, 3}]]];
crashes = Track[{#, 2, "cr", 0.6} & /@ {70, 125, 199.2, 273.4, 386.4}];
risers = Track[{{122, 3, 60, 0.9}, {196.5, 2.7, 60, 0.8}}];
score = Mixer["FadeOut" -> 3][Track[{Instrument["Pad"][pad], Instrument["Bass"][bass], Instrument["SoftKick"][pulse], Instrument["Hat"][hats], Instrument["Hat"][clicks],
    Instrument["Lead"][lead], Instrument["Bell"][atomBells], Instrument["Crash"][crashes], Instrument["Riser"][risers]}]];
TrackView["PianoRoll", "Cycles" -> 16][TrackShift[-124][Track[{pad, lead}]]]
```

## The Film

The edit: every part over the dark ground, the score beneath, six and a half minutes at twenty-four frames a second:

```wl
film = AnimatedGraphics[{Backdrop[inkC], coldOpen, planckPart, photoPart, atomPart, deBrogliePart, helgolandPart, diracPart, psiPart, schrodingerPart, bornPart,
    uncertaintyPart, wallsPart, entanglePart, feynmanPart, builtPart, computingPart, zeilingerPart, outroPart, score}, "Duration" -> 402.4, "CyclesPerSecond" -> 1, FrameRate -> 24]
```

Twelve moments of it:

```wl
GraphicsGrid[Partition[film[#, ImageSize -> 400] & /@ {5, 16, 29, 60, 77, 85, 107, 132, 150, 188, 220, 276, 300, 335, 360, 390}, 3], ImageSize -> 1200]
```

Render it, frames in parallel, and store it in the cloud, public:

```wl
Export["Quantum.mp4", film];
video = Video[CopyFile["Quantum.mp4", CloudObject["WolframFilm/Quantum.mp4", Permissions -> "Public"], OverwriteTarget -> True]]
```

## References

[1] Every clip used, its source, moment, transcript and rights: [CLIPS.md](https://github.com/WolframInstitute/WolframFilm/blob/main/films/Quantum/docs/CLIPS.md); every date and paper: [SOURCES.md](https://github.com/WolframInstitute/WolframFilm/blob/main/films/Quantum/docs/SOURCES.md)

[2] R. Bach, D. Pope, S.-H. Liou, H. Batelaan, [Controlled double-slit electron diffraction](https://doi.org/10.1088/1367-2630/15/3/033018), New Journal of Physics 15, 033018 (2013)

[3] E. Schrödinger, [Quantisierung als Eigenwertproblem](https://doi.org/10.1002/andp.19263840404), Annalen der Physik 79, 361 (1926); M. Born, [Zur Quantenmechanik der Stoßvorgänge](https://doi.org/10.1007/BF01397477), Zeitschrift für Physik 37, 863 (1926)

[4] W. Heisenberg, [Über quantentheoretische Umdeutung](https://doi.org/10.1007/BF01328377), Zeitschrift für Physik 33, 879 (1925); [Über den anschaulichen Inhalt](https://doi.org/10.1007/BF01397280), Zeitschrift für Physik 43, 172 (1927)

[5] J. S. Bell, [On the Einstein Podolsky Rosen paradox](https://doi.org/10.1103/PhysicsPhysiqueFizika.1.195), Physics 1, 195 (1964); A. Aspect, J. Dalibard, G. Roger, [Experimental Test of Bell's Inequalities Using Time-Varying Analyzers](https://doi.org/10.1103/PhysRevLett.49.1804), PRL 49, 1804 (1982)

[6] R. P. Feynman, [The Character of Physical Law](https://archive.org/details/the-messenger-lectures), Messenger Lectures, Cornell, 1964; [Space-Time Approach to Non-Relativistic Quantum Mechanics](https://doi.org/10.1103/RevModPhys.20.367), RMP 20, 367 (1948)

[7] [The Nobel Prize in Physics 2022](https://www.nobelprize.org/prizes/physics/2022/summary/); [The International Year of Quantum Science and Technology](https://quantum2025.org/about-iyq-2025/)
