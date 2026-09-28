#!/usr/bin/env wolframscript
(* wolframscript -f notebook/build.wls: convert Film.md into Film.nb with MarkdownToNotebook, evaluating every
   cell in one shared context (the film is built up section by section).  Needs the WAnim paclet
   (WolframInstitute/WAnim) installed; the converter is the deployed MarkdownToNotebook resource function. *)
Quiet @ UsingFrontEnd[CurrentValue[$FrontEnd, LightDark] = "Light"];
dir = DirectoryName[$InputFileName];
(* the converter is the deployed MarkdownToNotebook resource function; wrapping the URL in
   ResourceObject makes it resolve on parallel subkernels too *)
mtn = ResourceFunction[ResourceObject["https://www.wolframcloud.com/obj/nikm/DeployedResources/Function/MarkdownToNotebook"]];
Print[mtn[FileNameJoin[{dir, "Film.md"}], FileNameJoin[{dir, "Film.nb"}], "UseCache" -> False, "EvaluateSeparator" -> None]];
