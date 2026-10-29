(function () {
  const now = new Date(), today = ND.startOfDay(now), I = UI.ICON;
  const nextIdx = CT.VAC.findIndex((v) => v.to >= today);
  const days = (v) => Math.round((v.to - v.from) / 864e5) + 1;
  UI.mount('vac', {
    title: 'Ученически ваканции 2026/2027',
    main: `<div class="crumbs"><a href="index.html">Начало</a> / Ваканции</div>
    <header class="hero"><h1>Ученически ваканции 2026/2027</h1><p class="muted" style="max-width:62ch">Графикът на ваканциите и неучебните дни по класове. Следващата ваканция е подчертана.</p>
      <div class="chips"><span class="chip tab on">2026/2027</span><span class="chip tab" style="opacity:.6">2027/2028 – очаква се</span></div></header>
    <section><div class="tbl-wrap"><table class="tbl stack"><thead><tr><th>Ваканция</th><th>От</th><th>До</th><th>Класове</th><th>Дни</th></tr></thead><tbody>
      ${CT.VAC.map((v, i) => `<tr${i === nextIdx ? ' style="background:var(--purple-soft)"' : ''}><td data-l="Ваканция"><b>${UI.esc(v.name)}</b>${i === nextIdx ? '<span class="badge-next">Следва</span>' : ''}</td><td class="dt" data-l="От">${BG.fmtFull(v.from)}</td><td class="dt" data-l="До">${BG.fmtFull(v.to)}</td><td data-l="Класове">${UI.esc(v.grades)}</td><td data-l="Дни" class="num">${days(v)}</td></tr>`).join('')}</tbody></table></div></section>
    ${UI.adBlock('ad-inline', 'Реклама · между блоковете')}
    <section><h2 style="margin-bottom:12px">Какво следва</h2><div class="timeline">${CT.VAC.slice(nextIdx, nextIdx + 3).map((v, i) => `<div class="vrow${i === 0 ? ' next' : ''}"><div class="dd"><b>${v.from.getDate()}</b><small>${BG.MONTHS_GEN[v.from.getMonth()].slice(0, 3)}</small></div><div><strong>${UI.esc(v.name)}</strong><span>${BG.fmt(v.from)}${+v.from === +v.to ? '' : ' – ' + BG.fmt(v.to)} · ${UI.daysAway(Math.round((v.from - today) / 864e5))}</span></div></div>`).join('')}</div></section>
    <p class="notice">Данните са по обявения график. Края на учебната година и лятната ваканция се определят със заповед на министъра на образованието и науката и ще бъдат добавени след публикуването им. Винаги проверявайте на сайта на МОН.</p>`,
  });
})();
