// Изгражда статичния сайт: чисти адреси, SEO мета данни, предварително изградено (prerendered) съдържание,
// sitemap.xml, robots.txt, 404.html, favicon и og.png.
// Употреба:  node tools/build.cjs
//   ORIGIN=https://kalendarat.com BASE=/ node tools/build.cjs     (за собствен домейн)
// Изисква Playwright (npm i -D playwright && npx playwright install chromium).
const fs = require('fs');
const path = require('path');
const http = require('http');
const crypto = require('crypto');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const ORIGIN = (process.env.ORIGIN || 'https://dilyanniliev.github.io').replace(/\/$/, '');
const BASE = process.env.BASE || '/kalendarat/';
const SITE = 'kalendarat';

// данните на сайта са едни и същи за браузъра и за изграждането
global.window = global;
['holidays', 'namedays', 'content', 'routes'].forEach((f) => require(path.join(ROOT, 'js', f + '.js')));
const today = new Date(); const sod = new Date(today.getFullYear(), today.getMonth(), today.getDate());
const fmt = (d) => BG.fmt(d);
const trim = (t, n) => (t.length <= n ? t : t.slice(0, n - 1).replace(/[\s,.;:–-]+\S*$/, '') + '…');

// ---------- описание на страниците ----------
const pages = [];
const add = (p) => pages.push(p);
const crumb = (...items) => items; // [[име, път], ...]

add({ path: '', script: 'home', type: 'home', title: 'Почивни дни, празници и имени дни в България | kalendarat', desc: 'Календар на официалните почивни дни, празници, имени дни и ученически ваканции в България. Мостове за отпуск, църковен календар и пожелания.', pri: 1.0 });
BG.YEARS.forEach((y) => {
  const d = BG.year(y);
  const workOff = Object.keys(d.off).filter((k) => !BG.isWeekend(new Date(k + 'T00:00:00'))).length;
  add({ path: `pochivni-dni-${y}/`, script: 'days', type: 'days', page: { year: y }, title: `Почивни дни ${y} – официални празници и мостове | ${SITE}`, desc: `Всички официални почивни дни през ${y} г.: ${workOff} почивни дни в седмицата. Великден е на ${fmt(d.easter)}. Мостове, дълги почивки и таблица по дати.`, pri: y === RT.DEFAULT_YEAR ? 0.95 : 0.8, crumbs: [[`Почивни дни ${y}`, `pochivni-dni-${y}/`]] });
});
add({ path: 'praznici/', script: 'praznici', type: 'praznici', title: `Празници и почивни дни в България ${today.getFullYear()} | ${SITE}`, desc: 'Официални празници, национални дати, църковни празници и пости в България. Дати и обичаи за всеки празник.', pri: 0.85, crumbs: [['Празници', 'praznici/']] });
add({ path: 'cherkoven-kalendar/', script: 'praznici', type: 'church', page: { type: 'church' }, title: `Църковен календар ${today.getFullYear()} – празници и пости | ${SITE}`, desc: 'Православен църковен календар: Великден, Цветница, Спасовден, Рождество, Задушници и пости. Дати по години.', pri: 0.75, crumbs: [['Църковен календар', 'cherkoven-kalendar/']] });
add({ path: 'imeni-dni/', script: 'names', type: 'names', title: `Имени дни – кой има имен ден и кога | ${SITE}`, desc: 'Имени дни в България: Ивановден, Гергьовден, Димитровден, Никулден и още. Намерете кога имате имен ден по име.', pri: 0.8, crumbs: [['Имени дни', 'imeni-dni/']] });
RT.GROUPS.forEach((g) => {
  const nm = g.names.slice(0, 3);
  const list = nm.length > 1 ? nm.slice(0, -1).join(', ') + ' и ' + nm[nm.length - 1] : nm[0];
  let y = today.getFullYear(); let d = RT.groupDate(g, y); if (d < sod) d = RT.groupDate(g, ++y);
  const t1 = `Имен ден на ${list} – ${g.title} | ${SITE}`;
  const t2 = `Имен ден на ${list} – ${fmt(d)} | ${SITE}`;
  add({ path: `imen-den/${g.slug}/`, script: 'name', type: 'group', page: { slug: g.slug }, title: t1.length <= 62 ? t1 : t2, desc: trim(`${g.title} е на ${fmt(d)} ${y}. Имен ден имат ${g.names.slice(0, 8).join(', ')}. Значение на имената, обичаи и пожелания.`, 158), pri: 0.6, crumbs: [['Имени дни', 'imeni-dni/'], [g.title, `imen-den/${g.slug}/`]] });
});
CT.HOLIDAYS.forEach((h) => {
  let y = today.getFullYear(); if (h.date(y) < sod) y++; if (!BG.YEARS.includes(y)) y = BG.YEARS[0];
  const d = h.date(y);
  add({ path: `praznik/${h.id}/`, script: 'holiday', type: 'holiday', page: { id: h.id }, title: `${h.title} ${y} – дата, почивни дни, обичаи | ${SITE}`, desc: `${h.title} през ${y} г. е на ${fmt(d)}, ${BG.WEEKDAYS[d.getDay()]}.${BG.offName(d) ? ' Официален почивен ден.' : ''} Обичаи, традиции, пожелания и дати през годините.`, pri: 0.8, crumbs: [['Празници', 'praznici/'], [h.title, `praznik/${h.id}/`]] });
});
add({ path: 'vakancii/', script: 'vakancii', type: 'vac', title: `Ученически ваканции 2026/2027 – график по класове | ${SITE}`, desc: 'График на ученическите ваканции и неучебните дни през учебната година 2026/2027: Коледна, междусрочна и пролетна ваканция по класове.', pri: 0.85, crumbs: [['Ваканции', 'vakancii/']] });
const CATSHORT = { fun: 'забавни', colleagues: 'за колеги', family: 'за роднини', friends: 'за приятели', romantic: 'романтични', poem: 'в стихове', short: 'кратки' };
add({ path: 'pozhelaniya/', script: 'wishes', type: 'wishes', title: `Пожелания и поздравления за всеки повод | ${SITE}`, desc: 'Готови пожелания за имен ден, рожден ден, Коледа, Нова година, 3 март и Великден. Забавни, за колеги, за роднини, в стихове и кратки за Viber.', pri: 0.85, crumbs: [['Пожелания', 'pozhelaniya/']] });
Object.entries(RT.OCC_SLUG).forEach(([occ, s]) => {
  const t = CT.WISH_TITLES[occ];
  const cats = Object.keys(CT.CATS).filter((k) => CT.wishList(occ, k).length).map((k) => CATSHORT[k]);
  add({ path: `pozhelaniya/${s}/`, script: 'wishes', type: 'wish-occ', page: { occ }, title: `Пожелания за ${t.toLowerCase()} – ${cats.slice(0, 3).join(', ')} | ${SITE}`, desc: `${CT.wishList(occ, 'all').length} готови пожелания за ${t.toLowerCase()}: ${cats.join(', ')}. Копирайте и изпратете през Viber или Facebook.`, pri: 0.75, crumbs: [['Пожелания', 'pozhelaniya/'], [t, `pozhelaniya/${s}/`]] });
});
add({ path: 'otbroyavane/', script: 'sezoni', type: 'season', title: `Отброяване до празниците – Коледа, Нова година, Великден | ${SITE}`, desc: 'Колко дни остават до Хелоуин, Коледа, Нова година, Баба Марта, Великден и Гергьовден.', pri: 0.5, crumbs: [['Отброяване', 'otbroyavane/']] });
Object.entries(RT.INFO).forEach(([k, t]) => add({ path: `${k}/`, script: 'info', type: 'info', page: { key: k }, title: `${t} | ${SITE}`, desc: `${t} – ${SITE}, календар на празниците и почивните дни в България.`, pri: 0.2, crumbs: [[t, `${k}/`]] }));

