(* The cell shown at the end of the film, run for real: wolframscript -file data/deploy.wls [en|ru|ja]
   (out/film[-L].mp4 is the web encode of out/film-master[-L].mp4; each language deploys its own In1[-L].mp4) *)
SetDirectory[FileNameJoin[{DirectoryName[$InputFileName], ".."}]];
lang = If[Length[$ScriptCommandLine] > 1, $ScriptCommandLine[[2]], "en"];
suffix = If[lang === "en", "", "-" <> lang];
Quiet@DeleteObject[CloudObject["WolframFilm/In1" <> suffix <> ".mp4"]];
co = Check[CopyFile["out/film" <> suffix <> ".mp4", CloudObject["WolframFilm/In1" <> suffix <> ".mp4", Permissions -> "Public"]], $MessageList];
Print[co];
Print[InputForm[$MessageList]];
