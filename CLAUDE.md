# Hedefi Vur (çalışma adı)

Bu dosya, projede çalışan Claude Code için proje belgesidir. Önce bunu baştan sona oku.

**Stüdyo mirası (Little Lemma):** her oturumda yüklenir; hesaplar, altyapı, tasarım dili, yayın süreci oradadır.

@/Users/tahaemrekurt/Projects/LITTLE_LEMMA.md

## Çalışma kuralları
- **Her zaman Türkçe yanıt ver.** Kod isimleri İngilizce, yorumlar Türkçe.
- Sahip matematikçi: matematiği basitleştirme, ama araç/kurulum adımlarını açık yaz.
- Her değişiklikten sonra `npm run verify`. Bölümler doğrulanmıyorsa iş bitmiş sayılmaz.
- Geliştirme sunucusu: `npm run serve` → http://localhost:8000 (telefondan aynı Wi-Fi'de Mac'in IP'si).
  Geliştirme parametreleri: `?dev` (bütün bölüm ve tuşlar açık), `?level=2-5` (doğrudan bölüm), `?try=2sin(x)` (yazıp fırlatır), `?lang=en`.

## Oyunun fikri
Oyuncu bir yol (fonksiyon) yazar, karakter o eğri boyunca soldan sağa kayar. Engellere değmeden hedefe ulaşmak gerekir.
Esin kaynağı "fonksiyonla ateş etme" oyunları (ör. Graphwar); **savaş teması, ad ve görünüş alınmaz** (4.3 dersi, LITTLE_LEMMA §8).
Ad, tema/karakter ve arkadaşla düello modu **sonraya bırakıldı** (2026-11-15). Şu an yalnız motor.

## Motor (www/engine.js) — kesin kurallar (2026-11-15)
- **Matematik koordinatları, karakter orijinde.** Harita sınırları x ∈ [−5, 30], y ∈ [−20, 20]; ekran bunun bir kısmını gösterir.
- **Yol x = 0'da f(0)'dan başlar** (tırmanma yok; eğri orijinden geçmiyorsa geçtiği yerden). f grafiği aynen çizilir.
- **Elmas ve hedef MATEMATİKSEL ve KESİN denetlenir:** karakter o x'e çarpmadan varırsa ve f(x) = y ise (pay yalnız 1e-6,
  yuvarlama hatası için). 0.25 pay vardı; `0.1`, `0.01` 1-1'i geçiyordu (sahip bildirdi). Duvar/kaya geometrik (yarıçap 0.3).
- Ayrıştırıcı eval kullanmaz. `+ − × ÷ ^`, parantez, örtük çarpma (`2x`, `3sin(x)`, `(x+1)(x−1)`), tekli eksi (`−x^2 = −(x^2)`),
  `sin cos tan abs sqrt exp ln log`, `π e`. Eksik kapanış parantezleri sonda kendiliğinden kapanır.
- **Parça sayısı** = ağaçtaki düğüm sayısı (bir sayı 1 parça). `2x`=3, `sin(x)`=2, `−(x−4)²+12`=8.
- Simülasyon: adım ~0.02 ama **düzensiz** (0.7–1.3 kat, altın oran sırası; sabit adımda `sin(50πx)` kontrol noktalarında 0 olup
  ters bulmacayı geçiyordu). 0.08'den uzun parçalar bölünür; 12 bölmeden sonra hâlâ uzunsa: tahta dışına gidiyorsa **out**,
  orta nokta iki ucun arasındaysa (dik ama kesintisiz, `100000x`) devam, değilse (sıçrama) **broken**. 20 000 noktayı aşan yol
  **wiggle** ("çok dalgalı"; telefonu dondurmasın). Uç durum ve 5000 ifadelik bulanık test `tools/verify.js` içinde.
