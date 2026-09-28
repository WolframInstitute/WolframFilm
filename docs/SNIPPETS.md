# On-screen code snippets

Every input typed in the film, in order. Edit the code blocks and hand the file back; the `id` tells me where each lives.

### 1. `smp-1` · 0:08.2 · smp · SMP 1981 · input · shown as #I[1]::

```wl
Ex[(a + b)^3]
```

### 2. `smp-1-out` · 0:09.2 · smp · SMP 1981 · output · shown as #O[1]:

```wl
a^3 + 3 a^2 b + 3 a b^2 + b^3
```

### 3. `smp-2` · 0:09.8 · smp · SMP 1981 · input · SMP syntax unverified; followed by an ASCII plot

```wl
Plot[Sin[$x] Exp[-$x/8], {$x, 0, 20}]
```

### 4. `mac1@12#0` · 0:24.0 · v1 · Untitled-1 · In[1]

```wl
Names["*"]
```

### 5. `mac1@12#1` · 0:25.0 · v1 · Untitled-1 · Out[1]

```wl
{Above, Abs, Accuracy, AccuracyGoal, AddTo, AiryAi, All, And, Apart, Append, AppendTo, Apply, ArcCos, ArcCosh, ArcCot, ArcCoth, ArcCsc, ArcCsch, ArcSec, ArcSech, ArcSin, ArcSinh, ArcTan, ArcTanh, Arg, ArithmeticGeometricMean, Array, AspectRatio, AtomQ, Attributes, Automatic, Axes, AxesLabel, BaseForm, Begin, BeginPackage, Below, BernoulliB, BesselI, BesselJ, BesselK, BesselY, Beta, Binomial, Blank, BlankNullSequence, BlankSequence, Block, Bottom, Boxed, BoxRatios, Break, Byte, ByteCount, Cancel, Cases, Catalan, Catch, Ceiling, Center, CForm, Character, Characters, ChebyshevT, ChebyshevU, Check, Chop, Clear, ClearAll, ClearAttributes, Close, Coefficient, ...}
```

### 6. `mac1@12#2` · 0:28.0 · v1 · Untitled-1 · In[2]

```wl
Plot3D[Sin[x y], {x, 0, 3}, {y, 0, 3}]
```

### 7. `mac1@12#4` · 0:29.2 · v1 · Untitled-1 · Out[2]

```wl
-SurfaceGraphics-
```

### 8. `next@16#0` · 0:32.0 · next · Untitled-1.ma  — · In[2]

```wl
Characters["NeXT"]
```

### 9. `next@16#1` · 0:33.0 · next · Untitled-1.ma  — · Out[2]

```wl
{N, e, X, T}
```

### 10. `next@16#2` · 0:36.0 · grammar · Untitled-1.ma  — · In[3]

```wl
FullForm[{x -> 1, f[y]}]
```

### 11. `next@16#3` · 0:37.2 · grammar · Untitled-1.ma  — · Out[3]

```wl
List[Rule[x, 1], f[y]]
```

### 12. `win31@20#0` · 0:40.0 · v2 · Mathematica for Windows - [Untitled-1] · In[1]

```wl
Module[{word = "language"}, StringReverse[word]]
```

### 13. `win31@20#1` · 0:41.0 · v2 · Mathematica for Windows - [Untitled-1] · Out[1]

```wl
egaugnal
```

### 14. `win31@20#2` · 0:41.5 · v2 · Mathematica for Windows - [Untitled-1] · In[2]

```wl
ParametricPlot3D[{u Cos[u] (4 + Cos[v + u]), u Sin[u] (4 + Cos[v + u]), u Sin[v + u]}, {u, 0, 4 Pi}, {v, 0, 2 Pi}]
```

### 15. `win31@20#4` · 0:42.4 · v2 · Mathematica for Windows - [Untitled-1] · Out[2]

```wl
-Graphics3D-
```

### 16. `win95@22#0` · 0:44.0 · v3 · Mathematica - [Untitled-1] · title

```wl
Notes on Language
```

### 17. `mac9@24#0` · 0:48.0 · v4 · Untitled-1 · In[1]

```wl
words = Import["survey.csv"]
```

### 18. `mac9@24#1` · 0:48.6 · v4 · Untitled-1 · Out[1]

```wl
{{"word", "language"}, {"hello", "English"}, {"bonjour", "French"}, ...}
```

### 19. `mac9@24#2` · 0:49.2 · v4 · Untitled-1 · In[2]

```wl
Show[Graphics[Raster[1 - Reverse[CellularAutomaton[30, {{1}, 0}, 160]]]]]
```

### 20. `mac9@24#4` · 0:50.0 · v4 · Untitled-1 · Out[2]

```wl
-Graphics-
```

### 21. `xp@26#0` · 0:52.0 · v5 · Mathematica 5.1 - [Untitled-1] · In[1]

