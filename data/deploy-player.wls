(* The player page, built symbolically with WebColumn / WebItem, deployed publicly. *)
SetDirectory[FileNameJoin[{DirectoryName[$InputFileName], ".."}]];
base = "https://www.wolframcloud.com/obj/wolframinstitute/WolframFilm/player/";
page = WebColumn[{
   WebItem[XMLElement["h2", {}, {"In[1]:= the life of a language"}]],
   WebItem[XMLElement["video", {"id" -> "film", "controls" -> "controls", "playsinline" -> "playsinline",
      "poster" -> base <> "poster.jpg", "style" -> "width:min(100%,1280px);aspect-ratio:16/9;background:#000"}, {}]],
   WebItem[XMLElement["p", {}, {"The Wolfram Language, 1988\[Dash]2026 \[CenterDot] 2:48"}]],
   WebItem[XMLElement["script", {}, {Import["data/player/main.js", "Text"]}]]
   }];
Print[CloudDeploy[page, "WolframFilm/Player", Permissions -> "Public"]];
