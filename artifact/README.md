# Director's cut page (Claude artifact)

- `artifact/build.sh <out.html>` — runs `FILM_LANG=en|ru|ja bun src/directors.ts` and inlines all three into `page.src.html` (`__DATA__`)
- `page.src.html` — the page: player, chapter strip, synced sidebar, and the English · Русский · 日本語 switch
  (keeps the playhead, remembered per viewer, linkable as `#ru` / `#ja`)
- video: `scripts/build-lang.sh L` writes 4 s fragmented-MP4 segments to `out/player/` (English) and `out/player/{ru,ja}/`,
  published as `video/segNNN.mp4` and `video/{ru,ja}/segNNN.mp4` (one publish per language: each is ~53 MB, the limit is 64 MB)
- Published at https://claude.ai/artifact/WtXWEDdZMxrMUgBEdiQi4X