```wl
{Red, Green, Blue, Orange, Purple}
```

### 22. `xp@26#1` · 0:52.7 · v5 · Mathematica 5.1 - [Untitled-1] · Out[1]

```wl
{RGBColor[1, 0, 0], RGBColor[0, 1, 0], RGBColor[0, 0, 1], RGBColor[1, 0.5, 0], RGBColor[0.5, 0, 0.5]}
```

### 23. `xp@26#2` · 0:53.5 · v5 · Mathematica 5.1 - [Untitled-1] · In[2]

```wl
Show[Graphics[Table[{colors[[Mod[k, 10] + 1]], EdgeForm[White], Disk[(1 + k/24) {Cos[k Pi/5.2], Sin[k Pi/5.2]}, 0.25 + k/60]}, {k, 60, 0, -1}]]]
```

### 24. `xp@26#4` · 0:54.4 · v5 · Mathematica 5.1 - [Untitled-1] · Out[2]

```wl
-Graphics-
```

### 25. `osx@28#0` · 0:56.0 · v6 · Untitled-1 · In[1]

```wl
WordData["language", "Definitions"]
```

### 26. `osx@28#1` · 0:56.6 · v6 · Untitled-1 · Out[1]

```wl
{{language, Noun, Faculty} -> the mental faculty or power of vocal communication, ...}
```

### 27. `osx@28#2` · 0:57.0 · v6 · Untitled-1 · In[2]

```wl
Graphics[{ColorData["SunsetColors"][1 - Rescale[Log[CountryData[#, "Population"]], {11, 18.5}]], CountryData[#, "Polygon"]} & /@ CountryData["Europe"], PlotRange -> {{-25, 45}, {34, 72}}]
```

### 28. `osx@28#4` · 0:58.6 · v6 · Untitled-1 · In[3]

```wl
ArrayPlot[TuringMachine[{596440, 2, 3}, {1, {{}, 0}}, 240][[All, 2]]]
```

### 29. `osx@28#6` · 0:59.7 · v6 · Untitled-1 · In[4]

```wl
Manipulate[Plot3D[Sin[a x] Cos[y], {x, -3, 3}, {y, -3, 3}], {a, 0.5, 3}]
```

### 30. `osx@28#8` · 1:08.0 · v7 · Untitled-1 · In[5]

```wl
ParallelTable[julia[x + I y], {y, 0.95, -0.95, -0.0064}, {x, -1.6, 1.6, 0.0067}]
```

### 31. `osx@28#11` · 1:11.0 · v8 · Untitled-1 · Out[6]

```wl
{Albania, Andorra, Austria, Belarus, Belgium, Bosnia and Herzegovina, Bulgaria, Croatia, ...}
```

### 32. `osx@28#12` · 1:12.0 · v8 · Untitled-1 · In[7]

```wl
Graph[UndirectedEdge @@@ borders, VertexLabels -> Automatic]
```

### 33. `osx@28#14` · 1:14.0 · v9 · Untitled-1 · In[8]

```wl
UnitConvert[Quantity[5., "Kilometers"], "Miles"]
```

### 34. `osx@28#15` · 1:14.7 · v9 · Untitled-1 · Out[8]

```wl
3.10686 mi
```

### 35. `yosemite@40#0` · 1:21.0 · v10 · Untitled-1.nb · In[1]

```wl
Interpreter["Country"]["france"]
```

### 36. `yosemite@40#2` · 1:22.4 · v10 · Untitled-1.nb · In[2]

```wl
GeoGraphics[{NightHemisphere[DateObject[{2014, 7, 9, 12}]], GeoPath[{champaign, #}, "GreatCircle"] & /@ cities}, GeoProjection -> "Orthographic"]
```

### 37. `yosemite@40#4` · 1:26.0 · v10 · Untitled-1.nb · In[3]

```wl
WordTranslation["language", "French"]
```

### 38. `yosemite@40#5` · 1:26.5 · v10 · Untitled-1.nb · Out[3]

```wl
{langue, langage}
```

### 39. `yosemite@40#6` · 1:27.2 · v10 · Untitled-1.nb · In[4]

```wl
ListPlot[StarData[EntityClass["Star", "NakedEyeStar"], {"EffectiveTemperature", "AbsoluteMagnitude"}]]
```

### 40. `yosemite@40#8` · 1:29.7 · v10 · Untitled-1.nb · In[5]

```wl
Graph[Flatten[Thread[UndirectedEdge[#, WolframLanguageData[#, "RelatedSymbols"]]] & /@ seeds]]
```

### 41. `bigsur@46#0` · 1:32.0 · v11 · Untitled-1.nb · In[1]

```wl
NetTrain[net, examples]
```

### 42. `bigsur@46#2` · 1:33.0 · v11 · Untitled-1.nb · In[11]

```wl
EntityRegister[EntityStore["Word" -> <|"Entities" -> words|>]]
```

