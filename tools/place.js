// Bölüm tasarım yardımcısı: bir çözümün geçtiği noktaları yazdırır.
//   node tools/place.js "<ifade>" x0 y0 [u1 u2 …]
// u: karakterden itibaren yatay uzaklık. u verilmezse 0..19 arası her tam sayı.
const E = require('../www/engine.js');
const [expr, x0s, y0s, ...us] = process.argv.slice(2);
const p = E.parse(expr);
if (!p.ok) { console.error('ifade hatalı:', p.error, 'konum', p.pos); process.exit(1); }
const x0 = +x0s, y0 = +y0s, f0 = p.fn(0);
if (f0) console.log(`tırmanma: karakter önce ${f0 > 0 ? 'yukarı' : 'aşağı'} ${Math.abs(f0)} birim gider`);
const list = us.length ? us.map(Number) : Array.from({ length: 20 }, (_, i) => i);
console.log(`${p.text}  (parça: ${p.cost})`);
for (const u of list) {
  const x = x0 + u, y = y0 + p.fn(u);
  if (x > 20.5) break;
  console.log(`karaktere göre (${u.toFixed(2)}, ${p.fn(u).toFixed(2)})   tahtada x=${x.toFixed(2)} y=${y.toFixed(2)}`);
}
