// Motor ve bölüm denetimi. `npm run verify` ile çalışır; bir şey bozuksa çıkış kodu 1 olur.
//  1. Ayrıştırıcı ve simülasyon testleri
//  2. Her bölüm: örnek çözüm 3 yıldız, nesneler haritada / engel dışında / tam sayı koordinatta,
//     "yanlış ama yakın" çözümler (wrong) ve basit hileler (düz çizgi, yatay çizgi) 2 yıldız almıyor
const E = require('../www/engine.js');
const LEVELS = require('../www/levels.js');
let fails = 0;
const bad = msg => { fails++; console.log('  ✗ ' + msg); };

// ---- 1. Ayrıştırıcı ----
console.log('Ayrıştırıcı');
const near = (a, b) => Math.abs(a - b) < 1e-9 || (Number.isNaN(a) && Number.isNaN(b));
const cases = [
  ['2x', 3, 6, 3], ['x/4', 2, 0.5, 3], ['-x^2', 3, -9, 4], ['2^-x', 1, 0.5, 4],
  ['(x+1)(x-1)', 3, 8, 7], ['3sin(x)', Math.PI / 2, 3, 4], ['abs(x-8', 3, 5, 4],
  ['0,5x', 4, 2, 3], ['2π', 0, 2 * Math.PI, 3], ['x²', 5, 25, 3], ['√(x)', 9, 3, 2],
  ['-abs(x-8)', 0, -8, 5], ['1.5', 7, 1.5, 1], ['2^3^2', 0, 512, 5], ['sqrt(x)', -1, NaN, 2],
  ['e^x', 0, 1, 3], ['exp(x)', 0, 1, 2], ['x sin(x)', 0, 0, 4], ['8 ÷ 2 × x', 1, 4, 5],
];
let n = 0;
for (const [src, x, want, cost] of cases) {
  n++;
  const p = E.parse(src);
  if (!p.ok) { bad(`"${src}" ayrıştırılamadı (${p.error})`); continue; }
  if (!near(p.fn(x), want)) bad(`"${src}" x=${x}: ${p.fn(x)} ≠ ${want}`);
  if (p.cost !== cost) bad(`"${src}" parça ${p.cost} ≠ ${cost}`);
}
const errs = [['', 'empty'], ['x+', 'incomplete'], ['2x)', 'paren'], ['sin x', 'fnparen'], ['1..2', 'number'], ['y', 'unknown'], ['*x', 'incomplete']];
for (const [src, code] of errs) {
  n++;
  const p = E.parse(src);
  if (p.ok || p.error !== code) bad(`"${src}" hata kodu ${p.ok ? 'yok' : p.error} ≠ ${code}`);
}
// Simülasyon: hedef (17, 0)
const flat = { target: { x: 17, y: 0 } };
const sims = [['1/(x-3)+1/3', 'out'], ['abs(x-3)/(x-3)+1', 'broken'], ['0.5tan(x)', 'out'], ['sqrt(2-x)-sqrt(2)', 'broken'],
  ['ln(x)', 'broken'], ['100x', 'out'], ['0', 'win'], ['0.01x^3', 'out'], ['x+1', 'out'], ['x/10+1', 'miss'],
  ['sin(x)', 'miss'], ['x^2+30', 'out'], ['(x-17)^2/100', 'win'], ['0.1', 'miss'], ['0.01', 'miss'], ['0.3', 'miss'], ['x-x', 'win']];
for (const [src, res] of sims) {
  n++;
  const r = E.play(flat, src);
  if (r.sim.result !== res) bad(`"${src}" düz haritada ${r.sim.result} ≠ ${res}`);
}
// Matematiksel denetim: dik bir doğru hedefin yanından sıyırınca sayılmamalı
{ n++; const L = { target: { x: 3, y: -4 } }; if (E.play(L, '-3x^2+6x-1').sim.result === 'win') bad('dik eğri hedefi sıyırınca kazanıyor'); }
// Uç durumlar (2026-11-15 hesap taraması): sıfıra bölme, tanımsız, sonsuz, aşırı dik, aşırı dalgalı
const edge = [
  ['1/0', 'broken'], ['0/0', 'broken'], ['x/0', 'broken'], ['1/x', 'broken'], ['x/x', 'broken'], ['abs(x)/x', 'broken'],
  ['ln(0)', 'broken'], ['sqrt(-1)', 'broken'], ['sqrt(x-2)', 'broken'], ['(-1)^x', 'broken'], ['9^9^9', 'broken'], ['-1/x^2', 'broken'],
  ['tan(πx/2)', 'out'], ['100000x', 'out'], ['1000000x', 'out'], ['x^1000', 'out'], ['e^(x^2)', 'out'], ['(x-0.5)^-1', 'out'],
  ['sin(100x)', 'wiggle'], ['sin(1000x)', 'wiggle'], ['20sin(500x)', 'wiggle'], ['abs(x-3)/(x-3)+1', 'broken'],
];
for (const [src, res] of edge) {
  n++;
  const t0 = Date.now(), r = E.play(flat, src), ms = Date.now() - t0;
  if (r.sim.result !== res) bad(`"${src}" ${r.sim.result} ≠ ${res}`);
  if (ms > 300) bad(`"${src}" çok yavaş (${ms} ms)`);
}
// Örnekleme hilesi: sabit adım aralığına oturan dalgalar ters bulmacayı geçmemeli
{ const R1 = LEVELS.find(l => l.id === '7-1');
  for (const w of ['2x-3+sin(50πx)', '2x-3+sin(100πx)', '2x-3+sin(πx/0.02)', '2x-3+sin(πx/0.01)']) {
    n++; if (E.play(R1, w).sim.result === 'win') bad(`7-1 "${w}" ile kazanılıyor (örnekleme hilesi)`);
  } }
