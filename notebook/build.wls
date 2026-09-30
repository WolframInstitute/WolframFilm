#!/usr/bin/env wolframscript
(* wolframscript -f notebook/build.wls: convert Film.md into Film.nb with MarkdownToNotebook, evaluating every
   cell in one shared context (the film is built up section by section).  The notebook installs the WAnim
   paclet (WolframInstitute/WAnim) from the Paclet Repository in its first cell; the converter is the
   deployed MarkdownToNotebook resource function.  Cloud work is done as the account in ../.env. *)
Quiet @ UsingFrontEnd[CurrentValue[$FrontEnd, LightDark] = "Light"];
dir = DirectoryName[$InputFileName];
(* the converter, the notebook's data and its deployment are online *)
Get[FileNameJoin[{dir, "cloud.wl"}]];
cloudConnect[FileNameJoin[{ParentDirectory[dir], ".env"}]];
(* the converter is the deployed MarkdownToNotebook resource function; wrapping the URL in
   ResourceObject makes it resolve on parallel subkernels too *)
mtn = ResourceFunction[ResourceObject["https://www.wolframcloud.com/obj/nikm/DeployedResources/Function/MarkdownToNotebook"]];
(* the film's Video is written beside the notebook *)
SetDirectory[dir];
Print[mtn[FileNameJoin[{dir, "Film.md"}], FileNameJoin[{dir, "Film.nb"}], "UseCache" -> False, "EvaluateSeparator" -> None]];
(* and the notebook itself, public, beside the film it made, its outputs as pictures the cloud can show *)
Get[FileNameJoin[{dir, "publish.wls"}]];
