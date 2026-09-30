#!/usr/bin/env wolframscript
(* wolframscript -f notebook/publish.wls: publish Film.nb to the Wolfram Cloud, public, as the essay template's
   Publish to Cloud would: the finished essay, without the template's editing toolbar.  The cloud has no WAnim,
   draws some panels differently and gives up on heavy graphics, so every graphical or live output goes up as
   the picture the desktop shows; the film's Video and each Audio stay players, streamed from public cloud copies. *)
$AllowInternet = True;
dir = DirectoryName[$InputFileName];
Get[FileNameJoin[{dir, "cloud.wl"}]];
cloudConnect[FileNameJoin[{ParentDirectory[dir], ".env"}]];
Needs["WolframInstitute`WAnim`"];
(* pictures as the page shows them: light *)
UsingFrontEnd[CurrentValue[$FrontEnd, LightDark] = "Light"];
live = DynamicModuleBox | DynamicBox | TemplateBox | InterpretationBox | GraphicsBox | Graphics3DBox;

(* players stay players *)
videoQ[b_] := MatchQ[b, TemplateBox[a_Association /; KeyExistsQ[a, "resourcePath"], ___]];
audioQ[b_] := MatchQ[b, TemplateBox[_Association, "AudioBox1", ___]];
(* an Audio kept in the notebook is sent to the cloud, public, and the player streams it from there *)
k = 0;
cloudAudio[TemplateBox[a_Association, ___]] := Module[{file = FileNameJoin[{$TemporaryDirectory, "film-audio-" <> ToString[++k] <> ".mp3"}]},
    Export[file, ReleaseHold[a["audio"]], "MP3"];
    BoxData[ToBoxes[Audio[retry[CopyFile[file, CloudObject["WolframFilm/Audio" <> ToString[k] <> ".mp3", Permissions -> "Public"], OverwriteTarget -> True]]]]]];
(* the cloud and the front end now and then fail once; they are asked again *)
SetAttributes[retry, HoldFirst];
retry[e_] := Module[{r = $Failed, i = 0}, While[FailureQ[r] && i++ < 4, r = Quiet[e]]; r];

asPicture[b_] := With[{img = retry[UsingFrontEnd[Rasterize[Cell[BoxData[b], "Output"], "Image", ImageResolution -> 144]]]},
    BoxData[ToBoxes[Image[img, ImageSize -> ImageDimensions[img] / 2]]]];

nb = Get[FileNameJoin[{dir, "Film.nb"}]];
(* the first live players drawn in a session come out empty or with WAnim's loading messages in them,
   so two are drawn and thrown away first *)
Scan[asPicture, Take[Cases[nb, Cell[BoxData[b_], "Output", ___] /; StringContainsQ[ToString[b, InputForm], "WAnim`"] :> b, Infinity], UpTo[2]]];
n = 0;
cloudNb = nb /. Cell[BoxData[b_], "Output", o___] /; ! FreeQ[b, live] && ! videoQ[b] :>
    If[audioQ[b], Cell[cloudAudio[b], "Output", o], n++; Cell[asPicture[b], "Output", o]];
Print[n, " outputs as pictures, ", k, " audio in the cloud"];
Print["failed: ", Count[cloudNb, $Failed, Infinity]];

(* the published essay: no editing toolbar, no template tools *)
cloudNb = cloudNb /. (DockedCells -> _) :> (DockedCells -> {});
cloudNb = Notebook[First[cloudNb], Sequence @@ DeleteCases[List @@ Rest[cloudNb], (DockedCells | WindowToolbars) -> _], DockedCells -> {}];

(* saved by the front end, which stores pictures compressed *)
UsingFrontEnd[With[{o = NotebookPut[cloudNb, Visible -> False]}, NotebookSave[o, FileNameJoin[{dir, "Film-cloud.nb"}]]; NotebookClose[o]]];
Print[FileByteCount[FileNameJoin[{dir, "Film-cloud.nb"}]]];
Print[CopyFile[FileNameJoin[{dir, "Film-cloud.nb"}], CloudObject["WolframFilm/Film.nb", Permissions -> "Public"], OverwriteTarget -> True]];
