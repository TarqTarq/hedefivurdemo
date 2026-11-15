#!/bin/sh
# Hedefi Vur: assets/icon.svg + assets/splash(-dark).svg → iOS PNGleri (Google Chrome gerekir). −2048 betiğinden uyarlandı.
set -e
cd "$(dirname "$0")/.."
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
TMP=$(mktemp -d)
render() { # svg genişlik çıktı
  printf '<!doctype html><style>html,body{margin:0;overflow:hidden}img{display:block}</style><img src="%s" width="%s" height="%s">' \
    "file://$PWD/$1" "$2" "$2" > "$TMP/p.html"
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --window-size="$2,$2" --virtual-time-budget=1000 --allow-file-access-from-files \
    --screenshot="$TMP/out.png" "file://$TMP/p.html" 2>/dev/null
  cp "$TMP/out.png" "$3"
  # App Store ikonu saydamlık kabul etmez (Chrome ekran görüntüsü zaten alfasız)
  sips -g hasAlpha "$3" | grep -q 'hasAlpha: no' || { echo "HATA: $3 saydam"; exit 1; }
}
XC=ios/App/App/Assets.xcassets
render assets/icon.svg 1024 "$XC/AppIcon.appiconset/AppIcon-512@2x.png"
render assets/splash.svg 2732 "$XC/Splash.imageset/splash-2732x2732.png"
cp "$XC/Splash.imageset/splash-2732x2732.png" "$XC/Splash.imageset/splash-2732x2732-1.png"
cp "$XC/Splash.imageset/splash-2732x2732.png" "$XC/Splash.imageset/splash-2732x2732-2.png"
render assets/splash-dark.svg 2732 "$XC/Splash.imageset/splash-dark-2732x2732.png"
cp "$XC/Splash.imageset/splash-dark-2732x2732.png" "$XC/Splash.imageset/splash-dark-2732x2732-1.png"
cp "$XC/Splash.imageset/splash-dark-2732x2732.png" "$XC/Splash.imageset/splash-dark-2732x2732-2.png"
rm -rf "$TMP"
echo "ikon + açılış ekranı yazıldı"
