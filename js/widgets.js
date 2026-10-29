// Повторно използвани части: карти на събития, ленти с дни, месечен календар
(function () {
  const U = UI;
  const TYPE_LABEL = { dayoff: 'Почивен ден', church: 'Църковен празник', name: 'Имен ден', vac: 'Ваканция', noschool: 'Неучебни дни', clock: 'Смяна на часа', equinox: 'Равноденствие', national: 'Празник', fast: 'Пост' };
  const tag = (t) => `<span class="tag ${t}">${U.ICON[t === 'noschool' ? 'vac' : t === 'equinox' ? 'sun' : t] || ''}${TYPE_LABEL[t]}</span>`;
  const primaryType = (ev) => (ev.types.includes('dayoff') ? 'dayoff' : ev.types.includes('church') ? 'church' : ev.types[0]);

  function eventCard(ev, now) {
    const t = primaryType(ev);
    const diff = Math.round((ev.date - ND.startOfDay(now)) / 864e5);
    const g = !ev.id && ev.types.includes('name') ? RT.GROUPS.find((x) => x.title === ev.title) : null;
    const href = ev.id ? RT.R.holiday(ev.id) : g ? RT.R.group(g.slug) : '';
    const body = `<div class="dt ${t}"><b>${ev.date.getDate()}</b><small>${BG.MONTHS_GEN[ev.date.getMonth()].slice(0, 3)}</small></div>
      <div class="tx"><strong>${U.esc(ev.title)}</strong><span>${ev.types.map((x) => TYPE_LABEL[x]).join(' · ')} · ${U.daysAway(diff)}</span></div>`;
    return href ? `<a class="evt" href="${href}">${body}</a>` : `<div class="evt">${body}</div>`;
  }

  // лента от дни: from..to, като leaveKeys са дните за отпуск
  function strip(from, to, leaveKeys) {
    let h = '';
    for (let d = from; d <= to; d = BG.addDays(d, 1)) {
      const k = BG.key(d);
      const c = leaveKeys && leaveKeys.has(k) ? 'leave' : BG.offName(d) ? 'off' : BG.isWeekend(d) ? 'we' : '';
      h += `<i class="${c}" title="${BG.fmt(d)}">${d.getDate()}</i>`;
    }
    return `<div class="strip" role="img" aria-label="Дни от ${BG.fmt(from)} до ${BG.fmt(to)}">${h}</div>`;
  }

  function bridgeCard(b) {
    const keys = new Set(b.leave.map(BG.key));
    const lv = b.leave;
    const range = lv.length === 1 ? BG.fmt(lv[0]) : BG.fmt(lv[0]) + ' – ' + BG.fmt(lv[lv.length - 1]);
    return `<article class="bridge"><div class="eq"><b>${U.plural(lv.length, 'ден', 'дни')}</b><span>отпуск = </span><b>${b.total} дни</b><span>почивка</span></div>
      ${strip(b.from, b.to, keys)}
      <p class="muted" style="font-size:.9rem">Вземи отпуск ${range}. Почиваш от ${BG.fmt(b.from)} до ${BG.fmt(b.to)}.</p></article>`;
  }

  const legend = `<div class="legend"><span><i class="sw dayoff"></i>Почивен ден</span><span><i class="sw idea"></i>Ден за отпуск (мост)</span><span><i class="sw ring"></i>Ваканция (контур, върху всеки ден)</span><span><i class="kd church"></i>Църковен празник (точка)</span><span><i class="kd name"></i>Имен ден (точка)</span><span><i class="kd clock"></i>Смяна на часа – лятно/зимно време (празно кръгче)</span><span><i class="kd equinox"></i>Равноденствие (празно кръгче)</span></div>`;

  // Месечен календар с цветове и точки; clickable=true показва подробности
  function monthCal(el, y, m, opts) {
    opts = opts || {};
    const evs = CT.events(y);
    const byKey = {};
    evs.forEach((e) => (byKey[BG.key(e.date)] = byKey[BG.key(e.date)] || []).push(e));
    const vacKeys = {};
    Object.assign(vacKeys, BG.year(y).school);
    CT.VAC.forEach((v) => { for (let d = v.from; d <= v.to; d = BG.addDays(d, 1)) vacKeys[BG.key(d)] = v.name; });
    const first = new Date(y, m, 1), lead = (first.getDay() + 6) % 7, n = new Date(y, m + 1, 0).getDate();
    const ideaKeys = new Set(BG.year(y).ideas.flatMap((i) => i.leave.map(BG.key)));
    const todayK = BG.key(new Date());
    let cells = ['П', 'В', 'С', 'Ч', 'П', 'С', 'Н'].map((w, i) => `<div class="wd${i > 4 ? ' we' : ''}">${w}</div>`).join('');
    for (let i = 0; i < lead; i++) cells += '<div class="blank"></div>';
    for (let d = 1; d <= n; d++) {
      const dt = new Date(y, m, d), k = BG.key(dt), list = byKey[k] || [];
      const off = !!BG.offName(dt), we = BG.isWeekend(dt), vr = !!vacKeys[k], idea = ideaKeys.has(k) && !off && !we;
      const dots = [...new Set(list.flatMap((e) => e.types).filter((t) => t === 'church' || t === 'name' || t === 'clock' || t === 'equinox'))];
      cells += `<button type="button" class="day${off ? ' off' : ''}${we ? ' we' : ''}${vr ? ' vr' : ''}${idea ? ' idea' : ''}${k === todayK ? ' today' : ''}" data-k="${k}" aria-label="${d} ${BG.MONTHS_GEN[m]}"><span class="num">${d}</span><span class="dots">${dots.slice(0, 3).map((t) => `<i class="${t}"></i>`).join('')}</span></button>`;
    }
    el.innerHTML = `<div class="cal">${cells}</div>`;
    if (!opts.clickable) return;
    const det = opts.detail;
    const show = (k) => {
      const dt = new Date(k + 'T00:00:00'); const list = byKey[k] || [];
      const parts = [];
      const o = BG.offName(dt); if (o && !list.some((e) => e.title === o)) parts.push(`<div class="evt">${tag('dayoff')}<div class="tx"><strong>${U.esc(o)}</strong></div></div>`);
      if (BG.isWeekend(dt) && !o) parts.push(`<div class="evt">${tag('dayoff')}<div class="tx"><strong>${BG.WEEKDAYS[dt.getDay()][0].toUpperCase() + BG.WEEKDAYS[dt.getDay()].slice(1)} – почивен ден</strong></div></div>`);
      list.forEach((e) => parts.push(`<div class="evt">${tag(primaryType(e))}<div class="tx"><strong>${U.esc(e.title)}</strong>${e.names ? `<span>${e.names.slice(0, 6).join(', ')}</span>` : ''}</div></div>`));
      if (ideaKeys.has(k) && !BG.offName(dt) && !BG.isWeekend(dt)) parts.push(`<div class="evt"><span class="tag national">${U.ICON.heart}Мост</span><div class="tx"><strong>Ден за отпуск</strong><span>Свързва почивни дни и дава по-дълга почивка</span></div></div>`);
      if (vacKeys[k]) parts.push(`<div class="evt">${tag('vac')}<div class="tx"><strong>${U.esc(vacKeys[k])}</strong></div></div>`);
      det.innerHTML = `<h4>${dt.getDate()} ${BG.MONTHS_GEN[dt.getMonth()]}, ${BG.WEEKDAYS[dt.getDay()]}</h4>${parts.join('') || '<p class="muted">Няма отбелязани събития.</p>'}`;
      el.querySelectorAll('.day').forEach((b) => b.classList.toggle('sel', b.dataset.k === k));
      if (opts.onSelect) opts.onSelect();
    };
    el.querySelectorAll('.day').forEach((b) => b.addEventListener('click', () => show(b.dataset.k)));
    if (opts.noInitial && BG.key(new Date()).slice(0, 7) !== y + '-' + BG.pad(m + 1)) return;
    show(opts.select || (BG.key(new Date()).slice(0, 7) === y + '-' + BG.pad(m + 1) ? todayK : y + '-' + BG.pad(m + 1) + '-01'));
  }

  // Цялостен календар за година. Компактен режим: 3 месеца + бутон за цялата година; рисува се чак при скрол
  const yearCalHtml = (full) => `<section aria-labelledby="cal-h" id="year-cal"><div class="sec-h"><h2 id="cal-h">Календар <span id="cal-year"></span></h2>${legend}</div>
    <div class="cal-head"><button class="ibtn" id="prev" aria-label="Предишна година">${U.ICON.left}</button><span class="muted">Изберете ден за подробности</span><button class="ibtn" id="next" aria-label="Следваща година">${U.ICON.right}</button></div>
    <div class="year-grid" id="year-grid" style="min-height:${full ? 520 : 360}px"></div>
    <div class="cal-more" id="cal-more" hidden><button type="button" class="btn ghost" id="cal-expand">Покажи цялата година</button></div></section>`;
  function initYearCal(year, opts) {
    opts = opts || {};
    const now = new Date();
    const first = BG.YEARS[0], last = BG.YEARS[BG.YEARS.length - 1];
    let y = Math.min(last, Math.max(first, year || now.getFullYear()));
    let compact = !!opts.compact;
    const start = () => { const m = opts.month !== undefined ? opts.month : (y === now.getFullYear() ? now.getMonth() : 0); return Math.min(m, 9); };
    const draw = () => {
      document.getElementById('cal-year').textContent = y;
      const s = start(), months = compact ? [s, s + 1, s + 2] : BG.MONTHS.map((_, i) => i);
      document.getElementById('year-grid').innerHTML = months.map((i) => `<section class="panel month-card${y === now.getFullYear() && i === now.getMonth() ? ' current' : ''}"><h3>${BG.MONTHS[i]}</h3><div id="mc${i}"></div><div class="day-detail" id="md${i}" aria-live="polite"></div></section>`).join('');
      document.getElementById('year-grid').style.minHeight = '';
      months.forEach((i) => monthCal(document.getElementById('mc' + i), y, i, {
        clickable: true, noInitial: true, detail: document.getElementById('md' + i),
        onSelect: () => months.forEach((j) => { if (j !== i) { document.getElementById('md' + j).innerHTML = ''; document.querySelectorAll('#mc' + j + ' .day.sel').forEach((b) => b.classList.remove('sel')); } }),
      }));
      document.getElementById('cal-more').hidden = !compact;
    };
    document.getElementById('prev').onclick = () => { if (y > first) { y--; draw(); } };
    document.getElementById('next').onclick = () => { if (y < last) { y++; draw(); } };
    document.getElementById('cal-expand').onclick = () => { compact = false; draw(); };
    const host = document.getElementById('year-grid');
    if ('IntersectionObserver' in window && !window.__PRERENDER) {
      const io = new IntersectionObserver((e) => { if (e.some((x) => x.isIntersecting)) { io.disconnect(); draw(); } }, { rootMargin: '400px' });
      io.observe(host);
    } else if (!window.__PRERENDER) draw();
  }

  window.W = { yearCalHtml, initYearCal, tag, eventCard, strip, bridgeCard, legend, monthCal, TYPE_LABEL, primaryType };
})();
