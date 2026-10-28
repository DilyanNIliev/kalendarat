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

  const tabs = BG.YEARS.map((yy) => `<a class="chip tab${yy === y ? ' on' : ''}" href="pochivni-dni.html?year=${yy}" data-go="year=${yy}">${yy}</a>`).join('');
  const mini = BG.MONTHS.map((m, i) => `<div class="mini"><h3>${m}</h3><div id="m${i}"></div></div>`).join('');

  UI.mount('days', {
    title: `Почивни дни ${y}`,
    main: `<div class="crumbs"><a href="index.html">Начало</a> / Почивни дни ${y}</div>
    <header class="hero"><h1>Почивни дни ${y}</h1><p class="muted" style="max-width:62ch">Официалните почивни дни в България през ${y} г., дългите почивки и най-изгодните мостове. Великден е на ${BG.fmt(data.easter)}.</p><div class="chips">${tabs}</div></header>
    <div class="stats"><div class="stat"><b class="num">${workOff.length}</b><span>почивни дни в седмицата</span></div><div class="stat"><b class="num">${longs.length}</b><span>дълги почивки (3+ дни)</span></div><div class="stat"><b class="num">${Math.max(...breaks.map((b) => Math.round((b.e - b.s) / 864e5) + 1))}</b><span>най-дълга почивка, дни</span></div></div>
    <section><div class="sec-h"><h2>Годишен преглед</h2>${W.legend}</div><div class="mini-grid">${mini}</div></section>
    ${UI.adBlock('ad-inline', 'Реклама · между блоковете')}
    <section><h2 style="margin-bottom:12px">Всички почивни дни</h2><div class="tbl-wrap"><table class="tbl stack"><thead><tr><th>Дата</th><th>Ден</th><th>Празник</th></tr></thead><tbody>
      ${list.map((x) => `<tr><td class="dt" data-l="Дата">${BG.fmt(x.d)}</td><td data-l="Ден">${BG.WEEKDAYS[x.d.getDay()]}</td><td data-l="Празник">${UI.esc(x.o.name)}</td></tr>`).join('')}</tbody></table></div></section>
    <section><h2 style="margin-bottom:12px">Мостове ${y}: как да почиваш повече</h2><div class="bridges">${bestIdeas.map(W.bridgeCard).join('')}</div></section>
    <section><h2 style="margin-bottom:10px">Дълги почивки</h2><div class="cards">${longs.map((b) => `<div class="evt"><div class="dt dayoff"><b>${Math.round((b.e - b.s) / 864e5) + 1}</b><small>дни</small></div><div class="tx"><strong>${BG.fmt(b.s)} – ${BG.fmt(b.e)}</strong><span>без да вземаш отпуск</span></div></div>`).join('')}</div></section>`,
  });
  BG.MONTHS.forEach((_, i) => W.monthCal(document.getElementById('m' + i), y, i, {}));
})();
