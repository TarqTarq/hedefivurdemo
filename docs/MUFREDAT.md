# Hedefi Vur: müfredat haritası (taslak)

Durum: **taslak, sahip ve arkadaşı bölüm bölüm gözden geçirecek.** Onaylanınca `www/levels.js` buna göre yeniden yazılır.
Bütün noktalar hesaplandı: tam sayı ve ilk görünüme sığıyor (|y| ≤ 14).

## İlke: bölümler bir ağ

Konular düz bir sıra değil, bir ağ. Üç tür bölüm var:

- **Düğüm:** yeni bir kavramı öğretir. Az bölüm, sade (3-5).
- **Kenar:** yeni kavramın **daha önce öğrenilen her kavramla ilişkisini** gösterir. Oyunun asıl derinliği burada.
- **Sentez:** birkaç ilişkiyi birleştirir. İlk bakışta "bu imkânsız" dedirtir, anlayınca çözülür (`|x²−2|` gibi).

Zorluk hesaptan değil akıl yürütmeden gelir: simetri (aynı yükseklikte iki elmas → tepe ortada), kökler (eksene değdiği
yerler), geriye uzatma, katlama. Sayılar küçük kalır; otobüste kâğıt kalemsiz oynanabilmeli.

```mermaid
graph LR
  D[Doğru] --> K[Kavis x²]
  D -- "doğru × doğru = kavis" --> K
  D --> M[Köşe |x|]
  K -- "|kavis| = katlama" --> M
  D -- "|doğru| ve köşe + doğru" --> M
  D --> S[Dalga sin]
  K -- "x·sin: büyüyen dalga" --> S
  M -- "|sin|: zıplayan top" --> S
  D -- "doğru + dalga: merdiven" --> S
  K & M & S --> X[Sentez: hangi aile, yasak tuş, engeller]
  X --> T[Ters bulmaca]
```

Sütunlar: **tür** (düğüm / kenar / sentez) · **aha** (oyuncunun fark etmesi gereken şey) · **cevap** · **oyuncunun gördüğü**
(elmaslar ve sonda hedef) · **not** (yeni tuş, kural, duvar).

---

## A. Doğrular

| # | Tür | Aha | Cevap | Gördüğü | Not |
|---|---|---|---|---|---|
| A1 | düğüm | Yazdığım şey yükseklik; sabit sayı = düz yol | `0` | (5,0) (10,0) (15,0) → (20,0) | |
| A2 | düğüm | `x` her adımda 1 yükselir | `x` | (4,4) (8,8) → (12,12) | |
| A3 | düğüm | Öndeki sayı dikliği belirler | `3x` | (1,3) (2,6) → (4,12) | |
| A4 | düğüm | Bölmek yatıştırır | `x/3` | (3,1) (9,3) (15,5) → (21,7) | |
| A5 | düğüm | Eksi ters çevirir | `−2x` | (2,−4) (4,−8) → (6,−12) | |
| A6 | düğüm | Sondaki sayı başlangıç yüksekliği | `x+4` | (0,4) (5,9) → (10,14) | |
| A7 | kenar | Başlangıç verilmeden: iki elmastan eğim, geriye uzat | `x/2−6` | (4,−4) (8,−2) → (20,4) | |
| A8 | sentez | Eğim + başlangıç + ters, hepsi kafadan | `−2x/3+8` | (3,6) (9,2) → (21,−6) | |

## B. Kavisler (+ doğruyla ilişkisi)

