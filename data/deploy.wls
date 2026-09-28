(* The cell shown at the end of the film, run for real (out/film.mp4 is the web encode of out/film-master.mp4). *)
SetDirectory[FileNameJoin[{DirectoryName[$InputFileName], ".."}]];
Quiet@DeleteObject[CloudObject["WolframFilm/In1.mp4"]];
co = Check[CopyFile["out/film.mp4", CloudObject["WolframFilm/In1.mp4", Permissions -> "Public"]], $MessageList];
Print[co];
Print[InputForm[$MessageList]];
