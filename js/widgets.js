// Повторно използвани части: карти на събития, ленти с дни, месечен календар
(function () {
  const U = UI;
  const TYPE_LABEL = { dayoff: 'Почивен ден', church: 'Църковен празник', name: 'Имен ден', vac: 'Ваканция', noschool: 'Неучебни дни', national: 'Празник', fast: 'Пост' };
  const tag = (t) => `<span class="tag ${t}">${U.ICON[t === 'noschool' ? 'vac' : t === 'dayoff' ? 'dayoff' : t] || ''}${TYPE_LABEL[t]}</span>`;
  const primaryType = (ev) => (ev.types.includes('dayoff') ? 'dayoff' : ev.types.includes('church') ? 'church' : ev.types[0]);

  function eventCard(ev, now) {
    const t = primaryType(ev);
    const diff = Math.round((ev.date - ND.startOfDay(now)) / 864e5);
    const href = ev.id ? `praznik.html?id=${ev.id}` : ev.types.includes('name') ? `imen-den.html?name=${encodeURIComponent((ev.names || [])[0] || '')}` : '';
    const dataGo = ev.id ? `data-go="id=${ev.id}"` : ev.types.includes('name') && ev.names ? `data-go="name=${U.esc(ev.names[0])}"` : '';
    const body = `<div class="dt ${t}"><b>${ev.date.getDate()}</b><small>${BG.MONTHS_GEN[ev.date.getMonth()].slice(0, 3)}</small></div>
      <div class="tx"><strong>${U.esc(ev.title)}</strong><span>${ev.types.map((x) => TYPE_LABEL[x]).join(' · ')} · ${U.daysAway(diff)}</span></div>`;
    return href ? `<a class="evt" href="${href}" ${dataGo}>${body}</a>` : `<div class="evt">${body}</div>`;
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

  const legend = `<div class="legend"><span><i class="sw dayoff"></i>Почивен ден</span><span><i class="sw church"></i>Църковен празник</span><span><i class="sw name"></i>Имен ден</span><span><i class="sw vac"></i>Ваканция</span><span><i class="sw ring"></i>Ваканция и почивен ден (контур)</span></div>`;

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
    const todayK = BG.key(new Date());
    let cells = ['П', 'В', 'С', 'Ч', 'П', 'С', 'Н'].map((w, i) => `<div class="wd${i > 4 ? ' we' : ''}">${w}</div>`).join('');
    for (let i = 0; i < lead; i++) cells += '<div class="blank"></div>';
    for (let d = 1; d <= n; d++) {
      const dt = new Date(y, m, d), k = BG.key(dt), list = byKey[k] || [];
      const off = !!BG.offName(dt), we = BG.isWeekend(dt), vac = !!vacKeys[k] && !we && !off, vr = !!vacKeys[k] && (we || off);
      const dots = [...new Set(list.flatMap((e) => e.types).filter((t) => t === 'church' || t === 'name'))];
      cells += `<button type="button" class="day${off ? ' off' : ''}${we ? ' we' : ''}${vac ? ' vac' : ''}${vr ? ' vr' : ''}${k === todayK ? ' today' : ''}" data-k="${k}" aria-label="${d} ${BG.MONTHS_GEN[m]}"><span class="num">${d}</span><span class="dots">${dots.slice(0, 3).map((t) => `<i class="${t}"></i>`).join('')}</span></button>`;
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
      if (vacKeys[k]) parts.push(`<div class="evt">${tag('vac')}<div class="tx"><strong>${U.esc(vacKeys[k])}</strong></div></div>`);
      det.innerHTML = `<h4>${dt.getDate()} ${BG.MONTHS_GEN[dt.getMonth()]}, ${BG.WEEKDAYS[dt.getDay()]}</h4>${parts.join('') || '<p class="muted">Няма отбелязани събития.</p>'}`;
      el.querySelectorAll('.day').forEach((b) => b.classList.toggle('sel', b.dataset.k === k));
      if (opts.onSelect) opts.onSelect();
    };
    el.querySelectorAll('.day').forEach((b) => b.addEventListener('click', () => show(b.dataset.k)));
    if (opts.noInitial && BG.key(new Date()).slice(0, 7) !== y + '-' + BG.pad(m + 1)) return;
    show(opts.select || (BG.key(new Date()).slice(0, 7) === y + '-' + BG.pad(m + 1) ? todayK : y + '-' + BG.pad(m + 1) + '-01'));
  }

  window.W = { tag, eventCard, strip, bridgeCard, legend, monthCal, TYPE_LABEL, primaryType };
})();