### 43. `bigsur@46#3` · 1:33.4 · v11 · Untitled-1.nb · Out[11]

```wl
{Word}
```

### 44. `bigsur@46#4` · 1:34.0 · repos · Untitled-1.nb · In[2]

```wl
GeoBubbleChart[ResourceData["Fireballs and Bolides"][All, #Coordinates -> #TotalRadiatedEnergy &]]
```

### 45. `bigsur@46#6` · 1:36.2 · repos · Untitled-1.nb · In[3]

```wl
ResourceFunction["BirdSay"]["Every language starts with a few words."]
```

### 46. `bigsur@46#8` · 1:38.0 · v12 · Untitled-1.nb · In[4]

```wl
cf = FunctionCompile[Function[Typed[n, "MachineInteger"], Module[{s = 0., i = 1}, While[i <= n, s += Sin[N[i]]^2; i++]; s]]]
```

### 47. `bigsur@46#10` · 1:39.4 · v12 · Untitled-1.nb · In[5]

```wl
MoleculePlot3D[Molecule["caffeine"]]
```

### 48. `bigsur@46#12` · 1:40.4 · v12 · Untitled-1.nb · In[6]

```wl
SystemModelSimulate["Modelica.Mechanics.MultiBody.Examples.Elementary.DoublePendulum", 6]
```

### 49. `bigsur@46#14` · 1:42.0 · v123 · Untitled-1.nb · In[12]

```wl
pq = CreateDataStructure["PriorityQueue"]; Scan[pq["Push", #] &, {3, 1, 4, 1, 5}]; pq
```

### 50. `bigsur@46#16` · 1:43.8 · v123 · Untitled-1.nb · In[7]

```wl
ExpressionTree[Unevaluated[Manipulate[Plot[Sin[a x], {x, 0, 2 Pi}], {a, 1, 5}]]]
```

### 51. `bigsur@46#18` · 1:46.0 · v132 · Untitled-1.nb · In[8]

```wl
AstroGraphics[Point /@ orionStars, AstroCenter -> Entity["Star", "Alnilam"], AstroRange -> Quantity[13, "AngularDegrees"], AstroBackground -> AstroStyling[{"BlackSky", "ShowConstellations" -> {Entity["Constellation", "Orion"]}}]]
```

### 52. `bigsur@46#20` · 1:48.0 · v132 · Untitled-1.nb · In[9]

```wl
PacletInstall["Wolfram/QuantumFramework"]
```

### 53. `bigsur@46#21` · 1:48.2 · v132 · Untitled-1.nb · In[10]

```wl
QuantumCircuitOperator[{"H", "CNOT" -> {1, 2}, "CNOT" -> {2, 3}}]
```

### 54. `bigsur@55#2` · 1:54.0 · llm · Chat.nb · In[1]

```wl
Take[WordCounts[ExampleData[{"Text", "AliceInWonderland"}], IgnoreCase -> True], 10]
```

### 55. `bigsur@55#3` · 1:54.8 · llm · Chat.nb · Out[1]

```wl
<|the -> 630, and -> 338, a -> 277, to -> 249, she -> 239, of -> 198, it -> 171, was -> 167, in -> 162, alice -> 161|>
```

### 56. `dark@59#0` · 1:58.2 · v14 · Untitled-1.nb · In[1]

```wl
Tabular[versions]
```

### 57. `dark@59#2` · 1:59.9 · v14 · Untitled-1.nb · In[2]

```wl
TakeLargestBy[TransformColumns[versions, "words per month" -> Function[Round[#["new words"]/#["since previous"], 0.1]]], "words per month", 3]
```

### 58. `bigsur@61#0` · 2:04.0 · v15 · Soundtrack.nb · In[1]

```wl
MusicScore[{MusicNote["A4", 3/8], MusicNote["C5", 1/8], MusicNote["E5", 1/4], MusicNote["D5", 1/4], MusicNote["C5", 3/8], MusicNote["A4", 1/8], …}]
```

## Text inside custom cells (story.ts)

- 3.0 text cell / `Cell[...]` flip: `Every language starts with a few words.`
- 8 free-form input: `countries in europe` → interpretation `CountryData` → `CountryData["Europe"]`
- 9 Suggestions Bar: `convert to feet` · `exact form` · `more...`
- 11 NetTrain summary box: `NetChain` · Input: image · Output: class
- 12.1 DataStructure summary box: Type: PriorityQueue · Length: 5
- 13.3 chat input: `What are the ten most common words in Alice in Wonderland?`
- 13.3 chat response: `You can count them with WordCounts:` + code `Take[WordCounts[ExampleData[{"Text", "AliceInWonderland"}], IgnoreCase -> True], 10]`
- 15 AI chatbar request: `Write the melody we are hearing as a score`
- 2026 agent terminal (scenes/showcase.ts): `make a short film about the Wolfram Language`, then the wolframscript / bun calls

