// Hedefi Vur: Android ikonları (−2048 betiğinden uyarlandı).
// Android ikonları + açılış ekranı + Play Store ikonu (Google Chrome gerekir).
//   node scripts/render-android.js
// Kaynaklar: assets/icon.svg (tam ikon), assets/icon-foreground.svg (uyarlanabilir ön katman),
//            assets/splash.svg / splash-dark.svg (açılış). Arka plan rengi values/ic_launcher_background.xml'de.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const RES = path.join(ROOT, 'android/app/src/main/res');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'andr-'));

// svg'yi w×h'ye çiz. clip: 'circle' | 'round' (yuvarlak köşeli kare) | null. cover: kırparak doldur.
function render(svg, w, h, out, { clip = null, transparent = false } = {}) {
  const radius = clip === 'circle' ? '50%' : clip === 'round' ? '18%' : '0';
  const html = `<!doctype html><style>html,body{margin:0;overflow:hidden;background:transparent}
    div{width:${w}px;height:${h}px;border-radius:${radius};overflow:hidden}
    img{width:100%;height:100%;object-fit:cover;display:block}</style>
    <div><img src="file://${path.join(ROOT, svg)}"></div>`;
  const page = path.join(tmp, 'p.html');
  fs.writeFileSync(page, html);
  const png = path.join(tmp, 'out.png');
  execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
    `--window-size=${w},${h}`, '--virtual-time-budget=1000', '--allow-file-access-from-files',
    ...(transparent || clip ? ['--default-background-color=00000000'] : []),
    `--screenshot=${png}`, 'file://' + page], { stdio: 'ignore' });
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.copyFileSync(png, out);
}

const DPI = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };
for (const [d, k] of Object.entries(DPI)) {
  const dir = path.join(RES, `mipmap-${d}`);
  render('assets/icon-foreground.svg', 108 * k, 108 * k, path.join(dir, 'ic_launcher_foreground.png'), { transparent: true });
  render('assets/icon.svg', 48 * k, 48 * k, path.join(dir, 'ic_launcher.png'), { clip: 'round' });
  render('assets/icon.svg', 48 * k, 48 * k, path.join(dir, 'ic_launcher_round.png'), { clip: 'circle' });
  // Android 12 öncesi açılış ekranı (tam ekran arka plan olarak gerilir) — dikey ve yatay
  const [pw, ph] = [Math.round(320 * k), Math.round(480 * k)];
  render('assets/splash.svg', pw, ph, path.join(RES, `drawable-port-${d}`, 'splash.png'));
  render('assets/splash.svg', ph, pw, path.join(RES, `drawable-land-${d}`, 'splash.png'));
  render('assets/splash-dark.svg', pw, ph, path.join(RES, `drawable-port-night-${d}`, 'splash.png'));
  render('assets/splash-dark.svg', ph, pw, path.join(RES, `drawable-land-night-${d}`, 'splash.png'));
}
render('assets/splash.svg', 480, 800, path.join(RES, 'drawable', 'splash.png'));
render('assets/splash-dark.svg', 480, 800, path.join(RES, 'drawable-night', 'splash.png'));

// Play Store ikonu: 512×512, kare (Play kendisi yuvarlar)
fs.mkdirSync(path.join(ROOT, 'store/play'), { recursive: true });
render('assets/icon.svg', 512, 512, path.join(ROOT, 'store/play/icon-512.png'));

fs.rmSync(tmp, { recursive: true, force: true });
console.log('Android ikonları, açılış ekranları ve Play ikonu yazıldı');
