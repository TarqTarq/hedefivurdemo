// Bölümler. Koordinatlar MATEMATİK koordinatlarıdır: karakter orijinde (0, 0).
//   sol:    örnek çözüm. Hedef ve elmaslar bu eğrinin üstüne kendiliğinden konur:
//   gems:   elmasların x'leri (y = sol(x)) · target: hedefin x'i
//   walls:  dikdörtgen {x, y, w, h} (sol-alt köşe) · rocks: daire {x, y, r}
//           Karar 2026-11-15: öğretme bölümlerinde duvar YOK (yalnız 2-11'deki anlamlı duvar kaldı).
//           Duvarlar, bütün fonksiyonlarla karmaşık problemlere geçince eklenecek.
//   wrong:  "yakın ama yanlış" çözümler: verify bunların 2 yıldız ALAMADIĞINI denetler
//           (bölüm öğrettiği şeyi atlatmasın diye)
//   topic:  bölümün konusu (locales: 'topic.<topic>'), ipucu: 'lv.<id>'
//   limit:  3. yıldız için en fazla parça (verilmezse örnek çözümün parça sayısı)
// Hedef ve elmasların koordinatları tam sayı olmalı (verify denetler). Yol x = 0'da f(0)'dan başlar.
(function (root) {
  const E = root.Engine || (typeof require !== 'undefined' ? require('./engine.js') : null);

  const K1 = [], K2 = ['sq'], K4 = ['abs', 'sq'], K5 = ['abs', 'sq', 'sin', 'pi'], K6 = ['abs', 'sq', 'sin', 'cos', 'pi'];

  const SPEC = [
    // ===== Dünya 1: Doğrular =====
    { w: 1, keys: K1, topic: 'flat', sol: '0', gems: [5, 10, 15], target: 20 },
    { w: 1, keys: K1, topic: 'slope', sol: 'x', gems: [4, 8], target: 12 },
    { w: 1, keys: K1, topic: 'steep', sol: '3x', gems: [1, 2], target: 4, wrong: ['x', '2x'] },
    { w: 1, keys: K1, topic: 'gentle', sol: 'x/3', gems: [3, 9, 15], target: 21, wrong: ['x', 'x/2'] },
    { w: 1, keys: K1, topic: 'flipLine', sol: '-2x', gems: [2, 4], target: 6, wrong: ['2x', '-x'] },
    { w: 1, keys: K1, topic: 'flipGentle', sol: '-x/3', gems: [6, 12, 18], target: 24, wrong: ['x/3', '-x/2'] },
    { w: 1, keys: K1, topic: 'up', sol: 'x+4', gems: [0, 5], target: 10, wrong: ['x'] },
    { w: 1, keys: K1, topic: 'down', sol: 'x/2-6', gems: [0, 12], target: 20, wrong: ['x/2', 'x/2+6'] },
    { w: 1, keys: K1, topic: 'lineBoss', sol: '-2x/3+8', gems: [0, 3, 12], target: 21, wrong: ['-x/2+8', '-2x/3'] },

    // ===== Dünya 2: Kavisler (x²) =====
    { w: 2, keys: K2, topic: 'curve', sol: 'x^2', gems: [1, 2], target: 3 },
    { w: 2, keys: K2, topic: 'flip', sol: '-x^2', gems: [1, 2], target: 3, wrong: ['x^2'] },
    { w: 2, keys: K2, topic: 'right', sol: '(x-3)^2', gems: [0, 3], target: 6, wrong: ['x^2', '(x+3)^2'] },
    { w: 2, keys: K2, topic: 'left', sol: '(x+2)^2', gems: [0], target: 1, wrong: ['(x-2)^2', 'x^2+4'] },
    { w: 2, keys: K2, topic: 'up', sol: 'x^2+5', gems: [0, 1, 2], target: 3, wrong: ['x^2'] },
    { w: 2, keys: K2, topic: 'down', sol: 'x^2-8', gems: [0, 2], target: 4, wrong: ['x^2', 'x^2+8'] },
    { w: 2, keys: K2, topic: 'flipRight', sol: '-(x-3)^2', gems: [0, 3], target: 6, wrong: ['(x-3)^2', '-(x+3)^2'] },
    { w: 2, keys: K2, topic: 'flipUp', sol: '-x^2+9', gems: [0, 2], target: 4, wrong: ['-x^2', 'x^2+9'] },
    { w: 2, keys: K2, topic: 'rightDown', sol: '(x-4)^2-6', gems: [0, 4], target: 7, wrong: ['(x-4)^2', 'x^2-6'] },
    { w: 2, keys: K2, topic: 'all', sol: '-(x-4)^2+12', gems: [0, 2, 4, 6], target: 8,
      wrong: ['-(x-4)^2', '(x-4)^2+12', '-x^2+12'] },
    { w: 2, keys: K2, topic: 'curveBoss', sol: '-(x-4)^2+10', gems: [1, 4, 7], target: 8,
      walls: [{ x: 3, y: -14, w: 2, h: 16 }, { x: 3, y: 12, w: 2, h: 6 }], wrong: ['-(x-4)^2+12', '-(x-4)^2'] },

    // ===== Dünya 3: Germe (dar ve geniş kavisler) =====
    { w: 3, keys: K2, topic: 'narrow', sol: '3x^2', gems: [1], target: 2, wrong: ['x^2', '2x^2'] },
    { w: 3, keys: K2, topic: 'wide', sol: 'x^2/3', gems: [3], target: 6, wrong: ['x^2', 'x^2/2'] },
    { w: 3, keys: K2, topic: 'wider', sol: 'x^2/4', gems: [2, 4], target: 6, wrong: ['x^2/3', 'x^2/2'] },
    { w: 3, keys: K2, topic: 'widest', sol: 'x^2/9', gems: [3, 6], target: 9, wrong: ['x^2/4'] },
    { w: 3, keys: K2, topic: 'narrowFlip', sol: '-3x^2', gems: [1], target: 2, wrong: ['-x^2', '3x^2', '-2x^2'] },
    { w: 3, keys: K2, topic: 'wideFlip', sol: '-x^2/4', gems: [2, 4], target: 6, wrong: ['-x^2/2', 'x^2/4'] },
    { w: 3, keys: K2, topic: 'wideMoved', sol: '(x-6)^2/4-9', gems: [2, 6, 10], target: 12, wrong: ['(x-6)^2-9'] },
    { w: 3, keys: K2, topic: 'narrowMoved', sol: '2(x-3)^2-8', gems: [1, 3, 5], target: 6, wrong: ['(x-3)^2-8'] },
    { w: 3, keys: K2, topic: 'stretchBoss', sol: '-(x-8)^2/4+12', gems: [4, 8, 12], target: 16,
      wrong: ['-(x-8)^2+12', '-(x-8)^2/2+12'] },

    // ===== Dünya 4: Köşeler (|x|, aynı kurallar) =====
    { w: 4, keys: K4, topic: 'corner', sol: 'abs(x-4)', gems: [0, 4], target: 10, wrong: ['abs(x)', '(x-4)^2/4'] },
    { w: 4, keys: K4, topic: 'cornerFlip', sol: '-abs(x-5)+5', gems: [5], target: 10, wrong: ['abs(x-5)-5'] },
    { w: 4, keys: K4, topic: 'cornerSteep', sol: '2abs(x-3)-6', gems: [3], target: 8, wrong: ['abs(x-3)-6'] },
    { w: 4, keys: K4, topic: 'cornerWide', sol: 'abs(x-8)/2+2', gems: [0, 8], target: 16, wrong: ['abs(x-8)+2'] },
    { w: 4, keys: K4, topic: 'cornerBoss', sol: 'abs(x-4)-abs(x-12)', gems: [2, 8, 14], target: 18, wrong: ['2abs(x-8)-8'] },

    // ===== Dünya 5: Dalgalar =====
    { w: 5, keys: K5, topic: 'wave', sol: 'sin(πx/2)', gems: [1, 3, 5], target: 7, wrong: ['sin(x)'] },
    { w: 5, keys: K5, topic: 'waveTall', sol: '3sin(πx/2)', gems: [1, 3, 5, 7], target: 9, wrong: ['sin(πx/2)'] },
    { w: 5, keys: K5, topic: 'waveFlip', sol: '-3sin(πx/2)', gems: [1, 3, 5], target: 7, wrong: ['3sin(πx/2)'] },
    { w: 5, keys: K5, topic: 'waveSlow', sol: '3sin(πx/4)', gems: [2, 6, 10], target: 14, wrong: ['3sin(πx/2)'] },
    { w: 5, keys: K5, topic: 'waveUp', sol: '3sin(πx/4)+6', gems: [0, 2, 6], target: 10, wrong: ['3sin(πx/4)'] },
    { w: 5, keys: K5, topic: 'waveBoss', sol: '4sin(πx/6)-4', gems: [3, 9, 15], target: 18,
      wrong: ['4sin(πx/6)', '4sin(πx/4)-4'] },

    // ===== Dünya 6: Toplama =====
    { w: 6, keys: K6, topic: 'sumStairs', sol: 'x+sin(πx/2)', gems: [1, 3, 5, 7], target: 9, wrong: ['x'] },
    { w: 6, keys: K6, topic: 'sumWave', sol: 'x/2+3sin(πx/4)', gems: [2, 6, 10], target: 14, wrong: ['x/2', '3sin(πx/4)'] },
    { w: 6, keys: K6, topic: 'sumCorner', sol: 'abs(x-6)+sin(πx/2)', gems: [3, 5, 7, 9], target: 12, wrong: ['abs(x-6)'] },

    // ===== Dünya 7: Ters bulmaca (eğri çizili, formülü oyuncu bulur) =====
    // shape: [başlangıç x, bitiş x] arasında eğri çizilir; marks: koordinatı yazılan noktaların x'leri.
    { w: 7, keys: K6, topic: 'revLine', sol: '2x-3', shape: [0, 8], marks: [0, 3, 8], wrong: ['2x', 'x-3'] },
    { w: 7, keys: K6, topic: 'revLine', sol: '-x/2+4', shape: [0, 16], marks: [0, 8, 16], wrong: ['-x/2', '-2x+4'] },
    { w: 7, keys: K6, topic: 'revCurve', sol: '(x-3)^2-4', shape: [0, 7], marks: [0, 3, 7], wrong: ['(x+3)^2-4', '(x-3)^2'] },
    { w: 7, keys: K6, topic: 'revCurve', sol: '-(x-4)^2+9', shape: [0, 8], marks: [0, 4, 8], wrong: ['(x-4)^2+9', '-(x-4)^2'] },
    { w: 7, keys: K6, topic: 'revStretch', sol: 'x^2/4-5', shape: [0, 8], marks: [0, 4, 8], wrong: ['x^2-5', 'x^2/2-5'] },
    { w: 7, keys: K6, topic: 'revStretch', sol: '2(x-2)^2-6', shape: [0, 5], marks: [0, 2, 4], wrong: ['(x-2)^2-6'] },
    { w: 7, keys: K6, topic: 'revCorner', sol: 'abs(x-5)-3', shape: [0, 12], marks: [0, 5, 12], wrong: ['abs(x+5)-3', 'abs(x-5)'] },
    { w: 7, keys: K6, topic: 'revCorner', sol: '-2abs(x-4)+6', shape: [0, 10], marks: [0, 4, 10], wrong: ['-abs(x-4)+6'] },
    { w: 7, keys: K6, topic: 'revWave', sol: '3sin(πx/4)', shape: [0, 16], marks: [2, 6, 10, 14], wrong: ['3sin(πx/2)', 'sin(πx/4)'] },
    { w: 7, keys: K6, topic: 'revSum', sol: 'x+2sin(πx/2)', shape: [0, 12], marks: [1, 3, 5, 12], wrong: ['x', 'x+sin(πx/2)'] },
  ];

  // Her bölümün dersi (bölüm başlamadan açılan pencere ve ? düğmesi). Anahtar 'dünya:konu'.
  // Ders içerikleri: index.html LESSONS (grafikler) + locales 'lesson.<ad>.title/body'.
  const LESSON_OF = {
    '1:flat': 'flat', '1:slope': 'slope', '1:steep': 'slope', '1:gentle': 'slope',
    '1:flipLine': 'flipLine', '1:flipGentle': 'flipLine', '1:up': 'shiftLine', '1:down': 'shiftLine', '1:lineBoss': 'lineAll',
    '2:curve': 'parabola', '2:flip': 'flipCurve', '2:right': 'shiftH', '2:left': 'shiftH', '2:up': 'shiftV', '2:down': 'shiftV',
    '2:flipRight': 'combo', '2:flipUp': 'combo', '2:rightDown': 'combo', '2:all': 'combo', '2:curveBoss': 'combo',
    '3:narrow': 'narrow', '3:wide': 'wide', '3:wider': 'wide', '3:widest': 'wide',
    '3:narrowFlip': 'stretchFlip', '3:wideFlip': 'stretchFlip', '3:wideMoved': 'stretchAll', '3:narrowMoved': 'stretchAll', '3:stretchBoss': 'stretchAll',
    '4:corner': 'corner', '4:cornerFlip': 'cornerRules', '4:cornerSteep': 'cornerRules', '4:cornerWide': 'cornerRules', '4:cornerBoss': 'cornerSum',
    '5:wave': 'wave', '5:waveTall': 'waveHeight', '5:waveFlip': 'waveHeight', '5:waveSlow': 'waveSpeed', '5:waveUp': 'waveShift', '5:waveBoss': 'waveShift',
    '6:sumStairs': 'sum', '6:sumWave': 'sum', '6:sumCorner': 'sum',
  };

  const counts = {};
  const LEVELS = SPEC.map(S => {
    const n = (counts[S.w] = (counts[S.w] || 0) + 1);
    const p = E.parse(S.sol);
    if (!p.ok) throw new Error(`bölüm ${S.w}-${n}: çözüm ayrıştırılamadı`);
    const at = x => [x, p.fn(x)];
    const shape = S.shape ? { fn: p.fn, from: S.shape[0], to: S.shape[1] } : null;
    return {
      id: `${S.w}-${n}`, world: S.w, n, keys: S.keys, topic: S.topic, solution: S.sol, start: [0, 0],
      lesson: LESSON_OF[`${S.w}:${S.topic}`] || (S.w === 7 ? 'reverse' : null),
      target: shape ? null : { x: S.target, y: p.fn(S.target) }, gems: (S.gems || []).map(at),
      shape, marks: (S.marks || []).map(at),
      walls: S.walls || [], rocks: S.rocks || [], wrong: S.wrong || [], limit: S.limit,
    };
  });

  if (typeof module !== 'undefined' && module.exports) module.exports = LEVELS;
  else root.LEVELS = LEVELS;
})(typeof window !== 'undefined' ? window : globalThis);
