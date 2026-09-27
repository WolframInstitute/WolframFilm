Get["/Users/swish/src/wolfram/WolframFilm/data/assets/common.wl"];
model = "Modelica.Mechanics.MultiBody.Examples.Elementary.DoublePendulum";
sim = SystemModelSimulate[model, 6];
vec[name_] := Table[sim[name <> "[" <> ToString[i] <> "]"], {i, 3}];
A = vec["boxBody1.frame_a.r_0"]; B = vec["boxBody1.frame_b.r_0"]; Ct = vec["boxBody2.frame_b.r_0"];
at[f_, t_] := Through[f[t]];
ts = Range[0, 6, 6/240];
data = Table[<|"t" -> t, "a" -> at[A, t], "b" -> at[B, t], "c" -> at[Ct, t]|>, {t, ts}];
saveJSON["v12_system", data, "SystemModelSimulate[\"Modelica.Mechanics.MultiBody.Examples.Elementary.DoublePendulum\", 6]", "SystemModelSimulate", "positions (m) of the pivot a, elbow b, tip c; 241 samples over 6 s"];
Print[data[[{1, 120}]]];
frame[t_] := Module[{a = at[A, t], b = at[B, t], c = at[Ct, t], trail},
  trail = Table[at[Ct, s], {s, Max[0, t - 1.2], t, 0.03}];
  Graphics3D[{
    {GrayLevel[0.85], Cuboid[{-0.18, 0.06, -0.12}, {0.18, 0.16, 0.12}]},
    {Specularity[White, 30], RGBColor[0.2, 0.45, 0.85], Cylinder[{a, b}, 0.045], RGBColor[0.93, 0.45, 0.15], Cylinder[{b, c}, 0.045]},
    {GrayLevel[0.3], Sphere[a, 0.06], Sphere[b, 0.06]}, {Red, Sphere[c, 0.05]},
    {RGBColor[0.9, 0.2, 0.1], Opacity[0.7], Thick, If[Length[trail] > 1, Line[trail], {}]}},
   PlotRange -> {{-1.1, 1.1}, {-1.1, 0.35}, {-0.6, 0.6}}, Boxed -> False, Lighting -> "Neutral", ViewPoint -> {0.9, 0.6, 3}, ViewVertical -> {0, 1, 0}, SphericalRegion -> True]];
Do[save["v12_system_" <> IntegerString[k, 10, 2], frame[k 4./31], {520, 400}, "SystemModelSimulate[\"Modelica.Mechanics.MultiBody.Examples.Elementary.DoublePendulum\", 6]", "SystemModelSimulate", "3D rendered in WL from simulated body positions"], {k, 0, 31}];
writeManifest[];
