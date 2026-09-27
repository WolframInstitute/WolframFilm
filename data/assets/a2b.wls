Get["/Users/swish/src/wolfram/WolframFilm/data/assets/common.wl"];
eu = DeleteCases[CountryData["Europe"], Entity["Country", "Svalbard"]];
lp = N@Log10[QuantityMagnitude[EntityValue[eu, "Population"]]];
rk = N[(Ordering[Ordering[lp]] - 1)/(Length[lp] - 1)];
g = GeoGraphics[MapThread[{EdgeForm[{White, AbsoluteThickness[0.6]}], GeoStyling[ColorData["SunsetColors"][1 - 0.92 #2]], Polygon[#1]} &, {eu, rk}], GeoRange -> {{35, 71}, {-11, 40}}, GeoRangePadding -> None, GeoBackground -> None, GeoProjection -> "Mercator", Frame -> False];
save["v6_europe", g, {560, 420}, "GeoGraphics[{GeoStyling[ColorData[\"SunsetColors\"][Rescale[Log[#[\"Population\"]]]]], Polygon[#]} & /@ CountryData[\"Europe\"]]", "CountryData", "coloured by log10 population"];
writeManifest[];
