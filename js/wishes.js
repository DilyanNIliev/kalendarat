(function () {
  const I = UI.ICON;
  let occ = UI.param('cat'); if (!CT.WISH_TITLES[occ]) occ = 'imenden';
  let cat = 'all', nm = '';
  const NAMED = ['imenden', 'rozhden'];
  UI.mount('wishes', {
    title: 'Пожелания и поздравления',
    main: `<div class="crumbs"><a href="index.html">Начало</a> / Пожелания</div>
    <header class="hero"><h1>Пожелания и поздравления</h1><p class="muted" style="max-width:62ch">Готови пожелания за имен ден, рожден ден, Коледа, Нова година, 3 март и други празници. Изберете повод и стил, копирайте или изпратете през Viber и Facebook.</p>
      <div><h3 style="margin-bottom:8px">Повод</h3><div class="chips" id="occs" role="group" aria-label="Повод"></div></div>
      <div><h3 style="margin-bottom:8px">За кого</h3><div class="chips" id="cats" role="group" aria-label="Категория"></div></div>
      <div class="field" id="namef"><label for="nm">Име на именика или рожденика</label><input id="nm" placeholder="Напр. Мария" autocomplete="off"></div></header>
    <div class="wishes two" id="wl"></div>${UI.adBlock('ad-inline', 'Реклама · между блоковете')}`,
  });
  const nameInput = document.getElementById('nm');
  const draw = () => {
    document.getElementById('occs').innerHTML = Object.keys(CT.WISH_TITLES).map((k) => `<button type="button" class="chip tab" aria-pressed="${k === occ}" data-o="${k}">${CT.WISH_TITLES[k]}</button>`).join('');
    const present = new Set(CT.wishList(occ, 'all').map((w) => w.c));
    if (cat !== 'all' && !present.has(cat)) cat = 'all';
    document.getElementById('cats').innerHTML = [['all', 'Всички']].concat(Object.entries(CT.CATS).filter(([k]) => present.has(k))).map(([k, l]) => `<button type="button" class="chip tab" aria-pressed="${k === cat}" data-c="${k}">${l}</button>`).join('');
    document.getElementById('namef').hidden = !NAMED.includes(occ);
    const list = CT.wishList(occ, cat);
    document.getElementById('wl').innerHTML = list.map((w) => { const t = w.t.replace(/\{name\}/g, nm || 'приятелю'); return `<div class="wish"><span class="tag national">${CT.CATS[w.c]}</span><p>${UI.esc(t).replace(/\n/g, '<br>')}</p><div class="share-row"><button class="btn ghost sm" data-copy="${UI.esc(t)}">${I.copy}Копирай</button>${UI.shareLinks(t)}</div></div>`; }).join('');
    document.querySelectorAll('[data-o]').forEach((b) => (b.onclick = () => { occ = b.dataset.o; draw(); }));
    document.querySelectorAll('[data-c]').forEach((b) => (b.onclick = () => { cat = b.dataset.c; draw(); }));
  };
  nameInput.addEventListener('input', (e) => { nm = e.target.value.trim(); const pos = nameInput.selectionStart; draw(); nameInput.focus(); try { nameInput.setSelectionRange(pos, pos); } catch (_) {} });
  draw();
})();
