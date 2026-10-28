(function () {
  const now = new Date(), I = UI.ICON;
  const q = UI.param('q');
  const chips = (l) => l.map((n) => `<a class="chip" href="imen-den.html?name=${encodeURIComponent(n)}" data-go="name=${UI.esc(n)}">${UI.esc(n)}</a>`).join('');
  const yr = now.getFullYear();
  const all = ND.forYear(yr);
  const months = BG.MONTHS.map((m, i) => {
    const l = all.filter((x) => x.date.getMonth() === i);
    return l.length ? `<section class="panel"><h3 style="margin-bottom:10px">${m}</h3>${l.map((x) => `<div style="padding:10px 0;border-top:1px solid var(--line)"><b class="num">${x.date.getDate()}</b> · ${UI.esc(x.title)}<div class="chips" style="margin-top:8px">${chips(x.names.slice(0, 10))}</div></div>`).join('')}</section>` : '';
  }).join('');
  const mov = BG.YEARS.map((y) => ND.forYear(y).filter((x) => x.movable));
  UI.mount('names', {
    title: 'Имени дни',
    main: `<div class="crumbs"><a href="index.html">Начало</a> / Имени дни</div>
    <header class="hero"><h1>Имени дни</h1><p class="muted" style="max-width:62ch">Намерете кога имате имен ден и кой празнува днес. Въведете име в търсачката горе или изберете от списъка.</p>
      <div class="chips">${chips(['Иван', 'Мария', 'Георги', 'Димитър', 'Никола', 'Петър', 'Стефан', 'Христо', 'Елена', 'Анна', 'Васил', 'Тодор'])}</div></header>
    <section><h2 style="margin-bottom:12px">Подвижни имени дни</h2><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Празник</th>${BG.YEARS.map((y) => `<th>${y}</th>`).join('')}</tr></thead><tbody>
      ${ND.MOVABLE.map(([, t]) => `<tr><td><b>${t}</b></td>${mov.map((r) => `<td class="num">${BG.fmt(r.find((x) => x.title === t).date)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></section>
    ${UI.adBlock('ad-inline', 'Реклама · между блоковете')}
    <section><h2 style="margin-bottom:12px">Имени дни по месеци</h2><div style="display:grid;gap:14px">${months}</div></section>`,
  });
})();
