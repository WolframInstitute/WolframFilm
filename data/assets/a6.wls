Get["/Users/swish/src/wolfram/WolframFilm/data/assets/common.wl"];
poly = SolarEclipse[DateObject[{2026, 8, 12}], "TotalPhasePolygon"];
Print["poly ", Head[poly]];
g = GeoGraphics[{GeoStyling[Opacity[0.6]], RGBColor[0.12, 0.08, 0.2], EdgeForm[{RGBColor[0.9, 0.2, 0.1], AbsoluteThickness[1.5]}], poly}, GeoCenter -> GeoPosition[{54, -14}], GeoRange -> Quantity[2600, "Kilometers"], GeoProjection -> "LambertAzimuthal", GeoBackground -> GeoStyling["ReliefMap"], Frame -> False, AspectRatio -> 360/560];
save["v15_eclipse", g, {560, 360}, "GeoGraphics[SolarEclipse[DateObject[{2026, 8, 12}], \"TotalPhasePolygon\"]]", "SolarEclipse", "path of totality of the 12 August 2026 total solar eclipse (Greenland, Iceland, Spain)"];
writeManifest[];
