(function () {
  const now = new Date(), I = UI.ICON;
  const raw = (UI.param('name') || 'Иван').trim();
  const name = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
  const hits = ND.search(name, now);
  const popular = ['Иван', 'Мария', 'Георги', 'Димитър', 'Никола', 'Петър', 'Стефан', 'Христо', 'Елена', 'Анна', 'Васил', 'Йордан'];
  const chips = (l) => l.map((n) => `<a class="chip" href="imen-den.html?name=${encodeURIComponent(n)}" data-go="name=${UI.esc(n)}">${UI.esc(n)}</a>`).join('');
  const crumbs = `<div class="crumbs"><a href="index.html">Начало</a> / <a href="imeni-dni.html">Имени дни</a> / ${UI.esc(name)}</div>`;

  if (!hits.length) {
    UI.mount('names', { title: 'Имен ден на ' + name, main: `${crumbs}<h1>Не намерихме имен ден за „${UI.esc(name)}“</h1>
      <p class="muted">Опитайте с друга форма на името или изберете от най-търсените.</p><div class="chips">${chips(popular)}</div>${UI.adBlock('ad-inline', 'Реклама')}` });
    return;
  }
  const h = hits[0];
  const meaning = CT.MEANINGS[name];
  const custom = CT.CUSTOMS_BY_TITLE[h.title] || CT.GENERIC_CUSTOM;
  const holiday = CT.holByTitle(h.title);
  const text = `Честит имен ден, ${name}! На много години!`;
  const wishes = CT.WISHES.imenden.map((w) => w.replace(/\{name\}/g, name));
  const wishCard = (w) => `<div class="wish"><p>${UI.esc(w)}</p><div class="share-row"><button class="btn ghost sm" data-copy="${UI.esc(w)}">${I.copy}Копирай</button>${UI.shareLinks(w)}</div></div>`;
  const others = hits.slice(1).filter((x) => x.title !== h.title);

  UI.mount('names', {
    title: `Имен ден на ${name} – ${BG.fmt(h.date)} ${h.date.getFullYear()}`,
    main: `${crumbs}
    <header class="hero"><h1>Имен ден на ${UI.esc(name)}</h1>
      <div class="date-line"><span class="date-pill num">${I.name}${BG.fmt(h.date)} ${h.date.getFullYear()}</span><span class="muted">${BG.WEEKDAYS[h.date.getDay()]} · ${UI.daysAway(h.days)}</span></div>
      <div class="chips"><span class="tag name">${I.name}Имен ден</span>${holiday && holiday.type !== 'national' ? `<span class="tag church">${I.church}Църковен празник</span>` : ''}${BG.offName(h.date) ? `<span class="tag dayoff">${I.dayoff}Почивен ден</span>` : ''}</div>
      <div class="share-row"><button class="btn ghost sm" data-copy="${UI.esc(text)}">${I.copy}Копирай поздрав</button>${UI.shareLinks(text)}</div>
    </header>
    <section><h2 style="margin-bottom:10px">Кой празнува на ${BG.fmt(h.date)}</h2>
      <p class="muted" style="margin-bottom:12px">${UI.esc(h.title)}${holiday ? ` – <a href="praznik.html?id=${holiday.id}" data-go="id=${holiday.id}">за празника</a>` : ''}</p>
      <div class="chips">${chips(h.names)}</div>${others.length ? `<p class="muted" style="margin-top:12px">${UI.esc(name)} има имен ден и на: ${others.map((o) => `${BG.fmt(o.date)} (${UI.esc(o.title)})`).join(', ')}.</p>` : ''}</section>
    <section class="prose"><h2>Значение на името</h2><p>${meaning ? UI.esc(meaning) : 'Значението на това име ще бъде добавено скоро.'}</p></section>
    ${UI.adBlock('ad-inline', 'Реклама · между блоковете')}
    <section class="prose"><h2>Обичаи и традиции</h2><p>${UI.esc(custom)}</p></section>
    <section><div class="sec-h"><h2>Пожелания за имен ден</h2><a href="pozhelaniya.html" data-go="cat=imenden">Още пожелания</a></div><div class="wishes">${wishes.map(wishCard).join('')}</div></section>
    <section><h2 style="margin-bottom:10px">Други имена</h2><div class="chips">${chips(popular.filter((n) => n !== name))}</div></section>`,
  });
})();
