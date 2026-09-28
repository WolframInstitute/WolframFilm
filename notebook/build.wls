#!/usr/bin/env wolframscript
(* wolframscript -f notebook/build.wls: convert Film.md into Film.nb with MarkdownToNotebook, evaluating every
   cell in one shared context (the film is built up section by section).  Needs the WAnim paclet
   (WolframInstitute/WAnim) and MarkdownToNotebook next to this repo. *)
Quiet @ UsingFrontEnd[CurrentValue[$FrontEnd, LightDark] = "Light"];
dir = DirectoryName[$InputFileName];
PacletDirectoryLoad[FileNameJoin[{$HomeDirectory, "src", "wolfram", "WolfAnim"}]];
Get[FileNameJoin[{$HomeDirectory, "src", "wolfram", "MarkdownToNotebook", "MarkdownToNotebook.wl"}]];
Print[MarkdownToNotebook[FileNameJoin[{dir, "Film.md"}], FileNameJoin[{dir, "Film.nb"}], "UseCache" -> False, "EvaluateSeparator" -> None]];
