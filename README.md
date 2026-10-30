# kalendarat

Статичен сайт за почивни дни, празници, имени дни, ваканции и пожелания в България.

## Как е устроен
- `js/*.js`, `css/style.css` – изходният код (данни, страници, стилове). Само това се редактира.
- `tools/build.cjs` – изгражда сайта в папка `dist/`: чисти адреси (`/pochivni-dni-2027/`, `/imen-den/ivanovden/`, `/praznik/velikden/` …),
  предварително изградено съдържание (prerender с Playwright), SEO мета данни (title, description, canonical, Open Graph, JSON-LD),
  `sitemap.xml`, `robots.txt`, `404.html`, `favicon.svg`, `og.png`.
- Връзките и файловете са относителни, затова изградената папка работи и на домейн (kalendarat.com), и в подпапка (GitHub Pages).
- Каноничните връзки и sitemap винаги са към `https://kalendarat.com`.

## Автоматично публикуване (`.github/workflows/deploy.yml`)
При всяко сливане в `main` GitHub изгражда сайта и:
1. публикува копие в **GitHub Pages** (с `noindex`, за преглед) – Settings → Pages → Source: **GitHub Actions**;
2. качва истинския сайт на **хостинга по FTP** – ако е включено (вижте по-долу).

### Връзка с хостинга (FTP)
В репото: Settings → Secrets and variables → Actions.
- Secrets: `FTP_SERVER` (напр. `ftp.вашият-хостинг.bg`), `FTP_USERNAME`, `FTP_PASSWORD`.
- Variables: `DEPLOY_HOSTING` = `true`; по желание `FTP_DIR` (по подразбиране `/public_html/`) и `FTP_PROTOCOL` (`ftp`, `ftps` или `ftps-legacy`).

## Google AdSense
1. Купете домейна и пуснете сайта на него (HTTPS е задължителен).
2. В AdSense добавете сайта kalendarat.com и копирайте номера на издателя (`ca-pub-…`).
3. В GitHub: Settings → Secrets and variables → Actions → Variables → `ADSENSE_ID` = `ca-pub-1234567890123456`. При следващото изграждане сайтът получава кода на AdSense (`<script>` и `meta google-adsense-account`) и файл `ads.txt`.
4. В AdSense: Privacy & messaging → създайте съобщение за съгласие (Google CMP) за ЕИП/Великобритания и го публикувайте.
5. Рекламните места на сайта са изключени (`ADS = false` в `js/common.js`). След одобрение включете автоматични реклами от AdSense или върнете `ADS = true` и задайте рекламни блокове.

## Изграждане на компютър
```bash
npm install && npx playwright install chromium
npm run build                      # резултат в dist/
NOINDEX=1 OUT=dist-pages npm run build   # копие без индексиране
```
Локален преглед: `npm run build && cd dist && python3 -m http.server 8000`.
