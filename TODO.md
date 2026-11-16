# Hedefi Vur: yapılacaklar

Fikirler ve bekleyen kararlar. Bir madde başlayınca ayrıntısı `CLAUDE.md`'ye geçer.

## Zayıf yönler ve öneriler (değerlendirme, 2026-11-16)

Önerilen sıra: **1 (oyuncu testi) ve 4 (kimlik) hemen**, gelen geri bildirime göre 2, sonra 3 ve 5.

### 1. Hiç kimse oynamadı (en büyük risk)
- [ ] Arkadaşlar TestFlight'ta (3 kişi) ve Android APK'yla denesin; "nerede takıldın" geri bildirimi.
- [ ] **Telefonda kalan oyun kaydı:** bölüm başına deneme sayısı, süre, ipucu açıldı mı, bölüm bırakıldı mı. Ayarlardaki
  "Rapor gönder" ile e-postayla bize gelir (kişisel veri yok). Zorluk eğrisi tahminle değil veriyle düzeltilir.
- [ ] **Bölüm sonu tek dokunuşla oy:** "kolay / iyi / zor" (kazanma penceresinde, isteğe bağlı).
- [ ] **İzleyerek test:** bir arkadaşı yardım etmeden oynarken izle, sesli düşünsün ("şimdi şunu deniyorum"); en çok bilgi buradan gelir.
- [ ] Eski/ucuz bir Android telefonda hız denemesi (WebView yavaş olabilir).

