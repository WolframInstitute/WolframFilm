#!/usr/bin/env wolframscript
(* wolframscript -f scripts/build.wls <film> [--no-publish]
   films/<film>/<film>.md becomes films/<film>/<film>.nb by MarkdownToNotebook, every cell evaluated in one
   shared context (a film is built up section by section), with the film's directory as the working
   directory, so what it renders (its video) lands beside it.  Then the notebook is published to the cloud
   (scripts/publish.wls), unless --no-publish.  Cloud work is done as the account in the repository's .env. *)
root = ParentDirectory[DirectoryName[$InputFileName]];
Get[FileNameJoin[{root, "scripts", "cloud.wl"}]];
{name, dir} = filmArgument[];
Quiet @ UsingFrontEnd[CurrentValue[$FrontEnd, LightDark] = "Light"];
cloudConnect[FileNameJoin[{root, ".env"}]];
(* the converter is the deployed MarkdownToNotebook resource function; wrapping the URL in ResourceObject
   makes it resolve on parallel subkernels too *)
mtn = ResourceFunction[ResourceObject["https://www.wolframcloud.com/obj/nikm/DeployedResources/Function/MarkdownToNotebook"]];
SetDirectory[dir];
Print[mtn[FileNameJoin[{dir, name <> ".md"}], FileNameJoin[{dir, name <> ".nb"}], "UseCache" -> False, "EvaluateSeparator" -> None]];
If[! MemberQ[$ScriptCommandLine, "--no-publish"], Get[FileNameJoin[{root, "scripts", "publish.wls"}]]];
