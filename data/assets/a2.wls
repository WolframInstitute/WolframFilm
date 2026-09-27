Get["/Users/swish/src/wolfram/WolframFilm/data/assets/common.wl"];
eu = CountryData["Europe"];
lp = N@Log10[QuantityMagnitude[EntityValue[eu, "Population"]]];
mm = MinMax[Select[lp, NumberQ]];
g = GeoGraphics[MapThread[{EdgeForm[{White, AbsoluteThickness[0.6]}], GeoStyling[ColorData["SunsetColors"][Rescale[#2, mm]]], Polygon[#1]} &, {eu, lp}], GeoRange -> {{34, 71}, {-12, 42}}, GeoBackground -> None, GeoProjection -> "Mercator", Frame -> False];
save["v6_europe", g, {560, 420}, "GeoGraphics[{GeoStyling[ColorData[\"SunsetColors\"][Rescale[Log[#[\"Population\"]]]]], Polygon[#]} & /@ CountryData[\"Europe\"]]", "CountryData", "coloured by log10 population"];
Do[With[{a = 0.5 + 2.5 i/15},
  save["v6_manip_" <> IntegerString[i, 10, 2], Plot3D[Sin[a x] Cos[y], {x, -3, 3}, {y, -3, 3}, PlotTheme -> "Classic", PlotPoints -> 40, PlotRange -> {-1, 1}], {460, 300}, "Manipulate[Plot3D[Sin[a x] Cos[y], {x, -3, 3}, {y, -3, 3}], {a, 0.5, 3}]", "Manipulate", "a = " <> ToString[a]]],
  {i, 0, 15}];
writeManifest[];
