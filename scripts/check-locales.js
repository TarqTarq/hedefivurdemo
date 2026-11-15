// Bütün dil dosyalarında aynı anahtarlar var mı? Eksik/fazla anahtar varsa hata verir.
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '../www/locales');
global.window = {};
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
for (const f of files) eval(fs.readFileSync(path.join(dir, f), 'utf8'));
const L = window.LOCALES;
const ref = 'en', refKeys = Object.keys(L[ref].strings);
let ok = true;
for (const [code, l] of Object.entries(L)) {
  const keys = Object.keys(l.strings);
  const missing = refKeys.filter(k => !keys.includes(k));
  const extra = keys.filter(k => !refKeys.includes(k));
  if (missing.length || extra.length) ok = false;
  console.log(`${code} (${l.name}): ${keys.length} anahtar` +
    (missing.length ? `\n  eksik: ${missing.join(', ')}` : '') + (extra.length ? `\n  fazla: ${extra.join(', ')}` : ''));
}
process.exit(ok ? 0 : 1);
