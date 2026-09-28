(* A range-serving endpoint for out/film.mp4, written in the Wolfram Language:
   the film is stored as 2 MB ByteArray chunks; each request returns 206 Partial Content. *)
SetDirectory[FileNameJoin[{DirectoryName[$InputFileName], ".."}]];
Quiet@DeleteObject[CloudObject["WolframFilm/Watch"]];
bytes = ReadByteArray["out/film.mp4"];
total = Length[bytes]; csize = 2^21; n = Ceiling[total/csize];
Do[CloudPut[bytes[[i*csize + 1 ;; Min[(i + 1) csize, total]]], "WolframFilm/chunks/c" <> IntegerString[i, 10, 3], Permissions -> "Public"], {i, 0, n - 1}];
Print["chunks: ", n, " total bytes: ", total];
endpoint = With[{total = total, csize = csize},
  Delayed[Module[{hdr, rng, s, e, c0, c1, data},
    hdr = Lookup[Association[HTTPRequestData["Headers"]], "Range", Lookup[Association[HTTPRequestData["Headers"]], "range", "bytes=0-"]];
    rng = StringCases[hdr, "bytes=" ~~ a : DigitCharacter ... ~~ "-" ~~ b : DigitCharacter ... :> {a, b}];
    {s, e} = If[rng === {}, {0, csize - 1}, {FromDigits[rng[[1, 1]]], If[rng[[1, 2]] === "", total - 1, FromDigits[rng[[1, 2]]]]}];
    e = Min[e, total - 1, s + 2 csize - 1];
    c0 = Floor[s/csize]; c1 = Floor[e/csize];
    data = Join @@ Table[CloudGet["WolframFilm/chunks/c" <> IntegerString[i, 10, 3]], {i, c0, c1}];
    data = data[[s - c0 csize + 1 ;; e - c0 csize + 1]];
    HTTPResponse[data, <|"StatusCode" -> 206, "ContentType" -> "video/mp4",
      "Headers" -> {"Accept-Ranges" -> "bytes", "Content-Range" -> "bytes " <> ToString[s] <> "-" <> ToString[e] <> "/" <> ToString[total], "Cache-Control" -> "public, max-age=3600"}|>]
  ]]];
co = CloudDeploy[endpoint, "WolframFilm/stream.mp4", Permissions -> "Public"];
Print[co];
