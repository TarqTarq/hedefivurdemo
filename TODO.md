# Hedefi Vur: yapılacaklar

Fikirler ve bekleyen kararlar. Bir madde başlayınca ayrıntısı `CLAUDE.md`'ye geçer.

## Yeni fonksiyonlar

Motor hazır olanlar: `√`, `ln`, `log`, `exp`, `cos`, `tan` ayrıştırıcıda var; tuş takımında ve bölümlerde yok.
Her yeni aile: tuş, ders (`lesson.*` + grafik), bölümler (tam sayı noktalar, `wrong` listesi), ters bulmacaya bir örnek.

### Kesin
- [ ] **Üstel: `2^x`, `e^x`.** (0,1) (1,2) (2,4) (3,8). Sönen hâli `2^(−x)`. Dört dönüşüm aynı (`2^(x−3)+1`).

### Önerilenler (sırayla)
- [ ] **Kök: `√x`.** `x²`'nin tersi, noktaları kare sayılarda: (1,1) (4,2) (9,3). `√(x−3)` x < 3'te tanımsız: "yol başlamıyor" ile öteleme yönü öğretilir.
  - **Kubbe:** `√(25−(x−5)²)` yarım çember; (0,0)'dan başlar, (1,3) (2,4) (5,5) (8,4)'ten geçip (10,0)'da biter. Duvar üstünden köprü bölümleri.
- [ ] **Ters orantı: `12/(x+1)`.** (0,12) (1,6) (2,4) (3,3) (5,2) (11,1). `12/(x−3)` x = 3'te kopar: asimptotu "kopmaması gereken yer" olarak öğretir.
- [ ] **Logaritma: `log₂(x+1)`.** Üstelin tersi: (0,0) (1,1) (3,2) (7,3) (15,4). Ayrı `log₂` tuşu gerekir.
- [ ] **Kökler dünyası:** `(x−2)(x−5)`, `x(x−3)(x−6)/9`. Eksene değdiği yerler formülde yazıyor. `x³` ve kübikler.

### Görsel olarak eğlenceli birleşimler
- [ ] Zıplayan top `3|sin(πx/4)|` · sönen dalga `6·2^(−x/4)·sin(πx/2)` · tümsek `8·2^(−(x−5)²)` · cıvıltı `sin(x²)`.

### Parça parça tanımlı fonksiyonlar (sahibin aklındakiler: merdiven, min/max, ölçü teorisindeki gösterge 𝟙)
Birlikte "parça parça tanımlı fonksiyon" konusunu öğretirler.
- [ ] **Merdiven:** `⌊x⌋` (isteğe bağlı `⌈x⌉`). Dünya taslağı: `⌊x⌋` → `⌊x/2⌋` → `2⌊x⌋` → kaydırmalar → testere `x−⌊x⌋`.
- [ ] **min / max:** `max(x, 3)` (önce düz, sonra yokuş) → `min(x, 6)` → çadır `min(x, 8−x)` → `max(x²/4, 2)`.
- [ ] **Gösterge 𝟙:** ekranda `𝟙[3,5]`, x ∈ [3,5] (uçlar dahil) ise 1, değilse 0. `6·𝟙[3,5]` tek basamak → basamakları toplamak →
  `x·𝟙[0,4] + 4·𝟙(4,10]` gibi parça parça yollar → büyük sınav.
- [ ] Ters bulmacaya merdiven / basamak örnekleri.

**Bekleyen kararlar:**
1. **Sıçramada ne olacak?** Şu an sıçrayan yol "koptu" sayılıyor, yani ⌊x⌋ ve 𝟙 oynanamaz.
   - Zıplama (öneri): karakter dikey zıplar; dikey parça yolun parçası (duvara çarpar, çizilir). "Koptu" yalnız tanımsız/sonsuz yerlerde kalır.
   - Işınlanma: kaybolup belirir, aradaki duvarlar sayılmaz (𝟙 duvar geçme hilesine dönebilir).
2. **Virgül:** min/max iki değer alır (`max(x, 3)`). Virgül şu an ondalık ayırıcı da (`0,5`); öneri: yalnız ayırıcı olsun (tuş takımında zaten "." var).
3. **𝟙 uçları:** kapalı aralık `[a,b]` mı, yarı açık `(a,b]` da yazılabilsin mi? Elmaslar tam sayı noktalarda olduğu için uçtaki değer belli olmalı.

## Öğretme ve oynanış
- [ ] **Hayalet grafik kuralları:** şimdilik herkese açık/kapalı düğmesi var. Seçenekler: ilk dünyalarda açık sonra kapalı;
  açıkken 3. yıldız yok; ödüllü ipucu olarak birkaç saniye açılsın.
- [ ] **"Neredeydin" geri bildirimi:** kaçırılan elmasta "senin yolun burada 9'daydı, elmas 5'te".
- [ ] **Kaydırıcılı tanıtım kartı:** formüldeki bir sayıyı parmakla kaydırınca eğri canlı değişsin (dersin etkileşimli hâli).
- [ ] **Karmaşık problemler:** bütün fonksiyonlarla duvarlı bölümler (öğretme bölümlerinde duvar yok, karar 2026-11-15).
- [ ] Mekanik çeşitlilik: yasak/zorunlu tuş, önizlemesiz bölüm, hareketli engel, tek deneme.
- [ ] Bir çözücü: 3. yıldız sınırını ve hile çözümlerini kendisi bulsun.

## Kimlik
- [ ] Oyunun adı (çalışma adı "Hedefi Vur"; App Store kaydı şimdilik bu adla).
- [ ] Tema ve karakter (gözlü top geçici), elmas görünümü, kalıcı ikon. Seçenek panosu çizilecek.
- [ ] Yazı tipini uygulamaya gömmek (Android'de de aynı görünsün).

## Arkadaşla düello
- [ ] Sırayla oynanan düello: biri engel koyar (bütçeli, önce kendi geçmeli), öbürü çözer. Firebase ile, iPhone ve Android arası.

## Yayın yolu
- [ ] TestFlight'a yeni yapı (uç durum düzeltmeleri telefonda yok; her yüklemede `CURRENT_PROJECT_VERSION` artar).
- [ ] Arkadaşları "Arkadaşlarım" iç grubuna ekle (App Store Connect → TestFlight → Testers +, sahip yapar).
- [ ] Stüdyo kiti: reklam (AdMob + izin), Firebase, ayarlar ekranı (dil, tema, ses, titreşim), Preferences yedeği, `fr` ve diğer diller.
- [ ] Android ve Google Play kapalı testi (12 testçi × 14 gün).
- [ ] Site sayfaları (tanıtım, gizlilik, destek) ve mağaza metinleri.
- [ ] Git'te GitHub'ın gizli e-postası (commit'ler profile bağlansın).
