(function () {
  const now = new Date();
  const today = ND.startOfDay(now);
  const I = UI.ICON;
  const evToday = CT.events(now.getFullYear()).filter((e) => BG.key(e.date) === BG.key(now));
  const offToday = BG.offName(now);
  const weekend = BG.isWeekend(now);
  const holidays = evToday.filter((e) => !e.types.includes('name'));
  const nameEv = evToday.filter((e) => e.types.includes('name'));
  const names = [...new Set(nameEv.flatMap((e) => e.names))];
  const vacNow = CT.VAC.find((v) => v.from <= today && v.to >= today);

  const wd = BG.WEEKDAYS[now.getDay()];
  const heading = holidays.length ? `Днес е <span>${UI.esc(holidays[0].title)}</span>` : `Днес е <span>${wd}</span>`;
  const fact = (cls, icon, label, val) => `<div class="fact"><div class="ic ${cls}">${I[icon]}</div><div><b>${label}</b><span>${val}</span></div></div>`;
  const nameChips = (list) => list.map((n) => `<a class="chip" href="imen-den.html?name=${encodeURIComponent(n)}" data-go="name=${UI.esc(n)}">${UI.esc(n)}</a>`).join('');

  const shareText = `Днес е ${now.getDate()} ${BG.MONTHS_GEN[now.getMonth()]}` + (holidays.length ? ` – ${holidays[0].title}` : '') + '. Календарът';
  const todayHtml = `<section class="today" aria-labelledby="today-h">
      <div class="today-date"><div class="d num">${now.getDate()}</div><div><div class="m">${BG.MONTHS_GEN[now.getMonth()]} ${now.getFullYear()}</div><div class="w">${wd[0].toUpperCase() + wd.slice(1)}</div></div></div>
      <div class="today-body">
        <h1 id="today-h">${heading}</h1>
        <div class="facts">
          ${fact('dayoff', 'dayoff', 'Почивен ден', offToday ? `Да – ${UI.esc(offToday)}` : weekend ? 'Да – уикенд' : 'Не, работен ден')}
          ${fact('church', 'church', 'Празник', holidays.length ? holidays.map((h) => UI.esc(h.title)).join(', ') : 'Няма отбелязан празник')}
          ${fact('name', 'name', 'Имен ден', names.length ? names.slice(0, 8).map(UI.esc).join(', ') : 'Днес не се празнува имен ден')}
          ${vacNow ? fact('vac', 'vac', 'Ваканция', UI.esc(vacNow.name)) : ''}
        </div>
        <div class="actions"><a class="btn" href="pozhelaniya.html" data-go="cat=${names.length ? 'imenden' : 'rozhden'}">${I.heart}Виж пожелания</a>
          <span class="share-row">${UI.shareLinks(shareText)}</span></div>
      </div></section>`;

  // Сезонно отброяване (авто или чрез #christmas, #halloween ...)
  const seasonItem = Season.pick(now, location.hash.slice(1));
  const seasonHtml = Season.card(seasonItem);

  // Утре
  const tmr = BG.addDays(today, 1);
  const tmrNames = [...new Set(ND.onDate(tmr).flatMap((e) => e.names))];
  let nextND = null;
  if (!tmrNames.length) for (let d = BG.addDays(tmr, 1), i = 0; i < 120 && !nextND; i++, d = BG.addDays(d, 1)) { const o = ND.onDate(d); if (o.length) nextND = { d, o }; }
  const tomorrowHtml = `<section aria-labelledby="tm-h"><div class="sec-h"><h2 id="tm-h">Утре имен ден имат…</h2><a href="imeni-dni.html">Всички имени дни</a></div>
    ${tmrNames.length ? `<div class="chips">${nameChips(tmrNames)}</div>` : `<p class="muted" style="margin-bottom:10px">Утре (${BG.fmt(tmr)}) няма отбелязан имен ден. Най-близкият е на ${BG.fmt(nextND.d)} – ${UI.esc(nextND.o[0].title)}.</p><div class="chips">${nameChips([...new Set(nextND.o.flatMap((e) => e.names))].slice(0, 12))}</div>`}</section>`;

  // Обратно броене
  const br = CT.nextBreak(now);
  const nextWeekend = (() => { let d = tmr; while (d.getDay() !== 6) d = BG.addDays(d, 1); return d; })();
  const cdHtml = br ? `<section class="countdown" aria-labelledby="cd-h">
      <div class="lbl" id="cd-h">До следващата почивка остават</div>
      <div class="big num">${br.days}<small>${br.days === 1 ? 'ден' : 'дни'}</small></div>
      <p><b>${BG.fmt(br.start)} – ${BG.fmt(br.end)}</b> · ${br.len} дни почивка подред. Следващият уикенд е ${UI.daysAway(Math.round((nextWeekend - today) / 864e5))}.</p>
      ${W.strip(br.start, br.end)}
      <a class="btn" href="pochivni-dni.html" data-go="year=${br.start.getFullYear()}">Всички почивни дни ${I.arrow}</a></section>` : '';

  // Предстоящи 30 дни
  const end = BG.addDays(today, 30);
  const up = CT.between(today, end);
  CT.VAC.forEach((v) => { if (v.from >= today && v.from <= end) up.push({ date: v.from, title: v.name, types: [v.kind === 'vac' ? 'vac' : 'noschool'] }); });
  const seen = new Set();
  const upcoming = up.sort((a, b) => a.date - b.date).filter((e) => { const k = BG.key(e.date) + e.title; if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 10);
  const upHtml = `<section aria-labelledby="up-h"><div class="sec-h"><h2 id="up-h">Предстоящи празници – следващите 30 дни</h2><a href="praznici.html">Всички празници</a></div>
    <div class="cards">${upcoming.map((e) => W.eventCard(e, now)).join('')}</div></section>`;

  // Мостове 2027
  const ideas = BG.year(2027).ideas.slice().sort((a, b) => b.total / b.leave.length - a.total / a.leave.length || a.from - b.from).slice(0, 4).sort((a, b) => a.from - b.from);
  const bridgeHtml = `<section aria-labelledby="br-h"><div class="sec-h"><h2 id="br-h">Мостове 2027: повече почивка с по-малко отпуск</h2><a href="pochivni-dni.html" data-go="year=2027">Всички за 2027</a></div>
    <div class="bridges">${ideas.map(W.bridgeCard).join('')}</div>
    <div class="legend" style="margin-top:12px"><span><i class="sw dayoff"></i>Празник</span><span><i class="sw we"></i>Уикенд</span><span><i class="sw" style="background:var(--gold-soft);border:2px solid var(--gold)"></i>Ден за отпуск</span></div></section>`;

  // Ваканции
  const vacs = CT.VAC.filter((v) => v.to >= today).slice(0, 4);
  const vacHtml = `<section aria-labelledby="vc-h"><div class="sec-h"><h2 id="vc-h">Ученически ваканции 2026/2027</h2><a href="vakancii.html">Цялата таблица</a></div>
    <div class="timeline">${vacs.map((v, i) => `<div class="vrow${i === 0 ? ' next' : ''}"><div class="dd"><b>${v.from.getDate()}</b><small>${BG.MONTHS_GEN[v.from.getMonth()].slice(0, 3)}</small></div>
      <div><strong>${UI.esc(v.name)}${i === 0 ? '<span class="badge-next">Следва</span>' : ''}</strong><span>${BG.fmt(v.from)}${+v.from === +v.to ? '' : ' – ' + BG.fmt(v.to)} · ${v.grades}</span></div></div>`).join('')}</div></section>`;

  // Календар
  const calHtml = `<section aria-labelledby="cal-h"><div class="sec-h"><h2 id="cal-h">Календар</h2>${W.legend}</div>
    <div class="panel"><div class="cal-head"><button class="ibtn" id="prev" aria-label="Предишен месец">${I.left}</button><h3 id="cal-title"></h3><button class="ibtn" id="next" aria-label="Следващ месец">${I.right}</button></div>
    <div id="cal"></div><div class="day-detail" id="detail" aria-live="polite"></div></div></section>`;

  UI.mount('', {
    title: 'Календарът',
    main: todayHtml + seasonHtml + tomorrowHtml + cdHtml + upHtml + UI.adBlock('ad-inline', 'Реклама · между блоковете 300×250 / 728×90') + bridgeHtml + vacHtml + UI.adBlock('ad-inline', 'Реклама · между блоковете') + calHtml,
  });

  Season.start(document.querySelector('main'));
  let y = now.getFullYear(), m = now.getMonth();
  const draw = () => {
    document.getElementById('cal-title').textContent = BG.MONTHS[m] + ' ' + y;
    W.monthCal(document.getElementById('cal'), y, m, { clickable: true, detail: document.getElementById('detail') });
  };
  document.getElementById('prev').onclick = () => { m--; if (m < 0) { m = 11; y--; } draw(); };
  document.getElementById('next').onclick = () => { m++; if (m > 11) { m = 0; y++; } draw(); };
  draw();
})();
