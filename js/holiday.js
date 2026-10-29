(function () {
  const now = new Date(), I = UI.ICON;
  const def = CT.holById(UI.param('id')) || CT.holById('velikden');
  let y = parseInt(UI.param('year'), 10);
  if (!BG.YEARS.includes(y)) { y = now.getFullYear(); if (def.date(y) < ND.startOfDay(now)) y++; if (!BG.YEARS.includes(y)) y = BG.YEARS[0]; }
  const date = def.date(y);
  const wd = BG.WEEKDAYS[date.getDay()];

  // почивни дни около празника
  let a = date, b = date;
  if (BG.isOff(date)) { while (BG.isOff(BG.addDays(a, -1))) a = BG.addDays(a, -1); while (BG.isOff(BG.addDays(b, 1))) b = BG.addDays(b, 1); }
  const len = Math.round((b - a) / 864e5) + 1;
  const from = BG.addDays(a, -2), to = BG.addDays(b, 2);
  const names = [...new Set(ND.onDate(date).flatMap((e) => e.names))];
  const wishes = (CT.WISHES[def.wishKey] || CT.WISHES.nacionalen).map((w) => w.replace(/\{name\}/g, ''));
  const text = `${def.title} ${y} е на ${BG.fmt(date)}. kalendarat.com`;
  const wishCard = (w) => `<div class="wish"><p>${UI.esc(w)}</p><div class="share-row"><button class="btn ghost sm" data-copy="${UI.esc(w)}">${I.copy}Копирай</button>${UI.shareLinks(w)}</div></div>`;
  const yearChips = BG.YEARS.map((yy) => `<a class="chip tab${yy === y ? ' on' : ''}" href="praznik.html?id=${def.id}&year=${yy}" data-go="id=${def.id}" data-y="${yy}">${yy}</a>`).join('');
  const other = CT.HOLIDAYS.filter((h) => h.id !== def.id).slice(0, 8);

  UI.mount('praznici', {
    title: `${def.title} ${y}`,
    year: y,
    main: `<div class="crumbs"><a href="index.html">Начало</a> / <a href="praznici.html">Празници</a> / ${UI.esc(def.title)}</div>
    <header class="hero"><h1>${UI.esc(def.title)} ${y}</h1>
      <div class="date-line"><span class="date-pill num">${I[def.type === 'church' ? 'church' : 'dayoff']}${date.getDate()} ${BG.MONTHS_GEN[date.getMonth()]} ${y}</span><span class="muted">${wd[0].toUpperCase() + wd.slice(1)} · ${UI.daysAway(Math.round((date - ND.startOfDay(now)) / 864e5)).replace('след -', 'преди ')}</span></div>
      <div class="chips">${def.type === 'church' ? `<span class="tag church">${I.church}Църковен празник</span>` : ''}${BG.offName(date) ? `<span class="tag dayoff">${I.dayoff}Почивен ден</span>` : '<span class="tag national">Не е почивен ден</span>'}</div>
      <div class="share-row">${UI.shareLinks(text)}</div>
      <div class="chips" aria-label="Година">${yearChips}</div></header>
    <section class="prose"><p>${UI.esc(def.intro)}</p></section>
    <section><h2 style="margin-bottom:10px">Почивни дни около празника</h2>
      ${BG.isOff(date) ? `<p style="margin-bottom:12px"><b>${len} дни почивка подред</b>: от ${BG.fmt(a)} до ${BG.fmt(b)}.</p>` : `<p style="margin-bottom:12px">През ${y} г. празникът е в ${wd} и не е почивен ден.</p>`}
      ${W.strip(from, to)}<div class="legend" style="margin-top:10px"><span><i class="sw dayoff"></i>Празник</span><span><i class="sw we"></i>Уикенд</span></div></section>
    ${UI.adBlock('ad-inline', 'Реклама · между блоковете')}
    <section class="prose"><h2>Обичаи и традиции</h2><ul>${def.customs.map((c) => `<li>${UI.esc(c)}</li>`).join('')}</ul></section>
    ${names.length ? `<section><h2 style="margin-bottom:10px">Имен ден имат</h2><div class="chips">${names.map((n) => `<a class="chip" href="imen-den.html?name=${encodeURIComponent(n)}" data-go="name=${UI.esc(n)}">${UI.esc(n)}</a>`).join('')}</div></section>` : ''}
    <section><div class="sec-h"><h2>Пожелания</h2><a href="pozhelaniya.html" data-go="cat=${def.wishKey === 'imenden' ? 'imenden' : def.wishKey}">Още пожелания</a></div><div class="wishes two">${wishes.map(wishCard).join('')}</div></section>
    <section><h2 style="margin-bottom:10px">Датата през годините</h2><div class="tbl-wrap"><table class="tbl"><tbody>${BG.YEARS.map((yy) => `<tr><td class="dt">${yy}</td><td>${BG.fmt(def.date(yy))}, ${BG.WEEKDAYS[def.date(yy).getDay()]}</td></tr>`).join('')}</tbody></table></div></section>
    <section><h2 style="margin-bottom:10px">Други празници</h2><div class="chips">${other.map((h) => `<a class="chip" href="praznik.html?id=${h.id}" data-go="id=${h.id}">${UI.esc(h.title)}</a>`).join('')}</div></section>`,
  });
  document.querySelectorAll('a[data-y]').forEach((el) => el.addEventListener('click', (e) => { e.preventDefault(); UI.store.set('p_year', el.dataset.y); UI.go('praznik.html', 'id', def.id); }));
})();
