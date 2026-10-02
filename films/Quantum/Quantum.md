---
Template: ComputationalEssay
Name: "ψ — The Quantum Century"
Author: Nikolay Murzin
Date: 2026
Description: "A short documentary about a hundred years of quantum theory, told in the voices of the people who made it, over real experiments and computed pictures, made entirely in this notebook with WAnim"
Abstract: "In January 1926 Schrödinger wrote down the equation of a wave no one had seen. This notebook makes an eight-minute documentary about the century since, narrated only by recordings of the physicists themselves -- Planck, Bohr, de Broglie, Heisenberg, Dirac, Schrödinger, Born, Bell, Aspect, Feynman, the builders of quantum computers and their skeptics -- over film of real experiments and pictures computed here: the blackbody curve, hydrogen's orbitals, a wave packet tunnelling through a wall, entangled pairs measured far apart."
Keywords: [WAnim, documentary, quantum mechanics, wave function, Schrödinger equation, archival film, hydrogen, entanglement]
Sources: ["[WAnim](https://github.com/sw1sh/WAnim)", "[The film's clips and their sources](https://github.com/WolframInstitute/WolframFilm/blob/main/films/Quantum/docs/CLIPS.md)", "[The facts, checked](https://github.com/WolframInstitute/WolframFilm/blob/main/films/Quantum/docs/SOURCES.md)"]
Links: ["[What Is a Computational Essay?](https://writings.stephenwolfram.com/2017/11/what-is-a-computational-essay/)"]
---

## A Film Told by Its Physicists

This documentary has no narrator.  Its story is told by the people who made quantum theory, in recordings from 1942 to 2026: a film portrait of Max Planck, Niels Bohr's last lecture, Louis de Broglie on French television, Werner Heisenberg in a Canadian interview, Erwin Schrödinger and Max Born on German radio, John Bell and Alain Aspect on film, Richard Feynman's Messenger lectures; then the builders of quantum computers, and the skeptics of their bubble -- Scott Aaronson, Sabine Hossenfelder, Gil Kalai, and Jensen Huang, whose one remark erased 40% of the industry's value in a day.  Between their words the pictures are real experiments -- electrons arriving one by one, glowing steel, ultraviolet light discharging a zinc plate, electron diffraction rings, cloud-chamber tracks, a quantum processor -- and computed ones, the physics they describe solved in this notebook.

The film is made with WAnim; its archival clips play with ArchiveClip, which puts a film's picture in the frame and its voice in the soundtrack, the music ducked beneath:

```wl
PacletInstall["WolframInstitute/WAnim"]; PacletInstall["Wolfram/QuantumFramework"];
Needs["WolframInstitute`WAnim`"]; Needs["Wolfram`QuantumFramework`"];
```