| # | Tür | Aha | Cevap | Gördüğü | Not |
|---|---|---|---|---|---|
| B1 | düğüm | 1, 4, 9: kare sayılar | `x²` | (1,1) (2,4) → (3,9) | `x²` tuşu |
| B2 | düğüm | Eksi kavisi ters çevirir | `−x²` | (1,−1) (2,−4) → (3,−9) | |
| B3 | düğüm | İçeride eksi sağa kaydırır | `(x−3)²` | (0,9) (3,0) → (6,9) | |
| B4 | düğüm | İçeride artı sola kaydırır | `(x+2)²` | (0,4) → (1,9) | |
| B5 | düğüm | Sondaki sayı yukarı | `x²+5` | (0,5) (1,6) (2,9) → (3,14) | |
| B6 | düğüm | Eksi sayı aşağı | `x²−8` | (0,−8) (2,−4) → (4,8) | |
| B7 | düğüm | Öndeki sayı daraltır | `3x²` | (1,3) → (2,12) | |
| B8 | düğüm | Bölmek genişletir | `x²/4` | (2,1) (4,4) → (6,9) | |
| B9 | düğüm | Simetri: aynı yükseklikteki iki elmas, dip ortada | `(x−4)²−6` | (2,−2) (6,−2) → (7,3) | |
| B10 | **kenar** | **İki doğrunun çarpımı bir kavis**; eksene değdiği yerler doğruların sıfırları | `(x−2)(x−6)` | (2,0) (6,0) → (8,12) | yeni ders: kökler |
| B11 | **kenar** | Biri orijinden geçen doğru: `x(x−4)` | `x(x−4)` | (2,−4) (4,0) → (6,12) | |
| B12 | **kenar** | **`x²` tuşu yasak**: kavisi iki doğrunun çarpımıyla yaz | `(x−3)(x−3)` | (1,4) (5,4) → (6,9) | `ban: sq` |
| B13 | sentez | Tepe noktası duvarların arasından geçmeli | `−(x−4)²+10` | (2,6) (6,6) → (8,−6) | duvar (şimdiki 2-11) |

## C. Köşeler (+ doğruyla, + kavisle ilişkisi)

| # | Tür | Aha | Cevap | Gördüğü | Not |
|---|---|---|---|---|---|
| C1 | düğüm | `|x|` sivri köşe; kurallar kavisle aynı | `|x−4|` | (0,4) (4,0) → (10,6) | `|x|` tuşu |
| C2 | düğüm | Simetri: köşe iki elmasın ortasında, ters | `−|x−5|+5` | (3,3) (7,3) → (10,0) | |
| C3 | düğüm | Öndeki sayı kolları dikleştirir | `2|x−3|−6` | (1,−2) (5,−2) → (8,4) | |
| C4 | **kenar** | **`|doğru|`**: doğrunun eksenin altındaki kısmı yukarı katlanır | `|2x−6|` | (1,4) (5,4) → (7,8) | |
| C5 | **kenar** | **Köşe + doğru**: bir kol düzleşir; yol önce düz, sonra yokuş | `|x−4|+x` | (1,4) (3,4) (6,8) → (8,12) | |
| C6 | **kenar** | **`|kavis|`**: kavisin altta kalan kısmı katlanır, ortada tümsek | `|x²−4|` | (0,4) (1,3) (2,0) (3,5) → (4,12) | yeni ders: katlama |
| C7 | **kenar** | Aynı katlama, daha gizli (sahibin örneği) | `|x²−2|` | (0,2) (1,1) (2,2) (3,7) → (4,14) | |
| C8 | **kenar** | Katlanmış kökler: "M" şekli | `|(x−2)(x−6)|` | (0,12) (2,0) (4,4) (6,0) → (8,12) | |
| C9 | sentez | İki köşe: düz, yokuş, düz | `|x−4|−|x−12|` | (2,−8) (8,0) (14,8) → (18,8) | |

## D. Dalgalar (+ doğruyla, + köşeyle, + kavisle ilişkisi)

| # | Tür | Aha | Cevap | Gördüğü | Not |
|---|---|---|---|---|---|
| D1 | düğüm | Dalga 4 adımda bir döner | `sin(πx/2)` | (1,1) (3,−1) (5,1) → (7,−1) | `sin`, `π` tuşları |
| D2 | düğüm | Öndeki sayı dalganın boyu | `3sin(πx/2)` | (1,3) (3,−3) (5,3) (7,−3) → (9,3) | |
| D3 | düğüm | Eksi: önce aşağı | `−3sin(πx/2)` | (1,−3) (3,3) (5,−3) → (7,3) | |
| D4 | düğüm | İçerideki sayı hız | `3sin(πx/4)` | (2,3) (6,−3) (10,3) → (14,−3) | |
| D5 | düğüm | Sondaki sayı: dalganın ortası | `3sin(πx/4)+6` | (0,6) (2,9) (6,3) → (10,9) | |
| D6 | **kenar** | **Doğru + dalga**: merdiven | `x+sin(πx/2)` | (1,2) (3,2) (5,6) (7,6) → (9,10) | |
| D7 | **kenar** | **`|dalga|`**: alt yarısı katlanır, zıplayan top | `3|sin(πx/4)|` | (2,3) (4,0) (6,3) (8,0) → (10,3) | |
| D8 | **kenar** | **Doğru × dalga**: boyu büyüyen dalga | `x·sin(πx/2)` | (1,1) (3,−3) (5,5) (7,−7) (9,9) → (11,−11) | |
| D9 | sentez | Köşe + dalga | `|x−6|+sin(πx/2)` | (3,2) (5,2) (7,0) (9,4) → (12,6) | |

