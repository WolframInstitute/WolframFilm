(* 3D outputs re-rendered from 24 viewpoints: a mouse drag wiggles the view (interactive rotation arrived in 6.0) *)
dir = FileNameJoin[{DirectoryName[$InputFileName], "..", "..", "assets", "wl", "rot"}];
n = 24;
views[vp0_] := Table[RotationTransform[40 Degree Sin[2 Pi k/n], {0, 0, 1}][vp0] + {0, 0, 0.6 Sin[4 Pi k/n] 0.5}, {k, 0, n - 1}];
frames[name_, g_, vp0_, size_] := Do[
  Export[FileNameJoin[{dir, name <> "_" <> IntegerString[k - 1, 10, 2] <> ".png"}],
    Rasterize[Show[g, ViewPoint -> views[vp0][[k]], SphericalRegion -> True, ImageSize -> size], ImageResolution -> 108, Background -> White]],
  {k, n}];
tc[label_, body_] := (WriteString["stdout", label, "\n"]; Quiet@Check[TimeConstrained[body, 600, WriteString["stdout", "TIMEOUT ", label, "\n"]], WriteString["stdout", "FAILED ", label, "\n"]]);
SetAttributes[tc, HoldRest];
tc["knot", frames["fam_knot", ParametricPlot3D[{Sin[u] + 2 Sin[2 u], Cos[u] - 2 Cos[2 u], -Sin[3 u]} + 0.45 {Cos[v] Cos[u], Cos[v] Sin[u], Sin[v]}, {u, 0, 2 Pi}, {v, 0, 2 Pi}, PlotPoints -> {160, 24}, Mesh -> None, ColorFunction -> (ColorData["Rainbow"][#4] &), Boxed -> False, Axes -> False], {0, 0.4, 3}, 380]];
tc["spherical", frames["fam_spherical", SphericalPlot3D[1 + Sin[5 t] Sin[5 p]/3, {t, 0, Pi}, {p, 0, 2 Pi}, PlotPoints -> 60, Mesh -> None, ColorFunction -> "SunsetColors", Boxed -> False, Axes -> False], {1.3, -2.4, 2}, 380]];
tc["region", frames["fam_region3d", RegionPlot3D[x^2 + y^2 + z^2 < 1 && Sin[6 x] + Sin[6 y] + Sin[6 z] > 0, {x, -1, 1}, {y, -1, 1}, {z, -1, 1}, PlotPoints -> 50, Mesh -> None, Boxed -> False, Axes -> False], {1.3, -2.4, 2}, 380]];
tc["complex", frames["fam_complex", ComplexPlot3D[(z^3 - 1)/(z^2 + 1), {z, -2 - 2 I, 2 + 2 I}, PlotPoints -> 50, Boxed -> False, Axes -> False], {1.3, -2.4, 2}, 380]];
tc["molecule", frames["v12_molecule", MoleculePlot3D[Molecule["caffeine"]], {1.3, -2.4, 2}, 420]];
tc["geodesic", frames["v13_geodesic", Graphics3D[{EdgeForm[White], GeodesicPolyhedron["Icosahedron", 4]}, Boxed -> False, Lighting -> "Neutral"], {1.3, -2.4, 2}, 420]];
tc["manip", frames["v6_manip_mid", Plot3D[Sin[1.8 x] Cos[y], {x, -3, 3}, {y, -3, 3}, PlotTheme -> "Classic"], {1.3, -2.4, 2}, 460]];
(* Spikey geometry: polyhedra for the film's own renderer *)
poly[name_] := With[{p = PolyhedronData[name, "Polyhedron"]}, <|"v" -> N[PolyhedronCoordinates[p]], "f" -> (PolyhedronFaces[p] /. Polygon[f_] :> f)|>];
Export[FileNameJoin[{dir, "..", "polyhedra.json"}], <|"icosahedron" -> poly["Icosahedron"], "dodecahedron" -> poly["Dodecahedron"], "rhombicHexecontahedron" -> poly["RhombicHexecontahedron"]|>];
WriteString["stdout", "done\n"];