The clips are cut from their sources (listed, with their rights, in the film's [CLIPS.md](https://github.com/WolframInstitute/WolframFilm/blob/main/films/Quantum/docs/CLIPS.md)) and kept beside the film in the cloud:

```wl
archive[name_String] := "https://www.wolframcloud.com/obj/wolframinstitute/WolframFilm/Quantum/archive/" <> name;
(* a photograph or a table from the archive, downloaded once into a cache on this computer (and kept only
   when it came whole), so the film does not depend on the cloud answering every time it is evaluated *)
cached[name_String] := Module[{f = FileNameJoin[{$UserBaseDirectory, "ApplicationData", "WolframFilm", "Quantum", name}], r},
    If[! FileExistsQ[f], Quiet @ CreateDirectory[DirectoryName[f], CreateIntermediateDirectories -> True];
        Do[r = Quiet @ URLDownload[archive[name], f <> ".part", {"StatusCode", "Headers"}];
            If[AssociationQ[r] && r["StatusCode"] === 200 && FileByteCount[f <> ".part"] === Replace[Lookup[KeyMap[ToLowerCase, Association[r["Headers"]]], "content-length", None], {l_String :> FromDigits[l], _ -> FileByteCount[f <> ".part"]}],
                RenameFile[f <> ".part", f]; Break[]], {4}]];
    f];
image[name_String] := Import[cached[name]];
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
footage[name_, {t0_, t1_}, {in_, out_}, caption_, zoom_ : 0.04, crop_ : None] := With[{r = (out - in) / (t1 - t0)},
    ArchiveClip[archive[name <> ".mp4"], {t0 - fade / 2, t1 + fade / 2}, "From" -> Max[0, in - r fade / 2], "To" -> out + r fade / 2, "Style" -> "Full",
        "Sound" -> False, "Zoom" -> zoom, "Fade" -> fade, "Caption" -> caption, "Enter" -> "Cut", "Exit" -> "Cut", "Crop" -> crop]];
```

A still photograph or a page is shown the same way, pushing in slowly; a computed shot is a function of time on the dark ground, captioned too; each chapter names its time and its subject in the top corner.  Mathematics in a caption or a title is typeset in TeX between dollars:

```wl
dissolve[{t0_, t1_}][t_] := Clip[Min[(t - t0 + fade / 2) / fade, (t1 + fade / 2 - t) / fade], {0, 1}];
captionBox[""] := {};
captionBox[c_] := With[{f = sans[24, 400]}, With[{w = CanvasTeXWidth[c, f]},
    {CanvasRectangle[{1920 - w - 116, 66, w + 40, 44}, Black, Opacity -> 0.45, "Radius" -> 4], CanvasTeX[c, {1920 - w - 96, 96}, f, RGBColor["#D8D4CC"]]}]];
still[img_, {t0_, t1_}, caption_, zoom_ : 0.06] := With[{cb = captionBox[caption]}, {t0 - fade / 2, t1 + fade / 2} -> Function[t, With[{d = ImageDimensions[img], z = 1 + zoom (t - t0) / (t1 - t0)},
    With[{s = z Min[1920 / d[[1]], 1080 / d[[2]]]}, CanvasOpacity[dissolve[{t0, t1}][t], {CanvasRectangle[{0, 0, 1920, 1080}, inkC],
        CanvasClip[{0, 0, 1920, 1080}, CanvasImage[img, {960 - s d[[1]] / 2, 540 - s d[[2]] / 2, s d[[1]], s d[[2]]}]], cb}]]]]];
shot[{t0_, t1_}, f_, caption_] := With[{cb = captionBox[caption]}, {t0 - fade / 2, t1 + fade / 2} -> Function[t, CanvasOpacity[dissolve[{t0, t1}][t], {CanvasRectangle[{0, 0, 1920, 1080}, inkC], f[t], cb}]]];
(* text with $math$ broken into lines no wider than w, each formula kept whole *)
texWrap[s_, f_, w_] := Module[{lines = {}, cur = ""},
    Do[With[{c = If[cur === "", wd, cur <> " " <> wd]}, If[CanvasTeXWidth[c, f] > w && cur =!= "", AppendTo[lines, cur]; cur = wd, cur = c]], {wd, StringSplit[s, " "]}];
    Append[lines, cur]];
pageTour[img_, keys_, {t0_, t1_}, caption_] := With[{cb = captionBox[caption], d = ImageDimensions[img], typeset = CanvasTeXWidth[#[[5]], serif[40, True]] & /@ keys}, {t0 - fade / 2, t1 + fade / 2} -> Function[t,
    Module[{k = Max[1, LengthWhile[keys, #[[1]] <= t &]], u, c, h, s, toCanvas},
        (* the view glides from one key to the next over its first 0.8 s *)
        u = If[k == 1, 1, Easing["InOutCubic"][Clip[(t - keys[[k, 1]]) / 0.8, {0, 1}]]];
        {c, h} = If[k == 1, keys[[1, {2, 3}]], {keys[[k - 1, 2]] + u (keys[[k, 2]] - keys[[k - 1, 2]]), keys[[k - 1, 3]] + u (keys[[k, 3]] - keys[[k - 1, 3]])}];
        s = 1080 / h; toCanvas[{x_, y_}] := {960 + s (x - c[[1]]), 540 + s (y - c[[2]])};
        CanvasOpacity[dissolve[{t0, t1}][t], {CanvasRectangle[{0, 0, 1920, 1080}, inkC],
            CanvasClip[{0, 0, 1920, 1080}, CanvasImage[img, Join[toCanvas[{0, 0}], s d]]],
            (* the German line, marked, and what it says *)
            With[{a = Clip[(t - keys[[k, 1]] - 0.7) / 0.4, {0, 1}]}, If[a > 0 && keys[[k, 5]] =!= "", {
                Table[With[{p0 = toCanvas[r[[1]]], p1 = toCanvas[r[[2]]]}, CanvasRectangle[Join[p0, p1 - p0], amber, Opacity -> 0.22 a]], {r, keys[[k, 4]]}],
                With[{lines = texWrap[keys[[k, 5]], serif[40, True], 1480]}, {
                    CanvasRectangle[{180, 860 - 54 Length[lines] - 30, 1560, 54 Length[lines] + 40}, Black, Opacity -> 0.78 a, "Radius" -> 8],
                    MapIndexed[CanvasTeX[#1, {960, 860 - 54 (Length[lines] - #2[[1]]) - 4}, serif[40, True], White, Alignment -> Center, Opacity -> a] &, lines]}]}, {}]],
            cb}]]]];
chapter[{t0_, t1_}, y_, what_] := {t0, t1} -> Function[t, CanvasOpacity[Clip[Min[(t - t0) / 0.4, (t1 - t) / 0.4], {0, 1}],
    {CanvasText[y, {96, 96}, sans[44, 700], red], CanvasTeX[what, {96, 142}, sans[28, 400], boneC]}]];
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

## The Studio

The computed shots are drawn in depth: a perspective camera (CanvasCamera) turns points, curves and surfaces in space into canvas primitives drawn far to near, lines and dots glow, and a hot body glows radially.  A few shared pieces -- a slowly orbiting camera, glowing axes, and the colours of the film's physics:

```wl
{cyan, amber, violet} = RGBColor /@ {"#7FE3FF", "#FFC857", "#B39DFF"};
orbit[t_, t0_, opts___] := CanvasCamera[opts, "Azimuth" -> 0.55 + 0.06 (t - t0)];
glowText[s_, {x_, y_}, f_, c_, a_ : 1] := {CanvasText[s, {x, y}, f, c, Opacity -> 0.25 a], CanvasText[s, {x, y}, f, c, Opacity -> a]};
axis[{x0_, y0_}, {x1_, y1_}, a_ : 1] := CanvasLine[{{x0, y0}, {x1, y1}}, GrayLevel[0.45], "Thickness" -> 2, Opacity -> a];
filledCurve[pts_, base_, c_, a_ : 0.35] := {CanvasPolygon[Join[pts, {{pts[[-1, 1]], base}, {pts[[1, 1]], base}}], c, Opacity -> a], CanvasLine[pts, c, "Thickness" -> 4, "Glow" -> 10]};
```

ψ in space: its real and imaginary parts as a curve winding around the axis -- a helix whose colour is its phase -- with |ψ|² as a glowing shadow on the floor beneath:

```wl
psiHelix[cam_, xs_, zs_, {amp_, floor_}, a_ : 1] := With[{c = Hue[Mod[Arg[#], 2 Pi] / (2 Pi), 0.75, 1] & /@ zs},
    {CanvasCurve3D[cam, Transpose[{xs, ConstantArray[0, Length[xs]], ConstantArray[floor, Length[xs]]}], GrayLevel[0.35], 1.5, Opacity -> a],
     CanvasCurve3D[cam, Transpose[{xs, ConstantArray[0., Length[xs]], floor + 0.9 amp^2 Abs[zs]^2}], cyan, 3, "Glow" -> 12, Opacity -> 0.6 a],
     CanvasCurve3D[cam, Transpose[{xs, amp Re[zs], amp Im[zs]}], c, 4, "Glow" -> 9, Opacity -> a]}];
```

An orbital as the cloud of places an electron is found: points sampled in 3D from |ψ|², red where ψ is negative, cyan where positive:

```wl
hydrogen3D[n_, l_, m_, pts_] := With[{x = pts[[All, 1]], y = pts[[All, 2]], z = pts[[All, 3]]}, With[{r = Sqrt[x^2 + y^2 + z^2] + 10.^-9},
    (2 r / n)^l Exp[-r / n] LaguerreL[n - l - 1, 2 l + 1, 2 r / n] Re[SphericalHarmonicY[l, m, ArcCos[z / r], ArcTan[x, y + 10.^-12]]]]];
orbitalCloud[{n_, l_, m_}, k_ : 6000] := orbitalCloud[{n, l, m}, k] = BlockRandom[SeedRandom[n 100 + l 10 + m];
    Module[{ext = 2.5 n^2 + 4, cand, vals, w},
        cand = RandomReal[{-ext, ext}, {700000, 3}]; vals = hydrogen3D[n, l, m, cand]; w = vals^2;
        Take[Pick[Transpose[{cand, Sign[vals]}], Thread[RandomReal[Max[w], Length[w]] < w]], UpTo[k]]]];
cloudPrims[cam_, cloud_, r_, a_ : 1, k_ : All] := With[{c = Take[cloud, k]}, CanvasCloud[cam, c[[All, 1]], If[# > 0, cyan, RGBColor["#FF4B3E"]] & /@ c[[All, 2]], r, Opacity -> 0.9 a, "DepthFade" -> 0.55, "Glow" -> 2.5]];
Length[orbitalCloud[{3, 2, 0}]]
```

## 0:00 — Clicks

Electrons sent through two slits one at a time, filmed as they land (Bach, Pope, Liou and Batelaan, 2013): each arrives in one place, at random, and together they draw the interference of a wave.  Beside them, the same experiment computed: six thousand landing places sampled from the two-slit pattern:

```wl
slitIntensity[x_] := Cos[2.6 x]^2 Sinc[0.55 x]^2;
landing = BlockRandom[SeedRandom[1989]; With[{grid = Subdivide[-7., 7., 4000]},
    Transpose[{RandomChoice[slitIntensity /@ grid -> grid, 6000] + RandomReal[{-0.002, 0.002}, 6000], RandomReal[{-1, 1}, 6000] + RandomVariate[NormalDistribution[0, 0.12], 6000]}]]];
Histogram[landing[[All, 1]], 120, Axes -> False, ImageSize -> 400]
```

Feynman, in 1964, on what a detector hears: clicks.  Then the same experiment computed, in depth: electrons leave a source, pass the two slits and land on a screen one at a time -- each a click, the first few heard one by one -- faster and faster until the screen holds the pattern of a wave, and the film's title:

```wl
landingTime[k_] := 13.4 + 3.4 (k / 6000.)^(1/3);
landedBy[t_] := Clip[Floor[6000 ((t - 13.4) / 3.4)^3], {0, 6000}];
screenPoint[k_] := {6, 5 landing[[k, 1]] / 7, 2.1 landing[[k, 2]]};
slitPath[k_, u_] := With[{p1 = {0, If[landing[[k, 1]] > 0, 0.55, -0.55], 0.3 landing[[k, 2]]}, p0 = {-7, 0, 0}, p2 = screenPoint[k]},
    If[u < 0.45, p0 + (p1 - p0) u / 0.45, p1 + (p2 - p1) (u - 0.45) / 0.55]];
panel[{y0_, y1_}, {z0_, z1_}, x_, c_] := CanvasSurface3D[#, {{{x, y0, z0}, {x, y0, z1}}, {{x, y1, z0}, {x, y1, z1}}}, c, "Ambient" -> 0.8] &;
slitCam[t_] := With[{u = Easing["InOutCubic"][Clip[(t - 13.2) / 4.2, {0, 1}]]},
    (* from the side, the source on the left, round to behind the screen, the pattern facing us *)
    CanvasCamera["Center" -> {960, 470 - 40 u}, "Scale" -> 74 + 62 u, "Azimuth" -> 0.3 + 1.2 u, "Elevation" -> 0.34 - 0.26 u, "Distance" -> 30, "Target" -> {1 + 5 u, 0, 0}]];
slitScene[t_, n_, flights_ : True, camera_ : Automatic] := With[{cam = Replace[camera, Automatic :> slitCam[t]]}, {
    (* the wall with two slits, and the screen *)
    Through[{panel[{-3.2, -0.7}, {-2.2, 2.2}, 0, GrayLevel[0.16]], panel[{-0.4, 0.4}, {-2.2, 2.2}, 0, GrayLevel[0.16]], panel[{0.7, 3.2}, {-2.2, 2.2}, 0, GrayLevel[0.16]]}[cam]],
    CanvasCurve3D[cam, {{0, -0.7, -2.2}, {0, -0.7, 2.2}, {0, -0.4, 2.2}, {0, -0.4, -2.2}, {0, -0.7, -2.2}}, cyan, 2, "Glow" -> 8],
    CanvasCurve3D[cam, {{0, 0.4, -2.2}, {0, 0.4, 2.2}, {0, 0.7, 2.2}, {0, 0.7, -2.2}, {0, 0.4, -2.2}}, cyan, 2, "Glow" -> 8],
    CanvasCurve3D[cam, {{6, -5.2, -2.5}, {6, 5.2, -2.5}, {6, 5.2, 2.5}, {6, -5.2, 2.5}, {6, -5.2, -2.5}}, GrayLevel[0.45], 1.5],
    CanvasCloud[cam, {{-7, 0, 0}}, amber, 9, "Glow" -> 18, "DepthFade" -> 0],
    (* where they landed, and the last few as flashes *)
    If[n > 0, CanvasCloud[cam, screenPoint /@ Range[n], cyan, 1.7, Opacity -> 0.85, "DepthFade" -> 0], {}],
    If[n > 0, CanvasCloud[cam, screenPoint /@ Range[Max[1, n - 6], n], White, 4, "Glow" -> 12, "DepthFade" -> 0], {}],
    (* the ones on their way *)
    If[flights, With[{ks = Select[Range[n + 1, Min[n + 40, 400]], landingTime[#] - t < 0.3 &]},
        If[ks === {}, {}, CanvasCloud[cam, slitPath[#, 1 - (landingTime[#] - t) / 0.3] & /@ ks, White, 3.5, "Glow" -> 10, "DepthFade" -> 0]]], {}]}];
coldOpen = {footage["f-electrons", {0, 13.2}, {0, 72}, "Electrons through two slits, one at a time \[CenterDot] Bach et al., 2013", 0.08],
    voice["v-feynman-clicks", 2, {0.2, 11.2}, {{4.6, 7.6}}, {"Richard Feynman", "lecture at Cornell, 1964"},
        {{0, 11, "\[Ellipsis]are *clicks*.  Click, click, click, click\[Ellipsis]  *Lumps*.  Absolutely *lumps*."}}],
    shot[{13.2, 18.5}, Function[t, {slitScene[t, landedBy[t]],
        CanvasOpacity[Clip[(t - 15.7) / 0.5, {0, 1}], {CanvasTeX["\\psi", {960, 965}, 150, boneC, Alignment -> Center],
            CanvasText["THE QUANTUM CENTURY", {960, 1040}, sans[30, 600], red, Alignment -> Center, "Tracking" -> 8]}]}],
        "Computed: electrons through two slits, one at a time"]};
```

## 0:18 — 1900: Planck

Planck, in a film portrait made for his 85th year, remembers the hypothesis he did not want: radiation made of quanta of definite size.  Bohr, in 1962, at his last lecture, dates the change to it.  The picture: steel heating in a forge, and the law Planck found for its glow beside the classical one, which runs to infinity:

```wl
c2 = 1.4388 10^7;
planck[l_, T_] := 1 / (l^5 (Exp[c2 / (l T)] - 1));
rayleigh[l_, T_] := T / (c2 l^4);
plotRect = {200, 220, 1150, 640}; lMax = 2400;
lx[l_] := plotRect[[1]] + plotRect[[3]] (l - 100) / (lMax - 100);
ly[v_] := plotRect[[2]] + plotRect[[4]] (1 - v);
peak6000 = planck[2.898 10^6 / 6000, 6000];
spectrumColour[l_] := Which[380 <= l <= 750, ColorData["VisibleSpectrum"][l], l > 750, RGBColor[0.5, 0.08, 0.05], True, RGBColor[0.35, 0.2, 0.6]];
blackbody[t0_][t_] := Module[{u = Easing["InOutCubic"][Clip[(t - t0 - 0.5) / 9, {0, 1}]], T, ls = Range[100., lMax, 10], pv, cv, lp, grow = Clip[(t - t0) / 1.2, {0, 1}]},
    T = 1800 + 4200 u; pv = 0.88 planck[ls, T] / peak6000; cv = 0.88 rayleigh[ls, T] / peak6000; lp = 2.898 10^6 / T;
    {axis[{plotRect[[1]], ly[0]}, {plotRect[[1]] + plotRect[[3]], ly[0]}], axis[{plotRect[[1]], ly[0]}, {plotRect[[1]], plotRect[[2]] - 20}],
     Table[{CanvasLine[{{lx[l], ly[0]}, {lx[l], ly[0] + 10}}, GrayLevel[0.5], "Thickness" -> 2], CanvasText[ToString[l], {lx[l] - 22, ly[0] + 44}, sans[24, 400], grey]}, {l, {400, 700, 1000, 1500, 2000}}],
     CanvasText["wavelength, nm", {plotRect[[1]] + plotRect[[3]] - 190, ly[0] + 84}, sans[24, 400], grey],
     CanvasText["brightness", {plotRect[[1]] + 14, plotRect[[2]] - 6}, sans[24, 400], grey],
     (* the light under the curve, in its own colours *)
     Table[With[{h = 0.88 planck[l, T] / peak6000}, CanvasRectangle[{lx[l], ly[h Min[1, 3 grow]], lx[l + 10] - lx[l] + 0.6, plotRect[[4]] h Min[1, 3 grow]}, spectrumColour[l], Opacity -> 0.55]], {l, 100, lMax - 10, 10}],
     CanvasClip[{plotRect[[1]], 0, plotRect[[3]] + 40, ly[0]}, CanvasLine[Transpose[{lx[ls], ly[Clip[cv, {-1, 3}]]}], GrayLevel[0.6], "Thickness" -> 3, "Glow" -> 6, Opacity -> grow]],
     CanvasLine[Transpose[{lx[ls], ly[pv]}], White, "Thickness" -> 4, "Glow" -> 12, Opacity -> grow],
     CanvasDisk[{lx[lp], ly[0.88 planck[lp, T] / peak6000]}, 7, amber, "Glow" -> 16, Opacity -> grow],
     CanvasText["peak " <> ToString[Round[lp, 10]] <> " nm", {lx[lp] + 18, ly[0.88 planck[lp, T] / peak6000] - 16}, sans[26], amber, Opacity -> grow],
     CanvasText["classical physics: infinite light at short wavelengths", {lx[260], plotRect[[2]] + 18}, sans[26, 400], GrayLevel[0.7], Opacity -> grow],
     CanvasTeX["Planck: light comes in quanta, $E = h\\nu$", {lx[1150], ly[0.62]}, sans[30], White, Opacity -> Clip[(t - t0 - 2) / 1, {0, 1}]],
     (* the body itself, glowing at its temperature *)
     CanvasGradient[{1500, 300, 380, 380}, "Radial", ColorData["BlackBodySpectrum"][T], {{0, 1}, {0.42, 1}, {0.5, 0.45}, {0.7, 0.12}, {1, 0}}, "Steps" -> 48],
     CanvasText[ToString[Round[T, 50]] <> " K", {1640, 740}, sans[34], White]}];
planckPart = {footage["f-forge", {18.5, 21.5}, {0, 4}, "Steel glowing in a forge: hotter is whiter"], footage["f-forge", {24.5, 27}, {6, 10}, "Steel glowing in a forge: hotter is whiter"],
    shot[{27, 44}, blackbody[27], "Computed: the glow of a hot body \[Dash] Planck\[CloseCurlyQuote]s law against classical physics"],
    voice["v-planck", 18.5, {10, 23}, {{21.5, 24.5}}, {"Max Planck", "film portrait, 1942"},
        {{0, 10, "At first I accepted this hypothesis only *reluctantly*, because it contradicted *every idea of classical* atomism."}, {10, 13, "But there was *no other way*."}}],
    footage["f-forge", {44, 50.4}, {16, 26}, "Steel glowing in a forge"],
    (* the Lindau film is a slideshow with captions burned in: Bohr's close-up, its caption cropped away *)
    voice["v-bohr-planck", 31.5, {0.5, 21.9}, {{50.4, 52.9}}, {"Niels Bohr", "lecture at Lindau, 1962"},
        {{0, 21.4, "The great change came with the discovery of the *universal quantum of action*, in the first year of this century, by Planck."}}, True, {0.1, 0.1, 0, 0.3}],
    chapter[{18.5, 52.9}, "1900", "Planck: energy comes in quanta"]};
```

## 0:53 — 1905 to 1913: Light Quanta, and the Atom

Bohr again: Einstein explained the photoelectric effect by a transfer of a light quantum.  The 1961 film of the Physical Science Study Committee shows it: ultraviolet light discharging a zinc plate, its electroscope's leaf falling:

```wl
photoPart = {footage["f-photoelectric", {56, 63}, {60, 67}, "PSSC film, 1961: a charged zinc plate and its electroscope", 0.03], footage["f-photoelectric", {63, 70}, {100, 107}, "Ultraviolet light knocks electrons out: the leaf falls", 0.03],
    voice["v-bohr-einstein", 52.9, {0.5, 17.6}, {{52.9, 56}}, {"Niels Bohr", "lecture at Lindau, 1962"},
        {{0, 17.1, "Einstein tried to explain the individual photoeffect by assuming that we had to do with *a transfer of a light quantum*."}}, True, {0.1, 0.1, 0, 0.24}],
    chapter[{52.9, 70}, "1905", "Einstein: light comes in quanta"]};
```

Hydrogen glows at four visible wavelengths and no others.  Bohr's atom of 1913 explained them: the electron keeps to orbits of radius $\propto n^2$, and each line is a fall to the second.  Bohr himself, in the same lecture, says what it did and did not do: it brought order, but it was unsatisfactory -- the way to Heisenberg.  The Rydberg formula gives the lines, and the music, for a moment, plays them -- the atom's own chord, Hα tuned to A:

```wl
balmer = Table[1/4 - 1/m^2, {m, 3, 6}];
balmerNm = 1 / (1.0967758 10^7 balmer) 10^9
balmerPitch = N[57 + 12 Log2[balmer / First[balmer]]]
```

```wl
stripRect = {160, 820, 1600, 110}; lineX[l_] := stripRect[[1]] + stripRect[[3]] (l - 380) / 340;
fallAt[k_] := 75.5 + 2.4 k;
atomCam[t_] := CanvasCamera["Center" -> {960, 400}, "Scale" -> 26, "Azimuth" -> 0.4 + 0.06 (t - 75), "Elevation" -> 0.45, "Distance" -> 60];
orbitPts[n_] := Table[n^2 0.36 {Cos[a], Sin[a], 0}, {a, 0, 2 Pi, Pi / 60}];
atomShot = shot[{75, 88}, Function[t, Module[{cam = atomCam[t], k = Clip[Floor[(t - 75.5) / 2.4], {0, 3}], u, m, r, ang, e, lamb},
    u = Clip[(t - fallAt[k]) / 0.5, {0, 1}]; m = k + 3; lamb = balmerNm[[k + 1]];
    r = 0.36 (m^2 + (4 - m^2) Easing["InOutCubic"][u]); ang = 2.2 (t - 75);
    e = r {Cos[ang], Sin[ang], 0};
    {CanvasRectangle[stripRect, RGBColor[0.05, 0.05, 0.06], "Radius" -> 4],
     Table[CanvasRectangle[{lineX[l], stripRect[[2]], stripRect[[3]] 3 / 340 + 0.6, stripRect[[4]]}, ColorData["VisibleSpectrum"][l], Opacity -> 0.1], {l, 380, 720, 3}],
     Table[With[{l = balmerNm[[j + 1]], v = Clip[(t - fallAt[j] - 0.5) / 0.15, {0, 1}]}, If[v > 0, {
        CanvasLine[{{lineX[l], stripRect[[2]] + 4}, {lineX[l], stripRect[[2]] + stripRect[[4]] - 4}}, ColorData["VisibleSpectrum"][l], "Thickness" -> 6, "Glow" -> 18, Opacity -> v],
        CanvasTeX[{"$\\mathrm{H}_\\alpha$", "$\\mathrm{H}_\\beta$", "$\\mathrm{H}_\\gamma$", "$\\mathrm{H}_\\delta$"}[[j + 1]] <> "  " <> ToString[Round[l]] <> " nm", {lineX[l] - 50, stripRect[[2]] + stripRect[[4]] + 40 + If[j == 3, 32, 0]}, sans[24, 400], boneC, Opacity -> v]}, {}]], {j, 0, 3}],
     Table[CanvasCurve3D[cam, orbitPts[n], If[n == 2, amber, cyan], 2, "Glow" -> 6, Opacity -> If[n == 2 || n == m, 0.9, 0.35]], {n, 1, 6}],
     CanvasCloud[cam, {{0, 0, 0}}, red, 9, "Glow" -> 18],
     CanvasCloud[cam, {e}, White, 9, "Glow" -> 22],
     CanvasTeX[{"n=3 \\to n=2", "n=4 \\to n=2", "n=5 \\to n=2", "n=6 \\to n=2"}[[k + 1]], {1380, 300}, 44, boneC],
     (* the photon: a packet of light flying from the atom to its line *)
     If[0.5 < (t - fallAt[k]) < 1.3, With[{v = Clip[(t - fallAt[k] - 0.5) / 0.7, {0, 1}], p0 = {960, 400}, p1 = {lineX[lamb], stripRect[[2]] + 10}}, With[{c = p0 + (p1 - p0) v, dir = Normalize[p1 - p0]},
        CanvasLine[Table[c - dir 60 s + 12 Sin[2 Pi 3 s] Exp[-4 (s - 0.5)^2] {-dir[[2]], dir[[1]]}, {s, 0, 1, 0.02}], ColorData["VisibleSpectrum"][lamb], "Thickness" -> 4, "Glow" -> 14]]], {}],
     (* and the rule that gives all four *)
     CanvasOpacity[Clip[(t - 84.2) / 0.6, {0, 1}], CanvasTeX["\\frac{1}{\\lambda} = R\\left(\\frac{1}{2^2} - \\frac{1}{n^2}\\right)", {1500, 560}, 52, amber, Alignment -> Center]]}]],
    "Computed: an electron falls between Bohr\[CloseCurlyQuote]s orbits and emits one of hydrogen\[CloseCurlyQuote]s four visible lines"];
atomPart = {footage["f-spectra", {70, 75}, {115, 119.6}, "Hydrogen glowing, through a diffraction grating: its four visible lines", 0.05, {0.18, 0.27, 0.08, 0.4}], atomShot,
    voice["v-bohr-atom", 70.4, {0.45, 15.3}, None, {"Niels Bohr", "lecture at Lindau, 1962"},
        {{0, 7.6, "\[Ellipsis]to *bring order* in certain fields of experience."}, {7.6, 14.85, "But that was of a *very unsatisfactory nature*."}}],
    chapter[{70, 88}, "1913", "Bohr: the atom has steps"]};
```

## 1:20 — 1924 to 1927: Matter Is a Wave

De Broglie, on French television in 1967: the idea that every particle is accompanied by a wave.  Lester Germer, in the same PSSC series, at the apparatus where he and Davisson saw electrons diffract like waves in 1927, and the rings electrons make through a crystal:

```wl
deBrogliePart = {footage["f-germer", {83.5, 87}, {10, 13.5}, "PSSC film, 1961: Lester Germer at his electron-diffraction apparatus"], footage["f-rings", {87, 90.3}, {60, 63.3}, "Electrons through a crystal: rings, as a wave makes"],
    voice["v-debroglie", 80, {6, 16.3}, {{80, 83.5}}, {"Louis de Broglie", "French television, 1967"},
        {{0, 4.5, "After all these studies, I had the idea that one had to extend"}, {4.5, 10.3, "to *all material particles*, electrons in particular, the idea that the particle is *accompanied by a wave*."}}],
    chapter[{80, 90.3}, "1924 \[Dash] 1927", "de Broglie: matter is a wave"]};
```

## 1:30 — 1925: Helgoland

Heisenberg, in English, half a century later: hay fever sent him to an island in June 1925, and there he found quantum mechanics.  His idea: keep only what an atom shows -- its jumps between levels, each a spectral line -- and write position itself as a table of them, one entry $X_{nm}$ for every pair of levels.  Tables like that multiply in an order that matters:

```wl
levelY[n_] := 880 - 600 (1 - 1 / n^2) / (1 - 1 / 25);
jumps = Flatten[Table[{m, n}, {m, 2, 5}, {n, 1, m - 1}], 1];
jumpColour[{m_, n_}] := With[{nm = 91.13 / (1 / n^2 - 1 / m^2)}, Which[380 <= nm <= 720, ColorData["VisibleSpectrum"][nm], nm < 380, violet, True, RGBColor["#FF6A3D"]]];
jumpAt[k_, t0_] := t0 + 0.25 + 0.32 (k - 1);
tableShot[t0_] := Function[t, {
    (* the levels, and each jump drawn as it is made *)
    Table[{CanvasLine[{{200, levelY[n]}, {720, levelY[n]}}, GrayLevel[0.5], "Thickness" -> 2], CanvasTeX["n=" <> ToString[n], {150, levelY[n] + 10}, 28, grey, Alignment -> Center]}, {n, 5}],
    Table[With[{jp = jumps[[k]], a = Clip[(t - jumpAt[k, t0]) / 0.25, {0, 1}], x = 250 + 46 k}, If[a > 0, {
        CanvasLine[{{x, levelY[jp[[1]]]}, {x, levelY[jp[[1]]] + a (levelY[jp[[2]]] - levelY[jp[[1]]])}}, jumpColour[jp], "Thickness" -> 4, "Glow" -> 10]}, {}]], {k, Length[jumps]}],
    (* the table: entry (n, m) lit by the jump between them *)
    Table[With[{k = FirstPosition[jumps, {Max[r, c], Min[r, c]}, {0}][[1]]}, With[{a = If[k == 0, 0, Clip[(t - jumpAt[k, t0] - 0.15) / 0.25, {0, 1}]]}, {
        CanvasRectangle[{980 + 104 (c - 1), 200 + 104 (r - 1), 96, 96}, GrayLevel[0.13], "Radius" -> 6],
        If[a > 0, CanvasRectangle[{980 + 104 (c - 1), 200 + 104 (r - 1), 96, 96}, jumpColour[jumps[[k]]], "Radius" -> 6, Opacity -> 0.75 a], {}]}]], {r, 5}, {c, 5}],
    CanvasTeX["X_{nm}", {1240, 170}, 44, boneC, Alignment -> Center],
    CanvasOpacity[Clip[(t - t0 - 3.9) / 0.5, {0, 1}], {CanvasTeX["XP - PX = i\\hbar", {1240, 790}, 72, amber, Alignment -> Center],
        CanvasText["such tables do not commute: the order matters", {1240, 860}, sans[30, 400], grey, Alignment -> Center]}]}];
helgolandPart = {still[image["helgoland.jpg"], {94.5, 101}, "Helgoland around 1900 \[CenterDot] Library of Congress"], still[image["heisenberg1926.jpg"], {101, 105}, "Heisenberg in 1926 \[CenterDot] photo: Friedrich Hund"],
    shot[{105, 111.8}, tableShot[105], "Computed: Heisenberg\[CloseCurlyQuote]s idea \[Dash] the atom\[CloseCurlyQuote]s jumps between levels, as a table $X_{nm}$"],
    (* the interview's own title names him *)
    voice["v-heisenberg-helgoland", 90.3, {9.9, 27.1}, {{90.3, 94.5}}, {"Werner Heisenberg", "CBC interview, early 1970s"},
        {{0, 6.6, "It just so happened that I became a little bit ill,"}, {6.6, 12, "so I had to spend a holiday *on an island*, in order to be free from hay fever,"},
         {12, 16, "and there I had very good time to think about the questions."}, {16, 17.2, "It was there that I really came to this *scheme of quantum mechanics*."}}, False],
    chapter[{90.3, 111.8}, "1925", "Heisenberg: quantities that do not commute"]};
```

Dirac, at Lindau in 1976, on reading Heisenberg's paper:

```wl
diracPart = {voice["v-dirac", 111.8, {0.36, 13.6}, All, {"Paul Dirac", "lecture at Lindau, 1976"},
        {{0, 10.4, "Well, it was quite a *revelation* to me when this discovery of Heisenberg was set up,"}, {10.4, 13.3, "and it showed *how wrong I was* previously."}}],
    chapter[{111.8, 125}, "1925", "Heisenberg\[CloseCurlyQuote]s mechanics reaches Cambridge"]};
```

## 2:05 — 1926: ψ

The music rises.  The first page of Schrödinger's paper, received by the Annalen der Physik on 27 January 1926 -- a hundred years ago -- and ψ: a packet of possibility, travelling and spreading as his equation says:

```wl
schrodingerPage = image["schrodinger1926.jpg"];
psiPart = {pageTour[schrodingerPage, {
        {125, {720, 560}, 640, {{{190, 435}, {1250, 530}}}, "Quantization as an Eigenvalue Problem \[Dash] by E. Schr\[ODoubleDot]dinger"},
        {127.6, {760, 860}, 560, {{{80, 760}, {1250, 820}}, {{80, 815}, {1250, 905}}}, "\[Ellipsis]the usual quantum rule can be replaced by another requirement, in which there is no longer any mention of \[OpenCurlyDoubleQuote]whole numbers\[CloseCurlyDoubleQuote]."},
        {132.6, {760, 1560}, 560, {{{80, 1455}, {1250, 1515}}, {{300, 1600}, {900, 1665}}}, "We now introduce for $S$ a new unknown $\\psi$ \[Ellipsis]"}},
        {125, 136}, "Annalen der Physik \[CenterDot] received 27 January 1926, a hundred years ago"],
    shot[{136, 140}, Function[t, With[{tau = 0.9 (t - 136), hx = Subdivide[-6., 14., 500]},
        psiHelix[CanvasCamera["Center" -> {960, 520}, "Scale" -> 78, "Azimuth" -> 0.25 + 0.05 (t - 136), "Elevation" -> 0.32, "Distance" -> 26, "Target" -> {4, 0, 0}],
            hx, packet[hx, tau, 4, 1], {2.2, -2.6}, Clip[2 (t - 136), {0, 1}]]]],
        "Computed: $\\psi$ of a free particle \[Dash] real and imaginary parts winding around the axis, colour its phase, $|\\psi|^2$ its shadow"],
    chapter[{125, 140}, "1926", "Schr\[ODoubleDot]dinger: the wave equation"],
    {136, 140} -> Function[t, CanvasOpacity[Clip[Min[(t - 136.2) / 0.5, (140 - t) / 0.4], {0, 1}],
        CanvasTeX["i\\hbar\\,\\frac{\\partial\\psi}{\\partial t} = -\\frac{\\hbar^2}{2m}\\frac{\\partial^2\\psi}{\\partial x^2}", {960, 960}, 56, boneC, Alignment -> Center]]]};
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
cloudCam[t_, t0_, scale_] := CanvasCamera["Center" -> {960, 540}, "Scale" -> scale, "Azimuth" -> 0.4 + 0.25 (t - t0), "Elevation" -> 0.3, "Distance" -> 400];
orbitalSequence = {{{2, 1, 0}, "2p", 60}, {{3, 2, 0}, "3d", 30}, {{4, 3, 0}, "4f", 17}};
orbitalShot[t0_] := Function[t, With[{k = Clip[1 + Floor[(t - t0) / 2.95], {1, 3}]}, With[{o = orbitalSequence[[k]], u = t - t0 - 2.95 (k - 1)},
    {cloudPrims[cloudCam[t, t0, o[[3]]], orbitalCloud[o[[1]]], 3.4, Clip[Min[u / 0.4, (2.95 - u) / 0.4], {0, 1}] + Boole[k == 3 && u > 2.5]],
     glowText[o[[2]], {1500, 300}, sans[90, 700], White, Clip[u / 0.4, {0, 1}]],
     CanvasTeX[{"n=2,\; \\ell=1", "n=3,\; \\ell=2", "n=4,\; \\ell=3"}[[k]], {1500, 360}, 36, grey]}]]];
schrodingerPart = {shot[{144, 152.8}, orbitalShot[144], "Computed: hydrogen\[CloseCurlyQuote]s orbitals in 3D \[Dash] where its electron is found, cyan and red the sign of $\\psi$"],
    voice["v-schrodinger", 140, {0, 12.8}, {{140, 144}}, {"Erwin Schr\[ODoubleDot]dinger", "radio talk, 1952"},
        {{0, 12.8, "The view now secured is rather that everything, *absolutely everything*, is *at once particle and field*."}}]};
```

## 2:33 — Born: Chance

Max Born, interviewed on the day of his Nobel Prize in 1954: today we can predict only with what probability this or that will happen.  |ψ|² is that probability -- an idea he first put in a footnote, added in proof.  Five thousand electrons measured in one orbital, each landing where |ψ|² is bright:

```wl
bornPx = 400; bornExt = 2.2 4^2 + 4;
bornDensity = N @ Table[hydrogen[4, 3, 1, x, z]^2, {z, bornExt, -bornExt, -2 bornExt / (bornPx - 1)}, {x, -bornExt, bornExt, 2 bornExt / (bornPx - 1)}];
bornDots = BlockRandom[SeedRandom[1926]; With[{cells = RandomChoice[Flatten[bornDensity] -> Range[bornPx^2], 5000]},
    ({Mod[# - 1, bornPx], Quotient[# - 1, bornPx]} + RandomReal[{0, 1}, 2]) & /@ cells]];
bornCloud = orbitalCloud[{4, 3, 1}, 6000];
bornShot[t0_, t1_] := Function[t, With[{n = Max[1, Round[6000 Clip[(t - t0) / (t1 - t0), {0, 1}]^1.6]], cam = cloudCam[t, t0, 17]}, {
    cloudPrims[cam, bornCloud, 3.2, 1, n],
    (* the newest measurements flash as they land *)
    CanvasCloud[cam, bornCloud[[Max[1, n - 12] ;; n, 1]], White, 5, "Glow" -> 14, "DepthFade" -> 0],
    CanvasText[ToString[n] <> " measurements", {1480, 900}, sans[34], boneC]}]];
bornFootnote = ImageTake[image["born1926-p865.jpg"], {1830, 2130}, {110, 1370}];
bornPart = {shot[{156.5, 164.5}, bornShot[156.5, 177.8], "Computed: electrons measured in one orbital, landing where $|\\psi|^2$ is large"], pageTour[bornFootnote, {
        {164.5, {630, 120}, 480, {{{0, 52}, {1260, 100}}}, "\[Ellipsis]only one interpretation is possible: $\\Phi_{nm}$ determines the probability"},
        {168.5, {630, 200}, 420, {{{0, 190}, {1260, 270}}}, "Note added in proof: more careful consideration shows that the probability is proportional to the square of the quantity $\\Phi_{nm}$."}},
        {164.5, 173.5}, "Born\[CloseCurlyQuote]s paper of 1926, and the footnote added in proof \[CenterDot] Zeitschrift f\[UDoubleDot]r Physik 37"], shot[{173.5, 177.8}, bornShot[156.5, 177.8], "Computed: each dot a measurement"],
    voice["v-born-probability", 152.8, {0, 14}, {{152.8, 156.5}}, {"Max Born", "radio interview, 1954"},
        {{0, 8, "Today, in an atomic experiment, we can predict with what *probability* this or that will happen."}, {8, 14, "But with *complete certainty* we can say what will happen only in *very few cases*."}}],
    voice["v-born-dice", 166.8, {0, 11}, None, {"Max Born", "talk at Lindau, 1965"},
        {{0, 7, "He believed in *fixed laws*, not in a statistical description of nature."}, {7, 11, "\[OpenCurlyDoubleQuote]*God does not play dice*,\[CloseCurlyDoubleQuote] said Einstein."}}],
    chapter[{152.8, 177.8}, "1926", "Born: the wave gives probabilities"]};
```

## 2:58 — 1927: Uncertainty

Heisenberg at Lindau in 1953: position or velocity, sharp -- never both.  A packet squeezed in position spreads in momentum; the two are Fourier transforms of each other:

```wl
pxs = Subdivide[-6., 6., 240];
uncertaintyShot = shot[{183, 199.2}, Function[t, With[{s = 0.32 + 0.3 (1 + Sin[0.7 (t - 183)])}, Module[{px = Subdivide[-6., 6., 300], fx, fp, curve},
    fx = Exp[-px^2 / (2 s^2)]; fp = Exp[-px^2 s^2 2];
    curve[f_, {x0_, w_}, c_] := filledCurve[Transpose[{x0 + w (px + 6) / 12, 800 - 420 f}], 800, c, 0.3];
    {axis[{200, 800}, {880, 800}], axis[{1040, 800}, {1720, 800}],
     curve[fx, {200, 680}, cyan], curve[fp, {1040, 680}, amber],
     glowText["position", {470, 870}, sans[34], cyan], glowText["momentum", {1300, 870}, sans[34], amber],
     (* the widths: as one narrows the other widens *)
     With[{wx = 680 s / 12 2, wp = 680 / (2 s) / 12 2}, {
        CanvasLine[{{540 - wx, 330}, {540 + wx, 330}}, cyan, "Thickness" -> 4, "Glow" -> 8], CanvasTeX["\\Delta x", {540, 305}, 44, cyan, Alignment -> Center],
        CanvasLine[{{1380 - wp, 330}, {1380 + wp, 330}}, amber, "Thickness" -> 4, "Glow" -> 8], CanvasTeX["\\Delta p", {1380, 305}, 44, amber, Alignment -> Center]}],
     CanvasTeX["\\Delta x\\,\\Delta p \;\\ge\; \\frac{\\hbar}{2}", {960, 215}, 64, boneC, Alignment -> Center]}]]],
    "Computed: one particle in position and in momentum \[Dash] squeeze one and the other spreads"];
uncertaintyPart = {uncertaintyShot,
    voice["v-heisenberg-uncertainty", 177.8, {0, 21.4}, {{177.8, 183}}, {"Werner Heisenberg", "lecture at Lindau, 1953"},
        {{0, 8.9, "In quantum theory it turned out that *one cannot know*, for a particle,"}, {8.9, 13.9, "its *position and velocity both exactly at once*."},
         {13.9, 18.5, "Either you can fix the position very sharply, and then the velocity is *very indeterminate*,"}, {18.5, 21.4, "or the velocity sharply, and then the position is known *very inaccurately*."}}],
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
tunnelShot = shot[{203.5, 207.5}, Function[t, Module[{f = tunnel["Frames"][[Clip[Round[1 + 129 (t - 203.5) / 4], {1, 130}]]], seg, xsP, bx, bw, trans},
    seg = f[[tunnelView[[1]] ;; tunnelView[[2]]]]; xsP = Subdivide[120., 1800., Length[seg] - 1];
    bw = 1680 1.2 / ((tunnelView[[2]] - tunnelView[[1]]) 100 / 1023);
    trans = Total[Abs[f[[First[FirstPosition[tunnel["x"], _ ? (# >= 1.2 &)]] ;;]]]^2] / Total[Abs[f]^2];
    {axis[{120, 800}, {1800, 800}],
     CanvasRectangle[{barrierX, 330, bw, 470}, amber, Opacity -> 0.22], CanvasLine[{{barrierX, 330}, {barrierX, 800}}, amber, "Thickness" -> 3, "Glow" -> 12],
     CanvasLine[{{barrierX + bw, 330}, {barrierX + bw, 800}}, amber, "Thickness" -> 3, "Glow" -> 12],
     CanvasText["a wall higher than the particle\[CloseCurlyQuote]s energy", {barrierX - 250, 300}, sans[28, 400], amber],
     filledCurve[Transpose[{xsP, 800 - 2200 Abs[seg]^2}], 800, cyan, 0.3],
     CanvasLine[Transpose[{xsP, 800 - 160 Re[seg] 3}], violet, "Thickness" -> 2, Opacity -> 0.5],
     If[t > 205.5, glowText["through: " <> ToString[Round[100 trans]] <> "%", {barrierX + 300, 560}, sans[44], cyan, Clip[(t - 205.5) 2, {0, 1}]], {}]}]],
    "Computed: a wave packet meets a wall higher than its energy, and part of it passes through"];
wallsPart = {footage["f-alpha", {199.2, 203.5}, {6, 10.3}, "Alpha particles tunnelling out of nuclei, tracked in a cloud chamber"], tunnelShot, footage["f-cosmic", {207.5, 211}, {20, 23.5}, "Cosmic rays in a cloud chamber"],
    chapter[{199.2, 211}, "1928", "Gamow: particles tunnel through walls"]};
```

## 3:31 — 1935 to 1982: Entanglement

John Bell, on BBC television in 1986, with his socks: correlations are no puzzle if the socks are there before you look -- but a mystery if looking at one makes the other blue.  The picture: a real source of entangled photon pairs, a cone of down-converted light; then what Bell describes, computed: pairs fly apart to two detectors far from each other, and each detector's result is random -- blue or pink -- but the two always come out opposite:

```wl
sockPink = RGBColor["#FF6FAE"];
pairAt[k_] := 219.2 + 0.36 (k - 1);
pairBits = BlockRandom[SeedRandom[1986]; RandomInteger[1, 14]];
pairColour[b_] := If[b == 1, sockPink, cyan];
pairsShot[t_] := Module[{arrived = Select[Range[14], pairAt[#] + 0.9 <= t &]}, {
    (* the source, and the two detectors far apart *)
    CanvasDisk[{960, 470}, 16 + 3 Sin[12 t], amber, "Glow" -> 22],
    CanvasText["source", {960, 540}, sans[26, 400], grey, Alignment -> Center],
    Table[With[{x = If[side == 1, 200, 1600], last = SelectFirst[Reverse[arrived], True &, None]}, {
        CanvasRectangle[{x, 380, 120, 180}, GrayLevel[0.12], "Radius" -> 10],
        If[last =!= None, With[{b = If[side == 1, pairBits[[last]], 1 - pairBits[[last]]], a = Exp[-4 (t - pairAt[last] - 0.9)]},
            CanvasRectangle[{x, 380, 120, 180}, pairColour[b], "Radius" -> 10, Opacity -> 0.25 + 0.6 a]], {}],
        CanvasRectangle[{x, 380, 120, 180}, GrayLevel[0.5], "Radius" -> 10, "Stroke" -> 2],
        CanvasText[If[side == 1, "detector A", "detector B"], {x + 60, 600}, sans[28, 600], boneC, Alignment -> Center],
        (* every result so far *)
        Table[With[{b = If[side == 1, pairBits[[k]], 1 - pairBits[[k]]]}, CanvasRectangle[{x + 60 - 91 + 26 Mod[k - 1, 7], 660 + 30 Quotient[k - 1, 7], 22, 22}, pairColour[b], "Radius" -> 3]], {k, arrived}]}], {side, 2}],
    (* the pairs on their way, one photon each way *)
    Table[With[{u = (t - pairAt[k]) / 0.9}, If[0 <= u < 1, With[{dy = 18 Sin[2.3 k]}, {
        CanvasDisk[{960 - 700 u, 470 + dy u}, 8, White, "Glow" -> 14], CanvasLine[{{960 - 700 Max[0, u - 0.12], 470 + dy Max[0, u - 0.12]}, {960 - 700 u, 470 + dy u}}, White, "Thickness" -> 3, Opacity -> 0.5],
        CanvasDisk[{960 + 700 u, 470 + dy u}, 8, White, "Glow" -> 14], CanvasLine[{{960 + 700 Max[0, u - 0.12], 470 + dy Max[0, u - 0.12]}, {960 + 700 u, 470 + dy u}}, White, "Thickness" -> 3, Opacity -> 0.5]}], {}]], {k, 14}],
    CanvasOpacity[Clip[(t - 221.4) / 0.5, {0, 1}], {CanvasText["each result random", {260, 780}, sans[30, 400], boneC, Alignment -> Center],
        CanvasText["always the opposite", {1660, 780}, sans[30, 400], boneC, Alignment -> Center]}]}];
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
dialPoint[v_, r_] := {960, 690} + r {-Cos[Pi v / 3], -Sin[Pi v / 3]};
bellShot = shot[{228, 234}, Function[t, With[{v = chsh Easing["OutCubic"][Clip[(t - 228.3) / 2.5, {0, 1}]]}, {
    CanvasLine[Table[dialPoint[x, 430], {x, 0, 3, 0.02}], GrayLevel[0.3], "Thickness" -> 18],
    CanvasLine[Table[dialPoint[x, 430], {x, 0, Min[v, 2], 0.02}], cyan, "Thickness" -> 18, "Glow" -> 14],
    If[v > 2, CanvasLine[Table[dialPoint[x, 430], {x, 2, v, 0.02}], RGBColor["#FF4B3E"], "Thickness" -> 18, "Glow" -> 18], {}],
    Table[{CanvasLine[{dialPoint[x, 405], dialPoint[x, 455]}, GrayLevel[0.6], "Thickness" -> 2], CanvasText[ToString[x], dialPoint[x, 500] - {10, -10}, sans[30, 400], grey]}, {x, 0, 3}],
    CanvasLine[{dialPoint[2, 380], dialPoint[2, 480]}, White, "Thickness" -> 4, "Glow" -> 10],
    glowText["any local world: at most 2", dialPoint[2, 560] - {160, 0}, sans[30], boneC],
    CanvasLine[{{960, 690}, dialPoint[v, 400]}, White, "Thickness" -> 5, "Glow" -> 12], CanvasDisk[{960, 690}, 14, White, "Glow" -> 12],
    If[v > 2.8, CanvasTeX["\\text{quantum: } 2\\sqrt{2} \\approx 2.83", {960, 815}, 64, RGBColor["#FF4B3E"], Alignment -> Center],
        CanvasText[TextString[Round[v, 0.01]], {960, 815}, sans[56, 700], If[v > 2, RGBColor["#FF4B3E"], cyan], Alignment -> Center]]}]],
    "Computed: Bell\[CloseCurlyQuote]s test (CHSH) for an entangled pair: quantum mechanics passes the bound no local world can"];
entanglePart = {footage["f-spdc", {215, 219}, {0, 4}, "A laser making entangled photon pairs: the cone of down-converted light"], shot[{219, 224.1}, pairsShot, "Computed: entangled pairs measured far apart \[Dash] each result random, the two always opposite, like Bell\[CloseCurlyQuote]s socks"],
    voice["v-bell-socks", 211, {0.4, 13.5}, {{211, 215}}, {"John Bell", "BBC television, 1986"},
        {{0, 6.8, "So correlations like that are not a puzzle, provided you admit *the socks are really there* before you look at them."},
         {6.8, 13.1, "It's a *mystery* if looking at one sock *makes the other one blue* at the same time."}}],
    bellShot, footage["f-spdc", {234, 240.9}, {1.2, 8}, "Entangled photon pairs"],
    voice["v-aspect", 224.1, {0.15, 17.25}, {{224.1, 228}}, {"Alain Aspect", "documentary film, 1985"},
        {{0, 5.9, "And we have found experimental results *violating Bell's inequalities*."}, {5.9, 17.1, "So we are compelled to *reject the idea* that the polarisation of the photon was *already existing* just after the emission."}}],
    chapter[{211, 240.9}, "1935 \[Dash] 1982", "Entanglement: from Einstein\[CloseCurlyQuote]s doubt to Bell\[CloseCurlyQuote]s test"]};
```

## 4:01 — Nobody Understands

Feynman, 1964.  And while he warns against asking how it can be like that, his own picture of it: a particle goes from A to B along every path at once, each an arrow turned by its action; far from the classical path they spin and cancel, near it they agree:

```wl
paths = BlockRandom[SeedRandom[1948]; Table[With[{w = Accumulate[RandomVariate[NormalDistribution[0, 1], 80]]}, With[{bridge = w - Range[80] / 80 Last[w]}, (k / 40.) bridge / Max[Abs[bridge]]]], {k, 1, 40}]];
pathAction[y_] := Total[Differences[y]^2] 600;
cornu = Table[{FresnelC[s], FresnelS[s]}, {s, -3.5, 3.5, 0.01}];
pathShot = shot[{249, 257.5}, Function[t, With[{u = Clip[(t - 249.2) / 4, {0, 1}]}, {
    Table[With[{y = paths[[k]]}, CanvasLine[Table[{260 + 1000 (j - 1) / 79, 480 + 170 y[[j]] Sin[Pi (j - 1) / 79]^0.5}, {j, 80}], Hue[Mod[pathAction[y], 1], 0.8, 0.9], "Thickness" -> 2, "Glow" -> 5,
        Opacity -> (0.25 + 0.5 Exp[-k / 8]) Clip[3 u - k / 40, {0, 1}]]], {k, 40}],
    CanvasLine[{{260, 480}, {1260, 480}}, White, "Thickness" -> 5, "Glow" -> 16, Opacity -> u],
    CanvasDisk[{260, 480}, 12, boneC], CanvasDisk[{1260, 480}, 12, boneC], CanvasText["A", {240, 550}, sans[36], boneC], CanvasText["B", {1245, 550}, sans[36], boneC],
    CanvasLine[{1560, 480} + 280 # - {140, 140} & /@ Take[cornu, Max[2, Round[u Length[cornu]]]], amber, "Thickness" -> 3, "Glow" -> 10],
    CanvasText["the arrows of all paths, added", {1400, 780}, sans[26, 400], amber, Opacity -> u]}]], "Computed: every path from A to B, and their arrows summing to one"];
feynmanPart = {voice["v-feynman-nobody", 241.75, {0.95, 4.95}, All, {"Richard Feynman", "lecture at Cornell, 1964"},
        {{0, 4, "On the other hand, I think I can safely say that *nobody understands quantum mechanics*."}}],
    pathShot, voice["v-feynman-drain", 245.8, {0, 11.7}, {{245.8, 249}}, {"Richard Feynman", "lecture at Cornell, 1964"},
        {{0, 4.5, "Don't keep saying to yourself, if you can possibly avoid it, \[OpenCurlyDoubleQuote]*But how can it be like that?*\[CloseCurlyDoubleQuote]"},
         {4.5, 9.8, "Because you'll get *down the drain*, into a blind alley from which nobody has yet escaped."}, {9.8, 11.7, "*Nobody knows* how it can be like that."}}],
    chapter[{240.9, 257.5}, "1948", "Feynman: every path at once"]};
```

## 4:17 — The World It Built

What it became: atoms cooled until they share one wave -- a Bose-Einstein condensate, in NASA's Cold Atom Lab on the space station -- described by the physicist who runs it:

```wl
builtPart = {footage["f-cold-atom-lab", {261, 266}, {7.5, 12.5}, "The first Bose\[Dash]Einstein condensate (JILA, 1995): atoms condensing into one wave \[CenterDot] NASA/JPL"],
    footage["f-cold-atom-lab", {266, 269.7}, {56, 59.7}, "Cold Atom Lab\[CloseCurlyQuote]s trap: lasers and magnetic coils hold the atoms \[CenterDot] NASA/JPL"],
    footage["f-cold-atom-lab", {269.7, 273.4}, {44, 47.7}, "Cold Atom Lab, built for the space station \[CenterDot] NASA/JPL"],
    voice["v-nasa-bec", 257.5, {0.4, 16.3}, {{257.5, 261}}, {"Jim Kohel", "NASA Cold Atom Lab, 2018"},
        {{0, 5.4, "These *wispy clouds of atoms* behave in very strange ways."}, {5.4, 9.4, "They're *no longer distinguishable* as individual particles."},
         {9.4, 15.9, "You really have to describe it more like *atoms acting collectively, as a wave*."}}],
    chapter[{257.5, 273.4}, "1995 \[Dash] 2018", "Atoms in one wave: Bose\[Dash]Einstein condensates"]};
```

## 4:33 — Computing with ψ

In May 1981 Feynman gave the talk that started quantum computing; no recording of it is known, only the paper.  Then the people who built the field: John Preskill on why it matters, Peter Shor on the algorithm that made it urgent, David Wineland on the ions he controls one by one, John Martinis, Hartmut Neven and Google's team on the first machines to beat a supercomputer, and Julian Kelly on Willow, in 2024.  The pictures: IBM's and Google's machines, and what they compute -- qubits on Bloch spheres, the quantum Fourier transform at the heart of Shor's algorithm, drawn by the Wolfram Quantum Framework, and Grover's search, amplitude flowing onto the answer:

```wl
feynmanQuote = shot[{273.4, 280.4}, Function[t, With[{u = Clip[(t - 273.6) 1.2, {0, 1}]}, {
    CanvasText["\[OpenCurlyDoubleQuote]Nature isn\[CloseCurlyQuote]t classical, dammit,", {260, 400}, serif[66, True], boneC, Opacity -> u],
    CanvasText["and if you want to make a simulation of nature,", {260, 490}, serif[66, True], boneC, Opacity -> u],
    CanvasText["you\[CloseCurlyQuote]d better make it quantum mechanical.\[CloseCurlyDoubleQuote]", {260, 580}, serif[66, True], red, Opacity -> Clip[(t - 274.6) 1.2, {0, 1}]],
    CanvasText["Richard Feynman, \[OpenCurlyDoubleQuote]Simulating Physics with Computers\[CloseCurlyDoubleQuote], MIT, May 1981", {262, 690}, sans[30, 400], grey, Opacity -> u]}]],
    ""];
(* the quantum Fourier transform on four qubits, the textbook circuit: a Hadamard on each qubit, phase rotations
   controlled by the qubits below it, then the order reversed *)
qftColumns = Join[{{"H", 1}}, {{"R_2", 2, 1}, {"R_3", 3, 1}, {"R_4", 4, 1}}, {{"H", 2}}, {{"R_2", 3, 2}, {"R_3", 4, 2}}, {{"H", 3}}, {{"R_2", 4, 3}}, {{"H", 4}}, {{"SWAP", 1, 4}}, {{"SWAP", 2, 3}}];
wireY[q_] := 300 + 140 (q - 1); gateX[k_] := 330 + 118 k;
qftShot = shot[{297, 306.3}, Function[t, With[{pulse = 330 + 1500 Clip[(t - 297.6) / 6.5, {0, 1}]}, {
    Table[{CanvasLine[{{260, wireY[q]}, {1720, wireY[q]}}, GrayLevel[0.4], "Thickness" -> 2],
        CanvasLine[{{260, wireY[q]}, {Min[1720, pulse], wireY[q]}}, cyan, "Thickness" -> 2.5, "Glow" -> 8, Opacity -> 0.8],
        CanvasTeX[{"q_1", "q_2", "q_3", "q_4"}[[q]], {200, wireY[q] + 12}, 40, grey, Alignment -> Center]}, {q, 4}],
    Table[With[{g = qftColumns[[k]], x = gateX[k]}, With[{lit = Clip[(pulse - x + 40) / 60, {0, 1}]}, Switch[g[[1]],
        "SWAP", {CanvasLine[{{x, wireY[g[[2]]]}, {x, wireY[g[[3]]]}}, boneC, "Thickness" -> 2.5, Opacity -> 0.6 + 0.4 lit],
            Table[CanvasLine[{{x - 14, wireY[q] - 14}, {x + 14, wireY[q] + 14}, {x, wireY[q]}, {x - 14, wireY[q] + 14}, {x + 14, wireY[q] - 14}}, boneC, "Thickness" -> 3, Opacity -> 0.6 + 0.4 lit], {q, g[[2 ;; 3]]}]},
        "H", {CanvasRectangle[{x - 38, wireY[g[[2]]] - 38, 76, 76}, inkC, "Radius" -> 10], CanvasRectangle[{x - 38, wireY[g[[2]]] - 38, 76, 76}, Blend[{GrayLevel[0.5], cyan}, lit], "Radius" -> 10, "Stroke" -> 3],
            CanvasTeX["\\mathrm{H}", {x, wireY[g[[2]]] + 14}, 42, Blend[{boneC, cyan}, lit], Alignment -> Center]},
        _, {CanvasLine[{{x, wireY[g[[2]]]}, {x, wireY[g[[3]]] + 38}}, Blend[{GrayLevel[0.5], amber}, lit], "Thickness" -> 2.5, "Glow" -> 6 lit],
            CanvasDisk[{x, wireY[g[[2]]]}, 10, Blend[{GrayLevel[0.6], amber}, lit], "Glow" -> 10 lit],
            CanvasRectangle[{x - 38, wireY[g[[3]]] - 38, 76, 76}, inkC, "Radius" -> 10], CanvasRectangle[{x - 38, wireY[g[[3]]] - 38, 76, 76}, Blend[{GrayLevel[0.5], amber}, lit], "Radius" -> 10, "Stroke" -> 3],
            CanvasTeX[g[[1]], {x, wireY[g[[3]]] + 14}, 38, Blend[{boneC, amber}, lit], Alignment -> Center]}]]], {k, Length[qftColumns]}],
    CanvasTeX["R_k = \\begin{pmatrix} 1 & 0 \\\\ 0 & e^{2\\pi i/2^k} \\end{pmatrix}", {1500, 205}, 40, grey, Alignment -> Center]}]],
    "Computed: the quantum Fourier transform on four qubits, the heart of Shor\[CloseCurlyQuote]s algorithm"];
blochState[j_, t_] := {Sin[th] Cos[ph], Sin[th] Sin[ph], Cos[th]} /. {th -> Pi (0.5 + 0.42 Sin[0.9 t + j]), ph -> 1.3 t + 2 j};
blochShot = shot[{322.5, 327.5}, Function[t, Table[With[{cam = CanvasCamera["Center" -> {330 + 420 j, 520}, "Scale" -> 150, "Azimuth" -> 0.6, "Elevation" -> 0.3, "Distance" -> 9], c = {cyan, amber, violet, RGBColor["#7CFFB2"]}[[j + 1]]}, {
    CanvasSphere3D[cam, {0, 0, 0}, 1, c, "Wire" -> {8, 5}],
    CanvasCurve3D[cam, Table[blochState[j, t - d], {d, 0, 1.2, 0.04}], c, 3, "Glow" -> 6, Opacity -> 0.5],
    CanvasCurve3D[cam, {{0, 0, 0}, blochState[j, t]}, c, 5, "Glow" -> 10], CanvasCloud[cam, {blochState[j, t]}, White, 8, "Glow" -> 14],
    CanvasTeX["|0\\rangle", {330 + 420 j, 335}, 40, grey, Alignment -> Center], CanvasTeX["|1\\rangle", {330 + 420 j, 745}, 40, grey, Alignment -> Center]}], {j, 0, 3}]],
    "Computed: four qubits, each a point on a sphere \[Dash] $|0\\rangle$ at the top, $|1\\rangle$ at the bottom, anything between"];
(* Willow's benchmark: random circuits on a grid of qubits, and the bitstrings they output, whose
   probabilities are a speckle no classical computer can reproduce in time -- and then the race *)
rcsGrid = Flatten[Table[{i, j}, {i, 7}, {j, 7}], 1];
rcsEdges = Select[Subsets[Range[49], {2}], Norm[rcsGrid[[#[[1]]]] - rcsGrid[[#[[2]]]]] == 1 &];
rcsLayer[k_] := BlockRandom[SeedRandom[k]; RandomSample[rcsEdges, 20]];
rcsSpeckle[k_] := rcsSpeckle[k] = BlockRandom[SeedRandom[100 + k]; With[{z = RandomVariate[NormalDistribution[], {48, 48}] + I RandomVariate[NormalDistribution[], {48, 48}]}, Abs[z]^2 / Max[Abs[z]^2]]];
rcsShot = shot[{358, 366.3}, Function[t, With[{layer = Floor[4 (t - 358)], zeros = Clip[Floor[25 (t - 358.6) / 4.2], {0, 25}]}, {
    Table[With[{e = rcsEdges[[k]]}, With[{on = MemberQ[rcsLayer[layer], e]}, CanvasLine[{150 + 66 rcsGrid[[e[[1]]]], 150 + 66 rcsGrid[[e[[2]]]]} /. {x_, y_} :> {x, y + 10},
        If[on, amber, GrayLevel[0.28]], "Thickness" -> If[on, 5, 2], "Glow" -> If[on, 10, 0]]]], {k, Length[rcsEdges]}],
    Table[CanvasDisk[{150, 160} + 66 p, 11, cyan, "Glow" -> 8], {p, rcsGrid}],
    CanvasText["a random circuit, layer " <> ToString[layer + 1], {216, 700}, sans[28, 400], grey],
    (* the output: the probability of each bitstring, a speckle *)
    With[{sp = rcsSpeckle[Min[layer, 30]]}, Table[CanvasRectangle[{900 + 11 (j - 1), 160 + 11 (i - 1), 10, 10}, cyan, Opacity -> 0.08 + 0.92 sp[[i, j]]^0.7], {i, 48}, {j, 48}]],
    CanvasText["the probabilities of its outputs", {900, 700}, sans[28, 400], grey],
    (* the race *)
    CanvasText["Willow", {150, 760}, sans[32, 600], boneC], CanvasRectangle[{540, 734, 980 Clip[(t - 358.2) / 0.6, {0, 1}], 30}, cyan, "Radius" -> 4],
    CanvasText["under 5 minutes", {1550, 760}, sans[34, 600], cyan],
    CanvasText["fastest supercomputer", {150, 820}, sans[32, 600], boneC], CanvasRectangle[{540, 794, 4, 30}, RGBColor["#FF4B3E"], "Radius" -> 2],
    CanvasText["1" <> StringRepeat["0", zeros] <> " years", {560, 820}, sans[34, 600], RGBColor["#FF4B3E"]],
    If[t > 362.6, CanvasTeX["\\text{the age of the universe: } 1.4 \\times 10^{10} \\text{ years}", {560, 868}, 30, grey, Opacity -> Clip[(t - 362.6) 2, {0, 1}]], {}]}]],
    "Computed: random circuit sampling, the benchmark of Google\[CloseCurlyQuote]s \[OpenCurlyDoubleQuote]supremacy\[CloseCurlyDoubleQuote] (2019) and Willow (2024)"];
computingPart = {feynmanQuote,
    footage["f-ibm-system-two", {284, 293.3}, {60, 69.3}, "IBM Quantum System Two, 2023 \[CenterDot] IBM Research"],
    voice["v-preskill", 280.4, {8.04, 20.9}, {{280.4, 284}}, {"John Preskill", "Caltech, 2016"},
        {{0, 5.2, "To a physicist, what's really important about quantum computing is that we think, *though we don't know this for sure*,"},
         {5.2, 12.9, "that a quantum computer would be able to *efficiently simulate any process* that occurs in nature."}}],
    qftShot, voice["v-shor", 293.3, {4.3, 16.5}, {{293.3, 297}}, {"Peter Shor", "interview, 2020"},
        {{0, 8.4, "What I did was, I looked at Dan Simon's algorithm and figured out how to take some of the techniques from it, and add some more,"},
         {8.4, 12.2, "and show how to *factor large numbers into primes* on a quantum computer."}}],
    voice["v-wineland", 306.3, {0, 13}, All, {"David Wineland", "NIST, after his 2012 Nobel Prize"},
        {{0, 13, "With this idea of *superposition*, we can put our atoms or ions in these states where they're *simultaneously both a zero and a one* at the same time."}}],
    blochShot, voice["v-martinis", 319.3, {0, 8.2}, {{319.3, 322.5}}, {"John Martinis", "Google, 2019"},
        {{0, 8.2, "The classical bit stores information as a zero or one, and a quantum bit can be *both zero and one at the same time*."}}],
    footage["f-sycamore", {330, 340.7}, {56, 66.7}, "Google\[CloseCurlyQuote]s Sycamore and its dilution refrigerator, 2019 \[CenterDot] Google Quantum AI (CC BY)"],
    voice["v-google-promise", 327.5, {0, 13.05}, {{327.5, 330}}, {"Google Quantum AI", "Demonstrating Quantum Supremacy, 2019"},
        {{0, 13.2, "The tantalizing promise of quantum computers is that they can do certain tasks *exponentially faster* than classical machines."}}],
    voice["v-neven", 340.7, {0, 6}, All, {"Hartmut Neven", "Google, 2019"},
        {{0, 6, "The nice thing about *quantum supremacy* is that it is a very well-defined *engineering milestone*."}}],
    footage["f-willow", {350, 358}, {30, 38}, "Willow, Google\[CloseCurlyQuote]s 105-qubit chip, 2024"], rcsShot,
    voice["v-willow", 346.7, {10.2, 29.9}, {{346.7, 350}}, {"Julian Kelly", "Google Quantum AI, 2024"},
        {{0, 5.4, "By our best estimates, a calculation that takes Willow *under five minutes*"}, {5.4, 11.1, "would take the fastest supercomputer *ten to the twenty-five years*."},
         {11.1, 15.9, "That's a one with *twenty-five zeros* following it,"}, {15.9, 19.7, "or a timescale way *longer than the age of the universe*."}}],
    footage["f-ibm-system-two", {366.3, 372}, {80, 85.7}, "IBM Quantum System Two \[CenterDot] IBM Research"],
    chapter[{273.4, 372}, "1981 \[Dash] 2026", "Computing with \[Psi]"]};
```

## 6:12 — The Bubble

The machines got their money, and the words got bigger: *both places at once*, *exponentially faster*, *supremacy*, *advantage*.  The skeptics have the last word.  First the words themselves -- the film's own quotes and the popular version of them -- while Scott Aaronson describes what almost every article says:

```wl
hypeCards = {{"\[OpenCurlyDoubleQuote]tries them all in parallel\[CloseCurlyDoubleQuote]", "almost any popular article"},
    {"\[OpenCurlyDoubleQuote]both zero and one at the same time\[CloseCurlyDoubleQuote]", "Google, 2019"},
    {"\[OpenCurlyDoubleQuote]exponentially faster than classical machines\[CloseCurlyDoubleQuote]", "Google, 2019"},
    {"\[OpenCurlyDoubleQuote]quantum supremacy\[CloseCurlyDoubleQuote]", "Google, 2019"},
    {"\[OpenCurlyDoubleQuote]ten to the twenty-five years\[CloseCurlyDoubleQuote]", "Google, 2024"},
    {"\[OpenCurlyDoubleQuote]bigger than fire\[CloseCurlyDoubleQuote]", "a Bank of America analyst, 2022"}};
hypeShot[{t0_, t1_}] := shot[{t0, t1}, Function[t, {
    Table[With[{tk = t0 + 0.3 + 2.25 (k - 1), c = hypeCards[[k]]}, With[{u = Clip[(t - tk) / 0.5, {0, 1}], y = 200 + 112 (k - 1), x = 180 + 90 Mod[k - 1, 2]},
        If[u > 0, With[{a = Easing["OutCubic"][u] If[t > tk + 2.25 && k < 6, 0.55, 1]}, {
            CanvasText[c[[1]], {x, y + 46 + 14 (1 - u)}, serif[54, True], White, Opacity -> a],
            CanvasText[c[[2]], {x + 24 + CanvasTextWidth[c[[1]], serif[54, True]], y + 46 + 14 (1 - u)}, sans[28, 400], grey, Opacity -> a]}], {}]]], {k, Length[hypeCards]}]}],
    "How quantum computing has been sold, 2019\[Dash]2024"];
```

Then the bubble itself: the share prices of three quantum-computing companies, which rose twentyfold in a year -- until, on 8 January 2025, Nvidia's Jensen Huang told analysts that very useful quantum computers were fifteen to thirty years away, and they lost around 40% in a day:

```wl
stocks = Rest[Import[cached["quantum-stocks.csv"], "CSV"]];
stockDays = stocks[[All, 1]]; stockRel = Transpose[# / First[#] & /@ Transpose[N[stocks[[All, 2 ;;]]]]];
dayIndex[d_String] := First[FirstPosition[AbsoluteTime /@ stockDays, _ ? (# >= AbsoluteTime[d] &)]];
{peakDay, crashDay} = {dayIndex["2025-01-07"], dayIndex["2025-01-08"]};
stockX[i_] := 200 + 1380 (i - 1) / (Length[stockDays] - 1);
stockY[r_] := 780 - 520 (Log10[r] - Log10[0.4]) / (Log10[40] - Log10[0.4]);
stockNames = {{"IonQ", cyan}, {"Rigetti", amber}, {"D-Wave", violet}};
crashPct = Round[100 (stockRel[[crashDay]] / stockRel[[peakDay]] - 1)];
stockShot[{t0_, t1_}, tCrash_] := shot[{t0, t1}, Function[t, With[{n = Round[Which[
        t < tCrash, 1 + (peakDay - 1) Clip[(t - t0 - 0.3) / 4.8, {0, 1}],
        t < tCrash + 3.6, crashDay,
        True, crashDay + (Length[stockDays] - crashDay) Clip[(t - tCrash - 3.6) / 4.5, {0, 1}]]]}, {
    Table[{CanvasLine[{{200, stockY[r]}, {1580, stockY[r]}}, GrayLevel[0.22], "Thickness" -> 1.5], CanvasText["\[Times]" <> TextString[r], {1600, stockY[r] + 9}, sans[24, 400], grey]}, {r, {0.5, 1, 2, 5, 10, 20}}],
    Table[With[{i = dayIndex[y <> "-01-01"]}, {CanvasLine[{{stockX[i], 800}, {stockX[i], 812}}, grey, "Thickness" -> 2], CanvasText[y, {stockX[i] - 30, 846}, sans[26, 400], grey]}], {y, {"2024", "2025"}}],
    CanvasText["share price, relative to January 2024", {200, 230}, sans[26, 400], grey],
    Table[With[{c = stockNames[[k, 2]], pts = Table[{stockX[i], stockY[stockRel[[i, k]]]}, {i, n}]}, {
        CanvasLine[pts, c, "Thickness" -> 3.5, "Glow" -> 10],
        CanvasDisk[Last[pts], 7, c, "Glow" -> 14],
        CanvasText[stockNames[[k, 1]] <> "  \[Times]" <> TextString[Round[stockRel[[n, k]], If[stockRel[[n, k]] < 3, 0.1, 1]]], Last[pts] + {16, 8 + 26 (k - 2)}, sans[26], c]}], {k, 3}],
    If[t >= tCrash, With[{a = Clip[(t - tCrash) / 0.4, {0, 1}], x = stockX[crashDay]}, {
        CanvasLine[{{x, 250}, {x, 800}}, RGBColor["#FF4B3E"], "Thickness" -> 3, "Glow" -> 14, Opacity -> a],
        CanvasRectangle[{x - 600, 250, 580, 190}, Black, Opacity -> 0.75 a, "Radius" -> 6],
        CanvasText["8 January 2025", {x - 576, 294}, sans[30, 700], RGBColor["#FF4B3E"], Opacity -> a],
        CanvasText["Huang: very useful quantum computers", {x - 576, 336}, sans[26, 400], boneC, Opacity -> a],
        CanvasText["are 15 to 30 years away", {x - 576, 370}, sans[26, 400], boneC, Opacity -> a],
        CanvasText[StringRiffle[MapThread[#1 <> " \[Minus]" <> ToString[Abs[#2]] <> "%" &, {stockNames[[All, 1]], crashPct}], "  "] <> ", in a day", {x - 576, 418}, sans[24], RGBColor["#FF4B3E"], Opacity -> a]}], {}]}]],
    "Computed: share prices of IonQ, Rigetti and D-Wave, 2024\[Dash]2025 \[CenterDot] Yahoo Finance"];
```

The voices -- Aaronson, Sabine Hossenfelder, Huang, Gil Kalai -- and the bubble's own forecast, ending on the cold:

```wl
skepticsPart = {hypeShot[{375.2, 389.6}],
    voice["v-aaronson-parallel", 372, {3.8, 21.3}, {{372, 375.2}}, {"Scott Aaronson", "TEDxDresden, 2017"},
        {{0, 5.15, "Well, if you read almost any popular article on the subject, it'll say something like,"},
         {5.15, 10.5, "well, unlike a classical computer, which just has to try every possible answer one by one,"},
         {10.5, 17.5, "a quantum computer just *tries them all in parallel*, in different parallel universes."}}],
    voice["v-aaronson-parallel", 389.6, {28.9, 31.5}, All, {"Scott Aaronson", "TEDxDresden, 2017"}, {{0, 2.6, "The trouble is, you know, alas, *it's not that simple*."}}, False],
    voice["v-sabine-advantage", 392.8, {9.95, 25.4}, All, {"Sabine Hossenfelder", "physicist, \[OpenCurlyDoubleQuote]The Quantum Hype Bubble Is About To Burst\[CloseCurlyDoubleQuote], 2022"},
        {{0, 5.86, "*Quantum advantage* has indeed been demonstrated for some quantum computers,"},
         {5.86, 11.72, "but that just means the quantum computer did something faster than a conventional computer,"},
         {11.72, 15.45, "*not that this was of any use* for real-world issues."}}],
    voice["v-sabine-marketing", 408.6, {5.5, 11.0}, All, {"Sabine Hossenfelder", "physicist, on YouTube, 2025"},
        {{0, 5.5, "Well, the *marketing departments* have definitely achieved quantum advantage."}}],
    stockShot[{414.5, 430.5}, 420.7],
    voice["v-huang-ces", 414.5, {12.4, 25.5}, None, {"Jensen Huang", "Nvidia, to analysts at CES, 7 January 2025"},
        {{0, 6.8, "And so if you kind of set *15 years* for very useful quantum computers, that would probably be on the *early side*."},
         {6.8, 9.76, "If you set *30*, it's probably on the late side."}, {9.76, 13.1, "But if you pick 20, I think a whole bunch of us would believe it."}}],
    voice["v-huang-public", 428, {21.85, 31.3}, {{430.5, 437.45}}, {"Jensen Huang", "Nvidia GTC, Quantum Day, March 2025"},
        {{0, 4.48, "And my first reaction was, I didn't know they were public."}, {4.48, 9.45, "How could a quantum computer company *be public*?"}}],
    voice["v-sabine-profitable", 437.9, {6.95, 12.75}, All, {"Sabine Hossenfelder", "physicist, on YouTube, 2026"},
        {{0, 5.8, "Today, the only profitable quantum application has been *forecasting profitable quantum applications*."}}],
    voice["v-kalai-impossible", 444.2, {3.55, 17.9}, {{444.2, 457.3}}, {"Gil Kalai", "mathematician, Hebrew University of Jerusalem, 2014"},
        {{0, 5.69, "I think that eventually it will turn out that"},
         {5.69, 14.35, "quantum computations, superior quantum computation, and quantum fault tolerance are *indeed impossible*."}}, True, {0.43, 0.13, 0.52, 0.03}],
    (* his recording turns to a slide of a blog in its last second: his face a moment longer, silent *)
    footage["v-kalai-impossible", {457.3, 458.6}, {14.4, 15.7}, "", 0.03, {0.43, 0.13, 0.52, 0.03}],
    voice["v-sabine-burst", 459, {9.85, 15.5}, All, {"Sabine Hossenfelder", "physicist, \[OpenCurlyDoubleQuote]The Quantum Hype Bubble Is About To Burst\[CloseCurlyDoubleQuote], 2022"},
        {{0, 5.65, "This *bubble of inflated promises* will eventually burst. It's just a matter of time."}}],
    voice["v-sabine-burst", 464.9, {23.75, 29.7}, {{464.9, 467.4}}, {"Sabine Hossenfelder", "2022"},
        {{0, 5.95, "This scenario has been dubbed \[OpenCurlyDoubleQuote]the quantum winter\[CloseCurlyDoubleQuote], and *winter is coming*."}}, False],
    chapter[{372, 467.4}, "2014 \[Dash] 2026", "Skeptics"]};
```

## 7:51 — Outro

Winter, as she says: snow falls through the titles and the credits and settles, flake by flake, in drifts shaped like the pattern the electrons drew at the beginning; the century; the credits, all the way up:

```wl
credits = {"Voices", "Max Planck (film portrait, 1942) \[CenterDot] Niels Bohr (Lindau Nobel Laureate Meetings, 1962)",
    "Louis de Broglie (INA, 1967) \[CenterDot] Werner Heisenberg (CBC, early 1970s; Lindau, 1953) \[CenterDot] Paul Dirac (Lindau, 1976)",
    "Erwin Schr\[ODoubleDot]dinger (SWR, 1952) \[CenterDot] Max Born (rbb, 1954; BR, 1965) \[CenterDot] John Bell (BBC / Open University, 1986)",
    "Alain Aspect (Jorlunde Film, 1985) \[CenterDot] Richard Feynman (BBC / Cornell Messenger Lectures, 1964)",
    "Jim Kohel (NASA) \[CenterDot] John Martinis, Hartmut Neven (Google, CC BY) \[CenterDot] John Preskill \[CenterDot] Peter Shor \[CenterDot] David Wineland (NIST) \[CenterDot] Julian Kelly (Google)",
    "Scott Aaronson (TEDxDresden, 2017) \[CenterDot] Sabine Hossenfelder (2022\[Dash]2026) \[CenterDot] Jensen Huang (Nvidia, 2025) \[CenterDot] Gil Kalai (2014)", "",
    "Footage", "Bach, Pope, Liou, Batelaan 2013 (CC BY) \[CenterDot] PSSC films, 1961\[Dash]62 \[CenterDot] Wikimedia Commons contributors (CC BY / BY-SA)",
    "NASA \[CenterDot] IBM Research \[CenterDot] Google Quantum AI \[CenterDot] Denys Bondar \[CenterDot] YouTube channels of the skeptics, quoted",
    "Library of Congress \[CenterDot] Friedrich Hund \[CenterDot] Internet Archive", "",
    "Short quotations of copyrighted recordings, for a non-commercial educational film", "Computed and composed in Wolfram Language with WAnim"};
creditFont[s_] := If[MemberQ[{"Voices", "Footage"}, s], sans[34], sans[26, 400]];
(* winter: snowflakes fall one at a time, through the titles and well into the credits, and pile up where the
   electrons landed -- the pattern of a wave, as drifts of snow *)
ice = RGBColor["#DDF4FF"];
flakes = 2400; binW = 10; ground = 960;
flakeAt[k_] := 467.6 + 21 (k / flakes)^0.85;
flakeX[k_] := 160 + 1600 (landing[[k, 1]] + 7) / 14;
flakeBin = Clip[Floor[(flakeX /@ Range[flakes] - 160) / binW] + 1, {1, 160}];
(* how many flakes lie under each one in its drift, so it falls to the top of the snow already there *)
flakeDepth = Module[{seen = ConstantArray[0, 160]}, Table[seen[[flakeBin[[k]]]]++, {k, flakes}]];
landTime = flakeAt /@ Range[flakes] + 2.6;
drift[t_] := With[{landed = Pick[flakeBin, Thread[landTime <= t]]}, If[landed === {}, ConstantArray[0., 160], GaussianFilter[N @ BinCounts[landed, {1, 161, 1}], 2.5] 3.8]];
snowflake[{x_, y_}, r_, ang_, a_] := Table[CanvasLine[{{x, y} - r {Cos[th], Sin[th]}, {x, y} + r {Cos[th], Sin[th]}}, ice, "Thickness" -> 1.6, "Glow" -> 3, Opacity -> a], {th, ang + {0, Pi / 3, 2 Pi / 3}}];
snowScene[t_] := With[{h = drift[t], xs = 160 + binW (Range[160] - 0.5)}, {
    (* the drifts: the snow that has settled, its top lit *)
    If[Max[h] > 0, {CanvasPolygon[Join[Transpose[{xs, ground - h}], {{1760, ground}, {160, ground}}], ice, Opacity -> 0.92],
        CanvasLine[Transpose[{xs, ground - h}], White, "Thickness" -> 2, "Glow" -> 8]}, {}],
    CanvasLine[{{120, ground}, {1800, ground}}, GrayLevel[0.35], "Thickness" -> 1.5],
    (* the flakes still falling, turning and swaying *)
    Table[With[{u = (t - flakeAt[k]) / 2.6}, If[0 <= u < 1, With[{x = flakeX[k], y = ground - 3.8 flakeDepth[[k]] - 4},
        snowflake[{x + 26 Sin[3 u + k] (1 - u), -30 + (y + 30) u}, 9 - 4 u, 1.3 t + k, 0.9]], {}]], {k, flakes}]}];
creditsTop[t_] := 1100 - 112 (t - 477.7);
outroPart = {shot[{467.4, 495.5}, Function[t, CanvasOpacity[1 - 0.45 Clip[(t - 478.5) / 2, {0, 1}], snowScene[t]]], ""],
    TitleCard["1926 \[Dash] 2026", {471.7, 477.5}, Position -> {960, 200}, FontSize -> 96, FontColor -> boneC, "Enter" -> "Rise", "Exit" -> "Fade"],
    {477.7, 495.5} -> Function[t, With[{y0 = creditsTop[t]}, CanvasOpacity[Clip[(t - 477.7) 3, {0, 1}] Clip[(495.5 - t) 2, {0, 1}],
        MapIndexed[If[#1 === "" || ! (-60 < y0 + 52 #2[[1]] < 1140), {}, CanvasText[#1, {960 - CanvasTextWidth[#1, creditFont[#1]] / 2, y0 + 52 #2[[1]]}, creditFont[#1],
            If[MemberQ[{"Voices", "Footage"}, #1], red, boneC]]] &, credits]]]]};
creditsTop[495.5] + 52 Length[credits]
```

## The Score

The music sits beneath the voices -- ducked under each -- and comes forward three times: hydrogen's chord, the wave equation, the end.  Its harmony walks Am, F, Dm, E, a chord every four seconds:

```wl
(* the film's time: Bohr's atom took the chapter to 88 s, and everything after it was written 8 s earlier *)
late[t_] := If[t >= 80, t + 8, t];
chordAt[s_] := {{57, 60, 64}, {53, 57, 60}, {50, 53, 57}, {52, 56, 59}}[[Mod[Floor[s / 4], 4] + 1]];
rootAt[s_] := {45, 41, 38, 40}[[Mod[Floor[s / 4], 4] + 1]];
rises = Join[{{15.6, 18.5}, {70, 88}}, Map[late, {{125, 140}, {199.2, 211}, {273.4, 280.4}, {471.2, 495.5}}, {2}]];
rising[s_] := AnyTrue[rises, #[[1]] <= s < #[[2]] &];
padEvents = Flatten[Table[{s, 4, #, If[rising[s], 0.75, 0.42]} & /@ chordAt[s], {s, 16, 498, 4}], 1];
bassEvents = Table[{s, 2, rootAt[s], If[rising[s], 0.85, 0.5]}, {s, 18, 500, 2}];
pulseEvents = {late[#], 1/4, "bd", 0.7} & /@ Join[Range[125, 139.5, 1], Range[199.2, 210.5, 1], Range[471.2, 478.2, 1]];
hatEvents = {late[#], 1/8, "hh", 0.35} & /@ Join[Range[125.5, 139.5, 0.5], Range[199.7, 210.7, 0.5]];
(* the detector's clicks: under the real electrons, at random; then one for each computed electron as it lands,
   until they come too fast to count *)
clickEvents = {#, 1/16, "hh", 0.8} & /@ Join[BlockRandom[SeedRandom[1964]; Sort[RandomReal[{0.2, 13.0}, 40]]], landingTime /@ Range[160]];
hook = {{0, 2, 69}, {2, 1, 72}, {3, 1, 76}, {4, 2, 74}, {6, 2, 72}, {8, 2, 77}, {10, 1, 76}, {11, 1, 74}, {12, 3, 76}};
leadEvents = Join[{15.8 + #1 / 2, #2 / 2, #3, 0.6} & @@@ Take[hook, 4], {late[129.5] + #1 / 2, #2 / 2, #3, 0.7} & @@@ hook, {late[472.2] + #1 / 2, #2 / 2, #3, 0.6} & @@@ hook];
(* hydrogen's chord, one bell as each line appears, and again at the end *)
bellEvents = Join[Table[{fallAt[k] + 0.5, 3, balmerPitch[[k + 1]] + 12, 0.85}, {k, 0, 3}], Table[{late[479.2] + k / 2, 4, balmerPitch[[k + 1]] + 12, 0.6}, {k, 0, 3}]];
crashEvents = {#, 2, "cr", 0.6} & /@ Join[{15.6, 70}, late /@ {125, 199.2, 273.4, 471.2}];
riserEvents = {{14.1, 1.5, 60, 0.75}, {late[122], 3, 60, 0.9}, {late[196.5], 2.7, 60, 0.8}};
impactEvents = {{15.6, 2, 36, 0.8}};
(* the score in two pieces: up to 88 s, and the rest, played in the part of the film that runs 8 s later *)
scorePart[sel_, shift_] := Mixer["FadeOut" -> 3][Track[DeleteCases[MapThread[With[{ev = {#[[1]] - shift, Sequence @@ Rest[#]} & /@ Select[#2, sel[#[[1]]] &]}, If[ev === {}, Nothing, Instrument[#1][Track[ev]]]] &,
    {{"Pad", "Bass", "SoftKick", "Hat", "Hat", "Lead", "Bell", "Crash", "Riser", "Impact"},
     {padEvents, bassEvents, pulseEvents, hatEvents, clickEvents, leadEvents, bellEvents, crashEvents, riserEvents, impactEvents}}], Nothing]]];
earlyScore = scorePart[# < 88 &, 0];
lateScore = scorePart[# >= 88 &, 8];
TrackView["PianoRoll", "Cycles" -> 16][TrackShift[-132][Track[{Track[padEvents], Track[leadEvents]}]]]
```

## The Film

The edit: every part over the dark ground, the score beneath, eight minutes at twenty-four frames a second:

```wl
film = AnimatedGraphics[{Backdrop[inkC], coldOpen, planckPart, photoPart, atomPart, earlyScore,
    (* everything after Bohr's atom, written on a clock that starts 8 s later *)
    {8, 503.5} -> AnimatedGraphics[{deBrogliePart, helgolandPart, diracPart, psiPart, schrodingerPart, bornPart,
        uncertaintyPart, wallsPart, entanglePart, feynmanPart, builtPart, computingPart, skepticsPart, outroPart, lateScore}, "Duration" -> 495.5]},
    "Duration" -> 503.5, "CyclesPerSecond" -> 1, FrameRate -> 24]
```

Twelve moments of it:

```wl
GraphicsGrid[Partition[film[#, ImageSize -> 400] & /@ {5, 16, 29, 60, 77, 85, 107, 132, 150, 188, 220, 300, 360, 380, 422, 475}, 3], ImageSize -> 1200]
```

Render it, frames in parallel, and store it in the cloud, public:

```wl
mp4 = Export["Quantum.mp4", film];
video = If[StringQ[mp4], Video[CopyFile[mp4, CloudObject["WolframFilm/Quantum.mp4", Permissions -> "Public"], OverwriteTarget -> True]], mp4]
```

## References

[1] Every clip used, its source, moment, transcript and rights: [CLIPS.md](https://github.com/WolframInstitute/WolframFilm/blob/main/films/Quantum/docs/CLIPS.md); every date and paper: [SOURCES.md](https://github.com/WolframInstitute/WolframFilm/blob/main/films/Quantum/docs/SOURCES.md)

[2] R. Bach, D. Pope, S.-H. Liou, H. Batelaan, [Controlled double-slit electron diffraction](https://doi.org/10.1088/1367-2630/15/3/033018), New Journal of Physics 15, 033018 (2013)

[3] E. Schrödinger, [Quantisierung als Eigenwertproblem](https://doi.org/10.1002/andp.19263840404), Annalen der Physik 79, 361 (1926); M. Born, [Zur Quantenmechanik der Stoßvorgänge](https://doi.org/10.1007/BF01397477), Zeitschrift für Physik 37, 863 (1926)

[4] W. Heisenberg, [Über quantentheoretische Umdeutung](https://doi.org/10.1007/BF01328377), Zeitschrift für Physik 33, 879 (1925); [Über den anschaulichen Inhalt](https://doi.org/10.1007/BF01397280), Zeitschrift für Physik 43, 172 (1927)

[5] J. S. Bell, [On the Einstein Podolsky Rosen paradox](https://doi.org/10.1103/PhysicsPhysiqueFizika.1.195), Physics 1, 195 (1964); A. Aspect, J. Dalibard, G. Roger, [Experimental Test of Bell's Inequalities Using Time-Varying Analyzers](https://doi.org/10.1103/PhysRevLett.49.1804), PRL 49, 1804 (1982)

[6] R. P. Feynman, [The Character of Physical Law](https://archive.org/details/the-messenger-lectures), Messenger Lectures, Cornell, 1964; [Space-Time Approach to Non-Relativistic Quantum Mechanics](https://doi.org/10.1103/RevModPhys.20.367), RMP 20, 367 (1948)

[7] [The Nobel Prize in Physics 2022](https://www.nobelprize.org/prizes/physics/2022/summary/); [The International Year of Quantum Science and Technology](https://quantum2025.org/about-iyq-2025/)
