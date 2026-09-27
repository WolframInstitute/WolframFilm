n = 3*10^6;
f = Function[{m}, Module[{s = 0.}, Do[s += Sin[i]^2, {i, m}]; s]];
cf = FunctionCompile[Function[Typed[m, "MachineInteger"], Module[{s = 0., i = 1}, While[i <= m, s += Sin[N[i]]^2; i++]; s]]];
Print[Head[cf]];
{t1, r1} = AbsoluteTiming[f[n]]; {t2, r2} = AbsoluteTiming[cf[n]];
Print[{t1, r1, t2, r2}];
If[NumberQ[r2] && Abs[r1 - r2] < 10^-6 Abs[r1],
  Export[FileNameJoin[{DirectoryName[$InputFileName], "..", "..", "assets", "wl", "x_compile.json"}], <|"n" -> n, "interpreted" -> t1, "compiled" -> t2, "speedup" -> t1/t2, "result" -> r1|>]];