### 2. Telefonda formül yazmak yorucu
- [ ] **Kalıp tuşları:** dünyaya göre hazır kalıplar, ör. `(x−□)²+□`; oyuncu yalnız kutulara sayı girer (Kavisler'de 11 tuş → 3).
- [ ] **Son denemeye dön** düğmesi; formül geçmişi (son 5 deneme).
- [ ] Kapanmamış parantezleri ifadenin sonunda soluk göster (oyuncu neyin açık kaldığını görsün).
- [ ] Sık kullanılan tuşları büyütmek; tek elle kullanım (başparmak bölgesi) denemesi.

### 3. Geri dönme sebebi zayıf
- [ ] **Günlük bulmaca** (Almanac'ın kalbi): herkese aynı ters bulmaca ya da sonsuz koşu, seri sayacı, paylaşılabilir sonuç kartı.
  −2048'deki altyapı (stüdyo kiti) kullanılır.
- [ ] **Karneyi resim olarak paylaşma** (sonsuz mod): TikTok/Instagram için doğal içerik.
- [ ] **Rozetler / başarımlar:** "ipucusuz bir dünya", "ilk katlama", "sonsuzda 20 hedef"…
- [ ] **Formül albümü:** çözülen her eğri bir koleksiyona eklenir (ilerlemeyi görünür kılar).
- [ ] Sonsuz mod skor tablosu (Game Center / Play Games) ve haftalık meydan okuma.
- [ ] **Arkadaşa meydan okuma (sunucusuz):** bir bölümü kısa bir koda/bağlantıya çevirip paylaşmak; düellonun ilk adımı.

### 4. Kimlik eksik
- [ ] Oyunun adı (çalışma adı "Hedefi Vur"; App Store kaydı şimdilik bu adla). App Store'da aranan adaylar (2026-11-16, ABD + TR;
  arama ayrılmış adları göstermez, kesin sonuç "New App" formunda):
  - Boş görünenler: **Fx Trail** (öneri), Curvewise, Graphwise, Curve Path, Function Path; TR: **Formül Yolu**, **Eğri Yol**, Grafik Yolu.
  - Dolu: Plotwise, Plotline, Plot Twist, Arcwise, Linea, Slopes. "Hedefi Vur" önerilmez (atış/savaş çağrışımı, Graphwar'a yakın).
  - "-wise" adları rakip Plotwise'a fazla benziyor; "Rider" var olan bir oyunun adı, kullanılmaz (4.3 dersi).
- [ ] **Rakip: "Plotwise: Math Graph Puzzle"** (tahir genc, Aralık 2025): eğri gösterilir, denklem parçaları kutulara sürüklenir,
  klavye yok. Bizim Ters bulmaca modumuza çok yakın. Mağaza görsellerinde ve metinlerde yol çizme + sonsuz mod öne çıkarılmalı.
- [ ] Tema ve karakter (gözlü top geçici), elmas görünümü, kalıcı ikon: 6-8 seçenekli pano çizilecek.
- [ ] Yazı tipini uygulamaya gömmek (Android'de de aynı görünsün).

### 5. Stüdyo standardı / yayın
- [ ] Ayarlar ekranı (dil, tema, ses, titreşim, nasıl oynanır, destek, gizlilik, ilerlemeyi sıfırla, sürüm), Preferences yedeği.
- [ ] Fransızca (stüdyo en az en/tr/fr ile çıkar), sonra diğer diller.
- [ ] Reklam (ödüllü reklam → İpucu, `HINT_RULES.needAd`), izin pencereleri, Firebase (Analytics, Remote Config, Crashlytics).
- [ ] **Google Play kapalı testini erken başlat** (12 testçi × 14 gün, her uygulama için ayrı).
- [ ] Site sayfaları (tanıtım, gizlilik, destek), mağaza metinleri ve ekran görüntüleri.
- [ ] iPad / iPhone Duo düzeni (geniş ekranda yan panel).

### Diğer zayıf noktalar
- [ ] **İlk 30 saniye:** açılışta doğrudan 1-1 başlasın (liste değil); ilk bölümde tuş takımını gösteren kısa bir el işareti.
- [ ] **"Neredeydin" geri bildirimi:** kaçırılan elmasta "senin yolun burada 9'daydı, elmas 5'te".
- [ ] Erişilebilirlik: renk körlüğüne uygun renk/şekil ayrımı (elmas, hedef, duvar), yazı boyutu.

## Yeni fonksiyonlar

Motor hazır olanlar: `√`, `ln`, `log`, `exp`, `cos`, `tan` ayrıştırıcıda var; tuş takımında ve bölümlerde yok.
Her yeni aile: tuş, ders (`lesson.*` + grafik), bölümler ("güzel" noktalar, `wrong` listesi), ters bulmacaya bir örnek.

### Kesin
- [ ] **Üstel: `2^x`, `e^x`.** (0,1) (1,2) (2,4) (3,8). Sönen hâli `2^(−x)`. Dört dönüşüm aynı (`2^(x−3)+1`).

### Önerilenler (sırayla)
- [ ] **Kök: `√x`.** `x²`'nin tersi, noktaları kare sayılarda: (1,1) (4,2) (9,3). `√(x−3)` x < 3'te tanımsız: "yol başlamıyor" ile öteleme yönü öğretilir.
  - **Kubbe:** `√(25−(x−5)²)` yarım çember; (0,0)'dan başlar, (1,3) (2,4) (5,5) (8,4)'ten geçip (10,0)'da biter. Duvar üstünden köprü bölümleri.
- [ ] **Ters orantı: `12/(x+1)`.** (0,12) (1,6) (2,4) (3,3) (5,2) (11,1). `12/(x−3)` x = 3'te kopar: asimptotu "kopmaması gereken yer" olarak öğretir.
- [ ] **Logaritma: `log₂(x+1)`.** Üstelin tersi: (0,0) (1,1) (3,2) (7,3) (15,4). Ayrı `log₂` tuşu gerekir.
- [x] Kökler (çarpanlar): Kavisler dünyasına eklendi (2026-11-16). Kübikler (`x(x−3)(x−6)/9`) hâlâ fikir.

### Görsel olarak eğlenceli birleşimler
- [x] Zıplayan top `3|sin(πx/4)|` ve büyüyen dalga eklendi (Dalgalar). Kalan: sönen dalga `6·2^(−x/4)·sin(πx/2)`, tümsek `8·2^(−(x−5)²)`, cıvıltı `sin(x²)`.

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
- [x] Dersler basit örneklerle, cevap vermiyor; ipucu isteğe bağlı (2026-11-16)
- [x] Elmas yerleşimi akıl yürütme istiyor; müfredat ağ şeklinde (docs/MUFREDAT.md)
- [x] Yıldız: ★ hedef, ★★ elmasların yarısı, ★★★ hepsi; küçük bölümler yakın açılıyor
- [ ] **Hayalet grafik kuralları:** şimdilik herkese açık/kapalı düğmesi var. Seçenekler: ilk dünyalarda açık sonra kapalı;
  ödüllü ipucu olarak birkaç saniye açılsın.
- [ ] **Karmaşık problemler:** bütün fonksiyonlarla duvarlı bölümler (öğretme bölümlerinde duvar yok, karar 2026-11-15).
- [ ] Mekanik çeşitlilik: yasak/zorunlu tuş (motor hazır: `ban` / `need`), önizlemesiz bölüm, hareketli engel, tek deneme.
- [ ] E dünyası (sentez, "hangi aile?"): sahip şimdilik gerek görmedi; oyuncu testinden sonra bakılır.
- [ ] Bir çözücü: hile çözümlerini ve bölüm zorluğunu kendisi bulsun.

## Sonsuz mod
- [x] İlk sürüm (2026-11-16): Rider modeli, 8 aşama × 3 çeşit, aynalama, 3 can, karne.
- [ ] Daha çok aşama ve çeşit; zor aşamalarda yeni aileler. Zaman sınırı ve elmas (sahip: ilk başta yok, sonra belki).

## Arkadaşla düello
- [ ] Sırayla oynanan düello: biri engel koyar (bütçeli, önce kendi geçmeli), öbürü çözer. Firebase ile, iPhone ve Android arası.

## Yayın yolu
- [x] TestFlight yapı 2 (2026-11-16); Android deneme APK'sı GitHub'da (android-0.2).
- [ ] Arkadaşları "Arkadaşlarım" iç grubuna ekle (App Store Connect → TestFlight → Testers +, sahip yapar).
- [ ] Git'te GitHub'ın gizli e-postası (commit'ler profile bağlansın).
