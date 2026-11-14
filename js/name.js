// Страница за имен ден: празник + всички имена, които го празнуват
(function () {
  const now = new Date(), today = ND.startOfDay(now), I = UI.ICON, R = RT.R;
  const g = RT.groupBySlug(UI.param('slug')) || RT.GROUPS[2];
  let y = now.getFullYear(); let date = RT.groupDate(g, y); if (date < today) { y++; date = RT.groupDate(g, y); }
  const days = Math.round((date - today) / 864e5);
  const holiday = CT.holByTitle(g.title) || null;
  const main1 = g.names[0];
  const wd = BG.WEEKDAYS[date.getDay()];
  const shortList = g.names.slice(0, 3).join(', ');
  // подробна карта само когато има значение на името или други дати; останалите имена са в списъка отгоре
  const info = (n) => ({ others: RT.groupsFor(n).filter((x) => x.slug !== g.slug), meaning: CT.MEANINGS[n] });
  const detailed = g.names.filter((n) => { const i = info(n); return i.meaning || i.others.length; });
  const nameSec = detailed.map((n) => {
    const { others, meaning } = info(n);
    const od = others.map((o) => `${BG.fmt(RT.groupDate(o, y))} (<a href="${R.group(o.slug, 'ime-' + RT.slug(n))}">${UI.esc(o.title)}</a>)`).join(', ');
    return `<article id="ime-${RT.slug(n)}" class="name-card"><h3>Имен ден на ${UI.esc(n)}</h3>
      ${od ? `<p>Празнува и на ${od}.</p>` : ''}${meaning ? `<p>${UI.esc(meaning)}</p>` : ''}</article>`;
  }).join('');
  const chipList = g.names.map((n) => (detailed.includes(n) ? `<a class="chip" href="#ime-${RT.slug(n)}">${UI.esc(n)}</a>` : `<span class="chip" id="ime-${RT.slug(n)}">${UI.esc(n)}</span>`)).join('');
  const custom = CT.CUSTOMS_BY_TITLE[g.title] || '';
  const text = `Честит имен ден! ${g.title} – ${BG.fmt(date)}. Имен ден имат: ${g.names.slice(0, 6).join(', ')}.`;
  const years = BG.YEARS.map((yy) => { const d = RT.groupDate(g, yy); return `<tr><td class="dt">${yy}</td><td>${BG.fmt(d)}, ${BG.WEEKDAYS[d.getDay()]}</td><td>${BG.offName(d) ? 'Почивен ден' : BG.isWeekend(d) ? 'Уикенд' : 'Работен ден'}</td></tr>`; }).join('');
  const near = RT.GROUPS.filter((x) => x.slug !== g.slug).slice().sort((a, b) => Math.abs(RT.groupDate(a, y) - date) - Math.abs(RT.groupDate(b, y) - date)).slice(0, 6);

  UI.mount('names', {
    title: `Имен ден на ${shortList} – ${g.title}`,
    year: date.getFullYear(), month: date.getMonth(),
    main: `<div class="crumbs"><a href="${R.home()}">Начало</a> / <a href="${R.names()}">Имени дни</a> / ${UI.esc(g.title)}</div>
    <header class="hero"><h1>${UI.esc(g.title)} – имен ден на ${UI.esc(g.names.slice(0, 4).join(', '))}</h1><p class="answer">${UI.esc(g.title)} е на <b>${BG.fmt(date)} ${date.getFullYear()}</b> (${wd}). Имен ден имат: ${UI.esc(g.names.join(', '))}.</p>
      <div class="date-line"><span class="date-pill num">${I.name}${BG.fmt(date)} ${date.getFullYear()}</span><span class="muted">${wd} · ${UI.daysAway(days)}</span></div>
      <div class="chips"><span class="tag name">${I.name}Имен ден</span>${holiday && holiday.type === 'church' ? `<span class="tag church">${I.church}Църковен празник</span>` : ''}${BG.offName(date) ? `<span class="tag dayoff">${I.dayoff}Почивен ден</span>` : ''}</div>
      <div class="share-row"><button class="btn ghost sm" data-copy="${UI.esc(text)}">${I.copy}Копирай поздрав</button>${UI.shareLinks(text)}</div></header>
    ${holiday ? `<p class="muted">Повече за празника: <a href="${R.holiday(holiday.id)}">${UI.esc(holiday.title)}</a>.</p>` : ''}
    <section><h2 style="margin-bottom:10px">Кой има имен ден</h2><div class="chips">${chipList}</div></section>
    ${nameSec ? `<section><h2 style="margin-bottom:10px">За някои от имената</h2><div class="name-cards">${nameSec}</div></section>` : ''}
    ${custom ? `<section class="prose"><h2>Обичаи и традиции</h2><p>${UI.esc(custom)}</p></section>` : ''}
    <p><a class="btn ghost sm" href="${R.wishes('imenden')}">Пожелания за имен ден</a></p>
    <section><h2 style="margin-bottom:10px">${UI.esc(g.title)} през годините</h2><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Година</th><th>Дата</th><th>Ден</th></tr></thead><tbody>${years}</tbody></table></div></section>
    <section><h2 style="margin-bottom:10px">Други имени дни наблизо</h2><div class="chips">${near.map((x) => `<a class="chip" href="${R.group(x.slug)}">${UI.esc(x.title)}</a>`).join('')}</div></section>`,
  });
  if (location.hash) { const t = document.getElementById(decodeURIComponent(location.hash.slice(1))); if (t) t.scrollIntoView(); }
})();
