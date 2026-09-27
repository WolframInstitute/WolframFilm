dir = FileNameJoin[{DirectoryName[$InputFileName], "..", "..", "assets", "wl"}];
seeds = {"List", "Plot", "Map", "Graph", "Entity", "Image", "Manipulate", "GeoGraphics", "Audio", "Molecule", "Classify", "StringReplace", "Table", "Association", "Dataset", "Interpreter"};
relOf[names_] := AssociationThread[names, Map[Take[CommonName /@ Replace[#, _Missing -> {}], UpTo[8]] &,
    EntityValue[Entity["WolframLanguageSymbol", #] & /@ names, "RelatedSymbols"]]];
r1 = relOf[seeds];
lvl1 = Complement[DeleteDuplicates[Flatten[Values[r1]]], seeds];
r2 = relOf[lvl1];
rel = Join[r1, r2];
edges = DeleteDuplicates[Sort /@ Flatten[KeyValueMap[Function[{s, rs}, UndirectedEdge[s, #] & /@ rs], rel]]];
g = Graph[edges];
g = KCoreComponents[g, 2] // First // Subgraph[g, #] &;
emb = GraphEmbedding[g, "SpringElectricalEmbedding"];
vs = VertexList[g];
Export[FileNameJoin[{dir, "x_graph.json"}], <|"vertices" -> MapThread[<|"name" -> #1, "x" -> #2[[1]], "y" -> #2[[2]], "deg" -> VertexDegree[g, #1]|> &, {vs, emb}],
   "edges" -> (({First@FirstPosition[vs, #[[1]]], First@FirstPosition[vs, #[[2]]]} - 1) & /@ EdgeList[g])|>];
Print[{VertexCount[g], EdgeCount[g]}];
