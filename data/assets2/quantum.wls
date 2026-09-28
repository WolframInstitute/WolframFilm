dir = FileNameJoin[{DirectoryName[$InputFileName], "..", "..", "assets", "wl"}];
Needs["Wolfram`QuantumFramework`"];
qc = QuantumCircuitOperator[{"H", "CNOT" -> {1, 2}, "CNOT" -> {2, 3}}];
Export[FileNameJoin[{dir, "x_quantum_std.png"}], Rasterize[Style[qc, Background -> White], ImageResolution -> 144]];
Export[FileNameJoin[{dir, "x_quantum_trad.png"}], Rasterize[Style[TraditionalForm[qc], Background -> White], ImageResolution -> 144]];
Print[ImageDimensions /@ Import /@ FileNameJoin[{dir, #}] & /@ {"x_quantum_std.png", "x_quantum_trad.png"}];
