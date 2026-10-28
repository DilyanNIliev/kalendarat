UI.header('names');
const q = new URLSearchParams(location.search).get('q') || '';
document.getElementById('search-box').innerHTML = UI.searchForm(q);

const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const res = document.getElementById('results');
if (q.trim()) {
  const hits = ND.search(q, new Date());
  const ql = q.trim().toLowerCase();
  const hl = (n) => (n.toLowerCase().startsWith(ql) ? `<mark>${esc(n)}</mark>` : esc(n));
  res.innerHTML = hits.length
    ? `<h3 style="margin-top:16px">Резултати за „${esc(q.trim())}“</h3>` + hits.map((h) => `
      <div class="result${h.exact ? ' exact' : ''}">
        <div class="when">${BG.fmt(h.date)} ${h.date.getFullYear()} <span class="muted" style="font-size:.9rem;font-weight:400">${BG.WEEKDAYS[h.date.getDay()]} · ${UI.daysAway(h.days)}</span></div>
        <div><b>${esc(h.title)}</b></div>
        <div class="names">${h.names.map(hl).join(', ')}</div>
      </div>`).join('')
    : `<p class="muted" style="margin-top:16px">Не намерихме имен ден за „${esc(q.trim())}“. Опитайте с друга форма на името.</p>`;
}

const rows = BG.YEARS.map((y) => ND.forYear(y).filter((x) => x.movable));
document.getElementById('movable').innerHTML =
  `<tr><th>Празник</th>${BG.YEARS.map((y) => `<th>${y}</th>`).join('')}</tr>` +
  ND.MOVABLE.map(([, title, names]) => `<tr><td><b>${title}</b><br><span class="muted">${names.slice(0, 5).join(', ')}…</span></td>${rows.map((r) => `<td>${BG.fmt(r.find((x) => x.title === title).date)}</td>`).join('')}</tr>`).join('');

const yr = new Date().getFullYear();
const all = ND.forYear(yr);
document.getElementById('by-month').innerHTML = BG.MONTHS.map((name, m) => {
  const items = all.filter((x) => x.date.getMonth() === m);
  if (!items.length) return '';
  return `<section class="card nd-list" style="margin-bottom:12px"><h3>Имени дни през ${name.toLowerCase()}</h3>` + items.map((x) =>
    `<div class="item"><div class="d">${x.date.getDate()} ${BG.MONTHS_GEN[m].slice(0, 3)}<small>${BG.WEEKDAYS[x.date.getDay()]}</small></div><div><b>${x.title}</b><div class="names">${x.names.join(', ')}</div></div></div>`).join('') + '</section>';
}).join('');
UI.footer();
