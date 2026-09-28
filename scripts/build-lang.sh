#!/bin/sh
# scripts/build-lang.sh [en|ru|ja]  ->  out/film[-L].mp4 (web), out/film-master[-L].mp4, out/player/[L/] (fMP4 segments)
# Sections whose pixels match another language's (no text on screen) come straight from the shared cache.
set -e
L=${1:-en}; S=$([ "$L" = en ] && echo "" || echo "-$L")
P=out/player$([ "$L" = en ] && echo "" || echo "/$L")
export FILM_LANG=$L
bun src/music/render-audio.ts
bun src/build.ts --out out/film-master$S.mp4
# web encode for the Wolfram Cloud
ffmpeg -v error -y -i out/film-master$S.mp4 -c:v libx264 -preset slow -crf 22 -tune animation -pix_fmt yuv420p -c:a aac -b:a 256k -movflags +faststart out/film$S.mp4
# player segments: 4 s fMP4 pieces, a keyframe every 2 s and a bitrate cap so no piece is huge
ffmpeg -v error -y -i out/film-master$S.mp4 -c:v libx264 -preset slow -crf 22 -maxrate 8M -bufsize 16M -tune animation -pix_fmt yuv420p \
  -force_key_frames "expr:gte(t,n_forced*2)" -sc_threshold 0 -c:a aac -b:a 192k out/film-hls$S.mp4
# (English lives at the top of out/player, the other languages in subfolders: clear only this language's files)
rm -rf out/hls-tmp$S && rm -f $P/*.mp4 $P/poster.jpg && mkdir -p out/hls-tmp$S $P
ffmpeg -v error -i out/film-hls$S.mp4 -c copy -hls_time 4 -hls_playlist_type vod -hls_segment_type fmp4 -hls_fmp4_init_filename init.mp4 \
  -hls_segment_filename out/hls-tmp$S/seg%03d.m4s out/hls-tmp$S/film.m3u8
mv out/hls-tmp$S/init.mp4 $P/ && for f in out/hls-tmp$S/seg*.m4s; do b=$(basename $f .m4s); mv $f $P/$b.mp4; done
ffmpeg -v error -y -ss 81.2 -i out/film$S.mp4 -frames:v 1 -vf scale=1280:-1 -q:v 3 $P/poster.jpg
rm -rf out/hls-tmp$S
echo "$L: out/film$S.mp4 $(du -h out/film$S.mp4 | cut -f1) · $P $(ls $P | wc -l | tr -d ' ') files $(du -sh $P | cut -f1)"
