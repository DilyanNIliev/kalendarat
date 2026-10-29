// Страница за празник
(function () {
  const now = new Date(), I = UI.ICON, R = RT.R;
  const def = CT.holById(UI.param('id')) || CT.holById('velikden');
  let y = parseInt(UI.param('year') || location.hash.slice(1), 10);
  if (!BG.YEARS.includes(y)) { y = now.getFullYear(); if (def.date(y) < ND.startOfDay(now)) y++; if (!BG.YEARS.includes(y)) y = BG.YEARS[0]; }
  const date = def.date(y);
  const wd = BG.WEEKDAYS[date.getDay()];

  let a = date, b = date;
  if (BG.isOff(date)) { while (BG.isOff(BG.addDays(a, -1))) a = BG.addDays(a, -1); while (BG.isOff(BG.addDays(b, 1))) b = BG.addDays(b, 1); }
  const len = Math.round((b - a) / 864e5) + 1;
  const from = BG.addDays(a, -2), to = BG.addDays(b, 2);
  const grp = RT.GROUPS.find((g) => g.title === def.title);
  const names = [...new Set(ND.onDate(date).flatMap((e) => e.names))];
  const wishes = CT.wishList(def.wishKey, null, 6).map((w) => ({ t: w.t.replace(/\{name\}/g, 'приятелю'), c: w.c }));
  const text = `${def.title} ${y} е на ${BG.fmt(date)}. kalendarat.com`;
  const wishCard = (w) => `<div class="wish"><span class="tag national">${CT.CATS[w.c]}</span><p>${UI.esc(w.t).replace(/\n/g, '<br>')}</p><div class="share-row"><button class="btn ghost sm" data-copy="${UI.esc(w.t)}">${I.copy}Копирай</button>${UI.shareLinks(w.t)}</div></div>`;
  const yearChips = BG.YEARS.map((yy) => `<button type="button" class="chip tab${yy === y ? ' on' : ''}" data-y="${yy}" aria-pressed="${yy === y}">${yy}</button>`).join('');
  const other = CT.HOLIDAYS.filter((h) => h.id !== def.id).slice(0, 10);
  const off = BG.offName(date);
  const faq = [
    [`Кога е ${def.title} през ${y} г.?`, `${def.title} през ${y} г. е на ${BG.fmt(date)}, ${wd}.`],
    [`${def.title} почивен ден ли е?`, off ? `Да, ${BG.fmt(date)} ${y} е официален почивен ден.${len > 1 ? ` Заедно със събота и неделя почивката е ${len} дни подред (${BG.fmt(a)} – ${BG.fmt(b)}).` : ''}` : `Не, през ${y} г. ${def.title} не е официален почивен ден (${wd}).`],
    [`Какви са обичаите за ${def.title}?`, def.customs.slice(0, 2).join(' ')],
  ];

  UI.mount('praznici', {
    title: `${def.title} ${y}`,
    year: y, month: date.getMonth(),
    main: `<div class="crumbs"><a href="${R.home()}">Начало</a> / <a href="${R.holidays()}">Празници</a> / ${UI.esc(def.title)}</div>
    <header class="hero"><h1>${UI.esc(def.title)} ${y} – дата, почивни дни и обичаи</h1>
      <div class="date-line"><span class="date-pill num">${I[def.type === 'church' ? 'church' : 'dayoff']}${date.getDate()} ${BG.MONTHS_GEN[date.getMonth()]} ${y}</span><span class="muted">${wd[0].toUpperCase() + wd.slice(1)} · ${UI.daysAway(Math.round((date - ND.startOfDay(now)) / 864e5)).replace('след -', 'преди ')}</span></div>
      <div class="chips">${def.type === 'church' ? `<span class="tag church">${I.church}Църковен празник</span>` : ''}${off ? `<span class="tag dayoff">${I.dayoff}Почивен ден</span>` : '<span class="tag national">Не е почивен ден</span>'}</div>
      <div class="share-row">${UI.shareLinks(text)}</div>
      <div class="chips" role="group" aria-label="Година">${yearChips}</div></header>
    <section class="prose"><p>${UI.esc(def.intro)}</p></section>
    <section><h2 style="margin-bottom:10px">Почивни дни около празника</h2>
      ${BG.isOff(date) ? `<p style="margin-bottom:12px"><b>${len} дни почивка подред</b>: от ${BG.fmt(a)} до ${BG.fmt(b)}.</p>` : `<p style="margin-bottom:12px">През ${y} г. празникът е в ${wd} и не е почивен ден.</p>`}
      ${W.strip(from, to)}<div class="legend" style="margin-top:10px"><span><i class="sw dayoff"></i>Празник</span><span><i class="sw we"></i>Уикенд</span></div></section>
    ${UI.adBlock('ad-inline', 'Реклама · между блоковете')}
    <section class="prose"><h2>Обичаи и традиции</h2><ul>${def.customs.map((c) => `<li>${UI.esc(c)}</li>`).join('')}</ul></section>
    ${names.length ? `<section><h2 style="margin-bottom:10px">Имен ден имат</h2><div class="chips">${names.map((n) => `<a class="chip" href="${RT.nameHref(n)}">${UI.esc(n)}</a>`).join('')}</div>${grp ? `<p style="margin-top:10px"><a href="${R.group(grp.slug)}">Всички имени дни за ${UI.esc(def.title)}</a></p>` : ''}</section>` : ''}
    <section><div class="sec-h"><h2>Пожелания за ${UI.esc(def.title)}</h2><a href="${R.wishes(def.wishKey)}">Още пожелания</a></div><div class="wishes two">${wishes.map(wishCard).join('')}</div></section>
    <section><h2 style="margin-bottom:10px">${UI.esc(def.title)} през годините</h2><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Година</th><th>Дата</th></tr></thead><tbody>${BG.YEARS.map((yy) => `<tr><td class="dt">${yy}</td><td>${BG.fmt(def.date(yy))}, ${BG.WEEKDAYS[def.date(yy).getDay()]}</td></tr>`).join('')}</tbody></table></div></section>
    <section><h2 style="margin-bottom:10px">Често задавани въпроси</h2><div class="faq">${faq.map(([q, an]) => `<div><h3>${UI.esc(q)}</h3><p>${UI.esc(an)}</p></div>`).join('')}</div></section>
    <section><h2 style="margin-bottom:10px">Други празници</h2><div class="chips">${other.map((h) => `<a class="chip" href="${R.holiday(h.id)}">${UI.esc(h.title)}</a>`).join('')}</div></section>`,
  });
  document.querySelectorAll('button[data-y]').forEach((el) => el.addEventListener('click', () => { location.hash = el.dataset.y; location.reload(); }));
})();
