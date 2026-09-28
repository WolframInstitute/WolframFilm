dir = FileNameJoin[{DirectoryName[$InputFileName], "..", "..", "assets", "wl"}];
t = ExpressionTree[Unevaluated[Manipulate[Plot[Sin[a x], {x, 0, 2 Pi}], {a, 1, 5}]]];
Print[Head[t], " root: ", TreeData[t]];
Export[FileNameJoin[{dir, "x_tree.png"}], Rasterize[Style[t, Background -> White], ImageResolution -> 144, ImageSize -> 620]];
