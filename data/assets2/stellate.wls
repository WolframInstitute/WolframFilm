dir = FileNameJoin[{DirectoryName[$InputFileName], "..", "..", "assets", "wl"}];
(* Stellate[p, r] from the 1.0 Polyhedra package: raise each face to a pyramid whose apex is r times the face centroid (default r = 2) *)
stellate[{v_, f_}, r_ : 2] := Flatten[Table[With[{pts = v[[face]], c = r Mean[v[[face]]]}, Polygon[{#1, #2, c}] & @@@ Partition[pts, 2, 1, 1]], {face, f}], 1];
ico = {N@PolyhedronData["Icosahedron", "VertexCoordinates"], PolyhedronData["Icosahedron", "FaceIndices"]};
g = Graphics3D[{EdgeForm[{Black, Thin}], GrayLevel[0.8], stellate[ico]}, Boxed -> True,
   Lighting -> {{"Directional", GrayLevel[0.95], {3, -2, 4}}, {"Directional", GrayLevel[0.35], {-3, 2, 1}}, {"Ambient", GrayLevel[0.2]}}, ViewPoint -> {1.3, -2.4, 2}];
Export[FileNameJoin[{dir, "x_stellate.png"}], Rasterize[g, ImageResolution -> 144, ImageSize -> 360, Background -> White]];
