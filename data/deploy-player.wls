(* Seekable player: HLS segments + playlist as public cloud objects, and a public player page. *)
SetDirectory[FileNameJoin[{DirectoryName[$InputFileName], ".."}]];
base = "WolframFilm/hls/";
files = FileNames["*", "out/hls"];
Do[Quiet@DeleteObject[CloudObject[base <> FileNameTake[f]]]; CopyFile[f, CloudObject[base <> FileNameTake[f], Permissions -> "Public"]], {f, files}];
url[p_] := First[CloudObject[p]];
html = StringReplace[Import["data/player.html", "Text"], {
   "__M3U8__" -> url[base <> "film.m3u8"], "__MP4__" -> url["WolframFilm/In1.mp4"], "__POSTER__" -> url[base <> "poster.jpg"]}];
page = CloudDeploy[ExportForm[html, "HTML"], "WolframFilm/Player", Permissions -> "Public"];
Print[Length[files], " files · ", page];
