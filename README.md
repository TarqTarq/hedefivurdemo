# Hedefi Vur (çalışma adı)

Fonksiyon yazarak yol çizdiğin bir matematik bulmacası. Little Lemma oyunu.

## Çalıştırmak

Bilgisayarında [Node.js](https://nodejs.org) kurulu olmalı. Sonra:

```sh
npm run serve      # http://localhost:8000 adresinde açılır
npm run verify     # motor testleri + bütün bölümlerin doğrulaması
```

Geliştirme adresleri: `?level=2-5` doğrudan bölüm açar, `?dev` bütün tuşları açar, `?nolesson` ders penceresini atlar,
`?try=2x` yazıp fırlatır, `?lang=en` dili seçer.

## Dosyalar

- `www/index.html`: arayüz (çizim, kamera, tuş takımı, dersler)
- `www/engine.js`: ifade ayrıştırıcı ve yol simülasyonu (arayüzden bağımsız)
- `www/levels.js`: bölümler (her bölümün örnek çözümü ve "yakın ama yanlış" çözümleri)
- `www/locales/`: Türkçe ve İngilizce metinler
- `tools/verify.js`: denetim; her değişiklikten sonra `npm run verify` geçmeli
- `CLAUDE.md`: oyunun kuralları ve verilen kararlar (ayrıntılı)
- `TODO.md`: yapılacaklar, fikirler ve bekleyen kararlar

## Birlikte çalışma

Değişiklik yapmadan önce `git pull`, bitince `npm run verify`, sonra `git add -A && git commit -m "…" && git push`.
