// Пожелания за рожден ден за конкретен получател
(function () {
  const I = UI.ICON, R = RT.R;
  const meta = RT.RECIP.find((x) => x.slug === UI.param('slug')) || RT.RECIP[0];
  const data = WISHDATA[meta.slug];
  const total = data.groups.reduce((n, g) => n + g.w.length, 0);
  const card = (t) => `<div class="wish"><p>${UI.esc(t).replace(/\n/g, '<br>')}</p><div class="share-row"><button class="btn ghost sm" data-copy="${UI.esc(t)}">${I.copy}Копирай</button>${UI.shareLinks(t)}</div></div>`;
  const sections = data.groups.map((g, i) => `<section id="g${i}"><h2 style="margin-bottom:12px">${UI.esc(g.t)}</h2><div class="wishes two">${g.w.map(card).join('')}</div></section>`).join('');
  UI.mount('wishes', {
    title: meta.h1,
    month: 0,
    main: `<div class="crumbs"><a href="${R.home()}">Начало</a> / <a href="${R.wishes()}">Пожелания</a> / <a href="${R.wishes('rozhden')}">Рожден ден</a> / ${UI.esc(meta.h1.replace('Пожелания за ', ''))}</div>
    <header class="hero"><h1>${UI.esc(meta.h1)}</h1><p class="answer">${UI.esc(data.intro)}</p>
      <p class="muted">${total} готови пожелания · копирайте или изпратете през Viber и Facebook</p>
      <div class="chips" role="navigation" aria-label="Раздели">${data.groups.map((g, i) => `<a class="chip tab" href="#g${i}">${UI.esc(g.t)}</a>`).join('')}</div></header>
    ${sections}
    <section class="prose"><h2>Как да изберете пожелание</h2><p>${UI.esc(data.tip)}</p></section>
    ${UI.adBlock('ad-inline', 'Реклама · между блоковете')}
    <section><h2 style="margin-bottom:10px">Пожелания за рожден ден за други</h2><div class="chips">${RT.RECIP.filter((x) => x.slug !== meta.slug).map((x) => `<a class="chip" href="${R.wishRec(x.slug)}">${UI.esc(x.h1.replace('Пожелания за ', '').replace('рожден ден на ', ''))}</a>`).join('')}</div>
      <p style="margin-top:12px"><a href="${R.wishes('rozhden')}">Всички пожелания за рожден ден</a> · <a href="${R.wishes('imenden')}">Пожелания за имен ден</a></p></section>`,
  });
})();
