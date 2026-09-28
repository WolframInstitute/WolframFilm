snips = Import["/Users/swish/src/wolfram/WolframFilm/data/runnable.json", "RawJSON"];
LaunchKernels[];
(* simpler: evaluate each once, capture messages via $MessageList-like handler *)
results = Table[
  Module[{code = s["code"], out, msgs = {}, t, bad},
   t = First@AbsoluteTiming[
      out = Internal`HandlerBlock[{"Message", (If[Last[#], AppendTo[msgs, ToString[First[#], InputForm]]]) &},
        TimeConstrained[ToExpression[code], 300, $TimedOut]]];
   bad = MatchQ[out, $Failed | $TimedOut | _Failure | _Missing] || ! FreeQ[out, $Failed] || msgs =!= {};
   Print[If[bad, "FAIL ", "ok   "], s["sec"], " ", s["at"], "  ", Round[t, 0.1], "s  ",
    StringTake[ToString[Head[out]], UpTo[30]], "  ",
    If[msgs === {}, "", StringTake[StringRiffle[DeleteDuplicates@msgs, " | "], UpTo[400]]],
    If[bad && msgs === {}, "  OUT: " <> StringTake[ToString[Short[out, 3], InputForm], UpTo[300]], ""]];
   bad],
  {s, snips}];
Print["failures: ", Count[results, True], " / ", Length[results]];
