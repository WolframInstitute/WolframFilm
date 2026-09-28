dir = FileNameJoin[{DirectoryName[$InputFileName], "..", "..", "assets", "wl"}];
snd = Play[Sin[1000 t (1 + t)] Sin[2 Pi t], {t, 0, 1.5}, SampleRate -> 48000];
Export[FileNameJoin[{dir, "x_play.wav"}], snd, "WAV"];
a = AudioData[Audio[snd]][[1]];
n = 600; k = Floor[Length[a]/n];
env = Table[{Min[#], Max[#]} &[a[[i k + 1 ;; (i + 1) k]]], {i, 0, n - 1}];
Export[FileNameJoin[{dir, "x_play.json"}], <|"env" -> env, "dur" -> 1.5|>];
Print[Head[snd], " ", Length[a]];
