Get["/Users/swish/src/wolfram/WolframFilm/data/assets/common.wl"];
cols = {Red, Orange, Yellow, Green, Cyan, Blue, Purple, Magenta, Pink, Brown};
Print["colour versions ", ver /@ {"Red", "Orange", "Yellow", "Green", "Cyan", "Blue", "Purple", "Magenta", "Pink", "Brown"}];
g5 = Graphics[Table[{cols[[Mod[k, 10] + 1]], EdgeForm[White], Disk[(1 + k/24) {Cos[k Pi/5.2], Sin[k Pi/5.2]}, 0.25 + k/60]}, {k, 60, 0, -1}]];
save["v5_colors", g5, {480, 480}, "Graphics[Table[{colors[[Mod[k, 10] + 1]], EdgeForm[White], Disk[(1 + k/24) {Cos[k Pi/5.2], Sin[k Pi/5.2]}, 0.25 + k/60]}, {k, 60, 0, -1}]]", "Red", "colors = {Red, Orange, Yellow, Green, Cyan, Blue, Purple, Magenta, Pink, Brown}; all 5.1-valid (Disk 2, EdgeForm 1)"];
(* 6.0-valid Europe *)
eu = CountryData["Europe"];
lonlat[p_] := p /. GeoPosition[x_] :> Map[Reverse, x, {-2}];
g6 = Graphics[{EdgeForm[White], ColorData["SunsetColors"][1 - Rescale[Log[QuantityMagnitude[CountryData[#, "Population"]]], {11, 18.5}]], lonlat[CountryData[#, "Polygon"]]} & /@ eu, PlotRange -> {{-25, 45}, {34, 72}}, AspectRatio -> 1/Cos[53 Degree] 38/70];
save["v6_europe", g6, {560, 420}, "Graphics[{ColorData[\"SunsetColors\"][1 - Rescale[Log[CountryData[#, \"Population\"]], {11, 18.5}]], CountryData[#, \"Polygon\"]} & /@ CountryData[\"Europe\"], PlotRange -> {{-25, 45}, {34, 72}}]", "CountryData", "6.0-valid code; modern CountryData returns GeoPosition polygons, converted to {lon, lat} for Graphics"];
(* 6.0-valid Turing machine *)
tmRows = TuringMachine[{596440, 2, 3}, {1, {{}, 0}}, 240][[All, 2]];
Print["tm ", Dimensions[tmRows]];
m = $manifest["v7_turing"]; m["code"] = "ArrayPlot[TuringMachine[{596440, 2, 3}, {1, {{}, 0}}, 240][[All, 2]]]"; m["notes"] = m["notes"] <> "; ArrayPlot 5.1, TuringMachine 6"; $manifest["v7_turing"] = m;
(* 4.2-valid rule 30 display *)
r30 = Show[Graphics[Raster[1 - Reverse[CellularAutomaton[30, {{1}, 0}, 160]]]]];
Print["r30 ", Head[r30]];
m = $manifest["v4_rule30"]; m["code"] = "Show[Graphics[Raster[1 - Reverse[CellularAutomaton[30, {{1}, 0}, 160]]]]]"; m["notes"] = "0/1 rows; 4.2-valid display (Raster 2, CellularAutomaton 4.2)"; $manifest["v4_rule30"] = m;
m = $manifest["v4_rule110"]; m["code"] = "Show[Graphics[Raster[1 - Reverse[CellularAutomaton[110, {{1}, 0}, 160]]]]]"; $manifest["v4_rule110"] = m;
(* ParametricPlot3D knot *)
gk = ParametricPlot3D[{Sin[u] + 2 Sin[2 u], Cos[u] - 2 Cos[2 u], -Sin[3 u]} + 0.45 {Cos[v] Cos[u], Cos[v] Sin[u], Sin[v]}, {u, 0, 2 Pi}, {v, 0, 2 Pi}, PlotPoints -> {160, 24}, Mesh -> None, ColorFunction -> (ColorData["Rainbow"][#4] &), Boxed -> False, Axes -> False, ViewPoint -> {0, 0.4, 3}];
save["fam_knot", gk, {380, 320}, "ParametricPlot3D[{Sin[u] + 2 Sin[2 u], Cos[u] - 2 Cos[2 u], -Sin[3 u]} + 0.45 {Cos[v] Cos[u], Cos[v] Sin[u], Sin[v]}, {u, 0, 2 Pi}, {v, 0, 2 Pi}]", "ParametricPlot3D", "trefoil tube, rainbow along u"];
writeManifest[];
