Get["/Users/swish/src/wolfram/WolframFilm/data/assets/common.wl"];
tryIt[name_, expr_] := Module[{r = Quiet@Check[expr, $Failed]}, If[r === $Failed, Print[name, " FAILED"]]; r];
tryIt["stars", Module[{cls = EntityClass["Star", "NakedEyeStar"], d},
  d = Select[EntityValue[cls, {"EffectiveTemperature", "AbsoluteMagnitude"}], MatchQ[#, {_Quantity, _?NumberQ | _Quantity}] &];
  d = {QuantityMagnitude[#[[1]]], N@QuantityMagnitude[#[[2]]]} & /@ d;
  Print["stars n=", Length[d]];
  save["v10_stars", ListPlot[Style[{#[[1]], #[[2]]}, ColorData["TemperatureMap"][Rescale[Log[#[[1]]], Log[{2500, 30000}]]]] & /@ d, ScalingFunctions -> {"Reverse", "Reverse"}, PlotRange -> {{2000, 40000}, {-10, 10}}, Background -> Black, Axes -> False, Frame -> True, FrameStyle -> GrayLevel[0.6], FrameLabel -> {"temperature (K)", "absolute magnitude"}, PlotStyle -> PointSize[0.012]], {480, 320}, "ListPlot[StarData[EntityClass[\"Star\", \"NakedEyeStar\"], {\"EffectiveTemperature\", \"AbsoluteMagnitude\"}]]", "StarData", "Hertzsprung–Russell diagram of naked-eye stars"]]];
tryIt["birdsay", Module[{r = ResourceFunction["BirdSay"]["Every language starts with a few words."]}, Print["bird ", Head[r]]; save["v11_birdsay", r, {480, 300}, "ResourceFunction[\"BirdSay\"][\"Every language starts with a few words.\"]", "ResourceFunction", "Wolfram Function Repository"]]];
tryIt["molecule", save["v12_molecule", MoleculePlot3D[Molecule["caffeine"]], {420, 360}, "MoleculePlot3D[Molecule[\"caffeine\"]]", "MoleculePlot3D", ""]];
writeManifest[];
