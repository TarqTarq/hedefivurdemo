/* ===================== PvP KAPIŞMA MODU (DEMO İSKELETİ) =====================
   Modüler mimari: çekirdek oyun mantığı (state) iletişim katmanından ayrıdır.
   İleride WebSocket/HTTP sunucusu eklendiğinde yalnızca adapter değişir.
   Kullanılan motor fonksiyonları: Engine.boardOf, Engine.distRect, Engine.compile, Engine.simulate
*/

const PVP = (() => {
  'use strict';

  // ---------- SABİTLER ----------
  const MAX_UNITS = 8;
  const BOARD_W = 20;  // -10 ile +10 arası
  const BOARD_H = 16;  // -8 ile +8 arası
  const UNIT_R = 0.45; // asker yarıçapı
  const TURN_TIMEOUT = 30000; // 30 saniye sıra timeout'u

  // Renkler (CSS değişkenleri ile uyumlu)
  const COLORS = {
    p1: 'var(--p1)',      // Mavi - 1. Oyuncu
    p2: 'var(--p4)',      // Kırmızı - 2. Oyuncu
    p1Dark: 'var(--p1d)',
    p2Dark: 'var(--p4d)',
    wall: 'var(--wall)',
    path: 'var(--path)',
    danger: 'var(--danger)',
    board: 'var(--board)',
  };

  // ---------- YARDIMCI FONKSİYONLAR ----------

  /**
   * Rastgele sayı üreteci (deterministik olabilmesi için seed ile)
   */
  function createRng(seed = Date.now()) {
    let s = seed >>> 0;
    return () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 0x100000000;
    };
  }

  /**
   * İki nokta arası mesafe
   */
  function dist(ax, ay, bx, by) {
    const dx = ax - bx, dy = ay - by;
    return Math.hypot(dx, dy);
  }

  /**
   * Nokta dikdörtgen içinde mi? (genişletilmiş yarıçap ile)
   */
  function pointInRect(px, py, rx, ry, rw, rh, margin = 0) {
    return px >= rx - margin && px <= rx + rw + margin &&
           py >= ry - margin && py <= ry + rh + margin;
  }

  /**
   * Nokta daire içinde mi?
   */
  function pointInCircle(px, py, cx, cy, r) {
    return dist(px, py, cx, cy) <= r;
  }

  /**
   * Çizgi segmenti - dikdörtgen kesişimi (Cohen-Sutherland benzeri basit yaklaşım)
   */
  function segmentHitsRect(x1, y1, x2, y2, rx, ry, rw, rh) {
    // Basit: segmentin herhangi bir noktası dikdörtgen içinde mi?
    // Daha hassas için Liang-Barsky kullanılabilir ama demo için yeterli
    const steps = 20;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = x1 + (x2 - x1) * t;
      const y = y1 + (y2 - y1) * t;
      if (pointInRect(x, y, rx, ry, rw, rh, 0.1)) return true;
    }
    return false;
  }

  /**
   * Çizgi segmenti - daire kesişimi
   */
  function segmentHitsCircle(x1, y1, x2, y2, cx, cy, r) {
    const steps = 20;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = x1 + (x2 - x1) * t;
      const y = y1 + (y2 - y1) * t;
      if (pointInCircle(x, y, cx, cy, r + 0.1)) return true;
    }
    return false;
  }

  // ---------- ÇEKİRDEK OYUN MANTIĞI (İLETİŞİM KATMANINDAN BAĞIMSIZ) ----------

  /**
   * Yeni bir maç oluştur
   * @param {Object} options - Maç seçenekleri
   * @param {string} options.mode - 'pass' | 'net'
   * @param {string} options.roomCode - Oda kodu (net modu için)
   * @param {number} options.seed - Rastgelelik tohumu
   * @returns {Object} Maç state'i
   */
  function createMatch(options = {}) {
    const { mode = 'pass', roomCode = null, seed = Date.now() } = options;
    const rng = createRng(seed);
    
    // Tahtayı ve engelleri al
    const dummyLevel = { walls: [], rocks: [] };
    const board = Engine.boardOf(dummyLevel);
    
    // Engelleri yerleştir (dengeli dağılım)
    const obstacles = placeObstacles(board, rng);
    
    // Askerleri yerleştir (engellere çarpmayan pozisyonlar)
    const p1Units = placeUnits(board, obstacles, -1, rng); // Sol taraf (x < 0)
    const p2Units = placeUnits(board, obstacles, 1, rng);  // Sağ taraf (x > 0)
    
    return {
      // Maç kimliği ve meta
      id: `match_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      mode,
      roomCode,
      seed,
      createdAt: Date.now(),
      
      // Oyun durumu
      state: 'waiting', // 'waiting' | 'playing' | 'finished'
      currentPlayer: 1, // 1 veya 2
      turn: 0,
      winner: null,
      
      // Tahta ve engeller
      board: { xmin: board.xmin, xmax: board.xmax, ymin: board.ymin, ymax: board.ymax },
      obstacles,
      
      // Oyuncular ve askerler
      players: {
        1: { id: 1, color: 'p1', units: p1Units, eliminated: 0 },
        2: { id: 2, color: 'p2', units: p2Units, eliminated: 0 },
      },
      
      // Geçmiş ve eşitleme
      history: [],
      pendingAction: null,
      
      // Zamanlayıcı
      turnStartTime: null,
      turnTimer: null,
    };
  }

  /**
   * Engel yerleştirme (dengeli dağılım)
   */
  function placeObstacles(board, rng) {
    const obstacles = [];
    const numWalls = 4 + Math.floor(rng() * 3); // 4-6 duvar
    const numRocks = 3 + Math.floor(rng() * 3); // 3-5 kaya
    
    // Duvarlar (dikdörtgen)
    for (let i = 0; i < numWalls; i++) {
      let attempts = 0;
      while (attempts < 50) {
        const w = 1.5 + rng() * 2.5; // 1.5-4 genişlik
        const h = 1.5 + rng() * 2.5; // 1.5-4 yükseklik
        const x = board.xmin + 2 + rng() * (board.xmax - board.xmin - 4 - w);
        const y = board.ymin + 2 + rng() * (board.ymax - board.ymin - 4 - h);
        
        // Orta çizgi civarında olmasın (x ≈ 0)
        if (x > -2 && x + w < 2) { attempts++; continue; }
        
        // Diğer engellerle çakışma kontrolü
        let overlap = false;
        for (const obs of obstacles) {
          if (obs.type === 'wall') {
            if (!(x + w < obs.x || x > obs.x + obs.w || y + h < obs.y || y > obs.y + obs.h)) {
              overlap = true; break;
            }
          } else {
            // Daire - dikdörtgen kesişimi basit kontrol
            const dx = Math.max(obs.x - x, 0, x - (obs.x + obs.w));
            const dy = Math.max(obs.y - y, 0, y - (obs.y + obs.h));
            if (Math.hypot(dx, dy) < obs.r + 0.5) { overlap = true; break; }
          }
        }
        if (!overlap) {
          obstacles.push({ type: 'wall', x, y, w, h, id: `wall_${i}` });
          break;
        }
        attempts++;
      }
    }
    
    // Kayalar (daire)
    for (let i = 0; i < numRocks; i++) {
      let attempts = 0;
      while (attempts < 50) {
        const r = 0.8 + rng() * 1.2; // 0.8-2 yarıçap
        const x = board.xmin + 2 + rng() * (board.xmax - board.xmin - 4);
        const y = board.ymin + 2 + rng() * (board.ymax - board.ymin - 4);
        
        if (x > -2 && x < 2) { attempts++; continue; }
        
        let overlap = false;
        for (const obs of obstacles) {
          if (obs.type === 'rock') {
            if (dist(x, y, obs.x, obs.y) < r + obs.r + 0.5) { overlap = true; break; }
          } else {
            const dx = Math.max(obs.x - x, 0, x - (obs.x + obs.w));
            const dy = Math.max(obs.y - y, 0, y - (obs.y + obs.h));
            if (Math.hypot(dx, dy) < r + 0.5) { overlap = true; break; }
          }
        }
        if (!overlap) {
          obstacles.push({ type: 'rock', x, y, r, id: `rock_${i}` });
          break;
        }
        attempts++;
      }
    }
    
    return obstacles;
  }

  /**
   * Asker yerleştirme (engellere çarpmayan, tarafa özgü pozisyonlar)
   */
  function placeUnits(board, obstacles, side, rng) {
    const units = [];
    const minX = side < 0 ? board.xmin + 1.5 : 1.5;
    const maxX = side < 0 ? -1.5 : board.xmax - 1.5;
    
    for (let i = 0; i < MAX_UNITS; i++) {
      let attempts = 0;
      while (attempts < 100) {
        const x = minX + rng() * (maxX - minX);
        const y = board.ymin + 1.5 + rng() * (board.ymax - board.ymin - 3);
        
        // Engel çarpışması kontrolü
        let hit = false;
        for (const obs of obstacles) {
          if (obs.type === 'wall') {
            if (pointInRect(x, y, obs.x - UNIT_R, obs.y - UNIT_R, obs.w + 2 * UNIT_R, obs.h + 2 * UNIT_R)) {
              hit = true; break;
            }
          } else {
            if (dist(x, y, obs.x, obs.y) < obs.r + UNIT_R) {
              hit = true; break;
            }
          }
        }
        
        // Diğer askerlerle çakışma
        for (const u of units) {
          if (dist(x, y, u.x, u.y) < 2 * UNIT_R) { hit = true; break; }
        }
        
        if (!hit) {
          units.push({ id: `u${side}_${i}`, x, y, alive: true, side });
          break;
        }
        attempts++;
      }
      // Eğer yer bulunamazsa varsayılan pozisyon
      if (units.length <= i) {
        const fallbackX = side < 0 ? board.xmin + 2 + i * 1.5 : board.xmax - 2 - i * 1.5;
        const fallbackY = board.ymin + 2 + (i % 4) * 2;
        units.push({ id: `u${side}_${i}`, x: fallbackX, y: fallbackY, alive: true, side });
      }
    }
    return units;
  }

  /**
   * Asker seçimi (geçerli asker mi kontrolü)
   * @param {Object} match - Maç state'i
   * @param {number} playerId - Oyuncu ID (1 veya 2)
   * @param {string} unitId - Asker ID
   * @returns {Object} { ok: boolean, error?: string, unit?: Object }
   */
  function selectUnit(match, playerId, unitId) {
    if (match.state !== 'playing') return { ok: false, error: 'match_not_active' };
    if (match.currentPlayer !== playerId) return { ok: false, error: 'not_your_turn' };
    
    const player = match.players[playerId];
    const unit = player.units.find(u => u.id === unitId);
    
    if (!unit) return { ok: false, error: 'unit_not_found' };
    if (!unit.alive) return { ok: false, error: 'unit_dead' };
    
    return { ok: true, unit };
  }

  /**
   * Atış hesaplama ve uygulama
   * @param {Object} match - Maç state'i
   * @param {number} playerId - Oyuncu ID
   * @param {string} unitId - Asker ID
   * @param {string} fnStr - Fonksiyon string'i (örn: 'sin(x)', '0.15*x^2-1')
   * @returns {Object} Sonuç { ok, error?, result?: { path, eliminations, hitType, endPos } }
   */
  function fireShot(match, playerId, unitId, fnStr) {
    // Doğrulamalar
    const selectResult = selectUnit(match, playerId, unitId);
    if (!selectResult.ok) return selectResult;
    
    const unit = selectResult.unit;
    const opponent = match.players[playerId === 1 ? 2 : 1];
    
    // Fonksiyonu derle (Engine.compile kullan)
    let parsed;
    try {
      parsed = Engine.compile(fnStr);
    } catch (e) {
      return { ok: false, error: 'compile_failed', detail: e.message };
    }
    
    if (!parsed.ok) {
      return { ok: false, error: 'parse_error', detail: parsed.error };
    }
    
    // Eğriyi simüle et (Engine.simulate kullan)
    // Asker pozisyonundan başlayacak şekilde kaydır
    const simResult = simulateShot(parsed.fn, unit.x, unit.y, match);
    
    // Çarpışma ve eleme kontrolü
    const eliminations = checkEliminations(simResult.path, opponent.units, match.obstacles, match.board);
    
    // Asker pozisyonunu güncelle (eğer hayatta kalsa ve engelle çarpmadıysa)
    // Demo için: asker hareketsiz kalır, sadece mermi gider
    
    // Sonuç nesnesi
    const result = {
      playerId,
      unitId,
      fnStr,
      path: simResult.path,
      endPos: simResult.endPos,
      hitType: simResult.hitType, // 'wall' | 'rock' | 'boundary' | 'none'
      eliminations: eliminations.map(u => u.id),
      eliminatedCount: eliminations.length,
      timestamp: Date.now(),
    };
    
    // Rakip askerleri ele
    for (const elim of eliminations) {
      elim.alive = false;
      opponent.eliminated++;
    }
    
    // Geçmişe ekle
    match.history.push(result);
    match.turn++;
    
    // Kazanma kontrolü
    if (opponent.eliminated >= MAX_UNITS) {
      match.state = 'finished';
      match.winner = playerId;
    } else {
      // Sıra değiştir
      match.currentPlayer = playerId === 1 ? 2 : 1;
      match.turnStartTime = Date.now();
    }
    
    return { ok: true, result };
  }

  /**
   * Atış simülasyonu (motor kullanarak)
   */
  function simulateShot(fn, startX, startY, match) {
    // Fonksiyonu asker pozisyonundan başlatacak şekilde kaydır
    // f(x) -> f(x - startX) + startY
    const shiftedFn = x => fn(x - startX) + startY;
    
    // Simülasyon parametreleri
    const step = 0.05;
    const maxSteps = 2000;
    const path = [];
    let hitType = 'none';
    let endPos = [startX, startY];
    
    // Tahta sınırları
    const { xmin, xmax, ymin, ymax } = match.board;
    
    // Motorun simulate fonksiyonunu kullan (eğer uygunysa) veya manuel simülasyon
    // Engine.simulate: (fn, x0, y0, xmax, step, opts) -> { path, hitType, endPos }
    // Mevcut engine.js simulate fonksiyonu level bazlı çalışıyor, bizim için uyarlama lazım
    
    // Manuel simülasyon (engine.js mantığına benzer)
    let x = startX;
    let y = startY;
    path.push([x, y]);
    
    for (let i = 0; i < maxSteps; i++) {
      x += step;
      const yNext = shiftedFn(x);
      
      if (!Number.isFinite(yNext)) {
        hitType = 'broken';
        break;
      }
      
      // Tahta sınırı kontrolü
      if (x > xmax || x < xmin || yNext > ymax || yNext < ymin) {
        hitType = 'boundary';
        endPos = [x, yNext];
        break;
      }
      
      // Engel kontrolü (segment bazında)
      let hitObstacle = false;
      for (const obs of match.obstacles) {
        if (obs.type === 'wall') {
          if (segmentHitsRect(path[path.length - 1][0], path[path.length - 1][1], x, yNext, obs.x, obs.y, obs.w, obs.h)) {
            hitType = 'wall';
            hitObstacle = true;
            break;
          }
        } else {
          if (segmentHitsCircle(path[path.length - 1][0], path[path.length - 1][1], x, yNext, obs.x, obs.y, obs.r)) {
            hitType = 'rock';
            hitObstacle = true;
            break;
          }
        }
      }
      
      y = yNext;
      path.push([x, y]);
      
      if (hitObstacle) {
        endPos = [x, y];
        break;
      }
      
      endPos = [x, y];
    }
    
    return { path, hitType, endPos };
  }

  /**
   * Eleme kontrolü: yol üzerindeki rakip askerler
   */
  function checkEliminations(path, opponentUnits, obstacles, board) {
    const eliminated = [];
    
    for (const unit of opponentUnits) {
      if (!unit.alive) continue;
      
      // Yol segmentleri ile asker mesafesi
      for (let i = 0; i < path.length - 1; i++) {
        const [x1, y1] = path[i];
        const [x2, y2] = path[i + 1];
        
        // Nokta-doğru mesafesi
        const distToSeg = pointToSegmentDist(unit.x, unit.y, x1, y1, x2, y2);
        
        if (distToSeg < UNIT_R + 0.15) { // Hafif tolerans
          eliminated.push(unit);
          break;
        }
      }
    }
    
    return eliminated;
  }

  /**
   * Nokta - doğru segmenti mesafesi
   */
  function pointToSegmentDist(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len2 = dx * dx + dy * dy;
    
    if (len2 === 0) return dist(px, py, x1, y1);
    
    let t = ((px - x1) * dx + (py - y1) * dy) / len2;
    t = Math.max(0, Math.min(1, t));
    
    const closestX = x1 + t * dx;
    const closestY = y1 + t * dy;
    
    return dist(px, py, closestX, closestY);
  }

  /**
   * Maç durumunu serileştirme (ağ iletimi için)
   */
  function serializeMatch(match) {
    return {
      id: match.id,
      mode: match.mode,
      roomCode: match.roomCode,
      seed: match.seed,
      state: match.state,
      currentPlayer: match.currentPlayer,
      turn: match.turn,
      winner: match.winner,
      board: match.board,
      obstacles: match.obstacles,
      players: {
        1: {
          id: 1,
          color: 'p1',
          units: match.players[1].units.map(u => ({ id: u.id, x: u.x, y: u.y, alive: u.alive, side: u.side })),
          eliminated: match.players[1].eliminated,
        },
        2: {
          id: 2,
          color: 'p2',
          units: match.players[2].units.map(u => ({ id: u.id, x: u.x, y: u.y, alive: u.alive, side: u.side })),
          eliminated: match.players[2].eliminated,
        },
      },
      history: match.history,
    };
  }

  /**
   * Maç durumunu deserialize etme
   */
  function deserializeMatch(data) {
    const match = createMatch({ mode: data.mode, roomCode: data.roomCode, seed: data.seed });
    Object.assign(match, data);
    // Fonksiyon referansları kaybolur, tekrar createMatch ile seed'den yeniden oluşturulmalı
    // Bu demo için yeterli
    return match;
  }

  // ---------- İLETİŞİM ADAPTER'LARI ----------

  /**
   * Adapter A: Tek Ekranda Sırayla (Pass & Play)
   * Yerel state yönetimi, hiçbir ağ iletişimi yok
   */
  function createPassAdapter() {
    let match = null;
    let callbacks = {};
    
    return {
      /** Yeni maç başlat */
      startNew() {
        match = createMatch({ mode: 'pass' });
        match.state = 'playing';
        match.turnStartTime = Date.now();
        this.emit('matchUpdate', serializeMatch(match));
        return match;
      },
      
      /** Mevcut maçı al */
      getMatch() { return match; },
      
      /** Hamle yap */
      makeMove(unitId, fnStr) {
        if (!match) return { ok: false, error: 'no_match' };
        const playerId = match.currentPlayer;
        const result = fireShot(match, playerId, unitId, fnStr);
        if (result.ok) {
          this.emit('matchUpdate', serializeMatch(match));
          if (match.state === 'finished') {
            this.emit('matchEnded', { winner: match.winner });
          }
        }
        return result;
      },
      
      /** Callback kaydı */
      on(event, cb) { callbacks[event] = cb; },
      emit(event, data) { if (callbacks[event]) callbacks[event](data); },
    };
  }

  /**
   * Adapter B: İki Sekmeli Oda Simülasyonu (BroadcastChannel)
   * Aynı tarayıcıdaki iki sekme arasında mesaj geçişi
   */
  function createBroadcastAdapter() {
    let match = null;
    let myPlayerId = null; // 1 (oda sahibi) veya 2 (katılan)
    let channel = null;
    let roomCode = null;
    let callbacks = {};
    let pendingMessages = [];
    
    // Mesaj tipleri
    const MSG = {
      CREATE_ROOM: 'pvp_create_room',
      JOIN_ROOM: 'pvp_join_room',
      ROOM_CREATED: 'pvp_room_created',
      ROOM_JOINED: 'pvp_room_joined',
      ROOM_FULL: 'pvp_room_full',
      ROOM_NOT_FOUND: 'pvp_room_not_found',
      SYNC_STATE: 'pvp_sync_state',
      MAKE_MOVE: 'pvp_make_move',
      MOVE_RESULT: 'pvp_move_result',
      PLAYER_READY: 'pvp_player_ready',
    };
    
    function initChannel(code) {
      roomCode = code;
      channel = new BroadcastChannel(`pvp_${code}`);
      
      channel.onmessage = (e) => {
        const msg = e.data;
        if (msg.type === MSG.SYNC_STATE && msg.data) {
          match = deserializeMatch(msg.data);
          this.emit('matchUpdate', serializeMatch(match));
        } else if (msg.type === MSG.MAKE_MOVE) {
          // Rakip hamle yaptı, yerel olarak uygula
          if (match && match.currentPlayer !== myPlayerId) {
            fireShot(match, msg.playerId, msg.unitId, msg.fnStr);
            this.emit('matchUpdate', serializeMatch(match));
            if (match.state === 'finished') {
              this.emit('matchEnded', { winner: match.winner });
            }
          }
        } else if (msg.type === MSG.PLAYER_READY) {
          this.emit('opponentReady', { playerId: msg.playerId });
        }
      };
    }
    
    return {
      /** Oda oluştur (1. Oyuncu) */
      createRoom() {
        const code = Math.random().toString(36).slice(2, 8).toUpperCase();
        initChannel(code);
        myPlayerId = 1;
        match = createMatch({ mode: 'net', roomCode: code });
        this.emit('roomCreated', { roomCode: code });
        // Diğer oyuncu gelene kadar bekle
        return { roomCode: code };
      },
      
      /** Odaya katıl (2. Oyuncu) */
      joinRoom(code) {
        initChannel(code);
        myPlayerId = 2;
        
        // Oda sahibine katılma isteği gönder
        channel.postMessage({ type: MSG.JOIN_ROOM, playerId: 2 });
        
        // Cevap bekle (timeout ile)
        return new Promise((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error('timeout')), 10000);
          const handler = (e) => {
            if (e.data.type === MSG.ROOM_JOINED) {
              clearTimeout(timeout);
              channel.onmessage = null; // Yeniden bağlanacak
              initChannel(code); // Yeniden bağlan
              match = deserializeMatch(e.data.match);
              this.emit('matchUpdate', serializeMatch(match));
              resolve({ roomCode: code });
            } else if (e.data.type === MSG.ROOM_FULL || e.data.type === MSG.ROOM_NOT_FOUND) {
              clearTimeout(timeout);
              reject(new Error(e.data.type));
            }
          };
          channel.addEventListener('message', handler);
        });
      },
      
      /** Mevcut maçı al */
      getMatch() { return match; },
      
      /** Hazır bildirimi gönder (katılan oyuncu için) */
      notifyReady() {
        if (channel && myPlayerId === 2) {
          channel.postMessage({ type: MSG.PLAYER_READY, playerId: 2 });
        }
      },
      
      /** Hamle yap (sadece sırası gelen oyuncu) */
      makeMove(unitId, fnStr) {
        if (!match) return { ok: false, error: 'no_match' };
        if (match.currentPlayer !== myPlayerId) return { ok: false, error: 'not_your_turn' };
        
        const result = fireShot(match, myPlayerId, unitId, fnStr);
        if (result.ok) {
          // Rakibe gönder
          if (channel) {
            channel.postMessage({
              type: MSG.MAKE_MOVE,
              playerId: myPlayerId,
              unitId,
              fnStr,
            });
          }
          this.emit('matchUpdate', serializeMatch(match));
          if (match.state === 'finished') {
            this.emit('matchEnded', { winner: match.winner });
          }
        }
        return result;
      },
      
      /** Kapat */
      close() {
        if (channel) channel.close();
        channel = null;
      },
      
      /** Callback kaydı */
      on(event, cb) { callbacks[event] = cb; },
      emit(event, data) { if (callbacks[event]) callbacks[event](data); },
    };
  }

  // ---------- GLOBAL API ----------

  return {
    // Çekirdek fonksiyonlar
    createMatch,
    selectUnit,
    fireShot,
    serializeMatch,
    deserializeMatch,
    
    // Adapter'lar
    createPassAdapter,
    createBroadcastAdapter,
    
    // Sabitler
    MAX_UNITS,
    BOARD_W,
    BOARD_H,
    UNIT_R,
    COLORS,
  };
})();

// ES modül desteği
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PVP;
}

// Global window için (eski uyumluluk)
if (typeof window !== 'undefined') {
  window.PVP = PVP;
}
