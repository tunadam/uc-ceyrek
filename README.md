# 3 Çeyrek - Statik Web Sitesi

Bu proje statik HTML/CSS/JS ile hazırlanmıştır.

## Lokal çalıştırma (ÖNERİLEN)
Header/Footer artık `fetch()` ile yüklendiği için **file://** üzerinden açmak yerine bir lokal sunucu ile çalıştırın.

### VS Code (Live Server)
1. VS Code → Live Server eklentisini kur.
2. `index.html` üzerinde sağ tık → **Open with Live Server**.

### Alternatif: Python
```bash
python -m http.server 5173
```
Sonra tarayıcıdan `http://localhost:5173`.

## Yapı
- `partials/header.html` ve `partials/footer.html`: Ortak header/footer
- `assets/js/main.js`: Ortak JS (nav aktif link, galeri lightbox, WhatsApp/telefon, dark mode)
- `assets/css/style.css`: Ortak stil

## Not
`.env`, API anahtarları vb. bu projede yoktur.
