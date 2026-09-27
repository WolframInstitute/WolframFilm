Get["/Users/swish/src/wolfram/WolframFilm/data/assets/common.wl"];
r = ResourceFunction["BirdSay"]["Every language starts with a few words."];
r2 = r /. RawBoxes[s_String] :> Style[ToExpression[s], 15, FontFamily -> "Helvetica", Black];
img = Rasterize[r2[[1]], ImageResolution -> 144, Background -> White];
Export[$out <> "v11_birdsay.png", img];
$manifest["v11_birdsay"] = <|"file" -> "v11_birdsay.png", "code" -> "ResourceFunction[\"BirdSay\"][\"Every language starts with a few words.\"]", "versionIntroduced" -> ToString[ver["ResourceFunction"]], "width" -> Round[ImageDimensions[img][[1]]/2], "height" -> Round[ImageDimensions[img][[2]]/2], "notes" -> "Wolfram Function Repository, fetched live"|>;
Print[ImageDimensions[img]];
writeManifest[];
