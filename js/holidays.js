// Официални празници и почивни дни в България (2026–2029) + идеи за отпуски
(function () {
  const MONTHS = ['Януари', 'Февруари', 'Март', 'Април', 'Май', 'Юни', 'Юли', 'Август', 'Септември', 'Октомври', 'Ноември', 'Декември'];
  const MONTHS_GEN = ['януари', 'февруари', 'март', 'април', 'май', 'юни', 'юли', 'август', 'септември', 'октомври', 'ноември', 'декември'];
  const WEEKDAYS = ['неделя', 'понеделник', 'вторник', 'сряда', 'четвъртък', 'петък', 'събота'];

  const pad = (n) => String(n).padStart(2, '0');
  const key = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  const isWeekend = (d) => d.getDay() === 0 || d.getDay() === 6;
  const fmt = (d) => d.getDate() + ' ' + MONTHS_GEN[d.getMonth()];
  const fmtFull = (d) => fmt(d) + ' ' + d.getFullYear();

  // Православен Великден (юлиански алгоритъм на Meeus + 13 дни)
  function easter(y) {
    const a = y % 4, b = y % 7, c = y % 19;
    const d = (19 * c + 15) % 30;
    const e = (2 * a + 4 * b - d + 34) % 7;
    const m = Math.floor((d + e + 114) / 31);
    const day = ((d + e + 114) % 31) + 1;
    return new Date(y, m - 1, day + 13);
  }

  const FIXED = [
    [1, 1, 'Нова година'],
    [3, 3, 'Ден на Освобождението на България'],
    [5, 1, 'Ден на труда'],
    [5, 6, 'Гергьовден, Ден на храбростта'],
    [5, 24, 'Ден на българската просвета и култура'],
    [9, 6, 'Съединението на България'],
    [9, 22, 'Ден на независимостта'],
    [12, 24, 'Бъдни вечер'],
    [12, 25, 'Рождество Христово'],
    [12, 26, 'Рождество Христово (2-ри ден)'],
  ];
  const EXTRA = { 2026: [[0, 2, 'Обявен за почивен ден']] };

  // Ученическите ваканции са в content.js (по графика на МОН); тук е празно, за да не се смесват непроверени данни
  const SCHOOL = {};

  const offCache = {};
  function offFor(y) {
    if (offCache[y]) return offCache[y];
    const off = {}; // key -> {name, kind}
    const e = easter(y);
    const eb = [[-2, 'Велики петък'], [-1, 'Велика събота'], [0, 'Великден'], [1, 'Великденски понеделник']];
    eb.forEach(([n, name]) => { off[key(addDays(e, n))] = { name, kind: 'easter' }; });
    (EXTRA[y] || []).forEach(([m, d, name]) => { off[key(new Date(y, m, d))] = { name, kind: 'official' }; });
    const fixedDates = FIXED.map(([m, d, name]) => ({ date: new Date(y, m - 1, d), name }));
    fixedDates.forEach(({ date, name }) => { off[key(date)] = { name, kind: 'official' }; });
    // Празник в събота/неделя → почивка в следващите работни дни
    fixedDates.forEach(({ date, name }) => {
      if (!isWeekend(date)) return;
      let d = addDays(date, 1);
      while (isWeekend(d) || off[key(d)]) d = addDays(d, 1);
      off[key(d)] = { name: 'Почивен ден (за ' + name.split(',')[0] + ')', kind: 'official' };
    });

    return (offCache[y] = off);
  }

  const cache = {};
  function year(y) {
    if (cache[y]) return cache[y];
    const off = offFor(y);
    const school = {};
    (SCHOOL[y] || []).forEach(([[m1, d1], [m2, d2], name]) => {
      for (let d = new Date(y, m1 - 1, d1), end = new Date(y, m2 - 1, d2); d <= end; d = addDays(d, 1)) {
        if (d.getFullYear() === y) school[key(d)] = name;
      }
    });

    const ideas = bridges(y, off);
    const res = { year: y, easter: easter(y), off, school, ideas, schoolList: SCHOOL[y] || [] };
    return (cache[y] = res);
  }

  // Идеи: 1–4 работни дни между два блока почивка, поне единият с официален празник
  function bridges(y, off) {
    const holidayAny = (d) => !!(d.getFullYear() === y ? off : offFor(d.getFullYear()))[key(d)];
    const offAny = (d) => isWeekend(d) || holidayAny(d);
    const blocks = [];
    let d = new Date(y - 1, 11, 20);
    const end = new Date(y + 1, 0, 10);
    let cur = null;
    for (; d <= end; d = addDays(d, 1)) {
      if (offAny(d)) {
        if (!cur) { cur = { start: d, end: d, holiday: false }; blocks.push(cur); }
        cur.end = d;
        if (holidayAny(d)) cur.holiday = true;
      } else cur = null;
    }
    const days = (a, b) => Math.round((b - a) / 864e5) + 1;
    const ideas = [];
    for (let i = 0; i < blocks.length - 1; i++) {
      const A = blocks[i], B = blocks[i + 1];
      const gap = days(A.end, B.start) - 2;
      if (gap < 1 || gap > 4 || !(A.holiday || B.holiday)) continue;
      if (days(A.start, B.end) < 2.5 * gap) continue;
      const gapDays = [];
      for (let k = 1; k <= gap; k++) gapDays.push(addDays(A.end, k));
      if (!gapDays.some((g) => g.getFullYear() === y)) continue;
      ideas.push({ leave: gapDays, from: A.start, to: B.end, total: days(A.start, B.end) });
    }
    return ideas;
  }

  function nextOfficial(from) {
    for (let y = from.getFullYear(); y <= from.getFullYear() + 1; y++) {
      const ys = year(y);
      const keys = Object.keys(ys.off).sort();
      for (const k of keys) {
        const [yy, mm, dd] = k.split('-').map(Number);
        const date = new Date(yy, mm - 1, dd);
        if (date >= new Date(from.getFullYear(), from.getMonth(), from.getDate()) && !isWeekend(date)) {
          return { date, ...ys.off[k] };
        }
      }
    }
    return null;
  }

  const isOff = (d) => isWeekend(d) || !!year(d.getFullYear()).off[key(d)];
  const offName = (d) => { const o = year(d.getFullYear()).off[key(d)]; return o ? o.name : null; };

  window.BG = { fmtFull, isOff, offName, MONTHS, MONTHS_GEN, WEEKDAYS, pad, key, addDays, isWeekend, fmt, fmtFull, easter, year, nextOfficial, YEARS: [2026, 2027, 2028, 2029] };
})();