- Ayrıştırıcı: boşluk ayırıcıdır (`2 3` = 6), `√x` parantezsiz de olur. `1e5` bilimsel gösterim değil, 1·e·5 (e sabiti).
- Sonuçlar: `win`, `wall`, `out` (y sınırı), `broken`, `miss` (x = 30'a vardı), `off` (ters bulmacada eğriden çıktı), `wiggle`.
- **Ters bulmaca** (`level.shape = {fn, from, to}`): x ∈ [from, to] boyunca y = g(x) olmalı; `to`'ya varınca kazanır.
  Kesin: y = g(x) (1e-6); şerit yalnız görsel. Hedef ve elmas yok; `marks` noktalarının koordinatları yazılır (tam sayı). Kazanmak ★★★.
- **Yıldızlar** (2026-11-16): ★ hedef · ★★ elmasların en az yarısı · ★★★ bütün elmaslar (elmas yoksa kazanmak ★★★).
  "En kısa yazma" sınırı kaldırıldı; parça sayısı ekranda gösterilmiyor.
- **Yasak / zorunlu tuşlar:** `level.ban` / `level.need` (sq, pow, abs, sin, cos, sqrt, pi). Yasaklar tuş takımında görünmez;
  `Engine.checkRules` formülün özelliklerine bakar, bozulursa fırlatılmaz ("Bu bölümde x² kullanılamaz").

## Tasarım dili (karar 2026-11-15)
Sahip **The Almanac** bulmaca uygulamasının tasarımını beğendi; ondan **ilham** alındı, kopyalanmadı (ad, logo, ekran düzeni alınmaz).
Krem kâğıt zemin, 2 px koyu mürekkep kenarlı kartlar ve sert kaymış gölge (`--hard`), düz pastel dolgular,
eğik serif başlıklar (`--serif`: New York/Georgia), küçük monospace etiketler (`--mono`). Stüdyonun yuvarlak yazı tipi
bu oyunda kullanılmıyor (sahip bu yönü seçti). Her dünyanın pastel rengi `--p1…--p6` (+ koyu bandı `--pNd`);
ana ekranda her dünya kendi renginde bir kart ve köşesinde o dünyanın eğrisinin ikonu. Duvarlar dünyanın renginde.
Açık ve koyu tema CSS değişkenleriyle; kanvas renkleri `readColors()` ile değişkenlerden okunur (kanvas `var()` çözemez).

## Arayüz
- Kamera: ilk görünüm kısa kenarda 30 birim, sol kenar x = −3. Sürükle = kaydır, iki parmak/tekerlek = yakınlaştır,
  ⟲ = sıfırla (çift dokunuş kaldırıldı, dokunma artık nokta seçiyor).
- **Haritaya dokunma** (2026-11-16): en yakın elmas/hedef/işaret ya da ızgara noktası seçilir, koordinatı yazılır;
  iki nokta seçilince aralarına çizgi ve **orta noktası** çizilir (simetri bulmacaları için, kâğıt kalem yerine). Serbest.
- **Ayarla** (2026-11-16): formüldeki sayıya basılı tutup sürükleyince sayı değişir, hayalet grafik canlı kayar.
  Güçlü olduğu için hak ile: bölümde açmak 1 hak, o bölümde serbest; 3 hakla başlanır, ilk kez bitirilen bölüm +1 (en çok 9).
  `TOOL_RULES.needAd` ile ileride ödüllü reklam. Gerçek eksenler ve eksen sayıları çizilir.
- Karakter yazarken (0, f(0))'da bekler; önizleme x = 0'dan 3 birim.
- **Hayalet grafik** (2026-11-15): yazılan fonksiyonun görünen aralıktaki tamamı (x < 0 dahil) soluk kesikli çizilir.
  Haritadaki düğmeyle açılıp kapanır (`hv-ghost`, varsayılan açık). Sahip "koşullu açıp kapatacağız, sonra geliştiririz" dedi:
  ileride bölüme/dünyaya göre açık-kapalı, ipucu ya da yıldız kuralına bağlanabilir.
- İfade düzenleme: imleç (◀ ▶, dokunma, oklar). Değişken x eğik matematik harfi (× ile karışmasın).
- **Dersler** (2026-11-15): her bölümün bir dersi var (`levels.js` LESSON_OF, `dünya:konu` → ders adı; 23 ders).
  **Her ders yalnız bir kez**, o konu ilk geldiğinde kendiliğinden açılır (`progress.seen`); sonra yalnız başlıktaki **?** ile.
  Pencere: başlık, küçük grafik (ilk eğri kesikli ana eğri, sonrakiler renkli dönüşümler; `index.html` LESSONS),
  formül açıklamaları ve metin (`lesson.<ad>.title/body`, metinde `formül` ters tırnakla). Verify her bölümün ders metnini denetler.
  `?nolesson` geliştirme parametresi pencereyi kapatır.
- Ters bulmacada eğrinin görünen kısmının tamamı soluk, izlenecek aralık koyu şerit.
- **Dersler en basit örneklerle** (2026-11-16): 1 birim sağa `(x−1)²`, 1 yukarı `x²+1`…; büyük sayılar bölümlerde.
  Ders verisi `www/lessons.js`; **hiçbir ders bir bölümün cevabını göstermez** (verify denetler; yalnız temel eğriler `INTRO`).
- **İpucu isteğe bağlı** (2026-11-16): ekranda konu adı bile yazmaz; konu + yönlendirme "İpucu" düğmesiyle açılır.
  3 başarısız denemeden sonra düğme 3 kez atar ve sarı kalır (sürekli yanıp sönmesi ısrarcı bulunur). İpuçları cevabı değil neye bakılacağını söyler ("x = 3'te normal kavis 9'a çıkardı…").
  `HINT_RULES.needAd` ile ileride ödüllü reklama bağlanacak (`requestHint`); açılan ipuçları `progress.hints`'te.
- Oyun hissi: WebAudio sesleri (`Fx`), Capacitor Haptics (`Hap`), parçacıklar, karakter eğime döner; ana ekranda ses aç/kapa.
- Çipler o anki denemeyi gösterir; en iyi rekor başlıktaki yıldızlarda. İpucu: `<konu>. <metin>`.
- Betikler `?v=<zaman>` ile yüklenir (tarayıcı eski dil dosyasını tutup ham anahtar gösteriyordu).

## Bölümler (www/levels.js)
- Matematik koordinatlarında: `sol` (örnek çözüm), `gems`/`target` yalnız x olarak verilir, y çözümden hesaplanır.
  Kimlik `dünya-sıra`, konu `topic` (`topic.<ad>`), ipucu `lv.<id>`.
- **Öğretme bölümlerinde duvar yok** (karar 2026-11-15); yalnız 2-11'deki anlamlı duvar kaldı. Duvarlar, bütün fonksiyonlarla
  karmaşık problemlere geçildiğinde eklenecek. Ayrımı elmaslar ve `wrong` listesi yapar.
- `wrong`: öğretilen dönüşümü atlayan yakın çözümler; verify 2 yıldız almadıklarını denetler. Ayrıca: örnek çözüm 3 yıldız,
  tam sayı koordinat, |y| ≤ 14 (ilk görünüme sığsın), engel dışı, orijinden hedefe düz çizgi ve yatay çizgi hilesi.
- Müfredat (her bölüm tek kavram): 1 Doğrular (eğim, ters, kaydırma) · 2 Kavisler (x², ters, sağa, sola, yukarı, aşağı, ikililer,
  hepsi, sınav) · 3 Germe (dar, daha dar, geniş, …, ters, kaymış, sınav) · 4 Köşeler (|x|) · 5 Dalgalar (`sin(πx/2)`) · 6 Toplama · 7 Ters bulmaca (10 bölüm, son kısım, her aileden).
- `npm run place -- "<çözüm>" 0 0 x1 x2 …` eğrinin noktalarını yazar.

## Dosyalar
- `www/index.html` arayüz (DİL / KAYIT / OYUN / ÇİZİM bölümleri), `www/engine.js`, `www/levels.js`, `www/locales/{tr,en}.js`
- `tools/verify.js`, `tools/place.js`, `scripts/serve.js`, `scripts/check-locales.js`

## Sırada
Kaydırıcılı tutorial kartları (yeni kavramı şekille göster), ters bulmaca modu (eğri çizili, formülü yaz),
yanlış denemede öğretici geri bildirim ("tepen 2 birim solda"), ipucu (ödüllü reklam), kökler dünyası, √x ve 1/x,
mekanik çeşitlilik (yasak/zorunlu tuş, önizlemesiz, hareketli engel), bir çözücü,
tema/karakter, ad, arkadaşla düello, sonra stüdyo kiti (Capacitor, reklam, Firebase, fr ve diğer diller).
