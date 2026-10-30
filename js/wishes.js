// Пожелания: общ списък по поводи и страница за всеки повод със всички категории
(function () {
  const I = UI.ICON, R = RT.R;
  const occ = UI.param('occ');
  const NAMED = ['imenden', 'rozhden'];
  const card = (w, nm) => { const t = w.t.replace(/\{name\}/g, nm || 'приятелю'); return `<div class="wish" data-raw="${UI.esc(w.t)}"><span class="tag national">${CT.CATS[w.c]}</span><p>${UI.esc(t).replace(/\n/g, '<br>')}</p><div class="share-row"><button class="btn ghost sm" data-copy="${UI.esc(t)}">${I.copy}Копирай</button>${UI.shareLinks(t)}</div></div>`; };
  const occCards = Object.keys(CT.WISH_TITLES).map((k) => `<a class="evt" href="${R.wishes(k)}"><div class="dt national">${I.heart}</div><div class="tx"><strong>Пожелания за ${UI.esc(CT.WISH_TITLES[k].toLowerCase())}</strong><span>${CT.wishList(k, 'all').length} пожелания</span></div></a>`).join('');

  const recipChips = `<section><h2 style="margin-bottom:10px">Пожелания за рожден ден – за кого е</h2><div class="chips">${RT.RECIP.map((x) => `<a class="chip" href="${R.wishRec(x.slug)}">${UI.esc(x.h1.replace('Пожелания за ', '').replace('рожден ден на ', '').replace('рожден ден', 'рожден ден'))}</a>`).join('')}</div></section>`;

  if (!occ || !CT.WISH_TITLES[occ]) {
    UI.mount('wishes', {
      title: 'Пожелания и поздравления',
      main: `<div class="crumbs"><a href="${R.home()}">Начало</a> / Пожелания</div>
      <header class="hero"><h1>Пожелания и поздравления за всеки повод</h1><p class="muted" style="max-width:64ch">Готови пожелания за имен ден, рожден ден, Коледа, Нова година, 3 март, Великден и Баба Марта. Забавни, официални за колеги, за роднини, за приятели, романтични, в стихове и кратки за Viber.</p></header>
      <div class="cards">${occCards}</div>
      ${recipChips}
      <section><h2 style="margin-bottom:10px">Най-търсените пожелания</h2><div class="wishes two">${CT.wishList('imenden', 'short', 2).concat(CT.wishList('rozhden', 'short', 2), CT.wishList('koleda', 'short', 2), CT.wishList('novagodina', 'short', 2)).map((w) => card(w)).join('')}</div></section>
      ${UI.adBlock('ad-inline', 'Реклама · между блоковете')}`,
    });
    return;
  }
  const title = CT.WISH_TITLES[occ];
  const present = Object.keys(CT.CATS).filter((k) => CT.wishList(occ, k).length);
  const sections = present.map((k) => `<section id="${k}"><h2 style="margin-bottom:12px">${CT.CATS[k]}</h2><div class="wishes two">${CT.wishList(occ, k).map((w) => card(w)).join('')}</div></section>`).join('');
  UI.mount('wishes', {
    title: `Пожелания за ${title.toLowerCase()}`,
    month: 0,
    main: `<div class="crumbs"><a href="${R.home()}">Начало</a> / <a href="${R.wishes()}">Пожелания</a> / ${UI.esc(title)}</div>
    <header class="hero"><h1>Пожелания за ${UI.esc(title.toLowerCase())} – забавни, за колеги, за роднини и в стихове</h1>
      <p class="muted" style="max-width:64ch">Изберете пожелание, копирайте го и го изпратете през Viber или Facebook.</p>
      <div class="chips" role="navigation" aria-label="Категории">${present.map((k) => `<a class="chip tab" href="#${k}">${CT.CATS[k]}</a>`).join('')}</div>
      <div class="field" id="namef" ${NAMED.includes(occ) ? '' : 'hidden'}><label for="nm">Име на именика или рожденика</label><input id="nm" placeholder="Напр. Мария" autocomplete="off"></div></header>
    ${occ === 'rozhden' ? recipChips : ''}${sections}${UI.adBlock('ad-inline', 'Реклама · между блоковете')}
    <section><h2 style="margin-bottom:10px">Пожелания за други поводи</h2><div class="chips">${Object.keys(CT.WISH_TITLES).filter((k) => k !== occ).map((k) => `<a class="chip" href="${R.wishes(k)}">${UI.esc(CT.WISH_TITLES[k])}</a>`).join('')}</div></section>`,
  });
  const nm = document.getElementById('nm');
  nm.addEventListener('input', () => {
    const v = nm.value.trim() || 'приятелю';
    document.querySelectorAll('.wish[data-raw]').forEach((el) => { const t = el.dataset.raw.replace(/\{name\}/g, v); el.querySelector('p').innerHTML = UI.esc(t).replace(/\n/g, '<br>'); el.querySelector('[data-copy]').dataset.copy = t; });
  });
})();
