dir = FileNameJoin[{DirectoryName[$InputFileName], "..", "..", "assets", "wl"}];
tc[l_, b_] := Quiet@Check[TimeConstrained[b, 300, Print["TIMEOUT ", l]], Print["FAILED ", l]]; SetAttributes[tc, HoldRest];
(* 1. Spikey's birth: Show[Graphics3D[Stellate[Icosahedron[]]]] (1.0 Polyhedra package), grey lighting *)
tc["stellate", Module[{g},
  Needs["PolyhedronOperations`"];
  g = Stellate[PolyhedronData["Icosahedron"], 2.2];
  g = Graphics3D[{EdgeForm[{Black, Thin}], GrayLevel[0.8], Cases[Normal[g], _Polygon, Infinity]}, Boxed -> True, Lighting -> {{"Directional", GrayLevel[0.9], {3, -2, 4}}, {"Ambient", GrayLevel[0.25]}}, ViewPoint -> {1.3, -2.4, 2}];
  Export[FileNameJoin[{dir, "x_stellate.png"}], Rasterize[g, ImageResolution -> 144, ImageSize -> 360, Background -> White]]; Print["stellate ok"]]];
(* 2. a 4.0-style image import *)
tc["mandrill", Module[{img},
  img = ExampleData[{"TestImage", "Mandrill"}];
  Export[FileNameJoin[{dir, "x_mandrill.png"}], ImageResize[img, 360]]; Print["mandrill ok ", ImageDimensions[img]]]];
(* 3. ImageIdentify on it *)
tc["identify", Module[{r},
  r = ImageIdentify[ExampleData[{"TestImage", "Mandrill"}]];
  Print["identify: ", InputForm[r], " | ", CommonName[r]]]];
(* 4. 5.1 string patterns *)
Print[StringCases["Every language starts with a few words.", WordCharacter ..]];
Print[WolframLanguageData[#, "VersionIntroduced"] & /@ {"StringCases", "WordCharacter", "ImageIdentify", "Pluralize", "Stellate", "Import"}];
