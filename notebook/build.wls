#!/usr/bin/env wolframscript
(* wolframscript -f notebook/build.wls: convert Film.md into Film.nb with MarkdownToNotebook
   (github.com/WolframInstitute/MarkdownToNotebook), evaluating every cell so frames and the
   soundtrack become outputs.  One shared context ("EvaluateSeparator" -> None): the film is built
   up section by section, so later sections use what earlier ones define. *)
Quiet @ UsingFrontEnd[CurrentValue[$FrontEnd, LightDark] = "Light"];
dir = DirectoryName[$InputFileName];
Get[FileNameJoin[{$HomeDirectory, "src", "wolfram", "MarkdownToNotebook", "MarkdownToNotebook.wl"}]];
Print[MarkdownToNotebook[FileNameJoin[{dir, "Film.md"}], FileNameJoin[{dir, "Film.nb"}], "UseCache" -> False, "EvaluateSeparator" -> None]];