// Ayrıştırıcı uçları
for (const [src, x, want] of [['2 3', 0, 6], ['√x', 4, 2], ['√(x)', 9, 3], ['--x', 2, 2], ['(((x', 3, 3], ['2x²', 2, 8], ['-2^2', 0, -4], ['x−−3', 1, 4]]) {
  n++; const p = E.parse(src);
  if (!p.ok || !near(p.fn(x), want)) bad(`"${src}" x=${x}: ${p.ok ? p.fn(x) : p.error} ≠ ${want}`);
}
// Bulanık test: rastgele 5000 ifade; ayrıştırıcı hiç çökmemeli, simülasyon hızlı ve geçerli sonuçla bitmeli
{
  let seed = 12345; const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  const parts = ['x', '2', '0', '0.5', '9', '+', '-', '*', '/', '^', '(', ')', 'sin(', 'cos(', 'tan(', 'abs(', 'sqrt(', 'ln(', 'exp(', 'π', 'e', '.', '^2', '1000'];
  const valid = new Set(['win', 'wall', 'broken', 'out', 'miss', 'off', 'wiggle']);
  let worst = 0, parsedOk = 0;
  for (let i = 0; i < 5000; i++) {
    const len = 1 + Math.floor(rnd() * 12);
    let src = ''; for (let j = 0; j < len; j++) src += parts[Math.floor(rnd() * parts.length)];
    let p;
    try { p = E.parse(src); } catch (e) { bad(`bulanık: "${src}" ayrıştırıcıyı çökertti: ${e.message}`); continue; }
    if (!p.ok) continue;
    parsedOk++;
    const L = i % 2 ? flat : LEVELS[i % LEVELS.length];
    const t0 = Date.now();
    let r; try { r = E.simulate(L, p.fn); } catch (e) { bad(`bulanık: "${src}" simülasyonu çökertti: ${e.message}`); continue; }
    const ms = Date.now() - t0; worst = Math.max(worst, ms);
    if (!valid.has(r.result)) bad(`bulanık: "${src}" geçersiz sonuç ${r.result}`);
    if (!r.path.length || r.path.length > 20001) bad(`bulanık: "${src}" yol uzunluğu ${r.path.length}`);
    if (ms > 300) bad(`bulanık: "${src}" ${ms} ms sürdü`);
  }
  n++;
  console.log(`  bulanık test: 5000 ifade, ${parsedOk} geçerli, en yavaş ${worst} ms`);
}

// Kesinlik: 1-1'de 0.1 / 0.01 / 0.001 yıldız almamalı (sahip bildirdi)
{ const L1 = LEVELS.find(l => l.id === '1-1');
  for (const w of ['0.1', '0.01', '0.001', '-0.05']) { n++; if (E.play(L1, w).stars > 0) bad(`1-1 "${w}" ile kazanılıyor`); } }
if (!fails) console.log(`  ✓ ${n} test`);

// Dil dosyaları (ders ve ipucu metinleri var mı)
global.window = global.window || {};
for (const f of ['tr', 'en']) eval(require('fs').readFileSync(require('path').join(__dirname, `../www/locales/${f}.js`), 'utf8'));
const TR = window.LOCALES.tr.strings;

// Dersler cevap vermesin: bir dersin gösterdiği eğri hiçbir bölümün cevabı olmamalı (temel eğriler hariç)
const { LESSONS, INTRO } = require('../www/lessons.js');
{
  const same = (a, b) => { const fa = E.parse(a).fn, fb = E.parse(b).fn;
    return [-2.5, -1, 0, 0.5, 1, 2, 3.7, 5, 8].every(x => { const u = fa(x), v = fb(x); return (Number.isNaN(u) && Number.isNaN(v)) || Math.abs(u - v) < 1e-9; }); };
  for (const [key, D] of Object.entries(LESSONS)) for (const c of D.curves) {
    n++;
    if (!E.parse(c).ok) { bad(`ders ${key}: "${c}" ayrıştırılamadı`); continue; }
    if (INTRO.includes(c)) continue;
    const hit = LEVELS.find(L => same(L.solution, c));
    if (hit) bad(`ders ${key} bölüm ${hit.id}'in cevabını gösteriyor (${c})`);
  }
}

