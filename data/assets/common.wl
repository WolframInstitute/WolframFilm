$out = "/Users/swish/src/wolfram/WolframFilm/assets/wl/";
$manifest = If[FileExistsQ[$out <> "manifest.json"], Import[$out <> "manifest.json", "RawJSON"], <||>];
ver[s_String] := Quiet@Check[WolframLanguageData[s, "VersionIntroduced"], Missing[]];
save[name_String, g_, {w_, h_}, code_String, fn_String, notes_String : ""] := Module[{img, file = name <> ".png"},
  img = Rasterize[Show[g, ImageSize -> {w, h}], ImageResolution -> 144, Background -> White];
  Export[$out <> file, img];
  $manifest[name] = <|"file" -> file, "code" -> code, "versionIntroduced" -> ToString[ver[fn]], "width" -> w, "height" -> h, "notes" -> notes|>;
  Print[name, " ", ImageDimensions[img]];
];
saveJSON[name_String, data_, code_String, fn_String, notes_String : ""] := (
  Export[$out <> name <> ".json", data, "RawJSON", "Compact" -> True];
  $manifest[name] = <|"file" -> name <> ".json", "code" -> code, "versionIntroduced" -> ToString[ver[fn]], "notes" -> notes|>;
  Print[name, " json"]);
writeManifest[] := Export[$out <> "manifest.json", $manifest, "RawJSON"];