pages.forEach((p) => { if (p.title.length > 66) p.title = p.title.replace(` | ${SITE}`, ''); });

// ---------- помощни ----------
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const LIBS = ['holidays', 'namedays', 'content', 'routes', 'common', 'widgets', 'season'];
const bundle = LIBS.map((f) => `/* ${f}.js */\n` + read(`js/${f}.js`)).join('\n');
fs.writeFileSync(path.join(ROOT, 'js/bundle.js'), bundle);
const ver = crypto.createHash('md5').update(bundle + read('css/style.css') + pages.map((p) => read(`js/${p.script}.js`)).join('')).digest('hex').slice(0, 8);
const abs = (p) => ORIGIN + BASE + p;

function shell(p, prerender) {
  const url = abs(p.path);
  const ld = [];
  if (p.type === 'home') ld.push({ '@context': 'https://schema.org', '@type': 'WebSite', name: SITE, url: abs(''), inLanguage: 'bg', potentialAction: { '@type': 'SearchAction', target: abs('imeni-dni/') + '?q={search_term_string}', 'query-input': 'required name=search_term_string' } });
  else ld.push({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Начало', item: abs('') }].concat((p.crumbs || []).map(([n, pp], i) => ({ '@type': 'ListItem', position: i + 2, name: n, item: abs(pp) }))) });
  const page = Object.assign({ type: p.type }, p.page || {});
  return `<!doctype html>
<html lang="bg">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<base href="${BASE}">
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.desc)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#7c3aed">
<meta property="og:type" content="website"><meta property="og:site_name" content="${SITE}"><meta property="og:locale" content="bg_BG">
<meta property="og:title" content="${esc(p.title)}"><meta property="og:description" content="${esc(p.desc)}"><meta property="og:url" content="${url}">
<meta property="og:image" content="${abs('og.png')}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(p.title)}"><meta name="twitter:description" content="${esc(p.desc)}"><meta name="twitter:image" content="${abs('og.png')}">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap">
<link rel="stylesheet" href="css/style.css?v=${ver}">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<script>window.__PAGE=${JSON.stringify(page)};</script>
</head>
<body>
<script src="js/bundle.js?v=${ver}"></script>
<script src="js/${p.script}.js?v=${ver}"></script>
</body>
</html>
`;
}

const MIME = { '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.html': 'text/html; charset=utf-8', '.xml': 'application/xml', '.txt': 'text/plain' };

(async () => {
  fs.writeFileSync(path.join(ROOT, 'favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="11" fill="#7c3aed"/><rect x="8" y="10" width="24" height="22" rx="4" fill="#fff"/><rect x="8" y="10" width="24" height="7" rx="3.5" fill="#c4352b"/><g fill="#7c3aed"><circle cx="14" cy="24" r="1.8"/><circle cx="20" cy="24" r="1.8"/><circle cx="14" cy="29" r="1.8"/><circle cx="20" cy="29" r="1.8"/></g><circle cx="26" cy="24" r="1.8" fill="#d9a441"/></svg>`);
  const html = new Map(pages.map((p) => [BASE + p.path, shell(p)]));
  const server = http.createServer((req, res) => {
    const u = decodeURIComponent(req.url.split('?')[0]);
    if (html.has(u)) { res.writeHead(200, { 'content-type': MIME['.html'] }); return res.end(html.get(u)); }
    const rel = u.startsWith(BASE) ? u.slice(BASE.length) : u.slice(1);
    const f = path.join(ROOT, rel);
    if (f.startsWith(ROOT) && fs.existsSync(f) && fs.statSync(f).isFile()) { res.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); return fs.createReadStream(f).pipe(res); }
    res.writeHead(404); res.end('not found');
  }).listen(0);
  const port = server.address().port;
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'bg-BG', timezoneId: 'Europe/Sofia' });
  await ctx.addInitScript(() => { window.__PRERENDER = true; try { localStorage.setItem('mode', 'light'); localStorage.setItem('skin', 'purple'); } catch (_) {} });
  const p0 = await ctx.newPage();
  const errors = [];
  p0.on('pageerror', (e) => errors.push(e.message));
  for (const p of pages) {
    await p0.goto(`http://127.0.0.1:${port}${BASE}${p.path}`, { waitUntil: 'load' });
    await p0.waitForSelector('#main h1', { timeout: 10000 });
    let out = await p0.evaluate(() => {
      document.querySelectorAll('.toast, #bats').forEach((e) => e.remove());
      document.documentElement.removeAttribute('data-mode'); document.documentElement.removeAttribute('data-skin');
      return '<!doctype html>\n' + document.documentElement.outerHTML;
    });
    out = out.replace(/<html([^>]*?)\sdata-(?:mode|skin)="[^"]*"/g, '<html$1');
    const dir = path.join(ROOT, p.path); fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), out);
  }
  if (errors.length) console.log('JS грешки:', errors);

  // og.png
  const og = await ctx.newPage(); await og.setViewportSize({ width: 1200, height: 630 });
  await og.setContent(`<body style="margin:0;width:1200px;height:630px;background:linear-gradient(135deg,#2b1048,#7c3aed);color:#fff;font-family:Manrope,system-ui,sans-serif;display:flex;flex-direction:column;justify-content:center;padding:0 90px;box-sizing:border-box"><div style="font-size:96px;font-weight:800;letter-spacing:-2px">kalendar<span style="color:#ff8a7e">at</span></div><div style="font-size:42px;margin-top:20px;max-width:900px;line-height:1.3">Почивни дни, празници, имени дни и ученически ваканции в България</div></body>`);
  await og.screenshot({ path: path.join(ROOT, 'og.png') });
  await browser.close(); server.close();

  // sitemap, robots, 404
  const d = today.toISOString().slice(0, 10);
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((p) => `  <url><loc>${abs(p.path)}</loc><lastmod>${d}</lastmod><priority>${p.pri.toFixed(2)}</priority></url>`).join('\n')}\n</urlset>\n`);
  fs.writeFileSync(path.join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${abs('sitemap.xml')}\n`);
  fs.writeFileSync(path.join(ROOT, '404.html'), `<!doctype html><html lang="bg"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><base href="${BASE}"><title>Страницата не е намерена | ${SITE}</title><meta name="robots" content="noindex"><link rel="stylesheet" href="css/style.css?v=${ver}"></head><body><main class="wrap" style="padding-block:64px"><h1>Страницата не е намерена</h1><p class="muted" style="margin:12px 0 20px">Адресът не съществува или е преместен.</p><a class="btn" href="./">Към началото</a></main></body></html>`);
  fs.writeFileSync(path.join(ROOT, '.nojekyll'), '');
  console.log(`Готово: ${pages.length} страници, версия ${ver}, адрес ${ORIGIN}${BASE}`);
})();
