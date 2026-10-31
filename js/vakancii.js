// Ученически ваканции 2026/2027 – по графика на МОН
(function () {
  const now = new Date(), today = ND.startOfDay(now), R = RT.R;
  const nextIdx = CT.VAC.findIndex((v) => v.to >= today);
  const days = (v) => Math.round((v.to - v.from) / 864e5) + 1;
  const range = (v) => (+v.from === +v.to ? BG.fmtFull(v.from) : `${BG.fmtFull(v.from)} – ${BG.fmtFull(v.to)}`);
  const vacs = CT.VAC.filter((v) => v.kind === 'vac'), non = CT.VAC.filter((v) => v.kind === 'noschool');
  const rows = (list, mark) => list.map((v) => `<tr${mark && v === CT.VAC[nextIdx] ? ' style="background:var(--purple-soft)"' : ''}><td data-l="Ваканция"><b>${UI.esc(v.name)}</b>${mark && v === CT.VAC[nextIdx] ? '<span class="badge-next">Следва</span>' : ''}</td><td class="dt" data-l="От">${BG.fmtFull(v.from)}</td><td class="dt" data-l="До">${BG.fmtFull(v.to)}</td><td data-l="Класове">${UI.esc(v.grades)}</td><td data-l="Дни" class="num">${days(v)}</td></tr>`).join('');
  const nxt = CT.VAC[nextIdx];
  const answer = nxt ? `Следващата ваканция е <b>${UI.esc(nxt.name.toLowerCase())}</b>: ${range(nxt)} (${UI.daysAway(Math.round((nxt.from - today) / 864e5))}). През учебната 2026/2027 г. ваканциите са: есенна, коледна, междусрочна и пролетна.` : 'Учебната 2026/2027 година приключва.';
  const spring = vacs.filter((v) => v.name === 'Пролетна ваканция');
  const faq = [
    ['Кога е следващата ученическа ваканция?', nxt ? `${nxt.name}: ${range(nxt)} (${nxt.grades}).` : 'Няма предстоящи ваканции през тази учебна година.'],
    ['Кога е коледната ваканция през 2026/2027 г.?', `Коледната ваканция е от 24 декември 2026 г. до 3 януари 2027 г. включително (${days(vacs[1])} дни), за I–XII клас.`],
    ['Кога започва вторият учебен срок?', 'Вторият учебен срок започва на 3 февруари 2027 г. за I–XII клас. Преди това е междусрочната ваканция от 30 януари до 2 февруари 2027 г.'],
    ['Кога е пролетната ваканция през 2027 г.?', `За I–XI клас пролетната ваканция е от ${BG.fmt(spring[0].from)} до ${BG.fmt(spring[0].to)} 2027 г. (${days(spring[0])} дни), а за XII клас – от ${BG.fmt(spring[1].from)} до ${BG.fmt(spring[1].to)} 2027 г.`],
    ['Кога свършва учебната година?', 'Вторият учебен срок свършва на 13 май 2027 г. за XII клас, на 2 юни за I–III клас, на 16 юни за IV–VI клас и на 2 юли за VII–XI клас.'],
    ['Кои са неучебните дни през май и юни 2027 г.?', 'Неучебни дни за I–XI клас са 5 и 7 май (сливане на празниците), 19 и 21 май (държавни зрелостни изпити) и 25 май. Неучебни за VII–XI клас са още 18 и 21 юни (НВО).'],
  ];
  UI.mount('vac', {
    title: 'Ученически ваканции 2026/2027',
    year: 2027, month: 0,
    main: `<div class="crumbs"><a href="${R.home()}">Начало</a> / Ваканции</div>
    <header class="hero"><h1>Ученически ваканции 2026/2027 – график по класове</h1><p class="answer">${answer}</p>
      <p class="muted" style="max-width:64ch">Официалният график на Министерството на образованието и науката (МОН): ваканции, неучебни дни и начало и край на учебните срокове по класове.</p>
      <div class="chips"><span class="chip tab on">2026/2027</span><span class="chip tab" style="opacity:.6">2027/2028 – очаква се</span></div></header>
    <section><h2 style="margin-bottom:12px">Ваканции</h2><div class="tbl-wrap"><table class="tbl stack"><thead><tr><th>Ваканция</th><th>От</th><th>До</th><th>Класове</th><th>Дни</th></tr></thead><tbody>${rows(vacs, true)}</tbody></table></div></section>
    <section><h2 style="margin-bottom:12px">Неучебни дни</h2><div class="tbl-wrap"><table class="tbl stack"><thead><tr><th>Повод</th><th>От</th><th>До</th><th>Класове</th><th>Дни</th></tr></thead><tbody>${rows(non, true)}</tbody></table></div></section>
    ${UI.adBlock('ad-inline', 'Реклама · между блоковете')}
    <section><h2 style="margin-bottom:12px">Начало и край на учебните срокове</h2><div class="tbl-wrap"><table class="tbl stack"><thead><tr><th>Събитие</th><th>Дата</th><th>Класове</th></tr></thead><tbody>${CT.TERMS.map((t) => `<tr><td data-l="Събитие"><b>${UI.esc(t.title)}</b></td><td class="dt" data-l="Дата">${BG.fmtFull(t.date)}</td><td data-l="Класове">${UI.esc(t.grades)}</td></tr>`).join('')}</tbody></table></div></section>
    <section><h2 style="margin-bottom:10px">Често задавани въпроси</h2><div class="faq">${faq.map(([q, an]) => `<div><h3>${UI.esc(q)}</h3><p>${UI.esc(an)}</p></div>`).join('')}</div></section>
    <p class="notice">Източник: графикът на учебното време за 2026/2027 г. по заповед на министъра на образованието и науката, публикуван на <a href="https://www.mon.bg/dyasno-menyu/vakantsii/" rel="noopener" target="_blank">mon.bg</a>. Дати за лятната ваканция по класове ще добавим при публикуването им. Графикът може да бъде променен със заповед – проверявайте на сайта на МОН. Вижте още: <a href="${R.days()}">почивни дни ${RT.DEFAULT_YEAR}</a> и <a href="${R.holidays()}">празници</a>.</p>`,
  });
})();
