Get["/Users/swish/src/wolfram/WolframFilm/data/assets/common.wl"];
saveBg[name_, g_, {w_, h_}, bg_, code_, fn_, notes_ : ""] := Module[{img = Rasterize[Show[g, ImageSize -> {w, h}], ImageResolution -> 144, Background -> bg]},
  Export[$out <> name <> ".png", img];
  $manifest[name] = <|"file" -> name <> ".png", "code" -> code, "versionIntroduced" -> ToString[ver[fn]], "width" -> w, "height" -> h, "notes" -> notes|>;
  Print[name, " ", ImageDimensions[img]]];
d = Select[EntityValue[EntityClass["Star", "NakedEyeStar"], {"EffectiveTemperature", "AbsoluteMagnitude"}], MatchQ[#, {_Quantity, _?NumberQ | _Quantity}] &];
d = {QuantityMagnitude[#[[1]]], N@QuantityMagnitude[#[[2]]]} & /@ d;
Print["stars ", Length[d]];
saveBg["v10_stars", ListPlot[Style[{#[[1]], #[[2]]}, ColorData["TemperatureMap"][1 - Rescale[Log[#[[1]]], Log[{2500, 30000}]]]] & /@ d, ScalingFunctions -> {"Reverse", "Reverse"}, PlotRange -> {{2000, 40000}, {-10, 10}}, Background -> Black, Axes -> False, Frame -> True, FrameStyle -> GrayLevel[0.65], FrameTicksStyle -> GrayLevel[0.75], FrameLabel -> {"temperature (K)", "absolute magnitude"}, PlotStyle -> PointSize[0.01]], {480, 320}, Black, "ListPlot[StarData[EntityClass[\"Star\", \"NakedEyeStar\"], {\"EffectiveTemperature\", \"AbsoluteMagnitude\"}]]", "StarData", "Hertzsprung–Russell diagram of the " <> ToString[Length[d]] <> " naked-eye stars with data"];
(* SystemModeler probe *)
sm = Quiet@Check[SystemModel["Modelica.Mechanics.MultiBody.Examples.Elementary.DoublePendulum"], $Failed];
Print["sm head ", Head[sm]];
sim = Quiet@Check[SystemModelSimulate[sm, 5], $Failed];
Print["sim ", Head[sim]];
If[Head[sim] === SystemModelSimulationData, Print["vars ", Take[sim["VariableNames"], UpTo[10]]]];
writeManifest[];
