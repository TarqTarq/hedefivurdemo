# Hedefi Vur: müfredat haritası (taslak)

Durum: **uygulandı (2026-11-16)**, `www/levels.js` bu haritaya göre. A'daki kesirli eğim ve B'deki iki öneri (B1 solda başlar, aşağı açılan kökler) dahil. E şimdilik yok.
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

## Gerekli iki küçük motor değişikliği (2026-11-16 revizyonu)

1. **Başlangıç x'i:** bazı bölümlerde karakter solda başlar (ör. x = −6). Böylece `|x|`'in V'si, `x²`'nin tamamı, dalganın
   iki yanı görünür (x ≥ 0'da `|x|` ile `x` aynıdır, köşe görünmez). Orijin ve koordinatlar değişmez. Tabloda "baş." sütunu.
2. **π'li etiketler ve yakın açılış:** `sin(x)`'in tepeleri π/2'de; etiket "(π/2, 1)" yazmalı. Küçük dalgalar (genliği 1)
   30 birimlik görünümde minicik kalır: bölüm içeriğine göre yakın açılmalı.

## A. Doğrular

| # | Tür | Aha | Cevap | Gördüğü |
|---|---|---|---|---|
| A1 | düğüm | Yazdığım şey yükseklik; `0` = x ekseni | `0` | (5,0) (10,0) (15,0) → (20,0) |
| A2 | düğüm | **Sabit sayı = o yükseklikte düz yol** | `3` | (4,3) (8,3) → (12,3) |
| A3 | düğüm | `x` her adımda 1 yükselir | `x` | (4,4) (8,8) → (12,12) |
| A4 | düğüm | Öndeki sayı diklik | `3x` | (1,3) (2,6) → (4,12) |
| A5 | düğüm | Bölmek yatıştırır | `x/3` | (3,1) (9,3) (15,5) → (21,7) |
| A6 | düğüm | Eksi ters çevirir | `−2x` | (2,−4) (4,−8) → (6,−12) |
| A7 | düğüm | **Ters ve yatık** | `−x/3` | (3,−1) (9,−3) → (15,−5) |
| A8 | düğüm | Sondaki sayı başlangıç | `x+4` | (0,4) (5,9) → (10,14) |
| A9 | kenar | Başlangıç yok: eğimi bul, geriye uzat | `x/2−6` | (4,−4) (8,−2) → (20,4) |
| A10 | sentez | Hepsi kafadan | `−2x/3+8` | (3,6) (9,2) → (21,−6) |
| *öneri* | | Kesirli eğim: 3 adımda 2 (A10'a hazırlık) | `2x/3` | (3,2) (6,4) → (12,8) |

## B. Kavisler (+ doğruyla ilişkisi)

| # | Tür | Aha | Cevap | Baş. | Gördüğü |
|---|---|---|---|---|---|
| B1 | düğüm | 1, 4, 9: kareler; iki yan aynı | `x²` | **−3** | (−2,4) (0,0) (2,4) → (3,9) |
| B2 | düğüm | Eksi ters çevirir | `−x²` | **−3** | (−2,−4) (0,0) (2,−4) → (3,−9) |
| B3 | düğüm | İçeride eksi sağa | `(x−3)²` | | (0,9) (3,0) → (6,9) |
| B4 | düğüm | İçeride artı sola; dip görünür | `(x+2)²` | **−5** | (−4,4) (−2,0) (0,4) → (1,9) |
| B5 | düğüm | Sonda artı yukarı | `x²+5` | | (0,5) (1,6) (2,9) → (3,14) |
| B6 | düğüm | Sonda eksi aşağı | `x²−8` | | (0,−8) (2,−4) → (4,8) |
| B7 | düğüm | Çarpan daraltır | `3x²` | **−2** | (−1,3) (0,0) (1,3) → (2,12) |
| B8 | düğüm | Bölmek genişletir | `x²/4` | | (2,1) (4,4) → (6,9) |
| B9 | düğüm | Simetri: dip ortada | `(x−4)²−6` | | (2,−2) (6,−2) → (7,3) |
| B10 | **kenar** | **İki doğrunun çarpımı kavis**; köklerde eksene değer | `(x−2)(x−6)` | | (2,0) (6,0) → (8,12) |
| B11 | **kenar** | Biri orijinden geçen doğru | `x(x−4)` | | (2,−4) (4,0) → (6,12) |
| B12 | sentez | Tepe duvarların arasından | `−(x−4)²+10` | | (2,6) (6,6) → (8,−6) + duvar |
| *öneri* | kenar | Aşağı açılan kökler: tepe köklerin ortasında | `−(x−1)(x−7)` | | (1,0) (4,9) (7,0) → (8,−7) |

(Eski B12, "x² tuşu yasak", çıkarıldı.)

## C. Köşeler: önce `|x|`, sonra dönüşümler, sonra ilişkiler

| # | Tür | Aha | Cevap | Baş. | Gördüğü |
|---|---|---|---|---|---|
| C1 | düğüm | **`|x|`**: negatifleri pozitif yapar, V şekli | `|x|` | **−6** | (−4,4) (0,0) (3,3) → (6,6) |
| C2 | düğüm | **Ters çevirme**: Λ şekli | `−|x|` | **−6** | (−4,−4) (0,0) (3,−3) → (6,−6) |
| C3 | düğüm | **Dikey öteleme** | `|x|+3` | **−5** | (−3,6) (0,3) (2,5) → (5,8) |
| C4 | düğüm | **Yatay öteleme**: köşe 4'te | `|x−4|` | | (0,4) (4,0) → (10,6) |
| C5 | kenar | Ters + iki öteleme; simetri: köşe ortada | `−|x−5|+5` | | (3,3) (7,3) → (10,0) |
| C6 | düğüm | Çarpan kolları dikleştirir | `2|x−3|−6` | | (1,−2) (5,−2) → (8,4) |
| C7 | **kenar** | **`|doğru|`**: doğrunun altta kalanı katlanır | `|2x−6|` | | (1,4) (5,4) → (7,8) |
| C8 | **kenar** | **Köşe + doğru**: bir kol düzleşir | `|x−4|+x` | | (1,4) (3,4) (6,8) → (8,12) |
| C9 | **kenar** | **`|kavis|`**: W şekli | `|x²−4|` | **−4** | (−3,5) (−2,0) (0,4) (2,0) → (3,5) |
| C10 | **kenar** | Aynı katlama, daha gizli | `|x²−2|` | **−3** | (−2,2) (−1,1) (0,2) (1,1) (2,2) → (3,7) |
| C11 | **kenar** | Katlanmış kökler: M şekli | `|(x−2)(x−6)|` | | (0,12) (2,0) (4,4) (6,0) → (8,12) |
| C12 | sentez | İki köşe: düz, yokuş, düz | `|x−4|−|x−12|` | | (2,−8) (8,0) (14,8) → (18,8) |

## D. Dalgalar: sinüs, π ile tam sayılara oturtma, dönüşümler, periyot, ilişkiler

| # | Tür | Aha | Cevap | Gördüğü |
|---|---|---|---|---|
| D1 | düğüm | **Sinüs**: 0'dan 1'e, 0'a, −1'e; tepeler π/2'de | `sin(x)` | (π/2,1) (3π/2,−1) (5π/2,1) → (7π/2,−1) |
| D2 | düğüm | **π ile çarpınca** dalga her tam sayıda sıfırlanır, tepeler 0.5'lerde | `sin(πx)` | (0.5,1) (1.5,−1) (2.5,1) → (3.5,−1) |
| D3 | düğüm | Ters çevirme | `−sin(πx)` | (0.5,−1) (1.5,1) (2.5,−1) → (3.5,1) |
| D4 | düğüm | Dikey öteleme: dalganın ortası | `sin(πx)+2` | (0.5,3) (1.5,1) (2.5,3) → (3.5,1) |
| D5 | düğüm | Yatay öteleme: dalga yarım adım kayar | `sin(π(x−0.5))` | (0,−1) (1,1) (2,−1) → (3,1) |
| D6 | düğüm | Çarpan: dalganın boyu | `3sin(πx)` | (0.5,3) (1.5,−3) (2.5,3) → (3.5,−3) |
| D7 | düğüm | **Periyot**: içeriyi bölünce dalga yavaşlar, bir tur 4 adım | `sin(πx/2)` | (1,1) (3,−1) (5,1) → (7,−1) |
| D8 | düğüm | Periyot + boy: bir tur 8 adım | `3sin(πx/4)` | (2,3) (6,−3) (10,3) → (14,−3) |
| D9 | kenar | Ortası, boyu, periyodu: üçü birden | `3sin(πx/4)+6` | (0,6) (2,9) (6,3) → (10,9) |
| D10 | **kenar** | **Doğru + dalga**: merdiven | `x+sin(πx/2)` | (1,2) (3,2) (5,6) (7,6) → (9,10) |
| D11 | **kenar** | **`|dalga|`**: zıplayan top | `3|sin(πx/4)|` | (2,3) (4,0) (6,3) (8,0) → (10,3) |
| D12 | **kenar** | **Doğru × dalga**: büyüyen dalga | `x·sin(πx/2)` | (1,1) (3,−3) (5,5) (7,−7) (9,9) → (11,−11) |
| D13 | sentez | Köşe + dalga | `|x−6|+sin(πx/2)` | (3,2) (5,2) (7,0) (9,4) → (12,6) |

## E. Sentez (şimdilik yok)

Amacı, ipucu vermeden aileyi seçtirmekti: bütün tuşlar açık, oyuncu elmaslara bakıp "kavis mi köşe mi dalga mı" diye
karar verir. Sahip şimdilik gerek görmedi (2026-11-16); ilişki bölümleri bu işi zaten kısmen yapıyor. Sonra bakılır.

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
