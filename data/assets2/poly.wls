dir = FileNameJoin[{DirectoryName[$InputFileName], "..", "..", "assets", "wl"}];
poly[name_] := <|"v" -> N[PolyhedronData[name, "VertexCoordinates"]], "f" -> PolyhedronData[name, "FaceIndices"]|>;
Export[FileNameJoin[{dir, "polyhedra.json"}], <|"icosahedron" -> poly["Icosahedron"], "dodecahedron" -> poly["Dodecahedron"], "rhombicHexecontahedron" -> poly["RhombicHexecontahedron"]|>];
Print[Length /@ {PolyhedronData["RhombicHexecontahedron", "VertexCoordinates"], PolyhedronData["RhombicHexecontahedron", "FaceIndices"]}];
Print[MemberQ[PolyhedronData[All], "Spikey"]];
