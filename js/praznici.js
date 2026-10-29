(function () {
  const now = new Date();
  let type = UI.param('type') || 'all';
  let y = parseInt(UI.param('year'), 10); if (!BG.YEARS.includes(y)) y = now.getFullYear();
  const TYPES = [['all', 'Всички'], ['dayoff', 'Официални почивни дни'], ['church', 'Църковен календар'], ['fast', 'Пости'], ['national', 'Национални']];
  const title = () => (type === 'church' ? 'Църковен календар' : 'Празници');

  UI.mount(type === 'church' ? 'church' : 'praznici', {
    title: 'Празници и църковен календар',
    main: `<div class="crumbs"><a href="index.html">Начало</a> / <span id="crumb"></span></div>
      <header class="hero"><h1 id="h1"></h1><p class="muted" style="max-width:62ch">Официални празници, църковни празници, пости и национални дати. Изберете година и вид.</p>
      <div class="chips" id="types" role="group" aria-label="Вид"></div><div class="chips" id="years" role="group" aria-label="Година"></div></header>
      <div id="list" style="display:grid;gap:26px"></div>`,
  });
  const draw = () => {
    document.getElementById('h1').textContent = (type === 'church' ? 'Църковен календар ' : 'Празници ') + y;
    document.getElementById('crumb').textContent = title();
    document.getElementById('types').innerHTML = TYPES.map(([k, l]) => `<button type="button" class="chip tab" aria-pressed="${k === type}" data-t="${k}">${l}</button>`).join('');
    document.getElementById('years').innerHTML = BG.YEARS.map((yy) => `<button type="button" class="chip tab" aria-pressed="${yy === y}" data-y="${yy}">${yy}</button>`).join('');
    const evs = CT.events(y).filter((e) => !e.types.includes('name') || e.types.length > 1).filter((e) => type === 'all' || e.types.includes(type));
    let html = '';
    BG.MONTHS.forEach((m, i) => {
      const l = evs.filter((e) => e.date.getMonth() === i);
      if (!l.length) return;
      html += `<section><h2 style="margin-bottom:10px">${m}</h2><div class="cards">${l.map((e) => W.eventCard(e, now)).join('')}</div></section>`;
      if (i === 4) html += UI.adBlock('ad-inline', 'Реклама · между блоковете');
    });
    document.getElementById('list').innerHTML = html || '<p class="muted">Няма записи за този избор.</p>';
    document.querySelectorAll('[data-t]').forEach((b) => (b.onclick = () => { type = b.dataset.t; draw(); }));
    document.querySelectorAll('[data-y]').forEach((b) => (b.onclick = () => { y = +b.dataset.y; draw(); }));
    document.querySelectorAll('#list a[data-go]').forEach(() => {});
  };
  draw();
})();
