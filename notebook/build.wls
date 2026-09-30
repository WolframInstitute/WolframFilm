#!/usr/bin/env wolframscript
(* wolframscript -f notebook/build.wls: convert Film.md into Film.nb with MarkdownToNotebook, evaluating every
   cell in one shared context (the film is built up section by section).  Needs the WAnim paclet
   (WolframInstitute/WAnim) installed; the converter is the deployed MarkdownToNotebook resource function. *)
Quiet @ UsingFrontEnd[CurrentValue[$FrontEnd, LightDark] = "Light"];
$AllowInternet = True;   (* the converter, the notebook's data and its deployment are online, whatever the machine's default *)
dir = DirectoryName[$InputFileName];
(* the converter is the deployed MarkdownToNotebook resource function; wrapping the URL in
   ResourceObject makes it resolve on parallel subkernels too *)
mtn = ResourceFunction[ResourceObject["https://www.wolframcloud.com/obj/nikm/DeployedResources/Function/MarkdownToNotebook"]];
(* the film's Video is written beside the notebook *)
SetDirectory[dir];
(* the notebook's last cell copies the video to the cloud *)
If[! TrueQ[$CloudConnected], Quiet @ CloudConnect[]];
Print[mtn[FileNameJoin[{dir, "Film.md"}], FileNameJoin[{dir, "Film.nb"}], "UseCache" -> False, "EvaluateSeparator" -> None]];
(* and the notebook itself, public, beside the film it made, its outputs as pictures the cloud can show *)
Get[FileNameJoin[{dir, "publish.wls"}]];
