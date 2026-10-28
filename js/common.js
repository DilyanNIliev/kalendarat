// Общ каркас: хедър, меню, търсачка, реклами, футър, споделяне
(function () {
  const P = (d) => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
  const ICON = {
    dayoff: P('<rect x="3" y="4.5" width="18" height="16.5" rx="2.5"/><path d="M3 9.5h18M8 3v3M16 3v3M8.5 15l2.5 2.5 4.5-5"/>'),
    church: P('<path d="M12 2v4M10 4h4M5 21V11l7-5 7 5v10M3 21h18M10 21v-5a2 2 0 0 1 4 0v5"/>'),
    name: P('<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v9h14v-9M12 8v13M12 8c-1-3-5-4-5-1.5S10 8 12 8zM12 8c1-3 5-4 5-1.5S14 8 12 8z"/>'),
    vac: P('<path d="M3 5.5C5 4 8.5 4 12 6c3.5-2 7-2 9-.5V19c-2-1.5-5.5-1.5-9 .5-3.5-2-7-2-9-.5zM12 6v13.5"/>'),
    national: P('<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>'),
    fast: P('<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>'),
    search: P('<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>'),
    menu: P('<path d="M4 7h16M4 12h16M4 17h16"/>'), close: P('<path d="M6 6l12 12M18 6L6 18"/>'),
    copy: P('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>'),
    moon: P('<path d="M20 14.5A8 8 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5z"/>'),
    arrow: P('<path d="M5 12h14M13 6l6 6-6 6"/>'), left: P('<path d="M15 5l-7 7 7 7"/>'), right: P('<path d="M9 5l7 7-7 7"/>'),
    heart: P('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.600-7 10-7 10z"/>'),
    fb: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" stroke="none" d="M13.5 21v-7.5h2.6l.4-3h-3V8.600c0-.9.3-1.500 1.600-1.500h1.500V4.400c-.3 0-1.200-.1-2.200-.1-2.200 0-3.700 1.300-3.700 3.800v2.400H8v3h2.700V21z"/></svg>',
    viber: P('<path d="M12 3c-4.700 0-8 2.600-8 6.700 0 2.300 1 4 2.600 5.200V20l3.200-2c.7.1 1.400.2 2.200.2 4.700 0 8-2.700 8-6.800S16.700 3 12 3z"/><path d="M9.500 8.500c.2 2.600 2.400 4.800 5 5"/>'),
  };
  const LOGO = `<svg viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="11" fill="var(--primary)"/><rect x="8" y="10" width="24" height="22" rx="4" fill="#fff"/><rect x="8" y="10" width="24" height="7" rx="3.500" fill="#c4352b"/><circle cx="14" cy="24" r="1.800" fill="#0f4c3a"/><circle cx="20" cy="24" r="1.800" fill="#0f4c3a"/><circle cx="26" cy="24" r="1.800" fill="#d9a441"/><circle cx="14" cy="29" r="1.800" fill="#0f4c3a"/><circle cx="20" cy="29" r="1.800" fill="#0f4c3a"/></svg>`;

  const NAV = [['pochivni-dni.html', 'Почивни дни', 'days'], ['praznici.html', 'Празници', 'praznici'], ['imeni-dni.html', 'Имени дни', 'names'], ['praznici.html?type=church', 'Църковен календар', 'church'], ['vakancii.html', 'Ваканции', 'vac'], ['pozhelaniya.html', 'Пожелания', 'wishes']];

  const store = {
    get(k) { try { return sessionStorage.getItem(k); } catch (_) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (_) {} },
  };
  const param = (k) => new URLSearchParams(location.search).get(k) || store.get('p_' + k) || '';
  const go = (url, k, v) => { store.set('p_' + k, v); location.href = url + '?' + k + '=' + encodeURIComponent(v); };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const plural = (n, one, many) => n + ' ' + (n === 1 ? one : many);
  const daysAway = (n) => (n === 0 ? 'днес' : n === 1 ? 'утре' : 'след ' + plural(n, 'ден', 'дни'));

  function applyTheme(t) { if (t) document.documentElement.dataset.theme = t; }
  function initTheme() {
    let t = null; try { t = localStorage.getItem('theme'); } catch (_) {}
    applyTheme(t);
  }
  function toggleTheme() {
    const cur = document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = cur === 'dark' ? 'light' : 'dark';
    applyTheme(next); try { localStorage.setItem('theme', next); } catch (_) {}
  }

  function toast(msg) {
    const t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg;
    document.body.appendChild(t); setTimeout(() => t.remove(), 1800);
  }
  function copyText(text) {
    const fallback = () => { const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); toast('Копирано'); } catch (_) { toast('Маркирайте текста и го копирайте'); } ta.remove(); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(() => toast('Копирано'), fallback); else fallback();
  }
  const shareLinks = (text) => {
    const url = location.href.split('#')[0];
    return `<a class="btn fb sm" target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}">${ICON.fb}Facebook</a>
      <a class="btn vb sm" href="viber://forward?text=${encodeURIComponent(text + ' ' + url)}">${ICON.viber}Viber</a>`;
  };

  // ресурси за подсказки при търсене
  function searchIndex() { return [...new Set([...ND.allNames(), ...CT.HOLIDAYS.map((h) => h.title)])]; }
  function runSearch(q) {
    q = q.trim(); if (!q) return;
    const ql = q.toLowerCase();
    const h = CT.HOLIDAYS.find((x) => x.title.toLowerCase() === ql) || CT.HOLIDAYS.find((x) => x.title.toLowerCase().includes(ql) && ql.length > 2);
    if (ND.allNames().some((n) => n.toLowerCase() === ql) || !h) return go('imen-den.html', 'name', q);
    go('praznik.html', 'id', h.id);
  }

  const adBlock = (cls, label) => `<aside class="ad ${cls}" aria-label="Реклама"><span class="ad-label">${label}</span></aside>`;

  function mount(active, { title, main, aside }) {
    initTheme();
    if (title) document.title = title;
    const navLinks = NAV.map(([h, t, id]) => `<a href="${h}"${active === id ? ' aria-current="page"' : ''}>${t}</a>`).join('');
    const asideHtml = aside || `${adBlock('ad-side', 'Реклама 300×600')}
      <section class="panel popular"><h3 style="margin-bottom:8px">Най-търсено</h3>
        <a href="praznik.html?id=velikden" data-p="id=velikden">Великден ${BG.year(new Date().getFullYear()).easter < new Date() ? new Date().getFullYear() + 1 : new Date().getFullYear()} ${ICON.arrow}</a>
        <a href="pochivni-dni.html">Почивни дни 2027 ${ICON.arrow}</a>
        <a href="vakancii.html">Ваканции 2026/2027 ${ICON.arrow}</a>
        <a href="imen-den.html?name=Иван" data-p="name=Иван">Имен ден на Иван ${ICON.arrow}</a>
        <a href="pozhelaniya.html">Пожелания ${ICON.arrow}</a></section>`;
    document.body.classList.add('has-sticky');
    // запазва стиловете и метаданните, ако са вътре в body (напр. при вграждане)
    const keep = [...document.body.children].filter((e) => /^(STYLE|LINK|TITLE|META|SCRIPT)$/.test(e.tagName));
    document.body.innerHTML = `
      <header class="site-header"><div class="wrap hd">
        <a class="brand" href="index.html">${LOGO}<span>Календар<em>ът</em></span></a>
        <form class="search" role="search" id="hsearch"><label class="sr" for="hq">Търсене на име или празник</label>
          <input id="hq" type="search" list="hlist" placeholder="Име или празник, напр. Георги" autocomplete="off"><button type="submit" aria-label="Търси">${ICON.search}<span>Търси</span></button>
          <datalist id="hlist">${searchIndex().map((n) => `<option value="${esc(n)}">`).join('')}</datalist></form>
        <div class="tools"><button class="ibtn" id="theme" aria-label="Тъмна или светла тема">${ICON.moon}</button><button class="ibtn burger" id="burger" aria-label="Меню" aria-expanded="false">${ICON.menu}</button></div>
        <nav class="nav" id="nav" aria-label="Основно меню">${navLinks}</nav>
      </div></header>
      <div class="wrap">${adBlock('ad-top', 'Реклама · банер 320×100 / 728×90')}</div>
      <div class="wrap layout"><main class="main" id="main">${main}</main><div class="aside">${asideHtml}</div></div>
      <footer class="site-footer"><div class="wrap">
        <div class="cols">
          <div><h4>Календарът</h4><p style="opacity:.9;max-width:34ch">Официални празници, почивни дни, имени дни и ученически ваканции в България.</p></div>
          <div><h4>Разгледай</h4><a href="pochivni-dni.html">Почивни дни</a><a href="praznici.html">Празници</a><a href="imeni-dni.html">Имени дни</a><a href="vakancii.html">Ваканции</a></div>
          <div><h4>Информация</h4><a href="info.html#za-nas">За нас</a><a href="info.html#kontakt">Контакт</a><a href="info.html#poveritelnost">Политика за поверителност</a><a href="info.html#biskvitki">Бисквитки</a></div>
        </div>
        <p class="copy">© ${new Date().getFullYear()} Календарът. Данните са информативни, проверявайте в официалните източници.</p>
      </div></footer>
      <aside class="ad ad-sticky" id="sticky" aria-label="Реклама"><span class="ad-label">Лепкава реклама 320×50</span><button aria-label="Затвори рекламата" id="sx">${ICON.close}</button></aside>`;
    keep.forEach((e) => document.body.appendChild(e));
    document.getElementById('theme').onclick = toggleTheme;
    const nav = document.getElementById('nav'), bg = document.getElementById('burger');
    bg.onclick = () => { const o = nav.classList.toggle('open'); bg.setAttribute('aria-expanded', o); bg.innerHTML = o ? ICON.close : ICON.menu; };
    document.getElementById('hsearch').onsubmit = (e) => { e.preventDefault(); runSearch(document.getElementById('hq').value); };
    document.getElementById('sx').onclick = () => { document.getElementById('sticky').classList.add('hidden'); document.body.classList.remove('has-sticky'); };
    // линкове с параметри (за сигурно навигиране)
    document.querySelectorAll('a[data-p]').forEach((a) => a.addEventListener('click', (e) => { const [k, v] = a.dataset.p.split('='); e.preventDefault(); go(a.getAttribute('href').split('?')[0], k, v); }));
    document.querySelectorAll('.nav a[href*="type="]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); go('praznici.html', 'type', 'church'); }));
  }

  // Бутони „копирай“ и споделяне вътре в страницата
  document.addEventListener('click', (e) => {
    const c = e.target.closest('[data-copy]');
    if (c) copyText(c.dataset.copy);
  });
  // линкове към динамични страници: поставят параметъра преди преминаване
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-go]');
    if (!a) return;
    e.preventDefault(); const [k, v] = a.dataset.go.split(/=(.+)/); go(a.getAttribute('href').split('?')[0], k, v);
  });

  const lnk = (page, k, v) => `${page}?${k}=${encodeURIComponent(v)}`;
  window.UI = { ICON, mount, param, go, esc, plural, daysAway, copyText, shareLinks, adBlock, lnk, store };
})();
