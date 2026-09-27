dir = FileNameJoin[{DirectoryName[$InputFileName], "..", "..", "assets", "wl"}];
fb = ResourceData["Fireballs and Bolides"];
g = GeoBubbleChart[Normal[fb[All, #Coordinates -> #TotalRadiatedEnergy &]], GeoRange -> "World", ChartStyle -> RGBColor["#DD1100"], ImageSize -> 700];
Export[FileNameJoin[{dir, "x_fireballs.png"}], Rasterize[g, ImageResolution -> 144], "PNG"];
Print[Length[fb]];
