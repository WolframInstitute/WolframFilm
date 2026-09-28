(* The cell shown at the end of the film, run for real. *)
SetDirectory[FileNameJoin[{DirectoryName[$InputFileName], ".."}]];
Scan[Quiet@DeleteObject[CloudObject[#]] &, {"WolframFilm/test-clip.mp4", "WolframFilm/test-clip", "WolframFilm/test-one", "WolframFilm/In1"}];
co = CopyFile["out/film.mp4", CloudObject["WolframFilm/In1.mp4", Permissions -> "Public"]];
Print[co];
Print[Options[co, Permissions]];
