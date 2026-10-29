# kalendarat

Статичен сайт за почивни дни, празници, имени дни, ваканции и пожелания в България.

## Как е устроен
- `js/*.js`, `css/style.css` – изходният код (данни, страници, стилове).
- `tools/build.cjs` – изгражда чистите адреси (`/pochivni-dni-2027/`, `/imen-den/ivanovden/`, `/praznik/velikden/` …),
  записва в тях предварително изградено съдържание (prerender с Playwright), SEO мета данни (title, description, canonical,
  Open Graph, JSON-LD), `sitemap.xml`, `robots.txt`, `404.html`, `favicon.svg`, `og.png` и `js/bundle.js`.
- Генерираните папки и файлове са в корена на репото и се качват на GitHub Pages директно.

## Изграждане
```bash
npm install            # само първия път (Playwright)
npx playwright install chromium
npm run build          # за GitHub Pages: https://dilyanniliev.github.io/kalendarat/
```

За собствен домейн (канонични адреси и sitemap към kalendarat.com):
```bash
ORIGIN=https://kalendarat.com BASE=/ npm run build
```
След това добави файл `CNAME` със съдържание `kalendarat.com` и задай домейна в Settings → Pages.

За локален преглед: `ORIGIN=http://localhost:8000 BASE=/ npm run build && python3 -m http.server 8000`.

Всяка промяна в `js/` или `css/` изисква ново изграждане, за да се обновят страниците, картата на сайта и версията на файловете.
