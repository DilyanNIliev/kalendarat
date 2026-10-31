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
    palette: P('<path d="M12 3a9 9 0 1 0 0 18c1.400 0 2-1 2-2 0-1.500-1-1.800-1-3 0-1 .8-2 2.200-2H17a4 4 0 0 0 4-4c0-3.900-4-7-9-7z"/><circle cx="7.500" cy="11" r=".9"/><circle cx="10" cy="7" r=".9"/><circle cx="15" cy="7" r=".9"/>'),
    sun: P('<circle cx="12" cy="12" r="4"/><path d="M12 2.500v2.500M12 19v2.500M2.500 12H5M19 12h2.500M5.300 5.300l1.800 1.800M16.900 16.900l1.800 1.800M5.300 18.700l1.800-1.800M16.900 7.100l1.800-1.800"/>'),
    clock: P('<circle cx="12" cy="12" r="8.500"/><path d="M12 7.500V12l3 2"/>'),
    moon: P('<path d="M20 14.5A8 8 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5z"/>'),
    arrow: P('<path d="M5 12h14M13 6l6 6-6 6"/>'), left: P('<path d="M15 5l-7 7 7 7"/>'), right: P('<path d="M9 5l7 7-7 7"/>'),
    heart: P('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.600-7 10-7 10z"/>'),
    fb: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" stroke="none" d="M13.5 21v-7.5h2.6l.4-3h-3V8.600c0-.9.3-1.500 1.600-1.500h1.500V4.400c-.3 0-1.200-.1-2.200-.1-2.200 0-3.700 1.300-3.700 3.800v2.400H8v3h2.700V21z"/></svg>',
    viber: P('<path d="M12 3c-4.700 0-8 2.600-8 6.700 0 2.300 1 4 2.600 5.200V20l3.200-2c.7.1 1.400.2 2.200.2 4.700 0 8-2.700 8-6.800S16.700 3 12 3z"/><path d="M9.500 8.500c.2 2.600 2.400 4.800 5 5"/>'),
  };
  const LOGO = `<svg viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="11" fill="var(--primary)"/><rect x="8" y="10" width="24" height="22" rx="4" fill="#fff"/><rect x="8" y="10" width="24" height="7" rx="3.500" fill="#c4352b"/><circle cx="14" cy="24" r="1.800" fill="var(--primary)"/><circle cx="20" cy="24" r="1.800" fill="var(--primary)"/><circle cx="26" cy="24" r="1.800" fill="#d9a441"/><circle cx="14" cy="29" r="1.800" fill="var(--primary)"/><circle cx="20" cy="29" r="1.800" fill="var(--primary)"/></svg>`;

  const R = RT.R;
  const NAV = [[R.days(), 'Почивни дни', 'days'], [R.holidays(), 'Празници', 'praznici'], [R.names(), 'Имени дни', 'names'], [R.church(), 'Църковен календар', 'church'], [R.vac(), 'Ваканции', 'vac'], [R.wishes(), 'Пожелания', 'wishes']];

  const store = {
    get(k) { try { return sessionStorage.getItem(k); } catch (_) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (_) {} },
  };
  // параметрите идват от самата страница (window.__PAGE), после от адреса
  const param = (k) => { const pg = window.__PAGE || {}; return pg[k] !== undefined ? pg[k] : new URLSearchParams(location.search).get(k) || ''; };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const plural = (n, one, many) => n + ' ' + (n === 1 ? one : many);
  const daysAway = (n) => (n === 0 ? 'днес' : n === 1 ? 'утре' : 'след ' + plural(n, 'ден', 'дни'));

  // Тема (лилава / коледна) и фон (светъл / тъмен). Автоматичният фон следва часа в България:
  // тъмен от 19:00 до 07:00, светъл през деня.
  const root = document.documentElement;
  const SKINS = ['auto', 'purple', 'christmas'];
  const SKIN_BUTTON = false; // бутонът за смяна на темата е скрит; включете го за тест на сезонни теми
  const SKIN_NAMES = { auto: 'Основна', purple: 'Лилава', christmas: 'Коледна' };
  const MODE_NAMES = { auto: 'Автоматичен (по часа в България)', light: 'Светъл', dark: 'Тъмен' };
  const read = (k, dflt) => { try { return localStorage.getItem(k) || dflt; } catch (_) { return dflt; } };
  const write = (k, v) => { try { localStorage.setItem(k, v); } catch (_) {} };
  const sofiaHour = () => {
    try { return +new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Sofia', hour: 'numeric', hourCycle: 'h23' }).format(new Date()); } catch (_) { return new Date().getHours(); }
  };
  const autoMode = () => { const h = sofiaHour(); return h >= 19 || h < 7 ? 'dark' : 'light'; };
  const seasonId = () => { try { return Season.pick(new Date(), location.hash.slice(1)).d.id; } catch (_) { return ''; } };
  // Основната (лилава) тема е по подразбиране. Сезонни теми (напр. коледна) се включват ръчно.
  function skinFor(pref) { return SKINS.includes(pref) && pref !== 'auto' ? pref : 'purple'; }
  function applySkin(s) { if (s === 'purple') root.removeAttribute('data-skin'); else root.dataset.skin = s; }
  function applyMode() {
    const pref = read('mode', 'auto');
    root.dataset.mode = pref === 'auto' ? autoMode() : pref;
    const btn = document.getElementById('mode');
    if (btn) { btn.innerHTML = pref === 'auto' ? ICON.clock : root.dataset.mode === 'dark' ? ICON.moon : ICON.sun; const t = 'Фон: ' + MODE_NAMES[pref] + (pref === 'auto' ? ', сега ' + (root.dataset.mode === 'dark' ? 'тъмен' : 'светъл') : ''); btn.title = t; btn.setAttribute('aria-label', t + '. Натиснете за смяна.'); }
  }
  function initTheme() {
    applySkin(skinFor(read('skin', 'auto')));
    applyMode();
    clearInterval(window.__modeTimer); window.__modeTimer = setInterval(applyMode, 60000);
  }
  function updateSkinBtn() { const b = document.getElementById('theme'); if (!b) return; const p = read('skin', 'auto'); const t = 'Тема: ' + SKIN_NAMES[p] + (p === 'auto' ? ' – сега ' + SKIN_NAMES[skinFor(p)].toLowerCase() : ''); b.title = t; b.setAttribute('aria-label', t + '. Натиснете за смяна.'); }
  function toggleSkin() {
    const next = SKINS[(SKINS.indexOf(read('skin', 'auto')) + 1) % SKINS.length];
    write('skin', next); applySkin(skinFor(next)); updateSkinBtn(); toast('Тема: ' + SKIN_NAMES[next]);
  }
  function toggleMode() {
    const order = ['auto', 'light', 'dark'];
    const next = order[(order.indexOf(read('mode', 'auto')) + 1) % 3];
    write('mode', next); applyMode();
    toast('Фон: ' + MODE_NAMES[next] + (next === 'auto' ? ' – сега ' + (root.dataset.mode === 'dark' ? 'тъмен' : 'светъл') : ''));
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
  function searchIndex() { return [...new Set([...ND.allNames(), ...CT.HOLIDAYS.map((h) => h.title), ...RT.RECIP.map((x) => x.h1)])]; }
  function runSearch(q) {
    q = q.trim(); if (!q) return;
    const ql = q.toLowerCase();
    const rc = RT.recipByQuery(q);
    if (rc) { location.href = R.wishRec(rc.slug); return; }
    if (/рожден|юбилей/.test(ql)) { location.href = R.wishes('rozhden'); return; }
    const h = CT.HOLIDAYS.find((x) => x.title.toLowerCase() === ql);
    if (h) { location.href = R.holiday(h.id); return; }
    if (RT.groupsFor(q).length) { location.href = RT.nameHref(q); return; }
    const part = CT.HOLIDAYS.find((x) => ql.length > 2 && x.title.toLowerCase().includes(ql));
    if (part) { location.href = R.holiday(part.id); return; }
    location.href = R.names() + '?q=' + encodeURIComponent(q);
  }

  const ADS = false; // включете, когато добавите реклами
  const adBlock = (cls, label) => !ADS ? '' : `<aside class="ad ${cls}" aria-label="Реклама"><span class="ad-label">${label}</span></aside>`;

  function mount(active, { title, main, aside, year, cal, month }) {
    initTheme();
    if (title && !window.__PAGE) document.title = title;
    const navLinks = NAV.map(([h, t, id]) => `<a href="${h}"${active === id ? ' aria-current="page"' : ''}>${t}</a>`).join('');
    const yr = BG.easter(new Date().getFullYear()) < new Date() ? new Date().getFullYear() + 1 : new Date().getFullYear();
    const asideHtml = aside || `${adBlock('ad-side', 'Реклама 300×600')}
      <section class="panel popular"><h3 style="margin-bottom:8px">Най-търсено</h3>
        <a href="${R.holiday('velikden')}">Великден ${yr} ${ICON.arrow}</a>
        <a href="${R.days()}">Почивни дни ${RT.DEFAULT_YEAR} ${ICON.arrow}</a>
        <a href="${R.vac()}">Ваканции 2026/2027 ${ICON.arrow}</a>
        <a href="${R.group('ivanovden')}">Имен ден на Иван ${ICON.arrow}</a>
        <a href="${R.wishes()}">Пожелания ${ICON.arrow}</a></section>`;
    if (ADS) document.body.classList.add('has-sticky');
    // запазва стиловете и метаданните, ако са вътре в body (напр. при вграждане)
    const keep = [...document.body.children].filter((e) => /^(STYLE|LINK|TITLE|META|SCRIPT)$/.test(e.tagName));
    document.body.innerHTML = `
      <header class="site-header"><div class="wrap hd">
        <a class="brand" href="${R.home()}">${LOGO}<span>kalendar<em>at</em></span></a>
        <form class="search" role="search" id="hsearch"><label class="sr" for="hq">Търсене на име или празник</label>
          <input id="hq" type="search" list="hlist" placeholder="Име или празник, напр. Георги" autocomplete="off"><button type="submit" aria-label="Търси">${ICON.search}<span>Търси</span></button>
          <datalist id="hlist">${searchIndex().map((n) => `<option value="${esc(n)}">`).join('')}</datalist></form>
        <div class="tools">${cal !== false ? `<a class="ibtn jump" href="#year-cal" id="cal-jump" aria-label="Към календара" title="Към календара">${ICON.dayoff}<span>Календар</span></a>` : ''}${SKIN_BUTTON ? `<button class="ibtn" id="theme" aria-label="Смени темата" title="Смени темата">${ICON.palette}</button>` : ''}<button class="ibtn" id="mode" type="button"></button><button class="ibtn burger" id="burger" aria-label="Меню" aria-expanded="false">${ICON.menu}</button></div>
        <nav class="nav" id="nav" aria-label="Основно меню">${navLinks}</nav>
      </div></header>
      ${ADS ? `<div class="wrap">${adBlock('ad-top', 'Реклама · банер 320×100 / 728×90')}</div>` : ''}
      <div class="wrap layout"><main class="main" id="main">${main}</main><div class="aside">${asideHtml}</div></div>
      <footer class="site-footer"><div class="wrap">
        <div class="cols">
          <div><h4>kalendarat</h4><p style="opacity:.9;max-width:34ch">Официални празници, почивни дни, имени дни и ученически ваканции в България.</p></div>
          <div><h4>Разгледай</h4><a href="${R.days()}">Почивни дни</a><a href="${R.holidays()}">Празници</a><a href="${R.names()}">Имени дни</a><a href="${R.church()}">Църковен календар</a><a href="${R.vac()}">Ваканции</a><a href="${R.wishes()}">Пожелания</a><a href="${R.season()}">Отброяване до празниците</a></div>
          <div><h4>Информация</h4>${Object.entries(RT.INFO).map(([k, t]) => `<a href="${R.info(k)}">${t}</a>`).join('')}<a href="${R.info('biskvitki')}" id="cookie-settings">Настройки за бисквитки</a></div>
        </div>
        <p class="copy">© ${new Date().getFullYear()} kalendarat. Данните са информативни, проверявайте в официалните източници.${(window.__PAGE || {}).updated ? ` <span class="updated">Актуализирано: ${(window.__PAGE || {}).updated}</span>` : ''}</p>
      </div></footer>
      ${ADS ? `<aside class="ad ad-sticky" id="sticky" aria-label="Реклама"><span class="ad-label">Лепкава реклама 320×50</span><button aria-label="Затвори рекламата" id="sx">${ICON.close}</button></aside>` : ''}`;
    keep.forEach((e) => document.body.appendChild(e));
    if (cal !== false && window.W) { document.getElementById('main').insertAdjacentHTML('beforeend', W.yearCalHtml(cal === 'full')); W.initYearCal(year, { compact: cal !== 'full', month }); }
    const tb = document.getElementById('theme'); if (tb) tb.onclick = toggleSkin;
    document.getElementById('mode').onclick = toggleMode;
    applyMode(); updateSkinBtn();
    const cs = document.getElementById('cookie-settings');
    if (cs) cs.addEventListener('click', (e) => { try { if (window.googlefc && typeof googlefc.showRevocationMessage === 'function') { e.preventDefault(); googlefc.showRevocationMessage(); } } catch (_) {} });
    const nav = document.getElementById('nav'), bg = document.getElementById('burger');
    bg.onclick = () => { const o = nav.classList.toggle('open'); bg.setAttribute('aria-expanded', o); bg.innerHTML = o ? ICON.close : ICON.menu; };
    document.getElementById('hsearch').onsubmit = (e) => { e.preventDefault(); runSearch(document.getElementById('hq').value); };
    const sx = document.getElementById('sx'); if (sx) sx.onclick = () => { document.getElementById('sticky').classList.add('hidden'); document.body.classList.remove('has-sticky'); };
  }

  // Бутони „копирай“ и споделяне вътре в страницата
  document.addEventListener('click', (e) => {
    const c = e.target.closest('[data-copy]');
    if (c) copyText(c.dataset.copy);
  });
  window.UI = { ICON, mount, param, esc, plural, daysAway, copyText, shareLinks, adBlock, store };
})();
