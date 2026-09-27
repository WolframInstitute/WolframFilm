Get["/Users/swish/src/wolfram/WolframFilm/data/assets/common.wl"];
fams = {
 {"fam_contour", ContourPlot[Sin[x] Cos[y] + Cos[x y/2], {x, -4, 4}, {y, -4, 4}, PlotPoints -> 60, ColorFunction -> "SunsetColors", Contours -> 14], "ContourPlot[Sin[x] Cos[y] + Cos[x y/2], {x, -4, 4}, {y, -4, 4}]", "ContourPlot"},
 {"fam_density", DensityPlot[Sin[x^2 + y^2]/(1 + (x^2 + y^2)/8), {x, -4, 4}, {y, -4, 4}, PlotPoints -> 80, ColorFunction -> "Rainbow"], "DensityPlot[Sin[x^2 + y^2], {x, -4, 4}, {y, -4, 4}, ColorFunction -> \"Rainbow\"]", "DensityPlot"},
 {"fam_stream", StreamPlot[{y, -Sin[x] - y/5}, {x, -4, 4}, {y, -3, 3}, StreamColorFunction -> "Rainbow", StreamPoints -> Fine], "StreamPlot[{y, -Sin[x] - y/5}, {x, -4, 4}, {y, -3, 3}]", "StreamPlot"},
 {"fam_polar", PolarPlot[{Sin[4 t] + Cos[3 t]/2, Cos[5 t]}, {t, 0, 2 Pi}, PlotStyle -> Thick], "PolarPlot[{Sin[4 t] + Cos[3 t]/2, Cos[5 t]}, {t, 0, 2 Pi}]", "PolarPlot"},
 {"fam_knot", Graphics3D[{CapForm[None], Specularity[White, 40], Glow[GrayLevel[0.05]], Table[{ColorData["Rainbow"][k/200.], Tube[{KnotData[{"TorusKnot", {3, 5}}, "SpaceCurve"][2 Pi k/200], KnotData[{"TorusKnot", {3, 5}}, "SpaceCurve"][2 Pi (k + 1.05)/200]}, 0.18]}, {k, 0, 199}]}, Boxed -> False, Lighting -> "Neutral", ViewPoint -> {0, 0, 3}], "Graphics3D[Tube[KnotData[{\"TorusKnot\", {3, 5}}, \"SpaceCurve\"]]]", "KnotData"},
 {"fam_spherical", SphericalPlot3D[1 + Sin[5 t] Sin[5 p]/3, {t, 0, Pi}, {p, 0, 2 Pi}, PlotPoints -> 60, Mesh -> None, ColorFunction -> "SunsetColors", Boxed -> False, Axes -> False], "SphericalPlot3D[1 + Sin[5 t] Sin[5 p]/3, {t, 0, Pi}, {p, 0, 2 Pi}]", "SphericalPlot3D"},
 {"fam_region3d", RegionPlot3D[x^2 + y^2 + z^2 < 1 && Sin[6 x] + Sin[6 y] + Sin[6 z] > 0, {x, -1, 1}, {y, -1, 1}, {z, -1, 1}, PlotPoints -> 60, Mesh -> None, Boxed -> False, Axes -> False], "RegionPlot3D[Sin[6 x] + Sin[6 y] + Sin[6 z] > 0 && x^2 + y^2 + z^2 < 1, ...]", "RegionPlot3D"},
 {"fam_complex", ComplexPlot3D[(z^3 - 1)/(z^2 + 1), {z, -2 - 2 I, 2 + 2 I}, PlotPoints -> 60, Boxed -> False, Axes -> False], "ComplexPlot3D[(z^3 - 1)/(z^2 + 1), {z, -2 - 2 I, 2 + 2 I}]", "ComplexPlot3D"}
};
Do[save[f[[1]], f[[2]], {380, 320}, f[[3]], f[[4]]], {f, fams}];
names = Select[Names["System`*"], StringEndsQ[#, "Plot" | "Plot3D" | "Chart" | "Chart3D"] &];
vs = Association[# -> Quiet@WolframLanguageData[#, "VersionIntroduced"] & /@ names];
vs = Select[vs, NumberQ];
saveJSON["fam_names", vs, "Names[\"*Plot\"]", "Plot", ToString[Length[vs]] <> " documented …Plot / …Plot3D / …Chart symbols"];
Print[Length[vs]];
writeManifest[];