// ---- 2. Bölümler ----
console.log('Bölümler');
const ids = new Set();
const isInt = v => Math.abs(v - Math.round(v)) < 1e-9;
for (const L of LEVELS) {
  const before = fails;
  const tag = `#${L.id}`;
  if (ids.has(L.id)) bad(`${tag} kimlik tekrar ediyor`);
  if (!L.lesson) bad(`${tag} dersi yok (levels.js LESSON_OF)`);
  else if (!LESSONS[L.lesson]) bad(`${tag} dersi lessons.js içinde yok: ${L.lesson}`);
  else if (!TR[`lesson.${L.lesson}.title`] || !TR[`lesson.${L.lesson}.body`]) bad(`${tag} ders metni yok: lesson.${L.lesson}`);
  for (const k of [`lv.${L.id}`, `topic.${L.topic}`]) if (!TR[k]) bad(`${tag} metin yok: ${k}`);
  ids.add(L.id);
  const B = E.boardOf(L);
  const inBoard = (x, y) => x >= 0 && x <= B.xmax && y >= B.ymin && y <= B.ymax;
  const blockers = [...(L.walls || []).map(w => (x, y, r) => {
    const dx = Math.max(w.x - x, 0, x - (w.x + w.w)), dy = Math.max(w.y - y, 0, y - (w.y + w.h));
    return Math.hypot(dx, dy) <= r;
  }), ...(L.rocks || []).map(k => (x, y, r) => Math.hypot(x - k.x, y - k.y) <= k.r + r)];
  const blocked = (x, y, r) => blockers.some(f => f(x, y, r));
  const pts = [...(L.target ? [['hedef', L.target.x, L.target.y]] : []), ...(L.gems || []).map((g, i) => [`elmas ${i + 1}`, ...g]),
    ...(L.marks || []).map((g, i) => [`işaret ${i + 1}`, ...g])];
  if (L.shape) for (let x = L.shape.from; x <= L.shape.to; x += 0.25) {
    const y = L.shape.fn(x);
    if (Math.abs(y) > 14) { bad(`${tag} çizili eğri x=${x}'te ilk görünümün dışında (${y.toFixed(2)})`); break; }
  }
  for (const [name, x, y] of pts) {
    if (!inBoard(x, y)) bad(`${tag} ${name} harita dışında (${x}, ${y})`);
    if (Math.abs(y) > 14) bad(`${tag} ${name} çok yüksek/alçak (${y}); ilk görünümde |y| ≤ 14 olsun`);
    if (blocked(x, y, E.R)) bad(`${tag} ${name} bir engele değiyor (${x}, ${y})`);
    if (!isInt(x) || !isInt(y)) bad(`${tag} ${name} tam sayı değil (${+x.toFixed(3)}, ${+y.toFixed(3)})`);
  }
  const r = E.play(L, L.solution);
  if (!r.parse.ok) { bad(`${tag} örnek çözüm ayrıştırılamadı`); continue; }
  if (r.sim.result !== 'win') bad(`${tag} örnek çözüm kazanmıyor: ${r.sim.result}`);
  else if (r.stars !== 3) bad(`${tag} örnek çözüm ${r.stars} yıldız (elmas ${r.sim.gems.length}/${(L.gems || []).length})`);
  if (L.world > 1 && L.target) {
    const a = L.target.y / L.target.x;
    const s = E.play(L, `${a.toFixed(6)}x`);
    if (s.stars >= 2) bad(`${tag} orijinden hedefe düz çizgiyle ${s.stars} yıldız alınıyor`);
  }
  if (L.solution !== '0' && E.play(L, '0').stars >= 2) bad(`${tag} yatay çizgi yetiyor`);
  for (const w of L.wrong || []) {
    const s = E.play(L, w);
    if (!s.parse.ok) bad(`${tag} yanlış çözüm "${w}" ayrıştırılamadı`);
    else if (s.stars >= 2) bad(`${tag} yanlış çözüm "${w}" ${s.stars} yıldız alıyor`);
  }
  if (fails === before) console.log(`  ✓ ${tag} ${L.topic.padEnd(12)} ${r.parse.text}  · ${r.parse.cost} parça`);
}

console.log(fails ? `\n${fails} sorun var.` : '\nHepsi tamam.');
process.exit(fails ? 1 : 0);
