#!/bin/sh
# Cyrillic and Japanese fallback fonts for the Russian and Japanese cuts (not committed: ~175 MB).
set -e
mkdir -p assets/fonts/intl && cd assets/fonts/intl
N=https://github.com/notofonts/noto-cjk/raw/main G=https://github.com/google/fonts/raw/main
for f in Sans/OTF/Japanese/NotoSansCJKjp-Light.otf Sans/OTF/Japanese/NotoSansCJKjp-Regular.otf Sans/OTF/Japanese/NotoSansCJKjp-Medium.otf \
  Sans/OTF/Japanese/NotoSansCJKjp-Bold.otf Sans/OTF/Japanese/NotoSansCJKjp-Black.otf Serif/OTF/Japanese/NotoSerifCJKjp-Regular.otf \
  Serif/OTF/Japanese/NotoSerifCJKjp-SemiBold.otf Sans/Mono/NotoSansMonoCJKjp-Regular.otf Sans/Mono/NotoSansMonoCJKjp-Bold.otf; do curl -sfL -o "$(basename $f)" "$N/$f"; done
for f in ofl/dotgothic16/DotGothic16-Regular.ttf ofl/kleeone/KleeOne-SemiBold.ttf ofl/cousine/Cousine-Regular.ttf ofl/cousine/Cousine-Bold.ttf; do curl -sfL -o "$(basename $f)" "$G/$f"; done
