// Картички с пожелания – очаквайте скоро
(function () {
  const R = RT.R;
  UI.mount('wishes', {
    title: 'Картички с пожелания', cal: false,
    main: `<div class="crumbs"><a href="${R.home()}">Начало</a> / <a href="${R.wishes()}">Пожелания</a> / Картички</div>
    <header class="hero"><h1>Картички с пожелания</h1><p class="answer">Очаквайте скоро: красиви картички с пожелания за имен ден, рожден ден, Коледа и Нова година, които ще можете да изпратете през Viber и Facebook.</p>
      <p class="muted" style="max-width:62ch">Дотогава изберете текст от нашите пожелания и го изпратете като съобщение.</p>
      <div class="chips"><a class="chip" href="${R.wishes('rozhden')}">Пожелания за рожден ден</a><a class="chip" href="${R.wishes('imenden')}">Пожелания за имен ден</a><a class="chip" href="${R.wishes('koleda')}">Пожелания за Коледа</a></div></header>`,
  });
})();
