// Калкулатор на работни дни: избор на период с клик в календара и изчисляване
(function () {
  const R = RT.R;
  const MIN = new Date(BG.YEARS[0], 0, 1), MAX = new Date(BG.YEARS[BG.YEARS.length - 1], 11, 31);
  const DOW = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
  const SHORT = ['нд', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
  const iso = (d) => `${d.getFullYear()}-${BG.pad(d.getMonth() + 1)}-${BG.pad(d.getDate())}`;
  const parse = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const day0 = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const clamp = (d) => (d < MIN ? MIN : d > MAX ? MAX : d);
  const today = clamp(day0(new Date()));

  const st = { start: null, end: null, incl: true, view: new Date(today.getFullYear(), today.getMonth(), 1) };

  const monthHtml = (first) => {
    const y = first.getFullYear(), m = first.getMonth();
    const lead = (first.getDay() + 6) % 7; // понеделник = 0
    const n = new Date(y, m + 1, 0).getDate();
    let cells = '';
    for (let i = 0; i < lead; i++) cells += '<span class="wc-e"></span>';
    for (let d = 1; d <= n; d++) {
      const dt = new Date(y, m, d), k = iso(dt);
      const out = dt < MIN || dt > MAX;
      const name = BG.offName(dt);
      const we = BG.isWeekend(dt);
      const cls = ['wc-d', we ? 'we' : '', name ? 'ho' : ''].filter(Boolean).join(' ');
      const label = `${BG.fmtFull(dt)}${name ? ' – ' + name : we ? ' – почивен ден' : ''}`;
      cells += `<button type="button" class="${cls}" data-d="${k}" aria-label="${UI.esc(label)}"${name ? ` title="${UI.esc(name)}"` : ''}${out ? ' disabled' : ''}>${d}</button>`;
    }
    return `<div class="wc-m"><h3>${BG.MONTHS[m]} ${y}</h3><div class="wc-w">${DOW.map((x, i) => `<span${i > 4 ? ' class="we"' : ''}>${x}</span>`).join('')}</div><div class="wc-g">${cells}</div></div>`;
  };

  const effectiveEnd = () => (st.start && st.end ? (st.incl ? st.end : BG.addDays(st.end, -1)) : null);

  function paint() {
    const root = document.getElementById('wc');
    if (!root) return;
    const second = new Date(st.view.getFullYear(), st.view.getMonth() + 1, 1);
    root.querySelector('.wc-months').innerHTML = monthHtml(st.view) + monthHtml(second);
    root.querySelectorAll('.wc-d').forEach((b) => {
      const d = parse(b.dataset.d);
      const inRange = st.start && st.end && d >= st.start && d <= st.end;
      if (inRange) b.classList.add('in');
      if (st.start && +d === +st.start) b.classList.add('st');
      if (st.end && +d === +st.end) b.classList.add('en');
      if (st.start && !st.end && +d === +st.start) b.classList.add('en');
      b.setAttribute('aria-pressed', String(!!(inRange || (st.start && +d === +st.start))));
    });
    root.querySelector('#wc-prev').disabled = new Date(st.view.getFullYear(), st.view.getMonth() - 1, 1) < new Date(MIN.getFullYear(), MIN.getMonth(), 1);
    root.querySelector('#wc-next').disabled = new Date(st.view.getFullYear(), st.view.getMonth() + 2, 1) > new Date(MAX.getFullYear(), MAX.getMonth() + 1, 1);
    root.querySelector('#wc-from').textContent = st.start ? BG.fmtFull(st.start) : 'изберете в календара';
    root.querySelector('#wc-to').textContent = st.end ? BG.fmtFull(st.end) : st.start ? 'изберете крайна дата' : 'изберете в календара';
    root.querySelector('#wc-go').disabled = !(st.start && st.end);
    root.querySelector('#wc-from').parentNode.classList.toggle('on', !!st.start && !st.end);
    root.querySelector('#wc-to').parentNode.classList.toggle('on', !!st.start && !!st.end);
  }

  const pick = (d) => {
    if (!st.start || st.end) { st.start = d; st.end = null; } else if (d < st.start) { st.end = st.start; st.start = d; } else st.end = d;
    hideResult();
    paint();
  };

  const setRange = (a, b) => {
    st.start = clamp(day0(a)); st.end = clamp(day0(b));
    st.view = new Date(st.start.getFullYear(), st.start.getMonth(), 1);
    paint(); calc();
  };

  const hideResult = () => { const r = document.getElementById('wc-res'); if (r) { r.hidden = true; r.innerHTML = ''; } };

  function calc() {
    const res = document.getElementById('wc-res');
    const last = effectiveEnd();
    if (!res || !st.start || !last) return;
    if (last < st.start) {
      res.hidden = false;
      res.innerHTML = '<div class="panel"><p><b>Периодът е празен.</b> При изключена крайна дата изберете поне два различни дни.</p></div>';
      return;
    }
    const work = [], off = []; let wk = 0, ho = 0;
    for (let d = new Date(st.start); d <= last; d = BG.addDays(d, 1)) {
      const name = BG.offName(d), we = BG.isWeekend(d);
      if (we) wk++; else if (name) ho++;
      if (we || name) off.push({ d, name, we }); else work.push(d);
    }
    const total = work.length + off.length;
    const pl = (n, a, b) => `${n} ${n === 1 ? a : b}`;
    const wd = work.length;
    const offRows = off.map((o) => {
      const why = o.name ? (o.we ? `${o.name} – ${o.d.getDay() === 0 ? 'неделя' : 'събота'}` : o.name) : (o.d.getDay() === 0 ? 'Неделя' : 'Събота');
      return `<tr><td data-l="Дата">${BG.fmtFull(o.d)}</td><td data-l="Ден">${BG.WEEKDAYS[o.d.getDay()]}</td><td data-l="Повод">${UI.esc(why)}</td></tr>`;
    }).join('');
    const byMonth = {};
    work.forEach((d) => { const k = d.getFullYear() * 12 + d.getMonth(); (byMonth[k] = byMonth[k] || []).push(d); });
    const workHtml = Object.keys(byMonth).map((k) => {
      const l = byMonth[k], f = l[0];
      return `<div class="wc-mg"><b>${BG.MONTHS[f.getMonth()]} ${f.getFullYear()}</b><div class="wc-ch">${l.map((d) => `<span title="${UI.esc(BG.fmtFull(d))}">${SHORT[d.getDay()]} ${d.getDate()}</span>`).join('')}</div></div>`;
    }).join('');
    res.hidden = false;
    res.innerHTML = `
      <div class="panel wc-sum" role="status">
        <p class="wc-line">От <b>${BG.fmtFull(st.start)}</b> до <b>${BG.fmtFull(st.end)}</b>${st.incl ? '' : ' (без крайната дата)'}:</p>
        <div class="wc-stats">
          <div class="wc-stat work"><b>${wd}</b><span>${wd === 1 ? 'работен ден' : 'работни дни'}</span></div>
          <div class="wc-stat off"><b>${off.length}</b><span>${off.length === 1 ? 'почивен ден' : 'почивни дни'}</span><small>${pl(wk, 'събота/неделя', 'съботи и недели')}${ho ? ` + ${pl(ho, 'официален празник', 'официални празника')}` : ''}</small></div>
          <div class="wc-stat all"><b>${total}</b><span>${total === 1 ? 'календарен ден' : 'календарни дни'}</span></div>
        </div>
      </div>
      <section class="panel"><h2>Почивните дни в периода</h2>
        ${off.length ? `<table class="tbl"><thead><tr><th>Дата</th><th>Ден</th><th>Повод</th></tr></thead><tbody>${offRows}</tbody></table>` : '<p class="muted">В избрания период няма почивни дни.</p>'}</section>
      <section class="panel"><h2>Работните дни в периода</h2>
        ${work.length ? `<details class="wc-det"${work.length <= 45 ? ' open' : ''}><summary>${pl(wd, 'работен ден', 'работни дни')} – покажи/скрий датите</summary>${workHtml}</details>` : '<p class="muted">В избрания период няма работни дни.</p>'}</section>`;
    res.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const faq = [
    ['Как се броят работните дни?', 'Работен ден е всеки ден от понеделник до петък, който не е официален празник. Събота и неделя са почивни дни. Когато официален празник се пада в събота или неделя, почивката се прехвърля в следващите работни дни и те също се броят за почивни.'],
    ['Включва ли се крайната дата?', 'По подразбиране да – броят се първият и последният избран ден. Ако премахнете отметката „Включи крайната дата“, последният ден не се брои.'],
    ['За кои години работи калкулаторът?', `За ${BG.YEARS[0]}–${BG.YEARS[BG.YEARS.length - 1]} г. Използваме официалния списък с почивни дни, Великденските почивни дни и допълнителните почивни дни, обявени с решение на правителството.`],
    ['Какво не се взема предвид?', 'Работни съботи, които правителството може да обяви за компенсиране на мост, и вашият личен график, местни празници или отпуски. За точно изчисление на трудов договор се обърнете към счетоводителя си.'],
  ];

  const main = `<div class="crumbs"><a href="${R.home()}">Начало</a> / Калкулатор на работни дни</div>
    <header class="hero"><h1>Калкулатор на работни дни</h1>
      <p class="answer">Изберете начална и крайна дата в календара и натиснете <b>Изчисли</b>. Ще видите колко са работните и колко почивните дни в периода и кои точно са те – със съботите, неделите и официалните празници в България.</p></header>
    <section class="panel wc" id="wc">
      <div class="wc-sel">
        <div class="wc-box"><small>От дата</small><b id="wc-from"></b></div>
        <div class="wc-box"><small>До дата</small><b id="wc-to"></b></div>
      </div>
      <div class="wc-nav">
        <button type="button" class="btn ghost sm" id="wc-prev" aria-label="Предишен месец">‹ Назад</button>
        <button type="button" class="btn ghost sm" id="wc-today">Днес</button>
        <button type="button" class="btn ghost sm" id="wc-next" aria-label="Следващ месец">Напред ›</button>
      </div>
      <div class="wc-months"></div>
      <div class="wc-legend"><span><i class="sw we"></i>Събота и неделя</span><span><i class="sw ho"></i>Официален празник</span><span><i class="sw sel"></i>Избран период</span></div>
      <label class="wc-incl"><input type="checkbox" id="wc-incl" checked> Включи крайната дата</label>
      <div class="wc-act">
        <button type="button" class="btn" id="wc-go" disabled>Изчисли</button>
        <button type="button" class="btn ghost" id="wc-clear">Изчисти</button>
      </div>
      <div class="wc-quick"><span>Бързо:</span>
        <button type="button" class="btn ghost sm" data-q="month">Този месец</button>
        <button type="button" class="btn ghost sm" data-q="next30">Следващите 30 дни</button>
        <button type="button" class="btn ghost sm" data-q="year">Цялата ${today.getFullYear()} г.</button>
      </div>
    </section>
    <div id="wc-res" class="wc-res" aria-live="polite" hidden></div>
    <section class="panel"><h2>Често задавани въпроси</h2>
      <div class="faq">${faq.map(([q, a]) => `<div><h3>${q}</h3><p>${a}</p></div>`).join('')}</div>
      <p class="muted" style="margin-top:12px">Вижте и <a href="${R.days()}">всички почивни дни ${RT.DEFAULT_YEAR}</a> и <a href="${R.vac()}">ученическите ваканции</a>.</p></section>`;

  UI.mount('calc', { title: 'Калкулатор на работни дни', main, cal: false });

  const root = document.getElementById('wc');
  root.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.classList.contains('wc-d')) return pick(parse(b.dataset.d));
    if (b.id === 'wc-prev') { st.view = new Date(st.view.getFullYear(), st.view.getMonth() - 1, 1); return paint(); }
    if (b.id === 'wc-next') { st.view = new Date(st.view.getFullYear(), st.view.getMonth() + 1, 1); return paint(); }
    if (b.id === 'wc-today') { st.view = new Date(today.getFullYear(), today.getMonth(), 1); return paint(); }
    if (b.id === 'wc-go') return calc();
    if (b.id === 'wc-clear') { st.start = st.end = null; hideResult(); return paint(); }
    if (b.dataset.q === 'month') return setRange(new Date(today.getFullYear(), today.getMonth(), 1), new Date(today.getFullYear(), today.getMonth() + 1, 0));
    if (b.dataset.q === 'next30') return setRange(today, BG.addDays(today, 29));
    if (b.dataset.q === 'year') return setRange(new Date(today.getFullYear(), 0, 1), new Date(today.getFullYear(), 11, 31));
  });
  root.querySelector('#wc-incl').addEventListener('change', (e) => { st.incl = e.target.checked; if (st.start && st.end && !document.getElementById('wc-res').hidden) calc(); });
  paint();
})();
