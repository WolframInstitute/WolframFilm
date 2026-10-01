(* The collection's shared script pieces: which film a script works on, and the cloud account.

   filmArgument[] is the film named on the command line, {name, directory}: films/<name>/<name>.md is its
   notebook.  With no name, or one with no such notebook, it lists the films and exits. *)
filmArgument[] := Module[{root = ParentDirectory[DirectoryName[$InputFileName]], name, dir},
    name = SelectFirst[Rest[$ScriptCommandLine], ! StringStartsQ[#, "-"] &, None];
    dir = If[StringQ[name], FileNameJoin[{root, "films", name}], None];
    If[! StringQ[name] || ! FileExistsQ[FileNameJoin[{dir, name <> ".md"}]],
        Print["usage: wolframscript -f ", FileNameTake[$InputFileName, -2], " <film>, one of: ",
            StringRiffle[Select[FileNameTake /@ Select[FileNames["*", FileNameJoin[{root, "films"}]], DirectoryQ], FileExistsQ[FileNameJoin[{root, "films", #, # <> ".md"}]] &], ", "]];
        Exit[1]];
    {name, dir}];

(* cloudConnect[envFile] connects to the Wolfram Cloud as the account an .env file names
   (WOLFRAM_CLOUD_USER, WOLFRAM_CLOUD_PASSWORD), and does nothing when already connected as it.
   The films are built and published as the account in the repository's gitignored .env.  The
   password is never printed. *)

envValues[file_String] := Association @ StringCases[Import[file, "Text"],
    StartOfLine ~~ k : (WordCharacter | "_") .. ~~ "=" ~~ v : Except["\n"] ... :> k -> StringTrim[v, "\"" | "'" | Whitespace]];

cloudConnect[file_String] := Module[{env},
    $AllowInternet = True;
    If[! FileExistsQ[file], Print["FATAL: no ", file, " with WOLFRAM_CLOUD_USER and WOLFRAM_CLOUD_PASSWORD"]; Exit[1]];
    env = envValues[file];
    If[$CloudConnected && $WolframID === env["WOLFRAM_CLOUD_USER"], Return[$WolframID]];
    CloudConnect[env["WOLFRAM_CLOUD_USER"], env["WOLFRAM_CLOUD_PASSWORD"]];
    If[$WolframID =!= env["WOLFRAM_CLOUD_USER"], Print["FATAL: could not connect as ", env["WOLFRAM_CLOUD_USER"]]; Exit[1]];
    Print["connected as ", $WolframID];
    $WolframID];
