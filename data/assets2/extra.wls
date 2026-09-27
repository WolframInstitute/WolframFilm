(* Extra computed assets for the film (Parallel, Graphs, Trees, Compiler, Quantum, Data Repository). *)
dir = FileNameJoin[{DirectoryName[$InputFileName], "..", "..", "assets", "wl"}];
log[s_] := (WriteString["stdout", s, "\n"]);
save[name_, expr_] := Module[{f = FileNameJoin[{dir, name}]}, Export[f, expr]; log["wrote " <> name]];
png[name_, g_, size_] := save[name, Rasterize[Style[g, Background -> White], ImageResolution -> 144, ImageSize -> size]];
tc[label_, body_] := Quiet@Check[TimeConstrained[body, 240, log["TIMEOUT " <> label]], log["FAILED " <> label]];
SetAttributes[tc, HoldRest];
man = <||>;

(* 1. Parallel: Julia set rows computed across kernels; record which kernel did each row *)
tc["parallel", Module[{k, rows, img, ids},
  LaunchKernels[];
  k = $KernelCount;
  julia = Compile[{{z0, _Complex}}, Module[{z = z0, n = 0}, While[Abs[z] < 2 && n < 120, z = z^2 + (-0.8 + 0.156 I); n++]; n]];
  DistributeDefinitions[julia];
  rows = ParallelTable[{$KernelID, Table[julia[x + I y], {x, -1.6, 1.6, 3.2/479}]}, {y, 0.95, -0.95, -1.9/299}, Method -> "CoarsestGrained"];
  ids = rows[[All, 1]];
  img = Colorize[Image[Rescale[Log[1. + rows[[All, 2]]]]], ColorFunction -> "SunsetColors"];
  save["x_parallel.png", ImageResize[img, 960]];
  save["x_parallel_kernels.json", ids];
  man["x_parallel"] = <|"code" -> "ParallelTable[julia[x + I y], {y, 0.95, -0.95, -0.0064}, {x, -1.6, 1.6, 0.0067}]", "kernels" -> k, "version" -> "7"|>;
  CloseKernels[];
]];

(* 2. Graph of the language itself: symbols linked to their related symbols *)
tc["graph", Module[{seeds, edges, g, emb, vs},
  seeds = {"List", "Plot", "Map", "Graph", "Entity", "Image", "Manipulate", "CellularAutomaton", "GeoGraphics", "Audio", "Molecule", "Tree", "Classify", "Integrate", "StringReplace", "Table"};
  edges = DeleteDuplicates[Sort /@ Flatten[Table[UndirectedEdge[s, CommonName[#]] & /@ Take[Replace[WolframLanguageData[s, "RelatedSymbols"], _Missing -> {}], UpTo[7]], {s, seeds}]]];
  g = Graph[edges];
  g = Subgraph[g, First[ConnectedComponents[g]]];
  emb = GraphEmbedding[g, "SpringElectricalEmbedding"];
  vs = VertexList[g];
  save["x_graph.json", <|"vertices" -> MapThread[<|"name" -> #1, "x" -> #2[[1]], "y" -> #2[[2]], "deg" -> VertexDegree[g, #1]|> &, {vs, emb}],
     "edges" -> (({First@FirstPosition[vs, #[[1]]], First@FirstPosition[vs, #[[2]]]} - 1) & /@ EdgeList[g])|>];
  man["x_graph"] = <|"code" -> "Graph[Flatten[Thread[# \[UndirectedEdge] WolframLanguageData[#, \"RelatedSymbols\"]] & /@ seeds]]", "vertices" -> Length[vs], "edges" -> EdgeCount[g], "version" -> "8"|>;
]];

(* 3. Trees: code as a tree *)
tc["tree", Module[{t},
  t = ExpressionTree[Hold[Manipulate[Plot[Sin[a x], {x, 0, 2 Pi}], {a, 1, 5}]]];
  png["x_tree.png", t, 620];
  man["x_tree"] = <|"code" -> "ExpressionTree[Hold[Manipulate[Plot[Sin[a x], {x, 0, 2 Pi}], {a, 1, 5}]]]", "version" -> "12.3"|>;
]];

(* 4. Compiler: the same loop, evaluated vs compiled (timings measured here) *)
tc["compile", Module[{f, cf, t1, t2, n = 3*10^6},
  f = Function[{m}, Module[{s = 0.}, Do[s += Sin[i]^2, {i, m}]; s]];
  cf = FunctionCompile[Function[Typed[m, "MachineInteger"], Module[{s = 0.}, Do[s += Sin[i]^2, {i, m}]; s]]];
  t1 = First@AbsoluteTiming[f[n]]; t2 = First@AbsoluteTiming[cf[n]];
  save["x_compile.json", <|"n" -> n, "interpreted" -> t1, "compiled" -> t2, "speedup" -> t1/t2|>];
  man["x_compile"] = <|"code" -> "cf = FunctionCompile[Function[Typed[n, \"MachineInteger\"], Module[{s = 0.}, Do[s += Sin[i]^2, {i, n}]; s]]]", "version" -> "12"|>;
]];

(* 5. Quantum Framework: a GHZ circuit, its diagram and its measurement probabilities *)
tc["quantum", Module[{qc, st},
  Needs["Wolfram`QuantumFramework`"];
  qc = QuantumCircuitOperator[{"H", "CNOT" -> {1, 2}, "CNOT" -> {2, 3}}];
  png["x_quantum_circuit.png", qc["Diagram"], 560];
  st = qc[];
  png["x_quantum_probs.png", st["ProbabilityPlot"], 420];
  man["x_quantum"] = <|"code" -> "QuantumCircuitOperator[{\"H\", \"CNOT\" -> {1, 2}, \"CNOT\" -> {2, 3}}][\"Diagram\"]", "paclet" -> "Wolfram/QuantumFramework"|>;
]];

(* 6. Data Repository: the fireballs dataset from the 2017 launch *)
tc["fireballs", Module[{d},
  d = ResourceData["Fireballs and Bolides"];
  png["x_fireballs.png", GeoBubbleChart[Normal[d[All, #["NearestCity"] -> #["RadiatedEnergy"] &]], GeoRange -> "World", ImageSize -> 700], 700];
  man["x_fireballs"] = <|"code" -> "GeoBubbleChart[ResourceData[\"Fireballs and Bolides\"][All, #NearestCity -> #RadiatedEnergy &]]", "version" -> "11"|>;
]];

save["manifest_extra.json", man];
log["done"];
