dir = FileNameJoin[{DirectoryName[$InputFileName], "..", "..", "assets", "wl"}];
lex = Import[FileNameJoin[{DirectoryName[$InputFileName], "..", "lexicon.json"}], "RawJSON"];
ver[r_] := ToExpression[StringSplit[r["FullVersionIntroduced"], "."][[1]]];
rel = {{"1.0", {1988, 6, 23}, 1, "Plot3D"}, {"2.0", {1991, 1, 15}, 2, "Module"}, {"3.0", {1996, 9, 3}, 3, "Cell"}, {"4.0", {1999, 5, 19}, 4, "Import"},
  {"5.0", {2003, 6, 12}, 5, "SparseArray"}, {"6.0", {2007, 5, 1}, 6, "Manipulate"}, {"7.0", {2008, 11, 18}, 7, "ParallelTable"}, {"8.0", {2010, 11, 15}, 8, "Graph"},
  {"9.0", {2012, 11, 28}, 9, "Quantity"}, {"10.0", {2014, 7, 9}, 10, "Entity"}, {"11.0", {2016, 8, 8}, 11, "NetTrain"}, {"12.0", {2019, 4, 16}, 12, "ResourceFunction"},
  {"13.0", {2021, 12, 13}, 13, "BioSequencePlot"}, {"14.0", {2024, 1, 9}, 14, "Comap"}};
rows = Module[{prev = None, tot = 0},
  Table[Module[{ws = Select[lex, ver[#] == r[[3]] &], d = DateObject[r[[2]], "Day"], n, gap, avg, longest},
    n = Length[ws]; tot += n;
    avg = Quantity[N@Round[Mean[StringLength[#["Name"]] & /@ ws], 0.1], "Characters"];
    longest = First[MaximalBy[#["Name"] & /@ ws, StringLength]];
    gap = If[prev === None, Missing["NotApplicable"], QuantityMagnitude[DateDifference[prev, d, "Month"]] // Round // Quantity[#, "Months"] &];
    prev = d;
    <|"version" -> r[[1]], "released" -> d, "new words" -> n, "total" -> tot, "avg length" -> avg, "since previous" -> gap, "signature word" -> Entity["WolframLanguageSymbol", r[[4]]], "longest new word" -> longest|>], {r, rel}]];
t = Tabular[rows];
Print[InputForm[ColumnTypes[t]]];
Export[FileNameJoin[{dir, "x_tabular.png"}], Rasterize[t, ImageResolution -> 144]];
Print[InputForm[ColumnTypes[t]]];
Print[Table[WolframLanguageData[r[[4]], "VersionIntroduced"], {r, rel}]];
