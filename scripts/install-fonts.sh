#!/bin/sh
# The Wolfram front end only sees installed system fonts: copy the film's fonts into ~/Library/Fonts
# (and, for the Russian/Japanese cuts, the fallbacks fetched by scripts/fetch-fonts.sh). Undo: delete them there.
set -e
cd "$(dirname "$0")/.."
mkdir -p ~/Library/Fonts
cp assets/fonts/*.ttf ~/Library/Fonts/
[ -d assets/fonts/intl ] && cp assets/fonts/intl/*.ttf assets/fonts/intl/*.otf ~/Library/Fonts/ 2>/dev/null || true
echo "installed $(ls assets/fonts/*.ttf | wc -l | tr -d ' ') film fonts"
