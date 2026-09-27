names = StringSplit[Import["v15-names.txt", "Text"]];
u = Association[# -> Quiet@Check[ToExpression[#, InputForm, Function[s, MessageName[s, "usage"], HoldAll]], Null] & /@ names];
Export["v15-usage.json", Map[If[StringQ[#], #, Null] &, u], "RawJSON"];
Print[Count[Values[u], _String]];
