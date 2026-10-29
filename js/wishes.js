(function () {
  const I = UI.ICON;
  let cat = UI.param('cat'); if (!CT.WISHES[cat]) cat = 'imenden';
  let nm = '';
  UI.mount('wishes', {
    title: 'Пожелания и поздравления',
    main: `<div class="crumbs"><a href="index.html">Начало</a> / Пожелания</div>
    <header class="hero"><h1>Пожелания и поздравления</h1><p class="muted" style="max-width:62ch">Готови пожелания за имен ден, Великден, Коледа и други поводи. Копирайте или изпратете през Viber и Facebook.</p>
      <div class="chips" id="cats" role="group" aria-label="Повод"></div>
      <div class="field" id="namef"><label for="nm">Име на именика</label><input id="nm" placeholder="Напр. Мария" autocomplete="off"></div></header>
    <div class="wishes two" id="wl"></div>${UI.adBlock('ad-inline', 'Реклама · между блоковете')}`,
  });
  const draw = () => {
    document.getElementById('cats').innerHTML = Object.keys(CT.WISHES).map((k) => `<button type="button" class="chip tab" aria-pressed="${k === cat}" data-c="${k}">${CT.WISH_TITLES[k]}</button>`).join('');
    document.getElementById('namef').hidden = cat !== 'imenden';
    document.getElementById('wl').innerHTML = CT.WISHES[cat].map((w) => { const t = w.replace(/\{name\}/g, nm || 'приятелю'); return `<div class="wish"><p>${UI.esc(t)}</p><div class="share-row"><button class="btn ghost sm" data-copy="${UI.esc(t)}">${I.copy}Копирай</button>${UI.shareLinks(t)}</div></div>`; }).join('');
    document.querySelectorAll('[data-c]').forEach((b) => (b.onclick = () => { cat = b.dataset.c; draw(); }));
  };
  document.getElementById('nm').addEventListener('input', (e) => { nm = e.target.value.trim(); const keep = document.activeElement; draw(); keep.focus(); });
  draw();
})();