## E. Sentez (hangi aile? yasak/zorunlu tuş, engeller)

Bütün tuşlar açık; oyuncu hangi aileyi kullanacağına kendisi karar verir.

| # | Tür | Aha | Cevap | Gördüğü | Not |
|---|---|---|---|---|---|
| E1 | sentez | Kavis mi köşe mi? (1,1) noktası kavise uyar | `(x−2)²` | (0,4) (1,1) (3,1) → (4,4) | `2|x−2|` geçmez |
| E2 | sentez | Aynı soru, bu sefer köşe | `2|x−2|` | (0,4) (1,2) (3,2) → (4,4) | `(x−2)²` geçmez |
| E3 | sentez | **`|x|` kullanmak zorunlu**, yol düz: x ≥ 0'da `|x| = x` | `|x|` | (2,2) (5,5) → (8,8) | `need: abs` |
| E4 | sentez | Engelli yol: tepe 10 ile 12 arasında kalmalı, birçok doğru cevap | `−(x−5)²+11` (örnek) | (2,2) (8,2) → (10,−14) | duvarlar |
| E5 | sentez | Katlanmış kavis + simetri | `|x²−6x|` | (1,5) (3,9) (5,5) → (7,7) | |
| E6+ | sentez | (birlikte eklenecek: engelli dalga tüneli, iki aileyi toplama…) | | | |

## F. Ters bulmaca

Şimdiki 10 bölüm kalır; ilişkilerden birer tane eklenir: `(x−2)(x−6)`, `|x²−4|`, `3|sin(πx/4)|`, `|x−4|+x`.

---

## Yeni dersler (en basit örneklerle)

| Ders | Grafik | Ana fikir |
|---|---|---|
| Kökler | `(x−1)(x−3)` | Çarpım, çarpanlardan biri 0 olunca 0: eğri eksene 1'de ve 3'te değer |
| Katlama | `x−2` ve `|x−2|` | `|…|` eksenin altında kalanı yukarı katlar |
| Köşe + doğru | `|x−1|+x` | Bir kolun eğimi doğruyla toplanır, düzleşebilir |
| Zıplayan dalga | `|sin(πx/2)|` | Dalganın alt yarısı katlanır |
| Büyüyen dalga | `x·sin(πx/2)` | Doğru dalganın boyunu belirler |

## Sonsuz mod (sahibin fikri, ayrı mod) — ilk sürümü yapıldı (www/endless.js)

- Rider modeli: her aşamanın 3 çeşidi, biri rastgele gelir; 8 aşama, sonra karışık tekrar ve aynalama. Zaman sınırı ve elmas yok.

- Haritada duvarlar ve bir hedef. Hedefe çarpmadan varınca karakter oraya kayar, **orası yeni orijin** olur; yeni duvarlar ve yeni hedef gelir.
- **3 yanlış hakkı.** Haklar bitince oyun biter.
- Bitince bütün yol (ör. 20 parça) tek çizgi olarak baştan sona gösterilir: oyuncunun **karnesi**. Her parçanın formülü listelenir; paylaşılabilir.
- Bölümler bir üreteçle oluşturulur: oyuncunun öğrendiği ailelerden rastgele bir eğri seçilir, hedef üstüne konur, duvarlar ona çarpmayacak şekilde yerleştirilir. Böylece her tur kesin çözülebilir.
- Açık sorular: zamana karşı mı? Tur ilerledikçe hangi aileler açılır? Elmas olsun mu (puan için)? Günlük sonsuz koşu (herkese aynı tohum) + skor tablosu?
