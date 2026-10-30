(function () {
  const I = UI.ICON;
  let y = parseInt(UI.param('year'), 10);
  if (!BG.YEARS.includes(y)) y = 2027;
  const data = BG.year(y);
  const keys = Object.keys(data.off).sort();
  const list = keys.map((k) => ({ d: new Date(k + 'T00:00:00'), o: data.off[k] }));
  const workOff = list.filter((x) => !BG.isWeekend(x.d));
  // дълги почивки
  const breaks = [];
  for (let d = new Date(y, 0, 1), cur = null; d <= new Date(y, 11, 31); d = BG.addDays(d, 1)) {
    if (BG.isOff(d)) { if (!cur) { cur = { s: d, e: d, off: false }; breaks.push(cur); } cur.e = d; if (BG.offName(d)) cur.off = true; } else cur = null;
  }
  const longs = breaks.filter((b) => b.off && Math.round((b.e - b.s) / 864e5) + 1 >= 3);
  const ideaKeys = new Set(data.ideas.flatMap((i) => i.leave.map(BG.key)));
  const bestIdeas = data.ideas.slice().sort((a, b) => a.from - b.from);

  const tabs = BG.YEARS.map((yy) => `<a class="chip tab${yy === y ? ' on' : ''}" href="${RT.R.days(yy)}"${yy === y ? ' aria-current="page"' : ''}>${yy}</a>`).join('');
  const longest = breaks.filter((b) => b.off).sort((a, b) => (b.e - b.s) - (a.e - a.s))[0];
  const lLen = longest ? Math.round((longest.e - longest.s) / 864e5) + 1 : 0;
  const bestBridge = data.ideas.slice().sort((a, b) => b.total / b.leave.length - a.total / a.leave.length)[0];
  const faq = [
    [`Колко почивни дни има през ${y} г.?`, `През ${y} г. има ${workOff.length} официални почивни дни, които падат в работна седмица. Празниците в събота и неделя се компенсират в следващите работни дни.`],
    [`Кога е Великден през ${y} г.?`, `Православният Великден през ${y} г. е на ${BG.fmt(data.easter)}. Почивни са Велики петък, Велика събота, Великден и Великденският понеделник.`],
    [`Коя е най-дългата почивка през ${y} г.?`, longest ? `Най-дългата почивка без отпуск е ${lLen} дни подред – от ${BG.fmt(longest.s)} до ${BG.fmt(longest.e)}.` : 'Няма дълги почивки без отпуск.'],
    [`Как да почивам повече с по-малко отпуск през ${y} г.?`, bestBridge ? `Най-изгодният мост е ${UI.plural(bestBridge.leave.length, 'ден', 'дни')} отпуск (${bestBridge.leave.map(BG.fmt).join(', ')}) за общо ${bestBridge.total} дни почивка, от ${BG.fmt(bestBridge.from)} до ${BG.fmt(bestBridge.to)}.` : 'Няма изгодни мостове.'],
  ];

  UI.mount('days', {
    title: `Почивни дни ${y}`,
    year: y, cal: 'full',
    main: `<div class="crumbs"><a href="${RT.R.home()}">Начало</a> / Почивни дни ${y}</div>
    <header class="hero"><h1>Почивни дни ${y} – официални празници, мостове и дълги почивки</h1><p class="answer">През ${y} г. има <b>${workOff.length} официални почивни дни</b> в работна седмица. Най-дългата почивка без отпуск е <b>${lLen} дни</b>${longest ? ` (${BG.fmt(longest.s)} – ${BG.fmt(longest.e)})` : ''}. Великден е на <b>${BG.fmt(data.easter)}</b>.</p><p class="muted" style="max-width:62ch">Официалните почивни дни в България през ${y} г., дългите почивки и най-изгодните мостове. Великден е на ${BG.fmt(data.easter)}.</p><div class="chips">${tabs}</div></header>
    <div class="stats"><div class="stat"><b class="num">${workOff.length}</b><span>почивни дни в седмицата</span></div><div class="stat"><b class="num">${longs.length}</b><span>дълги почивки (3+ дни)</span></div><div class="stat"><b class="num">${Math.max(...breaks.map((b) => Math.round((b.e - b.s) / 864e5) + 1))}</b><span>най-дълга почивка, дни</span></div></div>
    ${UI.adBlock('ad-inline', 'Реклама · между блоковете')}
    <section><h2 style="margin-bottom:12px">Всички почивни дни</h2><div class="tbl-wrap"><table class="tbl stack"><thead><tr><th>Дата</th><th>Ден</th><th>Празник</th></tr></thead><tbody>
      ${list.map((x) => `<tr><td class="dt" data-l="Дата">${BG.fmt(x.d)}</td><td data-l="Ден">${BG.WEEKDAYS[x.d.getDay()]}</td><td data-l="Празник">${UI.esc(x.o.name)}</td></tr>`).join('')}</tbody></table></div></section>
    <section><h2 style="margin-bottom:12px">Мостове ${y}: как да почиваш повече</h2><div class="bridges">${bestIdeas.map(W.bridgeCard).join('')}</div></section>
    <section><h2 style="margin-bottom:10px">Дълги почивки</h2><div class="cards">${longs.map((b) => `<div class="evt"><div class="dt dayoff"><b>${Math.round((b.e - b.s) / 864e5) + 1}</b><small>дни</small></div><div class="tx"><strong>${BG.fmt(b.s)} – ${BG.fmt(b.e)}</strong><span>без да вземаш отпуск</span></div></div>`).join('')}</div></section>
    <section><h2 style="margin-bottom:10px">Често задавани въпроси</h2><div class="faq">${faq.map(([q, an]) => `<div><h3>${UI.esc(q)}</h3><p>${UI.esc(an)}</p></div>`).join('')}</div></section>
    <section><h2 style="margin-bottom:10px">Още за ${y}</h2><div class="chips"><a class="chip" href="${RT.R.holidays()}">Празници</a><a class="chip" href="${RT.R.church()}">Църковен календар</a><a class="chip" href="${RT.R.vac()}">Ученически ваканции</a><a class="chip" href="${RT.R.holiday('velikden')}">Великден</a></div></section>`,
  });
})();
