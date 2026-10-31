// Сезонно отброяване: тема, която се сменя автоматично според датата
(function () {
  const svg = (vb, inner) => `<svg class="art" viewBox="${vb}" aria-hidden="true">${inner}</svg>`;
  const ART = {
    christmas: svg('0 0 100 120', `<path d="M50 6l5 11h12l-9 8 3 12-11-7-11 7 3-12-9-8h12z" fill="#f4c542"/><path d="M50 30l22 28H60l20 26H64l22 26H14l22-26H20l20-26H28z" fill="#1f7a4f"/><path d="M50 30l22 28H60l20 26H64l22 26H50z" fill="#18633f"/><rect x="44" y="108" width="12" height="10" rx="2" fill="#7a4a24"/><circle cx="38" cy="70" r="4" fill="#d6392e"/><circle cx="60" cy="88" r="4" fill="#f4c542"/><circle cx="34" cy="100" r="4" fill="#d6392e"/><circle cx="66" cy="62" r="3.500" fill="#f4c542"/>`),
    newyear: svg('0 0 100 100', `<circle cx="50" cy="50" r="12" fill="#f4c542"/><g stroke="#f4c542" stroke-width="4" stroke-linecap="round"><path d="M50 8v18M50 74v18M8 50h18M74 50h18M20 20l13 13M67 67l13 13M80 20L67 33M33 67L20 80"/></g>`),
    babamarta: svg('0 0 100 110', `<path d="M50 10c-18 0-18 26 0 26s18-26 0-26z" fill="#fff"/><path d="M50 36c-6 12-4 22 0 30" stroke="#fff" stroke-width="5" fill="none"/><path d="M50 36c6 12 4 22 0 30" stroke="#e5383b" stroke-width="5" fill="none"/><circle cx="50" cy="22" r="9" fill="#e5383b"/><path d="M40 66l-8 30M50 68v32M60 66l8 30" stroke="#fff" stroke-width="5" stroke-linecap="round"/><path d="M45 68l-4 28M55 68l4 28" stroke="#e5383b" stroke-width="4" stroke-linecap="round"/>`),
    easter: svg('0 0 80 100', `<ellipse cx="40" cy="56" rx="30" ry="40" fill="#d6392e"/><path d="M10 52l10-8 10 8 10-8 10 8 10-8 10 8" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M12 68l10-8 10 8 10-8 10 8 10-8 10 8" stroke="#f4c542" stroke-width="4" fill="none" stroke-linecap="round"/>`),
    gergyovden: svg('0 0 100 100', `<g fill="#8ad14b"><circle cx="35" cy="35" r="18"/><circle cx="65" cy="35" r="18"/><circle cx="35" cy="65" r="18"/><circle cx="65" cy="65" r="18"/></g><path d="M50 50L58 96" stroke="#d9a441" stroke-width="5" stroke-linecap="round"/>`),
  };
  const DEFS = [
    { id: 'christmas', name: 'Коледа', date: (y) => new Date(y, 11, 24), win: 54, title: 'До Бъдни вечер остават', done: 'Весела Бъдни вечер!', sub: 'Подредете трапезата, украсете елхата и съберете близките.', go: ['praznik.html', 'id', 'badni-vecher', 'Как се празнува'], wish: 'koleda' },
    { id: 'newyear', name: 'Нова година', date: (y) => new Date(y, 0, 1), win: 8, title: 'До Нова година остават', done: 'Честита Нова година!', sub: 'Сурвакари, баница с късмети и добри пожелания.', go: ['praznik.html', 'id', 'nova-godina', 'Обичаи'], wish: 'novagodina' },
    { id: 'babamarta', name: 'Баба Марта', date: (y) => new Date(y, 2, 1), win: 28, title: 'До Баба Марта остават', done: 'Честита Баба Марта!', sub: 'Време е за мартеници и пролетни пожелания.', go: ['praznik.html', 'id', 'baba-marta', 'Традиции'], wish: 'martenica' },
    { id: 'easter', name: 'Великден', date: (y) => BG.easter(y), win: 45, title: 'До Великден остават', done: 'Христос воскресе!', sub: 'Яйца, козунак и светла празнична трапеза.', go: ['praznik.html', 'id', 'velikden', 'Как се празнува'], wish: 'velikden' },
    { id: 'gergyovden', name: 'Гергьовден', date: (y) => new Date(y, 4, 6), win: 21, title: 'До Гергьовден остават', done: 'Честит Гергьовден!', sub: 'Агнешко, люлки и зелени венци.', go: ['praznik.html', 'id', 'gergyovden', 'Обичаи'] },
  ];
  const DAY = 864e5;
  const upcoming = (now) => {
    const out = [];
    [now.getFullYear(), now.getFullYear() + 1].forEach((y) => DEFS.forEach((d) => {
      const t = d.date(y);
      if (now < new Date(t.getTime() + DAY)) out.push({ d, t, start: new Date(t.getTime() - d.win * DAY) });
    }));
    return out.sort((a, b) => a.t - b.t);
  };
  function pick(now, forced) {
    const list = upcoming(now);
    if (forced) { const f = list.find((x) => x.d.id === forced); if (f) return f; }
    return list.find((x) => x.start <= now) || list[0];
  }

  function rest(t) {
    if (!BG.isOff(t)) return '';
    let a = t, b = t;
    while (BG.isOff(BG.addDays(a, -1))) a = BG.addDays(a, -1);
    while (BG.isOff(BG.addDays(b, 1))) b = BG.addDays(b, 1);
    const n = Math.round((b - a) / DAY) + 1;
    return n > 1 ? `<span class="s-rest">${UI.plural(n, 'ден', 'дни')} почивка: ${BG.fmt(a)} – ${BG.fmt(b)}</span>` : '<span class="s-rest">Почивен ден</span>';
  }

  function card(item) {
    const { d, t } = item;
    const link = d.go ? `<a class="btn s-btn" href="${RT.R.holiday(d.go[2])}">${d.go[3]} ${UI.ICON.arrow}</a>` : '';
    const wish = d.wish ? `<a class="btn s-btn ghost" href="${RT.R.wishes(d.wish)}">${UI.ICON.heart}Пожелания</a>` : '';
    return `<section class="season ${d.id}" data-t="${t.getTime()}" data-done="${UI.esc(d.done)}" aria-label="Отброяване до ${UI.esc(d.name)}">
      <div class="s-top">${ART[d.id]}<div><div class="s-kicker">${UI.esc(d.title)}</div><div class="s-date">${BG.fmt(t)} ${t.getFullYear()}</div></div></div>
      <div class="units" data-units></div>
      <p class="s-sub">${UI.esc(d.sub)} ${rest(t)}</p>
      <div class="actions">${link}${wish}</div></section>`;
  }

  function tick(root) {
    const now = Date.now();
    root.querySelectorAll('.season').forEach((el) => {
      const t = +el.dataset.t, s = Math.floor((t - now) / 1000), u = el.querySelector('[data-units]');
      if (s <= 0) { u.innerHTML = `<div class="s-done">${el.dataset.done}</div>`; return; }
      const parts = [[Math.floor(s / 86400), 'дни'], [Math.floor(s / 3600) % 24, 'часа'], [Math.floor(s / 60) % 60, 'мин.'], [s % 60, 'сек.']];
      u.innerHTML = parts.map(([n, l], i) => `<div class="u"><b class="num">${i ? String(n).padStart(2, '0') : n}</b><span>${l}</span></div>`).join('');
    });
  }
  function start(root) { tick(root); return setInterval(() => tick(root), 1000); }

  window.Season = { card, pick, upcoming, start, DEFS };
})();
