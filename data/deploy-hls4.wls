(* Upload the fragmented-MP4 segments, playlist, poster and the player worker as public cloud objects. *)
SetDirectory[FileNameJoin[{DirectoryName[$InputFileName], ".."}]];
put[src_, dst_] := (Quiet@DeleteObject[CloudObject[dst]]; CopyFile[src, CloudObject[dst, Permissions -> "Public"]]);
Scan[put[#, "WolframFilm/player/" <> FileNameTake[#]] &, FileNames["*", "out/hls4"]];
Print[put["data/player/worker.js", "WolframFilm/player/worker.js"]];
