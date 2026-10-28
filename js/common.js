// Общ хедър, футър и малки помощни функции за всички страници
(function () {
  const PUMPKIN = `<svg class="pumpkin" viewBox="0 0 120 110" aria-hidden="true">
    <path d="M58 20c0-9 4-15 12-18" stroke="#6bbf3a" stroke-width="7" fill="none" stroke-linecap="round"/>
    <ellipse cx="38" cy="64" rx="30" ry="38" fill="#e8620c"/><ellipse cx="82" cy="64" rx="30" ry="38" fill="#e8620c"/>
    <ellipse cx="60" cy="64" rx="26" ry="40" fill="#ff8a1f"/>
    <path d="M36 52l12 12-24 0z" fill="#2a0f3a"/><path d="M84 52l12 12-24 0z" fill="#2a0f3a" transform="translate(-12 0)"/>
    <path d="M46 78l6 6 8-6 8 6 6-6 4 14c-8 8-28 8-36 0z" fill="#2a0f3a"/>
    <path d="M58 66l-5 9h10z" fill="#2a0f3a"/>
  </svg>`;
  const BAT = `<svg class="bat" viewBox="0 0 64 28" aria-hidden="true"><path d="M32 8c-3-5-9-7-14-4-5 3-10 1-16 6 6 0 8 2 10 5 2-3 6-3 8 1 2-3 5-3 7 3 1-4 3-4 5-4s4 0 5 4c2-6 5-6 7-3 2-4 6-4 8-1 2-3 4-5 10-5-6-5-11-3-16-6-5-3-11-1-14 4z" fill="currentColor"/></svg>`;

  function header(active) {
    const link = (href, text, id) => `<a href="${href}"${active === id ? ' class="active" aria-current="page"' : ''}>${text}</a>`;
    const nav = [link('index.html', 'Начало', 'home'), link('pochivni-dni.html', 'Почивни дни', 'days'), link('imeni-dni.html', 'Имени дни', 'names')].join('');
    document.body.insertAdjacentHTML('afterbegin', `
      <div class="bats" aria-hidden="true">${[1, 2, 3, 4].map((i) => `<span class="b b${i}">${BAT}</span>`).join('')}</div>
      <header class="site-header"><div class="wrap bar">
        <a class="brand" href="index.html"><span class="logo">${PUMPKIN}</span><span>Календарът<small>празници · почивни дни · имени дни</small></span></a>
        <nav>${nav}</nav>
      </div></header>`);
  }

  function footer() {
    document.body.insertAdjacentHTML('beforeend', `<footer class="site-footer"><div class="wrap">
      Календарът · Официални празници и почивни дни в България 2026–2029 · Имени дни · Учебни ваканции
    </div></footer>`);
  }

  function searchForm(value) {
    return `<form class="search" action="imeni-dni.html" method="get" role="search">
      <label for="q">Търсене на имен ден по име</label>
      <div class="row"><input id="q" name="q" type="search" list="names" placeholder="Напр. Иван, Мария, Георги…" autocomplete="off" value="${value ? value.replace(/"/g, '&quot;') : ''}">
      <button type="submit">Търси</button></div>
      <datalist id="names">${ND.allNames().map((n) => `<option value="${n}">`).join('')}</datalist>
    </form>`;
  }

  const plural = (n, one, many) => n + ' ' + (n === 1 ? one : many);
  const daysAway = (n) => (n === 0 ? 'днес' : n === 1 ? 'утре' : 'след ' + plural(n, 'ден', 'дни'));

  window.UI = { header, footer, searchForm, daysAway, plural, PUMPKIN };
})();
