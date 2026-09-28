# Director's cut page (Claude artifact)

- `data.json` ← `bun src/directors.ts > artifact/data.json` (sections, snippets, docs links, sources; commentary lives in src/directors.ts)
- `page.src.html` — the page; `__DATA__` is replaced by data.json when publishing
- video: `out/film-hls.mp4` (CRF 22, VBV-capped, keyframe every 2 s) cut into 4 s fragmented-MP4 segments (`out/hls5`, published as `video/segNNN.mp4`)
- Published at https://claude.ai/artifact/WtXWEDdZMxrMUgBEdiQi4X (private until shared)
