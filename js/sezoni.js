(function () {
  const now = new Date();
  const items = Season.upcoming(now).filter((x, i, a) => a.findIndex((y) => y.d.id === x.d.id) === i);
  UI.mount('', {
    title: 'Отброяване до празниците',
    main: `<div class="crumbs"><a href="${RT.R.home()}">Начало</a> / Отброяване</div>
    <header class="hero"><h1>Отброяване до празниците</h1><p class="muted" style="max-width:62ch">Колко време остава до Хелоуин, Коледа, Нова година, Баба Марта, Великден и Гергьовден.</p></header>
    <div class="season-list">${items.map((x, i) => Season.card(x) + (i === 1 ? UI.adBlock('ad-inline', 'Реклама · между блоковете') : '')).join('')}</div>`,
  });
  Season.start(document.getElementById('main'));
})();
