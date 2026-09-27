lex = Import["lexicon.json", "RawJSON"][[All, "Name"]];
names = Names["System`*"];
new = Complement[names, lex];
new = Select[new, StringQ[Quiet@ToExpression[#, InputForm, Function[s, MessageName[s, "usage"], HoldAll]]] &];
Print[Length[new]];
Export["v15-new.json", Association[# -> Quiet@ToExpression[#, InputForm, Function[s, MessageName[s, "usage"], HoldAll]] & /@ new], "RawJSON"];
Print[StringRiffle[new, " "]];
