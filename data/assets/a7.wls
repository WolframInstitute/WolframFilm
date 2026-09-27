Get["/Users/swish/src/wolfram/WolframFilm/data/assets/common.wl"];
saveRaw[name_, g_, {w_, h_}, code_, fn_, notes_ : ""] := Module[{img = Rasterize[g, ImageResolution -> 144, Background -> Black]},
  img = ImageCrop[ImagePad[img, 0, Black], 2 {w, h}, Padding -> Black];
  Export[$out <> name <> ".png", img];
  $manifest[name] = <|"file" -> name <> ".png", "code" -> code, "versionIntroduced" -> ToString[ver[fn]], "width" -> w, "height" -> h, "notes" -> notes|>;
  Print[name, " ", ImageDimensions[img]]];
orion = Entity["Constellation", "Orion"];
stars = {"Betelgeuse", "Rigel", "Bellatrix", "Alnitak", "Alnilam", "Mintaka", "Saiph"};
r1 = AstroGraphics[{White, PointSize[Large], Point /@ (Entity["Star", #] & /@ stars)},
  AstroRange -> Quantity[13, "AngularDegrees"], AstroCenter -> Entity["Star", "Alnilam"], AstroBackground -> AstroStyling[{"BlackSky", "ShowConstellations" -> {orion}}], AstroReferenceFrame -> "Equatorial", ImageSize -> {560, 380}, AspectRatio -> 380/560];
saveRaw["v13_astro", r1, {560, 380}, "AstroGraphics[Point /@ orionStars, AstroRange -> Entity[\"Constellation\", \"Orion\"], AstroBackground -> \"BlackSky\"]", "AstroGraphics", "black sky, Orion constellation lines, bright stars labelled"];
writeManifest[];
