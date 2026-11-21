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
  const shown = detailed.slice(0, 6);
  const nameSec = shown.map((n) => {
    const { others, meaning } = info(n);
    const od = others.map((o) => `${BG.fmt(RT.groupDate(o, y))} (<a href="${R.group(o.slug, 'ime-' + RT.slug(n))}">${UI.esc(o.title)}</a>)`).join(', ');
    return `<article id="ime-${RT.slug(n)}" class="name-card"><h3>Имен ден на ${UI.esc(n)}</h3>
      ${od ? `<p>Празнува и на ${od}.</p>` : ''}${meaning ? `<p>${UI.esc(meaning)}</p>` : ''}</article>`;
  }).join('');
  const chipList = g.names.map((n) => (shown.includes(n) ? `<a class="chip" href="#ime-${RT.slug(n)}">${UI.esc(n)}</a>` : `<span class="chip" id="ime-${RT.slug(n)}">${UI.esc(n)}</span>`)).join('');
  const custom = CT.CUSTOMS_BY_TITLE[g.title] || '';
  const text = `Честит имен ден! ${g.title} – ${BG.fmt(date)}. Имен ден имат: ${g.names.slice(0, 6).join(', ')}.`;
  const years = BG.YEARS.map((yy) => { const d = RT.groupDate(g, yy); return `<tr><td class="dt">${yy}</td><td>${BG.fmt(d)}, ${BG.WEEKDAYS[d.getDay()]}</td><td>${BG.offName(d) ? 'Почивен ден' : BG.isWeekend(d) ? 'Уикенд' : 'Работен ден'}</td></tr>`; }).join('');
  const near = RT.GROUPS.filter((x) => x.slug !== g.slug).slice().sort((a, b) => Math.abs(RT.groupDate(a, y) - date) - Math.abs(RT.groupDate(b, y) - date)).slice(0, 4);


  // --- допълнителен, различен за всяка страница текст от данните ---
  const dayName = (d) => BG.WEEKDAYS[d.getDay()];
  const statusOf = (d) => (BG.offName(d) ? 'почивен ден' : BG.isWeekend(d) ? 'уикенд' : 'работен ден');
  const same = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  const fastOf = (d) => {
    const e = BG.easter(d.getFullYear()), Y = d.getFullYear();
    const inR = (a, b) => d >= a && d <= b;
    if (inR(BG.addDays(e, -48), BG.addDays(e, -1))) return 'Великия (Великденския) пост';
    if (inR(BG.addDays(e, 57), new Date(Y, 5, 28))) return 'Петровите заговезни (Апостолския пост)';
    if (inR(new Date(Y, 7, 1), new Date(Y, 7, 14))) return 'Успенския пост';
    if (inR(new Date(Y, 10, 15), new Date(Y, 11, 24))) return 'Коледния пост';
    return '';
  };
  const yrs = BG.YEARS.map((yy) => ({ yy, d: RT.groupDate(g, yy) }));
  const cnt = { w: 0, we: 0, off: 0 };
  yrs.forEach(({ d }) => { if (BG.offName(d)) cnt.off++; else if (BG.isWeekend(d)) cnt.we++; else cnt.w++; });
  const fast = fastOf(date);
  const around = CT.events(date.getFullYear()).concat(CT.events(date.getFullYear() + 1)).concat(CT.events(date.getFullYear() - 1))
    .filter((e) => !e.types.includes('clock') && !e.types.includes('equinox') && !e.types.includes('fast') && e.title !== g.title && !same(e.date, date))
    .map((e) => ({ e, diff: Math.round((e.date - date) / 864e5) })).filter((o) => Math.abs(o.diff) <= 14).sort((a, b) => Math.abs(a.diff) - Math.abs(b.diff)).slice(0, 3)
    .sort((a, b) => a.diff - b.diff);
  const rel = (n) => (n < 0 ? `${-n} ${-n === 1 ? 'ден' : 'дни'} преди` : `${n} ${n === 1 ? 'ден' : 'дни'} след`);
  const aroundHtml = around.map(({ e, diff }) => `<li><b>${BG.fmt(e.date)}</b> – ${UI.esc(e.title)} (${rel(diff)})</li>`).join('');
  const pool = CT.wishList('imenden', null, 120);
  const gi = RT.GROUPS.findIndex((x) => x.slug === g.slug);
  const pick = [0, 1, 2, 3, 4].map((k) => pool[(gi * 7 + k * 13) % pool.length]).filter((w, i, a) => w && a.indexOf(w) === i);
    const extraHtml = `<section class="prose"><h2>Кога се пада празникът</h2>
    <p>През ${date.getFullYear()} г. ${UI.esc(g.title)} е в ${dayName(date)} и е ${statusOf(date)}. През периода ${BG.YEARS[0]}–${BG.YEARS[BG.YEARS.length - 1]} датата ${g.movable ? 'се мести заедно с Великден и пада в различни дни и месеци' : `остава ${BG.fmt(date)}, но денят от седмицата се сменя`}: ${cnt.w} пъти е в работен ден, ${cnt.we} в уикенд${cnt.off ? ` и ${cnt.off} пъти е официален почивен ден` : ''}.</p>
    <p>${fast ? `Датата попада в периода на ${fast}, затова трапезата по традиция е постна – без месо, яйца и млечни продукти.` : 'Датата не попада в постен период, затова трапезата може да е обичайната празнична.'}</p></section>
    ${aroundHtml ? `<section class="prose"><h2>Какво има около този ден</h2><p>Ето най-близките празници и имени дни до ${BG.fmt(date)}:</p><ul>${aroundHtml}</ul></section>` : ''}
    ${pick.length ? `<section class="prose"><h2>Пожелания за имен ден</h2>${pick.map((w) => `<blockquote>${UI.esc(w.t.replace(/\{name\}/g, main1)).replace(/\n/g, '<br>')}</blockquote>`).join('')}</section>` : ''}`;

  UI.mount('names', {
    title: `Имен ден на ${shortList} – ${g.title}`,
    year: date.getFullYear(), month: date.getMonth(),
    main: `<div class="crumbs"><a href="${R.home()}">Начало</a> / <a href="${R.names()}">Имени дни</a> / ${UI.esc(g.title)}</div>
    <header class="hero"><h1>${UI.esc(g.title)} – имен ден на ${UI.esc(g.names.slice(0, 4).join(', '))}</h1><p class="answer">${UI.esc(g.title)} е на <b>${BG.fmt(date)} ${date.getFullYear()}</b> (${wd}). Имен ден имат: ${UI.esc(g.names.slice(0, 8).join(', '))}${g.names.length > 8 ? `<span id="nm-more" hidden>, ${UI.esc(g.names.slice(8).join(', '))}</span> <button type="button" class="btn ghost sm more-names" id="nm-btn" data-n="${g.names.length}" aria-expanded="false" aria-controls="nm-more">Покажи всички имена (${g.names.length})</button>` : ''}.</p>
      <div class="date-line"><span class="date-pill num">${I.name}${BG.fmt(date)} ${date.getFullYear()}</span><span class="muted">${wd} · ${UI.daysAway(days)}</span></div>
      <div class="chips"><span class="tag name">${I.name}Имен ден</span>${holiday && holiday.type === 'church' ? `<span class="tag church">${I.church}Църковен празник</span>` : ''}${BG.offName(date) ? `<span class="tag dayoff">${I.dayoff}Почивен ден</span>` : ''}</div>
      <div class="share-row"><button class="btn ghost sm" data-copy="${UI.esc(text)}">${I.copy}Копирай поздрав</button>${UI.shareLinks(text)}</div></header>
    <section class="prose"><h2>За празника</h2><p>${UI.esc((window.NAME_DESC && window.NAME_DESC[g.title]) || `${g.title} се отбелязва на ${BG.fmt(date)} по църковния календар.`)}</p></section>
    ${holiday ? `<p class="muted">Повече за празника: <a href="${R.holiday(holiday.id)}">${UI.esc(holiday.title)}</a>.</p>` : ''}
    <section><h2 style="margin-bottom:10px">Кой има имен ден</h2><div class="chips">${chipList}</div></section>
    ${nameSec ? `<section><h2 style="margin-bottom:10px">За някои от имената</h2><div class="name-cards">${nameSec}</div></section>` : ''}
    ${custom ? `<section class="prose"><h2>Обичаи и традиции</h2><p>${UI.esc(custom)}</p></section>` : ''}
    ${extraHtml}
    <p><a class="btn ghost sm" href="${R.wishes('imenden')}">Още пожелания за имен ден</a></p>
    <section><h2 style="margin-bottom:10px">${UI.esc(g.title)} през годините</h2><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Година</th><th>Дата</th><th>Ден</th></tr></thead><tbody>${years}</tbody></table></div></section>
    <section><h2 style="margin-bottom:10px">Други имени дни наблизо</h2><div class="chips">${near.map((x) => `<a class="chip" href="${R.group(x.slug)}">${UI.esc(x.title)}</a>`).join('')}</div></section>`,
  });
  const nb = document.getElementById('nm-btn');
  if (nb) nb.addEventListener('click', () => {
    const more = document.getElementById('nm-more'), open = more.hidden;
    more.hidden = !open;
    nb.setAttribute('aria-expanded', String(open));
    nb.textContent = open ? 'Скрий' : `Покажи всички имена (${nb.dataset.n})`;
  });
  if (location.hash) { const t = document.getElementById(decodeURIComponent(location.hash.slice(1))); if (t) t.scrollIntoView(); }
})();
