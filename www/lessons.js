// Dersler: bölüm başlamadan açılan pencere ve ? düğmesinin grafikleri. Metinler locales 'lesson.<ad>.title/body'.
// Kural (sahip, 2026-11-16): dersler EN BASİT örneklerle anlatır (1 birim sağa, 1 birim yukarı…);
// büyük sayılar bölümlerde kalır. Bir ders hiçbir bölümün cevabını birebir göstermez (verify denetler);
// yalnız INTRO'daki temel eğriler istisna: konunun ilk bölümü zaten o eğrinin kendisidir.
// curves: ilk eğri kesikli "ana" eğri (birden çok eğri varsa), sonrakiler renkli dönüşmüş hâlleri.
(function (root) {
  const LESSONS = {
    flat:        { view: [-2, 10, -3, 4],   curves: ['1'] },
    slope:       { view: [-1, 8, -1, 8],    curves: ['x', '2x', 'x/2'] },
    flipLine:    { view: [-1, 8, -7, 7],    curves: ['x', '-x'] },
    shiftLine:   { view: [-2, 7, -4, 7],    curves: ['x', 'x+1', 'x-1'] },
    lineAll:     { view: [-1, 6, -4, 4],    curves: ['-x+2'], marks: [0, 2] },
    parabola:    { view: [-4, 4, -1, 10],   curves: ['x^2'], marks: [1, 2, 3] },
    flipCurve:   { view: [-4, 4, -10, 10],  curves: ['x^2', '-x^2'] },
    shiftH:      { view: [-4, 4, -1, 7],    curves: ['x^2', '(x-1)^2', '(x+1)^2'] },
    shiftV:      { view: [-3, 3, -2, 6],    curves: ['x^2', 'x^2+1', 'x^2-1'] },
    combo:       { view: [-3, 4, -5, 5],    curves: ['x^2', '-(x-1)^2+1'], marks: [1] },
    narrow:      { view: [-3, 3, -1, 7],    curves: ['x^2', '2x^2'] },
    wide:        { view: [-4, 4, -1, 7],    curves: ['x^2', 'x^2/2'] },
    stretchFlip: { view: [-4, 4, -7, 7],    curves: ['x^2', '-2x^2', '-x^2/2'] },
    stretchAll:  { view: [-3, 4, -2, 7],    curves: ['x^2', '2(x-1)^2-1'], marks: [1] },
    corner:      { view: [-4, 4, -1, 5],    curves: ['abs(x)', 'abs(x-1)'] },
    cornerRules: { view: [-5, 5, -5, 7],    curves: ['abs(x)', '2abs(x)', 'abs(x)/2', '-abs(x)'] },
    cornerSum:   { view: [-2, 6, -4, 4],    curves: ['abs(x-1)', '-abs(x-3)', 'abs(x-1)-abs(x-3)'] },
    wave:        { view: [-1, 9, -2, 2],    curves: ['sin(πx/2)'], marks: [1, 3] },
    waveHeight:  { view: [-1, 9, -3, 3],    curves: ['sin(πx/2)', '2sin(πx/2)', '-2sin(πx/2)'] },
    waveSpeed:   { view: [-1, 17, -2, 2],   curves: ['sin(πx/2)', 'sin(πx/4)'] },
    waveShift:   { view: [-1, 9, -2, 3],    curves: ['sin(πx/2)', 'sin(πx/2)+1'] },
    sum:         { view: [-1, 9, -2, 6],    curves: ['x/2', 'sin(πx/2)', 'x/2+sin(πx/2)'] },
    reverse:     { view: [-2, 4, -2, 6],    curves: ['(x-1)^2-1'], marks: [0, 1, 3] },
  };
  // Konunun kendisi olan temel eğriler: dersin gösterdiği eğri, o konunun ilk bölümünün cevabı olabilir.
  const INTRO = ['x', 'x^2', '-x^2', 'sin(πx/2)'];
  const out = { LESSONS, INTRO };
  if (typeof module !== 'undefined' && module.exports) module.exports = out;
  else root.LESSON_DATA = out;
})(typeof window !== 'undefined' ? window : globalThis);
