#!/bin/sh
# artifact/build.sh <out.html>: the director's-cut page with all three languages' data inlined.
set -e
for L in en ru ja; do FILM_LANG=$L bun src/directors.ts > out/directors-$L.json; done
python3 - "$1" <<'PY'
import json, sys
data = {L: json.load(open(f'out/directors-{L}.json')) for L in ('en', 'ru', 'ja')}
page = open('artifact/page.src.html').read()
open(sys.argv[1], 'w').write(page.replace('__DATA__', json.dumps(data, ensure_ascii=False).replace('</', '<\\/')))
PY
