// Имени дни – общ списък: търсене, имена от А до Я, празници по месеци
(function () {
  const now = new Date(), R = RT.R;
  const q = UI.param('q');
  const yr = now.getFullYear();
  const all = ND.forYear(yr);
  const names = ND.allNames();
  const letters = [...new Set(names.map((n) => n[0].toUpperCase()))].sort((a, b) => a.localeCompare(b, 'bg'));
  const byLetter = letters.map((l) => `<section id="b-${RT.slug(l)}"><h3 style="margin-bottom:8px">${l}</h3><div class="chips">${names.filter((n) => n[0].toUpperCase() === l).map((n) => `<a class="chip" href="${RT.nameHref(n)}">${UI.esc(n)}</a>`).join('')}</div></section>`).join('');
  const months = BG.MONTHS.map((m, i) => {
    const l = all.filter((x) => x.date.getMonth() === i && !x.movable);
    return l.length ? `<section class="panel"><h3 style="margin-bottom:10px">Имени дни през ${m.toLowerCase()}</h3>${l.map((x) => { const g = RT.GROUPS.find((gg) => gg.title === x.title); return `<div style="padding:10px 0;border-top:1px solid var(--line)"><b class="num">${x.date.getDate()}</b> · <a href="${R.group(g.slug)}">${UI.esc(x.title)}</a><div class="names" style="margin-top:4px">${UI.esc(x.names.slice(0, 8).join(', '))}</div></div>`; }).join('')}</section>` : '';
  }).join('');
  const mov = BG.YEARS.map((y) => ND.forYear(y).filter((x) => x.movable));
  UI.mount('names', {
    title: 'Имени дни',
    month: now.getMonth(),
    main: `<div class="crumbs"><a href="${R.home()}">Начало</a> / Имени дни</div>
    <header class="hero"><h1>Имени дни – кой има имен ден и кога</h1><p class="muted" style="max-width:64ch">Календар на имените дни в България: Ивановден, Гергьовден, Димитровден, Никулден и още. Въведете име в търсачката или го изберете от списъка по-долу.</p>
      <form class="search" role="search" id="nsearch" style="max-width:520px"><label class="sr" for="nq">Име</label><input id="nq" type="search" placeholder="Напр. Георги" value="${UI.esc(q)}" autocomplete="off"><button type="submit">${UI.ICON.search}<span>Търси</span></button></form>
      <div id="nres"></div></header>
    <section><h2 style="margin-bottom:12px">Имена от А до Я</h2><div style="display:grid;gap:14px">${byLetter}</div></section>
    <section><h2 style="margin-bottom:12px">Подвижни имени дни</h2><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Празник</th>${BG.YEARS.map((y) => `<th>${y}</th>`).join('')}</tr></thead><tbody>
      ${ND.MOVABLE.map(([, t]) => { const g = RT.GROUPS.find((gg) => gg.title === t); return `<tr><td><a href="${R.group(g.slug)}"><b>${t}</b></a></td>${mov.map((r) => `<td class="num">${BG.fmt(r.find((x) => x.title === t).date)}</td>`).join('')}</tr>`; }).join('')}</tbody></table></div></section>
    ${UI.adBlock('ad-inline', 'Реклама · между блоковете')}
    <section><h2 style="margin-bottom:12px">Имени дни по месеци</h2><div style="display:grid;gap:14px">${months}</div></section>`,
  });
  const show = (v) => {
    const hits = ND.search(v, now);
    document.getElementById('nres').innerHTML = !v.trim() ? '' : hits.length
      ? `<h2 style="margin:16px 0 8px;font-size:1.2rem">Резултати за „${UI.esc(v.trim())}“</h2>` + hits.map((h) => { const g = RT.GROUPS.find((gg) => gg.title === h.title); return `<div class="result"><b>${BG.fmt(h.date)} ${h.date.getFullYear()}</b> · <a href="${RT.R.group(g.slug, 'ime-' + RT.slug(v.trim()))}">${UI.esc(h.title)}</a><div class="names">${UI.esc(h.names.join(', '))}</div></div>`; }).join('')
      : `<p class="muted" style="margin-top:12px">Не намерихме имен ден за „${UI.esc(v.trim())}“. Опитайте с друга форма на името.</p>`;
  };
  show(q);
  document.getElementById('nsearch').addEventListener('submit', (e) => { e.preventDefault(); show(document.getElementById('nq').value); });
})();
